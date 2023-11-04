import express from "express";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import Ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffmpegOnProgress from "ffmpeg-on-progress";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { login,register } from "./controller/auth.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

Ffmpeg.setFfmpegPath(ffmpegPath);

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: 'http://localhost:3000',  // Replace with the origin of your React app
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const port = process.env.PORT || 10000;


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, "public/assets")));
app.use(express.static(path.join(__dirname, "tmp")));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "assets"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const logProgress = (progress, event) => {
  io.sockets.emit("progress", { progress: (progress * 100).toFixed() });
};

app.post("/api/login",login);
app.post("/api/register",register);
app.post("/api/compress", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const originalFileName = req.file.originalname;
    const originalFilePath = path.join(
      __dirname,
      "public",
      "assets",
      originalFileName
    );

    const compressedFileName = `compressed_${originalFileName}`;
    const compressedFilePath = path.join(__dirname, "tmp", compressedFileName);

    const output = Ffmpeg()
      .input(originalFilePath)
      .inputFormat("mp4")
      .audioCodec("aac")
      .videoCodec("libx264")
      .outputOptions(["-crf", "28"])
      .on("progress", ffmpegOnProgress(logProgress))
      .on("end", () => {
        const downloadLink = `/api/download/${compressedFileName}`;
        const name = compressedFileName;
        res.status(200).json({
          message: "Video compressed successfully",
          downloadLink: downloadLink,
          name: name,
        });
      })
      .on("error", (err) => {
        res.status(500).json({ error: "Video compression failed" });
      });

    output.save(compressedFilePath);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred during video compression." });
  }
});

app.get("/api/download/:videoName", (req, res) => {
  const videoName = req.params.videoName;
  const compressedVideoPath = path.join(__dirname, "./tmp", videoName);
  res.download(compressedVideoPath, videoName, (err) => {
    if (err) {
      res.status(500).json({ error: "Download failed" });
    }
  });
});

// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
mongoose.connect(process.env.MONGO_URL,{
  serverSelectionTimeoutMS: 50000, // Adjust the timeout as needed

}).then(()=>{
  server.listen(port, () => console.log(`Server is running on port ${port}`));
  // ADD DATA ONE TIME
  // User.insertMany(users);
  // Post.insertMany(posts);
}).catch((error)=>{
 console.error(`${error} did not connect`)
})
