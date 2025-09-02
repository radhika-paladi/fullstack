// client/src/App.js


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './Components/CustomerList';
import CustomerForm from './Components/CustomerForm';
import AddressList from './Components/AddressList';
import AddressForm from './Components/AddressForm';
import './App.css';

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [refreshCustomers, setRefreshCustomers] = useState(false);
  const [refreshAddresses, setRefreshAddresses] = useState(false);

  const triggerCustomerRefresh = () => setRefreshCustomers(!refreshCustomers);
  const triggerAddressRefresh = () => setRefreshAddresses(!refreshAddresses);

  return (
    <Router>
      
      <div className="container">
  <h1 className="page-color">Customer Management</h1>

  <CustomerForm
    customer={selectedCustomer}
    onSaved={() => {
      setSelectedCustomer(null);
      triggerCustomerRefresh();
    }}
  />

  <Routes>
    <Route
      path="/"
      element={
        <CustomerList
          onEdit={setSelectedCustomer}
          refresh={refreshCustomers}
        />
      }
    />
  </Routes>

  <hr />

  <AddressForm
    customerId={selectedCustomer?.id}
    address={selectedAddress}
    onSaved={() => {
      setSelectedAddress(null);
      triggerAddressRefresh();
    }}
  />

  <AddressList
    customerId={selectedCustomer?.id}
    onEdit={setSelectedAddress}
    refresh={refreshAddresses}
  />
</div>

    </Router>
    
  );
}

export default App;
