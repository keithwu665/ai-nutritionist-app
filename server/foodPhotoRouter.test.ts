import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TRPCError } from '@trpc/server';
import { initializeSupabaseAdmin, ensureFoodPhotosBucket } from './utils/supabaseClient';

describe('Supabase Client Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset global fetch
    delete (global as any).fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (global as any).fetch;
  });

  describe('initializeSupabaseAdmin', () => {
    it('should throw SUPABASE_URL_MISSING when URL is empty', async () => {
      try {
        await initializeSupabaseAdmin('', 'test-key');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('SUPABASE_URL_MISSING');
        expect(error.message).toContain('not configured');
      }
    });

    it('should throw SUPABASE_SERVICE_ROLE_KEY_MISSING when key is empty', async () => {
      try {
        await initializeSupabaseAdmin('https://example.supabase.co', '');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('SUPABASE_SERVICE_ROLE_KEY_MISSING');
        expect(error.message).toContain('not configured');
      }
    });

    it('should throw SUPABASE_URL_INVALID when URL does not start with https://', async () => {
      try {
        await initializeSupabaseAdmin('http://example.supabase.co', 'test-key');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('SUPABASE_URL_INVALID');
        expect(error.message).toContain('https://');
      }
    });

    it('should trim whitespace from URL and key', async () => {
      // Mock fetch for health check
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        } as Response)
      );

      const client = await initializeSupabaseAdmin('  https://example.supabase.co  ', '  test-key  ');
      expect(client).toBeDefined();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw SUPABASE_CONNECTIVITY_FAILED when health check returns error status', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 503,
        } as Response)
      );

      try {
        await initializeSupabaseAdmin('https://example.supabase.co', 'test-key');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('SUPABASE_CONNECTIVITY_FAILED');
        expect(error.message).toContain('Supabase connectivity failed');
      }
    });

    it('should throw SUPABASE_CONNECTIVITY_FAILED when fetch fails', async () => {
      global.fetch = vi.fn(() => {
        const error = new Error('Network error');
        return Promise.reject(error);
      });

      try {
        await initializeSupabaseAdmin('https://example.supabase.co', 'test-key');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('SUPABASE_CONNECTIVITY_FAILED');
        expect(error.message).toContain('Supabase connectivity failed');
      }
    });

    it('should successfully initialize client when credentials and connectivity are valid', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        } as Response)
      );

      const client = await initializeSupabaseAdmin('https://example.supabase.co', 'test-key');
      expect(client).toBeDefined();
      expect(client.storage).toBeDefined();
      expect(client.storage.from).toBeDefined();
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('ensureFoodPhotosBucket', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should verify bucket exists and not create if already exists', async () => {
      const mockClient = {
        storage: {
          listBuckets: vi.fn(() =>
            Promise.resolve({
              data: [{ name: 'food-photos' }],
              error: null,
            })
          ),
          createBucket: vi.fn(),
        },
      };

      await ensureFoodPhotosBucket(mockClient);
      expect(mockClient.storage.listBuckets).toHaveBeenCalledTimes(1);
      expect(mockClient.storage.createBucket).not.toHaveBeenCalled();
    });

    it('should throw BUCKET_INITIALIZATION_FAILED when listing buckets fails', async () => {
      const mockClient = {
        storage: {
          listBuckets: vi.fn(() =>
            Promise.resolve({
              data: null,
              error: new Error('Permission denied'),
            })
          ),
        },
      };

      try {
        await ensureFoodPhotosBucket(mockClient);
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('BUCKET_INITIALIZATION_FAILED');
        expect(error.message).toContain('Failed to ensure food-photos bucket');
      }
    });

    it('should create bucket if it does not exist', async () => {
      const mockClient = {
        storage: {
          listBuckets: vi.fn(() =>
            Promise.resolve({
              data: [{ name: 'other-bucket' }],
              error: null,
            })
          ),
          createBucket: vi.fn(() =>
            Promise.resolve({
              data: { name: 'food-photos' },
              error: null,
            })
          ),
        },
      };

      await ensureFoodPhotosBucket(mockClient);
      expect(mockClient.storage.createBucket).toHaveBeenCalledWith('food-photos', expect.any(Object));
      const callArgs = (mockClient.storage.createBucket as any).mock.calls[0];
      expect(callArgs[1]).toEqual({
        public: false,
        fileSizeLimit: 52428800,
      });
      expect(mockClient.storage.createBucket).toHaveBeenCalledTimes(1);
    });

    it('should throw BUCKET_INITIALIZATION_FAILED when bucket creation fails', async () => {
      const mockClient = {
        storage: {
          listBuckets: vi.fn(() =>
            Promise.resolve({
              data: [],
              error: null,
            })
          ),
          createBucket: vi.fn(() =>
            Promise.resolve({
              data: null,
              error: new Error('Bucket already exists'),
            })
          ),
        },
      };

      try {
        await ensureFoodPhotosBucket(mockClient);
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('BUCKET_INITIALIZATION_FAILED');
        expect(error.message).toContain('Failed to ensure food-photos bucket');
      }
    });
  });

  describe('Production Secret Validation', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      delete (global as any).fetch;
    });

    it('should validate SUPABASE_URL format', async () => {
      const invalidUrls = [
        { url: 'http://example.com', expectedCode: 'SUPABASE_URL_INVALID' }, // Not HTTPS
        { url: 'ftp://example.com', expectedCode: 'SUPABASE_URL_INVALID' }, // Wrong protocol
        { url: 'example.com', expectedCode: 'SUPABASE_URL_INVALID' }, // No protocol
        { url: '', expectedCode: 'SUPABASE_URL_MISSING' }, // Empty
      ];

      for (const { url, expectedCode } of invalidUrls) {
        try {
          await initializeSupabaseAdmin(url, 'test-key');
          expect.fail(`Should have thrown for URL: ${url}`);
        } catch (error: any) {
          expect(error).toBeInstanceOf(TRPCError);
          expect(error.cause.code).toBe(expectedCode);
          expect(error.message).toBeDefined();
        }
      }
    });

    it('should handle environment variable trimming', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        } as Response)
      );

      const client = await initializeSupabaseAdmin(
        '  https://example.supabase.co  ',
        '  test-key-with-spaces  '
      );
      expect(client).toBeDefined();
      expect(client.storage).toBeDefined();
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('Connectivity Diagnostics', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      delete (global as any).fetch;
    });

    it('should perform health check before initializing client', async () => {
      const fetchSpy = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        } as Response)
      );
      global.fetch = fetchSpy;

      await initializeSupabaseAdmin('https://example.supabase.co', 'test-key');

      // Verify fetch was called
      expect(fetchSpy).toHaveBeenCalled();
      // Verify health endpoint was checked
      const calls = fetchSpy.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
    });

    it('should use AbortController for health check timeout', async () => {
      let abortControllerUsed = false;

      global.fetch = vi.fn((url, options: any) => {
        // Check if AbortController is being used
        if (options.signal) {
          abortControllerUsed = true;
        }
        return Promise.resolve({
          ok: true,
          status: 200,
        } as Response);
      });

      await initializeSupabaseAdmin('https://example.supabase.co', 'test-key');
      expect(abortControllerUsed).toBe(true);
    });
  });
});
