// client/src/pages/CustomerDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CustomerDetailPage() {
    const { id } = useParams();
    const [customer, setCustomer] = useState({});
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/customers/${id}`).then(res => setCustomer(res.data.data));
        axios.get(`http://localhost:5000/api/customers/${id}/addresses`).then(res => setAddresses(res.data.data));
    }, [id]);

    return (
        <div>
            <h1>{customer.first_name} {customer.last_name}</h1>
            <p>Phone: {customer.phone_number}</p>
            <h3>Addresses:</h3>
            <ul>
                {addresses.map(a => (
                    <li key={a.id}>{a.address_details}, {a.city}, {a.state} - {a.pin_code}</li>
                ))}
            </ul>
        </div>
    );
}

export default CustomerDetailPage;
