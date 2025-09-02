import React, { useEffect, useState } from 'react';
import { getAddresses, deleteAddress } from '../services/api';
import '../styles.css'; 

function AddressList({ customerId, onEdit, refresh }) {
  const [addresses, setAddresses] = useState([]);
   const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!customerId) return;
      try {
        const res = await getAddresses(customerId);
        setAddresses(res.data.data);
      } catch (err) {
        console.error(err);
        alert('Error fetching addresses.');
      }
    };

    fetchAddresses();
  }, [customerId, refresh]); // dependencies are now correct

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress(id);

      // refetch addresses after deletion
      const res = await getAddresses(customerId);
      setAddresses(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Error deleting address.');
    }
  };

    const handleEdit = (address) => {
    setSelectedAddressId(address.id);
    onEdit(address);
  };

  if (!customerId) return <p>Select a customer to see addresses.</p>;

  return (
    <div>
      <h2>Address List</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Pin Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((a) => (
            <tr
              key={a.id}
              className={a.id === selectedAddressId ? 'selected' : ''}
            >
                
              <td>{a.id}</td>
              <td>{a.address_details}</td>
              <td>{a.city}</td>
              <td>{a.state}</td>
              <td>{a.pin_code}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(a)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(a.id)}>Delete</button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddressList;
