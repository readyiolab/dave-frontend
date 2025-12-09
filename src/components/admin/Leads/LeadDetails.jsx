import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { setInteractions } from '../../store/slices/leadsSlice';
import { api } from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, Tag, User, MessageSquare, Calendar, Hash } from 'lucide-react';

export default function LeadDetails() {
  const { selectedLead, interactions } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const addInteractionMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/leads/interaction', data);
      await api.post('/admin/audit', {
        action: 'add_interaction',
        metadata: { leadId: data.lead_id, userId: user?.id },
      });
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setInteractions([...interactions, data]));
      setNotes('');
      toast({ title: 'Success', description: 'Interaction added' });
    },
    onError: (error) => {
      console.error('Add interaction error:', error);
      toast({
        title: 'Error',
        description: 'Failed to add interaction',
        variant: 'destructive',
      });
    },
  });

  const sendSurveyMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/leads/survey`, { leadId: selectedLead?.id });
      await api.post('/admin/audit', {
        action: 'send_survey',
        metadata: { leadId: selectedLead?.id, userId: user?.id },
      });
    },
    onSuccess: () =>
      toast({ title: 'Success', description: 'Feedback survey sent' }),
    onError: (error) => {
      console.error('Send survey error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send survey',
        variant: 'destructive',
      });
    },
  });

  const handleAddInteraction = () => {
    if (selectedLead && notes) {
      addInteractionMutation.mutate({ lead_id: selectedLead.id, notes });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedLead) {
    return (
      <div className="p-6 text-center text-gray-500">
        <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Select a lead to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Lead Details: {selectedLead?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-500" />
                <span><strong>Email:</strong> {selectedLead?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-500" />
                <span><strong>Phone:</strong> {selectedLead?.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="h-4 w-4 text-gray-500" />
                <span><strong>Segment:</strong> {selectedLead?.segment}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4 text-gray-500" />
                <span><strong>Status:</strong> {selectedLead?.status}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(selectedLead?.interest || selectedLead?.message || selectedLead?.session_id) && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Lead Information</h3>
              <div className="space-y-2">
                {selectedLead?.interest && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span><strong>Interest:</strong> {selectedLead.interest}</span>
                  </div>
                )}
                {selectedLead?.message && (
                  <div className="text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Message:</strong>
                        <p className="mt-1 text-gray-700">{selectedLead.message}</p>
                      </div>
                    </div>
                  </div>
                )}
                {selectedLead?.session_id && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span><strong>Session ID:</strong> {selectedLead.session_id}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span><strong>Created:</strong> {formatDate(selectedLead.created_at)}</span>
                </div>
                {selectedLead.updated_at !== selectedLead.created_at && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span><strong>Updated:</strong> {formatDate(selectedLead.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={() => sendSurveyMutation.mutate()}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={sendSurveyMutation.isLoading}
            >
              {sendSurveyMutation.isLoading ? 'Sending...' : 'Send Feedback Survey'}
            </Button>
          </div>

          {/* Add Interaction */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Add Interaction</h3>
            <div className="space-y-2">
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add interaction notes"
                className="border-gray-300 text-gray-900 placeholder-gray-500"
              />
              <Button
                onClick={handleAddInteraction}
                className="w-full bg-green-600 text-white hover:bg-green-700"
                disabled={!notes || addInteractionMutation.isLoading}
              >
                {addInteractionMutation.isLoading ? 'Adding...' : 'Add Interaction'}
              </Button>
            </div>
          </div>

          {/* Interactions History */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Interactions History</h3>
            {interactions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No interactions yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-200">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">
                          {formatDate(interaction.created_at)}
                        </p>
                        <p className="text-sm text-gray-700">{interaction.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
}