/**
 * TESTE DO SERVIÇO DE LISTAGEM DE PRODUTOS POR CATEGORIA
 */

import { ListByCategoryService } from '../../../services/product/ListByCategoryService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  product: {
    findMany: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  product: {
    findMany: jest.Mock;
  };
};

describe('ListByCategoryService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return products by category successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const categoryId = 'cat-123';
    const expectedProducts = [
      { id: 'prod-1', name: 'Pizza Margherita', category_id: 'cat-123' },
      { id: 'prod-2', name: 'Pizza Pepperoni', category_id: 'cat-123' }
    ];

    // Configura o mock para retornar os produtos esperados
    mockPrisma.product.findMany.mockResolvedValue(expectedProducts);

    // Act - Execução do serviço sendo testado
    const service = new ListByCategoryService();
    const result = await service.execute({ category_id: categoryId });

    // Assert - Verificação dos resultados
    // Verifica se o método findMany foi chamado com o filtro de categoria correto
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: { category_id: categoryId }
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedProducts);
  });
}); 