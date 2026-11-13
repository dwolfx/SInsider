import { describe, it, expect } from 'vitest';
import {
  slugify,
  calculateReadingTime,
  formatDate,
  formatDateShort,
  formatDateTime,
} from '@/lib/utils';

describe('Funções Utilitárias do Sistema (Utils)', () => {
  describe('Função slugify', () => {
    it('converte string simples em slug com traços minúsculos', () => {
      expect(slugify('Saúde Insider Notícias')).toBe('saude-insider-noticias');
    });

    it('trata acentos, símbolos especiais e espaçamentos múltiplos', () => {
      expect(slugify('Atenção: 100% dos Médicos & Especialistas!'))
        .toBe('atencao-100-dos-medicos-especialistas');
    });

    it('remove traços no início e no final da string', () => {
      expect(slugify('---Artigo Importante---')).toBe('artigo-importante');
    });
  });

  describe('Função calculateReadingTime', () => {
    it('calcula o tempo de leitura aproximado baseado na contagem de palavras', () => {
      const words = Array(400).fill('palavra').join(' ');
      expect(calculateReadingTime(words)).toBe(2);
    });

    it('retorna pelo menos 1 minuto para textos vazios ou muito curtos', () => {
      expect(calculateReadingTime('')).toBe(1);
      expect(calculateReadingTime('Apenas três palavras')).toBe(1);
    });
  });

  describe('Função formatDate', () => {
    it('formata data ISO no padrão brasileiro completo', () => {
      const formatted = formatDate('2026-11-07T12:00:00Z');
      expect(formatted).toMatch(/07.*nov.*2026/i);
    });

    it('retorna o valor original quando a data for inválida', () => {
      expect(formatDate('data-invalida')).toBe('data-invalida');
    });
  });

  describe('Função formatDateShort', () => {
    it('formata data no padrão resumido com dia e mês abreviado', () => {
      const formatted = formatDateShort('2026-11-07T12:00:00Z');
      expect(formatted).toMatch(/7.*nov/i);
    });

    it('retorna a string original quando a conversão falha ou for inválida', () => {
      expect(formatDateShort('data-invalida')).toBe('data-invalida');
    });
  });

  describe('Função formatDateTime', () => {
    it('converte timestamp em formato com data e hora brasileira', () => {
      const formatted = formatDateTime('2026-11-07T15:30:00Z');
      expect(formatted).toMatch(/07\/11\/2026/);
    });

    it('retorna a string original quando a data fornecida for inválida', () => {
      expect(formatDateTime('data-invalida')).toBe('data-invalida');
    });
  });
});
