import axios from 'axios';
import { getLocalItem } from '../utils/Utils';
import Constants from '../utils/Constants';

const BASE_URL = process.env.BASE_URL;
const api = axios.create();

api.defaults.baseURL = BASE_URL;
api.defaults.headers.common['Content-Type'] = 'application/json';

api.interceptors.request.use(
  async function (config) {
    const jwtToken = (await getLocalItem(Constants.USER_JWT)) ?? '';
    config.headers.Authorization = `Bearer ${jwtToken}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
console.log('IP Addr',process.env.BASE_URL)

export default api;
