import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function LeadForm({ setIsDialogOpen, lead = {} }) {
  const [formData, setFormData] = useState({
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    source: lead.source || '',
    segment: lead.segment || 'prospect',
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (lead.id) {
        await api.put('/api/leads', { id: lead.id, ...formData });
      } else {
        await api.post('/api/leads/create', formData);
      }
      queryClient.invalidateQueries(['leads']);
      toast({
        title: 'Success',
        description: lead.id ? 'Lead updated' : 'Lead created',
      });
      setIsDialogOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save lead',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-black">Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border-black text-black placeholder-gray-500"
        />
      </div>
      <div>
        <Label className="text-black">Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border-black text-black placeholder-gray-500"
        />
      </div>
      <div>
        <Label className="text-black">Phone</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border-black text-black placeholder-gray-500"
        />
      </div>
      <div>
        <Label className="text-black">Source</Label>
        <Input
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="border-black text-black placeholder-gray-500"
        />
      </div>
      <div>
        <Label className="text-black">Segment</Label>
        <Select
          value={formData.segment}
          onValueChange={(value) => setFormData({ ...formData, segment: value })}
        >
          <SelectTrigger className="border-black text-black">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white text-black border-black">
            <SelectItem value="investor">Investor</SelectItem>
            <SelectItem value="advisor">Advisor</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="bg-black text-white hover:bg-gray-800">
        {lead.id ? 'Update Lead' : 'Create Lead'}
      </Button>
    </form>
  );
}

LeadForm.propTypes = {
  setIsDialogOpen: PropTypes.func.isRequired,
  lead: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    source: PropTypes.string,
    segment: PropTypes.oneOf(['investor', 'advisor', 'partner', 'prospect']),
  }),
};
