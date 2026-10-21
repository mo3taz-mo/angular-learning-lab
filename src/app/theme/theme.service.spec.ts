import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should follow the system by default (no data-theme attribute)', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.mode()).toBe('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('should set data-theme and persist the choice', () => {
    const service = TestBed.inject(ThemeService);
    service.setMode('dark');
    expect(service.mode()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('learning-lab.theme')).toBe('dark');

    service.setMode('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should remove data-theme when switching back to system', () => {
    const service = TestBed.inject(ThemeService);
    service.setMode('dark');
    service.setMode('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('should restore a stored choice and ignore an invalid one', () => {
    localStorage.setItem('learning-lab.theme', 'dark');
    expect(TestBed.inject(ThemeService).mode()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should fall back to system for an invalid stored value', () => {
    localStorage.setItem('learning-lab.theme', 'purple');
    expect(TestBed.inject(ThemeService).mode()).toBe('system');
  });

  it('should keep working when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const service = TestBed.inject(ThemeService);
    expect(service.mode()).toBe('system');
    expect(() => service.setMode('dark')).not.toThrow();
    expect(service.mode()).toBe('dark');
  });
});
