const express = require('express');
const { connectDb } = require('./config/database')
const app =  express();
const User = require('./models/user')


app.post("/signup", async (req, res) => {


    const user = new User({
        firstName: "aditya",
        lastName: "sharma",
        emailId: "ggada",
        password: "abcdasd"
    })
try {
    
   await user.save();
   res.send("user added")
} catch (error) {
    res.status(400).send("error saving user" +error.message)
}

})





connectDb().then(() => {
    console.log("connected");
    app.listen(3000, () => {

        console.log("running");

    });
})
    .catch((err) => {
        console.error("not cnnetec")
    })

