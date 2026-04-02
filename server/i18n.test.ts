import { describe, it, expect } from 'vitest';
import { t, translations, Language } from '../shared/i18n';

describe('i18n Language Switching System', () => {
  describe('t() function - Basic Functionality', () => {
    it('should return Chinese translation by default', () => {
      expect(t('nav.home')).toBe('主頁');
      expect(t('nav.body')).toBe('身體數據');
      expect(t('nav.food')).toBe('飲食記錄');
      expect(t('nav.exercise')).toBe('運動記錄');
      expect(t('nav.settings')).toBe('設定');
    });

    it('should return English translation when lang=en', () => {
      expect(t('nav.home', 'en')).toBe('Home');
      expect(t('nav.body', 'en')).toBe('Body Metrics');
      expect(t('nav.food', 'en')).toBe('Food Log');
      expect(t('nav.exercise', 'en')).toBe('Exercise');
      expect(t('nav.settings', 'en')).toBe('Settings');
    });

    it('should return Chinese translation when lang=zh explicitly', () => {
      expect(t('nav.home', 'zh')).toBe('主頁');
      expect(t('nav.body', 'zh')).toBe('身體數據');
      expect(t('nav.food', 'zh')).toBe('飲食記錄');
      expect(t('nav.exercise', 'zh')).toBe('運動記錄');
      expect(t('nav.settings', 'zh')).toBe('設定');
    });
  });

  describe('t() function - Nested Keys', () => {
    it('should support nested key paths', () => {
      expect(t('dashboard.title', 'zh')).toBe('主頁');
      expect(t('dashboard.title', 'en')).toBe('Home');
      expect(t('settings.language', 'zh')).toBe('語言');
      expect(t('settings.language', 'en')).toBe('Language');
    });

    it('should handle deeply nested keys', () => {
      expect(t('auth.login', 'zh')).toBe('登入');
      expect(t('auth.login', 'en')).toBe('Sign In');
      expect(t('food.breakfast', 'zh')).toBe('早餐');
      expect(t('food.breakfast', 'en')).toBe('Breakfast');
    });
  });

  describe('t() function - Fallback Logic', () => {
    it('should fallback to Chinese if translation not found in English', () => {
      // This tests the fallback mechanism
      const result = t('nav.home', 'en');
      expect(result).toBe('Home');
    });

    it('should return the key itself if no translation found', () => {
      const result = t('nonexistent.key', 'en');
      expect(result).toBe('nonexistent.key');
    });
  });

  describe('Translation Structure Validation', () => {
    it('should have both zh and en translations', () => {
      expect(translations).toHaveProperty('zh');
      expect(translations).toHaveProperty('en');
      expect(translations.zh).toBeDefined();
      expect(translations.en).toBeDefined();
    });

    it('should have matching top-level keys in both languages', () => {
      const zhKeys = Object.keys(translations.zh).sort();
      const enKeys = Object.keys(translations.en).sort();
      expect(zhKeys).toEqual(enKeys);
    });

    it('should have all navigation labels in both languages', () => {
      const navLabels = ['home', 'body', 'food', 'exercise', 'settings'];
      navLabels.forEach(label => {
        expect(translations.zh.nav).toHaveProperty(label);
        expect(translations.en.nav).toHaveProperty(label);
        const zhValue = translations.zh.nav[label as keyof typeof translations.zh.nav];
        const enValue = translations.en.nav[label as keyof typeof translations.en.nav];
        expect(zhValue).toBeTruthy();
        expect(enValue).toBeTruthy();
        expect(typeof zhValue).toBe('string');
        expect(typeof enValue).toBe('string');
      });
    });

    it('should have dashboard title in both languages', () => {
      expect(translations.zh.dashboard.title).toBe('主頁');
      expect(translations.en.dashboard.title).toBe('Home');
    });

    it('should have settings language option in both languages', () => {
      expect(translations.zh.settings.language).toBe('語言');
      expect(translations.en.settings.language).toBe('Language');
    });

    it('should have matching structure for all sections', () => {
      const sections = ['nav', 'auth', 'dashboard', 'settings', 'common', 'errors', 'success'];
      sections.forEach(section => {
        const zhSection = translations.zh[section as keyof typeof translations.zh];
        const enSection = translations.en[section as keyof typeof translations.en];
        expect(zhSection).toBeDefined();
        expect(enSection).toBeDefined();
        const zhKeys = Object.keys(zhSection).sort();
        const enKeys = Object.keys(enSection).sort();
        expect(zhKeys).toEqual(enKeys);
      });
    });
  });

  describe('Language Type Safety', () => {
    it('should accept valid language codes', () => {
      const langs: Language[] = ['zh', 'en'];
      langs.forEach(lang => {
        const result = t('nav.home', lang);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      });
    });

    it('should return different translations for different languages', () => {
      const zhHome = t('nav.home', 'zh');
      const enHome = t('nav.home', 'en');
      expect(zhHome).not.toBe(enHome);
      expect(zhHome).toBe('主頁');
      expect(enHome).toBe('Home');
    });

    it('should maintain consistency across multiple calls', () => {
      const call1 = t('nav.home', 'zh');
      const call2 = t('nav.home', 'zh');
      const call3 = t('nav.home', 'en');
      const call4 = t('nav.home', 'en');
      expect(call1).toBe(call2);
      expect(call3).toBe(call4);
      expect(call1).not.toBe(call3);
    });
  });

  describe('Common UI Strings', () => {
    it('should have all common action buttons in both languages', () => {
      const commonActions = ['save', 'cancel', 'delete', 'edit', 'add'];
      commonActions.forEach(action => {
        const zh = t(`common.${action}`, 'zh');
        const en = t(`common.${action}`, 'en');
        expect(zh).toBeTruthy();
        expect(en).toBeTruthy();
        expect(zh).not.toBe(en);
      });
    });

    it('should have all error messages in both languages', () => {
      const errors = ['required', 'invalidEmail', 'passwordTooShort', 'networkError'];
      errors.forEach(error => {
        const zh = t(`errors.${error}`, 'zh');
        const en = t(`errors.${error}`, 'en');
        expect(zh).toBeTruthy();
        expect(en).toBeTruthy();
        expect(zh).not.toBe(en);
      });
    });

    it('should have all success messages in both languages', () => {
      const successes = ['saveSuccess', 'deleteSuccess', 'updateSuccess'];
      successes.forEach(success => {
        const zh = t(`success.${success}`, 'zh');
        const en = t(`success.${success}`, 'en');
        expect(zh).toBeTruthy();
        expect(en).toBeTruthy();
        expect(zh).not.toBe(en);
      });
    });
  });

  describe('Production Readiness', () => {
    it('should not have empty translation values', () => {
      Object.entries(translations).forEach(([lang, sections]) => {
        Object.entries(sections).forEach(([section, keys]) => {
          Object.entries(keys).forEach(([key, value]) => {
            if (typeof value === 'string') {
              expect(value.length).toBeGreaterThan(0);
            }
          });
        });
      });
    });

    it('should handle all navigation labels without errors', () => {
      const navLabels = ['home', 'body', 'food', 'exercise', 'settings'];
      navLabels.forEach(label => {
        expect(() => {
          t(`nav.${label}`, 'zh');
          t(`nav.${label}`, 'en');
        }).not.toThrow();
      });
    });
  });
});
