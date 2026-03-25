// const express = require('express')
// const router = express.Router()
// const pool = require('../lib/db')
// const { validate, UserSchema } = require('../middleware/validate')
 
// // GET all users
// router.get('/', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users ORDER BY id ASC')
//     res.json(result.rows)
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })
 
// // GET single user
// router.get('/:id', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM users WHERE id = $1',
//       [req.params.id]
//     )
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' })
//     }
//     res.json(result.rows[0])
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })
 
// // POST create user
// router.post('/', validate(UserSchema), async (req, res) => {
//   try {
//     const { name, email } = req.body
//     const result = await pool.query(
//       'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
//       [name, email]
//     )
//     res.status(201).json(result.rows[0])
//   } catch (err) {
//     if (err.code === '23505') {
//       return res.status(400).json({ error: 'Email already exists' })
//     }
//     res.status(500).json({ error: err.message })
//   }
// })
 
// // PUT update user
// router.put('/:id', validate(UserSchema), async (req, res) => {
//   try {
//     const { name, email } = req.body
//     const result = await pool.query(
//       'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
//       [name, email, req.params.id]
//     )
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' })
//     }
//     res.json(result.rows[0])
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })
 
// // DELETE user
// router.delete('/:id', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'DELETE FROM users WHERE id = $1 RETURNING *',
//       [req.params.id]
//     )
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' })
//     }
//     res.json({ message: 'User deleted', user: result.rows[0] })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })
 
// module.exports = router