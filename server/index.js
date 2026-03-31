require('dotenv').config()
const express = require('express')
const cors = require('cors');
require('./src/jobs/github.worker');
const {apiLimiter}=require('./src/middleware/rateLimiter')
const githubRoutes = require('./src/routes/github.routes');
const app = express()





app.use(cors({
  origin: ['http://localhost', 'http://100.53.241.100', 'http://localhost:5173', 'http://codevex.online'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']


}));

app.use(express.json())
app.get('/',(req, res) => {
  res.send('Welcome to the API')
})
app.use('/api', apiLimiter);


app.use('/api/github', githubRoutes);
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() })
})


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