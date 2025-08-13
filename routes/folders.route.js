const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")

const { Folders, folderValidationSchema } = require("../models/folders.model")

router.get("/", async (req, res) => {
    try {
        let data = await Folders.find()
        res.send({ data, success: true })
    } catch (err) {
        res.status(500).send(data)
    }
})

router.post("/create-folder", async (req, res) => {
    try {
        const { value, error } = folderValidationSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        let data = await Folders.create(value)
        res.send({ data, success: true })
    } catch (err) {
        res.status(500).send({ error: err.message, success: false })
    }
})

router.get("/show-folder", auth, async (req, res) => {
    try {
        const { id } = req.user
        const data = await Folders.find({ userId: id })
        res.send({ data, succes: true })
    } catch (err) {
        res.status(500).send({ error: err.message, success: false })
    }
})
module.exports = router