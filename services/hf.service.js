// services/hf.service.js
import axios from "axios";

// Cliente Axios para Hugging Face Inference API
const hf = axios.create({
  baseURL: "https://api-inference.huggingface.co",
  headers: {
    Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
    "Content-Type": "application/json",
  },
  timeout: 120_000, // continua dando até 120 s antes de abortar
});

export const HFService = {
  /**
   * Chama a HF Inference API para gerar texto a partir de um prompt.
   *
   * @param {string} prompt                  — texto do prompt
   * @param {Object} options                 — opções de geração
   * @param {number} [options.max_new_tokens] — número máximo de tokens a gerar (baixamos para 100)
   * @param {number} [options.temperature]    — temperatura de geração (mínimo > 0.0)
   * @param {number} [options.top_p]          — top_p de filtragem (deve ser >0 e <1)
   * @param {number} [options.timeout]        — timeout em ms para esta chamada (default: 120000)
   * @returns {Promise<string>}              — texto gerado
   */
  async gerarResposta(prompt, options = {}) {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 MOCK HF (Axios):", prompt);
      return JSON.stringify([
        {
          semana: 1,
          conteudo1: "Assunto Exemplo",
          horario1: "08:00-10:00",
          conteudo2: null,
          horario2: null,
          conteudo3: null,
          horario3: null,
          conteudo4: null,
          horario4: null,
          conteudo5: null,
          horario5: null,
          conteudo6: null,
          horario6: null,
          conteudo7: null,
          horario7: null,
        },
      ]);
    }

    const {
      max_new_tokens = 100, // reduzido de 300 para 100
      temperature = 0.1, // deve ser > 0.0
      top_p = 0.9, // entre 0 e 1
      timeout = 120_000,
    } = options;

    try {
      const model = process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct";

      const response = await hf.post(
        `/models/${model}`,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.1,
            top_p: 0.9,
            return_full_text: false,
            stop_sequences: ["}"],
          },
        },
        { timeout }
      );

      const data = response.data;
      if (data.generated_text && typeof data.generated_text === "string") {
        return data.generated_text;
      }
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text;
      }

      throw new Error(
        "Resposta inesperada do HF Inference API: " + JSON.stringify(data)
      );
    } catch (err) {
      console.error(
        "Erro no HFService.gerarResposta:",
        err.response?.status,
        err.response?.data ?? err.message
      );
      throw err;
    }
  },
};
