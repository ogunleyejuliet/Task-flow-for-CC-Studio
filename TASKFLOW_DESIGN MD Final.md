# TaskFlow — Design System

> Visual, UX, and interaction source of truth for TaskFlow. Use together with `PRD.md`. The PRD defines what the product does; this document defines how it looks, feels, and behaves.

## 1. Product Identity

**Product:** TaskFlow  
**Parent brand:** Catalyst Creative Studio  
**Product type:** Internal task and project management application

TaskFlow should feel clean, modern, calm, professional, creative, efficient, and easy to scan. It should feel like a polished product created by a creative studio, not a generic enterprise dashboard.

## 2. Brand Relationship

Catalyst Creative Studio is the parent brand. TaskFlow is the product.

TaskFlow inherits Catalyst's visual language while maintaining its own product identity.

### Logo

Use an evolved version of the Catalyst star. The TaskFlow symbol should feel rounded, fluid, modern, geometric, and connected to Catalyst.

Primary logo color: Catalyst Powder Blue.

The logo may appear independently as the TaskFlow app icon.

## 3. TaskFlow Brand Assets

TaskFlow has its own product logo and visual identity. The TaskFlow logo is the primary brand mark for the application.

### Official Logo Asset

Store the official TaskFlow logo at:

`/assets/branding/taskflow-logo.svg`

When the official SVG is provided, use that exact asset as the source of truth. Do not recreate, redraw, approximate, or replace the logo with a text treatment, icon-library symbol, CSS shape, or generated logo.

### Logo Usage

- Use the TaskFlow logo as the primary product mark throughout the application.
- Use the logo in the sidebar/header and other appropriate product-brand touchpoints.
- The logo may be used on authentication, loading, onboarding, and empty-state brand moments where appropriate.
- Preserve the original proportions and geometry of the supplied SVG.
- Do not stretch, squash, rotate, distort, or arbitrarily recolor the logo.
- Maintain adequate clear space around the logo.
- Use approved logo variants only.

### Parent Brand Relationship

TaskFlow is an internal product of Catalyst Creative Studio, but TaskFlow has its own distinct logo and product identity.

The TaskFlow logo should therefore be the primary logo shown inside the TaskFlow application. The Catalyst Creative Studio logo should not replace the TaskFlow logo.

Catalyst may be referenced as the parent/agency brand where appropriate, but the product experience should remain clearly TaskFlow.

### Implementation Rule

If the official TaskFlow logo exists in the repository, always use the supplied asset instead of recreating it.

Expected repository location:

`assets/branding/taskflow-logo.svg`

## 4. Color System

TaskFlow uses a focused blue palette derived from the Catalyst Creative Studio visual direction, while maintaining its own distinct product identity.

### Primary Product Palette

| Token | Hex | Role |
|---|---|---|
| TaskFlow Blue 100 | `#9EC8F8` | Primary brand blue, logo, brand accents, selected states |
| TaskFlow Blue 200 | `#6DA8F0` | Secondary blue, active accents, highlights |
| TaskFlow Blue 700 | `#2F6DB5` | Strong functional blue, primary CTAs, links, focus states |
| TaskFlow Powder | `#CFE8FF` | Soft supporting tint, cards, tinted surfaces, subtle backgrounds |

### `#9EC8F8` — Primary TaskFlow Blue

This replaces the previous Catalyst Powder Blue as the main TaskFlow brand color.

Use it for:
- TaskFlow logo
- Primary brand accents
- Brand illustrations and decorative elements
- Active indicators
- Soft emphasis

Do not use it as a background for small white text where contrast is insufficient.

### `#6DA8F0` — TaskFlow Blue 200

Use for:
- Secondary accents
- Highlighted UI elements
- Progress indicators
- Charts and data-visualization accents
- Hover and active treatments where appropriate

### `#2F6DB5` — TaskFlow Blue 700

This is the strongest functional blue.

Use for:
- Primary CTA buttons
- Links
- Important interactive controls
- Focus indicators
- High-emphasis active states
- White text on blue controls when contrast requirements are met

### `#CFE8FF` — TaskFlow Powder

This is a supporting tint, not the primary brand color.

Use it for:
- Card backgrounds
- Tinted surfaces
- Selected/active background treatments
- Soft information panels
- Empty-state backgrounds
- Subtle highlights
- Backgrounds behind illustrations or decorative elements

Avoid using it for important text or small UI elements that require strong contrast.

### Neutral Colors

| Token | Hex | Usage |
|---|---|---|
| White | `#FFFFFF` | Cards, panels, inputs, primary surfaces |
| Page Background | `#F8FAFC` | Main application background |
| Border | `#E5E7EB` | Borders, dividers, input outlines |
| Primary Text | `#111827` | Headings and primary content |
| Secondary Text | `#4B5563` | Supporting content |
| Muted Text | `#6B7280` | Metadata, captions, placeholders |

### Semantic Colors

Use semantic colors independently from the TaskFlow brand palette.

- **Success:** completed tasks and successful actions
- **Warning:** approaching deadlines and caution states
- **Error:** failed actions and destructive states
- **Info:** informational messages

Semantic colors should not be replaced by blue simply because blue is the TaskFlow brand color.

### Color Hierarchy

1. `#2F6DB5` — strongest functional blue
2. `#9EC8F8` — primary TaskFlow brand blue
3. `#6DA8F0` — secondary supporting blue
4. `#CFE8FF` — soft card/background tint
5. Neutrals — structure, surfaces, and text

The interface should remain predominantly neutral, with blue used intentionally for brand identity, interaction, emphasis, and supporting visual moments.

### Accessibility

- Target WCAG AA contrast for normal text and essential UI controls.
- Do not rely on color alone to communicate status, priority, errors, or success.
- Use icons, labels, borders, or other visual cues alongside color.
- Use `#2F6DB5` for high-emphasis interactive elements when a stronger blue is required.
- Use `#CFE8FF` primarily as a surface/background tint rather than a text color.

## 6. Neutral Colors

| Token | Hex | Use |
|---|---|---|
| White | `#FFFFFF` | Cards, inputs, modals, surfaces |
| Page Background | `#F8FAFC` | Default app background |
| Border | `#E5E7EB` | Borders and dividers |
| Primary Text | `#111827` | Headings, task names, navigation |
| Secondary Text | `#4B5563` | Supporting information |
| Muted Text | `#6B7280` | Secondary metadata and placeholders |

Do not use muted text for essential information.

## 7. Semantic Colors

Use semantic colors independently of the brand color:

- **Success:** green — completed tasks and successful actions
- **Warning:** amber — approaching deadlines and attention-required states
- **Error:** red — errors, invalid fields, failed actions, destructive actions
- **Information:** blue — informational and helpful system messages

Never communicate meaning through color alone. Pair color with text and/or icons.

## 8. Typography

### Font

Use **Poppins** where available.

Fallback: `Inter, system-ui, sans-serif`

### Type Scale

| Style | Size | Weight | Line height |
|---|---:|---:|---:|
| Display | 32px | 700 | 40px |
| Page Heading | 24px | 700 | 32px |
| Section Heading | 18px | 600 | 26px |
| Body | 16px | 400 | 24px |
| Body Small | 14px | 400 | 22px |
| Caption | 12px | 400–500 | 18px |
| Button | 14px | 500–600 | 20px |

Prioritize readability and scanning over decorative typography.

## 9. Spacing

Use a 4px spacing system:

`4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px`

Prefer these values over arbitrary spacing.

## 10. Border Radius

| Token | Value | Use |
|---|---:|---|
| Small | 6px | Small controls |
| Medium | 8px | Inputs and buttons |
| Large | 12px | Cards |
| XL | 16px | Large containers |
| Full | 999px | Pills, badges, avatars |

Keep rounding soft but professional.

## 11. Shadows

Prefer spacing, borders, and surface contrast over heavy shadows.

Use subtle elevation only for dropdowns, popovers, modals, and floating panels.

## 12. Layout

TaskFlow is a responsive web application.

Desktop structure:

```text
┌───────────────────────────────────────────────┐
│                    Topbar                     │
├──────────────┬────────────────────────────────┤
│   Sidebar    │          Main content          │
│              │                                │
└──────────────┴────────────────────────────────┘
```

Use generous whitespace. Do not overload a viewport.

## 13. Navigation

Primary navigation uses a left sidebar.

```text
TASKFLOW
Catalyst Creative Studio

Dashboard

WORK
  My Tasks
  Projects
  Calendar

TEAM
  Members

──────────────────

Settings
Help

──────────────────
User
Role
```

Active navigation should have a subtle blue background, strong text, and an appropriate icon. Do not rely on color alone.

## 14. Buttons

### Primary

Use for the most important action.

```text
Background: #2F6DB5
Text: #FFFFFF
Radius: 8px
Height: 40–44px
```

Example: `+ Create task`

States: default, hover, pressed, focus, disabled.

### Secondary

```text
Background: #FFFFFF
Border: #D1D5DB
Text: #111827
Radius: 8px
```

Example: `Cancel`

### Tertiary

```text
Background: transparent
Text: #2F6DB5
```

Example: `View all`

### Destructive

Use the semantic error color for actions such as `Delete task`.

## 15. Form Controls

Inputs:

- Height: 40–44px
- Radius: 8px
- Default border: `#D1D5DB`

Every field should have a label, control, optional helper text, and error state where applicable.

Do not rely on placeholder text as the only label.

## 16. Task Cards

A task card should make these items scannable:

- Task name
- Project
- Assignee
- Status
- Priority
- Due date

Example:

```text
┌─────────────────────────────────────────┐
│ Design mobile onboarding                │
│ Catalyst Website                        │
│                                         │
│ Leye Juliet          High               │
│ Due Sep 14            In progress       │
└─────────────────────────────────────────┘
```

Avoid unnecessary information.

## 17. Task Status

Supported statuses:

- To Do
- In Progress
- Completed
- Blocked

Use text plus color and optionally an icon:

```text
○ To Do
◐ In Progress
✓ Completed
! Blocked
```

Never use color alone.

## 18. Priority

Levels:

- Low — neutral
- Medium — blue
- High — amber
- Urgent — red

Priority must remain visually distinct from status.

## 19. Cards

Default:

```text
Background: #FFFFFF
Border: #E5E7EB
Radius: 12px
```

Use cards to group related information. Avoid excessive card nesting.

## 20. Badges

```text
Height: 24–28px
Radius: 999px
Font: 12px
Weight: 500
```

Use subtle tinted backgrounds rather than highly saturated backgrounds.

## 21. Avatars

Support profile images and initials fallbacks.

Recommended sizes: 24px, 32px, 40px, 48px.

## 22. Dashboard

The dashboard should quickly answer:

1. What do I need to do?
2. What's due soon?
3. What needs attention?
4. How is work progressing?

Recommended structure:

```text
Good morning

Here's what's happening with your work.

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ My Tasks     │ │ Due Soon     │ │ Completed    │
│ 12           │ │ 4            │ │ 28           │
└──────────────┘ └──────────────┘ └──────────────┘

My Tasks
────────────────────────────────────

Upcoming
────────────────────────────────────

Project Progress
────────────────────────────────────
```

Do not overload the dashboard with unnecessary analytics.

## 23. Tables

Use tables for structured comparison and scanning.

```text
Task              Assignee       Status        Due
────────────────────────────────────────────────────
Website homepage  User           In Progress   Sep 14
Mobile onboarding User           To Do         Sep 16
Brand assets      User           Completed     Sep 10
```

Use clear headers, consistent row heights, subtle dividers, whitespace, and relevant sort/filter controls.

## 24. Search and Filtering

Search should be easy to find on data-heavy pages.

Relevant filters may include:

- Status
- Assignee
- Priority
- Project
- Due date

Active filters must be obvious and removable.

```text
Search tasks...

[ Status: In Progress × ]
[ Assignee: User × ]
```

## 25. Modals

Use for focused actions such as:

- Create task
- Edit task
- Delete confirmation
- Invite staff

A modal needs a clear title, explanation, obvious actions, and appropriate dismissal.

Avoid using modals for long workflows.

## 26. Drawers

Use drawers for contextual details without taking users away from their current workflow.

Task details may include:

- Description
- Assignee
- Due date
- Priority
- Status
- Comments
- Activity

## 27. Toast Notifications

### Success

```text
✓ Task created
Your task has been added successfully.
```

### Error

```text
Couldn't create task
Something went wrong. Try again.
```

### Warning

```text
Deadline approaching
This task is due tomorrow.
```

Do not put critical information only in a disappearing toast.

## 28. Empty States

Empty states should explain the situation and offer the next useful action.

```text
No tasks yet

Your tasks will appear here once they're assigned.

[ + Create task ]
```

If the user cannot create tasks:

```text
No tasks assigned

You're all caught up for now.
```

## 29. Loading States

Use skeleton loading for larger content areas where possible. Avoid blank screens while content loads.

## 30. Error States

Explain what happened and what the user can do.

```text
Something went wrong

We couldn't load your tasks.

[ Try again ]
```

Avoid unnecessary technical error messages.

## 31. Confirmation

Use confirmation for meaningful or irreversible actions.

```text
Delete task?

This task will be permanently deleted.

[ Cancel ]    [ Delete task ]
```

For reversible actions, prefer undo where appropriate.

## 32. Accessibility

Accessibility is a core requirement.

### Contrast

Target WCAG AA where applicable:

- Normal text: minimum 4.5:1
- Large text: minimum 3:1
- UI components and meaningful graphical objects: minimum 3:1 where applicable

Always test final implemented colors.

The pale powder blue is primarily a brand/accent color, not a background for small white text.

### Focus

All keyboard-interactive elements must have a visible focus state.

### Touch Targets

Interactive controls should generally provide approximately 44 × 44px of usable touch area where practical.

### Keyboard Navigation

Users should be able to navigate interactive elements, operate menus, open/close dialogs, navigate forms, submit forms, and close overlays using the keyboard.

### Color Independence

Never use color alone for status, errors, priority, selection, or completion.

## 33. Responsive Design

Support:

- Desktop
- Tablet
- Mobile

### Desktop

Persistent sidebar.

### Tablet

Sidebar may collapse.

### Mobile

Use:

- Compact top navigation
- Bottom navigation or menu
- Stacked cards
- Full-width controls
- Simplified tables

Do not simply shrink the desktop layout. Reorganize content according to priority.

## 34. Motion

Motion should support understanding rather than decoration.

Recommended durations:

- Small interaction: 150–200ms
- Larger transition: 200–300ms

Good uses:

- Opening menus
- Toasts
- Completing tasks
- Opening drawers
- Drag-and-drop feedback
- Modal transitions

Respect reduced-motion preferences.

## 35. UX Principles

### Clarity over decoration

Users should understand the interface immediately.

### Reduce cognitive load

Show users the information they need when they need it.

### Make the next action obvious

Every major screen should have a clear primary action.

### Keep work visible

Users should easily understand what they are working on, what is next, what is overdue, what is blocked, and what is completed.

### Don't make users think unnecessarily

Use familiar patterns for common interactions.

### Progressive disclosure

Do not show every detail immediately. Reveal deeper information when needed.

## 36. Component Architecture

```text
Foundations
├── Colors
├── Typography
├── Spacing
├── Radius
└── Shadows

Components
├── Button
├── Input
├── Select
├── Checkbox
├── Badge
├── Avatar
├── Card
├── Modal
├── Drawer
├── Toast
├── Tabs
└── Tooltip

Navigation
├── Sidebar
├── Topbar
└── Breadcrumbs

Product Components
├── Task Card
├── Task List
├── Project Card
├── Project Progress
├── Status Badge
├── Priority Badge
└── Team Member

Patterns
├── Dashboard
├── Task Creation
├── Task Details
├── Project Management
├── Team Management
└── Empty States
```

Use reusable components and variants instead of separate components for every state.

Example:

```text
Button
├── variant
│   ├── primary
│   ├── secondary
│   ├── tertiary
│   └── destructive
└── state
    ├── default
    ├── hover
    ├── pressed
    ├── focus
    └── disabled
```

## 37. Implementation Rules

1. Use the design tokens defined here.
2. Do not introduce random colors without a design-system reason.
3. Do not introduce arbitrary spacing when an existing token works.
4. Reuse components.
5. Maintain consistent interaction states.
6. Keep the interface visually calm.
7. Prioritize accessibility.
8. Test responsive layouts.
9. Do not use color alone to communicate meaning.
10. Keep primary actions visually obvious.
11. Avoid unnecessary gradients, shadows, and decoration.
12. Preserve the Catalyst → TaskFlow brand relationship.
13. Keep the TaskFlow logo distinct from the Catalyst master logo.
14. Use powder blue primarily for brand expression and lighter UI accents.
15. Use darker TaskFlow blue for stronger interactive elements.

## 38. Visual Summary

TaskFlow should be:

**Creative enough to feel like Catalyst.**  
**Structured enough to manage real work.**  
**Simple enough to use every day.**

Visual hierarchy:

```text
Neutral surfaces
       ↓
Dark typography
       ↓
Powder blue brand accents
       ↓
Darker TaskFlow blue for interaction
       ↓
Semantic colors for system states
```

Overall experience:

> **Calm. Clear. Creative. Productive.**
