import { Request, Response } from 'express';
import { createUserService } from '../../services/user/CreateUserService';

export const createUserController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;
    const user = await createUserService({ name, email, password });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};
