// services/rotina.service.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RotinaService = {
  /**
   * Cria uma rotina única no banco.
   * @param {Object} rotinaData - Objeto contendo userId, concursoId, semana, 
   * conteudo1…conteudo7 e horario1…horario7.
   */
  async criar(rotinaData) {
    try {
      return await prisma.rotina.create({
        data: rotinaData
      });
    } catch (error) {
      console.error('Erro ao criar rotina:', error);
      throw error;
    }
  },

  /**
   * Cria múltiplas rotinas (por exemplo, para várias semanas).
   * @param {Array<Object>} rotinasArray - Lista de objetos rotinaData.
   */
  async criarMultiplas(rotinasArray) {
    const criadas = [];
    for (const rotinaData of rotinasArray) {
      const r = await this.criar(rotinaData);
      criadas.push(r);
    }
    return criadas;
  }
};

export { RotinaService };