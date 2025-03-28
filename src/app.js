const express = require("express");
const { connectDb } = require('./config/database')
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {

    try {
        validateSignUpData(req)
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName, lastName, emailId, password: passwordHash,
        })
        await user.save();
        res.send("user added")
    } catch (error) {
        res.status(400).send("error saving user" + error.message)
    }

})

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        ////validateSignUpData(req);
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {

            //jwt token 
            const token = await jwt.sign({ _id: user._id }, "DEVMATCH@2025")
            

            //adding to cookie and sending back to user


            res.cookie("token", token)
            res.send("login successfull")
        }
        else {
            throw new Error("invalid credentials")
        }
    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})
app.get("/profile", async (req, res) => {

    try {
        const cookie = req.cookies;
        const { token } = cookie
        if (!token) {
            throw new Error("invalid token")
        }
        const decodedMessage = await jwt.verify(token, "DEVMATCH@2025")
        const { _id } = decodedMessage;
        const user = await User.findById(_id)
        if(!user){
            throw new Error("no user found")
        }

        res.send(user)
    }
    catch(error){
        res.status(404).send("Error: " + error.message)

    }

})

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail })
        if (users.length === 0) {
            res.status(404).send("user not found")
        } else {
            res.send(users)

        }
    } catch (err) {
        res.status(400).send("somthing wnt wrong")
    }
})

app.get("/feed", async (req, res) => {


    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        es.status(400).send("somthing wnt wrong")
    }

})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId
 

    try {
        const user = await User.findByIdAndDelete(userId)
        res.send("user deleted successfully ")
    } catch (error) {
        res.status(404).send("user does not exist")
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    const data = req.body

    try {
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "gender", "age", "skills"
        ]

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("update not allowed")
        }
        await User.findByIdAndUpdate(userId, data)
        res.send("user updated")
    } catch (error) {
        res.status(404).send("update failed " + error.message)
    }
})

connectDb()
    .then(() => {
        console.log("connected");
        app.listen(3000, () => {

            console.log("running");

        });
    })
    .catch((err) => {
        console.error("not cnnetec" + error.message)
    })

