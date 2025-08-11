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
        res.status(500).send({ error: err.message, success: false })
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
    step: 300,
    digits: 6
};

router.post("/otp", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email talab qilinadi", success: false });
    }

    try {
        const code = totp.generate(process.env.OTP_SECRET);

        await transporter.sendMail({
            from: `"NoteLab" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Sizning OTP kodingiz",
            html: `<h2>OTP kod: <b>${code}</b></h2><p>5 daqiqa ichida amal qiladi.</p>`
        });

        console.log(`OTP ${email} ga yuborildi: ${code}`);

        res.json({ message: "OTP yuborildi", expiresIn: "5 daqiqa", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OTP yuborishda xatolik", success: false });
    }
});

router.post("/verify-otp", (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: "Kod talab qilinadi", success: false });
    }

    const isValid = totp.check(code, process.env.OTP_SECRET);

    if (isValid) {
        res.json({ message: "✅ Kod to'g'ri", success: true });
    } else {
        res.status(400).json({ error: "❌ Kod noto'g'ri yoki muddati o'tgan", success: false });
    }
});



const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if ((!email && !username) || !password) {
            return res.status(400).json({ message: "Email yoki username va parol kiriting", success: false });
        }

        const user = await Users.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Parol noto'g'ri", success: false });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Tizimga muvaffaqiyatli kirdingiz",
            token,
            success: true
        });

    } catch (err) {
        res.status(500).json({ message: "Server xatosi", error: err.message, success: false });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id
        let data = await Users.findByIdAndDelete(id)
        if (!data) {
            return res.status(400).send({ message: "User topilmadi", success: false })
        }

        res.send({ deleted: data, success: true })
    } catch (err) {
        res.status(500).json({ message: "Server xatosi", error: err.message, success: false })
    }
})


module.exports = router