/**
 * TESTE DO SERVIÇO DE CRIAÇÃO DE PRODUTO
 */

import { CreateProductService } from '../../../services/product/CreateProductService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  product: {
    create: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  product: {
    create: jest.Mock;
  };
};

describe('CreateProductService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create product successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const productData = {
      name: 'Pizza Margherita',
      price: '25.90',
      description: 'Pizza tradicional',
      banner: 'pizza.jpg',
      category_id: 'cat-123'
    };
    const expectedProduct = {
      id: 'prod-123',
      name: 'Pizza Margherita',
      price: '25.90',
      banner: 'pizza.jpg',
      description: 'Pizza tradicional',
      category_id: 'cat-123'
    };

    // Configura o mock para retornar o produto criado
    mockPrisma.product.create.mockResolvedValue(expectedProduct);

    // Act - Execução do serviço sendo testado
    const service = new CreateProductService();
    const result = await service.execute(productData);

    // Assert - Verificação dos resultados
    // Verifica se o método create foi chamado com os dados corretos
    expect(mockPrisma.product.create).toHaveBeenCalledWith({
      data: productData
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedProduct);
  });
}); 