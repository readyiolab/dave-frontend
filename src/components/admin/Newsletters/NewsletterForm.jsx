import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function NewsletterForm({ setIsDialogOpen, newsletter = {} }) {
  const [formData, setFormData] = useState({
    subject: newsletter.subject || '',
    content: newsletter.content || '',
    scheduled_date: newsletter.scheduled_date || '',
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, _csrf: await api.get('/auth/csrf').then(res => res.data.csrfToken) };
      if (newsletter.id) {
        await api.put(`/newsletters/${newsletter.id}`, data);
      } else {
        await api.post('/newsletters', data);
      }
      queryClient.invalidateQueries(['newsletters']);
      toast({ title: 'Success', description: newsletter.id ? 'Newsletter updated' : 'Newsletter scheduled' });
      setIsDialogOpen(false);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save newsletter', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-black">Subject</Label>
        <Input
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="border-black text-black placeholder-gray-500"
        />
      </div>
      <div>
        <Label className="text-black">Content</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="border-black text-black placeholder-gray-500"
        />
      </div>
      <div>
        <Label className="text-black">Scheduled Date</Label>
        <Input
          type="date"
          value={formData.scheduled_date}
          onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
          className="border-black text-black placeholder-gray-500"
        />
      </div>
      <Button type="submit" className="bg-black text-white hover:bg-gray-800">
        {newsletter.id ? 'Update Newsletter' : 'Schedule Newsletter'}
      </Button>
    </form>
  );
}

NewsletterForm.propTypes = {
  setIsDialogOpen: PropTypes.func.isRequired,
  newsletter: PropTypes.shape({
    id: PropTypes.number,
    subject: PropTypes.string,
    content: PropTypes.string,
    scheduled_date: PropTypes.string,
  }),
};