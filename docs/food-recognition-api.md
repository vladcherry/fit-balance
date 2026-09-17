# Food recognition from a photo — cloud provider analysis

Researched 2026-09-17.

> **Superseded.** This document compares *cloud* providers and concluded with a multimodal LLM.
> The project went **on-device** instead — see
> [decisions.md](decisions.md#4-food-recognition-runs-on-the-device) and
> [on-device-recognition.md](on-device-recognition.md). The accuracy and privacy sections below
> still hold and are the reason the decision changed, so the document is kept as the record of
> the road not taken.

## The problem

Turn a photograph of a plate into a list of dishes with portion weights, calories and macros.
Two families of providers can do this, and they fail in different places.

## What accuracy to expect — from anyone

This is the part that shapes the UI more than the provider choice does.

- Dish identification lands around **68–86%** in independent testing.
- **Portion estimation is the weak point everywhere.** A model can say "chicken breast" and still
  not tell 100 g from 200 g. Published benchmarks of consumer apps spread from roughly ±1.4% to
  ±20% on calorie error depending on the app and the test set.
- Mixed and sauced dishes — curries, stews, casseroles — are structurally hard, because the
  ingredients are not visually separable.

Consequence for the product: the analysis result is a **draft, never a fact**. Every value stays
editable, every number carries `≈`, and the confidence of the estimate is visible to the user.

## Option 1 — multimodal LLM (chosen)

Send the photo plus a prompt; get back JSON with dishes, grams, calories and macros.

| Model | Input / output per 1M tokens |
| --- | --- |
| Claude Sonnet 5 | $2 / $10 |
| Claude Opus 5 | $5 / $25 |
| Claude Haiku 4.5 | $1 / $5 |

A single meal photo is on the order of a couple of thousand input tokens, so per-analysis cost is
small at this tier.

**In favour**

- One call, one integration, no vendor schema to adapt to.
- The output format is ours: exactly the fields the UI needs, in the user's language, changeable
  by editing a prompt rather than by waiting for a vendor.
- Handles unusual and regional dishes better than a fixed-taxonomy classifier, because it is not
  limited to a trained dish list.
- Trivial to A/B a better model later — the interface does not change.

**Against**

- No proprietary nutrition database behind the numbers; they come from the model's own knowledge.
  For packaged goods with a known label this is worse than a database lookup.
- Output needs schema validation on our side.

## Option 2 — specialised nutrition APIs

**LogMeal** — food type and food group detection, multiple dishes per image, ingredient
extraction, nutritional analysis, automatic portion estimation. Supports 10 languages: English,
Spanish, French, German, Italian, Dutch, Turkish, Greek, Hebrew, Catalan — **Russian is not among
them**. Free trial of 30 days or 200 queries.

**Passio Nutrition-AI** — SDK plus REST API, a searchable database of 2.5M+ food items, photo
logging, voice logging and barcode scanning. Supports both on-device and cloud recognition, which
is interesting for privacy. Token-based pricing that scales with volume.

**In favour**

- A real nutrition database behind the values, including packaged products.
- Portion estimation is a first-class feature rather than a side effect.
- Passio's on-device mode would let the image never leave the phone at all.

**Against**

- Higher fixed cost to start, and pricing that is harder to predict before volume is known.
- Less control over the response shape and the response language — a concern given the Russian
  requirement.
- Another vendor dependency for what is one screen of the app.

## Privacy — the constraint that cuts across both

The product promises that meal photos are not stored. That promise is fully under our control
only for our own systems.

- Anthropic's standard API retention deletes inputs and outputs **within 30 days**. Zero data
  retention is available to eligible customers under a separate commercial agreement, and even
  under ZDR some categories of model carry a 30-day safety retention.
- Any other cloud provider has an equivalent policy that must be read before the claim is made.
- Passio's on-device recognition is the only option here that removes the question entirely,
  at the cost of a native SDK.

**Therefore:** the UI wording says that *we* discard the photo immediately, which is true and
verifiable. Upgrading to "the photo exists nowhere" requires either a zero-data-retention
agreement or on-device recognition.

## Where this landed

The original conclusion was to start on **Claude Sonnet 5** with a strict JSON schema.

That was overturned by the privacy section above. Sending every meal photo to a third party, with
a retention window we do not control, was not compatible with the promise the product wanted to
make — so recognition moved onto the device. Passio's on-device mode, noted above as the one
option that removes the question entirely, is the closest cloud-vendor relative of what was
chosen.

Whichever engine ends up running, keep the analysis behind a thin internal interface so it can be
swapped without touching the UI. See [on-device-recognition.md](on-device-recognition.md).

## Sources

- [LogMeal Food AI — Image API for Food Detection](https://logmeal.com/api/)
- [Passio Nutrition-AI Platform](https://www.passio.ai/)
- [Anthropic — API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
- [Anthropic Privacy Center — How long do you store my organization's data?](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)
- [Anthropic — Data retention practices for Covered Models](https://support.claude.com/en/articles/15425996-data-retention-practices-for-covered-models)
- [AI Photo Calorie Tracking: 5 Apps Tested for Accuracy (2026)](https://openhealth.blog/en/blog/ai-photo-calorie-tracking)
- [Six-App AI Photo Calorie Recognition Benchmark (2026)](https://clinicalnutritionreport.com/research/ai-photo-calorie-benchmark-2026/)
- [Which AI Food Tracker Can Recognize Food from a Photo and Estimate Calories Accurately in 2026?](https://www.welling.ai/articles/ai-food-tracker-photo-recognition-calories-2026)
