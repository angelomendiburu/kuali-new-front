import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadsPage from './LeadsPage'; // Adjust path as necessary
import { leadsService } from '../services/leadsService';
import { BulkWhatsAppDialog } from '../components/BulkWhatsAppDialog'; // Adjust path

// Mock services and components
vi.mock('../services/leadsService', () => ({
  leadsService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    sendBulkWhatsAppMessages: vi.fn(),
  }
}));

vi.mock('../components/BulkWhatsAppDialog', () => ({
  BulkWhatsAppDialog: vi.fn(({ isOpen, onClose, onSubmit, selectedLeads }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-bulk-whatsapp-dialog">
        <p>Selected Leads: {selectedLeads.length}</p>
        <textarea data-testid="mock-message-textarea" defaultValue="Test message from mock"></textarea>
        <button onClick={() => onSubmit('Test message from mock', selectedLeads)}>Mock Send</button>
        <button onClick={onClose}>Mock Cancel</button>
      </div>
    );
  })
}));

vi.mock('../components/ImportExportButtons', () => ({
  ImportExportButtons: vi.fn(() => <div data-testid="mock-import-export-buttons"></div>)
}));

vi.mock('../components/documents-table', () => ({
  __esModule: true, // This is important for modules with default exports when using vi.mock
  default: vi.fn(() => <div data-testid="mock-documents-table"></div>)
}));


// Mock sonner
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};
vi.mock('sonner', () => ({
  toast: mockToast
}));

const mockLeadsData = [
  { id: 1, name: 'Alice Wonderland', phone: '111222333', created_at: new Date().toISOString(), company_name: 'Wonderland Inc.' },
  { id: 2, name: 'Bob The Builder', phone: '444555666', created_at: new Date().toISOString(), company_name: 'Builders Co.' },
  { id: 3, name: 'Charlie Brown', phone: '777888999', created_at: new Date().toISOString(), company_name: 'Peanuts LLC' },
];

describe('LeadsPage - Bulk WhatsApp Functionality', () => {
  beforeEach(() => {
    leadsService.getAll.mockResolvedValue(mockLeadsData);
    leadsService.sendBulkWhatsAppMessages.mockReset(); // Reset this mock specifically
    mockToast.success.mockClear();
    mockToast.error.mockClear();
    mockToast.info.mockClear();
    BulkWhatsAppDialog.mockClear(); // Clear mock calls for the dialog
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the "Enviar WhatsApp Masivo" button', async () => {
    render(<LeadsPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Enviar WhatsApp Masivo' })).toBeInTheDocument();
    });
  });

  it('opens the BulkWhatsAppDialog with placeholder leads when "Enviar WhatsApp Masivo" is clicked', async () => {
    render(<LeadsPage />);
    await waitFor(() => expect(leadsService.getAll).toHaveBeenCalled()); // Ensure leads are loaded

    const bulkWhatsAppButton = screen.getByRole('button', { name: 'Enviar WhatsApp Masivo' });
    await userEvent.click(bulkWhatsAppButton);

    // Check if BulkWhatsAppDialog was called with isOpen = true
    // The mock BulkWhatsAppDialog will render if isOpen is true
    await waitFor(() => {
        expect(screen.getByTestId('mock-bulk-whatsapp-dialog')).toBeInTheDocument();
    });
    
    // Verify that the dialog mock was called with the correct props (especially selectedLeads)
    // We expect the first 2 leads from mockLeadsData
    const expectedSelectedLeads = mockLeadsData.slice(0, 2);
    expect(BulkWhatsAppDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        selectedLeads: expectedSelectedLeads,
      }),
      expect.anything() // For the second argument (context for class components, or {} for functional components)
    );
  });

  it('shows a toast if no leads are available when "Enviar WhatsApp Masivo" is clicked', async () => {
    leadsService.getAll.mockResolvedValueOnce([]); // No leads
    render(<LeadsPage />);
    await waitFor(() => expect(leadsService.getAll).toHaveBeenCalled());

    const bulkWhatsAppButton = screen.getByRole('button', { name: 'Enviar WhatsApp Masivo' });
    await userEvent.click(bulkWhatsAppButton);

    expect(mockToast.info).toHaveBeenCalledWith("No hay leads para seleccionar para WhatsApp masivo.");
    expect(screen.queryByTestId('mock-bulk-whatsapp-dialog')).not.toBeInTheDocument();
  });
  
  it('calls leadsService.sendBulkWhatsAppMessages when dialog submits and shows success toast', async () => {
    leadsService.sendBulkWhatsAppMessages.mockResolvedValue({ message: 'Backend process started' });
    render(<LeadsPage />);
    await waitFor(() => expect(leadsService.getAll).toHaveBeenCalled());

    const bulkWhatsAppButton = screen.getByRole('button', { name: 'Enviar WhatsApp Masivo' });
    await userEvent.click(bulkWhatsAppButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-bulk-whatsapp-dialog')).toBeInTheDocument();
    });

    // Simulate submitting from the (mocked) dialog
    // Our mock dialog has a button that calls onSubmit directly
    const mockSendButtonInDialog = screen.getByRole('button', { name: 'Mock Send' });
    await userEvent.click(mockSendButtonInDialog);

    const expectedLeadIds = mockLeadsData.slice(0, 2).map(lead => lead.id);
    expect(leadsService.sendBulkWhatsAppMessages).toHaveBeenCalledTimes(1);
    expect(leadsService.sendBulkWhatsAppMessages).toHaveBeenCalledWith('Test message from mock', expectedLeadIds);
    
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Backend process started');
    });
    expect(screen.queryByTestId('mock-bulk-whatsapp-dialog')).not.toBeInTheDocument(); // Dialog should close
  });

  it('shows error toast if leadsService.sendBulkWhatsAppMessages fails', async () => {
    const errorMessage = 'Failed to send bulk messages';
    leadsService.sendBulkWhatsAppMessages.mockRejectedValue(errorMessage);
    render(<LeadsPage />);
    await waitFor(() => expect(leadsService.getAll).toHaveBeenCalled());

    const bulkWhatsAppButton = screen.getByRole('button', { name: 'Enviar WhatsApp Masivo' });
    await userEvent.click(bulkWhatsAppButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-bulk-whatsapp-dialog')).toBeInTheDocument();
    });
    
    const mockSendButtonInDialog = screen.getByRole('button', { name: 'Mock Send' });
    await userEvent.click(mockSendButtonInDialog);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
    });
    expect(screen.queryByTestId('mock-bulk-whatsapp-dialog')).not.toBeInTheDocument(); // Dialog should close
  });
  
  it('closes the dialog when the mock cancel button is clicked', async () => {
    render(<LeadsPage />);
    await waitFor(() => expect(leadsService.getAll).toHaveBeenCalled());

    const bulkWhatsAppButton = screen.getByRole('button', { name: 'Enviar WhatsApp Masivo' });
    await userEvent.click(bulkWhatsAppButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-bulk-whatsapp-dialog')).toBeInTheDocument();
    });

    const mockCancelButtonInDialog = screen.getByRole('button', { name: 'Mock Cancel' });
    await userEvent.click(mockCancelButtonInDialog);

    await waitFor(() => {
      expect(screen.queryByTestId('mock-bulk-whatsapp-dialog')).not.toBeInTheDocument();
    });
  });

});
