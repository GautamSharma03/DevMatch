const validator= require ('validator')



const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body

    if(!firstName || !lastName){
        throw new Error("name not valid")
    }

    else if(firstName.length<4||firstName.length>50){
        throw new Error("firstName should be 4-50 characters")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("enter strong password")
    }

}

module.exports={validateSignUpData}