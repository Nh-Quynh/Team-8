const Category = require("../models/CategoryModel")

const getAllCategories = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCategories = await Category.find()
            resolve(
                {
                    status: 'OK',
                    message: 'Get all categories',
                    data: allCategories,
                }
            )
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllCategories
}