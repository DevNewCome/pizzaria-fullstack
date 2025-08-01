import { authUserService } from '../../../services/user/AuthUserService';
import prismaClient from '../../../prisma';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

// Mock do Prisma Client
jest.mock('../../../prisma', () => ({
  user: {
    findFirst: jest.fn(),
  },
}));

// Mock do bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const mockPrisma = prismaClient as jest.Mocked<typeof prismaClient>;
const mockCompare = compare as jest.MockedFunction<typeof compare>;
const mockSign = sign as jest.MockedFunction<typeof sign>;

describe('AuthUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('authUserService', () => {
    const validAuthData = {
      email: 'test@example.com',
      password: 'password123'
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
      // Arrange
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true as never);
      mockSign.mockReturnValue('valid-jwt-token');

      // Act
      const result = await authUserService(validAuthData);

      // Assert
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockCompare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(mockSign).toHaveBeenCalledWith(
        {
          name: 'Test User',
          email: 'test@example.com'
        },
        'test-secret',
        {
          subject: 'user-id',
          expiresIn: '30d'
        }
      );
      expect(result).toEqual({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        token: 'valid-jwt-token'
      });
    });

    it('should throw error when user does not exist', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(authUserService(validAuthData)).rejects.toThrow('User/password incorrect');
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockCompare).not.toHaveBeenCalled();
      expect(mockSign).not.toHaveBeenCalled();
    });

    it('should throw error when password is incorrect', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(authUserService(validAuthData)).rejects.toThrow('User/password incorrect');
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockCompare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(mockSign).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(authUserService(validAuthData)).rejects.toThrow('Database connection failed');
    });

    it('should handle JWT signing errors gracefully', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true as never);
      mockSign.mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      // Act & Assert
      await expect(authUserService(validAuthData)).rejects.toThrow('JWT signing failed');
    });
  });
}); 