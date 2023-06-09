const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path")

dotenv.config();
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connect to MongoDB");
  }
);

// middleware
app.use(express.json({limit: '50mb'}));
app.use(helmet());
app.use(morgan("common"));
app.use("https://react-node-facebook-app.vercel.app/api/users", userRoute);
app.use("https://react-node-facebook-app.vercel.app/api/auth", authRoute);
app.use("https://react-node-facebook-app.vercel.app/api/posts", postRoute);
// Route example
// app.get("/",(req, res)=>{
//     res.send("Welcome to Homepage")
// })
// app.get("/users",(req, res)=>{
//     res.send("Welcome to User page")
// })
app.use(express.urlencoded({limit: '50mb'}));
app.use("images", express.static(path.join(__dirname, "/images")))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://react-facebook-app.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("https://react-node-facebook-app.vercel.app/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.listen(8800, () => {
  console.log("Backend server is running!");
});
