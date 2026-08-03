const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const connectDB = async () => {
  const url =
    "mongodb+srv://daminigidwani13_db_user:19C4e5NO5h22eVwv@cluster0.t6ssilo.mongodb.net/technoDB?appName=Cluster0";

  await mongoose.connect(url);
  console.log("DB Connected!!");
};
module.exports = connectDB;
