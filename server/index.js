require('dotenv').config()
const express = require('express')
const cors = require('cors');
require('./src/jobs/github.worker');
const rateLimit = require('express-rate-limit')
// const userRoutes = require('./src/routes/user.routes')
const githubRoutes = require('./src/routes/github.routes');
const app = express()

// Middleware




app.use(cors({
  origin: ['http://localhost', 'http://100.53.241.100']


}));

app.use(express.json())
app.get('/',(req, res) => {
  res.send('Welcome to the API')
})
// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, slow down.' }
}))
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});



app.use('/api/github', githubRoutes);
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() })
})

// Routes
// app.use('/api/users', userRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})