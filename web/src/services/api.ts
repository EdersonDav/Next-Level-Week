//Axios é usado como o fetch mas a diferença dele é que é possivel criar baseURL
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333'
});

export default api;