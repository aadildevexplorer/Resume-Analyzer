require("dotenv").config();
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = require("./app");
const connectDB = require("./db/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/resume", require('./routes/resume.route'));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
