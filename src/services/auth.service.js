import axios from "axios";

export const registerUser = async (data) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Signup Error:", err.response?.data || err.message);
    throw err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Login Error:", err.response?.data || err.message);
    throw err;
  }
};
