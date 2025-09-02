// server/index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

// Initialize tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        address_details TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pin_code TEXT NOT NULL,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
    )`);
});

// ------------------- Customer Routes -------------------

// Create Customer
app.post('/api/customers', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const sql = 'INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)';
    db.run(sql, [first_name, last_name, phone_number], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Customer created', customer_id: this.lastID });
    });
});
//
app.get('/', (req, res) => {
    res.json('Customer Management API is running');
})
// Read All Customers
app.get('/api/customers', (req, res) => {
    const { city, state, pin_code, page = 1, limit = 10 } = req.query;
    let sql = 'SELECT c.*, COUNT(a.id) as address_count FROM customers c LEFT JOIN addresses a ON c.id = a.customer_id';
    const filters = [];
    if (city) filters.push(`a.city='${city}'`);
    if (state) filters.push(`a.state='${state}'`);
    if (pin_code) filters.push(`a.pin_code='${pin_code}'`);
    if (filters.length) sql += ' WHERE ' + filters.join(' AND ');
    sql += ' GROUP BY c.id';
    const offset = (page - 1) * limit;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'success', data: rows });
    });
});

// Get Customer by ID
app.get('/api/customers/:id', (req, res) => {
    const sql = 'SELECT * FROM customers WHERE id=?';
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Customer not found" });
        res.json({ message: 'success', data: row });
    });
});

// Update Customer
app.put('/api/customers/:id', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    const sql = 'UPDATE customers SET first_name=?, last_name=?, phone_number=? WHERE id=?';
    db.run(sql, [first_name, last_name, phone_number, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Customer updated', changes: this.changes });
    });
});

// Delete Customer
app.delete('/api/customers/:id', (req, res) => {
    const sql = 'DELETE FROM customers WHERE id=?';
    db.run(sql, [req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Customer deleted', changes: this.changes });
    });
});

// ------------------- Address Routes -------------------

// Add Address
app.post('/api/customers/:id/addresses', (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    const sql = 'INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [req.params.id, address_details, city, state, pin_code], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Address added', address_id: this.lastID });
    });
});

// Get Customer Addresses
app.get('/api/customers/:id/addresses', (req, res) => {
    const sql = 'SELECT * FROM addresses WHERE customer_id=?';
    db.all(sql, [req.params.id], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'success', data: rows });
    });
});

// Update Address
app.put('/api/addresses/:id', (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    const sql = 'UPDATE addresses SET address_details=?, city=?, state=?, pin_code=? WHERE id=?';
    db.run(sql, [address_details, city, state, pin_code, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Address updated', changes: this.changes });
    });
});

// Delete Address
app.delete('/api/addresses/:id', (req, res) => {
    const sql = 'DELETE FROM addresses WHERE id=?';
    db.run(sql, [req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Address deleted', changes: this.changes });
    });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
