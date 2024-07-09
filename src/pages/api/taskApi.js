import axios from "axios";
export const getTasks = async () => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/task/get`);
};

export const addTask = async (payload) => {
  return await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/task/add`, payload);
};

export const updateTask = async (payload) => {
  return await axios.put(
    `${process.env.REACT_APP_BACKEND_BASEURL}/task/update`,
    payload
  );
};

export const deleteTask = async (id) => {
  return await axios.delete(`${process.env.REACT_APP_BACKEND_BASEURL}/task/delete/${id}`);
};
