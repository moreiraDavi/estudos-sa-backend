// routes/private.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { HFService } from "../services/hf.service.js";
import { RotinaService } from "../services/rotina.service.js";
import { gerarPromptSemana } from "../utils/prompt.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create-com-rotina", async (req, res) => {
  const { concursoId, diasEstudo, turno, duracao } = req.body;
  const userId = req.userId;
  if (!userId)
    return res.status(401).json({ message: "Usuário não autenticado." });

  // 1️⃣ Cria a preferência
  let pref;
  try {
    const count = await prisma.preferencia.count({ where: { userId } });
    if (count >= 6) {
      return res
        .status(400)
        .json({ message: "Limite de 6 preferências atingido." });
    }

    const jaExiste = await prisma.preferencia.findFirst({
      where: {
        userId,
        concursoId,
      },
    });
    if (jaExiste) {
      return res
        .status(400)
        .json({
          message: "Você já possui uma preferência para este concurso.",
        });
    }

    pref = await prisma.preferencia.create({
      data: { userId, concursoId, diasEstudo, turno, duracao },
      include: { concurso: { select: { name: true } } },
    });
  } catch (err) {
    console.error("Erro ao criar preferência:", err);
    return res.status(500).json({ message: err.message });
  }

  // 2️⃣ Gera uma chamada para cada semana (até duracao, no máximo 5)
  const totalSemanas = parseInt(pref.duracao, 10);
  const prevContents = [];
  const semanasArrays = [];

  for (let semanaAtual = 1; semanaAtual <= totalSemanas; semanaAtual++) {
    const prompt = gerarPromptSemana(pref, semanaAtual, prevContents);
    console.log(`Enviando prompt para semana ${semanaAtual}:`, prompt); // LOG

    try {
      const rawSemana = await HFService.gerarResposta(prompt, {
        max_new_tokens: 100,
        temperature: 0.1,
        top_p: 0.9,
        timeout: 120_000,
      });
      console.log(`Resposta da IA para semana ${semanaAtual}:`, rawSemana); // LOG

      const matchObj = rawSemana.match(/\{[\s\S]*?\}/);
      if (!matchObj)
        throw new Error(`Não veio JSON válido para semana ${semanaAtual}`);
      const objSemana = JSON.parse(matchObj[0]);

      for (let i = 1; i <= 7; i++) {
        const chave = `conteudo${i}`;
        if (i > pref.diasEstudo) {
          objSemana[chave] = null;
        }
      }

      if (objSemana.semana !== semanaAtual) {
        throw new Error(
          `Esperava "semana": ${semanaAtual}, mas recebi ${objSemana.semana}`
        );
      }
      for (let i = 1; i <= 7; i++) {
        const chave = `conteudo${i}`;
        if (objSemana[chave] && typeof objSemana[chave] === "string") {
          prevContents.push(objSemana[chave]);
        }
      }
      semanasArrays.push(objSemana);
    } catch (err) {
      console.error("Erro ao gerar semana:", err);
      try {
        await prisma.preferencia.delete({ where: { id: pref.id } });
      } catch {}
      return res.status(500).json({ message: err.message });
    }
  }

  // 3️⃣ Monta os payloads para salvar no banco
  const payloads = semanasArrays.map((objSemana) => ({
    userId,
    concursoId: pref.concursoId,
    semana: objSemana.semana,
    conteudo1: objSemana.conteudo1,
    conteudo2: objSemana.conteudo2,
    conteudo3: objSemana.conteudo3,
    conteudo4: objSemana.conteudo4,
    conteudo5: objSemana.conteudo5,
    conteudo6: objSemana.conteudo6,
    conteudo7: objSemana.conteudo7,
  }));

  // 4️⃣ Salva todas as rotinas de uma vez no DB
  let rotinasCriadas;
  try {
    rotinasCriadas = await RotinaService.criarMultiplas(payloads);
  } catch (err) {
    console.error("Erro ao salvar rotinas:", err);
    await prisma.preferencia.delete({ where: { id: pref.id } });
    return res.status(500).json({ message: err.message });
  }

  return res.status(201).json({ preferencia: pref, rotinas: rotinasCriadas });
});

router.get("/getPreferencias", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  try {
    const preferencias = await prisma.preferencia.findMany({
      where: { userId },
      include: { concurso: { select: { name: true } } }, // Inclui nome do concurso
    });
    res.json({ preferencias });
  } catch (err) {
    console.error("Erro ao buscar preferências:", err);
    res.status(500).json({ message: "Erro ao buscar preferências." });
  }
});

router.get("/rotinas", async (req, res) => {
  const userId = req.userId;
  const { concursoId } = req.query;

  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  try {
    const rotinas = await prisma.rotina.findMany({
      where: {
        userId,
        concursoId: Number(concursoId),
      },
    });
    res.json({ rotinas });
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar rotinas." });
  }
});

export default router;
