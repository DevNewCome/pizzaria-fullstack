/**
 * TESTE DO CONTROLLER DE ADIÇÃO DE ITEM
 */

import { AddItemController } from 'controllers/order/AddItemController';
import { AddItemService } from 'services/order/AddItemService';
import { mockRequest, mockResponse } from '__tests__/utils/testUtils';

// Mock do serviço de adição de item para isolar os testes
jest.mock('services/order/AddItemService');
const mockAddItemService = AddItemService as jest.MockedClass<typeof AddItemService>;

describe('AddItemController', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add item to order successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const itemData = { order_id: 'order-123', product_id: 'prod-123', amount: 2 };
    const req = mockRequest(itemData);
    const res = mockResponse();
    const expectedItem = { id: 'item-123', order_id: 'order-123', product_id: 'prod-123', amount: 2 };

    // Configura o mock do serviço para retornar o item esperado
    mockAddItemService.prototype.execute = jest.fn().mockResolvedValue(expectedItem);

    // Act - Execução do controller sendo testado
    const controller = new AddItemController();
    await controller.handle(req as any, res as any);

    // Assert - Verificação dos resultados
    // Verifica se o serviço foi chamado com os dados corretos
    expect(mockAddItemService.prototype.execute).toHaveBeenCalledWith(itemData);
    // Verifica se a resposta JSON foi enviada com o item adicionado
    expect(res.json).toHaveBeenCalledWith(expectedItem);
  });
}); 