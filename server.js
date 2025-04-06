require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const Message = require("./models/Message"); // Ensure this line exists

const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

console.log("🔍 MONGO_URI:", process.env.MONGO_URI ? "Loaded ✅" : "Not Loaded ❌");
console.log("🔍 EMAIL_USER:", process.env.EMAIL_USER ? "Loaded ✅" : "Not Loaded ❌");
console.log("🔍 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Not Loaded ❌");

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    dbName: "GDG",
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB Atlas - GDG Database"))
  .catch(error => console.error("❌ MongoDB Connection Error:", error));

const studentSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const teacherSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Student = mongoose.model("students", studentSchema);
const Teacher = mongoose.model("teachers", teacherSchema);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
});

async function validateEmail(email) {
        const apiKey = `b0998078cdf07e93957ed8e32a1cc881`;
        const url = `http://apilayer.net/api/check?access_key=${apiKey}&email=${email}&smtp=1&format=1`;

        
            try {
                const response = await axios.get(url);
                const data = response.data;
        
                console.log("📩 Email Validation Response:", JSON.stringify(data, null, 2));
        
                // ✅ Fix: Proper validation logic
                if (!data || !data.format_valid || !data.mx_found || !data.smtp_check) {
                    return false;  // Email is invalid
                }
        
                return true; // Email is valid
            } catch (error) {
                console.error("⚠ Email Validation API Error:", error);
                return false; // Treat API failure as invalid email
            }
        }
        

app.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "❌ All fields are required!" });
    }

    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
        return res.status(400).json({ message: "❌ Invalid or Non-Existent Email Address!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;

        if (role === "student") {
            const existingStudent = await Student.findOne({ email });
            if (existingStudent) {
                return res.status(400).json({ message: "❌ Email already registered as Student!" });
            }
            newUser = new Student({ username, email, password: hashedPassword });
        } else if (role === "teacher") {
            const existingTeacher = await Teacher.findOne({ email });
            if (existingTeacher) {
                return res.status(400).json({ message: "❌ Email already registered as Teacher!" });
            }
            newUser = new Teacher({ username, email, password: hashedPassword });
        } else {
            return res.status(400).json({ message: "❌ Invalid role specified!" });
        }

        await newUser.save();
        console.log(`✅ New ${role} registered:`, newUser);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🎉 Welcome to Our Platform!",
            text: `Hello ${username},\n\nCongratulations! You have successfully registered as a ${role}.\n\nYou can now log in and start using our platform.\n\nBest Regards,\nYour Team`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("⚠ Email Sending Error:", err);
                return res.status(500).json({ success: false, message: "✅ Registered, but confirmation email failed to send." });
            } else {
                console.log("📩 Confirmation Email Sent:", info.response);
                res.status(201).json({ success: true, message: "✅ Registration successful! Confirmation email sent." });
            }
        });

    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "❌ Server error. Please try again." });
    }
});

app.post("/login", async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "❌ Please fill in all fields!" });
    }

    try {
        let user;
        if (role === "student") {
            user = await Student.findOne({ username });
        } else if (role === "teacher") {
            user = await Teacher.findOne({ username });
        } else {
            return res.status(400).json({ message: "❌ Invalid role specified!" });
        }

        if (!user) {
            return res.status(404).json({ message: "❌ User not found. Please register first!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "❌ Invalid credentials!" });
        }

        // ✅ Adding email to the response
        res.status(200).json({ 
            message: "✅ Login successful!", 
            email: user.email  // Ensure that 'email' exists in your database schema
        });

    } catch (error) {
        console.error("❌ Error logging in user:", error);
        res.status(500).json({ message: "❌ Server error. Please try again." });
    }
});

// =============================
// 🚀 FORGOT PASSWORD FUNCTIONALITY ADDED BELOW 🚀
// =============================
const otpStore = {};

app.post("/forgot-password", async (req, res) => {
    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ success: false, message: "❌ Email and role are required!" });
    }

    try {
        const UserModel = role === "student" ? Student : Teacher;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "❌ Email not found!" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = otp;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🔑 Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 5 minutes.`
        };

        transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "✅ OTP sent to your email!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Server error. Please try again." });
    }
});

app.post("/verify-otp", async (req, res) => {
    const { email, otp, newPassword, role } = req.body;

    if (!email || !otp || !newPassword || !role) {
        return res.status(400).json({ success: false, message: "❌ All fields are required!" });
    }

    try {
        if (otpStore[email] !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: "❌ Invalid OTP!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const UserModel = role === "student" ? Student : Teacher;

        await UserModel.updateOne({ email }, { $set: { password: hashedPassword } });

        delete otpStore[email];
        res.status(200).json({ success: true, message: "✅ Password reset successful!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Server error. Please try again." });
    }
});
app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("❌ Error fetching messages:", error);
        res.status(500).json({ success: false, message: "❌ Server error. Please try again." });
    }
});
app.get("/messages/:id", async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }
        res.status(200).json({ success: true, message });
    } catch (error) {
        console.error("❌ Error fetching message:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
});


// Delete a message
app.delete("/messages/:id", async (req, res) => {
    try {
        const deletedMessage = await Message.findByIdAndDelete(req.params.id);
        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }
        res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting message:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
});


// Reply to a message and mark as read
app.post("/messages/reply/:id", async (req, res) => {
    const { reply } = req.body;

    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        // 📧 Configure Nodemailer
        let transporter = nodemailer.createTransport({
            service: "gmail", // Use 'gmail', 'yahoo', 'outlook', etc.
            auth: {
                user: process.env.EMAIL_USER,  // 🔴 Replace with your email
                pass:  process.env.EMAIL_PASS // 🔴 Replace with your email password (or app password)
            },
        });

        // 📩 Send email
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: message.email,
            subject: "Reply to Your Message",
            text: reply,
        });

        console.log("📩 Email sent:", info.response);

        // Mark message as read
        await Message.findByIdAndUpdate(req.params.id, { reply, read: true });

        res.json({ success: true, message: "Reply sent and marked as read" });

    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



app.post("/submit-message", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "❌ All fields are required!" });
    }

    try {
        // ✅ Check if the user already has a feedback entry
        const existingMessage = await Message.findOne({ name });

        if (existingMessage) {
            // ✅ Check if the existing message has been read or not
            if (existingMessage.read === false) {
                console.log("⚠ User already submitted feedback, waiting for review:", existingMessage);

                // ✅ Send email informing user that the previous feedback is still unread
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "⏳ Feedback Pending Review",
                    text: `Hi ${name},\n\nYou have already submitted feedback. The teacher has not yet reviewed your previous feedback.\n\nPlease wait until your previous message is read before submitting a new one.\n\nBest Regards,\nYour Team`
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error("⚠ Email Sending Error:", err);
                        return res.status(500).json({ 
                            success: false, 
                            message: "⚠ You already submitted feedback. Email notification failed." 
                        });
                    } else {
                        console.log("📩 Duplicate Feedback Email Sent:", info.response);
                        return res.status(200).json({ 
                            success: false, 
                            message: "⚠ You already submitted feedback. Please wait for a response." 
                        });
                    }
                });
            } else {
                // ✅ If read:true, allow the user to submit a new message
                console.log("✅ Feedback has been reviewed, allowing user to submit new feedback");

                // ✅ Store the new message in MongoDB
                const newMessage = new Message({ name, email, message });
                await newMessage.save();
                console.log("✅ New message stored in database:", newMessage);

                // ✅ Send Thank You Email
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "🙏 Thank You for Your Feedback!",
                    text: `Hi ${name},\n\nThank you for your valuable feedback! We appreciate your time and effort in helping us improve.\n\nBest Regards,\nYour Team`
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error("⚠ Email Sending Error:", err);
                        return res.status(500).json({ 
                            success: false, 
                            message: "✅ Message stored, but thank-you email failed to send." 
                        });
                    } else {
                        console.log("📩 Thank You Email Sent:", info.response);
                        res.status(201).json({ 
                            success: true, 
                            message: "✅ Message sent successfully! Thank you email sent." 
                        });
                    }
                });
            }
        } else {
            // ✅ If there's no existing feedback, store the new message
            const newMessage = new Message({ name, email, message });
            await newMessage.save();
            console.log("✅ New message stored in database:", newMessage);

            // ✅ Send Thank You Email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "🙏 Thank You for Your Feedback!",
                text: `Hi ${name},\n\nThank you for your valuable feedback! We appreciate your time and effort in helping us improve.\n\nBest Regards,\nYour Team`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("⚠ Email Sending Error:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "✅ Message stored, but thank-you email failed to send." 
                    });
                } else {
                    console.log("📩 Thank You Email Sent:", info.response);
                    res.status(201).json({ 
                        success: true, 
                        message: "✅ Message sent successfully! Thank you email sent." 
                    });
                }
            });
        }

    } catch (error) {
        console.error("❌ Error saving message:", error);
        res.status(500).json({ message: "❌ Server error. Please try again." });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
