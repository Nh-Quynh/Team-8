const UserService = require("../services/UserService");
const JwtService = require("../services/jwtService");
const validator = require("validator");

// Tao tai khoan khach hang
const createCustomer = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password, confirmPassword, gender, birthday, phone } =
      req.body;

    //kiểm tra email
    const isCheckEmail = validator.isEmail(email);
    // console.log("isCheckEmail", isCheckEmail);
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      gender == null ||
      !birthday ||
      !phone
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input isn't required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input isn't email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is not equal confirmPassword",
      });
    }

    const customer = await UserService.createCustomer(req.body);
    return res.status(200).json(customer);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// Khach hang dang nhap
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    //kiểm tra email
    const isCheckEmail = validator.isEmail(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input isn't required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input isn't email",
      });
    }

    const response = await UserService.loginCustomer(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//Khach hang dang xuat
// const logoutCustomer = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     //kiểm tra email
//     const isCheckEmail = validator.isEmail(email);
//     if (!email || !password) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The input isn't required",
//       });
//     } else if (!isCheckEmail) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The input isn't email",
//       });
//     }

//     const response = await UserService.loginCustomer(req.body);
//     return res.status(200).json(response);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };

//Cap nhat thong tin nguoi dung khach hang
const updateCustomer = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    // console.log("userId", userId);
    const response = await UserService.updateCustomer(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//cap nhat trang thai khach hang
const updateStatusCustomer = async (req, res) => {
  try {
    const email = req.body.email;
    const status = req.body.status;
    if (!email) {
      return res.status(200).json({
        status: "ERR",
        message: "The email is required",
      });
    }
    const response = await UserService.updateStatusCustomer(email, status);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//Xoa nguoi dung khach hang
const deleteCustomer = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers;
    console.log(token);
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.deleteCustomer(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//Lay tat ca nguoi dung khach hang
const getAllCustomer = async (req, res) => {
  try {
    const response = await UserService.getAllCustomer();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//Lay thong tin chi tiet nguoi dung qua id
const getCustomerById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.getCustomerById(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// Tao tai khoan nhan vien
const createEmployee = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password, confirmPassword, role } = req.body;
    const isCheckEmail = validator.isEmail(email);
    // console.log("isCheckEmail", isCheckEmail);
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(200).json({
        status: "ERR",
        message: "The input isn't required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input isn't email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is not equal confirmPassword",
      });
    }

    const customer = await UserService.createEmployee(req.body);
    return res.status(200).json(customer);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// Nhan vien dang nhap
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    //kiểm tra email
    const isCheckEmail = validator.isEmail(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input isn't required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input isn't email",
      });
    }

    const response = await UserService.loginEmployee(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//Cap nhat thong tin nhan vien
const updateEmployee = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    // console.log("userId", userId);
    const response = await UserService.updateEmployee(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//Xoa nguoi dung nhan vien
const deleteEmployee = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers;
    console.log(token);
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.deleteEmployee(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//Lay tat ca nguoi dung nhan vien
const getAllEmployee = async (req, res) => {
  try {
    const response = await UserService.getAllEmployee();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//Lay thong tin chi tiet nhan vien qua id
const getEmployeeById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.getEmployeeById(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateStatusEmployee = async (req, res) => {
  try {
    const email = req.body.email;
    const status = req.body.status;
    if (!email) {
      return res.status(200).json({
        status: "ERR",
        message: "The email is required",
      });
    }
    // console.log("userId", userId);
    const response = await UserService.updateStatusEmployee(email, status);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    console.log("Headers: ", req.headers);
    const token = req.headers.token.split(" ")[1];
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return res.status(200).json({
      status: "OK",
      message: "Logout successfully",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// logoutEmployee
module.exports = {
  createCustomer,
  loginCustomer,
  updateCustomer,
  updateStatusCustomer,
  deleteCustomer,
  getAllCustomer,
  getCustomerById,
  createEmployee,
  loginEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployee,
  getEmployeeById,
  updateStatusEmployee,
  refreshToken,
  logoutUser,
};
