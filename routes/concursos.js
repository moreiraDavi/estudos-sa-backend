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

router.get("/getOptions", async (req, res) => {

  if (req.method !== "GET") {
    return res.status(405).json({message: 'Método não permitido'})
  }

  try {
    const options = await prisma.concurso.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    res.status(200).json(options)
  } catch (error) {
    console.error('Erro ao buscar opções: ', error)
    res.status(500).json({message: "Erro no servidor"})
  }
})

router.get("/nome/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const concurso = await prisma.concurso.findUnique({
      where: { id: id},
      select: { name: true }
    })
    if (!concurso) {
      return res.status(404).json({ message: "Concurso não encontrado" });
    }
    res.json({name: concurso.name});
  } catch(err) {
    console.error("Erro ao buscar nome do concurso: ", err)
    res.status(500).json({ message: "Erro ao buscar o nome do concurso." });
  }
})


export default router;