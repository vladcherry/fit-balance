# On-device food recognition — how it works

Decision: the photo is analysed on the phone and never leaves it. This document explains what
that actually involves, what it costs, and the one consequence that reaches back into other
decisions.

## What is wired up today

The prototype runs **MobileNet V2 (ImageNet-1k) on TensorFlow.js**, with the runtime
(`prototype/vendor/tf.min.js`) and the weights (`prototype/model/mobilenet-v2/`) served from the
app's own origin. Recognition lives in one file, `prototype/recognise.js`.

```
<img> (object URL) -> resize 224x224 -> /255 -> MobileNet V2 -> softmax -> food classes -> draft
```

What that means in practice:

| | |
| --- | --- |
| Classes | ~40 edible ones out of ImageNet's 1000 — fast food, baked goods, fruit, vegetables |
| Download | ~15 MB once (1.5 MB runtime + 14 MB weights), on first use of the photo screen |
| Inference | a few hundred ms with WebGL; low seconds on the CPU fallback |
| Portion | a typical serving per food, in grams, which the user corrects |
| Items | one dish per picture — there is no detection step |

Steps 3 (detect) and 5 (estimate the portion) of the pipeline below are **not** implemented. A
picture of a plate is classified as a whole, and the weight is a prior, not a measurement.

The honest boundary: a burger, a pizza, a banana or a bowl of broccoli lands well. A home-cooked
plate of chicken with rice has no matching class, and the app says so instead of guessing — the
top class has to clear a confidence floor, weaker food classes are offered as one-tap
alternatives, and anything else routes to manual entry. The photo screen states the ~40-category
limit on screen rather than letting the user discover it.

Replacing the model means editing the class table and the model URL in `recognise.js`. Nothing
else in the app knows which model is in use.

## The pipeline

Nothing here touches the network after the model is downloaded once.

```
camera → canvas → preprocess → detect → classify → estimate portion → nutrition lookup → editable draft
                                    (all of this runs in the browser)
```

**1. Capture.** `<input type="file" capture="environment">` or `getUserMedia` hands back a
`Blob`. It is decoded to an `ImageBitmap` and drawn to a canvas. The bytes stay in the page; no
upload, no temporary file on a server.

**2. Preprocess.** Downscale to the model's input size (typically 224×224 or 384×384), convert to
a normalised float tensor. Cheap — a few milliseconds.

**3. Detect.** A small detector or segmentation head finds the food regions on the plate, so that
"chicken, rice, vegetables" are three items rather than one blob. This is what separates a usable
result from a single guess about the whole picture.

**4. Classify.** Each region goes through an image classifier — a MobileNetV3 or EfficientNet-Lite
class model fine-tuned on a food taxonomy (Food-101 is the common public starting point at 101
classes; a product taxonomy needs its own labelled data).

**5. Estimate the portion.** The weakest link, on-device and in the cloud alike. Without depth
information the options are:

- **mask area × density prior** — how much of the plate the item covers, times a per-food
  density assumption;
- **reference object** — the plate rim, a fork or a coin gives a scale;
- **true depth** — a phone's depth sensor or LiDAR gives volume directly, but is reachable only
  from a native app, not from a web page.

**6. Nutrition lookup.** A local table maps dish → kcal and macros per 100 g, multiplied by the
estimated grams. The table ships with the app and lives in IndexedDB, so this step is a lookup,
not a request.

**7. Output.** A draft the user edits. See the accuracy section — this is not optional.

## What runs the model in a browser

| Runtime | Notes |
| --- | --- |
| ONNX Runtime Web | Broad operator coverage, WebGPU / WASM+SIMD backends |
| TensorFlow.js | Mature, good tooling, WebGL / WebGPU / WASM backends |
| WebNN | Newest path; can reach the NPU where the OS exposes one. Support is still uneven |

Practical backend order: **WebGPU** where available, **WASM + SIMD + threads** as the fallback.
WebGL still works but is being displaced by WebGPU.

## What it costs

**Download size.** A quantized (int8) classifier is roughly 5–15 MB. Adding detection or
segmentation puts the bundle in the 20–50 MB range. This must be fetched on demand — the first
time the user opens the photo screen, not on first paint — and cached in the Cache API or
IndexedDB so it is a one-time cost.

**Latency.** Rough expectations on a mid-range phone: WebGPU in the low hundreds of
milliseconds; the WASM fallback 1–3 seconds. Slower than a network round trip is unlikely, but
the first run also pays model load and warm-up.

**Memory.** Older devices, and iOS Safari in particular, have tight per-tab memory budgets. The
model has to be released when the photo screen closes.

**Accuracy.** Lower than a large cloud model. A fixed taxonomy does not cover regional or
home-cooked dishes it was never trained on, and portion estimation stays approximate. This is the
price paid for the privacy guarantee, and it is a real price.

## Two ways to do it

### A. Browser ML — keeps the project a pure PWA

ONNX Runtime Web or TensorFlow.js, a quantized model, a bundled nutrition table. Works offline
after the first download. Nothing ever leaves the device, so the privacy claim is literally true
and needs no legal footnote.

The cost is accuracy: a compact model on a phone will not match a frontier cloud model at
identifying an unusual dish or judging a portion.

### B. Native wrapper with a vendor SDK

Passio's Nutrition-AI SDK offers on-device recognition backed by a 2.5M-item database, with
portion estimation as a first-class feature. Better results than anything that fits in a browser
bundle today.

**This is the consequence that reaches back into other decisions.** Using it requires wrapping the
app natively (Capacitor or similar), which contradicts the reasoning behind
[decision 3](decisions.md#3-activity-is-entered-manually) — activity was made manual precisely to
avoid a native build. If a native wrapper is on the table anyway, then Health Connect and Apple
Health become reachable, and manual-only activity entry should be reconsidered.

So the choice is not "which recognition library" but **"is this a web app or a native app"**.
Everything else follows from that.

### Hybrid, if accuracy proves insufficient — this is what shipped

On-device by default, with an explicit per-photo action — "get a better estimate" — that sends
*that* picture to a cloud model. The user opts in each time, so the default guarantee holds and
the escape hatch exists. It does mean shipping two code paths.

This is now implemented in `prototype/cloud.js`:

- **Opt-in twice.** Nothing happens without an API key in the profile, and then nothing happens
  without a press on "Ask the cloud", per photo. There is no automatic fallback when the
  on-device model is unsure — that would make the guarantee a lie in exactly the cases that
  matter most.
- **One shape of request.** `POST /chat/completions` with a text part and an `image_url` part,
  which is what DeepSeek, OpenAI and Gemini's compatibility endpoint all accept. The endpoint and
  the model are settings, so the provider is a field, not a rewrite.
- **The picture is downscaled to 768 px** and re-encoded as JPEG before it is sent: a plate is
  legible at that size, the upload is a few hundred kilobytes instead of several megabytes, and
  the EXIF block does not travel.
- **The reply is mined, not trusted.** Models wrap JSON in prose or a fence, so the parser digs
  the object out; then every item must have a name, a weight between 1 g and 5 kg and a density
  between 0 and 900 kcal/100 g, or it is dropped. A reply with nothing usable in it leaves the
  on-device result alone rather than clearing it.
- **Failures say what happened.** A refused key names the status, a model that cannot see
  reports the provider's own message, and a request the browser could not make says so and
  mentions CORS, since a static page has no way around it.
- **Developer mode shows the exchange.** Turned on in the profile, a collapsed panel under the
  photo carries the status, the round-trip time, the size of the image as sent, token usage,
  `finish_reason`, the number of items that passed validation, and the model's raw text. Since
  the parser deliberately drops anything malformed, this is the only place that shows the
  difference between "the model said nothing useful" and "the model said something we rejected".
- **Presets for DeepSeek and Gemini**, with keys stored per provider host so switching between
  them does not overwrite one with the other. Providers retire model names, and the 404 that
  follows names the replacement, so a saved setting pointing at a retired name is moved to its
  successor on load instead of failing on every press.

Two caveats that belong to this shape and not to a bug:

1. **The key is in localStorage**, so it is as safe as the device and the origin. That is
   acceptable for a personal prototype and not acceptable for a released product with other
   people's keys — a release wants a proxy that holds the key server-side.
2. **The provider has to allow browser calls.** A service that sends no CORS headers cannot be
   called from a page at all, whatever the key says.

## Where this leaves the accuracy problem

Nothing about on-device changes the fundamentals from
[food-recognition-api.md](food-recognition-api.md): dish identification lands in the 68–86% range
for the field as a whole, and portion estimation is worse. On-device sits at the lower end of
that.

The product answer is unchanged and now matters more:

- every value is editable before it is written to the diary;
- every number is rendered with `≈`;
- the confidence of the estimate is visible;
- manual entry is a first-class path, not a fallback for failures.
