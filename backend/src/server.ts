import express, {Request, Response, NextFunction} from 'express'
import 'express-async-errors'
import cors from 'cors'
import path from 'path'
import { router } from './routes'
import { logger } from './middlewares/logger'

const PORT = 3000

const app = express()
app.use(logger)
app.use(express.json())
app.use(cors()) //serve pra qualquer ip poder consumir nossa API
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
    console.log('RODANDO NA PORTA 3000')
})