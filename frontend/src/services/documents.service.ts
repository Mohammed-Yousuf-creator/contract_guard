import { apiClient } from '@/lib/api';
import { Document, DocumentDownloadUrl, DocumentType } from '@/types/document';

export const documentsService = {
  async getDocuments(contractId: string): Promise<Document[]> {
    return apiClient<Document[]>(`/contracts/${contractId}/documents`);
  },

  async getDocument(documentId: string): Promise<Document> {
    return apiClient<Document>(`/documents/${documentId}`);
  },

  async uploadDocument(
    contractId: string,
    file: File,
    documentType: DocumentType,
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    return apiClient<Document>(`/contracts/${contractId}/documents`, {
      method: 'POST',
      body: formData,
    });
  },

  async deleteDocument(documentId: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/documents/${documentId}`, {
      method: 'DELETE',
    });
  },

  async getDownloadUrl(documentId: string): Promise<DocumentDownloadUrl> {
    return apiClient<DocumentDownloadUrl>(`/documents/${documentId}/download-url`, {
      method: 'POST',
    });
  },
};
