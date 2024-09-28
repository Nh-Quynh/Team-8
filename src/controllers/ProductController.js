const ProductService = require('../services/ProductService')

const createProduct = async (req, res) => {

}

const getAllProducts = async (req, res) => {
    try {
        const {limit, page, sort, filter} = req.query
        const response = await ProductService.getAllProducts(limit || 8, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch(e)
    {
        return res.status(404).json({
            message: e
        })
    }
}

const fillByMaterial = async (req, res) => {
    try {
        const materialId = req.params.materialId
        const response = await ProductService.fillByMaterial(materialId)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    fillByMaterial
}