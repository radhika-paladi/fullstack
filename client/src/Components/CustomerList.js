// // client/src/components/CustomerList.js
import React, { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '../services/api';
import '../styles.css'; 

function CustomerList({ onEdit, refresh }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching customers.');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      fetchCustomers();
      alert('Customer deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error deleting customer.');
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomerId(customer.id);
    onEdit(customer);
  };

  return (
    <div>
      <h2>Customer List</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className={selectedCustomerId === customer.id ? 'selected' : ''}
            >
              <td>{customer.id}</td>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.phone_number}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(customer)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
