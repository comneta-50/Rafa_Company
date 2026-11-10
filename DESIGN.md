# RAFA Company — Design System

> Modern AI Workspace · Minimalist Dark · Monochrome + Emerald Green

**Version:** 1.0.0  
**Status:** Initial Design Specification  
**Framework:** React + Vite + Tailwind CSS  
**Typography:** Geist / Inter

---

## 1. Design Philosophy

RAFA Company menggunakan gaya desain Modern AI Workspace yang menggabungkan estetika developer tools seperti Linear dengan pengalaman interaksi AI Chat modern.

### Core Principles

1. **Minimalist:** Hindari dekorasi yang tidak memiliki fungsi.
2. **Functional:** Setiap elemen UI harus memiliki tujuan yang jelas.
3. **Compact:** Informasi padat, tetapi tetap mudah dibaca.
4. **Consistent:** Gunakan design tokens yang konsisten di semua halaman.
5. **Subtle:** Gunakan border dan perubahan warna secara halus.
6. **AI-Native:** AI Chat, Agent Activity, Logs, dan Code Review menjadi bagian utama pengalaman.

### Visual Direction

- Dark-first interface.
- Black and white monochrome foundation.
- Emerald green sebagai aksen utama.
- Rounded rectangle, bukan pill.
- Minimal shadows.
- Clean typography.
- Subtle hover and transition.
- AI chat-inspired interaction.

---

## 2. Color Palette

### Primary Colors

| Token | Hex | Usage |
|---|---|---|
| Background | `#090B0A` | Main application background |
| Surface | `#151916` | Cards and panels |
| Surface Hover | `#1C211D` | Hover states |
| Foreground | `#FFFFFF` | Primary text |
| Muted | `#A1A1AA` | Secondary text |
| Border | `#292D2A` | Borders and dividers |

### Accent Colors

| Token | Hex | Usage |
|---|---|---|
| Primary | `#16A34A` | Primary buttons and active states |
| Primary Hover | `#15803D` | Primary button hover |
| Primary Soft | `#14532D` | Subtle green backgrounds |
| Success | `#4ADE80` | Success indicators |
| Danger | `#EF4444` | Error indicators |
| Warning | `#F59E0B` | Warning indicators |

### Color Usage Rules

- Black is the primary background.
- White is reserved for primary content.
- Emerald green highlights important actions.
- Gray represents secondary information.
- Red is reserved for errors and destructive actions.
- Yellow/orange is reserved for warnings.

Do not overuse green. It should guide attention, not dominate the interface.

---

## 3. Spacing System

Use a consistent 4px spacing scale.

| Token | Value | Usage |
|---|---:|---|
| `space-1` | 4px | Icon-label spacing |
| `space-2` | 8px | Small text spacing |
| `space-3` | 12px | Input and button spacing |
| `space-4` | 16px | Card internal spacing |
| `space-5` | 20px | Component grouping |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Major grouping |
| `space-10` | 40px | Large page spacing |
| `space-12` | 48px | Major section separation |

### Layout Spacing Rules

| Element | Value |
|---|---:|
| Desktop page padding | 28–32px |
| Mobile page padding | 16px |
| Card padding | 20–24px |
| Sidebar padding | 12–16px |
| Dashboard grid gap | 16px |
| Form field gap | 16px |
| Chat message gap | 20px |
| Section gap | 24px |

Avoid arbitrary spacing values unless a specific layout requires them.

---

## 4. Border Radius

Use subtle, crisp rounded corners. Avoid excessive rounding to maintain a sharp, professional developer workspace aesthetic.

| Element | Radius |
|---|---:|
| Small badges | 4px |
| Inputs | 6px |
| Buttons | 6px |
| Dropdowns | 6px |
| Cards | 8px |
| Modals | 10px |
| Main containers | 10px |
| Chat composer | 8px |

### Important Rule

**No pill-shaped buttons.**

Do not use `border-radius: 9999px` for standard buttons. Keep edges clean and modern with subtle 6px-8px rounding.

---

## 5. Typography

Recommended fonts:

- Primary: Geist
- Alternative: Inter
- Monospace: Geist Mono

### Type Scale

| Element | Size | Weight |
|---|---:|---:|
| Page Title | 24px | 600 |
| Section Title | 18px | 600 |
| Card Title | 14px | 600 |
| Body Text | 14px | 400 |
| Secondary Text | 13px | 400 |
| Caption | 12px | 400 |
| Button Text | 13px | 500 |
| Input Text | 14px | 400 |
| Code / Logs | 12–13px | 400 |

### Typography Rules

- Body line-height: 1.5.
- Heading line-height: 1.2–1.3.
- Avoid excessive bold text.
- Use muted colors for descriptions.
- Use tabular numbers for statistics, time, prices, and Neurons.
- Avoid text sizes below 12px for important information.

---

## 6. Button System

All buttons use rounded rectangle styling.

### Button Variants

#### Primary

For the most important action.

- Background: `#16A34A`
- Text: `#FFFFFF`
- Hover: `#15803D`
- Radius: 10px

Examples:
- Execute Fix
- Create Job
- Approve Changes
- Send Command

#### Secondary

For supporting actions.

- Background: `#202522`
- Border: `#363D38`
- Text: `#FFFFFF`
- Radius: 10px

Examples:
- View Details
- Open Repository
- View Logs

#### Outline

For alternative actions.

- Background: transparent
- Border: `#454B47`
- Text: `#FFFFFF`
- Radius: 10px

Examples:
- Cancel Job
- Reject Changes
- Back

#### Ghost

For low-priority actions.

- Background: transparent
- Border: none
- Text: `#A1A1AA`
- Hover: `#1C211D`

Examples:
- More Actions
- Copy
- Refresh
- Close

### Button Dimensions

| Variant | Height | Horizontal Padding |
|---|---:|---:|
| Small | 34px | 14px |
| Medium | 40px | 20px |
| Large | 46px | 24px |
| Icon Button | 36–40px | — |

### Button Interaction

- Hover: subtle background change.
- Active: slightly darker background.
- Disabled: 45–50% opacity.
- Transition: 150–200ms.
- Icon and label gap: 8px.

### Button Restrictions

- No pill buttons.
- No excessive gradients.
- No glowing green shadows.
- No unnecessary oversized buttons.
- Use consistent button dimensions.

---

## 7. Input System

### Standard Input

| Property | Value |
|---|---|
| Height | 40–44px |
| Background | `#151916` |
| Border | `#292D2A` |
| Focus Border | `#16A34A` |
| Radius | 10px |
| Horizontal Padding | 12px |
| Font Size | 14px |
| Placeholder | `#717A73` |

### Input Interaction

- Default: subtle gray border.
- Hover: slightly brighter border.
- Focus: emerald border.
- Disabled: reduced opacity.
- Error: red border and helper text.

---

## 8. AI Chat Composer

The AI command interface should feel like a modern AI chat application.

### Composer Requirements

- Background: `#151916`.
- Border: `1px solid #292D2A`.
- Radius: 16px.
- Minimum height: 100px.
- Padding: 16px.
- Expandable textarea.
- Attachment button.
- Code context button.
- Send button.
- Optional model or agent selector.

### Chat Behavior

- User messages align consistently.
- AI responses use readable text blocks.
- Code snippets use monospace typography.
- Streaming responses should be supported.
- Tool activity should appear as distinct activity items.
- Long AI responses should support collapsible sections.
- Important execution actions must require explicit user approval.

### AI Activity Examples

- Analyzing repository...
- Identifying root cause...
- Preparing code changes...
- Running automated tests...
- Creating pull request...

---

## 9. Card and Panel System

### Standard Card

| Property | Value |
|---|---|
| Background | `#151916` |
| Border | `1px solid #292D2A` |
| Radius | 14px |
| Padding | 20px |
| Shadow | None or minimal |
| Hover | Slightly brighter border |

### Card Rules

- Prioritize border over shadow.
- Avoid unnecessary gradients.
- Use consistent internal spacing.
- Separate sections with subtle dividers.
- Keep titles and descriptions visually hierarchical.

---

## 10. Badge and Status System

Badges use compact rounded rectangles, not pills.

| Status | Color | Usage |
|---|---|---|
| Pending | Gray | Waiting for execution |
| Analyzing | Blue | AI Analyzer running |
| Fixing | Green | Developer agent working |
| Testing | Amber | QA process |
| Review | Purple | Waiting for human review |
| Completed | Emerald | Job completed |
| Failed | Red | Job failed |
| Cancelled | Gray | Job cancelled |

Badge specifications:

- Font size: 11–12px.
- Padding: 4px 8px.
- Radius: 6px.
- Font weight: 500.

---

## 11. Application Layout

### Desktop Layout

| Element | Dimension |
|---|---:|
| Sidebar | 240–260px |
| Topbar | 60–64px |
| Main Content | Flexible |
| Content Max Width | 1440px |
| Page Padding | 28–32px |

### Sidebar Navigation

Recommended navigation:

1. Dashboard
2. Jobs
3. AI Agents
4. Activity Logs
5. GitHub Integration
6. Code Review
7. Settings

### Layout Rules

- Sidebar stays visually separated from the main content.
- Active navigation uses a subtle green background.
- Icons should use consistent dimensions.
- Main content should remain responsive.
- Mobile navigation should use a drawer.
- Avoid fixed-width content that causes horizontal overflow.

---

## 12. Micro-interactions

| Interaction | Behavior |
|---|---|
| Button Hover | Slight background change |
| Card Hover | Border becomes brighter |
| Sidebar Active | Subtle green background |
| AI Processing | Small spinner or pulse |
| Success | Green check icon |
| Error | Red indicator |
| Dropdown | Fade and slight scale |
| Modal | Fade transition |
| AI Response | Streaming text |
| Copy Action | Brief copied feedback |

### Animation Rules

- Standard transition: 150–200ms.
- Use subtle easing.
- Avoid excessive motion.
- Respect reduced-motion preferences.
- Never animate large areas without a functional reason.

---

## 13. Design Tokens (CSS)

```css
:root {
  /* Colors */
  --background: #090B0A;
  --surface: #151916;
  --surface-hover: #1C211D;
  --foreground: #FFFFFF;
  --muted: #A1A1AA;
  --border: #292D2A;

  --primary: #16A34A;
  --primary-hover: #15803D;
  --primary-soft: #14532D;

  --success: #4ADE80;
  --danger: #EF4444;
  --warning: #F59E0B;

  /* Spacing */
  --page-padding: 32px;
  --card-padding: 20px;
  --section-gap: 24px;
  --component-gap: 16px;

  /* Radius - Subtle & Crisp */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 10px;
  --radius-2xl: 12px;

  /* Typography */
  --font-family: "Geist", sans-serif;
  --text-xs: 12px;
  --text-sm: 13px;
  --text-base: 14px;
  --text-lg: 18px;
  --text-xl: 24px;

  /* Effects */
  --transition: 180ms ease;
  --shadow-card: none;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-family);
}

button {
  border-radius: var(--radius-md);
  min-height: 38px;
  padding: 0 16px;
  font-weight: 500;
  transition: var(--transition);
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--card-padding);
}
```

---

## 14. Tailwind CSS Configuration Guidance

Use design tokens as the source of truth.

Recommended implementation:

- Define colors as CSS variables.
- Map variables into Tailwind theme tokens.
- Reuse shared components.
- Avoid repeated hardcoded values.
- Use responsive utilities.
- Use consistent component variants.

Recommended reusable components:

```text
src/components/ui/
├── button.tsx
├── input.tsx
├── textarea.tsx
├── card.tsx
├── badge.tsx
├── dialog.tsx
├── dropdown.tsx
├── tooltip.tsx
├── separator.tsx
├── avatar.tsx
└── skeleton.tsx
```

---

## 15. Application Pages

The design system must be applied consistently to:

| Page | Purpose |
|---|---|
| Dashboard | Overview and system monitoring |
| Jobs | Manage client bug-fixing orders |
| Job Details | Bug report, diagnosis, and execution |
| AI Agents | Monitor Analyzer and Developer |
| AI Chat | Manually command AI agents |
| Activity Logs | View workflow events |
| Code Review | Inspect patches and approve changes |
| GitHub Integration | Manage repository connections |
| Settings | Configure application and system |

---

## 16. UX and Safety Rules

1. AI must never execute code changes without an authorized command.
2. Analyze Only and Execute Fix must be separate actions.
3. Require human approval before final delivery.
4. Display actual job status, not simulated progress.
5. Display real Neurons usage when available.
6. Show clear error messages and retry states.
7. Make destructive actions require confirmation.
8. Never expose API keys or credentials in frontend code.
9. Keep logs accessible for debugging.
10. Make every interactive control perform its advertised action.

---

## 17. Final Design Rules

These rules are mandatory across the application:

- No pill-shaped standard buttons.
- No excessive shadows.
- No excessive gradients.
- No arbitrary spacing values.
- No inconsistent typography.
- No excessive use of accent green.
- No unnecessary decorative elements.
- No inconsistent corner radius.
- No fake system metrics in production.
- No uncontrolled AI execution.

### Design Identity

**RAFA Company should feel like a professional AI developer workspace, not a generic admin dashboard.**

The experience should prioritize AI commands, job execution, agent monitoring, code inspection, and human approval.

Every page should follow the same visual language and interaction patterns.