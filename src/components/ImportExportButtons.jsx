import React from 'react';
import { Button } from './ui/button';
import { RiDownloadLine, RiUploadLine } from 'react-icons/ri';
import ExcelJS from 'exceljs';
import { toast } from 'sonner';

export function ImportExportButtons({ onImport, data, filename = 'download' }) {
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      
      const worksheet = workbook.getWorksheet(1);
      const jsonData = [];

      // Get headers from first row
      const headers = worksheet.getRow(1).values.slice(1); // Remove empty first cell

      // Iterate through rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        
        const rowData = {};
        row.values.slice(1).forEach((value, index) => {
          rowData[headers[index]] = value;
        });
        jsonData.push(rowData);
      });

      await onImport(jsonData);
      toast.success('Datos importados correctamente');
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error('Error al importar el archivo');
    }
  };

  const handleExport = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data');

      // Add headers
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        // Add data
        data.forEach(item => {
          worksheet.addRow(Object.values(item));
        });
      }

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Create blob and download
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Archivo exportado correctamente');
    } catch (error) {
      console.error('Error exporting file:', error);
      toast.error('Error al exportar el archivo');
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <RiDownloadLine className="w-4 h-4" />
        Exportar
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => document.getElementById('file-import').click()}
      >
        <RiUploadLine className="w-4 h-4" />
        Importar
        <input
          id="file-import"
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleImport}
        />
      </Button>
    </div>
  );
}
