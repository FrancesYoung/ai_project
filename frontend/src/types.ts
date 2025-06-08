export interface UploadResponse {
  error?: string;
  url?: string;
}

export interface ImageState {
  file: File | null;
  preview: string | null;
  processed: string | null;
  isLoading: boolean;
  error: string | null;
}