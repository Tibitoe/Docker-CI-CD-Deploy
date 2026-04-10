import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const HOST = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

const app = express()

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check
 *     description: Returns a message confirming the API is running.
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is running
 */
app.get('/', (req, res) => {
  res.json({ message: 'API is running' })
})

// 404 handler
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl}`)
  res.status(404).json({ error: 'Not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled promise rejection:', reason)
  process.exit(1)
})

app.listen(port, HOST, () => {
  console.log(`[INFO] API is listening to ${HOST}:${port}`)
  console.log(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
