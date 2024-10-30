const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    newsId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urlImage: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", newsSchema);
module.exports = News;
