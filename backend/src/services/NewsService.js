const News = require("../models/NewsModel")

const createNews = (newsId, title, description, urlImage) => {
    return new Promise(async (resolve, reject) => {
        try {
            const news = await News.findOne({newsId: newsId});
            if (news)
            {
                return resolve({
                    status: "ERROR",
                    message: "News has existed"
                })
            }

            const newsData = {
                newsId: newsId,
                title: title, 
                description: description,
                urlImage: urlImage
            }

            const newNews = await News.create(newsData);

            resolve({
                status: "OK",
                message: "News created",
                data: newNews
            })
        }
        catch(e)
        {
            reject(e);
        }
    });    
}

const getAllNews = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const newsList = await News.find();
            resolve({
                status: "OK",
                message: "Get all news",
                data: newsList
            })
        }
        catch(e)
        {
            reject(e);
        }
    });
}

const getNewsById = (newsId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const news = await News.findOne({newsId: newsId});
            if (!news)
            {
                return resolve({
                    status: "ERROR",
                    message: "News has not existed"
                })
            }

            resolve({
                status: "OK",
                message: "Get news by Id",
                data: news
            })
        }
        catch(e)
        {
            reject(e);
        }
    })
}

const updateNews = (newsId, updatedData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const news = await News.findOne({newsId: newsId})
            if (!news)
            {
                return resolve({
                    status: "ERROR",
                    message: "News has not existed"
                })
            }

            const updatedNews = await News.findOneAndUpdate({newsId: newsId}, updatedData, {new: true});
            resolve({
                status: "OK",
                message: "News was updated",
                data: updatedNews
            })
        }
        catch(e)
        {
            reject(e);
        }
    })
}

const deleteNews = (newsId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const news = await News.findOne({newsId: newsId})
            if (!news)
            {
                return resolve({
                    status: "ERROR",
                    message: "News has not existed"
                })
            }

            await News.findOneAndDelete({newsId: newsId});
            resolve({
                status: "OK",
                message: "News was deleted"
            })
        }
        catch(e)
        {
            reject(e);
        }
    })
}

module.exports = {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
}