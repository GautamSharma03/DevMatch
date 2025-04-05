const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status: {
        type: String,
        required:true,
        enum: {
            values: ["ignored", "accepted", "interested", "rejected"],
            message: `{VALUE} is incorrect status type `
        }
    }

},
    {
        timestamps: true
    }
)

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send request to yourself")
    }
    next();
})


module.exports = mongoose.model("connectionRequest",connectionRequestSchema)

