const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { fork } = require("child_process");


const PORT = 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
    fileUpload({
      tempFileDir: "temp",
      useTempFiles: true,
    })
  );

// Routes
app.post("/", (req, res) => {
    console.log(req.files.video);
    res.send("Success");
});


app.post("/compress-video", (req, res) => {
    const video = req.files.video;
  
    // When file is uploaded it is stored in temp file
    // this is made possible by express-fileupload
    const tempFilePath = video.tempFilePath;
  
    if (video && tempFilePath) {
      // Create a new child process
      const child = fork("video.js");
      // Send message to child process
      child.send({ tempFilePath, name: video.name });
      // Listen for message from child process
      child.on("message", (message) => {
        const { statusCode, text } = message;
       
        if(statusCode == 200){
            console.log(video)
        }
        res.status(statusCode).send(text);
      });
    } else {
      res.status(400).send("No file uploaded");
    }
  });







// Start the server

app.listen(PORT, () => {
  console.log(`Server started on  http://localhost:${PORT}`);
});