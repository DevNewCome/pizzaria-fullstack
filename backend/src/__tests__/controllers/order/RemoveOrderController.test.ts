/**
 * TESTE DO CONTROLLER DE REMOÇÃO DE PEDIDO
 */

import { RemoveOrderController } from 'controllers/order/RemoveOrderController';
import { RemoveOrderService } from 'services/order/RemoveOrderService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de remoção de pedido para isolar os testes
jest.mock('services/order/RemoveOrderService');
const mockRemoveOrderService = RemoveOrderService as jest.MockedClass<typeof RemoveOrderService>;

describe('RemoveOrderController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove order successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const req = mockRequest({}, {});
    req.query = { order_id: 'order-123' };
    const res = mockResponse();
    const expectedResult = { id: 'order-123', table: 5, name: 'Mesa 5' };

    // Configura o mock do serviço para retornar o pedido removido
    mockRemoveOrderService.prototype.execute = jest.fn().mockResolvedValue(expectedResult);

    // Act - Execução do controller sendo testado
    const controller = new RemoveOrderController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com o ID do pedido correto
    expect(mockRemoveOrderService.prototype.execute).toHaveBeenCalledWith({ order_id: 'order-123' });
    // Verifica se a resposta JSON foi enviada com o resultado da remoção
    expect(res.json).toHaveBeenCalledWith(expectedResult);
  });
}); 