import dotenv from 'dotenv';
import DBConnect from "./DB/index.js";
import app from "./app.js"
import fs from "fs";
import https from "https"

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
    passphrase: "sdk2000"
  }; 


dotenv.config({
    path:"./.env"
})

DBConnect()
.then(()=>{
    console.log("Connected successfully");
    https.createServer(options,app).listen(8000, (port)=> {
        console.log("server listening on",8000);
    })
})
.catch((error)=>{
    console.log(`DB connection failed ${error}`);
})
