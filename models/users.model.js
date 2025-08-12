const mongoose = require("mongoose")
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    username: {
        type: String,
        required: [true, "Username kiritish majburiy"],
        minlength: [3, "Username kamida 3 ta belgidan iborat bo'lishi kerak"],
        maxlength: [20, "Username 20 ta belgidan oshmasligi kerak"],
        match: [/^[a-zA-Z0-9_]+$/, "Username faqat harf, raqam va pastki chiziq (_) bo'lishi mumkin"]
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
            },
            message:
                "Parol kamida 6 ta belgi, bitta katta harf va bitta raqam bo'lishi kerak"
        }
    }
})

const Users = mongoose.model("Users", userSchema)

const userValidationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Yaroqli email kiriting",
      "any.required": "Email kiritish majburiy"
    }),

  username: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.min": "Username kamida 3 ta belgidan iborat bo'lishi kerak",
      "string.max": "Username 20 ta belgidan oshmasligi kerak",
      "string.pattern.base":
        "Username faqat harf, raqam va pastki chiziq (_) bo'lishi mumkin",
      "any.required": "Username kiritish majburiy"
    }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Parol kamida 6 ta belgi, bitta katta harf va bitta raqam bo'lishi kerak",
      "any.required": "Parol kiritish majburiy"
    })
});

module.exports = { Users, userValidationSchema }
