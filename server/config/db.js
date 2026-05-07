const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // In some environments, Node SRV DNS lookups fail with ECONNREFUSED
    // even when normal OS DNS tools work. Retry once with public IPv4 DNS.
    if (error?.syscall === "querySrv" && error?.code === "ECONNREFUSED") {
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected (DNS fallback): ${conn.connection.host}`);
        return;
      } catch (retryError) {
        console.error(`MongoDB Error (after DNS fallback): ${retryError.message}`);
        process.exit(1);
      }
    }

    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
