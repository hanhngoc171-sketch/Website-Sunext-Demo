---
name: Kinetic Enterprise AI
colors:
  surface: '#fef7ff'
  surface-dim: '#e4d2ff'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f0ff'
  surface-container: '#f4eaff'
  surface-container-high: '#f0e3ff'
  surface-container-highest: '#ebdcff'
  on-surface: '#240d48'
  on-surface-variant: '#4b4455'
  inverse-surface: '#39255e'
  inverse-on-surface: '#f7edff'
  outline: '#7c7486'
  outline-variant: '#cdc2d7'
  surface-tint: '#792edd'
  primary: '#5e00be'
  on-primary: '#ffffff'
  primary-container: '#782ddc'
  on-primary-container: '#e3cfff'
  inverse-primary: '#d6baff'
  secondary: '#994700'
  on-secondary: '#ffffff'
  secondary-container: '#fb7800'
  on-secondary-container: '#592600'
  tertiary: '#5c00c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#781fec'
  on-tertiary-container: '#e2cfff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ecdcff'
  primary-fixed-dim: '#d6baff'
  on-primary-fixed: '#280057'
  on-primary-fixed-variant: '#5f00c0'
  secondary-fixed: '#ffdbc8'
  secondary-fixed-dim: '#ffb68b'
  on-secondary-fixed: '#321200'
  on-secondary-fixed-variant: '#753400'
  tertiary-fixed: '#ebdcff'
  tertiary-fixed-dim: '#d4bbff'
  on-tertiary-fixed: '#270058'
  on-tertiary-fixed-variant: '#5d00c2'
  background: '#fef7ff'
  on-background: '#240d48'
  surface-variant: '#ebdcff'
typography:
  h1-desktop:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3-card:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.4'
  body-main:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-muted:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-eyebrow:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 32px
  margin-mobile: 20px
  stack-xs: 8px
  stack-sm: 16px
  stack-md: 24px
  stack-lg: 48px
  stack-xl: 80px
---

## Brand & Style

The brand personality for this design system is **Sophisticated, Tech-Forward, and Authoritative**. Designed for B2B AI transformation consulting, the UI must command the respect of C-suite executives while signaling cutting-edge technological capability. It avoids the academic feel of traditional institutions by utilizing high-energy color transitions and spacious, modern layouts.

The design style is a blend of **Corporate Modern** and **Glassmorphism**. It utilizes a clean white foundation punctuated by high-fidelity gradients and precise, card-based structures. Visual interest is generated through depth—using subtle shadows and translucent layers—rather than ornamental clutter. The aesthetic emphasizes clarity, scalability, and "The Future of Work," positioning the brand as a premium partner in digital evolution.

## Colors

The palette is anchored by a high-contrast relationship between **Deep Purple (#18003D)** and **Pure White (#FFFFFF)**, ensuring maximum readability and a professional "Enterprise" feel. 

- **Primary Purple (#782DDC)** serves as the brand's core identity, used for key UI elements and navigation.
- **CTA Orange (#FF7A00)** is reserved strictly for conversion points and critical actions, providing a high-visibility contrast against the purple-heavy brand.
- **Surfaces** utilize soft, tinted neutrals (#F8F7FF and #FFF6ED) to differentiate content sections without resorting to harsh grey dividers.
- **The Signature Gradient** represents the "Transformation" aspect of the brand, blending the stability of purple with the kinetic energy of orange. Use this for hero headlines, progress bars, or decorative accents.

## Typography

The design system relies exclusively on **Plus Jakarta Sans** for its modern, geometric, yet approachable character. 

- **Headlines** use heavy weights (800 for H1, 700 for H2/H3) with tighter letter spacing to create a sense of impact and authority.
- **H1 elements** may occasionally utilize the signature brand gradient for "AI-focused" keywords.
- **Body text** maintains a generous 1.6 line-height to ensure readability in long-form whitepapers or case studies.
- **Eyebrow labels** are always uppercase with increased tracking (letter-spacing) to serve as clear section identifiers or "category tags" above headlines.

## Layout & Spacing

This design system follows a **Fluid Grid** philosophy within a max-width container of 1280px for desktop. It uses a 12-column system for maximum flexibility in B2B data presentation.

- **Vertical Rhythm:** Sections are separated by large white spaces (`stack-xl`) to prevent the interface from feeling cluttered or "academic." 
- **Internal Spacing:** Components like cards and input fields use a consistent 24px internal padding.
- **Mobile Reflow:** On mobile devices, the 12-column grid collapses to 1 column. Margins are reduced to 20px. Horizontal scrolling "snap-cards" are preferred for pricing or service features to keep the page length manageable.

## Elevation & Depth

Hierarchy is established through a combination of **Tonal Layers** and **Ambient Shadows**.

- **Level 0 (Background):** Pure White (#FFFFFF).
- **Level 1 (Secondary Backgrounds):** Used for section alternating, utilizing the light purple or warm surface colors.
- **Level 2 (Cards/Floating Elements):** These use a specific "Enterprise Shadow": `0px 10px 30px rgba(24, 0, 61, 0.05)`. This shadow is extremely diffused and utilizes a deep purple tint rather than pure black to maintain brand cohesion.
- **Interaction Depth:** On hover, cards should transition to a Level 3 state, increasing shadow spread and shifting -4px on the Y-axis to provide tactile feedback.

## Shapes

The shape language is primarily **Rounded (0.5rem / 8px)** for standard UI elements like small buttons or tags, but expands significantly for larger containers.

- **Standard Elements:** 12px (`rounded-lg`) for buttons and input fields to feel modern and accessible.
- **Containers/Cards:** 20px (`rounded-xl`) for main cards to create a distinct, premium "app-like" appearance that differentiates from traditional web layouts.
- **Pills:** Badges and status indicators are fully rounded (999px) to provide visual variety against the structured grid.

## Components

### Buttons
- **Primary:** Background #FF7A00, White text, 12px radius. Weight 700. Add a subtle orange glow shadow on hover.
- **Secondary:** Transparent background, #782DDC border (1.5px), #782DDC text. 12px radius.

### Cards
- **Construction:** White background, #E7E2F3 border (1px), 20px corner radius.
- **Effect:** Apply "Level 2" shadow. On hover, the border color should darken to #782DDC.

### Input Fields
- **Styling:** 50px height, 12px radius, #E7E2F3 border.
- **Focus State:** 1.5px solid #782DDC border with a soft #782DDC outer glow (4px spread at 10% opacity).

### Badges & Chips
- **Tier/Category:** Pill-shaped, #F4EEFF background with #782DDC text.
- **Highlight/New:** Pill-shaped, #FFF6ED background with #FF7A00 text.

### Lists
- Use custom iconography for bullets—specifically, a small purple gradient circle or a stylized checkmark—to maintain the premium B2B aesthetic.

### Additional Components
- **Lead Gen Form:** A high-contrast surface (Level 1) containing 1-column input fields and a full-width Primary CTA Button.
- **Section Dividers:** Use subtle gradient lines (Primary to Secondary) at 1px height to separate major thematic shifts.