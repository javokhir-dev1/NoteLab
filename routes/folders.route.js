const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")

const { Folders, folderValidationSchema } = require("../models/folders.model")
const { Notes } = require("../models/notes.model")

router.get("/", async (req, res) => {
    try {
        let data = await Folders.find()
        res.send({ data, success: true })
    } catch (err) {
        res.status(500).send(data)
    }
})

router.post("/create-folder", auth, async (req, res) => {
    try {
        const { value, error } = folderValidationSchema.validate({ userId: req.user.id, noteName: req.body.noteName })
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

router.get("/show-folder/:id", async (req, res) => {
    try {
        const id = req.params.id
        const folder = await Folders.findOne({ _id: id })
        const notes = await Notes.find({ folderId: id })

        res.send({ folder, notes, success: true })
    } catch (err) {
        res.status(500).send({ error: err.message, success: false })
    }
})

router.delete("/delete-folder/:id", async (req, res) => {
    try {
        const data = await Folders.findByIdAndDelete(req.params.id)
        res.send({ data, success: true })
    } catch (err) {
        res.status(500).send({ error: err.message, success: false })
    }
})
module.exports = router