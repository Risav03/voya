export interface SignedUploadRequest {
  ownerId: string;
  contentType: string;
  byteSize: number;
  purpose: 'frame' | 'memory' | 'trip_image' | 'cached_asset';
}

export interface StorageProvider {
  createSignedUpload(input: SignedUploadRequest): Promise<{ uploadUrl: string; storageKey: string }>;
  createSignedDownload(storageKey: string): Promise<{ downloadUrl: string }>;
}

export class MockStorageProvider implements StorageProvider {
  async createSignedUpload(input: SignedUploadRequest) {
    const storageKey = `${input.ownerId}/${input.purpose}/${crypto.randomUUID()}`;
    return { uploadUrl: `https://mock-s3.local/upload/${storageKey}`, storageKey };
  }

  async createSignedDownload(storageKey: string) {
    return { downloadUrl: `https://mock-s3.local/download/${storageKey}` };
  }
}

export const storageProvider = new MockStorageProvider();
