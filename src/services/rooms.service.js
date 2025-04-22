// import useAxios from "../hooks/useAxios";
import axios from "axios";

export const getAllRooms = async () => {
  // const axios = useAxios();
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:8080/api/rooms", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getRoomById = async (id) => {
  // const axios = useAxios();
  const response = await axios.get(`http://localhost:8080/api/rooms/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
