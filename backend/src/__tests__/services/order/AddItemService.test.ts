/**
 * TESTE DO SERVIÇO DE ADIÇÃO DE ITEM
 */

import { AddItemService } from '../../../services/order/AddItemService';
import prismaClient from '../../../prisma';

// Mock do cliente Prisma para isolar os testes do banco de dados
jest.mock('../../../prisma', () => ({
  item: {
    create: jest.fn(),
  },
}));

// Tipagem do mock do Prisma para facilitar o uso nos testes
const mockPrisma = prismaClient as unknown as {
  item: {
    create: jest.Mock;
  };
};

describe('AddItemService', () => {
  // Limpa todos os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add item to order successfully', async () => {
    // Arrange - Preparação dos dados de teste
    const itemData = { order_id: 'order-123', product_id: 'prod-123', amount: 2 };
    const expectedItem = { id: 'item-123', order_id: 'order-123', product_id: 'prod-123', amount: 2 };

    // Configura o mock para retornar o item esperado
    mockPrisma.item.create.mockResolvedValue(expectedItem);

    // Act - Execução do serviço sendo testado
    const service = new AddItemService();
    const result = await service.execute(itemData);

    // Assert - Verificação dos resultados
    // Verifica se o método create foi chamado com os dados corretos
    expect(mockPrisma.item.create).toHaveBeenCalledWith({
      data: itemData
    });
    // Verifica se o resultado retornado é igual ao esperado
    expect(result).toEqual(expectedItem);
  });
}); 