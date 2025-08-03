/**
 * TESTE DO SERVIÇO DE ENVIO DE PEDIDO
 */

import { SendOrderService } from '../../../services/order/SendOrderService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  order: {
    update: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  order: {
    update: jest.Mock;
  };
};

describe('SendOrderService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send order successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const orderId = 'order-123';
    const expectedOrder = { id: 'order-123', draft: false };

    // Configura o mock para retornar o pedido atualizado
    mockPrisma.order.update.mockResolvedValue(expectedOrder);

    // Act - Execução do serviço sendo testado
    const service = new SendOrderService();
    const result = await service.execute({ order_id: orderId });

    // Assert - Verificação dos resultados
    // Verifica se o método update foi chamado com os parâmetros corretos
    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: orderId },
      data: { draft: false }
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedOrder);
  });
}); 