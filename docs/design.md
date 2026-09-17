# Design

Mockups live on a private design canvas:
<https://claude.ai/artifact/VU2XS127WCNypQswG7u1QR> (visible to the repository owner only).

Base layout target: **390 × 844** — a phone screen. Everything scales up to tablet.

## Direction

Three directions were explored. **Concept B** was chosen; A and C are kept on the canvas for
reference. See [decisions.md](decisions.md#2-design-direction-the-bold-concept-with-the-headline-changed).

| | Concept | Character |
| --- | --- | --- |
| A | Ring | White, calm, red as an accent only. A large progress ring. |
| **B** | **Poster** | **Red as the primary surface, huge display figures, a dark card for the fat equivalent.** |
| C | Console | Dark dashboard, monospaced figures, dense data. |

## Tokens — concept B

```
--red            #D8161D   primary surface, primary action
--red-deep       #B4121A   pressed, links
--red-tint       #FBEFEF   privacy and info panels
--ink            #17120F   dark card, secondary action, chart baseline
--ink-muted      #6B625D   captions, timestamps
--surface        #F2EEEB   input wells, inactive chips
--hairline       #EDE8E5   list separators
--white          #FFFFFF
```

Contrast: white on `--red` is 5.2:1 and `--red` on white is the same, both above the 4.5:1
threshold. Text on red uses pure white at varying weight rather than reduced opacity — white at
80–90% alpha over this red falls below the threshold.

### Type

```
display   Anton            headline figures, section headers — uppercase
body      Work Sans        400 / 600 / 700 / 800
```

Anton is used for anything numeric and loud; Work Sans carries all reading text.

## Screens

| Artboard | Screen |
| --- | --- |
| `B-Home` | Home — "left to burn" headline, intake and activity in small type, deficit card, day feed |
| `B-Photo` | Photo analysis — result list, editable portions, privacy notice, totals |
| `B-Activity` | Manual activity entry — type, duration, intensity, estimated kcal, manual override |
| `B-Stats` | Statistics — accumulated fat equivalent, deficit per day, 30-day strip |
| `B-Profile` | Profile — body data, goal and deficit target, activity source, language, privacy |

## Rules that carry into implementation

- **Touch targets are at least 44 px.** Steppers, chips and nav items are sized for thumbs.
- **Real elements, not painted ones.** Buttons are `<button>`, links are `<a href>`, every input
  has a `<label>`. Icon-only controls carry an `aria-label`.
- **No fake system chrome.** No mocked status bars or home indicators.
- **Every estimate shows `≈`.** Portions, calories from photos, fat equivalents and MET-based
  activity figures are all approximations and are typeset as such.
- **Nothing is read-only that the user might disagree with.** Recognised portions, estimated
  activity calories and the daily requirement are all editable.
- **Layouts are verified in Russian**, which runs about 15% longer than English.
