const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { sendOTPEmail, setForgetPassEmail } = require('../email_appscripts');

var tempOTP = {};
var forgetTimeout = new Map();

// Password hashing function
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to clear old OTPs
const clearOLDOtp = () => {
  for (const email in tempOTP) {
    if (tempOTP[email].timeout < Date.now()) {
      delete tempOTP[email];
    }
  }
};

// Function to clear old reset tokens
const clearOLDResets = () => {
  for (const hash in forgetTimeout) {
    if (forgetTimeout[hash].timeout < Date.now()) {
      delete forgetTimeout[hash];
    }
  }
};

// User Registration
router.post('/register', async (req, res) => {
  const { name, username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOTP();
    sendOTPEmail(email, otp);

    tempOTP[email] = { otp, timeout: Date.now() + 15 * 60 * 1000, name, password, email, username };

    if (tempOTP[email].timeout <= Date.now()) {
      return res.status(400).json({ message: 'OTP already sent' });
    }

    console.log(tempOTP[email]);
    return res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  clearOLDOtp();

  try {
    const { email } = req.body;

    if (!tempOTP[email]) {
      return res.status(400).json({ message: 'Please generate OTP first' });
    }

    const otp = generateOTP();
    sendOTPEmail(email, otp);

    tempOTP[email].otp = otp;
    tempOTP[email].timeout = Date.now() + 5 * 60 * 1000;

    console.log(tempOTP[email]);
    return res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  clearOLDOtp();

  try {
    const { email, otp } = req.body;

    if (!tempOTP[email]) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    tempOTP[email].password = await hashPassword(tempOTP[email].password);

    const newUser = new User(tempOTP[email]);
    await newUser.save();

    res.status(201).json({ id: newUser._id, username: newUser.username, name: newUser.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Attempting to log in with:', username);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ id: user._id, username: user.username, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  clearOLDResets();

  const { email } = req.body;

  for (let [hashKey, v] of forgetTimeout) {
    if (v.email == email) {
      return res.status(400).json({ message: 'Reset link already sent' });
    }
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    var seed = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var hashKey = await hashPassword(process.env.SALT_PASS_FORGET + email + seed);

    forgetTimeout[hashKey] = { email, timeout: Date.now() + 10 * 60 * 1000 };

    var link = process.env.FRONTEND_URL + '/reset-password?token=' + encodeURIComponent(hashKey);
    setForgetPassEmail(email, link);

    return res.status(200).json({ message: 'Reset link sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  clearOLDResets();

  const { token, password } = req.body;

  try {
    var hashKey = token;
    if (!forgetTimeout[hashKey]) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    if (forgetTimeout[hashKey].timeout <= Date.now()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    var user = await User.findOne({ email: forgetTimeout[hashKey].email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.password = await hashPassword(password);
    await user.save();

    delete forgetTimeout[hashKey];

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Balance
router.post('/updateBalance', async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.currentBalance += amount;
    await user.save();

    res.status(200).json({ currentBalance: user.currentBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Balance
router.get('/getBalance/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ currentBalance: user.currentBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;