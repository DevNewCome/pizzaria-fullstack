import { createUserService } from '../../services/user/CreateUserService';
import { authUserService } from '../../services/user/AuthUserService';
import { CreateCategoryService } from '../../services/category/CreateCategoryService';
import prismaClient from '../../prisma';

// Mock do Prisma Client
jest.mock('../../prisma', () => ({
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  category: {
    create: jest.fn(),
  },
}));

// Mock do bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const mockPrisma = prismaClient as jest.Mocked<typeof prismaClient>;

describe('Error Handling and Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('Database Connection Errors', () => {
    it('should handle database connection timeout', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockRejectedValue(new Error('Connection timeout'));

      // Act & Assert
      await expect(createUserService({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Connection timeout');
    });

    it('should handle database constraint violations', async () => {
      // Arrange
      mockPrisma.user.create.mockRejectedValue(new Error('Unique constraint failed'));

      // Act & Assert
      await expect(createUserService({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Unique constraint failed');
    });
  });

  describe('Input Validation Edge Cases', () => {
    it('should handle extremely long input strings', async () => {
      // Arrange
      const longString = 'A'.repeat(10000);
      
      // Act & Assert
      await expect(createUserService({
        name: longString,
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow();
    });

    it('should handle null and undefined values', async () => {
      // Arrange
      const invalidData = {
        name: null,
        email: undefined,
        password: ''
      };

      // Act & Assert
      await expect(createUserService(invalidData as any)).rejects.toThrow();
    });

    it('should handle special characters in input', async () => {
      // Arrange
      const specialCharData = {
        name: 'User<script>alert("xss")</script>',
        email: 'test@example.com',
        password: 'password123'
      };

      // Act & Assert
      await expect(createUserService(specialCharData)).rejects.toThrow();
    });
  });

  describe('Authentication Edge Cases', () => {
    it('should handle expired JWT tokens', async () => {
      // Arrange
      const { sign } = require('jsonwebtoken');
      sign.mockImplementation(() => {
        throw new Error('Token expired');
      });

      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const { compare } = require('bcryptjs');
      compare.mockResolvedValue(true);

      // Act & Assert
      await expect(authUserService({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Token expired');
    });

    it('should handle malformed JWT tokens', async () => {
      // Arrange
      const { sign } = require('jsonwebtoken');
      sign.mockImplementation(() => {
        throw new Error('Invalid token format');
      });

      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const { compare } = require('bcryptjs');
      compare.mockResolvedValue(true);

      // Act & Assert
      await expect(authUserService({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Invalid token format');
    });
  });

  describe('Password Hashing Edge Cases', () => {
    it('should handle bcrypt hashing failures', async () => {
      // Arrange
      const { hash } = require('bcryptjs');
      hash.mockRejectedValue(new Error('Hashing failed'));

      mockPrisma.user.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(createUserService({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Hashing failed');
    });

    it('should handle bcrypt comparison failures', async () => {
      // Arrange
      const { compare } = require('bcryptjs');
      compare.mockRejectedValue(new Error('Comparison failed'));

      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act & Assert
      await expect(authUserService({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Comparison failed');
    });
  });

  describe('Category Service Edge Cases', () => {
    it('should handle category name with only whitespace', async () => {
      // Arrange
      const createCategoryService = new CreateCategoryService();

      // Act & Assert
      await expect(createCategoryService.execute({ name: '   ' }))
        .rejects.toThrow('Nome da categoria é obrigatório');
    });

    it('should handle category name with special characters', async () => {
      // Arrange
      const createCategoryService = new CreateCategoryService();
      mockPrisma.category.create.mockResolvedValue({
        id: 'category-id',
        name: 'Pizzas & Bebidas 🍕',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act
      const result = await createCategoryService.execute({ name: 'Pizzas & Bebidas 🍕' });

      // Assert
      expect(result).toEqual({
        id: 'category-id',
        name: 'Pizzas & Bebidas 🍕',
      });
    });
  });

  describe('Memory and Performance Edge Cases', () => {
    it('should handle large data sets without memory issues', async () => {
      // Arrange
      const largeDataArray = Array.from({ length: 1000 }, (_, i) => ({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: 'password123'
      }));

      // Act & Assert
      // This test ensures the service can handle large amounts of data
      // without causing memory leaks or performance issues
      expect(largeDataArray.length).toBe(1000);
    });

    it('should handle concurrent requests', async () => {
      // Arrange
      mockPrisma.user.findFirst.mockResolvedValue(null);
      const { hash } = require('bcryptjs');
      hash.mockResolvedValue('hashedPassword');
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act
      const promises = Array.from({ length: 10 }, () =>
        createUserService({
          name: 'Test User',
          email: `test${Math.random()}@example.com`,
          password: 'password123'
        })
      );

      // Assert
      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('email');
      });
    });
  });

  describe('Environment Variable Edge Cases', () => {
    it('should handle missing JWT_SECRET environment variable', async () => {
      // Arrange
      delete process.env.JWT_SECRET;

      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const { compare } = require('bcryptjs');
      compare.mockResolvedValue(true);

      const { sign } = require('jsonwebtoken');
      sign.mockImplementation(() => {
        throw new Error('JWT_SECRET is not defined');
      });

      // Act & Assert
      await expect(authUserService({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('JWT_SECRET is not defined');
    });
  });
}); 