# Decision log

Decisions that are expensive to reverse, with the reasoning behind them. Newest section at the
bottom. All decisions below were taken on 2026-09-17.

---

## 1. The product is called FitBalance

**Decision.** The app is named FitBalance. The repository is `vladcherry/fit-balance`.

**Context.** Two rounds of naming were considered — one descriptive (Netto, Saldo, Delta, Zapas,
Gramm, Ostatok, Kalorit, Thermo, Ratio, Tonus), one metaphorical (Plusminus `±`, Drop, Kalibri,
Joule, Iskra, Metronome, Mera, Depot, Azimuth, 7700).

**Consequences.** The name is descriptive and reads the same in Russian and English, which suits
a bilingual release. It is also a common word combination, so trademark protection is weak and
app-store collisions are likely. If the stores turn out to be crowded, the cleanest fallbacks
from the shortlist are Kalibri, Depot and 7700.

---

## 2. Design direction: the bold concept, with the headline changed

**Decision.** Ship concept B — red as the primary surface, a large display face for numbers, a
dark card for the fat equivalent. The headline number is **calories left to burn**; total intake
sits next to it in small type.

**Context.** Three directions were mocked up: A "Ring" (white, calm, red as accent only),
B "Poster" (red hero, large figures), C "Console" (dark dashboard, monospaced numbers).
A and C are kept on the canvas for reference.

**Consequences.** The screen is now goal-oriented rather than budget-oriented: it answers "what
do I still have to do today", not "how much may I still eat". This requires a daily deficit
target in the profile, which a pure budget model would not have needed. When the target is
already met the headline must switch to a different state — that is now a design requirement,
not an edge case.

Red on white is visually loud on a screen the user opens many times a day. Worth revisiting after
the first usability pass.

---

## 3. Activity is entered manually

**Decision.** Calories burned are entered by hand: activity type, duration, intensity. The app
estimates the calories from MET × body weight × duration and the user can overwrite the result.
No health-app integration in the first release.

**Context.** Apple Health is not reachable from a web app under any circumstances — reading it
requires a native iOS client. Health Connect on Android needs a native wrapper (TWA) as well.
Either path turns a web project into a native one.

**Consequences.** The first release stays a pure PWA and ships on both platforms at once. The
cost is friction: the user has to log every walk. Manual entry is also less accurate than a
phone's step counter, but the numbers were already approximate.

Health Connect on Android is a plausible second step and is shown as "later" in the profile so
the intent is visible.

---

## 4. Food recognition runs on the device

**Decision.** The photo is analysed on the phone. No image is sent to any server — ours or a
vendor's.

**Context.** Cloud options were analysed first ([food-recognition-api.md](food-recognition-api.md))
and a multimodal LLM was the initial choice. On-device was chosen instead because it turns the
privacy promise from a policy into a property of the system. How the pipeline actually works, what
it downloads and what it costs in accuracy is in
[on-device-recognition.md](on-device-recognition.md).

**Consequences.**

- Accuracy drops. A compact model that fits on a phone will not match a frontier cloud model at
  identifying an unusual dish or judging a portion. Editable results and `≈` on every number stop
  being a nicety and become load-bearing.
- A model bundle of roughly 20–50 MB has to be downloaded once and cached. It must load on demand
  when the photo screen is first opened, never on first paint.
- Recognition works offline, which the cloud version never could.
- **This decision has a hook into decision 3.** The best on-device quality available today comes
  from a native SDK, which needs a native wrapper. If the project goes native for recognition,
  then Health Connect and Apple Health become reachable and manual-only activity entry should be
  reconsidered. The real question underneath is whether this is a web app or a native app; the
  recognition library is downstream of that. Staying a pure PWA means browser ML (ONNX Runtime
  Web or TensorFlow.js) and accepting the lower accuracy.

---

## 5. Meal photos are never stored

**Decision.** The picture is analysed on the device and discarded. Only the resulting numbers are
persisted. Nothing is uploaded, and nothing is written to disk or object storage anywhere.

**Context.** This was originally the weaker claim "*we* do not keep the photo", because a cloud
analysis provider applies its own retention policy regardless of what we do. Decision 4 removed
that gap.

**Consequences.** The claim is now literally true and needs no footnote, no contract and no
trust in a third party — the photo cannot leave the device because nothing ever sends it.

The tradeoffs stay: no photo history, no "what did I eat last Tuesday", and no re-analysis of an
old picture with a better model later. That is intended.

If a hybrid escape hatch is ever added — an explicit per-photo "send this one to the cloud for a
better estimate" — the default guarantee still holds, but the UI wording must distinguish the two
paths honestly.

---

## 6. The wording is "deficit" and "surplus"

**Decision.** The app talks about a calorie *deficit* and *surplus*, not about "drawing from
reserves" or "putting into storage".

**Context.** The alternative framing was more vivid and more motivating, but it implies a
physical claim about body fat that a single day's calorie balance cannot support.

**Consequences.** Slightly drier copy. In exchange the app does not promise something it cannot
deliver, which matters because the fat-equivalent figure is already the most easily
misunderstood number on the screen.

---

## 7. The first model shipped is MobileNet V2, served from our own origin

**Decision.** The prototype now recognises food with MobileNet V2 (ImageNet-1k) running in
TensorFlow.js. The runtime and the weights are committed to the repository and served from the
same origin as the app — not from a CDN, not from a model hub.

**Context.** Decision 4 settled *where* recognition runs; it did not pick a model. A food-specific
classifier (Food-101 and its descendants) is the obvious want, but the usable ones are published
through model hubs, which makes the app depend on a third party being reachable at the moment a
user photographs their lunch. MobileNet V2 is available as a plain TF.js graph model, is small
enough to host ourselves, and needed no conversion step.

**Consequences.**

- **The taxonomy is ImageNet's, not a food taxonomy.** Around forty of its thousand classes are
  edible: fast food, baked goods, fruit, vegetables, a few dishes. A burger, a pizza or a banana
  is recognised well. A plate of home-cooked chicken and rice is not a class at all, so the app
  says it did not recognise anything rather than inventing a number. This is stated on the photo
  screen, in plain words, where the user can see it.
- Serving the weights ourselves costs ~15 MB in the repository and makes the first run a ~15 MB
  download. In exchange there is no third-party request in the recognition path at all, the
  privacy claim needs no footnote, and it works offline from the second run onward. The service
  worker serves `model/` and `vendor/` cache-first, since a new model would arrive at a new path.
- No detection step: one picture yields one dish, not a per-item breakdown of the plate. Adding
  items by hand covers the rest.
- No portion estimation: each recognised food starts from a typical serving in grams, which the
  user corrects. This is the weakest number on the screen and is presented as such.
- Replacing this with a food-specific model is a contained change — the class table and the model
  URL live in one file, `prototype/recognise.js`. The decision to revisit is whether a
  food-specific model justifies either a hub dependency or the work of converting and hosting one.

---

## 8. Maintenance is calculated from the body data, at rest, and can be overridden

**Decision.** The daily maintenance requirement is Mifflin-St Jeor resting metabolic rate from
sex, age, height and weight, multiplied by **1.2** for ordinary daily movement — and nothing
more. The user can type over the figure, and a button hands it back to the calculation.

**Context.** The profile collected body data that changed nothing: sex and age were decorative
tiles, height an input with no handler, and the "calculated" maintenance was the constant 2200
from the mock-up. The spec ([product-spec.md](product-spec.md#2-user-profile)) had always asked
for the calculation.

**Consequences.**

- **The 1.2 is deliberate and is the whole point.** A conventional TDEE formula multiplies by
  1.4–1.9 to account for exercise. This app already counts exercise as its own diary line, so a
  higher multiplier here would count every workout twice — once in the requirement and once in
  what was burned. The figure is therefore "what the body spends before training", and training
  is added on top, visibly.
- The manual override exists because the formula is a population average with a real error bar
  on any individual. Someone who has measured their own requirement should not have to fight the
  app, and the screen states which of the two is in force.
- Changing the body data re-derives today's requirement but never rewrites history: each closed
  day keeps the maintenance figure it was recorded with.

---

## 9. The diary keeps days, and the statistics come from them

**Decision.** The app stores a per-day record — eaten, burned and the maintenance figure in force
— and every aggregate on the home, history and statistics screens is calculated from it. Today's
entries stay editable; at the first launch after midnight the day closes into the record and the
diary starts empty.

**Context.** The prototype only ever knew about today. The weekly chart, the 30-day strip, the
accumulated fat equivalent and the "7 days / 30 days" roll-ups were all fixed numbers from the
design, and the History tab opened the statistics screen because there was no history to show.

**Consequences.**

- A day is the unit of the record, which is what makes "accumulated deficit" meaningful. The
  price is that editing a past day is not possible yet — only today is open.
- Each closed day stores its own maintenance figure, so changing the profile later does not
  silently rewrite what the past looked like.
- A fresh install seeds 45 demo days, generated from the day index rather than randomly, so the
  charts have something to draw and the same day always looks the same. Resetting the data in the
  profile regenerates them.
- Storage is still one localStorage key. A year of days is a few tens of kilobytes, so this holds
  for the prototype; the real app will want IndexedDB.

---

## 10. A cloud model is available as a second opinion, and its key never enters the repository

**Decision.** The app can send a single photo to a cloud vision model — `deepseek-flash` by
default — but only after the user has entered an API key in the profile and only when they press
"Ask the cloud" on that particular picture. The key is stored in the browser's localStorage. No
key is committed to this repository or served with the app.

**Context.** The on-device model recognises around forty ImageNet classes, which covers fast food
and produce and misses every home-cooked plate — the case the app exists for. A cloud model with
vision closes that gap. The original request was to hardcode the key in the source.

**Consequences.**

- **Hardcoding was rejected, and the reason is not style.** This repository is public and the app
  is a static page on GitHub Pages: a key in the source is a key in the git history forever and a
  key in the page source of every visitor's browser. It would be spent by strangers within days.
  A field in the profile costs one paste on first use and keeps the key on the device that owns
  it.
- **The privacy claim changes from absolute to conditional**, and every surface that carried it
  had to change with it. The screen now reads "analysed on the phone; it only leaves if you press
  Ask the cloud yourself", and the button states the destination before it is pressed. An
  automatic cloud fallback for low-confidence results was deliberately not built: it would move
  the photo exactly when the user had least reason to expect it.
- **The provider is a setting, not a dependency.** The request is the OpenAI-shaped
  `POST /chat/completions` that most vendors accept, so endpoint and model are text fields. If
  `deepseek-flash` does not accept images after all, the screen shows the provider's own error
  and the fix is typing a different model name, not a rewrite.
- **A browser-only app cannot hide a key, and cannot force a provider to accept it.** Two limits
  follow: localStorage is as safe as the device, and a provider without CORS headers cannot be
  called from a page at all. Both are stated in
  [on-device-recognition.md](on-device-recognition.md); both are answered by the same thing, a
  server-side proxy, which is the next step whenever this stops being a personal prototype.

---

## 11. Swipes move between tabs; the left edge goes back on modal screens

**Decision.** A horizontal swipe on a tab screen moves between the four tabs, the neighbouring
screen travelling in alongside. On a modal screen — the photo and activity sheets — a drag from
the left edge goes back instead, showing the screen behind it; that one runs only when the app is
standalone. Both commit past roughly a third of the width or on a fling.

**Context.** Navigation already pushes a history entry per forward move, so Android's system back
walks the app correctly. iOS gives an installed PWA neither of the two ways back it has in a
browser: no edge-swipe and no chrome. The in-app back buttons covered it, but only as a tap on a
small target at the top of a tall screen.

**Consequences.**

- **Standalone only, deliberately.** In a browser tab the platform owns the edge swipe; running
  ours alongside would pop two entries for one gesture. The cost is that the gesture cannot be
  tried without installing the app — which is also the only place it is needed.
- The gesture draws two screens at once, so both need an opaque background; screens otherwise
  borrow the white of the frame around them and would show through each other.
- A drag is claimed only once it is clearly horizontal and moving right, so vertical scrolling
  keeps working from the edge. Anything starting more than 30 px in is not a back gesture.
- Tidying up waits for the `popstate` that `goBack()` announces, because clearing the transform
  before the new screen is active blanks the display for a frame.
- **The tab swipe reserves no edge band, and that was a correction.** Reserving 30 px on each
  side for the phone's own gestures sounded prudent and made the feature look broken: telemetry
  from a real device showed drags starting at x = 6, 11, 334 and 335 on a 339-wide frame, all of
  them discarded by our own guard. Where a phone claims an edge gesture it takes those touches
  before the page sees them, so the band protects nothing; where the page does see them, the
  edge is the most natural place to start a swipe. The back drag still needs its 30 px band,
  because starting at the edge is what defines it.
- **Tab swiping needs no install**, unlike the back drag: it does not compete with anything the
  platform provides, so it works in a browser tab too.
- A drag beginning inside a sideways-scrolling box, such as the developer panel's raw reply,
  belongs to that box. The gesture walks up from the touch target and stands down if it finds
  one.
- **The page has to claim horizontal gestures in CSS, not only in JavaScript.** `touch-action:
  pan-y pinch-zoom` and `overscroll-behavior` leave vertical panning and zoom to the browser
  while keeping sideways drags for the app. Without them a phone browser decides what a
  horizontal swipe means before any handler runs, and usually decides it is its own back/forward
  gesture — the handlers then look broken while being perfectly correct.
- **The declaration belongs on the scrolling element, not only on its parent.** `.screen` is what
  scrolls, and a phone consults the scroller under the finger when it decides who owns a drag.
  With the rule only on the frame, swipes worked over buttons and other non-scrolling things and
  died over ordinary content — which reads as "the gesture works in some places", the most
  confusing way for it to fail.
- The two gestures cannot both apply: a screen is either a tab or a modal, which decides which
  gesture its drags belong to. The cost is that a tab screen no longer has an edge-drag back —
  swiping to the neighbouring tab replaced it, and on a tab screen that is the more predictable
  of the two.


---

## 12. The service worker must bypass the browser's own cache

**Decision.** The network-first fetch in the service worker runs with
`cache: 'no-store'`, a new worker takes control as soon as it is installed rather than waiting
for every tab to close, and the update button in the profile clears the cached shell before
returning on a fresh URL.

**Context.** Three rounds of gesture fixes were tested against a phone that never received any of
them. The developer read-out settled it: the device was reporting a guard that the deployed build
no longer contained. GitHub Pages sends `max-age=600`, and a plain `fetch(request)` inside a
service worker is answered from the browser's HTTP cache — so the worker went "to the network",
got a ten-minute-old file, and cached it as current. An installed PWA compounds this: its tabs
never close, so a downloaded worker can sit in `waiting` indefinitely.

**Consequences.**

- Every shell request costs a real round trip. That is the right trade for a prototype that
  changes several times an hour; the model and the runtime stay cache-first and untouched, so the
  15 MB download is never repeated.
- `skipWaiting` plus a reload on `controllerchange` means a new build can replace the running one
  mid-session. For an app holding only a local diary this is safe; an app with unsaved remote
  state would need to ask first.
- The developer read-out now carries the running build, so "which version is this" is answerable
  from a screenshot rather than from trust.
- A tester reporting that a fix did not work is now worth believing before the fix is doubted —
  the first question is which build they are on, and the answer is on screen.


---

## 13. Gemini is the default cloud model; DeepSeek does not receive the picture

**Decision.** The Gemini preset leads and is what a fresh install points at. DeepSeek stays
available as a preset, and the app now names the failure when a model does not receive the image.

**Context.** Decision 10 shipped `deepseek-flash` as the default on the strength of the user's
account that the line is multimodal. The debug log settled it with two numbers: for the same
photo Gemini counted **1176 prompt tokens** and answered with dish names, while DeepSeek counted
**429** — the text of the prompt alone, with no room for a picture — then spent the entire 2000
token completion budget inside `reasoning_content` and returned an empty `content` with
`finish_reason: length`. Three attempts, identical every time.

**Consequences.**

- A default that cannot do the one thing the feature exists for is a bug, not a preference, so
  the presets swapped order. Anyone preferring DeepSeek is one tap away.
- **Token counts identify this class of failure.** A prompt in the low hundreds against a picture
  of tens of kilobytes means the image never travelled: the app says so plainly rather than
  reporting "no food found", which sends the user to re-photograph a plate that was never the
  problem.
- `reasoning_content` is read and logged. A reasoning model that burns its budget before writing
  anything looks like a successful call carrying nothing, and only that field shows where it
  went.
- The failure was invisible for as long as the app only reported its own conclusions. It took
  one screenshot of the log to diagnose — which is the argument for the log.

---

## 14. Dragging a diary entry sets its time

**Decision.** The diary is ordered by the clock, earliest first, and a long press on an entry
lets it be dragged. Dropping it between two others gives it a time between theirs; at either end
it steps half an hour past its new neighbour.

**Context.** Two requests arrived together: let the order be rearranged by hand, and keep entries
in chronological order when they have times. Taken literally those are two orders competing for
one list — a manual order that a later edit to a time would silently undo.

**Consequences.**

- There is only one order, and the drag edits the data behind it rather than an ordering stored
  beside it. An entry moved between 13:10 and 16:20 becomes 14:45, which is both where the user
  put it and true.
- The gesture is a long press, not an immediate drag: the same finger scrolls the screen and
  swipes between tabs, and 350 ms separates them without feeling stuck.
- A dropped entry's time is a guess at what the user meant. It is visible immediately in the row
  and editable in one tap, which is the same contract as every other estimate in this app.
- The feed now reads earliest-first, the order the day happened in and the order the drag works
  in. Newest-first would have made dragging read backwards.

---

## 15. The activity catalogue is a picked subset, not a fixed list

**Decision.** The app ships about fifty activities with MET values, grouped by kind. The activity
screen offers only the ones ticked in the profile; the default six are what it offered before.

**Context.** Six activities cannot describe what people actually do, and fifty chips on the entry
screen would make the common case slower for everyone.

**Consequences.**

- Adding an activity is a profile decision made once, not a search performed at every entry.
- The last chosen activity cannot be removed: the entry screen needs something to offer.
- MET values come from the Compendium of Physical Activities, rounded to a precision this app can
  honestly claim — the estimate's error is dominated by intensity and body composition, not by
  the second decimal of a MET.
