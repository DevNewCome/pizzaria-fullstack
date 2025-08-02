/**
 * TESTES DE VALIDAÇÃO DE REGRAS DE NEGÓCIO
 * 
 * Este arquivo testa as funções de validação que garantem que os dados
 * inseridos no sistema seguem as regras de negócio estabelecidas.
 * 
 * As validações incluem:
 * - Formato de email válido
 * - Força da senha (complexidade mínima)
 * - Validação de nomes (comprimento, caracteres)
 * - Validação de preços (formato, valores)
 * - Validação de números de mesa e quantidades
 * 
 * Estas validações são essenciais para manter a integridade dos dados
 * e garantir uma boa experiência do usuário.
 */

describe('Business Rules Validation', () => {
  /**
   * TESTES DE VALIDAÇÃO DE USUÁRIO
   * 
   * Esta seção testa as regras de validação específicas para dados de usuário,
   * garantindo que emails, senhas e nomes estejam em conformidade com os padrões
   * de segurança e usabilidade do sistema.
   */
  describe('User Validation Rules', () => {
    /**
     * TESTE - Validação de formato de email
     * 
     * Este teste verifica se a função isValidEmail:
     * - Aceita emails com formato válido (ex: user@domain.com)
     * - Rejeita emails malformados (ex: user@, @domain.com)
     * - Rejeita strings vazias
     * - Garante que apenas emails válidos sejam aceitos no sistema
     */
    it('should validate email format', () => {
      // Emails válidos que devem ser aceitos
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];

      // Emails inválidos que devem ser rejeitados
      const invalidEmails = [
        'invalid-email',      // Sem @
        '@example.com',       // Sem parte local
        'user@',             // Sem domínio
        'user@.com',         // Domínio inválido
        ''                   // String vazia
      ];

      // Verifica se todos os emails válidos são aceitos
      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });

      // Verifica se todos os emails inválidos são rejeitados
      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    /**
     * TESTE - Validação de força da senha
     * 
     * Este teste verifica se a função isStrongPassword:
     * - Aceita senhas com pelo menos 8 caracteres
     * - Requer pelo menos uma letra maiúscula
     * - Requer pelo menos uma letra minúscula
     * - Requer pelo menos um número
     * - Rejeita senhas fracas ou vazias
     * - Garante segurança adequada das contas de usuário
     */
    it('should validate password strength', () => {
      // Senhas fortes que devem ser aceitas
      const strongPasswords = [
        'Password123!',    // 12 chars, maiúscula, minúscula, número, símbolo
        'MySecurePass1@',  // 14 chars, maiúscula, minúscula, número, símbolo
        'ComplexP@ssw0rd'  // 14 chars, maiúscula, minúscula, símbolo
      ];

      // Senhas fracas que devem ser rejeitadas
      const weakPasswords = [
        '123',             // Muito curta, só números
        'password',        // Só minúsculas
        'abc123',          // Sem maiúscula
        ''                 // Vazia
      ];

      // Verifica se todas as senhas fortes são aceitas
      strongPasswords.forEach(password => {
        expect(isStrongPassword(password)).toBe(true);
      });

      // Verifica se todas as senhas fracas são rejeitadas
      weakPasswords.forEach(password => {
        expect(isStrongPassword(password)).toBe(false);
      });
    });

    /**
     * TESTE - Validação de nomes de usuário
     * 
     * Este teste verifica se a função isValidName:
     * - Aceita nomes com pelo menos 2 caracteres
     * - Aceita nomes com até 100 caracteres
     * - Rejeita strings vazias ou só espaços
     * - Rejeita nomes muito curtos (1 caractere)
     * - Rejeita nomes muito longos (mais de 100 caracteres)
     * - Garante nomes legíveis e apropriados
     */
    it('should validate name requirements', () => {
      // Nomes válidos que devem ser aceitos
      const validNames = [
        'John Doe',        // Nome completo
        'Maria Silva',     // Nome com sobrenome
        'José Carlos'      // Nome com acento
      ];

      // Nomes inválidos que devem ser rejeitados
      const invalidNames = [
        '',                // Vazio
        '   ',             // Só espaços
        'A',               // Muito curto (1 caractere)
        'A'.repeat(101)    // Muito longo (101 caracteres)
      ];

      // Verifica se todos os nomes válidos são aceitos
      validNames.forEach(name => {
        expect(isValidName(name)).toBe(true);
      });

      // Verifica se todos os nomes inválidos são rejeitados
      invalidNames.forEach(name => {
        expect(isValidName(name)).toBe(false);
      });
    });
  });

  /**
   * TESTES DE VALIDAÇÃO DE CATEGORIA
   * 
   * Esta seção testa as regras de validação para categorias de produtos,
   * garantindo que os nomes das categorias sejam apropriados e consistentes.
   */
  describe('Category Validation Rules', () => {
    /**
     * TESTE - Validação de nomes de categoria
     * 
     * Este teste verifica se a função isValidCategoryName:
     * - Aceita nomes com pelo menos 2 caracteres
     * - Aceita nomes com até 50 caracteres
     * - Rejeita strings vazias ou só espaços
     * - Rejeita nomes muito curtos ou muito longos
     * - Garante categorias com nomes descritivos e apropriados
     */
    it('should validate category name requirements', () => {
      // Nomes de categoria válidos
      const validNames = [
        'Pizzas',              // Categoria simples
        'Bebidas',             // Categoria de bebidas
        'Sobremesas',          // Categoria de sobremesas
        'Pizzas Especiais'     // Categoria com espaço
      ];

      // Nomes de categoria inválidos
      const invalidNames = [
        '',                    // Vazio
        '   ',                 // Só espaços
        'A',                   // Muito curto
        'A'.repeat(51)         // Muito longo (51 caracteres)
      ];

      // Verifica se todos os nomes válidos são aceitos
      validNames.forEach(name => {
        expect(isValidCategoryName(name)).toBe(true);
      });

      // Verifica se todos os nomes inválidos são rejeitados
      invalidNames.forEach(name => {
        expect(isValidCategoryName(name)).toBe(false);
      });
    });
  });

  /**
   * TESTES DE VALIDAÇÃO DE PRODUTO
   * 
   * Esta seção testa as regras de validação para produtos,
   * garantindo que preços e nomes estejam em formato adequado.
   */
  describe('Product Validation Rules', () => {
    /**
     * TESTE - Validação de formato de preço
     * 
     * Este teste verifica se a função isValidPrice:
     * - Aceita preços em formato decimal (ex: 25.90)
     * - Aceita preços inteiros (ex: 10.00)
     * - Aceita preços com centavos (ex: 0.50)
     * - Rejeita preços negativos
     * - Rejeita valores não numéricos
     * - Rejeita preços com mais de 2 casas decimais
     * - Garante preços válidos para cálculos financeiros
     */
    it('should validate product price format', () => {
      // Preços válidos que devem ser aceitos
      const validPrices = [
        '25.90',    // Preço com centavos
        '10.00',    // Preço inteiro
        '0.50',     // Preço baixo
        '1000.99'   // Preço alto
      ];

      // Preços inválidos que devem ser rejeitados
      const invalidPrices = [
        '-10.00',   // Preço negativo
        'abc',      // Não numérico
        '',         // Vazio
        '10.999'    // Muitas casas decimais
      ];

      // Verifica se todos os preços válidos são aceitos
      validPrices.forEach(price => {
        expect(isValidPrice(price)).toBe(true);
      });

      // Verifica se todos os preços inválidos são rejeitados
      invalidPrices.forEach(price => {
        expect(isValidPrice(price)).toBe(false);
      });
    });

    /**
     * TESTE - Validação de nomes de produto
     * 
     * Este teste verifica se a função isValidProductName:
     * - Aceita nomes com pelo menos 2 caracteres
     * - Aceita nomes com até 100 caracteres
     * - Rejeita strings vazias ou só espaços
     * - Rejeita nomes muito curtos ou muito longos
     * - Garante produtos com nomes descritivos
     */
    it('should validate product name requirements', () => {
      // Nomes de produto válidos
      const validNames = [
        'Pizza Margherita',    // Nome de pizza
        'Coca-Cola 350ml',     // Nome de bebida
        'Bolo de Chocolate'    // Nome de sobremesa
      ];

      // Nomes de produto inválidos
      const invalidNames = [
        '',                    // Vazio
        '   ',                 // Só espaços
        'A',                   // Muito curto
        'A'.repeat(101)        // Muito longo
      ];

      // Verifica se todos os nomes válidos são aceitos
      validNames.forEach(name => {
        expect(isValidProductName(name)).toBe(true);
      });

      // Verifica se todos os nomes inválidos são rejeitados
      invalidNames.forEach(name => {
        expect(isValidProductName(name)).toBe(false);
      });
    });
  });

  /**
   * TESTES DE VALIDAÇÃO DE PEDIDO
   * 
   * Esta seção testa as regras de validação para pedidos,
   * garantindo que números de mesa e quantidades sejam válidos.
   */
  describe('Order Validation Rules', () => {
    /**
     * TESTE - Validação de número de mesa
     * 
     * Este teste verifica se a função isValidTableNumber:
     * - Aceita números de mesa de 1 a 1000
     * - Rejeita números zero ou negativos
     * - Rejeita números muito altos (mais de 1000)
     * - Rejeita valores não numéricos
     * - Garante mesas válidas para o sistema de pedidos
     */
    it('should validate table number', () => {
      // Números de mesa válidos
      const validTables = [1, 2, 10, 50];

      // Números de mesa inválidos
      const invalidTables = [
        0,          // Zero
        -1,         // Negativo
        1001,       // Muito alto
        'abc'       // Não numérico
      ];

      // Verifica se todos os números válidos são aceitos
      validTables.forEach(table => {
        expect(isValidTableNumber(table)).toBe(true);
      });

      // Verifica se todos os números inválidos são rejeitados
      invalidTables.forEach(table => {
        expect(isValidTableNumber(table)).toBe(false);
      });
    });

    /**
     * TESTE - Validação de quantidade de item
     * 
     * Este teste verifica se a função isValidItemAmount:
     * - Aceita quantidades de 1 a 100
     * - Rejeita quantidades zero ou negativas
     * - Rejeita quantidades muito altas (mais de 100)
     * - Rejeita valores não numéricos
     * - Garante quantidades razoáveis para pedidos
     */
    it('should validate order item amount', () => {
      // Quantidades válidas
      const validAmounts = [1, 2, 10, 50];

      // Quantidades inválidas
      const invalidAmounts = [
        0,          // Zero
        -1,         // Negativo
        101,        // Muito alto
        'abc'       // Não numérico
      ];

      // Verifica se todas as quantidades válidas são aceitas
      validAmounts.forEach(amount => {
        expect(isValidItemAmount(amount)).toBe(true);
      });

      // Verifica se todas as quantidades inválidas são rejeitadas
      invalidAmounts.forEach(amount => {
        expect(isValidItemAmount(amount)).toBe(false);
      });
    });
  });
});

// ============================================================================
// IMPLEMENTAÇÕES DAS FUNÇÕES DE VALIDAÇÃO
// ============================================================================
// Estas são as funções que implementam as regras de validação testadas acima.
// Em um projeto real, elas estariam em arquivos separados de utilitários.

/**
 * Valida se um email tem formato válido
 * @param email - String contendo o email a ser validado
 * @returns true se o email é válido, false caso contrário
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length > 0;
}

/**
 * Valida se uma senha é forte o suficiente
 * @param password - String contendo a senha a ser validada
 * @returns true se a senha é forte, false caso contrário
 */
function isStrongPassword(password: string): boolean {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
}

/**
 * Valida se um nome de usuário é válido
 * @param name - String contendo o nome a ser validado
 * @returns true se o nome é válido, false caso contrário
 */
function isValidName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Valida se um nome de categoria é válido
 * @param name - String contendo o nome da categoria a ser validado
 * @returns true se o nome é válido, false caso contrário
 */
function isValidCategoryName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 50;
}

/**
 * Valida se um preço tem formato válido
 * @param price - String contendo o preço a ser validado
 * @returns true se o preço é válido, false caso contrário
 */
function isValidPrice(price: string): boolean {
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  return priceRegex.test(price) && parseFloat(price) >= 0;
}

/**
 * Valida se um nome de produto é válido
 * @param name - String contendo o nome do produto a ser validado
 * @returns true se o nome é válido, false caso contrário
 */
function isValidProductName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Valida se um número de mesa é válido
 * @param table - Número da mesa a ser validado
 * @returns true se o número é válido, false caso contrário
 */
function isValidTableNumber(table: any): boolean {
  return typeof table === 'number' && table > 0 && table <= 1000;
}

/**
 * Valida se uma quantidade de item é válida
 * @param amount - Quantidade a ser validada
 * @returns true se a quantidade é válida, false caso contrário
 */
function isValidItemAmount(amount: any): boolean {
  return typeof amount === 'number' && amount > 0 && amount <= 100;
} 