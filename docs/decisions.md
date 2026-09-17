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
