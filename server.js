const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3001;
const app = express();

//EXPRESS MIDDLEWARE
app.use(express.urlencoded({
    express: false
}));
app.use(express.json());

// Connecting to the Database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to election database.');
});

//GET ROUTE FOR ROOT
app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

// CREATE a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
                VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];
db.run(sql, params, function (err, results) {
    if (err) {
        console.log(err);
    }
    console.log(results, this.lastID);
});

//Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }

        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

// Get single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates 
                 WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            return;
        }

        res.json({
            message: 'success',
            data: row
        });
    });
});

// SELECT ALL FROM CANDIDATES
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
            return;
        }
        res.json({
            message: 'gucci',
            data: rows
        });
    });
});

//Default response for any (NOTFOUND) requests Catch all
app.use((req, res) => {
    res.status(404).end();
});

//Start server after Database connected
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});