const express = require("express");
const { connectDb } = require('./config/database')
const app = express();
const cookieParser = require('cookie-parser')
const cors = require("cors")
require('dotenv').config()

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    }
))
app.use(express.json())
app.use(cookieParser())

const authRouter  = require("./routes/auth")
const profileRouter  = require("./routes/profile")
const requestRouter  = require("./routes/request")
const userRouter = require("./routes/user")
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)



connectDb()
    .then(() => {
        console.log("connected");
        app.listen(3000, () => {

            console.log("running");

        });
    })
    .catch((err) => {
        console.error("not cnnetec" + err.message)
    })

