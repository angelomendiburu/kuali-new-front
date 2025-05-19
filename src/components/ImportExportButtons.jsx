import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { FiDownload, FiUpload } from 'react-icons/fi';

export function ImportExportButtons({ onImport, data, filename = 'leads', disabled = false }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const mapHeaderToField = (header) => {
    header = header.toLowerCase().trim();
    // Mapeo de nombres de columnas comunes
    const headerMap = {
      // Nombres en español
      'nombre': 'name',
      'apellido': 'lastname',
      'correo': 'email',
      'correo electronico': 'email',
      'email': 'email',
      'teléfono': 'phone',
      'telefono': 'phone',
      'whatsapp': 'phone',
      'celular': 'phone',
      'móvil': 'phone',
      'movil': 'phone',
      'empresa': 'company_name',
      'compañía': 'company_name',
      'compania': 'company_name',
      'cargo': 'job_role',
      'puesto': 'job_role',
      'área': 'work_area',
      'area': 'work_area',
      'departamento': 'work_area',
      'linkedin': 'linkedin',
      'telefono-secundario': 'secondary_phone',
      'telefono secundario': 'secondary_phone',
      'teléfono secundario': 'secondary_phone'
    };
    return headerMap[header] || header;
  };

  const transformLeadData = (rawData) => {
    return rawData.map(row => {
      // Limpiar y transformar los datos
      const cleanRow = {};
      Object.entries(row).forEach(([key, value]) => {
        const mappedKey = mapHeaderToField(key);
        if (value) cleanRow[mappedKey] = value.toString().trim();
      });

      // Construir el nombre completo si viene separado
      let fullName = '';
      if (cleanRow.name) fullName = cleanRow.name;
      if (cleanRow.lastname) fullName += ' ' + cleanRow.lastname;
      if (!fullName && (cleanRow.nombre || cleanRow.apellido)) {
        fullName = [cleanRow.nombre, cleanRow.apellido].filter(Boolean).join(' ');
      }

      // Construir objeto de lead con campos requeridos y opcionales
      const lead = {
        name: fullName || cleanRow.name || 'Sin nombre',
        email: cleanRow.email || '',
        phone: cleanRow.phone || cleanRow.secondary_phone || '',
        company_name: cleanRow.company_name || '',
        event_name: cleanRow.event_name || '',
        linkedin: cleanRow.linkedin || '',
        job_role: cleanRow.job_role || '',
        work_area: cleanRow.work_area || '',
        status: 'pendiente',
        notes: `Importado desde CSV el ${new Date().toLocaleString()}`
      };

      // Validar datos mínimos requeridos
      if (!lead.name || (!lead.email && !lead.phone)) {
        throw new Error(`Datos incompletos: Se requiere nombre y al menos email o teléfono. Fila: ${JSON.stringify(cleanRow)}`);
      }

      return lead;
    }).filter(Boolean); // Eliminar posibles entradas null
  };

  const parseCSV = (text) => {
    // Detectar el separador (coma o punto y coma)
    const firstLine = text.split(/\r?\n/)[0];
    const separator = firstLine.includes(';') ? ';' : ',';
    
    // Partir por líneas y filtrar líneas vacías
    const rows = text.split(/\r?\n/).filter(row => row.trim());
    
    // Parsear headers
    const headers = rows[0].split(separator).map(h => h.trim().replace(/^["'](.*)["']$/, '$1'));

    // Validar que existan los headers mínimos necesarios
    const requiredHeaders = ['nombre', 'correo', 'telefono'];
    const foundHeaders = headers.map(h => h.toLowerCase());
    const missingHeaders = requiredHeaders.filter(h => 
      !foundHeaders.some(fh => fh.includes(h))
    );

    if (missingHeaders.length > 0) {
      throw new Error(`Faltan columnas requeridas: ${missingHeaders.join(', ')}`);
    }

    // Parsear el resto de las filas
    return rows.slice(1)
      .filter(row => row.trim())
      .map(row => {
        const values = row.split(separator).map(cell => {
          // Eliminar comillas y espacios al inicio/final
          return cell.trim().replace(/^["'](.*)["']$/, '$1');
        });
        
        const obj = {};
        headers.forEach((header, index) => {
          if (values[index]) {
            obj[header] = values[index];
          }
        });
        return obj;
      });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño del archivo (máx. 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error('El archivo es demasiado grande. Máximo 5MB.');
      event.target.value = '';
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!validTypes.includes(fileExtension)) {
      toast.error('Tipo de archivo no válido. Use CSV o Excel.');
      event.target.value = '';
      return;
    }

    toast.info('Procesando archivo...', {
      duration: 2000
    });

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        let jsonData;
        
        if (file.name.toLowerCase().endsWith('.csv')) {
          const text = e.target.result;
          jsonData = parseCSV(text);
        } else {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
        }

        if (!jsonData || jsonData.length === 0) {
          throw new Error('El archivo está vacío o no contiene datos válidos');
        }

        // Transformar los datos al formato esperado
        const transformedData = transformLeadData(jsonData);
        
        if (transformedData.length === 0) {
          throw new Error('No se encontraron datos válidos en el archivo');
        }

        toast.success(`Se procesarán ${transformedData.length} registros`);
        await onImport(transformedData);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        toast.error(error.message || 'Error al procesar el archivo. Verifica el formato.');
      }
      // Limpiar el input
      event.target.value = '';
    };

    reader.onerror = () => {
      toast.error('Error al leer el archivo');
      event.target.value = '';
    };

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Datos");
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(dataBlob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Archivo Excel exportado correctamente');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      toast.error('Error al exportar a Excel');
    }
  };

  const exportToCSV = () => {
    try {
      const headers = Object.keys(data[0]);      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('Archivo CSV exportado correctamente');
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      toast.error('Error al exportar a CSV');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />      <Button
        variant="outline"
        size="sm"
        onClick={handleImportClick}
        disabled={disabled}
      >
        <FiUpload className="mr-2 h-4 w-4" />
        {disabled ? 'Importando...' : 'Importar'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        disabled={disabled}
      >
        <FiDownload className="mr-2 h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToCSV}
        disabled={disabled}
      >
        <FiDownload className="mr-2 h-4 w-4" />
        CSV
      </Button>
    </div>
  );
}
