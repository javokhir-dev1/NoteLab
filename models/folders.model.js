const mongoose = require("mongoose")
const Joi = require("joi")

const folderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    noteName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
})

const Folders = mongoose.model("Folders", folderSchema)

const folderValidationSchema = Joi.object({
    userId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    noteName: Joi.string()
        .trim()
        .max(100)
        .required(),
});

module.exports = { Folders, folderValidationSchema };