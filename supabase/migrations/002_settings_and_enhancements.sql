-- =============================================================================
-- HSI Payroll - Settings & Enhancements Migration
-- Adds user settings, holiday pay, currency preferences, and delivery info
-- =============================================================================

-- -----------------------------------------------------------------------------
-- USER SETTINGS (per user, persisted preferences)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  currency TEXT NOT NULL DEFAULT 'PHP' CHECK (currency IN ('PHP', 'USD', 'JPY', 'EUR', 'GBP')),
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  browser_nav_buttons_enabled BOOLEAN NOT NULL DEFAULT true,
  holiday_double_pay_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

CREATE INDEX idx_user_settings_user ON user_settings(user_id);
CREATE INDEX idx_user_settings_tenant ON user_settings(tenant_id);

-- -----------------------------------------------------------------------------
-- HOLIDAYS (per tenant, for holiday pay calculations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  holiday_date DATE NOT NULL,
  is_double_pay BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_holidays_tenant ON holidays(tenant_id);
CREATE INDEX idx_holidays_date ON holidays(tenant_id, holiday_date);

-- -----------------------------------------------------------------------------
-- UPDATE PAYROLL_RUNS (add GL Post Date, Delivery Address, Payout Method)
-- -----------------------------------------------------------------------------
ALTER TABLE payroll_runs
  ADD COLUMN IF NOT EXISTS gl_post_date DATE,
  ADD COLUMN IF NOT EXISTS delivery_address TEXT,
  ADD COLUMN IF NOT EXISTS payout_method TEXT DEFAULT 'Direct Deposit',
  ADD COLUMN IF NOT EXISTS holiday_double_pay_enabled BOOLEAN NOT NULL DEFAULT false;

-- -----------------------------------------------------------------------------
-- UPDATE PAYROLL_ITEMS (add Sick Leave, Paid Leave hours)
-- -----------------------------------------------------------------------------
ALTER TABLE payroll_items
  ADD COLUMN IF NOT EXISTS sick_leave_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_leave_hours NUMERIC(6, 2) NOT NULL DEFAULT 0;

-- -----------------------------------------------------------------------------
-- UPDATE TIMESHEETS (add leave types)
-- -----------------------------------------------------------------------------
ALTER TABLE timesheets
  ADD COLUMN IF NOT EXISTS leave_type TEXT CHECK (leave_type IN ('Regular', 'Sick', 'Paid', 'Holiday')),
  ADD COLUMN IF NOT EXISTS is_holiday BOOLEAN NOT NULL DEFAULT false;

-- -----------------------------------------------------------------------------
-- TRIGGERS
-- -----------------------------------------------------------------------------
CREATE TRIGGER user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER holidays_updated_at BEFORE UPDATE ON holidays
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- User settings: users can read/update their own settings
CREATE POLICY user_settings_select ON user_settings
  FOR SELECT USING (user_id = auth.uid() AND tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY user_settings_insert ON user_settings
  FOR INSERT WITH CHECK (user_id = auth.uid() AND tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY user_settings_update ON user_settings
  FOR UPDATE USING (user_id = auth.uid() AND tenant_id IN (SELECT auth.user_tenant_ids()));

-- Holidays: users can read holidays for their tenants
CREATE POLICY holidays_select ON holidays
  FOR SELECT USING (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY holidays_insert ON holidays
  FOR INSERT WITH CHECK (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY holidays_update ON holidays
  FOR UPDATE USING (tenant_id IN (SELECT auth.user_tenant_ids()));
CREATE POLICY holidays_delete ON holidays
  FOR DELETE USING (tenant_id IN (SELECT auth.user_tenant_ids()));
