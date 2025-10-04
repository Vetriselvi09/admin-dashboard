// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://swift00-backend.onrender.com/', // Change this if your backend runs elsewhere
});

export default API;
