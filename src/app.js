const express = require('express');
const app = new express;


app.use("/hello", (req, res) => {
    res.send("hello all")
})


app.use("/test", (req, res) => {
    res.send("test")
})



app.listen(3000, () => {

    console.log("running");

});