const express = require('express')
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const connectionRequest = require('../models/connectionRequest');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"
const User = require("../models/user")


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)


        res.json({
            message: "data fetched success",
            data: connectionRequests,
        })


    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)
        const data = connectionRequests.map((row) => {
            if (row.fromUserId.toString() === loggedInUser._id.toString) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({
            data: data
        })

    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }


})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50 :limit;
        const skip = (page - 1) * limit
        const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })
        const users = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUsersFromFeed) }},
                {_id: {$ne:loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.json({ data: users });
    } catch (error) {
        res.status(404).send("Error: " + error.message)
    }
})



module.exports = userRouter 