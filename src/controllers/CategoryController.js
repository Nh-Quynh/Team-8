const CategoryService = require('../services/CategoryService')

const createCategory = async (req, res) => {

}

const getAllCategories = async (req, res) => {
    try {
        const response = await CategoryService.getAllCategories()
        return res.status(200).json(response)
    } catch(e)
    {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createCategory,
    getAllCategories
}