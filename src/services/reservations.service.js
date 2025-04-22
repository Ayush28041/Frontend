import useAxios from "../hooks/useAxios";

export const getUserReservations = async () => {
  const axios = useAxios();
  const response = await axios.get("/api/users/reservations");
  return response.data;
};

export const createReservation = async (data) => {
  const axios = useAxios();
  const response = await axios.post("/api/users/reservations", data);
  return response.data;
};
