const Product = require("../models/ProductModel")

const getAllProducts = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments()

            // fill products
            if (filter) {
                const label = filter[0]
                const allProductFilter = await Product.find({ [label]: {'$regex': filter[1]} }).limit(limit).skip(page * limit)
                resolve(
                    {
                        status: 'OK',
                        message: 'Get all product',
                        data: allProductFilter,
                        total: totalProduct,
                        currentPage: Number(page + 1),
                        totalPage: Math.ceil(totalProduct / limit)
                    }
                )
            }

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
                        currentPage: Number(page + 1),
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
                    currentPage: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                }
            )
        } catch(e) {
            reject(e)
        }
    })
}

const fillByMaterial = async (materialId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('materialId', materialId)
            const products = await Product.find({ material: materialId }).populate('material')
            resolve(
                {
                    status: 'OK',
                    message: 'Get filled products',
                    data: products
                    // total: totalProduct,
                    // currentPage: Number(page + 1),
                    // totalPage: Math.ceil(totalProduct / limit)
                }
            )
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllProducts,
    fillByMaterial
}