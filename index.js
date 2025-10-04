const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Database config
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const dbName = process.env.MONGO_DB || 'emaildb'; // use emaildb by default

// ✅ Connect to MongoDB
mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${dbName}`)
  .then(() => console.log(`✅ Connected to MongoDB at mongodb://${mongoHost}:${mongoPort}/${dbName}`))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Email schema + model
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  createdAt: { type: Date, default: Date.now }
});

const Email = mongoose.model('Email', emailSchema);

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // your frontend form
});

// Add email
app.post('/add-email', async (req, res) => {
  const { email } = req.body;
  try {
    const newEmail = new Email({ email });
    await newEmail.save();
    console.log(`📩 Saved email: ${email}`);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding email');
  }
});

// Get all emails
app.get('/emails', async (req, res) => {
  try {
    const emails = await Email.find({});
    res.json(emails);
  } catch (error) {
    res.status(500).send('Error fetching emails');
  }
});

// Exit endpoint (for testing only)
app.get('/exit', (req, res) => {
  res.send('Server stopped');
  process.exit(0); // ⚠ Not recommended in production
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
