import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001', // Đảm bảo đây là địa chỉ chính xác của JSON Server
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default instance;
