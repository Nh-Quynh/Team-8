const Discount = require('../models/DiscountModel')
const Product = require('../models/ProductModel')
const mongoose = require('mongoose')
const ObjId = mongoose.Types.ObjectId

const createDiscount = (discountId, discountPercent, startDate, endDate, productsId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // mongoose.set('debug', true)

            // if the discount already had, don't create more
            const checkDiscount = await Discount.findOne({discountId: discountId})
            if (checkDiscount)
            {
                resolve({
                    status: 'ERR',
                    message: 'The discount had already created'
                })
            }
            else
            {
                // format product's element attribute, from product id to product object id (mongo db)
                const products = await Product.find({productId: productsId})
                products.forEach((element, index) => {
                    products[index] = {_id: element._id}
                })

                // if not found any product, return an error
                if (products.length == 0)
                {
                    resolve({
                        status: 'ERR',
                        message: 'Not found products'
                    })
                }
                else{
                    const discountQuery = {
                        discountId: discountId,
                        discountPercent: discountPercent,
                        startDate: startDate,
                        endDate: endDate,
                        products: products
                    }

                    const newDiscount = await Discount.create(discountQuery)
                    resolve({
                        status: 'OK',
                        message: 'Create new discount successful',
                        discount: newDiscount
                    })
                }
            }

        } catch(e) {
            reject(e)
        }
    })
}

const getAllDiscount = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const discounts = await Discount.find().populate('products')

            resolve({
                status: 'OK', 
                message: 'Get all discounts',
                data: discounts
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getDiscount = (discountId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const discount = await Discount.findOne({discountId: discountId}).populate('products')

            resolve({
                status: 'OK',
                message: 'Get discount by discount id',
                data: discount
            })
        } catch(e) {
            reject(e)
        }
    })
}

const updateDiscount = (discountId, updatedData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDiscount = await Discount.findOne({discountId: discountId})
            // if no discount found, return an error
            if (!checkDiscount)
            {
                resolve({
                    status: 'ERR',
                    message: 'No discount found'
                })
            }
            else
            {
                const updatedDiscount = await Discount.findOneAndUpdate({discountId: discountId}, updatedData, {new: true})
                    .populate('products')
                resolve({
                    status: 'OK',
                    message: 'The discount was update',
                    updatedDiscount: updatedDiscount
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

const deleteDiscount = (discountId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDiscount = await Discount.findOne({discountId: discountId})
            // if no discount found, return an error
            if (!checkDiscount)
            {
                resolve({
                    status: 'ERR',
                    message: 'No discount found'
                })
            }
            else
            {
                await Discount.findOneAndDelete({discountId: discountId})
                resolve({
                    status: 'OK',
                    message: 'The discount was delete'
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    createDiscount,
    getAllDiscount,
    getDiscount,
    updateDiscount,
    deleteDiscount
}