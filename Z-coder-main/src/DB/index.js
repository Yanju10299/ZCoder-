import mongoose from "mongoose"
import {DB_Name} from "../constants.js"


const connectDb = async ()=>{
    try {
        const connectDB=await mongoose.connect(`mongodb+srv://zcoder:zcoder123@zcoder.3yq8jmz.mongodb.net/${DB_Name}`);
        console.log(`Successfully connected to DB on host: 8000`);
    } catch (error) {
        console.log("MONGODB FAILED TO CONNECT DB",error);
        process.exit(1);
    }
}

export default connectDb;