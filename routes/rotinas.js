import express from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middlewares/auth.js"; // Importe seu middleware de autenticação

const router = express.Router();
const prisma = new PrismaClient();

// Aplique o middleware auth em todas as rotas deste router
router.use(auth);

router.get("/", async (req, res) => {
  const userId = req.userId;
  const { concursoId } = req.query;

  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  try {
    const rotinas = await prisma.rotina.findMany({
      where: {
        userId,
        concursoId, // Remova Number() se concursoId for string (ObjectId)
      },
    });
    res.json({ rotinas });
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar rotinas." });
  }
});

export default router;