// // client/src/components/AddressForm.js
// import React, { useState, useEffect } from 'react';
// import { addAddress, updateAddress } from '../services/api';

// function AddressForm({ customerId, address, onSaved = () => {} }) {
//   const [formData, setFormData] = useState({ address_details: '', city: '', state: '', pin_code: '' });

//   useEffect(() => {
//     if (address) setFormData(address);
//   }, [address]);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!customerId) return alert('Select a customer first');
//     try {
//       if (address) {
//         await updateAddress(address.id, formData);
//         alert('Address updated successfully!');
//       } else {
//         await addAddress(customerId, formData);
//         alert('Address added successfully!');
//       }
//       setFormData({ address_details: '', city: '', state: '', pin_code: '' });
//       onSaved();
//     } catch (err) {
//       console.error(err);
//       if (err.response?.data?.error) {
//         alert(`Backend error: ${err.response.data.error}`);
//       } else {
//         alert('Network error. Make sure backend is running.');
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="address_details" placeholder="Address" value={formData.address_details} onChange={handleChange} required />
//       <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
//       <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
//       <input name="pin_code" placeholder="Pin Code" value={formData.pin_code} onChange={handleChange} required />
//       <button type="submit">{address ? 'Update' : 'Add'} Address</button>
//     </form>
//   );
// }

// export default AddressForm;
// client/src/components/AddressForm.js
import React, { useState, useEffect } from 'react';
import { addAddress, updateAddress } from '../services/api';

function AddressForm({ customerId, address, onSaved }) {
  const [formData, setFormData] = useState({
    address_details: '',
    city: '',
    state: '',
    pin_code: '',
  });

  useEffect(() => {
    if (address) setFormData(address);
  }, [address]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) return alert('Select a customer first');

    try {
      if (address) {
        await updateAddress(address.id, formData);
        alert('Address updated successfully!');
      } else {
        await addAddress(customerId, formData);
        alert('Address added successfully!');
      }

      setFormData({ address_details: '', city: '', state: '', pin_code: '' }); // reset form
      if (onSaved) onSaved(); // notify parent to refresh address list
    } catch (err) {
      console.error(err);
      alert('Error saving address. Make sure the backend is running.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}
    >
      <input
        name="address_details"
        placeholder="Address"
        value={formData.address_details}
        onChange={handleChange}
        required
      />
      <input
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        required
      />
      <input
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        required
      />
      <input
        name="pin_code"
        placeholder="Pin Code"
        value={formData.pin_code}
        onChange={handleChange}
        required
      />
      <button type="submit">{address ? 'Update' : 'Add'} Address</button>
    </form>
  );
}

export default AddressForm;
