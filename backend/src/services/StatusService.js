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
        } catch (e) {
            reject(e)
        }
    })
}

const getAllStatus = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allStatus = await Status.find();

            resolve({
                status: "OK",
                message: "Get all status",
                data: allStatus
            });
        }
        catch (e)
        {
            reject(e);
        }
    });
}

module.exports = {
    createStatus,
    getAllStatus
}