import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ContactsTable = ({ contacts, page, pageSize, total, setPage }) => {
  console.log('ContactsTable props:', { contacts, page, pageSize, total }); // Debug log
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
             
              <TableHead className="text-gray-900 font-semibold">First Name</TableHead>
              <TableHead className="text-gray-900 font-semibold">Last Name</TableHead>
              <TableHead className="text-gray-900 font-semibold">Email</TableHead>
              <TableHead className="text-gray-900 font-semibold">Company</TableHead>
              <TableHead className="text-gray-900 font-semibold">Revenue</TableHead>
              <TableHead className="text-gray-900 font-semibold">Message</TableHead>
              <TableHead className="text-gray-900 font-semibold">Consent</TableHead>
              <TableHead className="text-gray-900 font-semibold">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
               
                <TableCell>{contact.first_name}</TableCell>
                <TableCell>{contact.last_name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.company || '-'}</TableCell>
                <TableCell>{contact.revenue || '-'}</TableCell>
                <TableCell className="max-w-xs truncate">{contact.message || '-'}</TableCell>
                <TableCell>{contact.consent ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {contact.created_at
                    ? new Date(contact.created_at).toLocaleDateString()
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} contacts
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactsTable;