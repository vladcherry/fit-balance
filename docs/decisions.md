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

## 4. Food recognition starts on a multimodal LLM

**Decision.** Start with a multimodal model (Claude Sonnet 5) prompted with a strict JSON schema:
photo in, dishes with portions, calories and macros out. Add a specialised nutrition API as a
second source only if portion accuracy proves insufficient.

**Context.** Full analysis in [food-recognition-api.md](food-recognition-api.md).

**Consequences.** Cheap to start and easy to iterate — the output format and the response
language are controlled by the prompt rather than by a vendor's schema. The tradeoff is that
there is no proprietary nutrition database behind the numbers; they come from the model's own
knowledge. Portion estimation is the weak point of every option on the market, which is why the
result must always be editable.

---

## 5. Meal photos are never stored

**Decision.** The image is sent for analysis and discarded as soon as the response returns. Only
the resulting numbers are persisted. Nothing is written to disk or object storage on our side.

**Consequences.** No photo history, no "look at what I ate last Tuesday", and no re-analysis of
an old picture with a better model later. That is the intended tradeoff.

**Caveat that must not be lost.** This promise only covers our own systems. A third-party
analysis provider applies its own retention policy — Anthropic's standard API retention is up to
30 days, and zero data retention is a separate commercial agreement. So the honest statement in
the UI is that *we* do not keep the photo, not that it exists nowhere. Either the wording stays
precise, or a zero-data-retention agreement is signed and the stronger claim becomes true.

---

## 6. The wording is "deficit" and "surplus"

**Decision.** The app talks about a calorie *deficit* and *surplus*, not about "drawing from
reserves" or "putting into storage".

**Context.** The alternative framing was more vivid and more motivating, but it implies a
physical claim about body fat that a single day's calorie balance cannot support.

**Consequences.** Slightly drier copy. In exchange the app does not promise something it cannot
deliver, which matters because the fat-equivalent figure is already the most easily
misunderstood number on the screen.
