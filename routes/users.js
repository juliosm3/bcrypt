const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../data/users');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { secret } = require('../crypto/config');

const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.user) {
        return res.send(`<h1>Bienvenido ${req.session.user.name}</h1><a href='/dashboard'>Ir al dashboard</a><form action='/logout' method='POST'><button type='submit'>Logout</button></form>`);
    }
    res.send(`<form action='/login' method='POST'><input name='username' /><input name='password' type='password' /><button type='submit'>Login</button></form>`);
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send('Credenciales inválidas');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
    req.session.user = user;
    res.json({ token });
});

router.get('/dashboard', authenticateToken, (req, res) => {
    res.send(`<h1>Dashboard</h1><p>Bienvenido, ${req.user.username}</p>`);
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('Sesión cerrada');
});

module.exports = router;