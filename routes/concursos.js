import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { estado } = req.query;

    const filtroEstado = Array.isArray(estado)
      ? { in: estado }
      : estado
      ? { equals: estado }
      : undefined;

    const concursos = await prisma.concurso.findMany({
      where: filtroEstado ? { estado: filtroEstado } : {},
      orderBy: { dataProva: "asc" },
    });

    res.json(concursos);
  } catch (err) {
    console.error("Erro ao buscar concursos:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});


export default router;