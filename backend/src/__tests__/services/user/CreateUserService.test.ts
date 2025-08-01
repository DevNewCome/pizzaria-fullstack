import { createUserService } from '../../../services/user/CreateUserService';
import prismaClient from '../../../prisma';
import { hash } from 'bcryptjs';

// Mock do Prisma Client
jest.mock('../../../prisma', () => ({
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock do bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

// Cast para simplificar o prismaClient com mocks do jest
const mockPrisma = prismaClient as unknown as {
  user: {
    findFirst: jest.Mock<any, any>;
    create: jest.Mock<any, any>;
  };
};

// Aqui forçamos o mock do hash como jest.Mock simples
const mockHash = hash as unknown as jest.Mock;

describe('CreateUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserService', () => {
    const validUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should create a user successfully with valid data', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockHash.mockResolvedValue('hashedPassword');
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
      });

      // Act
      const result = await createUserService(validUserData);

      // Assert
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockHash).toHaveBeenCalledWith('password123', 8);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
        },
        select: {
          id: true,
          name: true,
          email: true,
        }
      });
      expect(result).toEqual({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    it('should throw error when email is missing', async () => {
      // Arrange
      const invalidUserData = {
        name: 'Test User',
        email: '',
        password: 'password123'
      };

      // Act & Assert
      await expect(createUserService(invalidUserData)).rejects.toThrow('Email incorrect');
      expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
      expect(mockHash).not.toHaveBeenCalled();
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw error when user already exists', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'existing-user-id',
        name: 'Existing User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act & Assert
      await expect(createUserService(validUserData)).rejects.toThrow('User already exists');
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockHash).not.toHaveBeenCalled();
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockHash.mockResolvedValue('hashedPassword');
      mockPrisma.user.create.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(createUserService(validUserData)).rejects.toThrow('Database connection failed');
    });
  });
});
