
const mqtt = require('mqtt'); // ใช้ใน Node.js
// หรือถ้าใช้ในเว็บ
// <script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>

// ตั้งค่า MQTT Broker และ Topic
const broker = "mqtt://good-moose.com"; // เปลี่ยนเป็น MQTT Broker ของคุณ
const topic = "Cycletime"; // เปลี่ยนเป็น topic ที่คุณต้องการ subscribe

// สร้าง MQTT Client
const client = mqtt.connect(broker);

// เมื่อเชื่อมต่อสำเร็จ
client.on('connect', () => {
    console.log("Connected to MQTT Broker");
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error("Subscription error:", err);
        }
    });
});

// เมื่อรับข้อความจาก Broker
client.on('message', (receivedTopic, message) => {
    if (receivedTopic === topic) {
        console.log(`Message received from ${receivedTopic}: ${message.toString()}`);
    }
});

// กรณีเกิดข้อผิดพลาด
client.on('error', (error) => {
    console.error("MQTT Error:", error);
});

// ตัดการเชื่อมต่อ
client.on('close', () => {
    console.log("Disconnected from MQTT Broker");
});
