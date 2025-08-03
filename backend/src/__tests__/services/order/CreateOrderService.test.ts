/**
 * TESTE DO SERVIÇO DE CRIAÇÃO DE PEDIDO
 */

import { CreateOrderService } from '../../../services/order/CreateOrderService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  order: {
    create: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  order: {
    create: jest.Mock;
  };
};

describe('CreateOrderService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create order successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const orderData = { table: 5, name: 'Mesa 5' };
    const expectedOrder = {
      id: 'order-123',
      table: 5,
      name: 'Mesa 5',
      status: false,
      draft: true
    };

    // Configura o mock para retornar o pedido esperado
    mockPrisma.order.create.mockResolvedValue(expectedOrder);

    // Act - Execução do serviço sendo testado
    const service = new CreateOrderService();
    const result = await service.execute(orderData);

    // Assert - Verificação dos resultados
    // Verifica se o método create foi chamado com os dados corretos
    expect(mockPrisma.order.create).toHaveBeenCalledWith({
      data: orderData
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedOrder);
  });
}); 