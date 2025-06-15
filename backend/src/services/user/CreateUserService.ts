import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export const createUserService = async ({ name, email, password }: UserRequest): Promise<UserResponse> => {
  if (!email) {
    throw new Error('Email incorrect');
  }

  const userAlreadyExists = await prismaClient.user.findFirst({
    where: { email }
  });

  if (userAlreadyExists) {
    throw new Error('User already exists');
  }

  const passwordHash = await hash(password, 8);

  const user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });

  return user;
};
