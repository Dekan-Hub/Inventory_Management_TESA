require('dotenv').config({ path: '.env.test' });

// Configuración global para tests
global.testTimeout = 10000;

// Mock de console.log para tests más limpios
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 