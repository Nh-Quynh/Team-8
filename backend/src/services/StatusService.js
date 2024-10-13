const mongoose = require('mongoose')
const Status = require('../models/Status.Model')

const createStatus = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const status = await Status.create({
                name: name
            })

            resolve({
                status: 'OK',
                message: 'Create status success',
                data: status
            })
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    createStatus
}