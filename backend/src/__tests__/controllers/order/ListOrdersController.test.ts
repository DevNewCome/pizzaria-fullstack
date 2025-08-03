/**
 * TESTE DO CONTROLLER DE LISTAGEM DE PEDIDOS
 */

import { ListOrdersController } from 'controllers/order/ListOrdersController';
import { ListOrdersService } from 'services/order/ListOrdersService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de listagem de pedidos para isolar os testes
jest.mock('services/order/ListOrdersService');
const mockListOrdersService = ListOrdersService as jest.MockedClass<typeof ListOrdersService>;

describe('ListOrdersController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list orders successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const req = mockRequest();
    const res = mockResponse();
    const expectedOrders = [
      { id: 'order-1', table: 5, status: false, draft: false },
      { id: 'order-2', table: 3, status: false, draft: false }
    ];

    // Configura o mock do serviço para retornar a lista de pedidos esperada
    mockListOrdersService.prototype.execute = jest.fn().mockResolvedValue(expectedOrders);

    // Act - Execução do controller sendo testado
    const controller = new ListOrdersController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado
    expect(mockListOrdersService.prototype.execute).toHaveBeenCalled();
    // Verifica se a resposta JSON foi enviada com a lista de pedidos
    expect(res.json).toHaveBeenCalledWith(expectedOrders);
  });
}); 