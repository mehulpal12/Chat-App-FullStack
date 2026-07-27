import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

async function checkQueue() {
  console.log("Connecting to RabbitMQ...");
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
    });

    const channel = await connection.createChannel();
    const queueName = "send_otp";

    const q = await channel.assertQueue(queueName, { durable: true });
    console.log(`Queue: ${queueName}`);
    console.log(`Message Count: ${q.messageCount}`);
    console.log(`Consumer Count: ${q.consumerCount}`);

    // Let's try to get one message without consuming (ack/nack)
    const msg = await channel.get(queueName, { noAck: true });
    if (msg) {
      console.log("Found message in queue:");
      console.log(msg.content.toString());
    } else {
      console.log("No messages in queue (or all are currently locked by consumers).");
    }

    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkQueue();
