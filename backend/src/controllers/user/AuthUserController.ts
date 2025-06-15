import { Request, Response } from 'express';
import { authUserService } from '../../services/user/AuthUserService';

class AuthUserController {
    async handle(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const auth = await authUserService({ email, password });
            return res.json(auth);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { AuthUserController };
