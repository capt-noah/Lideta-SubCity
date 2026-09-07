-- Add resolution timeframe, admin response note, and escalation phone to complaints table
ALTER TABLE complaints
ADD COLUMN IF NOT EXISTS estimated_resolution_timeframe VARCHAR(100),
ADD COLUMN IF NOT EXISTS estimated_resolution_date DATE,
ADD COLUMN IF NOT EXISTS admin_response TEXT,
ADD COLUMN IF NOT EXISTS admin_contact_phone VARCHAR(100);
