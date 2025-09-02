// // client/src/pages/CustomerFormPage.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';

// function CustomerFormPage() {
//     const [customer, setCustomer] = useState({ first_name: '', last_name: '', phone_number: '' });
//     const navigate = useNavigate();
//     const { id } = useParams();

//     useEffect(() => {
//         if (id) {
//             axios.get(`http://localhost:5000/api/customers/${id}`)
//                 .then(res => setCustomer(res.data.data))
//                 .catch(err => console.error(err));
//         }
//     }, [id]);

//     const handleChange = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (id) {
//             axios.put(`http://localhost:5000/api/customers/${id}`, customer)
//                 .then(() => navigate('/'))
//                 .catch(err => console.error(err));
//         } else {
//             axios.post('http://localhost:5000/api/customers', customer)
//                 .then(() => navigate('/'))
//                 .catch(err => console.error(err));
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input name="first_name" placeholder="First Name" value={customer.first_name} onChange={handleChange} required />
//             <input name="last_name" placeholder="Last Name" value={customer.last_name} onChange={handleChange} required />
//             <input name="phone_number" placeholder="Phone Number" value={customer.phone_number} onChange={handleChange} required />
//             <button type="submit">{id ? 'Update' : 'Add'} Customer</button>
//         </form>
//     );
// }

// export default CustomerFormPage;
// client/src/pages/CustomerFormPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function CustomerFormPage({ onSaved }) {
  const [customer, setCustomer] = useState({ first_name: '', last_name: '', phone_number: '' });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/customers/${id}`)
        .then((res) => setCustomer(res.data.data))
        .catch((err) => {
          console.error(err);
          alert('Error fetching customer details.');
        });
    }
  }, [id]);

  const handleChange = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/customers/${id}`, customer);
        alert('Customer updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/customers', customer);
        alert('Customer added successfully!');
      }

      setCustomer({ first_name: '', last_name: '', phone_number: '' }); // reset form
      if (onSaved) onSaved(); // notify parent to refresh list
      navigate('/'); // optional: redirect to list page
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error?.includes('UNIQUE constraint failed')) {
        alert('Phone number already exists! Use a different one.');
      } else {
        alert('Error saving customer. Make sure the backend is running.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
      <input
        name="first_name"
        placeholder="First Name"
        value={customer.first_name}
        onChange={handleChange}
        required
      />
      <input
        name="last_name"
        placeholder="Last Name"
        value={customer.last_name}
        onChange={handleChange}
        required
      />
      <input
        name="phone_number"
        placeholder="Phone Number"
        value={customer.phone_number}
        onChange={handleChange}
        required
      />
      <button type="submit">{id ? 'Update' : 'Add'} Customer</button>
    </form>
  );
}

export default CustomerFormPage;
