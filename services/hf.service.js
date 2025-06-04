import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_API_TOKEN);

export const HFService = {
  async gerarResposta(prompt) {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 MOCK HF:", prompt);
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

    try {
      const model = process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct";
      
      // Usando o método conversational para modelos Llama
      const response = await hf.conversational({
        model: model,
        inputs: {
          text: prompt,
          past_user_inputs: [],
          generated_responses: []
        },
        parameters: {
          temperature: 0.7,
          max_length: 300,
          return_full_text: false
        }
      });

      return response.generated_text;
    } catch (err) {
      console.error(
        "Erro no HFService.gerarResposta:",
        err.response?.data ?? err.message
      );
      throw err;
    }
  },
};