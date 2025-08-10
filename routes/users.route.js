const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()

const { Users, userValidationSchema } = require("../models/users.model")

// GET USERS
router.get("/", async (req, res) => {
    try {
        let data = await Users.find()
        res.send({ data, success: true })
    } catch (err) {
        res.status(500).send({ error: err.message, success: false })
    }
})

// register
router.post("/register", async (req, res) => {
    try {
        const { error } = userValidationSchema.validate(req.body)

        if (error) {
            return res.status(400).json({ message: error.details[0].message, success: false });
        }

        const existingUser = await Users.findOne({
            $or: [{ email: req.body.email }, { username: req.body.username }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email yoki username allaqachon mavjud", success: false });
        }

        let hash = await bcrypt.hash(req.body.password, 10)

        const user = new Users({ email: req.body.email, username: req.body.username, password: hash });
        await user.save();

        res.status(201).json({ message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi", success: true });
    } catch (err) {
        res.status(500).json({ message: "Server xatosi", error: err.message });
    }
})

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
    } catch(err) {
        res.status(500).json({ message: "Server xatosi", error: err.message, success: false })
    }
})


module.exports = router