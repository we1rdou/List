const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3001;
const DB_FILE = './tasks.json';

app.use(express.json());

// Leer tareas
const readTasks = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

// Escribir tareas
const writeTasks = (tasks) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2), 'utf8');
};

// Endpoints
app.get('/', (req, res) => {
    res.json({ message: 'API de tareas funcionando' });
});

app.get('/tasks', (req, res) => {
    res.json(readTasks());
});

app.post('/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = req.body;
    if (!newTask.id || !newTask.title) {
        return res.status(400).json({ error: 'id y title requeridos' });
    }
    if (tasks.some(t => t.id === newTask.id)) {
        return res.status(400).json({ error: 'ID ya existe' });
    }
    tasks.push({ ...newTask, completed: false });
    writeTasks(tasks);
    res.status(201).json({ message: 'Tarea creada', task: newTask });
});

app.put('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const idx = tasks.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Tarea no encontrada' });
    tasks[idx] = { ...tasks[idx], ...req.body };
    writeTasks(tasks);
    res.json({ message: 'Tarea actualizada', task: tasks[idx] });
});

app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const filtered = tasks.filter(t => t.id !== req.params.id);
    if (filtered.length === tasks.length) return res.status(404).json({ error: 'Tarea no encontrada' });
    writeTasks(filtered);
    res.json({ message: 'Tarea eliminada' });
});

app.get('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ task });
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}

module.exports = app;