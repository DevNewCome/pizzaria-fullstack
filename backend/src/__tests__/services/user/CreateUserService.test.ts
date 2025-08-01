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

const mockPrisma = prismaClient as jest.Mocked<typeof prismaClient>;
const mockHash = hash as jest.MockedFunction<typeof hash>;

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
      mockHash.mockResolvedValue('hashedPassword' as never);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
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
      mockHash.mockResolvedValue('hashedPassword' as never);
      mockPrisma.user.create.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(createUserService(validUserData)).rejects.toThrow('Database connection failed');
    });
  });
}); 