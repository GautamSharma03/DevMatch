const mongoose = require('mongoose')
const validator =require('validator')

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
            lowercase:true,
            required: true,
             unique: true,
             validate(value){
             if(!validator.isEmail(value))
                throw new Error("invalid email address")
             }
        },
        password: {
            type: String,
            required: true
        },
        age: {
            type: String
        },
        gender: {
            type: String
        },
        photoUrl: {
            type: String,
            default:"https://i.pinimg.com/736x/93/e8/d0/93e8d0313894ff752ef1c6970116bad6.jpg"  ,
            validate(value){
                if(!validator.isURL(value))
                   throw new Error("invalid photo url")
                }
        },

        about: {
            type: String,
            default:"this is a default data"
        },
        skills: {
            type: [String]
        },
    } ,{
        timestamps: true,
    }
)



module.exports = mongoose.model("User", userSchema)

