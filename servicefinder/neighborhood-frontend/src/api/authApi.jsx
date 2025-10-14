import axiosInstance from './axiosConfig';

export const loginUser = async ({ email, password }) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
}

export const registerUser = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
};
