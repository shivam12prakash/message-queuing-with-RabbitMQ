const amqp = require('amqplib')
const { configDotenv } = require('dotenv')
configDotenv

const consumeMessageData = async () => {
  const connection = await amqp.connect(process.env.MESSAGEQUEUE_URL)
  const channel = await connection.createChannel()

  await channel.assertExchange('directExchange', 'direct')

  const dataQueue = await channel.assertQueue('DataQueue')

  await channel.bindQueue(dataQueue.queue, 'directExchange', 'Data')

  channel.consume(dataQueue.queue, (message) => {
    const data = JSON.parse(message.content)
    //console.log(data)
    channel.ack(message)
  })
}
consumeMessageData()
