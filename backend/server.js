const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static frontend files

// API Routes (Logic Tier)

// Get all tasks
app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY createdAt DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }
    
    const sql = 'INSERT INTO tasks (title) VALUES (?)';
    db.run(sql, [title], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Task created successfully',
            data: { id: this.lastID, title, completed: 0 }
        });
    });
});

// Toggle task completion
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    
    const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
    db.run(sql, [completed ? 1 : 0, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Task updated successfully', changes: this.changes });
    });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Task deleted successfully', changes: this.changes });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
