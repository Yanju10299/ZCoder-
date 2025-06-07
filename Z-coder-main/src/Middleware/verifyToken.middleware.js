import jwt from "jsonwebtoken"
import {User} from "../Models/user.model.js"

const verifyToken=async (req,res,next)=>{
    //console.log(req.body);
    //console.log('Request Headers:', req.headers);
   // console.log('Request Cookies:', req.cookies);
   // console.log(req.header("Authorization").replace("Bearer ", ""));
    console.log(req.cookies.Access_Token );
        let data=req.cookies.Access_Token 
        console.log(data);
        // if(!data){
        //     data=req.header("Authorization").replace("Bearer ","");
        // }
        // console.log(data);
        if(!data)
        {
            res.status(401).send("You are not logged in");
        }
        else
        {
            if (typeof data !== 'string') {
                return res.status(400).send("Invalid token format");
            }
            const userid= jwt.verify(data,process.env.access_token_secrete);
            const user=await User.findById(userid._id);
            if(!user)
            {
                res.status(401).send("You are not logged in");
            }
            else
            {
                req.user=user;
                next();
            }
        }
    }
export {verifyToken}