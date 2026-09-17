# FitBalance — product specification

Last updated: 2026-09-17

## 1. Purpose

A mobile web app (PWA) that keeps the whole daily calorie picture in one place: the user's own
data, calories burned through activity, calories eaten, and the resulting balance for the day.

At any moment the user should be able to open the app and see:

- how much is still left to burn to reach today's deficit target;
- how much has been eaten today;
- how much has been burned today;
- the daily maintenance requirement;
- the approximate fat equivalent of the accumulated deficit or surplus.

## 2. User profile

On first launch the user fills in:

- sex;
- age;
- height;
- weight;
- activity level;
- goal: lose weight / maintain / gain weight.

From this the app calculates a recommended daily maintenance requirement. The user can also
override it and enter the daily requirement by hand.

The user additionally sets a **daily deficit target** (or surplus, when gaining). This target is
what the home screen counts down against.

```
maintenance      2200 kcal
deficit target    700 kcal per day  (~91 g fat equivalent per day)
```

## 3. Activity

Activity is entered **manually**. There is no automatic sync with the phone's health app in the
first release — see [decisions.md](decisions.md#3-activity-is-entered-manually).

The user picks:

- **type** — walking, running, gym, cycling, swimming, housework, other;
- **duration** — in minutes, with quick presets (15 / 30 / 45 / 60 / 90);
- **intensity** — light / moderate / high.

The app estimates the calories from the MET value of the activity, the user's body weight and
the duration, adjusted by the intensity coefficient:

```
kcal ≈ MET × intensity_factor × weight_kg × duration_hours
```

The estimate is always shown before saving and the user can overwrite it with an exact number.

Health Connect (Android) is a candidate for a later release. Apple Health is not reachable from
a web app at all.

## 4. Food logging

### 4.1 By photo

The user photographs the plate. The image is analysed and the app returns:

- what is on the plate;
- an approximate portion weight for each item;
- approximate calories per item;
- protein / fat / carbohydrates where available.

```
Grilled chicken   ~200 g   290 kcal
Boiled rice       ~220 g   330 kcal
Steamed vegetables ~180 g  100 kcal
                           ---------
                           720 kcal
```

The analysis runs **on the device** — the picture is never uploaded. How that pipeline works, and
what it costs in bundle size and accuracy, is in
[on-device-recognition.md](on-device-recognition.md); the cloud options that were considered
first are in [food-recognition-api.md](food-recognition-api.md).

Photo estimation is never exact — and an on-device model is at the lower end of the accuracy
range — so **every value is editable** before the meal is written to the diary, every number is
displayed with `≈`, and the confidence of the estimate is visible to the user.

The photo itself is discarded right after analysis — see section 10.

### 4.2 By hand

The user can add a product or a dish directly and type the calories.

Planned for later releases:

- product search;
- barcode scanning;
- saved dishes;
- favourites.

## 5. Home screen

The home screen leads with the number that drives behaviour: **how many calories are left to
burn today**.

```
LEFT TO BURN            400 kcal
                        to reach today's 700 kcal deficit

eaten      2350
burned      450
maintenance 2200

current deficit   300 kcal  ≈ 39 g
```

Derivation:

```
current deficit = maintenance + burned - eaten
                = 2200 + 450 - 2350
                = 300 kcal

left to burn    = deficit target - current deficit
                = 700 - 300
                = 400 kcal
```

Total intake for the day is shown next to the headline in small type. A progress bar shows the
current deficit against the target.

When the target is already met, the headline switches to the achieved deficit instead of a
countdown.

## 6. Fat equivalent

Beyond the plain calorie balance the app converts the deficit or surplus into a figure that is
easier to grasp — an approximate fat equivalent, using the conventional constant:

```
7700 kcal ≈ 1 kg of fat equivalent
```

**Deficit:**

```
deficit 620 kcal  →  ≈ 81 g fat equivalent
```

**Surplus:**

```
surplus 500 kcal  →  ≈ 65 g fat equivalent
```

This must never be presented as the amount of fat that physically appeared or disappeared in a
single day. Body mass also depends on water, glycogen, gut contents and other factors.

Every such figure is therefore rendered with `≈` and accompanied by wording such as
"approximately" or "fat equivalent — a conventional figure". It is a motivational instrument.

## 7. Cumulative effect

Single days matter less than the trend, so the app also shows accumulated results:

```
today       −39 g
7 days     −680 g
30 days   −2.4 kg fat equivalent
```

Plus a progress indicator towards the next round number:

```
1 kg of fat equivalent is 2460 kcal of deficit away
```

The same works for a surplus when the goal is to gain weight.

## 8. Day history

Below the headline the home screen lists everything logged today:

```
08:30  Breakfast          +450
11:40  Walking            −310
13:10  Lunch              +720
16:20  Snack              +280
19:30  Housework          −140
20:40  Dinner             +900
```

With the totals at the end:

```
eaten 2350 · burned 450 · deficit 300 kcal · ≈ 39 g
```

This lets the user see where the current result came from.

## 9. History and statistics

A calendar lets the user open any previous day and see:

- the daily requirement;
- calories eaten;
- calories burned;
- the resulting balance;
- the fat equivalent;
- the list of meals;
- the list of activities.

Weekly and monthly statistics show:

- deficit per day as a bar chart, against the target line;
- the accumulated fat equivalent over the period;
- averages for intake and activity;
- a 30-day strip where each day is coloured by how large the deficit was.

## 10. Privacy

Meal photos are **not stored and never leave the device**. The image is analysed locally and
discarded as soon as the result is produced; only the resulting numbers are persisted. This is
stated in the UI on the photo screen and in the profile.

Because analysis is local, the guarantee holds without depending on a vendor's retention policy.
See [decisions.md](decisions.md#5-meal-photos-are-never-stored).

## 11. Localisation

Russian and English ship together in the first release.

- All UI strings live in a translation catalogue; no hard-coded copy.
- The locale is chosen from the system language and can be overridden in the profile.
- Numbers, dates and units go through `Intl`.
- Russian strings run roughly 15% longer than English, so layouts are checked against Russian.
- Repository content — code, comments, commit messages, documentation — is English only.

## 12. Technical notes

- **PWA**: installable to the home screen, offline-first. Entries are written locally
  (IndexedDB) and synced when the network returns.
- Photo analysis runs locally, so it works offline too — but the model bundle (roughly 20–50 MB)
  has to be downloaded once, on demand, the first time the photo screen is opened.
- Base layout target is a 390 × 844 phone screen, scaling up to tablet.

## 13. Open questions

- **Web app or native app.** On-device recognition can be done in the browser (ONNX Runtime Web
  or TensorFlow.js, lower accuracy, stays a pure PWA) or through a native SDK behind a wrapper
  (better accuracy and portion estimates). The second option also makes Health Connect and Apple
  Health reachable, which would reopen the manual-activity decision. Everything else waits on
  this one.
- Client stack and hosting.
- Whether accounts and server-side sync are in the first release, or whether it stays local-only.
- Which food taxonomy and nutrition table to ship, and how large it is allowed to be.
