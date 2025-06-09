// utils/prompt.js

/**
 * Monta um prompt para gerar apenas UMA semana de rotina,
 * evitando repetir conteúdos já usados.
 *
 * @param {Object} pref             — preferência com campos: concurso.name, turno, diasEstudo, duracao.
 * @param {number} semanaAtual      — índice desta chamada (de 1 até pref.duracao).
 * @param {string[]} prevContents   — lista de todos os conteúdos já alocados nas semanas anteriores.
 * @returns {string}                — prompt pronto para enviar à IA.
 */
export function gerarPromptSemana(pref, semanaAtual, prevContents = []) {
  const totalSemanas = parseInt(pref.duracao, 10);
  const dias = pref.diasEstudo;
  const concurso = pref.concurso.name;

  // Se já houver conteúdos alocados, transformamos em texto:
  // Exemplo:
  // “CONTEÚDOS JÁ USADOS NAS SEMANAS ANTERIORES:
  // - Direito Administrativo
  // - Legislação
  // …”
  const listaPrev =
    prevContents.length > 0
      ? `CONTEÚDOS JÁ USADOS NAS SEMANAS ANTERIORES:\n- ${prevContents.join(
          "\n- "
        )}\n\n`
      : "";

  return `
Você é um assistente que cria rotinas de estudo para concursos.

Dados de entrada:
- Concurso: ${concurso}
- Semana atual: ${semanaAtual} de ${totalSemanas}
- Dias por semana: ${dias}

IMPORTANTE: NÃO repita o enunciado, exemplos ou qualquer texto fora do objeto JSON. Sua resposta deve ser APENAS o objeto JSON solicitado.

${listaPrev}Regras de formatação de saída:
1. Retorne apenas UM objeto JSON (sem array) com exatamente estas 15 chaves, nesta ordem:
   - "semana"          (inteiro, igual a ${semanaAtual})
   - "conteudo1",
   - "conteudo2",
   - "conteudo3",
   - "conteudo4",
   - "conteudo5",
   - "conteudo6",
   - "conteudo7",
2. Para cada dia sem estudo nesta semana, atribua null.
3. NÃO repita NENHUM conteúdo que esteja listado acima como “Conteúdos já usados”.
4. NÃO adicione texto adicional, comentários ou explicações dentro do JSON. Responda estritamente com o OBJETO JSON válido.

Se o usuário escolheu 6 dias, preencha conteudo1 a conteudo6 com os conteúdos e conteudo7 com null.
Sempre preencha os conteúdos em ordem, sem pular nenhum índice.

Exemplo (apenas ilustração de formato — não copie literalmente):
{
  "semana": ${semanaAtual},
  "conteudo1": "…",
  …,
  "conteudo7": null,
}

`;
}
