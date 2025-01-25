import {mongoose} from "mongoose";

 mongoose.Promise = global.Promise;
const connectDb = async()=>{
    try {
     const  conn= await mongoose.connect(process.env.MONGO_URI,{} )
     console.log(`connecting to ${(conn.connection).host} Database successfully!`)   
     
    } catch (error) {
        console.log(error );
        process.exit(1);
    }

}

export {connectDb}