import express from "express";
import { PrismaClient } from "@prisma/client";
import { HFService } from "../services/hf.service.js";
import { RotinaService } from "../services/rotina.service.js";
import { gerarPromptRotina } from "../utils/prompt.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create-com-rotina", async (req, res) => {
  const { concursoId, diasEstudo, turno, duracao } = req.body;
  const userId = req.userId;
  if (!userId)
    return res.status(401).json({ message: "Usuário não autenticado." });

  // Cria a preferência **já incluindo** o concurso.name
  let pref;
  try {
    const count = await prisma.preferencia.count({ where: { userId } });
    if (count >= 6) {
      return res
        .status(400)
        .json({ message: "Limite de 6 preferências atingido." });
    }
    pref = await prisma.preferencia.create({
      data: { userId, concursoId, diasEstudo, turno, duracao },
      include: {
        concurso: { select: { name: true } },
      },
    });
  } catch (err) {
    console.error("Erro ao criar preferência:", err);
    return res.status(500).json({ message: err.message });
  }

  // Gera o prompt e as rotinas
  let payloads;
  try {
    const prompt = gerarPromptRotina(pref); // agora pref.concurso.name existe
    const raw = await HFService.gerarResposta(prompt);

    let semanasJson;
    try {
      semanasJson = JSON.parse(raw);
    } catch {
      throw new Error(`JSON inválido da IA: ${raw}`);
    }

    payloads = semanasJson.map((semObj) => ({
      userId,
      concursoId: pref.concursoId,
      semana: semObj.semana,
      ...semObj,
    }));
  } catch (err) {
    console.error("Erro ao gerar payloads de rotina:", err);
    await prisma.preferencia.delete({ where: { id: pref.id } });
    return res.status(500).json({ message: err.message });
  }

  // Salva as rotinas
  let rotinasCriadas;
  try {
    rotinasCriadas = await RotinaService.criarMultiplas(payloads);
  } catch (err) {
    console.error("Erro ao salvar rotinas:", err);
    await prisma.preferencia.delete({ where: { id: pref.id } });
    return res.status(500).json({ message: err.message });
  }

  // Sucesso
  return res.status(201).json({ preferencia: pref, rotinas: rotinasCriadas });
});

router.get("/getPreferencias", async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // Inclua explicitamente a relação 'concurso' para buscar o name
    const preferencias = await prisma.preferencia.findMany({
      where: { userId },
      include: {
        concurso: {
          select: { name: true },
        },
      },
    });

    return res.json({ preferencias });
  } catch (err) {
    console.error("Erro ao buscar preferências:", err);
    return res
      .status(500)
      .json({ message: err.message || "Erro ao buscar preferências." });
  }
});

export default router;
