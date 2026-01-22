import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setInteractions } from '../../store/slices/leadsSlice';
import { api } from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, Tag, User, MessageSquare, Calendar, Hash, ClipboardList, PenTool, Loader2 } from 'lucide-react';

export default function LeadDetails() {
  const { selectedLead } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch interactions using React Query for better loading state management
  const { data: interactions = [], isLoading: isLoadingInteractions } = useQuery({
    queryKey: ['interactions', selectedLead?.id],
    queryFn: async () => {
      if (!selectedLead?.id) return [];
      const response = await api.get(`/leads/interactions/${selectedLead.id}`);
      return response.data;
    },
    enabled: !!selectedLead?.id,
  });

  const addInteractionMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/leads/interaction', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['interactions', selectedLead?.id]);
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
      await api.post(`/leads/survey`, { 
        leadId: selectedLead?.id,
        questions: ['How would you rate our service?', 'Would you recommend us?'] 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['interactions', selectedLead?.id]);
      toast({ title: 'Success', description: 'Feedback survey sent' });
    },
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
      addInteractionMutation.mutate({ 
        leadId: selectedLead.id, 
        notes,
        type: 'note' 
      });
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
                        <strong>Message:</strong> {selectedLead.message}
                        
                      </div>
                    </div>
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

          {/* Actions - Removed Delete Button as per request */}
          <div className="space-y-3">
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
            
            {isLoadingInteractions ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : interactions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No interactions yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {interactions.map((interaction, idx) => {
                  const isSurvey = interaction.type === 'survey';
                  const isChat = interaction.type === 'chat';
                  
                  let icon = <MessageSquare className="h-4 w-4 text-blue-500" />;
                  let bgClass = "bg-blue-50 border-blue-200";
                  let title = "Note";

                  if (isSurvey) {
                    icon = <ClipboardList className="h-4 w-4 text-purple-500" />;
                    bgClass = "bg-purple-50 border-purple-200";
                    title = "Feedback Survey";
                  } else if (isChat) {
                    icon = <MessageSquare className="h-4 w-4 text-green-500" />;
                     bgClass = "bg-green-50 border-green-200";
                     title = "AI Chat";
                  }

                  return (
                  <div key={interaction.id || idx} className={`rounded-lg p-3 border-l-4 ${bgClass}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">{icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{title}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDate(interaction.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{interaction.notes}</p>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
}