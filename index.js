const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const users = require("./routes/users.route")

require("dotenv").config()

mongoose.connect(process.env.DB_URI)
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err))

const app = express()

app.use(express.json())
app.use(cors())

app.use("/users", users)

app.listen(3000, () => {
    console.log("server started")
})
