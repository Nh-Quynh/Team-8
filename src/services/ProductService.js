const { default: mongoose } = require("mongoose")
const Product = require("../models/ProductModel")
const ObjId = require('mongoose').Types.ObjectId

const getAllProducts = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments()

            // sort products
            if (sort) {
                const objSort = {}
                objSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objSort)
                resolve(
                    {
                        status: 'OK',
                        message: 'Get all product',
                        data: allProductSort,
                        total: totalProduct,
                        currentPage: Number(page) + 1,
                        totalPage: Math.ceil(totalProduct / limit)
                    }
                )
            }

            // get all products
            const allProduct = await Product.find().limit(limit).skip(page * limit)
            resolve(
                {
                    status: 'OK',
                    message: 'Get all product',
                    data: allProduct,
                    total: totalProduct,
                    currentPage: Number(page) + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                }
            )
        } catch (e) {
            reject(e)
        }
    })
}

const fillByMaterial = async (materialId, limit, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            // mongoose debug tools
            // mongoose.set('debug', true)

            const query = {'material': new ObjId(materialId)}
            const products = await Product.find(query).populate('material').populate('category').limit(limit).skip(page * limit)
            const totalProduct = await Product.countDocuments(query)

            resolve(
                {
                    status: 'OK',
                    message: 'Get filled products',
                    data: products,
                    total: totalProduct,
                    currentPage: Number(page) + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                }
            )
        } catch (e) {
            reject(e)
        }
    })
}

const fillByCategory = async (categoryId, limit, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            // mongoose debug tools
            // mongoose.set('debug', true)

            const query = {'category': new ObjId(categoryId)}
            const products = await Product.find(query).populate('material').populate('category').limit(limit).skip(page * limit)
            const totalProduct = await Product.countDocuments(query)

            resolve(
                {
                    status: 'OK',
                    message: 'Get filled products',
                    data: products,
                    total: totalProduct,
                    currentPage: Number(page) + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                }
            )
        } catch (e) {
            reject(e)
        }
    })
}

const fillProducts = async (categoryId, materialId, limit, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            // mongoose debug tools
            // mongoose.set('debug', true)

            const query = {
                'category': new ObjId(categoryId),
                'material': new ObjId(materialId)
            }
            const products = await Product.find(query).populate('material').populate('category').limit(limit).skip(page * limit)
            const totalProduct = await Product.countDocuments(query)

            resolve(
                {
                    status: 'OK',
                    message: 'Get filled products',
                    data: products,
                    total: totalProduct,
                    currentPage: Number(page) + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                }
            )
        } catch(e) {
            reject(e)
        }
    })
}

const searchProducts = (keyword, limit, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 'regex' helps in case insensitive search or searching for part of product name
            const products = await Product.find({'name': {$regex: keyword}}).limit(limit).skip(page * limit)
            const totalProduct = await Product.countDocuments({'name': {$regex: keyword}})
            
            resolve(
                {
                    status: 'OK',
                    message: 'Get filled products',
                    data: products,
                    total: totalProduct,
                    currentPage: Number(page) + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                }
            )
        } catch(e)
        {
            reject(e)
        }
    })
}

module.exports = {
    getAllProducts,
    fillByMaterial,
    fillByCategory, 
    fillProducts, 
    searchProducts
}