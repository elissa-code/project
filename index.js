const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const PORT = 2000;
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'system'
});

db.connect((err) => {
    if (err) {
        console.error("none database created", err);
    } else {
        console.log("connected to database");
    }
});

// Signup Endpoint
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    const checkSql = 'SELECT * FROM user WHERE username = ?';
    db.query(checkSql, [username], (err, results) => {
        if (err) {
            return res.json({ message: err });
        }
        if (results.length > 0) {
            return res.json({ message: 'Username already exists' });
        }
        const insertSql = 'INSERT INTO user (username, password) VALUES (?, ?)';
        db.query(insertSql, [username, password], (err, result) => {
            if (err) return res.json({ message: err });
            return res.json({ message: 'Signup successful', userId: result.insertId });
        });
    });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM user WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) return res.json({ message: err });
        if (results.length === 0) {
            return res.json({ message: 'User not found' });
        }
        const user = results[0];
        if (user.password === password) {
            return res.json({ message: 'Login successful', userId: user.id });
        } else {
            return res.json({ message: 'Incorrect password' });
        }
    });
});

// Post class data
app.post('/api/post', (req, res) => {
    const { name, age } = req.body;
    const sql = 'INSERT INTO class(name, age) VALUES(?, ?)';
    db.query(sql, [name, age], (err, result) => {
        if (err) res.json({ Message: err });
        return res.json(result);
    });
});

// Get class data
app.get('/api/get', (req, res) => {
    const sql = 'SELECT * FROM class';
    db.query(sql, (err, result) => {
        if (err) res.json({ message: err });
        return res.json(result);
    });
});

// Update class data
app.put('/api/put/:id', (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;
    const sql = "UPDATE class SET name =?, age= ? WHERE id=?";
    db.query(sql, [name, age, id], (err, result) => {
        if (err) res.json({ message: err });
        return res.json(result);
    });
});

// Delete class data
app.delete('/api/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM class WHERE id =?";
    db.query(sql, [id], (err, result) => {
        if (err) res.json({ message: err });
        return res.json(result);
    });
});

// **New Report Endpoint**
app.get('/api/report', (req, res) => {
    // Example: Generate a report of all users and classes
    // Fetch users
    const usersSql = 'SELECT * FROM user';
    // Fetch classes
    const classesSql = 'SELECT * FROM class';

    // Execute both queries in parallel
    db.query(usersSql, (err, users) => {
        if (err) return res.json({ message: err });
        db.query(classesSql, (err, classes) => {
            if (err) return res.json({ message: err });
            // Compose report object
            const report = {
                totalUsers: users.length,
                totalClasses: classes.length,
                users: users,
                classes: classes
            };
            return res.json(report);
        });
    });
});
// **New Report Endpoint**
app.get('/api/report', (req, res) => {
    // Fetch all users
    const usersSql = 'SELECT * FROM user';
    // Fetch all classes
    const classesSql = 'SELECT * FROM class';

    // Execute both queries in parallel
    db.query(usersSql, (err, users) => {
        if (err) {
            return res.json({ message: err });
        }
        db.query(classesSql, (err, classes) => {
            if (err) {
                return res.json({ message: err });
            }
            // Compose report object
            const report = {
                totalUsers: users.length,
                totalClasses: classes.length,
                users: users,
                classes: classes
            };
            return res.json(report);
        });
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});