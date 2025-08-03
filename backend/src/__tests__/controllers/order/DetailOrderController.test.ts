/**
 * TESTE DO CONTROLLER DE DETALHES DO PEDIDO
 */

import { DetailOrderController } from 'controllers/order/DetailOrderController';
import { DetailOrderService } from 'services/order/DetailOrderService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de detalhes do pedido para isolar os testes
jest.mock('services/order/DetailOrderService');
const mockDetailOrderService = DetailOrderService as jest.MockedClass<typeof DetailOrderService>;

describe('DetailOrderController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return order details successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const req = mockRequest({}, {});
    req.query = { order_id: 'order-123' };
    const res = mockResponse();
    const expectedItems = [
      { id: 'item-1', name: 'Pizza', amount: 2, product: { name: 'Pizza Margherita' } }
    ];

    // Configura o mock do serviço para retornar os itens do pedido
    mockDetailOrderService.prototype.execute = jest.fn().mockResolvedValue(expectedItems);

    // Act - Execução do controller sendo testado
    const controller = new DetailOrderController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com o ID do pedido correto
    expect(mockDetailOrderService.prototype.execute).toHaveBeenCalledWith({ order_id: 'order-123' });
    // Verifica se a resposta JSON foi enviada com os detalhes do pedido
    expect(res.json).toHaveBeenCalledWith(expectedItems);
  });
}); 