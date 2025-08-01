import { authUserService } from '../../../services/user/AuthUserService';
import prismaClient from '../../../prisma';
import { compare as bcryptCompare } from 'bcryptjs';
import { sign as jwtSign } from 'jsonwebtoken';

// Mocks do prisma, bcrypt e jsonwebtoken
jest.mock('../../../prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

// Referência tipada para os mocks
const mockPrisma = prismaClient as unknown as {
  user: {
    findFirst: jest.Mock;
  };
};


const mockCompare = bcryptCompare as jest.Mock;
const mockSign = jwtSign as jest.Mock;

describe('AuthUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  const validAuthData = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockUser = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    created_at: new Date(),
    updated_at: new Date(),
  };

  it('should authenticate user successfully with valid credentials', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(true);
    mockSign.mockReturnValue('valid-jwt-token');

    const result = await authUserService(validAuthData);

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(mockCompare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(mockSign).toHaveBeenCalledWith(
      {
        name: 'Test User',
        email: 'test@example.com',
      },
      'test-secret',
      {
        subject: 'user-id',
        expiresIn: '30d',
      }
    );
    expect(result).toEqual({
      id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      token: 'valid-jwt-token',
    });
  });

  it('should throw error when user does not exist', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);

    await expect(authUserService(validAuthData)).rejects.toThrow('User/password incorrect');
    expect(mockCompare).not.toHaveBeenCalled();
    expect(mockSign).not.toHaveBeenCalled();
  });

  it('should throw error when password is incorrect', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(false);

    await expect(authUserService(validAuthData)).rejects.toThrow('User/password incorrect');
    expect(mockSign).not.toHaveBeenCalled();
  });

  it('should handle database errors gracefully', async () => {
    mockPrisma.user.findFirst.mockRejectedValue(new Error('Database connection failed'));

    await expect(authUserService(validAuthData)).rejects.toThrow('Database connection failed');
  });

  it('should handle JWT signing errors gracefully', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(true);
    mockSign.mockImplementation(() => {
      throw new Error('JWT signing failed');
    });

    await expect(authUserService(validAuthData)).rejects.toThrow('JWT signing failed');
  });
});
