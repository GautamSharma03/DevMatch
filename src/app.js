const express = require('express');
const { connectDb } = require('./config/database')
const app = express();
const User = require('./models/user');
const user = require('./models/user');

app.use(express.json())

app.post("/signup", async (req, res) => {


    const user = new User(req.body)
    try {

        await user.save();
        res.send("user added")
    } catch (error) {
        res.status(400).send("error saving user" + error.message)
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

