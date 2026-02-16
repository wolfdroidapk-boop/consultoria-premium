require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Servidor da Consultoria Premium rodando 🚀");
});

app.post("/gerar-relatorio", async (req, res) => {
  try {
    const { nicho, publico, oferta } = req.body;

    const prompt = `
    Crie um relatório estratégico premium para uma consultoria high ticket.
    
    Nicho: ${nicho}
    Público-alvo: ${publico}
    Oferta: ${oferta}
    
    Estruture com:
    - Diagnóstico
    - Posicionamento estratégico
    - Estratégia de aquisição
    - Estrutura de funil
    - Plano de ação 30 dias
    `;

    const resposta = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });

    const texto = resposta.choices[0].message.content;

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");

    doc.pipe(res);
    doc.fontSize(12).text(texto);
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao gerar relatório" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
