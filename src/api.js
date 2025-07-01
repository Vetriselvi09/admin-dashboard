// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Change this if your backend runs elsewhere
});

export default API;
