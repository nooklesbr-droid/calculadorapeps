// Servidor Node.js simples com Express
const express = require('express');
const cors = require('cors'); // Para permitir que o frontend acesse a API
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rota para calcular a dose
app.post('/api/calcular-dose', (req, res) => {
    // Recebe os dados do frontend
    const { dosagemTotalMg, diluicaoMl, doseDesejadaMg } = req.body;

    // Validação básica
    if (!dosagemTotalMg || !diluicaoMl || !doseDesejadaMg || diluicaoMl <= 0) {
        return res.status(400).json({ erro: 'Dados de entrada inválidos.' });
    }

    try {
        // 1. Calcular a Concentração
        const concentracao = dosagemTotalMg / diluicaoMl; // mg/mL

        // 2. Calcular a Dose em mL
        const doseMl = doseDesejadaMg / concentracao; // mL

        // 3. (Opcional) Converter para unidades se for seringa de insulina (1mL = 100U)
        const doseUnidades = doseMl * 100;

        // Retornar os resultados
        res.json({
            concentracaoMgMl: concentracao.toFixed(2),
            doseMl: doseMl.toFixed(3), // Arredondar para precisão médica
            doseUnidades: Math.round(doseUnidades)
        });

    } catch (error) {
        res.status(500).json({ erro: 'Erro interno no cálculo.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor de cálculo rodando em http://localhost:${port}`);
});