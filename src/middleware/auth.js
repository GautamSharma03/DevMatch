const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
        return res.status(401).send("please login")
    }
    const decodedObj = await jwt.verify(token, "DEVMATCH@2025")
    const { _id } = decodedObj;
    const user = await User.findById(_id)
    if (!user) {
        throw new Error("user not found")

    }
    req.user= user
   next()
    } catch (error) {
        res.status(400).send("ERROR: "+error.meessage)
    }

}

module.exports = {userAuth }