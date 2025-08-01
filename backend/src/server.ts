import express, {Request, Response, NextFunction} from 'express'
import 'express-async-errors'
import cors from 'cors'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { router } from './routes'
import { logger } from './middlewares/logger'
import { specs } from './config/swagger'

const PORT = 3001

const app = express()
app.use(logger)
app.use(express.json())
app.use(cors()) //serve pra qualquer ip poder consumir nossa API

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Pizzaria - Documentação'
}))

app.use(router)
app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp')) // rota para acessar as fotos
)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
    console.log(`📚 Documentação disponível em: http://localhost:${PORT}/api-docs`)
})