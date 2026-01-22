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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
        <div className="flex items-center justify-end">
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                     onClick={() => setPage(page > 1 ? page - 1 : 1)}
                     className={`cursor-pointer ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
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
                        className={`cursor-pointer ${page === pageNumber ? 'bg-gray-900 text-white hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                    className={`cursor-pointer ${page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsTable;