USE portfolio_db;
-- Try to add column, if fails (duplicate) it's fine.
ALTER TABLE pricing_packages ADD COLUMN item_type VARCHAR(50) DEFAULT 'web';
UPDATE pricing_packages SET item_type = 'web' WHERE item_type IS NULL;
UPDATE portfolio SET item_type = 'web' WHERE item_type IS NULL;
