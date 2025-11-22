# Website Color Palette

This document lists all color codes and their names used throughout the website.

## Primary Brand Colors (Emerald/Teal)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Emerald 500 | `#10b981` | Primary brand color, buttons, accents, active states |
| Emerald 400 | `#10b981` | Text highlights, live indicators |
| Emerald 600 | `#059669` | Button backgrounds, hover states |
| Emerald 700 | `#059669` | Button hover states |
| Teal 500 | `#14b8a6` | Secondary brand color, gradients |
| Teal 600 | `#14b8a6` | Gradient endpoints |
| Green 500 | `#22c55e` | Accent color, scroll progress |

## Neutral Colors (Slate/Gray)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Slate 900 | `#0f172a` | Background color (dark) |
| Slate 800 | `#1e293b` | Card backgrounds, secondary backgrounds |
| Slate 700 | `#334155` | Chat bubbles, inactive elements |
| Slate 600 | `#475569` | Borders, inactive states |
| Slate 500 | `#64748b` | Secondary text |
| Slate 400 | `#94a3b8` | Muted text, placeholders |
| Slate 300 | `#cbd5e1` | Light text on dark backgrounds |
| Slate 200 | `#e2e8f0` | Text color (from GooeyNav) |
| Gray 700 | `#374151` | Borders, inactive workflow nodes |
| Gray 400 | `#9ca3af` | Secondary text, icons |

## Dark Background Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Dark Background 1 | `#1E1E1E` | Chatbot background |
| Dark Background 2 | `#2D2D2D` | Input fields, chat bubbles |
| Black | `#000000` | Notion brand color, pure black |

## Accent Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Blue 500 | `#2D7FF9` | Chat button, user messages, focus rings |
| Blue 600 | `#2563eb` | Button hover states |
| Red 500 | `#ef4444` | Error states, destructive actions |
| Red 600 | `#dc2626` | Error backgrounds, clear buttons |
| Cyan 500 | `#06b6d4` | Gradient endpoints |

## Brand Integration Colors (Workflow Demo)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Gmail Red | `#ea4335` | Gmail workflow node |
| Slack Purple | `#4a154b` | Slack workflow node |
| Notion Black | `#000000` | Notion workflow node |

## White & Transparent

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| White | `#ffffff` | Primary text, icons |
| Transparent | `transparent` | Overlays, backgrounds with opacity |

## HSL Color Variables (from globals.css)

### Light Mode Variables
- Background: `hsl(0 0% 100%)` - White
- Foreground: `hsl(0 0% 3.9%)` - Near black
- Primary: `hsl(0 0% 9%)` - Dark gray
- Secondary: `hsl(0 0% 96.1%)` - Light gray
- Muted: `hsl(0 0% 96.1%)` - Light gray
- Destructive: `hsl(0 84.2% 60.2%)` - Red
- Border: `hsl(0 0% 89.8%)` - Light gray border

### Dark Mode Variables (Active)
- Background: `hsl(0 0% 3.9%)` - Very dark gray
- Foreground: `hsl(0 0% 98%)` - Near white
- Primary: `hsl(0 0% 98%)` - Near white
- Secondary: `hsl(0 0% 14.9%)` - Dark gray
- Muted: `hsl(0 0% 14.9%)` - Dark gray
- Destructive: `hsl(0 62.8% 30.6%)` - Dark red
- Border: `hsl(0 0% 14.9%)` - Dark gray border

## Color Usage Summary

### Primary Palette
- **Emerald Green** (`#10b981`) - Main brand color
- **Teal** (`#14b8a6`) - Secondary brand color
- **Dark Slate** (`#0f172a`, `#1e293b`) - Backgrounds
- **White** (`#ffffff`) - Text and icons

### Accent Colors
- **Blue** (`#2D7FF9`) - Interactive elements, chat
- **Red** (`#ef4444`, `#dc2626`) - Errors, destructive actions
- **Green** (`#22c55e`) - Success states, accents

### Opacity Variations
Many colors are used with opacity modifiers (e.g., `/10`, `/20`, `/30`, `/50`, `/95`) for:
- Overlays
- Borders
- Backgrounds with transparency
- Glass morphism effects

## Tailwind Color Classes Used

The website primarily uses Tailwind CSS color classes:
- `emerald-*` (400, 500, 600, 700)
- `teal-*` (500, 600)
- `slate-*` (200, 300, 400, 500, 600, 700, 800, 900, 950)
- `red-*` (400, 500, 600)
- `blue-*` (500, 600)
- `gray-*` (400, 700)
- `white` / `black`
- `cyan-*` (500)

