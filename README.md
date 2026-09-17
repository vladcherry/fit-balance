# FitBalance

A mobile-first PWA for tracking calories in and calories out, built around a single question:
**how much is left to burn today?**

### ▶︎ [vladcherry.github.io/fit-balance](https://vladcherry.github.io/fit-balance/)

Open it on a phone and install it to the home screen — the app offers to do that itself, with
step-by-step instructions on iOS, where Safari has no install API.

> **Status: prototype.** `prototype/` is a clickable, installable static prototype of the chosen
> design. The real application has not been started yet; this repository holds the prototype, the
> product spec and the decision log.

| Today | Meal | Activity | Stats |
| --- | --- | --- | --- |
| <img src="docs/screenshots/home.png" width="190" alt="Home screen"> | <img src="docs/screenshots/meal.png" width="190" alt="Meal screen"> | <img src="docs/screenshots/activity.png" width="190" alt="Activity screen"> | <img src="docs/screenshots/stats.png" width="190" alt="Statistics screen"> |

## What it does

Open the app and immediately see the state of the day:

- how much is still left to burn to hit the day's deficit target — the headline number;
- how much was eaten today;
- how much was burned through activity;
- the daily maintenance requirement;
- the current deficit, and its approximate fat equivalent in grams.

Food is logged by photographing the plate, or by hand. Either way the result is a list of items
whose name, weight and calories can all be edited — change a weight and the calories follow the
item's kcal-per-100 g. Activity is entered by hand: pick the type, the duration and the
intensity, and the app estimates the calories from MET and body weight.

## The headline number

The home screen leads with **calories left to burn**, not with a remaining food budget.

```
maintenance            2200 kcal
daily deficit target    700 kcal

eaten today            2350 kcal
burned today            450 kcal

current deficit  = 2200 + 450 - 2350 =  300 kcal  (~39 g fat equivalent)
left to burn     =  700 - 300        =  400 kcal
```

Total intake sits next to it in small type.

## Fat equivalent

Calorie balance is also shown in grams, using the conventional figure of
**7700 kcal ≈ 1 kg of fat equivalent**. This is a motivational aid, not a body-composition
measurement: day-to-day weight also moves with water, glycogen and gut contents. Every such
figure is rendered with `≈` and labelled as an approximation.

## Privacy

Meal photos are analysed **on the device** and never leave it. Nothing is uploaded; only the
resulting numbers are kept. The guarantee is a property of the system rather than a policy —
see [docs/on-device-recognition.md](docs/on-device-recognition.md).

In the prototype the picture is held as an object URL inside the page. Recognition itself is not
wired up yet, and the prototype says so on screen.

## Languages

The interface ships in **Russian and English** from the first release, switchable in the profile.
Everything inside the repository — code, comments, commit messages, documentation — is
**English only**.

## Documentation

| Document | What's in it |
| --- | --- |
| [docs/product-spec.md](docs/product-spec.md) | Full product specification |
| [docs/decisions.md](docs/decisions.md) | Decision log — what was chosen and why |
| [docs/on-device-recognition.md](docs/on-device-recognition.md) | How on-device photo analysis works, and what it costs |
| [docs/food-recognition-api.md](docs/food-recognition-api.md) | Analysis of cloud food-recognition APIs (the road not taken) |
| [docs/design.md](docs/design.md) | Visual direction, design tokens, screen inventory |

## Working on the prototype

No build step, no dependencies — plain HTML, CSS and one script.

```bash
python -m http.server 5173 --directory prototype
```

Then open <http://localhost:5173>. A service worker is involved, so use a normal reload if a
change does not appear.

| Command | What it does |
| --- | --- |
| `python tools/make-icons.py` | Regenerate the PWA icons |
| `bash tools/make-screenshots.sh` | Regenerate the README screenshots from the running prototype |

`?seed=meal` pre-fills a meal with a recognition result, which is how the screenshots are taken.

### Deployment

Every push to `main` that touches `prototype/` is deployed to GitHub Pages by
[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml). The workflow stamps
`version.json` with the commit SHA, which the app shows under **Profile → App** along with an
update button.
