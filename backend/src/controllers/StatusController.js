const { create } = require('../models/Status.Model')
const StatusService = require('../services/StatusService')

const createStatus = async (req, res) => {
    try {
        const { name } = req.body
        const response = await StatusService.createStatus(name)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createStatus
}