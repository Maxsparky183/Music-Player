---
name: Obsidian Rhythm
colors:
  background: '#131313'
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff516a'
  on-tertiary-container: '#5b0017'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-bold:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  caption-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  sidebar-width: 260px
  player-height: 96px
---

## Brand & Style

This system captures the current dark, immersive music-player aesthetic used by the app shell and its surfaces. The visual language is modern, minimal, and slightly futuristic, with neon-accent interactions that keep the interface energetic without sacrificing clarity.

## Colors

- Primary accent: amethyst violet for active states, selected rows, and progress fills.
- Secondary accent: cyan for metadata, technical cues, and supporting highlights.
- Tertiary accent: rose for high-intensity actions such as favorites or destructive actions.
- Neutral surfaces stay deep and high-contrast so album art and controls remain visually dominant.

## Typography

- Inter is the sole type family for the experience.
- Titles and section headers should use the bold display and headline scales.
- Metadata and supporting labels should use the body and caption variants to preserve scanability.

## Layout & Spacing

- The shell uses a fixed sidebar and bottom player bar with a 24px content gutter.
- Primary spacing is based on a 4px rhythm and should remain consistent across cards, panels, and control groups.
- On smaller screens, the main content should collapse into a simpler single-column flow.

## Elevation & Motion

- Depth comes from tonal layering rather than heavy shadows.
- Hover and active states should raise the surface slightly through darker containers and brighter accent outlines.
- Interactive elements should feel crisp, fast, and precise, with subtle glow to reinforce the premium audio experience.

## Components

- Buttons: primary actions use the violet accent, secondary actions use a dark elevated surface, and icon buttons rely on soft hover states.
- Track cards: use rounded artwork, a compact title/artist stack, and a clear active-state accent.
- Player controls: the central play/pause button should be prominent and high contrast, while sliders use a violet fill and muted track.
- Inputs: use a dark background, subtle border, and violet focus ring to maintain the polished terminal-like aesthetic.