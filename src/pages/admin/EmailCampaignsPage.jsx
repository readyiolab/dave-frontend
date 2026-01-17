import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { 
  Mail, 
  Users, 
  Send, 
  FileText, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Eye,
  Edit3,
  Layout,
  Zap,
  Gift,
  Heart,
  Sparkles,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ChevronRight
} from 'lucide-react';

export default function EmailCampaignsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);
  
  const [activeView, setActiveView] = useState('dashboard'); // dashboard | create | subscribers
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Choose Template, 2: Edit Content, 3: Review & Send
  const [editorKey, setEditorKey] = useState(0); // Force re-render of editor when template changes

  // Available templates with visual previews
  const templates = [
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Perfect for regular updates and news',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      preview: 'Clean and professional layout for your regular updates'
    },
    {
      id: 'promotion',
      name: 'Promotional',
      description: 'Eye-catching design for special offers',
      icon: <Gift className="w-8 h-8" />,
      color: 'from-amber-500 to-orange-500',
      preview: 'Bold design to highlight your promotions and offers'
    },
    {
      id: 'welcome',
      name: 'Welcome',
      description: 'Warm greeting for new subscribers',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-500',
      preview: 'Friendly template to welcome new subscribers'
    },
    {
      id: 'reengagement',
      name: 'Re-engagement',
      description: 'Win back inactive subscribers',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-500',
      preview: 'Engaging design to reconnect with your audience'
    },
    {
      id: 'custom',
      name: 'Blank Canvas',
      description: 'Start from scratch with your own design',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-gray-700 to-gray-900',
      preview: 'Complete creative freedom for your content'
    }
  ];

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await api.get('/campaigns/campaigns');
      return response.data;
    }
  });

  // Fetch subscribers
  const { data: subscribers = [], isLoading: subscribersLoading } = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const response = await api.get('/campaigns/subscribers');
      return response.data;
    }
  });

  // Send campaign mutation
  const sendCampaignMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/campaigns/campaigns/send', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({ 
        title: '🎉 Campaign Sent Successfully!', 
        description: data.message 
      });
      queryClient.invalidateQueries(['campaigns']);
      resetCampaign();
      setActiveView('dashboard');
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.error || 'Failed to send campaign',
        variant: 'destructive'
      });
    }
  });

  // Remove subscriber mutation
  const removeSubscriberMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/campaigns/subscribers/${id}`);
    },
    onSuccess: () => {
      toast({ title: 'Subscriber removed' });
      queryClient.invalidateQueries(['subscribers']);
    }
  });

  const resetCampaign = () => {
    setCampaignTitle('');
    setCampaignSubject('');
    setSelectedTemplate(null);
    setEditorContent('');
    setStep(1);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setStep(2);
    setEditorKey(prev => prev + 1); // Force editor re-render
    
    // Set default content based on template
    if (template.id === 'newsletter') {
      setEditorContent(`<h2>📰 This Week's Updates</h2>
<p>Dear Subscriber,</p>
<p>Here are the latest updates from Freedom Mergers:</p>
<ul>
  <li>New M&A opportunities in the tech sector</li>
  <li>Market insights and trends</li>
  <li>Upcoming webinars and events</li>
</ul>
<p>Stay tuned for more updates!</p>
<p>Best regards,<br/>The Freedom Mergers Team</p>`);
    } else if (template.id === 'promotion') {
      setEditorContent(`<h2 style="text-align: center;">🎯 Special Offer Just for You!</h2>
<p style="text-align: center; font-size: 18px;">Limited Time Only</p>
<p>We have an exclusive opportunity waiting for you. This is your chance to take the next step in your M&A journey.</p>
<p style="text-align: center; background: #f5f5f5; padding: 20px; border-radius: 8px;">
  <strong>Book a FREE Consultation Today!</strong>
</p>
<p>Don't miss out on this opportunity to work with our expert team.</p>`);
    } else if (template.id === 'welcome') {
      setEditorContent(`<h2>👋 Welcome to Freedom Mergers!</h2>
<p>We're thrilled to have you join our community!</p>
<p>As a subscriber, you'll receive:</p>
<ul>
  <li>✅ Exclusive M&A insights and market updates</li>
  <li>✅ Early access to business opportunities</li>
  <li>✅ Expert tips from Dave Marshall</li>
  <li>✅ Invitations to exclusive webinars</li>
</ul>
<p>Ready to explore your options? Schedule a free consultation with our team!</p>`);
    } else if (template.id === 'reengagement') {
      setEditorContent(`<h2 style="text-align: center;">We Miss You! 💔</h2>
<p>It's been a while since we've connected, and we wanted to reach out.</p>
<p>A lot has happened since you last heard from us:</p>
<ul>
  <li>New acquisition opportunities in hot markets</li>
  <li>Updated valuations and market reports</li>
  <li>Success stories from clients like you</li>
</ul>
<p>We'd love to reconnect and explore how we can help you achieve your business goals.</p>`);
    } else {
      setEditorContent(`<h2>Your Title Here</h2>
<p>Write your amazing content here...</p>`);
    }
  };

  const handleSendCampaign = () => {
    if (!campaignTitle.trim()) {
      toast({ title: 'Error', description: 'Please enter a campaign title', variant: 'destructive' });
      return;
    }
    if (subscribers.length === 0) {
      toast({ title: 'Error', description: 'No subscribers to send to', variant: 'destructive' });
      return;
    }
    sendCampaignMutation.mutate({
      title: campaignTitle,
      subject: campaignSubject || campaignTitle,
      content: editorContent,
      templateId: selectedTemplate?.id || 'custom'
    });
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

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  // Set editor content when template changes
  useEffect(() => {
    if (editorRef.current && editorContent && step === 2) {
      editorRef.current.innerHTML = editorContent;
    }
  }, [editorKey]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  // Dashboard View
  if (activeView === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
              <p className="text-gray-600 mt-1">Create and manage beautiful email campaigns</p>
            </div>
            <Button 
              onClick={() => setActiveView('create')}
              className="bg-black text-white hover:bg-gray-800 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Campaign
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Subscribers</p>
                    <p className="text-3xl font-bold mt-1">{subscribers.length}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Campaigns Sent</p>
                    <p className="text-3xl font-bold mt-1">{campaigns.filter(c => c.status === 'sent').length}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Send className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Templates</p>
                    <p className="text-3xl font-bold mt-1">{templates.length}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Layout className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setActiveView('subscribers')}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Manage Subscribers</p>
                    <p className="text-lg font-semibold mt-1">View All →</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <ChevronRight className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Recent Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {campaignsLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Mail className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                  <p className="text-gray-500 mb-6">Create your first email campaign to engage your subscribers</p>
                  <Button onClick={() => setActiveView('create')} className="bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Campaign
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Campaign</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Template</th>
                        <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Sent</th>
                        <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Failed</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Date</th>
                        <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {campaigns.slice(0, 10).map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${campaign.status === 'sent' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                {campaign.status === 'sent' ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                )}
                              </div>
                              <span className="font-medium text-gray-900">{campaign.title}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {campaign.template_id || 'newsletter'}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="font-semibold text-green-600">{campaign.sent_count || 0}</span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={campaign.failed_count > 0 ? 'font-semibold text-red-500' : 'text-gray-400'}>
                              {campaign.failed_count || 0}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-500 text-sm">
                            {campaign.sent_at ? formatDate(campaign.sent_at) : formatDate(campaign.created_at)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              campaign.status === 'sent' 
                                ? 'bg-green-100 text-green-700' 
                                : campaign.status === 'sending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {campaign.status === 'sent' ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Delivered
                                </>
                              ) : campaign.status === 'sending' ? (
                                <>
                                  <Clock className="h-3 w-3" />
                                  Sending
                                </>
                              ) : (
                                campaign.status
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Subscribers View
  if (activeView === 'subscribers') {
    return (
      <div className="space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setActiveView('dashboard')}
              className="hover:bg-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
              <p className="text-gray-600">Manage your email list</p>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              {subscribersLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-14 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscribers yet</h3>
                  <p className="text-gray-500">Subscribers will appear here when they sign up through your website.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Email</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Name</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Subscribed</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {(sub.email?.[0] || '?').toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">{sub.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">{sub.name || '-'}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              sub.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {sub.status === 'active' && <CheckCircle className="h-3 w-3" />}
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-500 text-sm">
                            {formatDate(sub.created_at)}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSubscriberMutation.mutate(sub.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Create Campaign View
  return (
    <div className="min-h-full pb-10">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else { resetCampaign(); setActiveView('dashboard'); }
              }}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create Campaign</h1>
              <p className="text-sm text-gray-500">Step {step} of 3</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s <= step 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-12 h-1 mx-2 ${s < step ? 'bg-black' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Step 1: Choose Template */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
              <p className="text-gray-600 mt-2">Select a starting point for your email campaign</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="group cursor-pointer"
                >
                  <div className={`relative bg-gradient-to-br ${template.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300`}>
                    <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-6 w-6" />
                    </div>
                    <div className="mb-4 p-3 bg-white/20 rounded-xl w-fit">
                      {template.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                    <p className="text-white/80 text-sm">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Edit Content */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Editor Panel */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Edit3 className="h-5 w-5" />
                      Campaign Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Campaign Name</label>
                      <Input
                        value={campaignTitle}
                        onChange={(e) => setCampaignTitle(e.target.value)}
                        placeholder="e.g., January Newsletter"
                        className="border-gray-300 h-12 text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email Subject</label>
                      <Input
                        value={campaignSubject}
                        onChange={(e) => setCampaignSubject(e.target.value)}
                        placeholder="e.g., 📰 Your Weekly Update from Freedom Mergers"
                        className="border-gray-300 h-12"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold text-gray-900">Email Content</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Rich Text Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-100 bg-gray-50">
                      <Button variant="ghost" size="sm" onClick={() => execCommand('bold')} className="h-8 w-8 p-0">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => execCommand('italic')} className="h-8 w-8 p-0">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => execCommand('underline')} className="h-8 w-8 p-0">
                        <Underline className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-gray-300 mx-2"></div>
                      <Button variant="ghost" size="sm" onClick={() => execCommand('justifyLeft')} className="h-8 w-8 p-0">
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => execCommand('justifyCenter')} className="h-8 w-8 p-0">
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => execCommand('justifyRight')} className="h-8 w-8 p-0">
                        <AlignRight className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-gray-300 mx-2"></div>
                      <Button variant="ghost" size="sm" onClick={() => execCommand('insertUnorderedList')} className="h-8 w-8 p-0">
                        <List className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) execCommand('createLink', url);
                      }} className="h-8 w-8 p-0">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Editable Content Area */}
                    <div
                      key={editorKey}
                      ref={editorRef}
                      contentEditable
                      className="min-h-[400px] p-6 focus:outline-none prose prose-sm max-w-none"
                      onInput={handleEditorInput}
                      onBlur={handleEditorInput}
                      style={{ lineHeight: 1.8 }}
                      suppressContentEditableWarning={true}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Side Panel */}
              <div className="space-y-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Campaign Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Template</span>
                        <span className="font-medium">{selectedTemplate?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Recipients</span>
                        <span className="font-medium">{subscribers.length} subscribers</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setStep(3)} 
                      className="w-full mt-6 bg-white text-gray-900 hover:bg-gray-100"
                      disabled={!campaignTitle.trim()}
                    >
                      Continue to Review
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Use a compelling subject line</li>
                      <li>• Keep your message concise</li>
                      <li>• Include a clear call-to-action</li>
                      <li>• Personalize when possible</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Send */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Ready to Send!</h2>
              <p className="text-gray-600 mt-2">Review your campaign before sending</p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Campaign Name</span>
                  <span className="font-semibold text-gray-900">{campaignTitle}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Subject Line</span>
                  <span className="font-medium text-gray-900">{campaignSubject || campaignTitle}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Template</span>
                  <span className="font-medium text-gray-900">{selectedTemplate?.name}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Recipients</span>
                  <span className="font-bold text-green-600">{subscribers.length} subscribers</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setPreviewOpen(true)}
                className="flex-1"
                disabled={sendCampaignMutation.isLoading}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Email
              </Button>
              <Button 
                onClick={handleSendCampaign}
                disabled={sendCampaignMutation.isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sendCampaignMutation.isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending Campaign...</span>
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Campaign
                  </>
                )}
              </Button>
            </div>
            
            {sendCampaignMutation.isLoading && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="animate-pulse">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Sending emails to {subscribers.length} subscribers...</p>
                    <p className="text-sm text-blue-600">Please wait, this may take a moment.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Sheet */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Email Preview</SheetTitle>
            <SheetDescription>How your email will look to subscribers</SheetDescription>
          </SheetHeader>
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-900 text-white p-6 text-center">
                <h2 className="text-xl font-bold">{campaignSubject || campaignTitle || 'Your Subject Line'}</h2>
              </div>
              <div className="p-6 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: editorContent }} />
              <div className="bg-gray-50 p-4 text-center text-sm text-gray-500">
                Freedom Mergers | Unsubscribe
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
