var axios = require('axios');

var axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/movie/',
  /* other custom settings */
});

module.exports = axiosInstance;