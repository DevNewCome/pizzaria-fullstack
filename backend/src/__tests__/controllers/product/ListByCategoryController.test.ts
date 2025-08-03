/**
 * TESTE DO CONTROLLER DE LISTAGEM DE PRODUTOS POR CATEGORIA
 */

import { ListByCategoryController } from 'controllers/product/ListByCategoryController';
import { ListByCategoryService } from 'services/product/ListByCategoryService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de listagem de produtos por categoria para isolar os testes
jest.mock('services/product/ListByCategoryService');
const mockListByCategoryService = ListByCategoryService as jest.MockedClass<typeof ListByCategoryService>;

describe('ListByCategoryController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list products by category successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const req = mockRequest({}, {});
    req.query = { category_id: 'cat-123' };
    const res = mockResponse();
    const expectedProducts = [
      { id: 'prod-1', name: 'Pizza Margherita', category_id: 'cat-123' },
      { id: 'prod-2', name: 'Pizza Pepperoni', category_id: 'cat-123' }
    ];

    // Configura o mock do serviço para retornar os produtos esperados
    mockListByCategoryService.prototype.execute = jest.fn().mockResolvedValue(expectedProducts);

    // Act - Execução do controller sendo testado
    const controller = new ListByCategoryController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com o ID da categoria correto
    expect(mockListByCategoryService.prototype.execute).toHaveBeenCalledWith({ category_id: 'cat-123' });
    // Verifica se a resposta JSON foi enviada com a lista de produtos
    expect(res.json).toHaveBeenCalledWith(expectedProducts);
  });

  it('should handle service errors', async () => {
    // Arrange - Preparação dos dados de teste (categoria não encontrada)
    const req = mockRequest({}, {});
    req.query = { category_id: 'cat-123' };
    const res = mockResponse();

    // Configura o mock do serviço para simular um erro
    mockListByCategoryService.prototype.execute = jest.fn().mockRejectedValue(new Error('Category not found'));

    // Act & Assert - Verificação do tratamento de erro
    const controller = new ListByCategoryController();
    // Verifica se o erro do serviço é propagado pelo controller
    await expect(controller.handle(req as any, res as any)).rejects.toThrow('Category not found');
  });
}); 