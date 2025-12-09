import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AppointmentTable({
  appointments,
  page,
  pageSize,
  total,
  setPage,
}) {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: async (appointmentId) => {
      // 🔥 Removed CSRF
      await api.delete(`/appointments/${appointmentId}`);
      await api.post("/admin/audit", {
        action: "cancel_appointment",
        metadata: { appointmentId, userId: user?.id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast({ title: "Success", description: "Appointment cancelled" });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      }),
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <Table className="border-black">
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Lead Name</TableHead>
            <TableHead className="text-black">Date</TableHead>
            <TableHead className="text-black">Time</TableHead>
            <TableHead className="text-black">Status</TableHead>
            <TableHead className="text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="text-black">
                {appointment.lead_name}
              </TableCell>
              <TableCell className="text-black">
                {new Date(appointment.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-black">{appointment.time}</TableCell>
              <TableCell className="text-black">{appointment.status}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white"
                  onClick={() => cancelMutation.mutate(appointment.id)}
                  disabled={cancelMutation.isLoading}
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              className="border-black text-black hover:bg-black hover:text-white"
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setPage(i + 1)}
                isActive={page === i + 1}
                className={
                  page === i + 1
                    ? "bg-black text-white"
                    : "border-black text-black hover:bg-black hover:text-white"
                }
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setPage(page < totalPages ? page + 1 : totalPages)
              }
              className="border-black text-black hover:bg-black hover:text-white"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

AppointmentTable.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      lead_name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["scheduled", "completed", "cancelled"])
        .isRequired,
    })
  ).isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};
