// const BankAccount = require("../models/BankAccountModel");

// const updateBankAccount = async (newCategory) => {
//   const { categoryId, name } = newCategory;

//   try {
//     if (checkCategory) {
//       return {
//         status: "ERR",
//         message: "Category available",
//         checkCategory,
//       };
//     } else {
//       const category = await Category.create({
//         categoryId,
//         name,
//       });
//       return {
//         status: "OK",
//         message: "Created new category",
//         category,
//       };
//     }
//   } catch (e) {
//     // In ra lỗi để dễ debug
//     console.error("Error in createCategory service:", e);
//     throw new Error(e.message);
//   }
// };
// module.exports = {
//   updateBankAccount,
// };
