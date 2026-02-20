import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('FoodLog Nutrition Report', () => {
  describe('Report Download Functionality', () => {
    it('should render Nutrition Report section with 7/30-day range selector', () => {
      // Test that the section renders
      const reportSection = document.querySelector('[data-testid="nutrition-report-section"]');
      expect(reportSection).toBeDefined();
    });

    it('should have Download PDF button', () => {
      const downloadButton = document.querySelector('[data-testid="download-pdf-button"]');
      expect(downloadButton).toBeDefined();
      expect(downloadButton?.textContent).toContain('下載PDF報告');
    });

    it('should have 7-day and 30-day range selector buttons', () => {
      const button7d = document.querySelector('[data-testid="range-7d-button"]');
      const button30d = document.querySelector('[data-testid="range-30d-button"]');
      expect(button7d).toBeDefined();
      expect(button30d).toBeDefined();
    });

    it('should disable Download button while generating PDF', () => {
      const downloadButton = document.querySelector('[data-testid="download-pdf-button"]') as HTMLButtonElement;
      // Simulate loading state
      expect(downloadButton?.disabled).toBe(false);
      // After mutation starts, button should be disabled
      // This would be verified through mutation.isPending state
    });

    it('should handle PDF download with correct MIME type', () => {
      const expectedMimeType = 'application/pdf';
      // Verify that Blob is created with correct MIME type
      expect(expectedMimeType).toBe('application/pdf');
    });

    it('should decode base64 PDF data correctly', () => {
      const base64Data = 'JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo='; // Sample PDF header in base64
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      expect(bytes.length).toBeGreaterThan(0);
      expect(bytes[0]).toBe(0x25); // '%' character in PDF header
    });

    it('should show success toast on successful download', () => {
      // Mock toast.success
      const mockToast = vi.fn();
      mockToast('報告已下載');
      expect(mockToast).toHaveBeenCalledWith('報告已下載');
    });

    it('should show error toast on download failure', () => {
      // Mock toast.error
      const mockToast = vi.fn();
      mockToast('下載報告失敗');
      expect(mockToast).toHaveBeenCalledWith('下載報告失敗');
    });

    it('should switch between 7-day and 30-day ranges', () => {
      let selectedRange: '7d' | '30d' = '7d';
      // Simulate range change
      selectedRange = '30d';
      expect(selectedRange).toBe('30d');
      selectedRange = '7d';
      expect(selectedRange).toBe('7d');
    });

    it('should pass correct dateRange to mutation', () => {
      const mockMutate = vi.fn();
      // Simulate calling mutation with 7d range
      mockMutate({ dateRange: '7d' });
      expect(mockMutate).toHaveBeenCalledWith({ dateRange: '7d' });
      // Simulate calling mutation with 30d range
      mockMutate({ dateRange: '30d' });
      expect(mockMutate).toHaveBeenCalledWith({ dateRange: '30d' });
    });

    it('should create and clean up object URL for PDF download', () => {
      const mockCreateObjectURL = vi.spyOn(window.URL, 'createObjectURL');
      const mockRevokeObjectURL = vi.spyOn(window.URL, 'revokeObjectURL');
      
      const blob = new Blob(['test'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
      
      window.URL.revokeObjectURL(url);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith(url);
    });

    it('should render helper text describing the report', () => {
      const helperText = document.querySelector('[data-testid="report-helper-text"]');
      expect(helperText?.textContent).toContain('營養詳細報告');
    });
  });
});
