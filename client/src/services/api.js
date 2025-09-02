// client/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Customer APIs
export const getCustomers = () => API.get('/customers');
export const getCustomer = (id) => API.get(`/customers/${id}`);
export const addCustomer = (data) => API.post('/customers', data);
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);

// Address APIs
export const getAddresses = (customerId) => API.get(`/customers/${customerId}/addresses`);
export const addAddress = (customerId, data) => API.post(`/customers/${customerId}/addresses`, data);
export const updateAddress = (id, data) => API.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => API.delete(`/addresses/${id}`);
