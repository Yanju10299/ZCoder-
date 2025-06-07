import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const QuestionSchema=mongoose.Schema({
    UserName:{
        type:String,
        required:true,
    },
    QuestionStatement:{
        type:String,
        required:true,
        trim:true,
    },
    AnsStatement:{
        type:String,
        trim:true,
    },
    Topic:{
        type:String,
        trim:true,
    },
    Title:{
        type:String,
        required:true,
        trim:true,
    },
    Level:{
        type:String,
        trim:true
    },
    Technique:
    {
        type:String,
        required:true,
        trim:true,
    },
    IsPublic:{
        type:Boolean,
        required:true,
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    Comments: [
            {
                Content:String,
                CommentedBy:String
            }
            ],

},
{timestamps:true})

QuestionSchema.plugin(mongooseAggregatePaginate);

export const Question=mongoose.model("Question",QuestionSchema);