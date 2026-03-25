const express = require('express');
const cors = require('cors');
const path = require('path'); // Nova biblioteca padrão do Node
const app = express();

// O Render define a porta automaticamente, por isso usamos process.env.PORT
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

// Diz para o Express servir os arquivos da pasta "public" (seu index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Nossa rota de cálculo intocada
app.post('/api/calcular-dose', (req, res) => {
    const { dosagemTotalMg, diluicaoMl, doseDesejadaMg } = req.body;

    if (!dosagemTotalMg || !diluicaoMl || !doseDesejadaMg || diluicaoMl <= 0) {
        return res.status(400).json({ erro: 'Dados de entrada inválidos.' });
    }

    try {
        const concentracao = dosagemTotalMg / diluicaoMl; 
        const doseMl = doseDesejadaMg / concentracao; 
        const doseUnidades = Math.round(doseMl * 100);

        res.json({
            concentracaoMgMl: concentracao.toFixed(2),
            doseMl: doseMl.toFixed(3), 
            doseUnidades: doseUnidades
        });

    } catch (error) {
        res.status(500).json({ erro: 'Erro interno no cálculo.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
