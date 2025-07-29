const request = require('supertest');
const fs = require('fs');
const app = require('../index');

const testTask = { id: '1', title: 'Tarea de prueba' };

afterAll(() => {
    // Limpieza: eliminar la tarea de prueba
    const tasks = JSON.parse(fs.readFileSync('./tasks.json', 'utf8'));
    const filtered = tasks.filter(t => t.id !== testTask.id);
    fs.writeFileSync('./tasks.json', JSON.stringify(filtered, null, 2), 'utf8');
});

describe('API de tareas', () => {
    it('Responde el endpoint raíz', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/API de tareas/i);
    });

    it('Crea una nueva tarea', async () => {
        const res = await request(app).post('/tasks').send(testTask);
        expect(res.statusCode).toBe(201);
        expect(res.body.task).toMatchObject(testTask);
    });

    it('Obtiene todas las tareas', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Busca la tarea creada', async () => {
        const res = await request(app).get(`/tasks/${testTask.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.task).toMatchObject(testTask);
    });
});