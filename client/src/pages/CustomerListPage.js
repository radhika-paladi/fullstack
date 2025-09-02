// // client/src/pages/CustomerListPage.js
import React, { useState } from 'react';
import CustomerList from '../Components/CustomerList';
import CustomerFormPage from './CustomerFormPage';

function CustomerListPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refresh, setRefresh] = useState(false); // toggled to refresh list

  const handleSaved = () => {
    setSelectedCustomer(null); // clear form selection
    setRefresh((prev) => !prev); // toggle to refresh CustomerList
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Customer Management</h1>
      <CustomerFormPage
        key={selectedCustomer?.id || 'new'}
        customer={selectedCustomer}
        onSaved={handleSaved}
      />
      <CustomerList
        onEdit={setSelectedCustomer}
        refresh={refresh}
      />
    </div>
  );
}

export default CustomerListPage;
