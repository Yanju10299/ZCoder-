import mongoose from "mongoose"

const contestSchema =mongoose.Schema({
    ContestName:{
        type:String,
        required:true,
        trim:true,
    },
    ContestDate:{
        type:Date,
        required:true,
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    }
    

},{timestamps:true})