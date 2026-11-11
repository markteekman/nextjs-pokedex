# Pokédex design consistency audit

Reviewed 11 November 2026 against [DESIGN.md](../DESIGN.md), using Impeccable's document and audit workflows. This captures the current implementation; no application code was changed during the audit.

## Implementation integrity verdict: pass

The six primary pages express one coherent system. Red tactile hardware encloses a cyan database screen; Pixelify Sans, thin rules, compact blue controls, and the common screen viewport connect the routes. The detail specimen layout and the dark inset search field are purposeful variations, rather than competing component styles.

The detector's final source scan returned **zero primary findings and one advisory**: it classifies the LCD scanline/background treatment in `src/app/globals.css:173` as a decorative grid. This is an intentional, user-approved material treatment, documented in the guide. It disappears in enhanced contrast. Keep it.

No hook configuration, ignore rule, or suppression file was added. The chosen detail bounce also remains intentional and documented.

## Scoped health score

These are provisional engineering judgments for the inspected sources and sampled states. They are **not** WCAG conformance scores or performance benchmark results. The full accessibility audit remains deferred.

| Dimension                | Score            | Evidence and limitation                                                                                                                                                                                        |
| ------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibility            | 3/4              | Labeled controls, visible keyboard states, working search navigation, and preserved filter focus. Hardware motion has a preference gap; assistive technology and complete contrast testing were not performed. |
| Performance              | 3/4              | Small paginated catalog batches, disabled speculative detail prefetch, sized Next.js images, and a bounded cry meter loop with cleanup. No production bundle, network, or frame-time profiling.                |
| Responsive design        | 3/4              | All six routes retain the shared viewport and fit at 320px. About's narrow definition-list column needs an adjustment. Text zoom and the full intermediate-width range were not tested.                        |
| Theming                  | 4/4              | Both intended screen palettes propagate across all six routes; enhanced contrast removes texture and changes type badges to readable labels. No dark mode is specified or required by this design.             |
| Implementation integrity | 4/4              | Product-specific materials, shared components and rules, consistent typography, and documented exceptions; no confirmed decorative detector regression.                                                        |
| **Total**                | **17/20 — Good** | **Two P2 follow-ups. No P0 or P1 issue established in this scope.**                                                                                                                                            |

## Coverage and evidence

The browser's desktop CSS viewport was 1024px wide. The first phone-sized viewport request produced a 433px CSS viewport because of the browser's existing zoom. A second override was measured at **320px CSS width**, rather than assuming the requested device width equaled the layout viewport. Temporary viewport changes and the contrast preference were restored afterward.

| Route                | Desktop normal    | Desktop enhanced | 320px enhanced    | Additional checks                                                                                           |
| -------------------- | ----------------- | ---------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Overview `/`         | Inspected         | Inspected        | Inspected         | Normal mode at 320px; grid frame and labels                                                                 |
| Detail `/1`, `/4`    | Bulbasaur         | Bulbasaur        | Charmander        | Stacked specimen; entry title scales from about 31.2px to 24px                                              |
| Search `/search`     | Results and focus | Results          | Results and focus | Normal mode at 320px; Arrow Down + Enter opens the selected Pokémon; clearing restores the hint             |
| Filter `/filter`     | Inspected         | Inspected        | Inspected         | Space selects Fire/Fairy; option focus scrolls the inner pane while the outer screen remains at scrollTop 0 |
| Settings `/settings` | Inspected         | Inspected        | Inspected         | Keyboard contrast switch; also inspected at 433px                                                           |
| About `/about`       | Inspected         | Inspected        | Inspected         | Narrow stack table and inline links; also inspected at 433px                                                |

Across these samples:

- Screen content height computed to approximately **512px** on every route in both palettes. Desktop detail padding was 24px; other desktop pages used 32px; narrow pages used 16px, matching the documented exceptions.
- All route headings used the loaded Pixelify Sans family. Shared utility headers were 20px; the detail title used its documented fluid scale.
- Page and screen content had **zero horizontal overflow** in the sampled states. The page itself may scroll vertically on a small screen; the shared inner viewport remains fixed.
- At 320px, navigation links measured approximately **44.8 × 56px**. Sampled primary screen actions and switch/checkbox labels met the project's 44px height target. This is a project target, not a claim that WCAG AA requires every inline link to be 44px.
- About's inline text links are smaller than 44px, as expected for links within prose; they were not counted as failures by this blanket measurement.

Source review included the shared shell, navigation, screen, slots, detail sprite, cry player, search, filters, settings, About, preferences, and loading/error components. Loading and failure styles were inspected in source; network failures were not induced and the full pagination flow was not repeated in this run.

## Findings

### [P2] About's stack descriptions become too narrow

- **Location:** `src/app/globals.css:812`, `.pokemon-about-stack > div`.
- **Category:** Responsive design / readability.
- **Verified evidence:** At 320px CSS viewport width, the stack table is about 208px wide. Its fixed minimum term column consumes approximately 112px, leaving only **52.9px** for descriptions. The first description breaks “server-first foundation” across short fragments and the six-row table grows to roughly 932px tall. There is no horizontal overflow, but reading takes unnecessary effort.
- **Impact:** Small-screen readers must decipher word fragments and scroll substantially more than the surrounding copy requires.
- **Recommendation:** Stack each term above its description when the table's own available width is small. Keep the current two-column layout where it has enough room. A container query fits the existing CSS approach.
- **Standard:** A verified readability defect; no specific WCAG violation asserted from this check.
- **Suggested command:** `$impeccable adapt` for the About stack only.

### [P2] Hardware motion is outside the reduced-motion path

- **Location:** `src/components/pokedex-case.tsx:21`; `src/app/globals.css:933` and its reduced-motion block at line 1405.
- **Category:** Accessibility / motion preferences.
- **Source evidence:** The case always animates its Y position through `80 → -30 → 0`. There is no local preference check or `MotionConfig` in the app. The installed Motion dependency's default configuration specifies `reducedMotion: "never"`. The device CSS media query disables the startup lights and slot transitions, but does not target the case's JavaScript transform or the navigation transition. The app toggle is deliberately narrower today: its description promises to skip the Pokémon bounce and animated cry visualizer, and those consumers read the preference correctly.
- **Impact:** A device-level reduced-motion preference does not consistently quiet the surrounding hardware, even though the Pokémon treatment observes it.
- **Recommendation:** Route the case translation through the existing preference hook and include navigation movement in the device reduced-motion treatment. Keep visible static current/pressed and focus feedback. Decide whether the app toggle should also cover all decorative hardware motion, updating its description if the scope expands.
- **Standard:** Preference-consistency concern established by source inspection; no runtime device-preference emulation or WCAG conformance claim was made.
- **Suggested command:** `$impeccable animate` scoped to the case and navigation preference handling. Preserve the approved detail bounce when motion is allowed.

## Detector triage and documentation corrections

The first scan caught three omissions in the newly extracted guide: the existing pressed-cell tint, the 18px detail record number, and the 32px upper endpoint of the fluid detail title. These were **documentation omissions**, not application regressions. Their actual values were added to the guide and the sidecar was regenerated. A single confirmation scan then returned only the intentional LCD texture advisory described above.

No detector advisory was silenced through ignore configuration. There was no need to change the approved palette, typography, or bounce to obtain a clean primary scan.

## Patterns to retain

- The same shell and screen frame wrap every route, including errors.
- Screen roles allow stronger contrast without replacing the Pokédex identity.
- Filter selection uses a check indicator as well as color, and the positioned labels keep hidden native inputs in the correct scrolling context.
- Search reuses React Aria's keyboard model instead of introducing a custom list interaction.
- Detail artwork has an explicit motion gate; the cry player preserves manual playback when autoplay is blocked.
- Loading, missing-footprint, and retry copy communicate real states rather than decorative data.

## Recommended next actions

1. **[P2] `$impeccable adapt`:** Stack About's definition-list rows at narrow container widths.
2. **[P2] `$impeccable animate`:** Align case/navigation motion with the intended preference coverage, retaining static state cues.
3. **After those changes, `$impeccable polish`:** Make one bounded desktop/mobile confirmation pass, then re-run `$impeccable audit` against this guide.

These can be handled individually, together, or in either order. No fixes were applied during this audit, and no tests were added. A full WCAG review, screen-reader checks, text enlargement/reflow checks, complete contrast measurements, and production performance profiling remain separate work.
