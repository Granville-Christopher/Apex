const Chat = require("../models/usermodel/messages");
const mongoose = require("mongoose");

const sendChat = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.session.user?._id || req.session.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not logged in" });
    }
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Message text is required" });
    }

    let conversation = await Chat.findOne({ user: userId });

    if (!conversation) {
      conversation = new Chat({
        user: userId,
        messages: [{ sender: "user", text, timestamp: new Date() }],
      });
    } else {
      conversation.messages.push({
        sender: "user",
        text,
        timestamp: new Date(),
      });
    }

    await conversation.save();
    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

const adminReply = async (req, res) => {
  try {
    const { message, text } = req.body;
    const { userId } = req.params; // from URL

    const messageText = text || message;
    if (!messageText) {
      return res.status(400).json({ error: "Message text is required" });
    }

    // Find existing conversation
    let chat = await Chat.findOne({ user: userId });

    // If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({
        user: userId,
        messages: [],
      });
    }

    // Push the new admin message
    chat.messages.push({
      sender: "admin",
      text: messageText,
      timestamp: new Date(),
      read: false,
    });

    await chat.save();

    res.status(200).json({ success: true, chat });
  } catch (err) {
    console.error("Error sending admin reply:", err);
    res.status(500).json({ error: "Failed to send admin reply" });
  }
};

const getUserMessages = async (req, res) => {
  try {
    const userId = req.session.user?._id || req.session.user?.id;

    const chat = await Chat.findOne({ user: userId }).lean();

    if (!chat || chat.messages.length === 0) {
      return res.json({ messages: [] });
    }

    const formattedMessages = chat.messages.map((msg) => ({
      sender: msg.sender,
      message: msg.text,
      createdAt: msg.timestamp,
    }));

    res.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const getUserConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const conversation = await Chat.findOne({ user: userId });

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    const formattedMessages = conversation.messages.map((m) => ({
      senderType: m.sender === "admin" ? "admin" : "user",
      message: m.text,
      timestamp: m.timestamp,
    }));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

const getAllConversations = async (req, res) => {
  try {
    const conversations = await Chat.find().populate("user");
    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ error: "Failed to get conversations" });
  }
};

module.exports = {
  sendChat,
  adminReply,
  getUserMessages,
  getAllConversations,
  getUserConversation,
};
