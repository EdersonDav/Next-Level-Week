import axios from 'axios';
const api = axios.create({
  baseURL: "http://"
});

export default api;