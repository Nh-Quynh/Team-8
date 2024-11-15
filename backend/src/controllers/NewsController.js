const NewsService = require("../services/NewsService");

const createNews = async (req, res) => {
  try {
    const { newsId, title, description, urlImage } = req.body;
    if (!newsId || !title || !description) {
      return res.status(404).json({
        status: "ERROR",
        message: "Have any attribute missing",
      });
    }

    const response = await NewsService.createNews(
      newsId,
      title,
      description,
      urlImage
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERROR",
      message: e,
    });
  }
};

const getAllNews = async (req, res) => {
  try {
    const response = await NewsService.getAllNews();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERROR",
      message: e,
    });
  }
};

const getNewsById = async (req, res) => {
  try {
    const newsId = req.params.newsId;
    if (!newsId) {
      return res.status(404).json({
        status: "ERROR",
        message: "News Id is required",
      });
    }

    const response = await NewsService.getNewsById(newsId);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERROR",
      message: e,
    });
  }
};

const updateNews = async (req, res) => {
  try {
    const newsId = req.params.newsId;
    const data = req.body;

    if (!newsId) {
      return res.status(404).json({
        status: "ERROR",
        message: "News Id is required",
      });
    }
    if (!data) {
      return res.status(404).json({
        status: "ERROR",
        message: "Updated data is required",
      });
    }

    const response = await NewsService.updateNews(newsId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERROR",
      message: e,
    });
  }
};

const deleteNews = async (req, res) => {
  try {
    const newsId = req.params.newsId;
    if (!newsId) {
      return res.status(404).json({
        status: "ERROR",
        message: "News Id is required",
      });
    }

    const response = await NewsService.deleteNews(newsId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERROR",
      message: e,
    });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
