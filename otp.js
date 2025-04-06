const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/educonnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define User Schema
const userSchema = new mongoose.Schema({
    email: String,
    role: String,
    password: String
});
const User = mongoose.model('User', userSchema);
// Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',     // Replace with your email
        pass: 'your-email-password'       // Replace with your email password
    }
});
// Forgot Password Endpoint
app.post('/forgot-password', async (req, res) => {
    const { email, role } = req.body;

    try {
        // Check if email exists in the database
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not found!' });
        }

        // Generate a random OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Send OTP to the user's email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'EduConnect - Password Reset OTP',
            text: `Your OTP for resetting your password is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ success: false, message: 'Error sending OTP.' });
            } else {
                console.log('OTP sent:', info.response);
                res.json({ success: true, message: 'OTP sent successfully!', otp });  // For testing purposes, include the OTP in the response
            }
        });
    } catch (error) {
        console.error('Error during OTP request:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
