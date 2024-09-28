const MaterialService = require('../services/MaterialService')

const createMaterial = async (req, res) => {

}

const getAllMaterials = async (req, res) => {
    try {
        const response = await MaterialService.getAllMaterials()
        return res.status(200).json(response)
    } catch(e)
    {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createMaterial,
    getAllMaterials
}