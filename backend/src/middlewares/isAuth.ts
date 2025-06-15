import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface PayLoad {
    sub: string;
}

export function isAuth(req: Request, res: Response, next: NextFunction) {
    // 1️⃣ Pega o token do cabeçalho da requisição
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).end();
    }

    // 2️⃣ O token vem no formato: "Bearer TOKEN_AQUI", então pegamos só o TOKEN
    const [, token] = authToken.split(" ");

    try {
        // 3️⃣ Verifica se o token é válido
        const { sub } = verify(token, process.env.JWT_SECRET) as PayLoad;

        // 4️⃣ Adiciona o ID do usuário na requisição (para poder usá-lo nas rotas protegidas)
        req.user_id = sub;
        
        // 5️⃣ Chama `next()` para continuar a requisição
        return next();
    } catch {
        return res.status(401).end();
    }
}
