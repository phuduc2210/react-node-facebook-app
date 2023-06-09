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
const cors = require("cors")

dotenv.config();
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connect to MongoDB");
  }
);

const corsOptions ={
  origin:'https://react-facebook-app.vercel.app', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

// middleware
app.use(express.json({limit: '50mb'}));
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
// Route example
// app.get("/",(req, res)=>{
//     res.send("Welcome to Homepage")
// })
// app.get("/users",(req, res)=>{
//     res.send("Welcome to User page")
// })
app.use(express.urlencoded({limit: '50mb'}));
app.use("images", express.static(path.join(__dirname, "/images")))
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.listen(8800, () => {
  console.log("Backend server is running!");
});
