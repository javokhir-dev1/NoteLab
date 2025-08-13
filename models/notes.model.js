const mongoose = require("mongoose");
const Joi = require("joi");

const noteSchema = new mongoose.Schema({
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folders",
        required: true,
    },
    message: {
        type: String,
        required: [true, "Message cannot be empty"],
        trim: true,
    }
});

const Notes = mongoose.model("Notes", noteSchema);

const noteValidationSchema = Joi.object({
    folderId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.pattern.base": "Folder ID is in an invalid format",
            "any.required": "Folder ID is required",
        }),
    message: Joi.string()
        .required()
        .trim()
        .messages({
            "string.empty": "Message cannot be empty",
            "any.required": "Message is required",
        }),
});

module.exports = { Notes, noteValidationSchema };
