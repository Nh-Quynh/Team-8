const Customer = require("../models/CustomerModel");
const Employee = require("../models/EmployeeModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./jwtService");

//delete-chinh sua sau

const createCustomer = (newCustomer) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, gender, birthday, phone } = newCustomer;
    try {
      const checkCustomer = await Customer.findOne({
        email: email,
      });
      if (checkCustomer !== null) {
        resolve({
          status: "OK",
          message: "The email is already",
        });
      } else {
        const hashPassword = bcrypt.hashSync(password, 10);
        console.log("hash", hashPassword);
        const createCustomer = await Customer.create({
          name,
          email,
          password: hashPassword,
          gender,
          birthday,
          phone,
        });
      }
      if (createCustomer) {
        resolve({
          status: "Ok",
          message: "SUCCESS",
          data: createCustomer,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginCustomer = (customerLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = customerLogin;
    try {
      const checkCustomer = await Customer.findOne({
        email: email,
      });
      if (checkCustomer == null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const comparePassword = bcrypt.compare(password, checkCustomer.password);
      // const hashPassword = bcrypt.hashSync(password, 10);
      console.log("comparePassword", comparePassword);
      if (!comparePassword) {
        resolve({
          status: "OK",
          message: "The password or user is incorrect",
        });
      }
      const accessToken = await generalAccessToken({
        id: checkCustomer.id,
        // type: "customer",
      });
      const refreshToken = await generalRefreshToken({
        id: checkCustomer.id,
        // type: "customer",
      });
      resolve({
        status: "Ok",
        message: "SUCCESS",
        accessToken,
        refreshToken,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateCustomer = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCustomer = await Customer.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      console.log("checkCustomer", checkCustomer);
      if (checkCustomer == null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      const updateCustomer = await Customer.findByIdAndUpdate(id, data, {
        new: true,
      });
      console.log("updateCustomer", updateCustomer);
      resolve({
        status: "Ok",
        message: "SUCCESS",
        data: updateCustomer,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật trạng thái tài khoản
const updateStatusCustomer = (email, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCustomer = await Customer.findOne({
        email: email, //MongodB sử dụng ID dạng _id
      });
      console.log("checkCustomer", checkCustomer);
      if (checkCustomer == null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      const updateStatusCustomer = await Customer.findOneAndUpdate(
        { email: email }, // Điều kiện tìm kiếm: email
        { $set: { status: status } }, // Cập nhật trường status
        { new: true } // Trả về tài liệu đã được cập nhật
      );
      console.log("updateStatusCustomer", updateStatusCustomer);
      resolve({
        status: "Ok",
        message: "SUCCESS",
        data: updateStatusCustomer,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCustomer = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCustomer = await Customer.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      if (checkCustomer == null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      await Customer.findByIdAndDelete(id);
      resolve({
        status: "Ok",
        message: "Delete customer SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCustomer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getAllCustomer = await Customer.find();
      resolve({
        status: "Ok",
        message: "SUCCESS",
        data: getAllCustomer,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsCustomer = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const customer = await Customer.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      if (customer == null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "Ok",
        message: "Get customer SUCCESS",
        data: customer,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const createEmployee = (newEmployee) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, role } = newEmployee;
    try {
      const checkEmployee = await Employee.findOne({
        email: email,
      });
      if (checkEmployee !== null) {
        resolve({
          status: "OK",
          message: "The email is already",
        });
      } else {
        const hashPassword = bcrypt.hashSync(password, 10);
        console.log("hash", hashPassword);
        const createEmployee = await Employee.create({
          name,
          email,
          password: hashPassword,
          role,
        });
      }

      if (createEmployee) {
        resolve({
          status: "Ok",
          message: "SUCCESS",
          data: createEmployee,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginEmployee = (employeeLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = employeeLogin;
    try {
      const checkEmployee = await Employee.findOne({
        email: email,
      });
      if (checkEmployee == null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const comparePassword = bcrypt.compare(password, checkEmployee.password);
      // const hashPassword = bcrypt.hashSync(password, 10);
      console.log("comparePassword", comparePassword);
      if (!comparePassword) {
        resolve({
          status: "OK",
          message: "The password or user is incorrect",
        });
      }
      const accessToken = await generalAccessToken({
        id: checkEmployee.id,
        // type: "customer",
      });
      const refreshToken = await generalRefreshToken({
        id: checkEmployee.id,
        // type: "customer",
      });
      resolve({
        status: "Ok",
        message: "SUCCESS",
        accessToken,
        refreshToken,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateEmployee = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkEmployee = await Employee.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      console.log("checkEmployee ", checkEmployee);
      if (checkEmployee == null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const updateEmployee = await Employee.findByIdAndUpdate(id, data, {
        new: true,
      });
      console.log("updateEmployee", updateEmployee);
      resolve({
        status: "Ok",
        message: "SUCCESS",
        data: updateEmployee,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateStatusEmployee = (email, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkEmployee = await Employee.findOne({
        email: email, //MongodB sử dụng ID dạng _id
      });
      console.log("checkEmployee ", checkEmployee);
      if (checkEmployee == null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      const updateStatusEmployee = await Employee.findOneAndUpdate(
        { email: email }, // Điều kiện tìm kiếm
        { $set: { status: status } }, // Dữ liệu cập nhật
        { new: true } // Tùy chọn trả về tài liệu đã cập nhật
      );
      console.log("updateStatusEmployee", updateStatusEmployee);
      resolve({
        status: "Ok",
        message: "SUCCESS",
        data: updateStatusEmployee,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteEmployee = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkEmployee = await Employee.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      console.log("Id Service", id);
      if (checkEmployee == null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      await Employee.findByIdAndDelete(id);
      resolve({
        status: "Ok",
        message: "Delete customer SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllEmployee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getAllEmployee = await Employee.find();
      resolve({
        status: "Ok",
        message: "SUCCESS",
        data: getAllEmployee,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsEmployee = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const employee = await Employee.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      if (employee == null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "Ok",
        message: "Get mployee SUCCESS",
        data: employee,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createCustomer,
  loginCustomer,
  updateCustomer,
  updateStatusCustomer,
  deleteCustomer,
  getAllCustomer,
  getDetailsCustomer,
  createEmployee,
  loginEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployee,
  getDetailsEmployee,
  updateStatusEmployee,
};
