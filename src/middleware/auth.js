// const adminAuth= (req,res,next)=>{
//     const token="abc";
//     const isAdmin = token==="abc";
//     if(!isAdmin){
//         res.status(404).send("not admin")
//     }
//     else{
       
        
//         next();
//     }

// }

// const userAuth= (req,res,next)=>{
//     const token="user";
//     const isAdmin = token==="user";
//     if(!isAdmin){
//         res.status(404).send("not admin")
//     }
//     else{
       
//         console.log("useauth called");
        
//         next();
//     }

// }

// module.exports={adminAuth,userAuth}