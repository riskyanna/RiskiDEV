import { db } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'seed_pricing.sql'), 'utf8');
        await db.query(sql);
        console.log('Pricing data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
