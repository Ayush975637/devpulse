// const { z } = require('zod')
 
// // User schema for POST and PUT
// const UserSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   email: z.string().email('Invalid email format')
// })
 
// const validate = (schema) => (req, res, next) => {
//   const result = schema.safeParse(req.body)
//   if (!result.success) {
//     return res.status(400).json({
//       error: 'Validation failed',
//       details: result.error.errors.map(e => e.message)
//     })
//   }
//   req.body = result.data
//   next()
// }
 
// module.exports = { validate, UserSchema }
 