const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const routes = require("./routes/routes")
const cors = require("cors")

dotenv.config()

mongoose.connect(process.env.DATABASE_CONNECTION, () => console.log("DB connection established"))

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
app.use("/", routes)
server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
