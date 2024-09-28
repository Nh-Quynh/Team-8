const Material = require("../models/MaterialModel")

const getAllMaterials = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allMaterials = await Material.find()
            resolve(
                {
                    status: 'OK',
                    message: 'Get all materials',
                    data: allMaterials,
                }
            )
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllMaterials
}