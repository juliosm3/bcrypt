const express = require('express');
const session = require('express-session');
const usersRouter = require('./routes/users');
const { hashedSecret } = require('./crypto/config');

const app = express();
app.use(express.json());
app.use(session({
    secret: hashedSecret,
    resave: false,
    saveUninitialized: true
}));

app.use('/', usersRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
