# HSI Payroll & Timesheet — Project Structure

## Next.js App Router (Feature-Based)

```
hsi-payroll/
├── app/
│   ├── layout.tsx                 # Root layout (fonts, ThemeProvider)
│   ├── page.tsx                   # Landing → redirect or dashboard
│   ├── globals.css                # Design system (Modern Industrial Dark)
│   ├── (dashboard)/              # Route group: main app
│   │   ├── layout.tsx            # DarkThemeLayout + AppHeader
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard (KPIs + tables)
│   │   ├── payroll/
│   │   │   ├── page.tsx          # Payroll list
│   │   │   └── wizard/
│   │   │       └── page.tsx     # Payroll Wizard (stepper)
│   │   ├── people/
│   │   │   └── page.tsx          # Employees
│   │   └── reports/
│   │       └── page.tsx          # Reports
│   └── (auth)/
│       └── login/
│           └── page.tsx          # Auth (optional)
├── components/
│   ├── ui/                       # Shadcn-style primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── app-header.tsx        # Top nav (no sidebar)
│   │   └── dark-theme-layout.tsx
│   ├── theme/
│   │   └── theme-provider.tsx
│   ├── dashboard/
│   │   ├── kpi-cards.tsx
│   │   ├── quick-actions.tsx
│   │   └── payroll-table-section.tsx
│   ├── payroll/
│   │   ├── payroll-wizard.tsx
│   │   ├── wizard-step-review-time.tsx
│   │   ├── wizard-step-enter-payroll.tsx
│   │   ├── wizard-step-preview.tsx
│   │   └── wizard-step-confirmation.tsx
│   └── timesheet/
│       ├── timesheet-grid.tsx
│       └── approval-queue.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── payroll-engine.ts         # Gross-to-net calculation (Philippine)
│   ├── utils.ts                  # cn(), formatters
│   └── constants.ts
├── types/
│   ├── database.ts               # Supabase-generated types
│   └── payroll.ts
├── stores/
│   └── payroll-wizard-store.ts   # Zustand
├── data/
│   └── mockData.ts               # Mock data for UI dev
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
└── hooks/
    └── use-local-filter.ts       # Client-side table filter
```

## Design System (Modern Industrial Dark)

- **Background:** `#09090b` (zinc-950)
- **Surface:** `#18181b` (zinc-900), borders `#27272a` (zinc-800)
- **Text:** High-contrast white for headers, muted gray for labels
- **Accents:** Status badges (Draft / Approved / Pending)
- **Navigation:** Header only (no sidebar)

## Tech Stack

- Next.js 14+ (App Router), TypeScript (strict)
- Supabase (PostgreSQL, Auth, RLS)
- Tailwind CSS, Shadcn/UI (Radix)
- React Query (server state), Zustand (wizard state)
- React Hook Form + Zod, Lucide React
