const mongoose = require("mongoose");
const Status = require("../models/Status.Model");

const createStatus = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const status = await Status.create({
        name: name,
      });

      resolve({
        status: "OK",
        message: "Create status success",
        data: status,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getStatusDefault = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const name = "Đang chờ duyệt";
      const status = await Status.findOne({ name: name });
      if (!status) {
        return resolve(null); // Trả về null nếu không tìm thấy trạng thái
      }
      return resolve(status._id); // Trả về _id của trạng thái
    } catch (e) {
      reject(e);
    }
  });
};
const getStatus = (statusId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const status = await Status.findOne({
        _id: statusId,
      });

      resolve({
        status: "OK",
        message: "Get status by status id",
        data: status,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createStatus,
  getStatusDefault,
  getStatus,
};
