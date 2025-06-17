export function gerarPromptSemana(pref, semanaAtual, prevContents = []) {
  const totalSemanas = parseInt(pref.duracao, 10);
  const dias = pref.diasEstudo;
  const concurso = pref.concurso.name;

  const listaPrev =
    prevContents.length > 0
      ? `Conteúdos já usados:\n- ${prevContents.join("\n- ")}\n\n`
      : "";

  return `
Crie uma rotina de estudos para o concurso "${concurso}" referente à semana ${semanaAtual} de ${totalSemanas}, com ${dias} dias de estudo.

${listaPrev}Retorne somente um objeto JSON com as seguintes chaves:
- "semana": ${semanaAtual}
- "conteudo1" a "conteudo7"

Preencha apenas ${dias} conteúdos e use null nos restantes. Não repita conteúdos já usados. Nenhum texto fora do JSON. Nenhum comentário.
`;
}
