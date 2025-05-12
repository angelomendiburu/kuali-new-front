import React from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
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
    cell: ({ row }) => row.original.email || ''
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    enableSorting: true,
    cell: ({ row }) => row.original.phone || ''
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (meta?.onEdit) meta.onEdit(lead);
            }}
          >
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              if (meta?.onDelete) meta.onDelete(lead);
            }}
          >
            Eliminar
          </Button>
        </div>
      );
    },
  },
];

export function DocumentsTable({ data: initialData, onLeadUpdated }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedLead, setSelectedLead] = React.useState(null);
  const [tableData, setTableData] = React.useState(initialData);

  // Mantener los datos de la tabla actualizados cuando cambian los datos iniciales
  React.useEffect(() => {
    setTableData(initialData);
  }, [initialData]);

  const updateLocalData = (newLead) => {
    setTableData(prevData => {
      // Si el lead ya existe, actualizarlo
      if (prevData.some(item => item.id === newLead.id)) {
        return prevData.map(item => item.id === newLead.id ? newLead : item);
      }
      // Si es un nuevo lead, agregarlo al inicio
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

  const handleDelete = async (lead) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este lead?')) {
      try {
        await toast.promise(leadsService.delete(lead.id), {
          loading: 'Eliminando lead...',
          success: 'Lead eliminado correctamente',
          error: 'Error al eliminar el lead',
        });
        // Actualizar datos localmente
        setTableData(prevData => prevData.filter(item => item.id !== lead.id));
        // Notificar al componente padre para actualizar métricas
        await onLeadUpdated();
      } catch (error) {
        console.error('Error al eliminar el lead:', error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedLead) {
        // Asegurarnos de incluir los nombres al actualizar
        const updateData = {
          ...selectedLead,
          ...formData,
          company_name: formData.company_name,
          event_name: formData.event_name,
        };

        console.log('Enviando actualización:', updateData);
        const updatedLead = await leadsService.update(selectedLead.id, updateData);
        
        // Actualizar datos localmente con el lead actualizado
        updateLocalData(updatedLead);
        toast.success('Lead actualizado correctamente');
        setIsFormOpen(false);
        setSelectedLead(null);
        
        // Notificar al componente padre para actualizar métricas
        await onLeadUpdated();
      } else {
        const newLead = await leadsService.create(formData);
        
        // Actualizar los datos locales inmediatamente
        setTableData(currentData => [newLead, ...currentData]);
        setIsFormOpen(false);
        
        // Notificar para actualizar métricas
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 cursor-pointer"
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
    </div>
  );
}
