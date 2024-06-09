import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dontenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dontenv.config();

const app = express();
app.use(express.json()); // express.json() is a built-in middleware function in Express. This method is used to parse the incoming requests with JSON payloads and is based upon the bodyparser.This method returns the middleware that only parses JSON and only looks at the requests where the content-type header matches the type option.
app.use(helmet()); // What is the difference between helmet and CORS? Helmet and Cors are 2 important node. js packages with different purposes. Helmet secures your express app by setting response HTTP headers appropriately, while Cors enables your express application access control to allow restricted resources from being accessed from external domains.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); //morgan is http request middleware used to logg the request response logs
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // we can use this upload variable to upload files

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register);

// NEED TO UPLOAD THE POST SO NEED AUTH
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES SETUP
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP

const PORT = process.env.PORT || 6001;

//app.use(cors({
//origin:["https://deploy-socialmedia-sxs.vercel.app"],
//methods:["POST", "GET", "DELETE", "PATCH"],
//credentials: true
//}));
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    // manually insert users and posts from data index file to schmes
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
  });
