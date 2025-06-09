import dotenv from "dotenv";

dotenv.config();

import express          from "express";
import publicRoutes     from "./routes/public.js";
import privateRoutes    from "./routes/private.js";
import ConcursoRoute    from "./routes/concursos.js";
import cors             from "cors";
import RotinaRoute      from "./routes/rotinas.js";

import auth from "./middlewares/auth.js";

const app = express();
app.use(express.json());
app.use(cors());

// Rotas Públicas
app.use("/usuarios", publicRoutes);
app.use("/concursos", ConcursoRoute);

// Rotas privadas
app.use("/preferencias", auth, privateRoutes);
app.use("/rotinas", auth, RotinaRoute);

app.listen(3000, () => console.log("Servidor rodando"));
