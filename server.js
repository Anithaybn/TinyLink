const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
require("dotenv").config();

const app = express();

app.use(express.json());

// connect to DB via mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected successfully!");
  })
  .catch((error) => {
    console.log("Error while connecting to DB:", error);
  });

// urlShortner schema
shortUrlSchema = new mongoose.Schema(
  {
    targetUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    lastClickedTime: Date,
  },
  { timestamps: true }
);
const shortUrl = mongoose.model("ShortUrl", shortUrlSchema);

app.get("/api/links", async (req, res) => {
  try {
    // fetch all records
    const records = await shortUrl.find();
    res.status(200).json(records);
  } catch (error) {
    console.log("Error occurred while fetching all links", error);
    res.status(500).json({ message: "Error occurred" });
  }
});

app.post("/api/links", async (req, res) => {
  try {
    const { targetUrl } = req.body;
    const shortCode = nanoid(7);
    const created = await shortUrl.create({ targetUrl, shortCode });
    const shortUrlCreated = `${req.protocol}://${req.get("host")}/${shortCode}`;
    res.json({
      message: "Short URL created",
      shortUrlCreated,
      data: created,
    });
  } catch (error) {
    console.log("Error occurred while adding url to DB", error);
    res.status(500).json({ message: "Error occurred" });
  }
});

app.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const record = await shortUrl.findOne({ shortCode: code });
    if (!record) {
      return res.status(400).send("No longer redirect");
    }
    // update other props
    record.totalClicks += 1;
    record.lastClickedTime = new Date();
    await record.save();
    // redirect
    return res.redirect(302, record.targetUrl);
  } catch (error) {
    console.log("Error occurred ", error);
    res.status(500).json({ message: "Error occurred" });
  }
});

app.get("/api/links/:code", async (req, res) => {
  try {
    const code = req.params.code;
    console.log(code);
    const record = await shortUrl.findOne({ shortCode: code });
    if (!record) {
      return res.status(400).send("This code doesnot exists");
    }
    res.status(200).json(record);
  } catch (error) {
    console.log("Error occurred ", error);
    res.status(500).json({ message: "Error occurred" });
  }
});

app.delete("/api/links/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const result = await shortUrl.findOneAndDelete({ shortCode: code });
    if (!result) {
      return res.status(400).json({ message: "This code does not exist" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.log("Error occurred ", error);
    res.status(500).json({ message: "Error occurred" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/");
});
