const DiscountService = require('../services/DiscountService')

// create discount with data from request body
const createDiscount = async (req, res) => {
    try {
        // if request body missing any attribute, return an error
        const { discountId, discountPercent, startDate, endDate, productsId } = req.body
        if (!discountId || !discountPercent || !startDate || !endDate || !productsId)
        {
            res.status(404).json({
                status: 'ERR',
                message: 'Missing discount attribute'
            })
        }
        else 
        {
            const response = await DiscountService.createDiscount(discountId, discountPercent, startDate, endDate, productsId)
            res.status(200).json(response)
        }
    } catch(e) {
        res.status(404).json({
            message: e
        })
    }
}

const getAllDiscount = async (req, res) => {
    try {
        const response = await DiscountService.getAllDiscount()

        res.status(200).json(response)
    } catch(e) {
        res.status(404).json({
            message: e
        })
    }
}

// get discount with discount id from request parameters
const getDiscount = async (req, res) => {
    try {
        const discountId = req.params.discountId
        const response = await DiscountService.getDiscount(discountId)

        res.status(200).json(response)
    } catch(e) {
        res.status(404).json({
            message: e
        })
    }
}

// update discount with discount id from request parameters and data from request body
const updateDiscount = async (req, res) => {
    try {
        const discountId = req.params.discountId
        const updatedData = req.body

        const response = await DiscountService.updateDiscount(discountId, updatedData)
        res.status(200).json(response)
    } catch(e) {
        res.status(404).json({
            message: e
        })
    }
}

// delete discount with discount id from request parameters
const deleteDiscount = async (req, res) => {
    try {
        const discountId = req.params.discountId
        const response = await DiscountService.deleteDiscount(discountId)

        res.status(200).json(response)
    } catch(e) {
        res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createDiscount,
    getAllDiscount,
    getDiscount,
    updateDiscount,
    deleteDiscount
}