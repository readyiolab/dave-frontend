import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../components/lib/api'; // Adjust import based on your structure
import { Bot, User, Clock, Search, RefreshCw, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const scrollRef = useRef(null);

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
    // Poll for new sessions every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages when session is selected
  useEffect(() => {
    if (selectedSessionId) {
      fetchHistory(selectedSessionId);
    } else {
      setMessages([]);
    }
  }, [selectedSessionId]);

  // Auto-scroll to start (top) of chat when messages load
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        // Scroll to top to read history from the beginning
        scrollContainer.scrollTop = 0;
      }
    }
  }, [selectedSessionId, messages]);

  const fetchSessions = async () => {
    setIsSessionsLoading(true);
    try {
      const response = await api.get('/ai-chat/sessions');
      if (response.data.success) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat sessions',
        variant: 'destructive',
      });
    } finally {
      setIsSessionsLoading(false);
    }
  };

  const fetchHistory = async (sessionId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/ai-chat/history/${sessionId}`);
      if (response.data.success) {
        setMessages(response.data.history);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSessions();
    if (selectedSessionId) fetchHistory(selectedSessionId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSessions = sessions.filter(session => {
    const term = searchTerm.toLowerCase();
    return (
      (session.lead_name && session.lead_name.toLowerCase().includes(term)) ||
      (session.lead_email && session.lead_email.toLowerCase().includes(term)) ||
      (session.last_message && session.last_message.toLowerCase().includes(term)) ||
      session.session_id.toLowerCase().includes(term)
    );
  });

  const selectedSession = sessions.find(s => s.session_id === selectedSessionId);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Chat History</h1>
          <p className="text-muted-foreground">Monitor bot interactions and user queries</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden h-full">
        {/* Sessions List */}
        <Card className="md:col-span-1 flex flex-col h-full overflow-hidden border-2">
          <CardHeader className="py-3 px-4 border-b bg-gray-50">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search sessions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            {isSessionsLoading && sessions.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading sessions...</div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No sessions found</div>
            ) : (
              <div className="divide-y">
                {filteredSessions.map((session) => (
                  <div
                    key={session.session_id}
                    onClick={() => setSelectedSessionId(session.session_id)}
                    className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedSessionId === session.session_id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-sm truncate max-w-[150px]">
                        {session.lead_name || 'Anonymous User'}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(session.last_activity).split(',')[1]}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2 truncate">
                      {session.lead_email || session.session_id.substring(0, 15)+'...'}
                    </div>

                    <div className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-2 rounded border border-gray-100">
                      {session.last_message || 'Empty conversation'}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <MessageSquare className="h-3 w-3" />
                      <span>{session.message_count} msgs</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="md:col-span-2 flex flex-col h-full overflow-hidden border-2 shadow-sm">
          {selectedSessionId ? (
            <>
              <CardHeader className="py-3 px-6 border-b bg-gray-50 flex flex-row justify-between items-center space-y-0">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {selectedSession?.lead_name ? (
                       <><User className="h-4 w-4" /> {selectedSession.lead_name}</>
                    ) : (
                       <><Bot className="h-4 w-4" /> Anonymous Session</>
                    )}
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Last active: {formatDate(selectedSession?.last_activity)}
                    {selectedSession?.lead_email && (
                      <span className="ml-2 border-l pl-2 border-gray-300">{selectedSession.lead_email}</span>
                    )}
                  </p>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  ID: {selectedSessionId.substring(0, 8)}...
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden relative bg-gray-50/50">
                <ScrollArea className="h-full p-4" ref={scrollRef}>
                  <div className="space-y-4 pb-4">
                    {isLoading ? (
                      <div className="text-center py-10 text-gray-400">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">No messages in this session</div>
                    ) : (
                      messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`flex flex-col max-w-[80%] ${
                              msg.sender === 'user' ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div
                              className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                msg.sender === 'user'
                                  ? 'bg-blue-600 text-white rounded-tr-none'
                                  : 'bg-white border rounded-tl-none'
                              }`}
                            >
                              <div className="whitespace-pre-wrap">{msg.message}</div>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                              {formatDate(msg.created_at)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-gray-300" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">No Session Selected</h3>
                <p>Select a conversation from the left to view the chat history.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
