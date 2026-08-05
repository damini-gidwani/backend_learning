const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");


const connectDB=async()=>{
    const url = process.env.MONGODB_URI;
    await mongoose.connect(url);
    console.log("DB Connected successfully!!");
}
module.exports=connectDB;