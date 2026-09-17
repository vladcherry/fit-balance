/* FitBalance — clickable prototype.
   Everything runs in the browser; nothing is sent anywhere. */

(function () {
  'use strict';

  var KCAL_PER_KG = 7700;
  var STORAGE_KEY = 'fitbalance.prototype.v1';

  /* ---------------- copy ---------------- */

  var COPY = {
    ru: {
      'nav.today': 'Сегодня', 'nav.history': 'История', 'nav.stats': 'Статистика', 'nav.profile': 'Профиль',
      'unit.kcal': 'ккал', 'unit.g': 'г', 'unit.kg': 'кг', 'unit.min': 'мин',
      'a11y.back': 'Назад', 'a11y.less': 'Меньше', 'a11y.more': 'Больше',

      'home.leftToBurn': 'Осталось сжечь', 'home.targetMet': 'Цель дня выполнена',
      'home.eaten': 'Съедено', 'home.burned': 'Сожжено', 'home.maintenance': 'Норма',
      'home.deficitNow': 'Дефицит сейчас', 'home.surplusNow': 'Профицит сейчас',
      'home.days7': '7 дней', 'home.days30': '30 дней',
      'home.feed': 'ЛЕНТА ДНЯ', 'home.all': 'Всё', 'home.snapFood': 'Снять еду',
      'home.targetNote': 'чтобы выйти на дневной дефицит {target} ккал',
      'home.targetDone': 'сверх цели ещё {extra} ккал',
      'home.empty': 'Сегодня пока ничего не записано',

      'photo.eyebrow': 'Распознавание на устройстве', 'photo.cancel': 'Отмена',
      'photo.headline': 'ЭТО ОБЕД НА ≈ 720 ККАЛ?', 'photo.placeholder': '[ФОТО БЛЮДА]',
      'photo.privacy': 'Снимок разбирается прямо на телефоне и никуда не отправляется.',
      'photo.found': 'Что нашлось · можно поправить', 'photo.total': 'Итого',
      'photo.addProduct': 'Добавить продукт', 'photo.save': 'Записать в дневник',
      'photo.saved': 'Обед записан: +720 ккал',
      'food.chicken': 'Курица гриль', 'food.rice': 'Рис отварной', 'food.veg': 'Овощи на пару',

      'act.eyebrow': 'Активность вручную', 'act.title': 'Активность', 'act.headline': 'ЧТО И СКОЛЬКО?',
      'act.type': 'Вид активности', 'act.duration': 'Длительность', 'act.intensity': 'Интенсивность',
      'act.willCount': 'Будет засчитано', 'act.knowBetter': 'Знаете точнее — впишите сами',
      'act.add': 'Добавить в день', 'act.metNote': 'Оценка по MET — это ориентир, а не измерение',
      'act.basis': 'расчёт по весу {weight} кг', 'act.saved': 'Активность записана: −{kcal} ккал',
      'act.walking': 'Ходьба', 'act.running': 'Бег', 'act.gym': 'Зал',
      'act.cycling': 'Велосипед', 'act.swimming': 'Плавание', 'act.chores': 'Дом. дела',
      'act.light': 'Лёгкая', 'act.moderate': 'Средняя', 'act.high': 'Высокая',

      'meal.breakfast': 'Завтрак', 'meal.lunch': 'Обед', 'meal.dinner': 'Ужин', 'meal.snack': 'Перекус',

      'stats.eyebrow': 'FitBalance · 30 дней', 'stats.accumulated': 'накопленный дефицит в жировом эквиваленте',
      'stats.perDay': 'Дефицит по дням · цель 700', 'stats.toNextKg': 'До эквивалента −2,5 кг',
      'stats.remaining': 'ещё {kcal} ккал', 'stats.last30': 'Последние 30 дней',
      'stats.surplus': 'профицит', 'stats.deficit': 'дефицит',
      'stats.week': 'Неделя', 'stats.month': 'Месяц', 'stats.year': 'Год',

      'prof.title': 'ВАШИ НАСТРОЙКИ', 'prof.body': 'Данные тела', 'prof.sex': 'Пол', 'prof.male': 'Мужской',
      'prof.age': 'Возраст', 'prof.ageValue': '34 года', 'prof.height': 'Рост, см', 'prof.weight': 'Вес, кг',
      'prof.goalNorm': 'Цель и норма', 'prof.lose': 'Похудение', 'prof.change': 'Изменить',
      'prof.deficitPerDay': 'Дефицит в день', 'prof.calculated': 'рассчитано',
      'prof.perDayGrams': '≈ {g} г в день',
      'prof.activitySource': 'Откуда берётся активность', 'prof.manual': 'Ввод вручную',
      'prof.manualHint': 'Вид, время, интенсивность — и приложение считает ккал',
      'prof.healthConnect': 'Health Connect', 'prof.healthHint': 'Android, в следующей версии', 'prof.later': 'Позже',
      'prof.language': 'Язык',
      'prof.disclaimer': 'Фото разбираются на устройстве и никуда не уходят. Жировой эквивалент (7 700 ккал = 1 кг) — условный ориентир, а не измерение состава тела.',
      'prof.reset': 'Сбросить день до демо-данных', 'prof.resetDone': 'День сброшен',

      'weekdays': ['чт', 'пт', 'сб', 'вс', 'пн', 'вт', 'ср'],
      'dateLine': 'СР 17.09'
    },
    en: {
      'nav.today': 'Today', 'nav.history': 'History', 'nav.stats': 'Stats', 'nav.profile': 'Profile',
      'unit.kcal': 'kcal', 'unit.g': 'g', 'unit.kg': 'kg', 'unit.min': 'min',
      'a11y.back': 'Back', 'a11y.less': 'Less', 'a11y.more': 'More',

      'home.leftToBurn': 'Left to burn', 'home.targetMet': "Today's target is met",
      'home.eaten': 'Eaten', 'home.burned': 'Burned', 'home.maintenance': 'Maintenance',
      'home.deficitNow': 'Deficit now', 'home.surplusNow': 'Surplus now',
      'home.days7': '7 days', 'home.days30': '30 days',
      'home.feed': 'TODAY’S FEED', 'home.all': 'All', 'home.snapFood': 'Snap a meal',
      'home.targetNote': 'to reach the {target} kcal daily deficit',
      'home.targetDone': '{extra} kcal past the target',
      'home.empty': 'Nothing logged yet today',

      'photo.eyebrow': 'On-device recognition', 'photo.cancel': 'Cancel',
      'photo.headline': 'A ≈ 720 KCAL LUNCH?', 'photo.placeholder': '[MEAL PHOTO]',
      'photo.privacy': 'The picture is analysed on the phone and never leaves it.',
      'photo.found': 'What was found · editable', 'photo.total': 'Total',
      'photo.addProduct': 'Add an item', 'photo.save': 'Save to diary',
      'photo.saved': 'Lunch saved: +720 kcal',
      'food.chicken': 'Grilled chicken', 'food.rice': 'Boiled rice', 'food.veg': 'Steamed vegetables',

      'act.eyebrow': 'Manual activity', 'act.title': 'Activity', 'act.headline': 'WHAT AND HOW LONG?',
      'act.type': 'Activity type', 'act.duration': 'Duration', 'act.intensity': 'Intensity',
      'act.willCount': 'Will be counted', 'act.knowBetter': 'Know it better — type it in',
      'act.add': 'Add to the day', 'act.metNote': 'A MET estimate is a guide, not a measurement',
      'act.basis': 'based on {weight} kg body weight', 'act.saved': 'Activity saved: −{kcal} kcal',
      'act.walking': 'Walking', 'act.running': 'Running', 'act.gym': 'Gym',
      'act.cycling': 'Cycling', 'act.swimming': 'Swimming', 'act.chores': 'Housework',
      'act.light': 'Light', 'act.moderate': 'Moderate', 'act.high': 'High',

      'meal.breakfast': 'Breakfast', 'meal.lunch': 'Lunch', 'meal.dinner': 'Dinner', 'meal.snack': 'Snack',

      'stats.eyebrow': 'FitBalance · 30 days', 'stats.accumulated': 'accumulated deficit as fat equivalent',
      'stats.perDay': 'Deficit per day · target 700', 'stats.toNextKg': 'To −2.5 kg equivalent',
      'stats.remaining': '{kcal} kcal to go', 'stats.last30': 'Last 30 days',
      'stats.surplus': 'surplus', 'stats.deficit': 'deficit',
      'stats.week': 'Week', 'stats.month': 'Month', 'stats.year': 'Year',

      'prof.title': 'YOUR SETTINGS', 'prof.body': 'Body data', 'prof.sex': 'Sex', 'prof.male': 'Male',
      'prof.age': 'Age', 'prof.ageValue': '34 years', 'prof.height': 'Height, cm', 'prof.weight': 'Weight, kg',
      'prof.goalNorm': 'Goal and requirement', 'prof.lose': 'Lose weight', 'prof.change': 'Change',
      'prof.deficitPerDay': 'Daily deficit', 'prof.calculated': 'calculated',
      'prof.perDayGrams': '≈ {g} g per day',
      'prof.activitySource': 'Where activity comes from', 'prof.manual': 'Manual entry',
      'prof.manualHint': 'Type, duration, intensity — the app does the calories',
      'prof.healthConnect': 'Health Connect', 'prof.healthHint': 'Android, next release', 'prof.later': 'Later',
      'prof.language': 'Language',
      'prof.disclaimer': 'Photos are analysed on the device and never leave it. The fat equivalent (7,700 kcal = 1 kg) is a conventional figure, not a body-composition measurement.',
      'prof.reset': 'Reset the day to demo data', 'prof.resetDone': 'Day reset',

      'weekdays': ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
      'dateLine': 'WED 17.09'
    }
  };

  /* ---------------- domain ---------------- */

  var MET = { walking: 3.8, running: 9.8, gym: 5.0, cycling: 7.5, swimming: 7.0, chores: 3.3 };
  var INTENSITY = { light: 0.8, moderate: 1.0, high: 1.3 };
  var ACTIVITY_TYPES = ['walking', 'running', 'gym', 'cycling', 'swimming', 'chores'];
  var DURATION_PRESETS = [15, 30, 45, 60, 90];
  var WEEK = [-950, -720, 260, -640, -1100, -1120, -970];

  function seedEntries() {
    return [
      { time: '08:30', kind: 'food', key: 'meal.breakfast', kcal: 450 },
      { time: '11:40', kind: 'activity', key: 'act.walking', kcal: 310 },
      { time: '13:10', kind: 'food', key: 'meal.lunch', kcal: 720 },
      { time: '16:20', kind: 'food', key: 'meal.snack', kcal: 280 },
      { time: '19:30', kind: 'activity', key: 'act.chores', kcal: 140 },
      { time: '20:40', kind: 'food', key: 'meal.dinner', kcal: 900 }
    ];
  }

  var state = {
    lang: 'ru',
    weight: 84.5,
    maintenance: 2200,
    target: 700,
    entries: seedEntries(),
    draft: { type: 'walking', minutes: 45, intensity: 'moderate', manual: '' }
  };

  function totals() {
    var eaten = 0, burned = 0;
    state.entries.forEach(function (e) {
      if (e.kind === 'food') { eaten += e.kcal; } else { burned += e.kcal; }
    });
    var deficit = state.maintenance + burned - eaten;
    return {
      eaten: eaten,
      burned: burned,
      deficit: deficit,
      leftToBurn: Math.max(0, state.target - deficit),
      grams: Math.round(Math.abs(deficit) / KCAL_PER_KG * 1000)
    };
  }

  function estimateKcal() {
    var manual = parseInt(state.draft.manual, 10);
    if (!isNaN(manual) && manual > 0) { return manual; }
    var met = MET[state.draft.type] * INTENSITY[state.draft.intensity];
    return Math.round(met * state.weight * (state.draft.minutes / 60));
  }

  /* ---------------- storage ---------------- */

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { return; }
      var saved = JSON.parse(raw);
      if (saved && Array.isArray(saved.entries)) {
        Object.keys(state).forEach(function (k) {
          if (saved[k] !== undefined) { state[k] = saved[k]; }
        });
      }
    } catch (err) { /* corrupt or blocked — keep defaults */ }
  }

  /* ---------------- helpers ---------------- */

  function t(key, vars) {
    var s = COPY[state.lang][key];
    if (s === undefined) { return key; }
    if (vars) {
      Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    }
    return s;
  }

  function num(n) {
    return new Intl.NumberFormat(state.lang === 'ru' ? 'ru-RU' : 'en-US').format(n);
  }

  function el(id) { return document.getElementById(id); }

  function button(label, pressed, onClick, className) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = className || '';
    b.textContent = label;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    b.addEventListener('click', onClick);
    return b;
  }

  var toastTimer = null;
  function toast(message) {
    var node = el('toast');
    node.textContent = message;
    node.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { node.classList.remove('is-on'); }, 2400);
  }

  /* ---------------- rendering ---------------- */

  function renderStaticCopy() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t(node.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (node) {
      node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria')));
    });
    el('today-date').textContent = t('dateLine');
    el('p-age').textContent = t('prof.ageValue');
  }

  function renderHome() {
    var s = totals();
    var met = s.deficit >= state.target;

    el('left-to-burn').textContent = met ? num(s.deficit) : num(s.leftToBurn);
    el('home-metric').textContent = met ? t('home.targetMet') : t('home.leftToBurn');
    el('target-note').textContent = met
      ? t('home.targetDone', { extra: num(s.deficit - state.target) })
      : t('home.targetNote', { target: num(state.target) });

    var pct = Math.max(0, Math.min(100, Math.round(s.deficit / state.target * 100)));
    el('target-bar').style.width = pct + '%';

    el('m-eaten').textContent = num(s.eaten);
    el('m-burned').textContent = num(s.burned);
    el('m-norm').textContent = num(state.maintenance);

    document.querySelector('[data-i18n="home.deficitNow"]').textContent =
      s.deficit >= 0 ? t('home.deficitNow') : t('home.surplusNow');
    el('deficit-kcal').textContent = num(Math.abs(s.deficit));
    el('deficit-grams').textContent = t('unit.kcal') + ' · ≈ ' + num(s.grams) + ' ' + t('unit.g');

    var feed = el('feed');
    feed.innerHTML = '';
    if (!state.entries.length) {
      feed.innerHTML = '<div class="feed__empty">' + t('home.empty') + '</div>';
      return;
    }
    state.entries.slice().reverse().forEach(function (e) {
      var row = document.createElement('div');
      row.className = 'feed__row';
      var burn = e.kind === 'activity';
      row.innerHTML =
        '<div class="feed__time"></div>' +
        '<div class="feed__name"></div>' +
        '<div class="feed__kcal' + (burn ? ' is-burn' : '') + '"></div>';
      row.children[0].textContent = e.time;
      row.children[1].textContent = t(e.key);
      row.children[2].textContent = (burn ? '−' : '+') + num(e.kcal);
      feed.appendChild(row);
    });
  }

  function renderActivity() {
    var types = el('act-types');
    types.innerHTML = '';
    ACTIVITY_TYPES.forEach(function (key) {
      types.appendChild(button(t('act.' + key), state.draft.type === key, function () {
        state.draft.type = key;
        state.draft.manual = '';
        el('act-manual').value = '';
        renderActivity();
        save();
      }, 'chip'));
    });

    var presets = el('dur-presets');
    presets.innerHTML = '';
    DURATION_PRESETS.forEach(function (m) {
      presets.appendChild(button(String(m), state.draft.minutes === m, function () {
        state.draft.minutes = m;
        renderActivity();
        save();
      }));
    });

    var seg = el('act-intensity');
    seg.innerHTML = '';
    ['light', 'moderate', 'high'].forEach(function (key) {
      seg.appendChild(button(t('act.' + key), state.draft.intensity === key, function () {
        state.draft.intensity = key;
        renderActivity();
        save();
      }));
    });

    el('dur-value').textContent = state.draft.minutes;
    el('act-kcal').textContent = num(estimateKcal());
    el('act-basis').textContent = t('act.basis', { weight: num(state.weight) });
  }

  function renderStats() {
    var seg = el('stats-period');
    if (!seg.children.length) {
      ['week', 'month', 'year'].forEach(function (key, i) {
        seg.appendChild(button(t('stats.' + key), i === 0, function () {
          Array.prototype.forEach.call(seg.children, function (b, j) {
            b.setAttribute('aria-pressed', i === j ? 'true' : 'false');
          });
        }));
      });
    } else {
      ['week', 'month', 'year'].forEach(function (key, i) {
        seg.children[i].textContent = t('stats.' + key);
      });
    }

    var peak = 1200;
    var pos = el('chart-pos'), neg = el('chart-neg'), days = el('chart-days');
    pos.innerHTML = ''; neg.innerHTML = ''; days.innerHTML = '';
    WEEK.forEach(function (value, i) {
      var isToday = i === WEEK.length - 1;
      var up = document.createElement('div');
      up.className = 'chart__col';
      var down = document.createElement('div');
      down.className = 'chart__col';
      var bar = document.createElement('div');
      bar.className = 'chart__bar';
      if (value > 0) {
        bar.classList.add('is-surplus');
        bar.style.height = Math.min(26, Math.round(value / peak * 86)) + 'px';
        bar.style.borderRadius = '4px 4px 0 0';
        up.appendChild(bar);
      } else {
        if (isToday) { bar.classList.add('is-today'); }
        bar.style.height = Math.round(-value / peak * 86) + 'px';
        bar.style.borderRadius = '0 0 4px 4px';
        down.appendChild(bar);
      }
      pos.appendChild(up);
      neg.appendChild(down);

      var day = document.createElement('div');
      day.className = 'chart__day' + (isToday ? ' is-today' : '');
      day.textContent = COPY[state.lang].weekdays[i];
      days.appendChild(day);
    });

    el('stats-remaining').textContent = t('stats.remaining', { kcal: num(770) });

    var strip = el('strip');
    if (!strip.children.length) {
      var levels = [3, 2, 1, 3, 0, 2, 3, 3, 1, 2, 3, 0, 2, 3, 3, 2, 1, 3, 2, 3, 0, 2, 3, 1, 3, 3, 2, 3, 3, 3];
      var fills = ['#17120f', '#f6d9d8', '#e8807f', '#d8161d'];
      levels.forEach(function (lv) {
        var cell = document.createElement('div');
        cell.style.background = fills[lv];
        strip.appendChild(cell);
      });
    }
  }

  function renderProfile() {
    el('p-target').textContent = num(state.target);
    el('p-norm').textContent = num(state.maintenance);
    el('p-target-g').textContent = t('prof.perDayGrams', {
      g: num(Math.round(state.target / KCAL_PER_KG * 1000))
    });
    el('p-weight').value = state.weight;
    Array.prototype.forEach.call(el('lang-switch').children, function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === state.lang ? 'true' : 'false');
    });
  }

  function renderAll() {
    renderStaticCopy();
    renderHome();
    renderActivity();
    renderStats();
    renderProfile();
  }

  /* ---------------- navigation ---------------- */

  var MODALS = { photo: true, activity: true };

  function go(name) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.toggle('is-active', s.id === 'screen-' + name);
    });
    el('tabbar').classList.toggle('is-hidden', !!MODALS[name]);
    Array.prototype.forEach.call(el('tabbar').children, function (b) {
      if (b.getAttribute('data-go') === name) {
        b.setAttribute('aria-current', 'page');
      } else {
        b.removeAttribute('aria-current');
      }
    });
    var screen = el('screen-' + name);
    if (screen) { screen.scrollTop = 0; }
    if (location.hash !== '#' + name) { history.replaceState(null, '', '#' + name); }
  }

  function nowLabel() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  /* ---------------- wiring ---------------- */

  function wire() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-go]');
      if (target) { go(target.getAttribute('data-go')); }
    });

    el('dur-minus').addEventListener('click', function () {
      state.draft.minutes = Math.max(5, state.draft.minutes - 5);
      renderActivity();
      save();
    });
    el('dur-plus').addEventListener('click', function () {
      state.draft.minutes = Math.min(300, state.draft.minutes + 5);
      renderActivity();
      save();
    });
    el('act-manual').addEventListener('input', function () {
      state.draft.manual = this.value;
      el('act-kcal').textContent = num(estimateKcal());
    });

    el('save-activity').addEventListener('click', function () {
      var kcal = estimateKcal();
      state.entries.push({
        time: nowLabel(), kind: 'activity', key: 'act.' + state.draft.type, kcal: kcal
      });
      state.draft.manual = '';
      el('act-manual').value = '';
      save();
      renderHome();
      go('home');
      toast(t('act.saved', { kcal: num(kcal) }));
    });

    el('save-meal').addEventListener('click', function () {
      state.entries.push({ time: nowLabel(), kind: 'food', key: 'meal.lunch', kcal: 720 });
      save();
      renderHome();
      go('home');
      toast(t('photo.saved'));
    });

    el('p-weight').addEventListener('change', function () {
      var w = parseFloat(String(this.value).replace(',', '.'));
      if (!isNaN(w) && w > 20 && w < 400) {
        state.weight = Math.round(w * 10) / 10;
        save();
        renderActivity();
      }
      this.value = state.weight;
    });

    el('lang-switch').addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]');
      if (!b) { return; }
      state.lang = b.getAttribute('data-lang');
      save();
      renderAll();
    });

    var reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'btn btn--quiet';
    reset.style.margin = '0 22px';
    reset.setAttribute('data-i18n', 'prof.reset');
    reset.addEventListener('click', function () {
      state.entries = seedEntries();
      save();
      renderHome();
      toast(t('prof.resetDone'));
    });
    var disclaimer = document.querySelector('#screen-profile .disclaimer');
    disclaimer.parentNode.insertBefore(reset, disclaimer);
  }

  /* ---------------- start ---------------- */

  load();
  wire();
  renderAll();
  var initial = (location.hash || '#home').slice(1);
  go(document.getElementById('screen-' + initial) ? initial : 'home');

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () { /* offline support is optional */ });
    });
  }
}());
