# SkyOS — Smart Factory Operating System

A React + TypeScript + Vite frontend for SkyOS, an industrial IoT dashboard platform built by **Sky Technology (Pvt) Ltd** for **Croydon Kowloon Designs Ltd (CKDL)**. The UI is themed with Tailwind CSS v4 and follows a strict semantic color design system where every color has an operational meaning.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | State-based navigation inside modules (no React Router) |
| Charts | Recharts |
| Icons | Lucide React |
| Theme | Custom `ThemeContext` — dark / light |
| Fonts | Geist Variable (`@fontsource-variable/geist`) |

---

## Project Structure

```
src/
├── assets/
│   ├── ckdlelogo.jpg              # CKDL client logo (used in all sidebars)
│   └── skyos.png                  # SkyOS brand logo
├── components/
│   ├── COMMON/
│   │   ├── Topbar.tsx             # Global top navigation bar (hidden in fullscreen)
│   │   ├── Sidebar.tsx            # SPM-1693 Production module sidebar
│   │   └── Profile.tsx            # User profile panel
│   ├── SKY_OS/
│   │   ├── sky_os_landing.tsx     # Home dashboard (command center)
│   │   ├── sky_os_dashboard_chart.tsx
│   │   ├── sky_sidebar.tsx        # SkyOS home sidebar
│   │   ├── sky_auth.tsx           # Auth context & login guard
│   │   ├── sky_login.tsx          # Login page
│   │   ├── sky_splash.tsx         # Splash screen
│   │   └── sky_settings.tsx
│   ├── SPM-1693/
│   │   ├── p_r_dashboard.tsx      # Production tracking dashboard (full-screen fit)
│   │   ├── p_r_setting.tsx        # Plan settings
│   │   └── p_r_update.tsx         # Production update
│   └── PMS-1682(Solar)/
│       ├── sidebar.tsx            # Solar/HVAC module sidebar
│       ├── dashboard.tsx          # Main HVAC dashboard
│       ├── dashboard-mfm.tsx      # MFM unit dashboard
│       ├── dashboard-mfi.tsx      # MFI unit dashboard
│       ├── userprofile.tsx        # User profile page
│       └── reports/
│           ├── details-report.tsx
│           ├── details-report-energy.tsx
│           ├── details-report-intimo.tsx
│           ├── thermal-consuption.tsx
│           └── thermal-consumption-&-ceb.tsx
├── context/
│   └── ThemeContext.tsx
├── pages/
│   ├── SKY_OS_PAGES/
│   │   └── sky_os.tsx             # SkyOS home page shell
│   ├── SPM-1693/
│   │   └── production_tracking_page.tsx
│   └── PMS-1682(Solar)/
│       └── solarpage.tsx          # Solar module shell (state router)
└── App.tsx                        # Root — auth guard + module switcher + fullscreen state
```

---

## Layout & Navigation

### Module Navigation (Topbar)

The `Topbar` is always visible in normal mode and **completely hidden in fullscreen mode**. It contains:

- **SkyOS brand** (left)
- **Module nav buttons** — Dashboard, Andon Sys, Super Market, Production Sys, Energy Monitoring (center)
- **Clock**, theme toggle, **fullscreen button**, notification bell, profile (right)

| Nav Button | Module Key | Page Loaded |
|---|---|---|
| Dashboard | `home` | `sky_os.tsx` → `sky_os_landing.tsx` |
| Andon Sys | `dcsc` | Coming soon placeholder |
| Super Market | `wip` | Coming soon placeholder |
| Production Sys | `production` | `production_tracking_page.tsx` |
| Energy Monitoring | `solar` | `solarpage.tsx` → Solar sub-router |

### Sidebar Behaviour

Each module has its own sidebar. All sidebars share the same responsive behaviour:

| Mode | Behaviour |
|---|---|
| **Desktop normal** | Full sidebar (w-64), always visible, pushes content right |
| **Desktop fullscreen** | Collapses to icon-only mini strip (w-14) |
| **Mini mode** | Shows `☰` button + logo + system tag + nav icons with tooltips |
| **Click `☰`** | Expands sidebar to full width (w-64), pushes content — same `☰` collapses it |
| **Exit fullscreen** | Returns to full sidebar, expanded state resets |
| **Mobile** | Hidden off-screen; floating `Menu` FAB reveals it as a drawer |

#### System Indicator (below logo)

Each sidebar displays a coloured badge below the logo identifying the active system:

| Sidebar | Name line | Code line | Colour |
|---|---|---|---|
| `sky_sidebar.tsx` | Smart Factory OS | SkyOS | Indigo |
| `COMMON/Sidebar.tsx` | Production Tracking | SPM-1693 | Blue |
| `PMS-1682/sidebar.tsx` | Energy Monitoring | PMS-1682 | Teal |

In mini mode this shrinks to a small pill tag (`SKY` / `SPM` / `PMS`).

### Fullscreen Mode

- Triggered by the `⤢` button in the topbar (uses `document.documentElement.requestFullscreen()`)
- **Topbar is hidden** — full viewport given to content + sidebar
- **Sidebar collapses** to mini/icon-only automatically
- Exit with `Esc` (browser native) or the `☰` → navigate flow

---

## Solar Module Sub-Navigation (PMS-1682)

State-based navigation managed in `solarpage.tsx`.

| Sidebar Item | `SolarView` Value | Component |
|---|---|---|
| Dashboard | `"dashboard"` | `dashboard.tsx` |
| Dashboard MFM | `"mfm"` | `dashboard-mfm.tsx` |
| Dashboard MFI | `"mfi"` | `dashboard-mfi.tsx` |
| Details Report | `"details"` | `reports/details-report.tsx` |
| Report Energy | `"energy"` | `reports/details-report-energy.tsx` |
| Report Intimo | `"intimo"` | `reports/details-report-intimo.tsx` |
| Thermal Consumption | `"thermal"` | `reports/thermal-consuption.tsx` |
| Thermal & CEB | `"thermal-ceb"` | `reports/thermal-consumption-&-ceb.tsx` |
| User Profile | `"userprofile"` | `userprofile.tsx` |

---

## Color System

> **Core rule: Every color must have a meaning. Color only appears when it carries information.**

### Color Domains

| # | Domain | Colors |
|---|---|---|
| 1 | Brand Blue | 4 |
| 2 | Operational Status (Green / Amber / Red) | 6 |
| 3 | AI Intelligence (Purple) | 3 |
| 4 | Module Identity (Teal / Cyan / Orange / Indigo) | 4 |
| 5 | Chart / Analytics Palette | 6 |
| 6 | UI Surface & Structure Tokens | 8 |

### 1. Brand Blue — System Identity

| Hex | Purpose |
|---|---|
| `#2563EB` | Primary brand color, active nav state |
| `#1D4ED8` | Hover / pressed states |
| `#EFF6FF` | Active item background (light mode) |
| `#DBEAFE` | Tag / badge fills |

### 2. Operational Status Colors

Reserved exclusively for machine and system states. Never use decoratively.

| Color | Hex | Means |
|---|---|---|
| Green | `#22C55E` | Running / Online / Healthy |
| Amber | `#F59E0B` | Warning / Standby / Attention |
| Red | `#EF4444` | Fault / Offline / Critical |

### 3. AI Intelligence — Purple (Reserved)

| Hex | Purpose |
|---|---|
| `#8B5CF6` | AI predictions, recommendations, forecasts |
| `#F5F3FF` | AI panel background (light) |
| `#4C1D95` | AI text on light backgrounds |

No active AI module yet. Purple must **never** appear as a module identity or decorative color.

### 4. Module Identity Colors

| Module | Color | Hex |
|---|---|---|
| Dashboard / Production (SPM-1693) | Blue | `#2563EB` |
| SkyOS Home | Indigo | `#6366F1` |
| PMS-1682 Solar / HVAC | Teal | `#14B8A6` |
| Quality (future) | Cyan | `#06B6D4` |
| Inventory (future) | Orange | `#F97316` |
| AI Module (future) | Purple | `#8B5CF6` |

### 5. Chart / Analytics Palette

| Series | Hex | Current Use |
|---|---|---|
| 1 | `#14B8A6` | MFM line in energy charts |
| 2 | `#2563EB` | MFI line in energy charts |
| 3–6 | Cyan / Indigo / Purple / Slate | Reserved |

### 6. UI Surface Tokens

| Token | Dark | Light |
|---|---|---|
| Page background | `#020617` | `#f8fafc` |
| Card surface | `#111827` | `#ffffff` |
| Sidebar / nav | `#0f172a` | `#ffffff` |
| Border | `#1e293b` | `#e2e8f0` |
| Text primary | `#f8fafc` | `#0f172a` |
| Text secondary | `#94a3b8` | `#64748b` |
| Text muted | `#475569` | `#94a3b8` |

### Quick Color Decision Reference

| I need to color... | Use |
|---|---|
| Active nav item | Blue `#2563EB` |
| Machine running / system online | Green `#22C55E` |
| Warning / maintenance alert | Amber `#F59E0B` |
| Fault / alarm / critical | Red `#EF4444` |
| AI-generated value | Purple `#8B5CF6` |
| Energy / efficiency metric | Teal `#14B8A6` |
| Quality inspection metric | Cyan `#06B6D4` |
| Inventory / stock metric | Orange `#F97316` |
| Chart data series | Chart palette only |

---

## Development

```bash
npm install
npm run dev
```

Logo asset import (required for Vite bundling):
```ts
import ckdlLogo from '../../assets/ckdlelogo.jpg';
```

Dark / light theme toggle is in the Topbar. Theme state is managed via `ThemeContext` (`useTheme()`) and applied via the `.dark` class on the root element.

---

*SkyOS v2.0 — Sky Technology (Pvt) Ltd · Client: Croydon Kowloon Designs Ltd (CKDL)*
