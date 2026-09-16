// Punct de intrare pentru Vercel (functie serverless).
// Vercel importa acest fisier si apeleaza direct exportul cu (req, res) — un Express app
// este deja o functie (req, res) => {}, deci nu are nevoie de un wrapper suplimentar.
// Nu porneste server.listen() si nu atasaza WebSocket (vezi bin/www) — acelea raman
// valabile doar pentru rularea locala / pe VM (Oracle Cloud).

const app = require('../src/app');

module.exports = app;
