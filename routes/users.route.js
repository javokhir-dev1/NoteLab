const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()

const { Users, userValidationSchema } = require("../models/users.model")

require("dotenv").config();

// GET USERS
router.get("/", async (req, res) => {
    try {
        let data = await Users.find()
        res.send({ data, success: true })
    } catch (err) {
        res.status(500).send({ error: "Server error", success: false })
    }
})

const nodemailer = require("nodemailer");
const { totp } = require("otplib")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

totp.options = {
    step: 600,
    digits: 6
};

router.post("/otp", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required", success: false });
    }
    try {
        const code = totp.generate(process.env.OTP_SECRET);

        await transporter.sendMail({
            from: `"NoteLab" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP code",
            html: `<h2>OTP kod: <b>${code}</b></h2><p>Valid within 10 minutes.</p>`
        });

        console.log(`OTP ${email} ga yuborildi: ${code}`);

        res.json({ message: "OTP sent", expiresIn: "5 minutes", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error sending OTP", success: false });
    }
});

router.post("/verify-otp", (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: "Code required", success: false });
    }

    const isValid = totp.check(code, process.env.OTP_SECRET);

    if (isValid) {
        res.json({ message: "The code is correct.", success: true });
    } else {
        res.status(400).json({ error: "The code is invalid or expired", success: false });
    }
});



const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if ((!email && !username) || !password) {
            return res.status(400).json({ error: "Enter your email or username and password", success: false });
        }

        const user = await Users.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(404).json({ error: "User not found", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect", success: false });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "You have successfully logged in",
            token,
            success: true
        });

    } catch (err) {
        res.status(500).json({ error: "Server error", error: err.message, success: false });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id
        let data = await Users.findByIdAndDelete(id)
        if (!data) {
            return res.status(400).send({ error: "User not found", success: false })
        }

        res.send({ deleted: data, success: true })
    } catch (err) {
        res.status(500).json({ message: "Server error", success: false })
    }
})


module.exports = router