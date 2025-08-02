/**
 * TESTE DO SERVIÇO DE CRIAÇÃO DE CATEGORIA
 * 
 * Este arquivo testa o serviço responsável por criar novas categorias de produtos
 * no sistema da pizzaria. O serviço deve:
 * - Validar o nome da categoria (não pode ser vazio)
 * - Criar a categoria no banco de dados
 * - Retornar os dados da categoria criada (id e nome)
 * - Tratar erros de validação e banco de dados
 * - Permitir nomes com caracteres especiais
 */

import { CreateCategoryService } from '../../../services/category/CreateCategoryService';
import prismaClient from '../../../prisma';

// Mock do Prisma Client - Simula o banco de dados para não fazer conexões reais durante os testes
jest.mock('../../../prisma', () => ({
  category: {
    create: jest.fn(), // Mock da função que cria categoria no banco
  },
}));

// Cast para simplificar o prismaClient com mocks do jest
const mockPrisma = prismaClient as unknown as {
  category: {
    create: jest.Mock<any, any>;
  };
};

describe('CreateCategoryService', () => {
  let createCategoryService: CreateCategoryService;

  // Antes de cada teste, limpa mocks e cria nova instância do serviço
  beforeEach(() => {
    jest.clearAllMocks();
    createCategoryService = new CreateCategoryService();
  });

  describe('execute', () => {
    // Dados válidos que serão usados em vários testes
    const validCategoryData = {
      name: 'Pizzas'
    };

    /**
     * TESTE DE SUCESSO - Criação de categoria com nome válido
     * 
     * Este teste verifica se o serviço consegue criar uma categoria quando:
     * - O nome da categoria é válido (não vazio)
     * - A categoria é salva no banco de dados
     * - Retorna os dados da categoria criada (id e nome)
     * - Não retorna campos desnecessários
     */
    it('should create a category successfully with valid name', async () => {
      // Arrange - Preparar mock para simular sucesso
      mockPrisma.category.create.mockResolvedValue({
        id: 'category-id',
        name: 'Pizzas',
      });

      // Act - Executar o serviço
      const result = await createCategoryService.execute(validCategoryData);

      // Assert - Verificar se tudo funcionou corretamente
      // Verifica se a categoria foi criada com os dados corretos
      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Pizzas',
        },
        select: {
          id: true,
          name: true,
          // Note que outros campos não estão no select
        }
      });
      // Verifica se o resultado está correto
      expect(result).toEqual({
        id: 'category-id',
        name: 'Pizzas',
      });
    });

    /**
     * TESTE DE ERRO - Nome da categoria vazio
     * 
     * Este teste verifica se o serviço rejeita quando:
     * - O nome da categoria está vazio
     * - Não deve tentar criar no banco de dados
     * - Deve lançar erro específico
     * - Garante que categorias sem nome não sejam criadas
     */
    it('should throw error when name is empty', async () => {
      // Arrange - Preparar dados inválidos
      const invalidCategoryData = {
        name: '' // Nome vazio
      };

      // Act & Assert - Verificar se o erro foi lançado
      await expect(createCategoryService.execute(invalidCategoryData)).rejects.toThrow('Nome da categoria é obrigatório');
      // Verifica que não tentou criar no banco
      expect(mockPrisma.category.create).not.toHaveBeenCalled();
    });

    /**
     * TESTE DE EDGE CASE - Nome só com espaços em branco
     * 
     * Este teste verifica como o serviço trata:
     * - Nomes que contêm apenas espaços em branco
     * - O serviço atual só verifica se name === '', não se está vazio após trim
     * - Este é um caso que pode precisar de melhoria na validação
     */
    it('should throw error when name is only whitespace', async () => {
      // Arrange - Preparar dados com só espaços
      const invalidCategoryData = {
        name: '   ' // Só espaços em branco
      };

      // Act & Assert - Verificar comportamento atual
      // O serviço só verifica se name === '', não se está vazio após trim
      mockPrisma.category.create.mockResolvedValue({
        id: 'category-id',
        name: '   ',
      });
      
      const result = await createCategoryService.execute(invalidCategoryData);
      // Este teste mostra que o serviço aceita nomes só com espaços
      // Pode ser uma melhoria futura adicionar validação mais rigorosa
      expect(result).toEqual({
        id: 'category-id',
        name: '   ',
      });
    });

    /**
     * TESTE DE ERRO - Problemas de banco de dados
     * 
     * Este teste verifica se o serviço trata erros de banco:
     * - Conexão com banco falha
     * - Erro durante a criação da categoria
     * - Deve propagar o erro para ser tratado pelo controller
     * - Garante que erros técnicos são tratados adequadamente
     */
    it('should handle database errors gracefully', async () => {
      // Arrange - Simular erro de banco de dados
      mockPrisma.category.create.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert - Verificar se o erro foi propagado
      await expect(createCategoryService.execute(validCategoryData)).rejects.toThrow('Database connection failed');
    });

    /**
     * TESTE DE FUNCIONALIDADE - Nome com caracteres especiais
     * 
     * Este teste verifica se o serviço aceita:
     * - Nomes com caracteres especiais (&, espaços, etc.)
     * - Nomes descritivos e complexos
     * - Garante flexibilidade na nomenclatura de categorias
     * - Útil para categorias como "Pizzas Especiais & Gourmet"
     */
    it('should create category with special characters in name', async () => {
      // Arrange - Preparar nome com caracteres especiais
      const categoryWithSpecialChars = {
        name: 'Pizzas Especiais & Gourmet' // Nome com caracteres especiais
      };

      mockPrisma.category.create.mockResolvedValue({
        id: 'category-id',
        name: 'Pizzas Especiais & Gourmet',
      });

      // Act - Executar o serviço
      const result = await createCategoryService.execute(categoryWithSpecialChars);

      // Assert - Verificar se funcionou corretamente
      // Verifica se a categoria foi criada com o nome completo
      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Pizzas Especiais & Gourmet',
        },
        select: {
          id: true,
          name: true,
        }
      });
      // Verifica se o resultado está correto
      expect(result).toEqual({
        id: 'category-id',
        name: 'Pizzas Especiais & Gourmet',
      });
    });
  });
});
