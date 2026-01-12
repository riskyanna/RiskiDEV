
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { db } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads')
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password])
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] })
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get Portfolio
app.get('/api/portfolio', async (req, res) => {
  const type = req.query.type || 'web'
  console.log('Fetching Portfolio Type:', type) // DEBUG
  try {
    const [rows] = await db.query('SELECT * FROM portfolio WHERE item_type = ? ORDER BY created_at DESC', [type])
    // Ensure image_url is full path if local
    const data = rows.map(item => ({
      ...item,
      image_url: item.image_url && !item.image_url.startsWith('http') 
        ? `http://localhost:3000/uploads/${item.image_url}` 
        : item.image_url
    }))
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add Portfolio (with Image Upload)
app.post('/api/portfolio', upload.single('image'), async (req, res) => {
  const { title, category, description, project_url, item_type } = req.body
  const image_url = req.file ? req.file.filename : req.body.image_url 
  const type = item_type || 'web'

  try {
    await db.query('INSERT INTO portfolio (title, category, image_url, description, project_url, item_type) VALUES (?, ?, ?, ?, ?, ?)', 
      [title, category, image_url, description, project_url, type])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete Portfolio
app.delete('/api/portfolio/:id', async (req, res) => {
  const { id } = req.params
  try {
    await db.query('DELETE FROM portfolio WHERE id = ?', [id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update Portfolio
app.put('/api/portfolio/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params
  const { title, category, description, project_url } = req.body
  
  let image_url = req.body.image_url
  if (req.file) {
    image_url = req.file.filename
  }

  try {
    await db.query(`
      UPDATE portfolio 
      SET title=?, category=?, description=?, project_url=?, image_url=?
      WHERE id=?
    `, [title, category, description, project_url, image_url, id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Track Order Clicks
app.post('/api/orders', async (req, res) => {
  const { service_type } = req.body
  try {
    await db.query('INSERT INTO order_clicks (service_type) VALUES (?)', [service_type])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get Stats
app.get('/api/stats', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM order_clicks')
    res.json({ totalOrders: rows[0].total })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get Pricing Packages
app.get('/api/pricing', async (req, res) => {
  const type = req.query.type || 'web'
  try {
    const [rows] = await db.query('SELECT * FROM pricing_packages WHERE item_type = ? ORDER BY price_min ASC', [type])
    const data = rows.map(row => {
      let features = []
      
      // Handle features - could be string or already parsed
      if (typeof row.features === 'string') {
        try {
          features = JSON.parse(row.features)
        } catch (e) {
          console.error('Failed to parse features:', row.features)
          features = []
        }
      } else if (Array.isArray(row.features)) {
        features = row.features
      } else if (row.features) {
        // Might be a Buffer or other object
        try {
          features = JSON.parse(row.features.toString())
        } catch (e) {
          console.error('Failed to convert features:', e)
          features = []
        }
      }
      
      return {
        ...row,
        features
      }
    })
    res.json(data)
  } catch (err) {
    console.error('Pricing fetch error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Add Pricing Package
app.post('/api/pricing', async (req, res) => {
  const { name, category, price_min, price_max, description, features, is_best_seller, whatsapp_message, item_type } = req.body
  const type = item_type || 'web'
  try {
    await db.query(`
      INSERT INTO pricing_packages 
      (name, category, price_min, price_max, description, features, is_best_seller, whatsapp_message, item_type) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [name, category, price_min, price_max, description, JSON.stringify(features), is_best_seller, whatsapp_message, type])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update Pricing Package
app.put('/api/pricing/:id', async (req, res) => {
    const { id } = req.params
    const { name, category, price_min, price_max, description, features, is_best_seller, whatsapp_message, item_type } = req.body
    try {
      await db.query(`
        UPDATE pricing_packages 
        SET name=?, category=?, price_min=?, price_max=?, description=?, features=?, is_best_seller=?, whatsapp_message=?, item_type=?
        WHERE id=?`, 
        [name, category, price_min, price_max, description, JSON.stringify(features), is_best_seller, whatsapp_message, item_type, id])
      res.json({ success: true })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

// Delete Pricing Package
app.delete('/api/pricing/:id', async (req, res) => {
  const { id } = req.params
  try {
    await db.query('DELETE FROM pricing_packages WHERE id = ?', [id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

export default app
