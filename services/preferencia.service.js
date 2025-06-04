import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const PreferenciaService = {
  /** Lista todas as preferências (sem filtro) */
  async listar() {
    return prisma.preferencia.findMany();
  },

  /** Lista as preferências de um usuário específico, incluindo nome do concurso */
  async listarPorUsuario(userId) {
    return prisma.preferencia.findMany({
      where: { userId },
      include: {
        concurso: {
          select: { name: true }
        }
      }
    });
  }
};

export { PreferenciaService };