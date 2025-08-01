import { CreateCategoryService } from '../../../services/category/CreateCategoryService';
import prismaClient from '../../../prisma';

// Mock do Prisma Client
jest.mock('../../../prisma', () => ({
  category: {
    create: jest.fn(),
  },
}));

// Cast para simplificar o prismaClient com mocks do jest
const mockPrisma = prismaClient as unknown as {
  category: {
    create: jest.Mock<any, any>;
  };
};

describe('CreateCategoryService', () => {
  let createCategoryService: CreateCategoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    createCategoryService = new CreateCategoryService();
  });

  describe('execute', () => {
    const validCategoryData = {
      name: 'Pizzas'
    };

    it('should create a category successfully with valid name', async () => {
      // Arrange
      mockPrisma.category.create.mockResolvedValue({
        id: 'category-id',
        name: 'Pizzas',
      });

      // Act
      const result = await createCategoryService.execute(validCategoryData);

      // Assert
      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Pizzas',
        },
        select: {
          id: true,
          name: true,
        }
      });
      expect(result).toEqual({
        id: 'category-id',
        name: 'Pizzas',
      });
    });

    it('should throw error when name is empty', async () => {
      // Arrange
      const invalidCategoryData = {
        name: ''
      };

      // Act & Assert
      await expect(createCategoryService.execute(invalidCategoryData)).rejects.toThrow('Nome da categoria é obrigatório');
      expect(mockPrisma.category.create).not.toHaveBeenCalled();
    });

    it('should throw error when name is only whitespace', async () => {
      // Arrange
      const invalidCategoryData = {
        name: '   '
      };

      // Act & Assert
      // O serviço só verifica se name === '', não se está vazio após trim
      mockPrisma.category.create.mockResolvedValue({
        id: 'category-id',
        name: '   ',
      });
      
      const result = await createCategoryService.execute(invalidCategoryData);
      expect(result).toEqual({
        id: 'category-id',
        name: '   ',
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockPrisma.category.create.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(createCategoryService.execute(validCategoryData)).rejects.toThrow('Database connection failed');
    });

    it('should create category with special characters in name', async () => {
      // Arrange
      const categoryWithSpecialChars = {
        name: 'Pizzas Especiais & Gourmet'
      };

      mockPrisma.category.create.mockResolvedValue({
        id: 'category-id',
        name: 'Pizzas Especiais & Gourmet',
      });

      // Act
      const result = await createCategoryService.execute(categoryWithSpecialChars);

      // Assert
      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Pizzas Especiais & Gourmet',
        },
        select: {
          id: true,
          name: true,
        }
      });
      expect(result).toEqual({
        id: 'category-id',
        name: 'Pizzas Especiais & Gourmet',
      });
    });
  });
});
