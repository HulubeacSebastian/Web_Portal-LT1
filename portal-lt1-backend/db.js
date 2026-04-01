const { Pool } = require('pg');

// Configurarea datelor de conectare la PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portal_lt1',
    password: 'Sebi14231',
    port: 5432,
});

// Testăm conexiunea când pornește serverul
pool.connect()
    .then(() => console.log('Conexiunea la baza de date portal_lt1 a reusit!'))
    .catch(err => console.error('Eroare la conectarea cu baza de date', err.stack));

module.exports = {
    query: (text, params) => pool.query(text, params),
};