const express = require("express")
const router = express.Router()

const { Notes, noteValidationSchema } = require("../models/notes.model")

router.get("/", async (req, res) => {
    try {
        const data = await Notes.find()
        res.send({ data, success: true })
    } catch (err) {
        res.status(500).send({ error: err.message, success: false })
    }
})

router.post("/create-note", async (req, res) => {
    try {
        let data = await Notes.create(req.body)
        res.send({ data, success: true })
    } catch (err) {
        res.status(500).send({ error: err.message, success: false })
    }
})

router.patch("/update-note/:id", async (req, res) => {
    try {
        let data = await Notes.findByIdAndUpdate(req.params.id, req.body)
        res.send({ data, success: true })
    } catch (err) {
        res.status(500).send({ error: err.message, success: false })
    }
})

router.delete("/delete-note/:id", async (req, res) => {
    try {
        let data = await Notes.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(404).send({ error: "note not found", success: false })
        }
    } catch (err) {
        res.status(500).send({ error: err.message, success: false })
    }
})

module.exports = router