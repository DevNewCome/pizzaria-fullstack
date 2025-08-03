/**
 * TESTE DO CONTROLLER DE CRIAÇÃO DE CATEGORIA
 */

import { CreateCategoryController } from 'controllers/category/CreateCategoryController';
import { CreateCategoryService } from 'services/category/CreateCategoryService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de criação de categoria para isolar os testes
jest.mock('services/category/CreateCategoryService');
const mockCreateCategoryService = CreateCategoryService as jest.MockedClass<typeof CreateCategoryService>;

describe('CreateCategoryController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create category successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const categoryData = { name: 'Pizzas' };
    const req = mockRequest(categoryData);
    const res = mockResponse();
    const expectedCategory = { id: 'cat-123', name: 'Pizzas' };

    // Configura o mock do serviço para retornar a categoria criada
    mockCreateCategoryService.prototype.execute = jest.fn().mockResolvedValue(expectedCategory);

    // Act - Execução do controller sendo testado
    const controller = new CreateCategoryController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com os dados corretos
    expect(mockCreateCategoryService.prototype.execute).toHaveBeenCalledWith(categoryData);
    // Verifica se a resposta JSON foi enviada com a categoria criada
    expect(res.json).toHaveBeenCalledWith(expectedCategory);
  });

  it('should handle service errors', async () => {
    // Arrange - Preparação dos dados de teste (nome vazio)
    const categoryData = { name: '' };
    const req = mockRequest(categoryData);
    const res = mockResponse();

    // Configura o mock do serviço para simular um erro
    mockCreateCategoryService.prototype.execute = jest.fn().mockRejectedValue(new Error('Name is required'));

    // Act & Assert - Verificação do tratamento de erro
    const controller = new CreateCategoryController();
    // Verifica se o erro do serviço é propagado pelo controller
    await expect(controller.handle(req as any, res as any)).rejects.toThrow('Name is required');
  });
}); 