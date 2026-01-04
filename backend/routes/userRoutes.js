const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const UserProfile = require("../models/UserProfile");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

router.post(
  "/register",
  upload.single("resume"),
  async (req, res) => {
    try {
      const { name, email, experience, profile } = req.body;
      let resumeUrl = null;

      if (req.file) {
        const uploadParams = {
          Bucket: "user_attachment_store",
          Key: `resumes/${Date.now()}_${req.file.originalname}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype
        };

        const s3Response = await s3.upload(uploadParams).promise();
        resumeUrl = s3Response.Location;
      }

      const user = new UserProfile({
        name,
        email,
        experience,
        profile,
        resumeUrl
      });

      await user.save();

      res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Registration failed" });
    }
  }
);

module.exports = router;
