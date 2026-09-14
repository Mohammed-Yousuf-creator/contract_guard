import React, { useState } from 'react';
import { Document } from '@/types/document';
import { formatDate, formatDateTime } from '@/lib/utils';
import { FileText, Download, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { documentsService } from '@/services/documents.service';

export interface DocumentListProps {
  documents: Document[];
  onDelete?: (documentId: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents = [], onDelete }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (doc: Document) => {
    try {
      setDownloadingId(doc.id);
      const res = await documentsService.getDownloadUrl(doc.id);
      if (res.download_url) {
        window.open(res.download_url, '_blank');
      }
    } catch (err) {
      alert('Failed to obtain download URL. Please ensure document exists in storage.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        No documents uploaded for this contract yet. Use the upload panel above to register tender addenda.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            <th className="py-3 px-4">Document</th>
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4 text-center">Version</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Upload Date</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {documents.map((doc) => {
            const isProcessing = doc.processing_status === 'PROCESSING';
            const isFailed = doc.processing_status === 'FAILED';

            return (
              <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate max-w-xs">{doc.filename}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {doc.document_type}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {doc.version_number !== null ? `v${doc.version_number}` : '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isProcessing
                        ? 'bg-blue-100 text-blue-700 animate-pulse'
                        : isFailed
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {doc.processing_status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-slate-500">
                  {formatDate(doc.created_at)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id}
                      title="Download Signed Document"
                    >
                      {downloadingId === doc.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(doc.id)}
                        title="Delete Document"
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
