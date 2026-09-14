import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ReviewDecisionType, ReviewDecision } from '@/types/review';
import { REVIEW_DECISIONS } from '@/lib/constants';
import { formatDate, formatDateTime, getStatusBadgeClasses } from '@/lib/utils';
import { ShieldCheck, AlertTriangle, ArrowUpRight, HelpCircle, History } from 'lucide-react';

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractNumber: string;
  currentStatus: string;
  reviews: ReviewDecision[];
  onSubmitReview: (decision: ReviewDecisionType, notes: string) => Promise<void>;
  isLoading?: boolean;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  contractNumber,
  currentStatus,
  reviews = [],
  onSubmitReview,
  isLoading = false,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<ReviewDecisionType>('ESCALATED');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmitReview(selectedDecision, notes);
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Auditor Determination Workflow — ${contractNumber}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Review Determination
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {REVIEW_DECISIONS.map((item) => {
              const isSelected = selectedDecision === item.value;
              return (
                <div
                  key={item.value}
                  onClick={() => setSelectedDecision(item.value as ReviewDecisionType)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <p className="font-bold text-xs uppercase tracking-wide">{item.label}</p>
                  <p className={`text-[11px] mt-1 leading-normal ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Auditor Findings & Regulatory Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="State specific audit justifications, threshold deviations, or required actions..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
            Submit Official Determination
          </Button>
        </div>

        {/* Prior Review History */}
        {reviews.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              <History className="w-3.5 h-3.5" />
              <span>Prior Determination History</span>
            </div>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {reviews.map((r) => (
                <div key={r.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClasses(r.decision)}`}>
                      {r.decision.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDateTime(r.created_at)}
                    </span>
                  </div>
                  {r.notes && <p className="text-slate-700 mt-1.5 leading-relaxed">{r.notes}</p>}
                  <p className="text-[10px] text-slate-400 mt-1">
                    Recorded by: {r.reviewer_name || 'Auditor'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
