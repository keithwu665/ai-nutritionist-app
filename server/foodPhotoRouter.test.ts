import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TRPCError } from '@trpc/server';
import { initializeSupabaseAdmin, ensureFoodPhotosBucket } from './utils/supabaseClient';

describe('Photo AI Production Fix Tests', () => {
  describe('initializeSupabaseAdmin', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should throw SUPABASE_URL_MISSING when URL is empty', async () => {
      try {
        await initializeSupabaseAdmin('', 'test-key');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('SUPABASE_URL_MISSING');
      }
    });

    it('should throw SUPABASE_SERVICE_ROLE_KEY_MISSING when key is empty', async () => {
      try {
        await initializeSupabaseAdmin('https://example.supabase.co', '');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('SUPABASE_SERVICE_ROLE_KEY_MISSING');
      }
    });

    it('should throw SUPABASE_URL_INVALID when URL does not start with https://', async () => {
      try {
        await initializeSupabaseAdmin('http://example.supabase.co', 'test-key');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(TRPCError);
        expect(error.cause.code).toBe('SUPABASE_URL_INVALID');
      }
    });

    it('should remove trailing slash from URL', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: vi.fn(() => Promise.resolve('{}')),
          headers: new Map([['content-type', 'application/json']]),
        } as any)
      );

      const client = await initializeSupabaseAdmin('https://example.supabase.co/', 'test-key');
      expect(client).toBeDefined();
      expect(client.storage).toBeDefined();
    });

    it('should successfully initialize client when credentials and connectivity are valid', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: vi.fn(() => Promise.resolve('{}')),
          headers: new Map([['content-type', 'application/json']]),
        } as any)
      );

      const client = await initializeSupabaseAdmin('https://example.supabase.co', 'test-key');
      expect(client).toBeDefined();
      expect(client.storage).toBeDefined();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should use AbortController for health check timeout', async () => {
      let abortControllerUsed = false;

      global.fetch = vi.fn((url, options: any) => {
        if (options.signal) {
          abortControllerUsed = true;
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: vi.fn(() => Promise.resolve('{}')),
          headers: new Map([['content-type', 'application/json']]),
        } as any);
      });

      await initializeSupabaseAdmin('https://example.supabase.co', 'test-key');
      expect(abortControllerUsed).toBe(true);
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
      expect(mockClient.storage.createBucket).toHaveBeenCalledTimes(0);
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
      }
    });
  });
});
