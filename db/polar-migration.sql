-- Add polar_customer_id column to users_metadata table if it doesn't exist
ALTER TABLE users_metadata ADD COLUMN IF NOT EXISTS polar_customer_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_metadata_polar_customer_id ON users_metadata(polar_customer_id);

-- Update the subscriptions table to work with Polar
-- No schema changes needed if the structure is the same, but we might need to migrate data
-- This is a placeholder for any specific Polar-related schema changes
