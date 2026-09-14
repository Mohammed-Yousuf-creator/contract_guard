import React from 'react';
import { EvidenceItem } from '@/types/evidence';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FileText, ExternalLink, Quote } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface EvidencePanelProps {
  evidence: EvidenceItem[];
  selectedFactor?: string | null;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidence = [], selectedFactor }) => {
  if (evidence.length === 0) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Ground-Truth Supporting Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500">
            No document citations extracted by the Core AI service for this item.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {selectedFactor && (
        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-md text-xs text-blue-800 flex items-center justify-between">
          <span>
            Filtered citations for: <strong className="uppercase">{selectedFactor}</strong>
          </span>
          <span className="text-[10px] font-semibold bg-blue-200 px-2 py-0.5 rounded">
            AI Extracted
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidence.map((item, idx) => {
          const originalFormatted =
            typeof item.original_value === 'number'
              ? formatCurrency(item.original_value)
              : item.original_value;

          const newFormatted =
            typeof item.new_value === 'number'
              ? formatCurrency(item.new_value)
              : item.new_value;

          return (
            <Card key={idx} className="border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <CardHeader className="py-3 px-4 bg-slate-50/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                      {item.filename || 'Contract Document'}
                    </span>
                    {item.page && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded">
                        Page {item.page}
                      </span>
                    )}
                  </div>
                  {item.change_type && (
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {item.change_type}
                    </span>
                  )}
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  {/* Extracted source quote */}
                  <div className="p-3 bg-slate-50 rounded border border-slate-200/80 text-xs text-slate-800 leading-relaxed flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="italic font-serif text-[12px]">{item.source_text}</p>
                  </div>

                  {/* Valuation comparison if available */}
                  {(originalFormatted || newFormatted) && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      {originalFormatted && (
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                            Original / Baseline
                          </span>
                          <span className="font-semibold text-slate-700">{originalFormatted}</span>
                        </div>
                      )}
                      {newFormatted && (
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                            Revised / Current
                          </span>
                          <span className="font-bold text-rose-600">{newFormatted}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Verified by Core AI Semantic Extractor</span>
                <span className="font-mono">Citation #{idx + 1}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
