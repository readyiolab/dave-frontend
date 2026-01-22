import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Phone, Calendar, Clock, User, BarChart } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function VoiceCallsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCall, setSelectedCall] = useState(null);

  const { data: calls = [], isLoading } = useQuery({
    queryKey: ['voice-logs'],
    queryFn: async () => {
      const response = await api.get('/voice/logs');
      return response.data;
    },
  });

  const filteredCalls = calls.filter(call => 
    call.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.lead_phone?.includes(searchTerm) ||
    call.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Voice Calls</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Review AI phone call history and transcripts</p>
        </div>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Call History</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search calls..."
                  className="pl-9 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">Loading call history...</div>
            ) : filteredCalls.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No voice calls recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Date / Time</TableHead>
                      <TableHead>Lead</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="w-1/2">Transcript</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalls.map((call) => (
                      <TableRow key={call.id} className="hover:bg-gray-50">
                        <TableCell className="whitespace-nowrap text-sm text-gray-600">
                           <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(call.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <User className="h-4 w-4 text-gray-400" />
                             <div>
                               <div className="font-medium text-gray-900">{call.lead_name || 'Unknown Lead'}</div>
                               <div className="text-xs text-gray-500">{call.lead_phone || 'No Phone'}</div>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {formatDuration(call.duration)}
                          </div>
                        </TableCell>
                        <TableCell>
                           {call.qualification_score > 0 && (
                            <div className="flex items-center gap-1">
                              <BarChart className="h-4 w-4 text-blue-500" />
                              <Badge variant={call.qualification_score >= 7 ? "default" : "secondary"}>
                                {call.qualification_score}/10
                              </Badge>
                            </div>
                           )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedCall(call)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            View Transcript
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedCall} onOpenChange={(open) => !open && setSelectedCall(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Call Transcript</DialogTitle>
              <DialogDescription>
                Conversation with {selectedCall?.lead_name || selectedCall?.lead_phone} on {selectedCall && formatDate(selectedCall.created_at)}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-md border text-sm space-y-4">
              {selectedCall?.notes ? (
                selectedCall.notes.split('\n\n').map((block, i) => {
                  const isCustomer = block.startsWith('Customer:');
                  return (
                    <div key={i} className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}>
                       <div className={`p-3 rounded-lg max-w-[85%] ${isCustomer ? 'bg-blue-100 text-blue-900' : 'bg-white border text-gray-800'}`}>
                         <strong>{isCustomer ? 'User' : 'AI Assistant'}</strong>
                         <p className="mt-1 whitespace-pre-wrap">{block.replace(/^(Customer|Sarah \(AI\)): /, '')}</p>
                       </div>
                    </div>
                  );
                })
              ) : (
                 <p className="text-gray-500 italic">No transcript available.</p>
              )}
            </div>
            <div className="pt-4 border-t flex justify-end">
               <Button onClick={() => setSelectedCall(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
