const mongoose = require("mongoose")

const connectDb = async () => {
    await
        mongoose.connect("mongodb+srv://sharmagautam0303:f4L7zrJuGPGKGI6s@cluster0.h2lua.mongodb.net/DevMatch")
}

module.exports = {connectDb}

