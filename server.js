import express from "express";
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import ConcursoRoute from './routes/concursos.js'
import cors from 'cors'

import auth from './middlewares/auth.js'

const app = express();

app.use(express.json())

app.use(cors())

app.use ('/rotinas', auth, privateRoutes)

app.use('/usuarios', publicRoutes)

app.use('/concursos',ConcursoRoute)




app.listen(3000, () => console.log("Servidor rodando"));
