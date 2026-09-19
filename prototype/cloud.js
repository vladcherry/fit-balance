/* FitBalance — the second opinion: cloud food recognition.

   The on-device model in recognise.js answers every photo. This module answers
   only when the user asks for it, per photo, by pressing a button — because it
   does the one thing the rest of the app promises not to do: it sends the
   picture to somebody else's server.

   The call is OpenAI-shaped (`POST /chat/completions` with an `image_url` part),
   which is what DeepSeek, OpenAI, Gemini's compatibility endpoint and most
   others speak. Endpoint and model are settings, so switching provider is a
   matter of typing a different URL in the profile.

   The key lives in this browser's localStorage and nowhere else. It is never
   committed, and the app never sends it anywhere except the endpoint the user
   configured. */

window.CloudRecognition = (function () {
  'use strict';

  /* Presets for the providers this app is pointed at most often. All three
     speak the same OpenAI-shaped request, so a preset is nothing but a pair of
     defaults the user can still edit. */
  var PROVIDERS = [
    {
      id: 'deepseek',
      label: 'DeepSeek',
      endpoint: 'https://api.deepseek.com/chat/completions',
      model: 'deepseek-flash'
    },
    {
      id: 'gemini',
      label: 'Gemini',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      model: 'gemini-3.6-flash'
    }
  ];

  /* Model names a provider has retired. A saved setting pointing at one of
     these is moved to its replacement, because the request would otherwise
     fail with a 404 nobody could act on from inside the app. */
  var RETIRED_MODELS = { 'gemini-2.5-flash': 'gemini-3.6-flash' };

  var DEFAULTS = { endpoint: PROVIDERS[0].endpoint, model: PROVIDERS[0].model };

  /* Long side of the picture as sent. A plate is perfectly legible at this
     size, and it keeps the upload to a few hundred kilobytes rather than the
     several megabytes a phone camera produces. */
  var MAX_SIDE = 768;
  var JPEG_QUALITY = 0.82;
  var TIMEOUT_MS = 45000;

  var PROMPT_RU = 'Ты помогаешь считать калории по фотографии еды. ' +
    'Определи блюда на снимке и оцени порции. Ответь ТОЛЬКО JSON без пояснений, в формате: ' +
    '{"items":[{"name":"название блюда","grams":250,"kcal_per_100g":150}]}. ' +
    'Названия — по-русски, коротко. Если еды на снимке нет, верни {"items":[]}.';

  var PROMPT_EN = 'You help count calories from a photo of food. ' +
    'Identify the dishes in the picture and estimate the portions. Reply with JSON ONLY, ' +
    'no commentary, in this shape: ' +
    '{"items":[{"name":"dish name","grams":250,"kcal_per_100g":150}]}. ' +
    'Keep the names short. If there is no food in the picture, return {"items":[]}.';

  /* Each provider needs its own key, so keys are stored per host: switching
     between DeepSeek and Gemini must not make one overwrite the other. */
  function hostOf(endpoint) {
    try { return new URL(endpoint).host.toLowerCase(); } catch (err) { return ''; }
  }

  function settings(stored) {
    stored = stored || {};
    var endpoint = (stored.endpoint || DEFAULTS.endpoint).trim();
    var host = hostOf(endpoint);
    var keys = stored.keys || {};
    // `stored.key` is the single-key shape this used to have.
    var key = (host && keys[host]) || stored.key || '';
    return {
      endpoint: endpoint,
      model: (stored.model || DEFAULTS.model).trim(),
      key: String(key).trim(),
      host: host
    };
  }

  function providerOf(endpoint) {
    var host = hostOf(endpoint);
    for (var i = 0; i < PROVIDERS.length; i += 1) {
      if (hostOf(PROVIDERS[i].endpoint) === host) { return PROVIDERS[i]; }
    }
    return null;
  }

  /* The picture is redrawn small before it is sent: less to upload, less to
     pay for, and no EXIF payload riding along. */
  function toDataUrl(source) {
    var width = source.naturalWidth || source.width;
    var height = source.naturalHeight || source.height;
    var scale = Math.min(1, MAX_SIDE / Math.max(width, height));
    var canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  }

  /* Models wrap JSON in prose or in a ``` fence often enough that the reply has
     to be mined rather than parsed. */
  function extractJson(text) {
    if (!text) { return null; }
    var fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    var candidate = fenced ? fenced[1] : text;
    var start = candidate.indexOf('{');
    var end = candidate.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) { return null; }
    try {
      return JSON.parse(candidate.slice(start, end + 1));
    } catch (err) {
      return null;
    }
  }

  function toNumber(value, min, max) {
    var n = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (typeof n !== 'number' || isNaN(n) || n < min || n > max) { return null; }
    return n;
  }

  /* Whatever the model replies, only well-formed items reach the diary: a name,
     a believable weight and a believable energy density. */
  function readItems(payload) {
    var list = payload && (payload.items || payload.dishes || payload.foods);
    if (!Array.isArray(list)) { return []; }
    return list.map(function (raw) {
      if (!raw || typeof raw !== 'object') { return null; }
      var name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 60) : '';
      var grams = toNumber(raw.grams != null ? raw.grams : raw.weight_g, 1, 5000);
      var per100 = toNumber(
        raw.kcal_per_100g != null ? raw.kcal_per_100g : raw.calories_per_100g, 0, 900
      );
      if (!name || grams === null || per100 === null) { return null; }
      return {
        name: name,
        grams: Math.round(grams),
        per100: Math.round(per100),
        kcal: Math.round(grams * per100 / 100)
      };
    }).filter(Boolean).slice(0, 8);
  }

  function describeFailure(response, body) {
    var detail = body && body.error && (body.error.message || body.error.type);
    if (!detail && body && typeof body.message === 'string') { detail = body.message; }
    return {
      status: response.status,
      message: detail || ('HTTP ' + response.status)
    };
  }

  /* Sends one picture and resolves with { items, model }. Rejects with an error
     carrying `status` and `message` so the screen can say what actually went
     wrong: a bad key, an exhausted balance, a model that cannot see. */
  function analyse(source, options) {
    options = options || {};
    var config = settings(options.settings);
    if (!config.key) {
      return Promise.reject({ code: 'no-key', message: 'no API key configured' });
    }

    var payload = {
      model: config.model,
      temperature: 0.2,
      max_tokens: 700,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: options.lang === 'en' ? PROMPT_EN : PROMPT_RU },
          { type: 'image_url', image_url: { url: toDataUrl(source) } }
        ]
      }]
    };

    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (controller) { controller.abort(); }
    }, TIMEOUT_MS);

    /* Everything the developer panel shows. It is filled as the call proceeds,
       so it is complete whether the call succeeds or fails. */
    var startedAt = Date.now();
    var debug = {
      endpoint: config.endpoint,
      model: config.model,
      imageKb: Math.round(payload.messages[0].content[1].image_url.url.length / 1024),
      status: null,
      ms: null,
      usage: null,
      finish: null,
      raw: null,
      error: null
    };

    return fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + config.key
      },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      return response.text().then(function (text) {
        var body = null;
        try { body = JSON.parse(text); } catch (err) { /* not JSON */ }
        debug.status = response.status;
        debug.ms = Date.now() - startedAt;
        debug.raw = text;
        if (body && body.usage) { debug.usage = body.usage; }
        if (body && body.choices && body.choices[0]) {
          debug.finish = body.choices[0].finish_reason || null;
        }
        if (!response.ok) { throw describeFailure(response, body); }
        var content = body && body.choices && body.choices[0] &&
          body.choices[0].message && body.choices[0].message.content;
        if (typeof content !== 'string') {
          throw { code: 'bad-reply', message: 'unexpected reply shape' };
        }
        debug.raw = content;                   // the model's own words, not the envelope
        var items = readItems(extractJson(content));
        return { items: items, model: config.model, debug: debug };
      });
    })['catch'](function (err) {
      debug.ms = debug.ms === null ? Date.now() - startedAt : debug.ms;
      /* A browser blocked by CORS reports a bare TypeError with no status, which
         is indistinguishable from being offline - say both. */
      var failure = err && (err.status || err.code) ? err : {
        code: err && err.name === 'AbortError' ? 'timeout' : 'network',
        message: err && err.message ? err.message : 'network error'
      };
      debug.error = failure.message || failure.code;
      failure.debug = debug;
      throw failure;
    })['finally'](function () {
      clearTimeout(timer);
    });
  }

  return {
    analyse: analyse,
    settings: settings,
    providers: function () { return PROVIDERS.slice(); },
    replacementFor: function (model) { return RETIRED_MODELS[model] || null; },
    providerOf: providerOf,
    hostOf: hostOf,
    defaults: function () { return { endpoint: DEFAULTS.endpoint, model: DEFAULTS.model }; }
  };
})();
