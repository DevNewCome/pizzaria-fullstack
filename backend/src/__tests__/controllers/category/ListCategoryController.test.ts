/**
 * TESTE DO CONTROLLER DE LISTAGEM DE CATEGORIAS
 */

import { ListCategoryController } from 'controllers/category/ListCategoryController';
import { ListCategoryService } from 'services/category/ListCategoryService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de listagem de categorias para isolar os testes
jest.mock('services/category/ListCategoryService');
const mockListCategoryService = ListCategoryService as jest.MockedClass<typeof ListCategoryService>;

describe('ListCategoryController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list categories successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const req = mockRequest();
    const res = mockResponse();
    const expectedCategories = [
      { id: 'cat-1', name: 'Pizzas' },
      { id: 'cat-2', name: 'Bebidas' }
    ];

    // Configura o mock do serviço para retornar as categorias esperadas
    mockListCategoryService.prototype.execute = jest.fn().mockResolvedValue(expectedCategories);

    // Act - Execução do controller sendo testado
    const controller = new ListCategoryController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado
    expect(mockListCategoryService.prototype.execute).toHaveBeenCalled();
    // Verifica se a resposta JSON foi enviada com a lista de categorias
    expect(res.json).toHaveBeenCalledWith(expectedCategories);
  });

  it('should handle service errors', async () => {
    // Arrange - Preparação dos dados de teste (erro de banco)
    const req = mockRequest();
    const res = mockResponse();

    // Configura o mock do serviço para simular um erro
    mockListCategoryService.prototype.execute = jest.fn().mockRejectedValue(new Error('Database error'));

    // Act & Assert - Verificação do tratamento de erro
    const controller = new ListCategoryController();
    // Verifica se o erro do serviço é propagado pelo controller
    await expect(controller.handle(req as any, res as any)).rejects.toThrow('Database error');
  });
}); 