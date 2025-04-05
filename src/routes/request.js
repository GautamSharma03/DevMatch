const express = require('express')
const mongoose = require('mongoose')
const requestRouter = express.Router();
const User = require("../models/user")

const { userAuth } = require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest")


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status

        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("invalid status")
        }

        const toUser = await User.findById(toUserId)
        if (!toUser) {
            res.status(400).send("user not exist")
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },

            ],
        })
        if (existingConnectionRequest) {
            return res.status(400).send("connection already exist")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        await connectionRequest.save();
        res.send(`${req.user.firstName} ${status}  ${toUser.firstName}`)

    } catch (error) {
        res.status(400).send("error" + error.message)
    }

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("invalid status")
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status:"interested"
        })
        if(!connectionRequest){
            return res.status(404).send("not connection found")
        }
        connectionRequest.status=status;
        const data = await connectionRequest.save()
        
        res.json({message:"connection request "+status, data});



    } catch (error) {
        res.status(400).send("error" + error.message)
    }

})

module.exports = requestRouter