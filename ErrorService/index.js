const amqp = require('amqplib')
const { configDotenv } = require('dotenv')
configDotenv

const consumeMessagesData = async () => {
  const connection = await amqp.connect(process.env.MESSAGEQUEUE_URL)
  const channel = await connection.createChannel()

  await channel.assertExchange('directExchange', 'direct')

  const errorQueue = await channel.assertQueue('ErrorsAndWarningQueue')

  await channel.bindQueue(errorQueue.queue, 'directExchange', 'Warning')
  await channel.bindQueue(errorQueue.queue, 'directExchange', 'Error')

  channel.consume(errorQueue.queue, (message) => {
    const data = JSON.parse(message.content)
    //console.log(data)
    channel.ack(message)
  })
}
consumeMessagesData()
