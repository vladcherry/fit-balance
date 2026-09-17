# FitBalance

A mobile-first PWA for tracking calories in and calories out, built around a single question:
**how much is left to burn today?**

> **Status: planning.** This repository currently holds the product spec, the decision log and
> design notes. No application code yet.

## What it does

Open the app and immediately see the state of the day:

- how much is still left to burn to hit the day's deficit target — the headline number;
- how much was eaten today;
- how much was burned through activity;
- the daily maintenance requirement;
- the current deficit, and its approximate fat equivalent in grams.

Food is logged by photographing the plate — the picture is analysed and turned into dishes,
portions and calories, all of which the user can correct. Activity is entered by hand: pick the
type, the duration and the intensity, and the app estimates the calories.

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

## Documentation

| Document | What's in it |
| --- | --- |
| [docs/product-spec.md](docs/product-spec.md) | Full product specification |
| [docs/decisions.md](docs/decisions.md) | Decision log — what was chosen and why |
| [docs/food-recognition-api.md](docs/food-recognition-api.md) | Analysis of food-recognition APIs |
| [docs/design.md](docs/design.md) | Visual direction, design tokens, screen inventory |

## Privacy

Meal photos are **not stored**. A picture is sent for analysis and discarded as soon as the
result comes back — only the resulting numbers are kept. See
[docs/decisions.md](docs/decisions.md#5-meal-photos-are-never-stored) for the one caveat that
comes with third-party analysis providers.

## Languages

The interface ships in **Russian and English** from the first release. Everything inside the
repository — code, comments, commit messages, documentation — is **English only**.
