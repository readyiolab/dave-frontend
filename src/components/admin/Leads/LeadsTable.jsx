import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setSelectedLead, setInteractions } from '../../store/slices/leadsSlice';
import { api } from '../../lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Eye, User, Mail, Phone, Tag, MessageSquare, Calendar, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LeadsTable({ leads, page, pageSize, total, setPage }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSelectLead = async (lead) => {
    dispatch(setSelectedLead(lead));
    try {
      // Remove the duplicate /api - the api instance should already handle the base path
      const response = await api.get(`/leads/interactions/${lead.id}`);
      dispatch(setInteractions(response.data));
      await api.post('/admin/audit', {
        action: 'view_lead',
        metadata: { leadId: lead.id, userId: user?.id },
      });
    } catch (err) {
      console.error('Error fetching interactions:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch interactions',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      reactivated: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return (
      <Badge className={styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-sm font-semibold text-gray-900 py-3">Name</TableHead>
              <TableHead className="text-sm font-semibold text-gray-900 py-3 hidden md:table-cell">Email</TableHead>
              <TableHead className="text-sm font-semibold text-gray-900 py-3 hidden lg:table-cell">Phone</TableHead>
              <TableHead className="text-sm font-semibold text-gray-900 py-3 hidden md:table-cell">Segment</TableHead>
              <TableHead className="text-sm font-semibold text-gray-900 py-3 hidden xl:table-cell">Interest</TableHead>
              <TableHead className="text-sm font-semibold text-gray-900 py-3 hidden lg:table-cell">Created</TableHead>
              <TableHead className="text-sm font-semibold text-gray-900 py-3 hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-sm font-semibold text-gray-900 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{lead.name}</span>
                  </div>
                  {/* Stacked info for mobile */}
                  <div className="mt-2 space-y-1 sm:hidden">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {lead.phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="h-4 w-4" />
                      {lead.segment}
                    </div>
                    {lead.interest && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare className="h-4 w-4" />
                        <span className="truncate">{lead.interest}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {formatDate(lead.created_at)}
                    </div>
                    {lead.message && (
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Message:</span> {lead.message.length > 50 ? `${lead.message.substring(0, 50)}...` : lead.message}
                      </div>
                    )}
                    {lead.session_id && (
                      <div className="text-xs text-gray-400">
                        Session: {lead.session_id.substring(0, 20)}...
                      </div>
                    )}
                    <div>{getStatusBadge(lead.status)}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-900 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="truncate max-w-[200px]">{lead.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-900 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {lead.phone || 'N/A'}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-900 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    {lead.segment}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-900 hidden xl:table-cell">
                  {lead.interest && (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <span className="truncate max-w-[150px]" title={lead.interest}>
                        {lead.interest}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-900 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-xs">{formatDate(lead.created_at)}</span>
                  </div>
                  {lead.updated_at !== lead.created_at && (
                    <div className="flex items-center gap-2 mt-1">
                      <Activity className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">Updated: {formatDate(lead.updated_at)}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-900 hidden sm:table-cell">
                  {getStatusBadge(lead.status)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectLead(lead)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} leads
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'text-blue-600 hover:bg-blue-50'}
                />
              </PaginationItem>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => setPage(pageNumber)}
                      isActive={page === pageNumber}
                      className={page === pageNumber ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : 'text-blue-600 hover:bg-blue-50'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

LeadsTable.propTypes = {
  leads: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      segment: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      interest: PropTypes.string,
      message: PropTypes.string,
      session_id: PropTypes.string,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};