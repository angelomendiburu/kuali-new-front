import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { leadsService } from '../services/leadsService';
import { LeadFormDialog } from './lead-form-dialog';
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { FiMail } from "react-icons/fi";
import { RiWhatsappLine } from "react-icons/ri";

const columns = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableSorting: true,
    cell: ({ row }) => row.original.name || ''
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.email || ''}</span>
        {row.original.email && (
          <a
            href={`mailto:${row.original.email}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Enviar correo"
            className="text-blue-600 hover:text-blue-800"
          >
            <FiMail />
          </a>
        )}
      </div>
    )
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.phone || ''}</span>
        {row.original.phone && (
          <a
            href={`https://wa.me/${row.original.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Enviar WhatsApp"
            className="text-green-600 hover:text-green-800"
          >
            <RiWhatsappLine />
          </a>
        )}
      </div>
    )
  },
  {
    accessorKey: 'company',
    header: 'Empresa',
    enableSorting: true,
    cell: ({ row }) => {
      const company = row.original.company;
      return company?.name || 'Sin empresa';
    }
  },
  {
    accessorKey: 'users',
    header: 'Usuario',
    enableSorting: true,
    cell: ({ row }) => {
      const user = row.original.users;
      return user?.name || 'No asignado';
    }
  },
  {
    accessorKey: 'events',
    header: 'Evento',
    enableSorting: true,
    cell: ({ row }) => {
      const event = row.original.events;
      return event?.name || 'Sin evento';
    }
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row, table }) {
      const lead = row.original;
      const { meta } = table.options;

      return (
        <div className="flex gap-2 justify-end">
          <button
            title="Editar"
            onClick={(e) => {
              e.stopPropagation();
              if (meta?.onEdit) meta.onEdit(lead);
            }}
            className="p-2 rounded-full bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 transition"
          >
            <FiEdit2 />
          </button>
          <button
            title="Borrar"
            onClick={(e) => {
              e.stopPropagation();
              if (meta?.onDelete) meta.onDelete(lead);
            }}
            className="p-2 rounded-full bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-300 transition"
          >
            <FiTrash2 />
          </button>
        </div>
      );
    },
  },
];

function DocumentsTable(props) {
  const { data: initialData, onLeadUpdated } = props;
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedLead, setSelectedLead] = React.useState(null);
  const [tableData, setTableData] = React.useState(initialData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  React.useEffect(() => {
    setTableData(initialData);
  }, [initialData]);

  const updateLocalData = (newLead) => {
    setTableData(prevData => {
      if (prevData.some(item => item.id === newLead.id)) {
        return prevData.map(item => item.id === newLead.id ? newLead : item);
      }
      return [newLead, ...prevData];
    });
  };

  const handleEdit = (lead) => {
    const leadToEdit = {
      ...lead,
      company_id: lead.company?.id || 1,
      company_name: lead.company?.name || '',
      event_id: lead.events?.id || 1,
      event_name: lead.events?.name || '',
      user_id: lead.users?.id || 1,
    };
    setSelectedLead(leadToEdit);
    setIsFormOpen(true);
  };

  const handleDelete = (lead) => {
    setLeadToDelete(lead);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!leadToDelete) return;
    try {
      await toast.promise(leadsService.delete(leadToDelete.id), {
        loading: 'Eliminando lead...',
        success: 'Lead eliminado correctamente',
        error: 'Error al eliminar el lead',
      });
      setTableData(prevData => prevData.filter(item => item.id !== leadToDelete.id));
      await onLeadUpdated();
    } catch (error) {
      console.error('Error al eliminar el lead:', error);
    }
    setDeleteConfirmOpen(false);
    setLeadToDelete(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedLead) {
        const updateData = {
          ...selectedLead,
          ...formData,
          company_name: formData.company_name,
          event_name: formData.event_name,
        };
        const updatedLead = await leadsService.update(selectedLead.id, updateData);
        updateLocalData(updatedLead);
        toast.success('Lead actualizado correctamente');
        setIsFormOpen(false);
        setSelectedLead(null);
        await onLeadUpdated();
      } else {
        const newLead = await leadsService.create(formData);
        setTableData(currentData => [newLead, ...currentData]);
        setIsFormOpen(false);
        if (onLeadUpdated) {
          await onLeadUpdated();
        }
        toast.success('Lead creado correctamente');
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
      toast.error(error.message || 'Error al procesar la operación');
    }
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    meta: {
      onEdit: handleEdit,
      onDelete: handleDelete,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar leads..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => {
              setSelectedLead(null);
              setIsFormOpen(true);
            }}
          >
            Nuevo Lead
          </Button>
        </div>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-zinc-100 dark:bg-zinc-800">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id}
                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="ml-2">
                          {
                            {
                              asc: '↑',
                              desc: '↓',
                            }[header.column.getIsSorted()] ?? '↕'
                          }
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`transition hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                    idx % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50 dark:bg-zinc-950"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} lead(s) mostrado(s).
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <LeadFormDialog
        lead={selectedLead}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedLead(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              ¿Eliminar lead?
            </h2>
            <p className="mb-6 text-zinc-700 dark:text-zinc-300">
              ¿Estás seguro de que deseas eliminar el lead <b>{leadToDelete?.name}</b>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentsTable;