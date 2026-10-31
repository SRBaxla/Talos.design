# Light Mode Visual Contrast Audit & Implementation Fix Plan

## Executive Summary
A comprehensive visual contrast and accessibility audit was executed across all 14 public routes in Light Mode using the browser subagent. The audit identified the primary root cause affecting headline legibility across all pages, as well as specific component-level contrast failures.

---

## 1. Audit Findings & Contrast Failure Mapping

| Issue Category | Impacted Routes | Root Cause | Severity |
| :--- | :--- | :--- | :--- |
| **Headline Text Gradients** | Home, Services, Web Design, Chatbots, Automation, Solutions, About, Insights, Legal | `.text-gradient-orange` & `.text-gradient-cyan` fade to `#ffedd5` and `#cffafe` (light tones that wash out completely against white backgrounds) | **Critical / High** |
| **Hero Secondary Headline** | Home (`/`) | `.mask-text.line-2` has `opacity: 0.6` on dark text, reducing contrast against the light ray | **High** |
| **Scroll Tracker Percentage** | Home (`/`) | Percentage counter has `opacity: 0.6` on `var(--text-muted)` (`000%` is faint) | **Medium** |
| **Architecture / Process Step Numbers** | `/services/web-design`, `/services/automation` | Background numbers (`01`, `02`, `03`, `04`) use `rgba(..., 0.1)` which are near-invisible on white | **Medium** |
| **Form Placeholders & Input Borders** | `/contact`, Home, `/insights` | `placeholder-[var(--text-muted)]` syntax error in Tailwind (must be `placeholder:text-[var(--text-muted)]`) | **Medium** |
| **MediLife Tech Specs Drawer** | `/solutions/medilife` | Drawer has `.glass-panel` (`bg: rgba(255,255,255,0.9)`) overriding `bg-[#07090E]`, creating light-on-light text | **High** |
| **Studio Micro-labels & Stat Cards** | `/about` (Studio) | "Scroll to learn more" has `opacity-70` on amber text; stat labels use faint muted text | **Medium** |

---

## 2. Implementation Fix Strategy

### Phase 1: CSS Root Token & Text Gradient Upgrade (`src/index.css`)
- Update `.text-gradient-orange` in `:root` to a rich, high-contrast amber-bronze gradient:
  `linear-gradient(135deg, #78350F 0%, #B45309 60%, #92400E 100%)` (WCAG AAA compliant: >7:1 contrast on white).
- Update `.text-gradient-cyan` in `:root` to a rich, high-contrast sapphire-cyan gradient:
  `linear-gradient(135deg, #0C4A6E 0%, #0369A1 60%, #075985 100%)` (WCAG AAA compliant: >8:1 contrast on white).
- Move legacy pastel fade gradients into `.dark-theme` scope so dark mode retains its original vibrant glow.

### Phase 2: Hero Section Contrast Refinement (`src/components/OneWayMirrorHero.css`)
- Update `.mask-text.line-2` to `color: var(--text-secondary); opacity: 0.95;` for crisp, punchy readability.

### Phase 3: Scroll Tracker Precision (`src/components/ScrollTracker.tsx`)
- Update bottom-right percentage indicator to `color: var(--text-secondary); opacity: 0.9;`.

### Phase 4: Process Step Numbers & Architectural Badges (`ServiceWebDesign.tsx`, `ServiceAutomation.tsx`)
- Replace `text-[rgba(245,158,11,0.1)]` and `text-[rgba(0,229,255,0.1)]` with `text-[var(--accent-orange)] opacity-25` and `text-[var(--accent-cyan)] opacity-25`.

### Phase 5: Form Placeholders & Input Borders (`Contact.tsx`, `Home.tsx`, `Insights.tsx`)
- Fix placeholder class to `placeholder:text-[var(--text-muted)]` and label text to `text-[var(--text-secondary)] font-semibold`.

### Phase 6: MediLife Tech Specs Drawer Fix (`SolutionMedilife.tsx`)
- Remove conflicting `.glass-panel` from the drawer modal so `bg-[#07090E]` renders deep midnight black with crisp white/cyan/gold text.

### Phase 7: Studio Page Polish (`Studio.tsx`)
- Remove `opacity-70` from the "Scroll to learn more" indicator and upgrade stat labels to `text-[var(--text-secondary)]`.
