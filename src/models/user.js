const mongoose = require('mongoose')
const validator =require('validator')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

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
            type: String,
            enum:{
                values:["male","female","other"],
                message:`{value} is not accepted `
            }
        },
        photoUrl: {
            type: String,
            default:"https://i.pinimg.com/736x/93/e8/d0/93e8d0313894ff752ef1c6970116bad6.jpg"  ,
            
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
userSchema.index({firstName:1})
userSchema.index({gender:1})


userSchema.methods.getJWT= async function(){
    const  user=this;
 const token= await  jwt.sign({ _id: user._id }, "DEVMATCH@2025",
        {expiresIn:"1d"})

        return token;
    
}

userSchema.methods.validatePassword =async function(passwordInputByUser){
    const user=this
    const passwordHash=user.password
    const isPasswordValid = await  bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid
}


module.exports = mongoose.model("User", userSchema)

