const amqp = require('amqplib')
const { configDotenv } = require('dotenv')
configDotenv

class Producer {
  channel

  async createChannel() {
    const connection = await amqp.connect(process.env.MESSAGEQUEUE_URL)
    this.channel = await connection.createChannel()
  }

  async publishMessage(routingKey, message) {
    if (!this.channel) {
      await this.createChannel()
    }
    const exchangeName = 'directExchange'
    await this.channel.assertExchange(exchangeName, 'direct')

    const messageDetails = {
      type: routingKey,
      message: message,
      dateTime: new Date(),
    }

    await this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(messageDetails))
    )
  }
}

module.exports = Producer
