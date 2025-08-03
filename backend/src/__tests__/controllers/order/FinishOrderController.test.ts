/**
 * TESTE DO CONTROLLER DE FINALIZAÇÃO DE PEDIDO
 */

import { FinishOrderController } from 'controllers/order/FinishOrderController';
import { FinishOrderService } from 'services/order/FinishOrderService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de finalização de pedido para isolar os testes
jest.mock('services/order/FinishOrderService');
const mockFinishOrderService = FinishOrderService as jest.MockedClass<typeof FinishOrderService>;

describe('FinishOrderController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should finish order successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const req = mockRequest({ order_id: 'order-123' });
    const res = mockResponse();
    const expectedOrder = { id: 'order-123', status: true };

    // Configura o mock do serviço para retornar o pedido finalizado
    mockFinishOrderService.prototype.execute = jest.fn().mockResolvedValue(expectedOrder);

    // Act - Execução do controller sendo testado
    const controller = new FinishOrderController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com o ID do pedido correto
    expect(mockFinishOrderService.prototype.execute).toHaveBeenCalledWith({ order_id: 'order-123' });
    // Verifica se a resposta JSON foi enviada com o pedido finalizado
    expect(res.json).toHaveBeenCalledWith(expectedOrder);
  });
}); 