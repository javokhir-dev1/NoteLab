const express = require("express")
const router = express.Router()

const { Notes, noteValidationSchema } = require("../models/notes.model")

router.post("/create-note", async (req, res) => {
    try {
        let data = await Notes.create(req.body)
        res.send(data)
    } catch(err) {
        res.status(500).send({error: err.message, success: false})
    }
})


module.exports = router