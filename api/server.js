import express from 'express'
import cors from 'cors'

const HOST = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API is running' })
})

app.listen(port, HOST, () => {
  console.log(`API is listening to ${HOST}:${port}`)
})

export default app
