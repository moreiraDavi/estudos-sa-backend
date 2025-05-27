import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", async (req, res) => {
  try {
    const { concursoId, diasEstudo, turno } = req.body;
    const userId = req.userId; // Certifique-se que o middleware de autenticação adiciona req.userId

    // Verifica se o usuário já possui 5 preferências
    const count = await prisma.preferencia.count({
      where: { userId }
    });

    if (count >= 6) {
      return res.status(400).json({ message: "Limite de 6 preferências atingido." });
    }

    const preferencia = await prisma.preferencia.create({
      data: {
        userId,
        concursoId,
        diasEstudo,
        turno,
      },
    });

    res.status(201).json(preferencia);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar preferência." });
  }
});

export default router