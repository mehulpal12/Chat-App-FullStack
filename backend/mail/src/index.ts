import express from "express";
import dotenv from "dotenv";
import { startSentOtpConsumer } from "./consumer.js";

dotenv.config();

const app = express();

//start consuming RabbitMQ
startSentOtpConsumer()

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "mail-service" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}); 