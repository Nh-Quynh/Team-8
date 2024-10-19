import axios from "axios";
export const loginEmployee = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URI}/user/employee/sign-in`,
    data
  );
  return res.data;
};

export const logoutEmployee = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URI}/user/employee/log-out`
  );
  return res.data;
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URI}/user/employee/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching user by ID:",
      error.response?.data || error.message
    );
    throw error; // Optionally rethrow the error
  }
};
export const updateUser = async (id, data) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URI}/user/employee/update-employee/${id}`,
    data
  );
  return res.data;
};
