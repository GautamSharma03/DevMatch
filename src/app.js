const express = require('express');
const app = new express;

app.get("/user/logout" ,(req,res)=>{
    try {
        res.send("logut")
    } catch (error) {
        
    }
})




app.listen(3000, () => {

    console.log("running");

});