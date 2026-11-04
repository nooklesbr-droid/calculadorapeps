'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Procura o index.html em /public ou na raiz do projeto
const PASTA = fs.existsSync(path.join(__dirname, 'public', 'index.html'))
    ? path.join(__dirname, 'public')
    : __dirname;
const PAGINA = path.join(PASTA, 'index.html');

app.disable('x-powered-by');
app.set('trust proxy', 1); // Render fica atrás de proxy

// Cabeçalhos de segurança básicos
app.use((req, res, next) => {
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    });
    next();
});

// Health check (configure em Render > Settings > Health Check Path: /healthz)
app.get('/healthz', (req, res) => res.type('text').send('ok'));

// Página principal — só serve o index.html, nunca expõe package.json, index.js etc.
app.get(['/', '/index.html'], (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, must-revalidate');
    res.sendFile(PAGINA);
});

app.get('/robots.txt', (req, res) => {
    res.type('text').send('User-agent: *\nAllow: /\nSitemap: https://calculadorapept.onrender.com/sitemap.xml\n');
});

app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml').send(
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        '<url><loc>https://calculadorapept.onrender.com/</loc></url>' +
        '</urlset>'
    );
});

// Qualquer outra rota volta para a calculadora
app.use((req, res) => res.redirect(301, '/'));

app.listen(PORT, () => {
    console.log(`Calculadora PEPS rodando na porta ${PORT}`);
});
