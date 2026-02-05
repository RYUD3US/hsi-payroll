-- =============================================================================
-- HSI Payroll & Timesheet SaaS - Initial Schema (Multi-Tenant, Philippine-Ready)
-- PostgreSQL for Supabase. Run in Supabase SQL Editor or via Supabase CLI.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- TENANTS (SaaS multi-tenancy)
-- -----------------------------------------------------------------------------
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);

-- -----------------------------------------------------------------------------
-- USERS (links to auth.users; app-level profile + role per tenant)
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User-tenant-role: one user can belong to multiple tenants with different roles
CREATE TABLE user_tenant_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'HR', 'Employee', 'Manager')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

CREATE INDEX idx_user_tenant_roles_user ON user_tenant_roles(user_id);
CREATE INDEX idx_user_tenant_roles_tenant ON user_tenant_roles(tenant_id);

-- -----------------------------------------------------------------------------
-- EMPLOYEES (profile, pay rate, tax status, bank — per tenant)
-- -----------------------------------------------------------------------------
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  employee_number TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  job_title TEXT,
  pay_type TEXT NOT NULL CHECK (pay_type IN ('Hourly', 'Monthly', 'Daily')),
  pay_rate NUMERIC(12, 2) NOT NULL CHECK (pay_rate >= 0),
  currency TEXT NOT NULL DEFAULT 'PHP',
  tax_status TEXT CHECK (tax_status IN ('S', 'ME', 'ME1', 'ME2', 'ME3', 'ME4', 'Married', 'Head', 'Additional')), -- Philippine BIR
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  hire_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, employee_number)
);

CREATE INDEX idx_employees_tenant ON employees(tenant_id);
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_active ON employees(tenant_id, is_active) WHERE is_active = true;

-- -----------------------------------------------------------------------------
-- TIMESHEETS (date, start/end, breaks, total hours, status)
-- -----------------------------------------------------------------------------
CREATE TABLE timesheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  time_in TIMESTAMPTZ,
  time_out TIMESTAMPTZ,
  break_minutes INTEGER NOT NULL DEFAULT 0 CHECK (break_minutes >= 0),
  total_hours NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (total_hours >= 0),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Rejected')),
  notes TEXT,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, employee_id, work_date)
);

CREATE INDEX idx_timesheets_tenant_date ON timesheets(tenant_id, work_date);
CREATE INDEX idx_timesheets_employee ON timesheets(employee_id, work_date);
CREATE INDEX idx_timesheets_status ON timesheets(tenant_id, status);

-- -----------------------------------------------------------------------------
-- PAYROLL RUNS (period, check date, status, total cash requirement)
-- -----------------------------------------------------------------------------
CREATE TABLE payroll_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  check_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Processing', 'Approved', 'Paid', 'Cancelled')),
  total_gross NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total_deductions NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total_net NUMERIC(14, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PHP',
  run_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, period_start, period_end)
);

CREATE INDEX idx_payroll_runs_tenant ON payroll_runs(tenant_id);
CREATE INDEX idx_payroll_runs_status ON payroll_runs(tenant_id, status);
CREATE INDEX idx_payroll_runs_dates ON payroll_runs(tenant_id, period_start, period_end);

-- -----------------------------------------------------------------------------
-- PAYROLL ITEMS (per run, per employee: gross, deductions, net)
-- -----------------------------------------------------------------------------
CREATE TABLE payroll_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  regular_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
  overtime_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
  gross_pay NUMERIC(12, 2) NOT NULL DEFAULT 0,
  taxable_income NUMERIC(12, 2) NOT NULL DEFAULT 0,
  withholding_tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
  sss NUMERIC(12, 2) NOT NULL DEFAULT 0,
  philhealth NUMERIC(12, 2) NOT NULL DEFAULT 0,
  pag_ibig NUMERIC(12, 2) NOT NULL DEFAULT 0,
  other_deductions NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_deductions NUMERIC(12, 2) NOT NULL DEFAULT 0,
  net_pay NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PHP',
  notes TEXT,
  is_manual_override BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(payroll_run_id, employee_id)
);

CREATE INDEX idx_payroll_items_run ON payroll_items(payroll_run_id);
CREATE INDEX idx_payroll_items_employee ON payroll_items(employee_id);

-- -----------------------------------------------------------------------------
-- AUDIT LOGS (who changed what, especially for payroll)
-- -----------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(tenant_id, entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(tenant_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER timesheets_updated_at BEFORE UPDATE ON timesheets
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER payroll_runs_updated_at BEFORE UPDATE ON payroll_runs
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER payroll_items_updated_at BEFORE UPDATE ON payroll_items
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) — Users see only their tenant's data
-- -----------------------------------------------------------------------------
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tenant_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's tenant_ids (via user_tenant_roles)
CREATE OR REPLACE FUNCTION auth.user_tenant_ids()
RETURNS SETOF UUID AS $$
  SELECT tenant_id FROM user_tenant_roles WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Tenants: user can only SELECT tenants they belong to
CREATE POLICY tenants_select ON tenants
  FOR SELECT USING (id IN (SELECT auth.user_tenant_ids()));

-- Users: users can read their own row
CREATE POLICY users_select_own ON users
  FOR SELECT USING (id = auth.uid());

-- User-tenant-roles: user can read their own roles
CREATE POLICY user_tenant_roles_select ON user_tenant_roles
  FOR SELECT USING (user_id = auth.uid());

-- Employees: only within user's tenants
CREATE POLICY employees_select ON employees
  FOR SELECT USING (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY employees_insert ON employees
  FOR INSERT WITH CHECK (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY employees_update ON employees
  FOR UPDATE USING (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY employees_delete ON employees
  FOR DELETE USING (tenant_id IN (SELECT auth.user_tenant_ids()));

-- Timesheets: only within user's tenants
CREATE POLICY timesheets_select ON timesheets
  FOR SELECT USING (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY timesheets_insert ON timesheets
  FOR INSERT WITH CHECK (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY timesheets_update ON timesheets
  FOR UPDATE USING (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY timesheets_delete ON timesheets
  FOR DELETE USING (tenant_id IN (SELECT auth.user_tenant_ids()));

-- Payroll runs: only within user's tenants
CREATE POLICY payroll_runs_select ON payroll_runs
  FOR SELECT USING (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY payroll_runs_insert ON payroll_runs
  FOR INSERT WITH CHECK (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY payroll_runs_update ON payroll_runs
  FOR UPDATE USING (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY payroll_runs_delete ON payroll_runs
  FOR DELETE USING (tenant_id IN (SELECT auth.user_tenant_ids()));

-- Payroll items: via payroll_run's tenant
CREATE POLICY payroll_items_select ON payroll_items
  FOR SELECT USING (
    payroll_run_id IN (SELECT id FROM payroll_runs WHERE tenant_id IN (SELECT auth.user_tenant_ids()))
  );
CREATE POLICY payroll_items_insert ON payroll_items
  FOR INSERT WITH CHECK (
    payroll_run_id IN (SELECT id FROM payroll_runs WHERE tenant_id IN (SELECT auth.user_tenant_ids()))
  );
CREATE POLICY payroll_items_update ON payroll_items
  FOR UPDATE USING (
    payroll_run_id IN (SELECT id FROM payroll_runs WHERE tenant_id IN (SELECT auth.user_tenant_ids()))
  );
CREATE POLICY payroll_items_delete ON payroll_items
  FOR DELETE USING (
    payroll_run_id IN (SELECT id FROM payroll_runs WHERE tenant_id IN (SELECT auth.user_tenant_ids()))
  );

-- Audit logs: only within user's tenants
CREATE POLICY audit_logs_select ON audit_logs
  FOR SELECT USING (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY audit_logs_insert ON audit_logs
  FOR INSERT WITH CHECK (tenant_id IN (SELECT auth.user_tenant_ids()));

-- -----------------------------------------------------------------------------
-- OPTIONAL: Service role can manage tenants (for signup/onboarding)
-- -----------------------------------------------------------------------------
-- CREATE POLICY tenants_service_all ON tenants FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
