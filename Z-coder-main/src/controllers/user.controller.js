import {ApiErrors} from "../Utilities/api.errors.js"
import {User} from "../Models/user.model.js"
import {Question} from "../Models/question.model.js"
import jwt from "jsonwebtoken"

const registerUser =async (req,res)=>{
    //get data
    //check data
    //validate data
   //user already exist
    //create in DB
    //remove passwor from res
    //check user in DB
    //return res

    
    const data=req.body;
    console.log(data)
    data.firstname.trim();
    data.email.trim();
    const existedmail=await User.findOne({Email:data.email});
    const existedusername=await User.findOne({UserName:data.username});
    if(data.firstname === "")
    {
        await res.status(400).send(new ApiErrors(400,"Firstname is needed"));
    }
    else if(data.email === "")
    {
        await res.send(new ApiErrors(400,"email is needed"));
    }
    else if(data.username === "")
    {
        await res.send(new ApiErrors(400,"username is needed"));
    }
    else if(data.password === "")
    {
        await res.send(new ApiErrors(400,"password is needed"));
    }
    else if(data.dateofbirth===undefined)
    {
        await res.send(new ApiErrors(400,"Date of birth is needed"));
    }
    else if(data.gender === undefined)
    {
        await res.send(new ApiErrors(400,"Gender is needed"));
    }
    else if(existedmail)
    {
        await res.status(405).send(new ApiErrors(301,"Already exists an account with this email"));
    }
    else if(existedusername)
    {
        await res.status(401).send(new ApiErrors(401,"Already exists the username"));
    }
    else if(!(data.password===data.confirmpassword))
    {
        await res.status(403).send(new ApiErrors(403,"Confirm your password"));
    }
    else
    {
            const user=await User.create({
                FirstName: data.firstname,
                MiddleName: data.middlename,
                LastName: data.lastname,
                UserName: data.username,
                Email:data.email,
                DateOfBirth: data.dateofbirth,
                Gender: data.gender,
                FavLanguages: data.favlanguages,
                Occupation: data.occupation,
                Experience: data.experience,
                Rank: [data.platform,data.rank],
                Password: data.password,
                SecurityQuestion:data.securityquestion,
                SecurityAnswer:data.securityanswer
            });
        res.status(200).send(user);
    }
}

const loginuser= async (req,res)=>{

    //get data
    //find username in database
    //compare password
    //redirect to home page

    const data=req.body;
    console.log(data);

    const pass=data.password;
    const user=await User.findOne({UserName:data.username})
    if(!user)
    {
       return res.status(404).send(new ApiErrors(404,"User not found"));
    }
    else
    {
        console.log(user);
        //const iscorrect=await user.CheckPassword(pass);
        //console.log(iscorrect);
        if(pass==user.Password)
        {
            console.log(user);
            //generate access token
            const accesstoken=await user.GenerateAccessToken();
            console.log(`This is an access token ${accesstoken}`);
            const t=accesstoken;
            const options={
                    sameSite: 'None',
                    path:"/",
                   // partitioned: true,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
                    //httpOnly:true,
                    secure:true,
                }
           await res.cookie("Access_Token", t,options)
           res.status(200).send({cook : "set"});
        }
        else
        {
            res.status(405).send("Wrong password");
        }
    }
}                                                         //Error here --->cookie is not setting in browser

const UploadQuestion= async (req,res)=>{
    const data=req.body;
    console.log(data);
    console.log(req.user);
    data.question.trim();
    data.questiontitle.trim();
    if(data.question==="")
    {
        await res.status(400).send(console.error("question is required"));
    }
    else if(data.title==="")
    {
        await res.status(400).send("question title is required");
    }
    else
    {
        let p=false;
        if(data.public=="true")
            p=true;
        const quest=await Question.create({
            UserName:req.user.UserName,
            QuestionStatement:data.question,
            AnsStatement:data.answer,
            Topic:data.questiontopic,
            Title:data.questiontitle,
            Level:data.level,
            IsPublic:p,
            User:req.user._id,
            Technique:data.techniques
        })
        console.log("quest")
        let arr=req.user.Questions;
        if(!arr)
            {
                arr=[];
            }
        arr.push(quest._id);
        await User.updateOne({_id:req.user._id},{Questions:arr});
        console.log("kawa");
        
        res.status(200).send(quest);
    }
}

const forgotpassword= async(req,res)=>{
    const data=req.body;
   // console.log(data);
    const user= await User.findOne({UserName:data.username});
    //console.log("user: ",user);
    if(!user)
    {
        res.status(404).send("user not found");
    }
    else if( data.email==user.Email)
    {
        const q=user.SecurityQuestion;
        const ans=user.SecurityAnswer;
        res.status(200).send({securityquestion:q,securityanswer:ans});
    }
    else
    {
        res.status(401).send("either dob or email is wrong");
    }

}

const verifysecurity= async (req,res)=>{
    //console.log(req.body);
    const user=await User.findOne({UserName:req.body.username});
    //console.log(user);
    //console.log(user.SecurityAnswer);
   // console.log(req.body.securityanswer);
    if(user.SecurityAnswer==req.body.securityanswer)
    {
        //console.log("ok");
        return res.status(200).send("security answer verified")
    }
    else 
    {
        res.status(405).send("wrong answer");
    }
}

const updatepassword=async (req,res)=>{
    const data=req.body;
    console.log(data);
    const user=await User.findOne({UserName:data.username});
    if(!user)
        {
            return res.status(404).send("user not found");
        }
    console.log(user);
    const b=await User.updateOne({_id:user._id},{Password:data.newpassword});
    const user2=await User.findOne({UserName:data.username});
    if(user2.Password==data.newpassword)
    {
        res.status(200).send("ok");
    }
    else
    {
        res.status(501).send("something went wrong while changing password");
    }
}

const logout=async (req,res)=>{
    //console.log(req.cookies.Access_Token );
        let data=req.cookies.Access_Token 
        //console.log(data);
        if(!data)
        {
            res.status(401).send("You are not logged in");
        }
        else
        {
            res.cookie('Access_Token', '', { expires: new Date(0) });
            res.status(200).send("Logged out");
        }

}

const getQuestions=async (req,res)=>{
    try {
        console.log("i am in function");
      const questions = await Question.find({IsPublic:true}).sort({ createdAt: -1 }).limit(50);
      console.log(questions);
      return res.status(200).send(questions)
    } catch (error) {
         console.log(error);
    }
 
 }

 const addComment= async (req,res)=>{
    try {
        const data=req.body;
        console.log(data);
        let quest=await Question.findById(data.questionId);
        const user=req.user;
        const comment={
            Content:data.comment,
            CommentedBy:user.UserName
        }
        let arr=[];
        if(!quest.Comments)
        {
            arr=[];
        }
        else
            arr=quest.Comments
        arr.push(comment);
        await Question.updateOne({_id:quest._id},{Comments:arr});
        //console.log("good one");
        res.status(200).send(quest);
    } catch (error) {
        res.status(500).send(error);
    }
 }

 const myquestions=async (req,res)=>{
    const user=req.user;
    let arr=[];
    console.log(user.Questions);
    if(user.Questions!=[])
    {
        for(let i=0;i>=0;i++)
         {
            if(!user.Questions[i])
            {
                break;
            }
            console.log(user.Questions[i]);
            const quest= await Question.findOne(user.Questions[i]);
            if(quest==null)
            {
                user.Questions.pull(user.Questions[i]);
                continue;
            }
            console.log(quest);
            let q={
                _id:quest._id,
                Topic:quest.Topic,
                Title:quest.Title,
                Level:quest.Level,
                Technique:quest.Technique,
                QuestionStatement:quest.QuestionStatement,
                AnswerStatement:quest.AnsStatement,
                Comments:quest.Comments,
            }
            arr.push(q);
        };
    }
    else
    {
        return res.send(arr);
    }
    res.status(200).send(arr);
 }

 const search=async (req,res)=>{
    console.log(req.body);
    const questionstopic = await Question.find({IsPublic:true,Topic:req.body.key}).sort({ createdAt: -1 }).limit(50);
    const questionstech = await Question.find({IsPublic:true,Technique:req.body.key}).sort({ createdAt: -1 }).limit(50);
    const questionsuser = await Question.find({IsPublic:true,UserName:req.body.key}).sort({ createdAt: -1 }).limit(50);
    const questionslevel = await Question.find({IsPublic:true,Level:req.body.key}).sort({ createdAt: -1 }).limit(50);
    const questions = [...questionstopic, ...questionstech, ...questionsuser, ...questionslevel];
    let arr=[];
    questions.forEach(quest => {
        let obj={
                _id:quest._id,
                UserName:quest.UserName,
                Topic:quest.Topic,
                Title:quest.Title,
                Level:quest.Level,
                Technique:quest.Technique,
                QuestionStatement:quest.QuestionStatement,
                AnswerStatement:quest.AnsStatement,
                Comments:quest.Comments,
        }
        arr.push(obj);
    });
    console.log(arr);
    return await res.status(200).send(arr);
 }

const deletequestion = async (req,res)=>{
    try {
        const data=req.body;
        const user=req.user;
        console.log(user);
        console.log("data : ",JSON.stringify(data));
    
        await Question.findByIdAndDelete(data.qId)
    
        let arr=user.Questions;
        arr.pull(data.qId);
        await User.updateOne({_id:user._id},{Questions:arr});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
    await res.status(200).send("ok");
}

const profile= async (req,res)=>{
    console.log(req.user);
    const user=req.user;
    res.status(200).send(user);
}

const updateusername=async (req,res)=>{
    console.log(JSON.stringify(req.body));
    console.log(req.user._id);
    try {
        await User.updateOne({_id:req.user._id},{UserName:req.body.username});
    } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).send("ok");

}

const updatefullname=async (req,res)=>{
    console.log(JSON.stringify(req.body));
    try{
        await User.updateOne({_id:req.user._id},{FirstName:req.body.firstname,MiddleName:req.body.middlename,LastName:req.body.lastname})
        res.status(200).send("ok");
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send(error)
    }
}


const updateemail=async (req,res)=>{
    console.log(JSON.stringify(req.body));
    console.log(req.user._id);
    try {
        await User.updateOne({_id:req.user._id},{Email:req.body.email});
    } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).send("ok");

}

const updatedob=async (req,res)=>{
    console.log(JSON.stringify(req.body));
    console.log(req.user._id);
    try {
        await User.updateOne({_id:req.user._id},{DateOfBirth:req.body.dateofbirth});
    } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).send("ok");

} 

const updategender=async (req,res)=>{
    console.log(JSON.stringify(req.body));
    console.log(req.user._id);
    try {
        await User.updateOne({_id:req.user._id},{Gender:req.body.gender});
    } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).send("ok");
}

const updateoccupation=async (req,res)=>{
    try {
        await User.updateOne({_id:req.user._id},{Occupation:req.body.occupation});
    } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).send("ok");
}

const updateexp=async (req,res)=>{
    try {
        await User.updateOne({_id:req.user._id},{Experience:req.body.experience});
    } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).send("ok");
}

const updatefavlang=async (req,res)=>{
    try {
        let arr=[];
        arr.push(req.body.Lang1);
        arr.push(req.body.Lang2);
        arr.push(req.body.Lang3);
        await User.updateOne({_id:req.user._id},{FavLanguages:arr,});
    } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).send("ok");
}

const updaterank=async (req,res)=>{
    try {
        let arr=[];
        arr.push(req.body.platform);
        arr.push(req.body.rank);
        await User.updateOne({_id:req.user._id},{Rank:arr});
    } catch (error) {
        res.status(500).send(error);
    }
    res.status(200).send("ok");
}

const deleteprofile=async (req,res)=>{
    try {
        const arr=req.user.Questions;
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            await Question.findByIdAndDelete(element);
        }
        const id=req.user._id;
        await User.findByIdAndDelete(id);
        await res.status(200).send({Deleted:true});
    } catch (error) {
        res.status(500).send(error);
    }
}

export {deleteprofile};
export {updaterank};
export {updatefavlang};
export {updateexp};
export {updateoccupation};
export {updategender};
export {updatedob};
export {updateemail};
export {updatefullname};
export {updateusername};
export {profile};
export {deletequestion};
export {search};
export {myquestions};
export {addComment};
export{getQuestions};
export {logout};
export {updatepassword};
export {verifysecurity};
export {forgotpassword};
export {UploadQuestion};
export {loginuser};
export {registerUser};