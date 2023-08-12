const express = require('express')
const bodyParser = require('body-parser')
const Producer = require('./producer')
producer = new Producer()
const { configDotenv } = require('dotenv')
configDotenv
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json('application/json'))

app.post('/publish', async (req, res, next) => {
  await producer.publishMessage(req.body.type, req.body.message)
  res.send()
})

app.listen(port, () => {
  console.log(`Server is serving on the PORT ${port}`)
})
