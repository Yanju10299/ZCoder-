import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {Question} from "./question.model.js"

const UserSchema=mongoose.Schema({
    UserName:{
        type : String,
        required: true,
        unique: true,
        trim:true,
        index:true
    },
    Email:{
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,
    },
    FirstName:{
        type : String,
        required: true,
        trim:true,
        index:true,
    },
    MiddleName:{
        type : String,
        trim:true,
    },
    LastName:{
        type : String,
        trim:true,
    },
    DateOfBirth:{
        type:Date,
        required: true, 
    },
    Gender:{
        type: String,
        required: true,
        trim:true,
    },
    FavLanguages:[
        {
            type: String,
            lowercase:true,
            trim:true,
        }
    ],
    Occupation:{
        type: String,
        required: true,
        lowercase:true,
        trim:true,
    },
    Experience:{
        type: Number,
        required: true,
    },
    Rank:{
        type:Array,
        
    },
    Password:{
        type: String,
        required: true,
    },
    ContestCalender:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Contest",
    }],
    Questions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Question",
        }
    ],
    RefreshToken:{
        type:String
    },
    SecurityQuestion:{
        type:String,
        required:true,
        trim:true,
    },
    SecurityAnswer:{
        type:String,
        required:true,
        trim:true,
    },
    events:[{
        name:String,
        date:Date,

    }]
},
{
    timestamps:true
})

UserSchema.pre("save" ,async function (next) {
    console.log(`password=${this.Password}`);
    if(this.isModified("Password"))
    {
        console.log(`password=${this.Password}`);
        bcrypt.hash(this.Password,10,(err,hash)=>{
            console.log(`hash=${hash}`);
            if(err) return next(err);
            else
            {
                console.log(`password=${this.Password}`);
                this.Password=hash;
                console.log(`password=${this.Password}`);
                next();
            }
        });
    }
})

UserSchema.methods.CheckPassword=async function(Password){
    return await bcrypt.compare(Password,this.Password)
}

UserSchema.methods.GenerateAccessToken=async function(){
    const at= await jwt.sign({
        _id:this._id,
        username:this.UserName
    },
    process.env.access_token_secrete,
    {
        expiresIn:"1d",
    }
)
console.log(`jwt generated is ${at}`);
return at;
}

UserSchema.methods.GenerateRefreshToken=async function(){
    jwt.sign({
        _id:this._id,
    },
    process.env.access_token_secrete,
    {
        expiresIn:"10 days",
    }
)
}
export const User=mongoose.model("User",UserSchema);