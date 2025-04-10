const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb+srv://satyadubasi91:0vNRms3ixn80R6KM@cluster0.hzgmy8m.mongodb.net/userdb?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// MongoDB Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  department: String,
});
const User = mongoose.model('User', UserSchema);

// Register Route (Only this one is needed)
app.post('/register', async (req, res) => {
  const { name, email, password, department } = req.body; 

  if (!password || password.length < 5) {
    return res.status(400).json({ message: '❌ Password must be at least 5 characters long' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.json({ message: 'User already exists' });

  const newUser = new User({ name, email, password, department });
  await newUser.save();

  res.json({ message: 'User registered successfully' });
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(5000, '0.0.0.0', () => {
  console.log('🚀 Server running at http://0.0.0.0:5000');
});
