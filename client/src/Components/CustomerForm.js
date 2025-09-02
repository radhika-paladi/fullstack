// client/src/components/CustomerForm.js
import React, { useState, useEffect } from 'react';
import { addCustomer, updateCustomer } from '../services/api';

function CustomerForm({ customer, onSaved = () => {} }) {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', phone_number: '' });

  useEffect(() => {
    if (customer) setFormData(customer);
  }, [customer]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (customer) {
        await updateCustomer(customer.id, formData);
        alert('Customer updated successfully!');
      } else {
        await addCustomer(formData);
        alert('Customer added successfully!');
      }
      setFormData({ first_name: '', last_name: '', phone_number: '' });
      onSaved();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        alert(`Backend error: ${err.response.data.error}`);
      } else {
        alert('Network error. Make sure backend is running.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />
      <input
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />
      <input
        name="phone_number"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChange={handleChange}
        required
      />
      <button type="submit">{customer ? 'Update' : 'Add'} Customer</button>
    </form>
  );
}

export default CustomerForm;
