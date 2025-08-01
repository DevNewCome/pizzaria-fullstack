import { sign } from 'jsonwebtoken';
import { Request } from 'express';

export const generateTestToken = (userId: string = 'test-user-id'): string => {
  return sign(
    {
      name: 'Test User',
      email: 'test@example.com'
    },
    process.env.JWT_SECRET || 'test-secret',
    {
      subject: userId,
      expiresIn: '1h'
    }
  );
};

export const mockRequest = (body: any = {}, headers: any = {}): Partial<Request> => {
  return {
    body,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  } as Partial<Request>;
};

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn(); 