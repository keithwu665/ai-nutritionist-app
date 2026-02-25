import { createClient } from '@supabase/supabase-js';
import { TRPCError } from '@trpc/server';

/**
 * Initialize Supabase admin client with service role key
 * Validates credentials and connectivity before returning client
 */
export async function initializeSupabaseAdmin(
  supabaseUrl: string,
  supabaseServiceKey: string
) {
  // Validate and sanitize inputs
  const url = (supabaseUrl || '').trim();
  const key = (supabaseServiceKey || '').trim();

  console.log('[initializeSupabaseAdmin] Validating credentials...');
  console.log('[initializeSupabaseAdmin] URL present?', !!url, 'len:', url.length);
  console.log('[initializeSupabaseAdmin] Key present?', !!key, 'len:', key.length);

  if (!url) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'SUPABASE_URL is not configured',
      cause: { code: 'SUPABASE_URL_MISSING' },
    });
  }

  if (!key) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'SUPABASE_SERVICE_ROLE_KEY is not configured',
      cause: { code: 'SUPABASE_SERVICE_ROLE_KEY_MISSING' },
    });
  }

  // Sanitize URL
  if (!url.startsWith('https://')) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'SUPABASE_URL must start with https://',
      cause: { code: 'SUPABASE_URL_INVALID' },
    });
  }

  // Test connectivity
  console.log('[initializeSupabaseAdmin] Testing Supabase connectivity...');
  try {
    const healthUrl = url + '/auth/v1/health';
    console.log('[initializeSupabaseAdmin] Health check URL:', healthUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      console.log('[initializeSupabaseAdmin] Health check status:', response.status);

      if (!response.ok) {
        console.error('[initializeSupabaseAdmin] Health check failed:', response.status);
        throw new Error(`Health check returned ${response.status}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[initializeSupabaseAdmin] CONNECTIVITY_FAILED:', errorMsg);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Supabase connectivity failed: ${errorMsg}`,
      cause: { code: 'SUPABASE_CONNECTIVITY_FAILED' },
    });
  }

  // Create and return client
  console.log('[initializeSupabaseAdmin] Creating Supabase admin client...');
  const client = createClient(url, key, {
    auth: { persistSession: false },
  });

  console.log('[initializeSupabaseAdmin] Client initialized successfully');
  return client;
}

/**
 * Ensure food-photos bucket exists in Supabase
 */
export async function ensureFoodPhotosBucket(supabaseClient: any) {
  const bucketName = 'food-photos';

  try {
    console.log('[ensureFoodPhotosBucket] Checking if bucket exists:', bucketName);

    // Try to list bucket (will fail if bucket doesn't exist)
    const { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();

    if (listError) {
      console.error('[ensureFoodPhotosBucket] Error listing buckets:', listError.message);
      throw listError;
    }

    const bucketExists = buckets?.some((b: any) => b.name === bucketName);

    if (!bucketExists) {
      console.log('[ensureFoodPhotosBucket] Bucket does not exist, creating:', bucketName);

      const { data: newBucket, error: createError } = await supabaseClient.storage.createBucket(
        bucketName,
        {
          public: false,
          fileSizeLimit: 52428800, // 50MB
        }
      );

      if (createError) {
        console.error('[ensureFoodPhotosBucket] Error creating bucket:', createError.message);
        throw createError;
      }

      console.log('[ensureFoodPhotosBucket] Bucket created successfully:', bucketName);
    } else {
      console.log('[ensureFoodPhotosBucket] Bucket already exists:', bucketName);
    }
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[ensureFoodPhotosBucket] Failed to ensure bucket:', errorMsg);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Failed to ensure food-photos bucket: ${errorMsg}`,
      cause: { code: 'BUCKET_INITIALIZATION_FAILED' },
    });
  }
}
