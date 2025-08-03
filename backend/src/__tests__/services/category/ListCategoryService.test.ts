/**
 * TESTE DO SERVIÇO DE LISTAGEM DE CATEGORIAS
 */

import { ListCategoryService } from '../../../services/category/ListCategoryService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  category: {
    findMany: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  category: {
    findMany: jest.Mock;
  };
};

describe('ListCategoryService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all categories successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const expectedCategories = [
      { id: 'cat-1', name: 'Pizzas' },
      { id: 'cat-2', name: 'Bebidas' },
      { id: 'cat-3', name: 'Sobremesas' }
    ];

    // Configura o mock para retornar as categorias esperadas
    mockPrisma.category.findMany.mockResolvedValue(expectedCategories);

    // Act - Execução do serviço sendo testado
    const service = new ListCategoryService();
    const result = await service.execute();

    // Assert - Verificação dos resultados
    // Verifica se o método findMany foi chamado com os campos corretos
    expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true
      }
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedCategories);
  });

  it('should return empty array when no categories exist', async () => {
    // Arrange - Preparação dos dados de teste (nenhuma categoria)
    mockPrisma.category.findMany.mockResolvedValue([]);

    // Act - Execução do serviço sendo testado
    const service = new ListCategoryService();
    const result = await service.execute();

    // Assert - Verificação dos resultados
    // Verifica se retorna um array vazio quando não há categorias
    expect(result).toEqual([]);
  });
}); 