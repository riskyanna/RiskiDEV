USE portfolio_db;

-- Add item_type column to portfolio table if it doesn't exist
-- We use a stored procedure trick or just simple ALTER IGNORE if supported, 
-- but simpler is just ALTER TABLE. If it fails due to duplicate, we can ignore (or check first).
-- For simplicity in this environment, I'll attempt the ALTER.

ALTER TABLE portfolio 
ADD COLUMN item_type VARCHAR(50) DEFAULT 'web';

ALTER TABLE portfolio 
ADD COLUMN project_url TEXT;

ALTER TABLE pricing_packages 
ADD COLUMN item_type VARCHAR(50) DEFAULT 'web';

-- Update existing records to be 'web' just in case
UPDATE portfolio SET item_type = 'web' WHERE item_type IS NULL;
UPDATE pricing_packages SET item_type = 'web' WHERE item_type IS NULL;
