const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  reply: { type: String, default: "" }, // Stores the teacher's reply
  read: { type: Boolean, default: false }, // Marks if the message has been read
  createdAt: { type: Date, default: Date.now }, // Timestamp for message creation
  repliedAt: { type: Date }, // Timestamp for when the reply was sent
});

module.exports = mongoose.model("Message", MessageSchema);