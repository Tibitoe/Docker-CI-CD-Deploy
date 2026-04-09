import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'

const HOST = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API is running' })
})

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, HOST, () => {
    console.log(`API is listening to ${HOST}:${port}`)
  })
}

export default app
