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


module.exports = router