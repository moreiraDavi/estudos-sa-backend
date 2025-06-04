// utils/prompt.js
export function gerarPromptRotina(pref) {
  const semanas = parseInt(pref.duracao, 10);
  const dias = pref.diasEstudo;

  return `
Você é um assistente que cria rotinas de estudo para concursos.

Concurso: ${pref.concurso.name}
Turno: ${pref.turno}
Dias por semana: ${dias}
Semanas totais: ${semanas}

Divida todos os tópicos do edital em ${semanas} semanas, com ${dias} dias de estudo a cada semana.
Nos dias em que não houver estudo, preencha "conteudoX": null e "horarioX": null.

Retorne APENAS um array JSON onde cada elemento corresponde a uma semana, no formato:

[
  {
    "semana": 1,
    "conteudo1": "Assunto A",
    "horario1": "08:00-10:00",
    "conteudo2": "Assunto B",
    "horario2": "10:00-12:00",
    "conteudo3": null,
    "horario3": null,
    "conteudo4": null,
    "horario4": null,
    "conteudo5": null,
    "horario5": null,
    "conteudo6": null,
    "horario6": null,
    "conteudo7": null,
    "horario7": null
  },
  {
    "semana": 2,
    "conteudo1": "Assunto C",
    "horario1": "08:00-10:00",
    // repita até conteudo7/horario7
    "conteudo7": null,
    "horario7": null
  }
  // até a semana ${semanas}
]
`;
}
