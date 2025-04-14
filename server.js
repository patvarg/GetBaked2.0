require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/bookings", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define MongoDB Schema & Model
const BookingSchema = new mongoose.Schema({
    date: String,
    email: String // Store the user's email
});
const Booking = mongoose.model("Booking", BookingSchema);

// Email Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to Send Booking Confirmation Email
async function sendConfirmationEmail(email, date) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Booking Confirmation - Get Baked Amsterdam",
            text: `Thank you for booking your class on ${date}.\n\nSee you soon!`,
            html: `<h3>Booking Confirmed</h3><p>You've booked a class on <b>${date}</b>.</p>`
        });
        console.log("Confirmation email sent to:", email);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// API route to create a booking (includes email confirmation)
app.post("/api/book-class", async (req, res) => {
    const { date, email } = req.body;
    if (!date || !email) return res.status(400).json({ message: "Date and email are required." });

    const existingBooking = await Booking.findOne({ date });
    if (existingBooking) return res.status(400).json({ message: "This time slot is already booked!" });

    await Booking.create({ date, email });
    await sendConfirmationEmail(email, date);  // Send Email Confirmation

    res.json({ message: "Booking successful! Confirmation email sent." });
});

// API route to get all bookings
app.get("/api/bookings", async (req, res) => {
    const bookings = await Booking.find();
    res.json(bookings);
});

// Start the Server
app.listen(5000, () => console.log("Server running on port 5000"));
