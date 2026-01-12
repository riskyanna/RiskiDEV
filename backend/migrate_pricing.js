
import { db } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrate = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'create_pricing_table.sql'), 'utf8');
        await db.query(sql);
        console.log('Pricing table created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
