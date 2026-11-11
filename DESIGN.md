---
name: Next.js Pokédex
description: A tactile red handheld with a crisp, screen-native Pokémon database.
colors:
  case-red: "#dc0a2d"
  case-oxblood: "#8e0c0a"
  button-shadow: "#5f0707"
  night: "#171717"
  white: "#ffffff"
  lens-cyan: "#0ebdd2"
  led-red: "#f70a05"
  led-yellow: "#fafb07"
  led-green: "#67f50b"
  lcd-light: "#76dceb"
  lcd-mid: "#38bad4"
  lcd-deep: "#1595bd"
  lcd-ink: "#063e51"
  lcd-field: "#0b536c"
  lcd-outline: "#09607a"
  lcd-on-field: "#e1fdff"
  lcd-placeholder: "#b5dce6"
  lcd-rule: "rgb(225 253 255 / 0.6)"
  lcd-panel: "rgb(225 253 255 / 0.16)"
  lcd-results: "rgb(225 253 255 / 0.2)"
  lcd-grid-rule: "rgb(225 253 255 / 0.52)"
  lcd-grid-cell: "rgb(6 132 174 / 0.2)"
  lcd-cell-pressed: "rgb(6 89 124 / 0.12)"
  clear-screen: "#c5e8f1"
  clear-ink: "#042a3a"
  clear-rule: "#315f70"
  clear-field: "#073e54"
  clear-field-hover: "#15596e"
  clear-on-field: "#f3fcff"
  clear-panel: "#d6f1f7"
  clear-hover: "#afd7e5"
  clear-switch-off: "#708e9b"
typography:
  page-title:
    fontFamily: '"Pixelify Sans", sans-serif'
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.4
  specimen-title:
    fontFamily: '"Pixelify Sans", sans-serif'
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.1
  specimen-title-max:
    fontFamily: '"Pixelify Sans", sans-serif'
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.1
  record-number:
    fontFamily: '"Pixelify Sans", sans-serif'
    fontSize: "1.125rem"
    fontWeight: 400
  body:
    fontFamily: '"Pixelify Sans", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: '"Pixelify Sans", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: '"Pixelify Sans", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.04em"
  dex-index:
    fontFamily: '"Pixelify Sans", sans-serif'
    fontSize: "0.625rem"
    fontWeight: 400
    letterSpacing: "0.04em"
rounded:
  tiny: "0.125rem"
  control: "0.25rem"
  screen: "0.375rem"
  track: "1rem"
  case: "2rem"
spacing:
  micro: "0.25rem"
  compact: "0.5rem"
  row: "0.75rem"
  base: "1rem"
  section: "1.25rem"
  detail: "1.5rem"
  screen: "2rem"
  mobile-shell-gap: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.lcd-field}"
    textColor: "{colors.lcd-on-field}"
    typography: "{typography.body-small}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.75rem"
  button-secondary:
    backgroundColor: "{colors.lcd-results}"
    textColor: "{colors.lcd-ink}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.75rem"
  search-field:
    backgroundColor: "{colors.lcd-field}"
    textColor: "{colors.lcd-on-field}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
  hardware-navigation:
    backgroundColor: "{colors.case-oxblood}"
    textColor: "{colors.white}"
    rounded: "{rounded.screen}"
    size: "4rem"
  database-cell:
    backgroundColor: "{colors.lcd-grid-cell}"
    textColor: "{colors.lcd-ink}"
    padding: "0.75rem"
  filter-option:
    backgroundColor: "{colors.lcd-panel}"
    textColor: "{colors.lcd-ink}"
    rounded: "{rounded.control}"
    padding: "0.5rem"
  settings-switch:
    rounded: "{rounded.track}"
    width: "52px"
    height: "28px"
  cry-player:
    textColor: "{colors.lcd-ink}"
    rounded: "{rounded.tiny}"
    padding: "0.5rem 0.75rem"
  type-label-clear:
    backgroundColor: "{colors.clear-panel}"
    textColor: "{colors.clear-ink}"
    rounded: "{rounded.control}"
    padding: "0.125rem 0.375rem"
---

# Design System: Next.js Pokédex

## Overview

**Creative North Star: "The Handheld Pokédex"**

A playful physical instrument surrounds a precise digital field guide. The red casing, lens, status lights, and depressed navigation buttons establish the handheld identity. Inside it, Pokémon and their records belong to one continuous blue display: a compact database that feels recognizable from the games.

The interface is expressive through its materials and Pixelify Sans typography. Screen content uses fine rules, restrained translucent fills, and clear alignment. Enhanced contrast keeps the same structure and blue character while replacing texture and translucent layers with solid, readable surfaces.

**Key Characteristics:**

- Tactile hardware around flat screen content.
- A cyan database grid with clear records and game-inspired labels.
- One pixel font, compact spacing, and deliberate data hierarchy.
- A quieter, solid blue alternative through enhanced contrast.
- Brief, optional Pokémon motion and user-controlled sound.

This is a scan of the approved implementation, not a redesign. The North Star name and playful, precise tone were confirmed by the user. Values come from [globals.css](src/app/globals.css), Tailwind utilities, and the components below. Frontmatter records observed values; it does not inject runtime CSS or create a second theme implementation. Update this document and its sidecar together when changing the system.

## Colors

The palette pairs warm red hardware with a cool cyan display and deep blue ink.

### Primary: hardware

Case Red and Case Oxblood define the enclosure and raised navigation controls. White outlines, bright Lens Cyan, and red/yellow/green LEDs belong to the hardware. They are not extra screen action colors. Night is the surrounding page background.

### Secondary: normal LCD

LCD Light, Mid, and Deep form the screen's 145-degree gradient, with a pale radial highlight at the upper left. LCD Ink supplies text. LCD Field and On Field identify inset inputs and selected actions. LCD Outline is the stronger control edge. Pale translucent rules and panels allow the underlying display to remain visible; grid cells use the separate darker cyan tint.

These translucent colors are composited surfaces, not standalone text backgrounds with an assumed contrast ratio. Header rules, grid dividers, and component panels have deliberately different alpha values. Do not flatten them all to one arbitrary opacity.

### Enhanced contrast: clear LCD

`data-contrast="enhanced"` on `.pokedex-screen` maps screen roles to the Clear palette: Screen, Ink, Rule/Outline, Field, Field Hover, On Field, Panel, Hover, and Switch Off. The gradient, scanlines, text shadow, and inset screen highlight disappear. A solid rule frames the screen, index numbers become fully opaque, and type labels replace the raster badges. The red hardware remains recognizable.

**The Screen Roles Rule.** New screen controls must read the existing `--screen-*` roles with appropriate normal-mode fallbacks. A normal-mode color alone is insufficient when the component has an enhanced-contrast state.

Tonal ramps in `.impeccable/design.json` are synthesized reference swatches for the viewer, not additional production palette values.

## Typography

**Display and body font:** Pixelify Sans, loaded once with `next/font/google`; the application uses Next.js's generated fallback. The portable token stack uses a generic sans-serif fallback.

Page titles use `page-title`, uppercase through the shared index header. Pokémon names are the exception: the detail title is capitalized and scales between `specimen-title` and `specimen-title-max` with `clamp(1.5rem, 5cqi, 2rem)` at line-height 1.1. Detail entry numbers use `record-number`. Overview names remain sentence case with line-height 1.

Body text and search input use `body`; detail entries use line-height 1.5. Supporting explanations use `body-small`; About uses the same size with line-height 1.65 and a reading width up to 65ch. Captions, section labels, counts, and secondary data occupy the smaller tiers. Only overview index numbers use `dex-index`; do not extend that smallest size to instructions or actions. Counts and measurements use tabular numbers.

**The One Font Rule.** Keep Pixelify Sans throughout the interface. Establish hierarchy through size, spacing, case, and alignment before adding weight or a second typeface.

## Layout

The device is `min(90vw, 900px)` wide. Its desktop body has a flexible screen column and a 100px navigation column. The screen content viewport stays 32rem high across routes; long content scrolls inside it. Shared desktop screen padding is 2rem, with 1.5rem on detail records.

At viewport widths of 700px and below, all routes move the five navigation buttons above the screen, in equal columns. Buttons become 3.5rem high and fill their column. Main and navigation padding become 2rem, screen padding becomes 1rem, and the hardware row gap is 3rem. At 360px and below, outer padding becomes 1.5rem and navigation gaps become 0.25rem.

The overview has two columns, increasing to three at Tailwind's viewport `lg` breakpoint (64rem). Detail records use two equal columns, specimen left and facts right. At a detail content-container width of 340px or below they stack; the artwork shrinks from a maximum of 14rem to 10rem and the registration circle from 12rem to 9rem.

Search, Filter, and Settings use flex layouts with `min-block-size: 0` so results or options can scroll while controls remain reachable. Filter actions sit outside the options scroller. Detail and About scroll as documents inside the common screen. These are purposeful content differences within the same fixed viewport.

## Elevation & Depth

Hardware is structural and raised; screen content is mostly flat. Navigation uses a hard dark lower edge plus a soft contact shadow, moving down when hovered or selected. The screen has a 20px oxblood bezel and an inset highlight above scrolling content. Its pseudo-elements are non-interactive; the frame must not obstruct pointer input.

Search uses an inset shadow to feel cut into the display. Grid cells and result rows use shared borders and tonal fills rather than individual floating shadows. Pokémon artwork alone gets a small silhouette shadow: overview `drop-shadow(0 3px 2px rgb(0 54 77 / 0.26))`, detail `drop-shadow(0 6px 3px rgb(0 54 77 / 0.24))`.

**The Hardware Depth Rule.** Reserve substantial elevation for the enclosure and physical navigation. Keep records integrated into the screen rather than turning them into glass tiles.

## Shapes

The case has broad 2rem corners and an angular clipped header. Circular geometry belongs to lenses, LEDs, switch thumbs, and the detail registration target. Screen corners and the grid perimeter use `screen`; ordinary controls and panels use `control`; small utility controls and the footprint stamp use `tiny`.

Grid perimeter and separators share a real 1px rule. Detail facts and information sections use thin horizontal rules. Do not add a circular pedestal to overview Pokémon: that variation was reviewed and rejected. The detail-only circle remains part of the specimen presentation.

## Components

### Shared header and database grid

The index header aligns its uppercase title and optional count along a thin bottom rule, with wrapping when needed. Use it on the overview and utility pages; detail keeps its own record header. Grid links have a minimum height of 10.25rem, 0.75rem padding, an index in the upper left, 88px artwork, a name, and type badges. The entire cell is the link. Hover and focus lighten the cell and lift the sprite 4px; press scales the cell to 0.96. Its focus outline is inset so the grid cannot clip it.

### Buttons and navigation

Screen actions have a 44px minimum height, compact corners, and strong visible focus. Primary actions use Field/On Field; secondary actions use a pale panel with dark ink. Loading controls retain their label and focus using `aria-disabled` when appropriate; the handler must also guard repeated activation. Error retry uses the established 2px current-color outline variant.

Hardware navigation is a separate component family: 64px square on desktop, full-column width above the screen on mobile. Hover moves it 3px down; active/current moves it 5px down and changes the shadow to depressed. Preserve native links, accessible names, and `aria-current`.

### Search and results

The 52px-minimum dark inset field contains a search icon, a 16px input, and a 44px clear button. Its focused bezel has a 2px dark outline offset 3px. Pale results below use one bordered container, divided rows at least 50px high, uppercase names left, and tabular index numbers right. Hover/keyboard focus reverses to dark blue and pale text with a visible marker. Keep the existing React Aria autocomplete keyboard model, empty-state guidance, and result status.

### Filter options

Generation and type choices share the same pale outlined 44px-minimum option style. Selected options reverse to Field/On Field and show a check, so selection is not communicated through color alone. Options use auto-fit columns with a 6.5rem minimum. Keep the positioned label containing the hidden native input so keyboard focus scrolls the options panel correctly.

### Settings switches

Rows belong to one pale ruled panel, with a 44px-minimum label hit area and supporting description. Tracks are 52 by 28px, thumbs 20px, and selected travel 24px. Use the React Aria switch and its label/description relationships. Preferences persist immediately. Reduce motion and Disable cry autoplay are off by default; motion and cry autoplay are therefore enabled unless device preferences or browser autoplay rules intervene. Enhance contrast is also off by default.

### Detail record, footprint, and cry

The specimen sits on a flat circular registration target beside its identity, types, and ruled facts. The entry description spans below. The footprint has a 44px stamp with a pixelated image; show honest “No footprint” text for absent/transparent assets. Keep its styles under `.pokemon-detail-footprint*` in the shared stylesheet.

The cry player uses a labeled 44px-minimum button, a meter, and progress feedback. It offers manual replay, a readable loading/error state, and one attempted autoplay per entry when allowed. Its bars visualize AudioContext frequency data when the audio graph is available; they are decorative to assistive technology and are not a time-domain waveform or calibrated sound-level reading.

The approved detail entrance is a single 700ms two-hop bounce: 12px, then 5px. The user explicitly preferred it after comparing the smoother alternative. Keep this intentional game-like motion rather than replacing it because a generic detector dislikes bounce. Wait for the image and preferences to load, and skip it for app or device reduced motion. App Reduce motion also hides the animated cry meter and removes switch transitions. Device reduced motion additionally disables the CSS startup lights and slot transitions. Existing case/navigation motion is recorded separately in the audit; this document does not claim all motion already follows the app switch.

### Informational and fallback states

About uses readable paragraphs, ruled sections, a compact definition list for the stack, and underlined links. Loading, empty, and error states keep the same screen, font, and ink; retain real retry actions and status text. They must not announce fake progress, create decorative metadata, or trigger detail audio while loading.

## Do's and Don'ts

### Do:

- **Do** keep the same screen height and responsive navigation position on every route.
- **Do** use thin shared rules and tonal fills for database content.
- **Do** support both screen palettes through semantic screen roles.
- **Do** retain visible keyboard focus, native semantics, and explicit selected states.
- **Do** preserve the chosen bounce while honoring its motion preferences.
- **Do** keep empty, loading, error, and missing-data messages honest and useful.
- **Do** update this file and `.impeccable/design.json` together after approved style changes.

### Don't:

- **Don't** add glass cards, floating panel shadows, or overview sprite pedestals.
- **Don't** use hardware red as another screen action color.
- **Don't** turn the decorative cry meter into a claim of real waveform analysis.
- **Don't** hide meaningful type information behind color or an image alone in enhanced contrast.
- **Don't** replace the approved font or detail bounce during generic cleanup.
- **Don't** treat this style guide or a consistency audit as proof of full WCAG conformance.
