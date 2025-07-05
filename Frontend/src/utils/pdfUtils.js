import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFDocument, rgb } from 'pdf-lib';

// Client-side PDF generation utilities
export class PDFUtils {
  
  // Generate PDF from HTML element
  static async generateFromElement(element, options = {}) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        ...options.canvasOptions
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      return pdf;
    } catch (error) {
      console.error('Error generating PDF from element:', error);
      throw error;
    }
  }
  
  // Generate chat conversation PDF
  static async generateChatPDF(chatData, options = {}) {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      let yPosition = margin;
      
      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(chatData.title || 'Chat Conversation', margin, yPosition);
      yPosition += 10;
      
      // Participants
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Participants: ${chatData.participants?.join(', ') || 'N/A'}`, margin, yPosition);
      yPosition += 10;
      
      // Date
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 15;
      
      // Messages
      if (chatData.messages && chatData.messages.length > 0) {
        for (const message of chatData.messages) {
          // Check if we need a new page
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = margin;
          }
          
          // Message header
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          const senderText = `${message.senderName || message.sender} - ${message.timestamp ? new Date(message.timestamp).toLocaleString() : ''}`;
          pdf.text(senderText, margin, yPosition);
          yPosition += 6;
          
          // Message content
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          const splitText = pdf.splitTextToSize(message.text, maxWidth);
          pdf.text(splitText, margin + 5, yPosition);
          yPosition += splitText.length * 5 + 5;
        }
      }
      
      return pdf;
    } catch (error) {
      console.error('Error generating chat PDF:', error);
      throw error;
    }
  }
  
  // Generate simple text PDF
  static async generateTextPDF(text, options = {}) {
    try {
      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      let yPosition = margin;
      
      // Title if provided
      if (options.title) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(options.title, margin, yPosition);
        yPosition += 10;
      }
      
      // Content
      pdf.setFontSize(options.fontSize || 12);
      pdf.setFont('helvetica', 'normal');
      
      const lines = text.split('\n');
      for (const line of lines) {
        const splitText = pdf.splitTextToSize(line, maxWidth);
        
        // Check if we need a new page
        if (yPosition + splitText.length * 5 > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.text(splitText, margin, yPosition);
        yPosition += splitText.length * 5 + 2;
      }
      
      return pdf;
    } catch (error) {
      console.error('Error generating text PDF:', error);
      throw error;
    }
  }
  
  // Download PDF
  static downloadPDF(pdf, filename = 'document.pdf') {
    pdf.save(filename);
  }
  
  // Get PDF as blob
  static getPDFBlob(pdf) {
    return pdf.output('blob');
  }
  
  // Get PDF as base64
  static getPDFBase64(pdf) {
    return pdf.output('datauristring');
  }
}

// API utilities for server-side PDF generation
export class PDFAPIUtils {
  static baseURL = '/api/pdf';
  
  // Generate PDF from HTML via API
  static async generateFromHTML(htmlContent, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/generate-html`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent, options })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error generating PDF from HTML:', error);
      throw error;
    }
  }
  
  // Generate PDF from URL via API
  static async generateFromURL(url, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/generate-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, options })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error generating PDF from URL:', error);
      throw error;
    }
  }
  
  // Generate chat PDF via API
  static async generateChatPDF(chatData, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/generate-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatData, options })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error generating chat PDF:', error);
      throw error;
    }
  }
  
  // Generate text PDF via API
  static async generateTextPDF(text, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/generate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, options })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error generating text PDF:', error);
      throw error;
    }
  }
  
  // Generate report PDF via API
  static async generateReportPDF(reportData, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportData, options })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error generating report PDF:', error);
      throw error;
    }
  }
  
  // Download blob as file
  static downloadBlob(blob, filename = 'document.pdf') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// React hook for PDF generation
export const usePDFGeneration = () => {
  const generateAndDownloadChatPDF = async (chatData, useServer = false) => {
    try {
      if (useServer) {
        const blob = await PDFAPIUtils.generateChatPDF(chatData);
        const filename = `chat_${chatData.title || 'conversation'}_${new Date().toISOString().split('T')[0]}.pdf`;
        PDFAPIUtils.downloadBlob(blob, filename);
      } else {
        const pdf = await PDFUtils.generateChatPDF(chatData);
        const filename = `chat_${chatData.title || 'conversation'}_${new Date().toISOString().split('T')[0]}.pdf`;
        PDFUtils.downloadPDF(pdf, filename);
      }
    } catch (error) {
      console.error('Error generating chat PDF:', error);
      throw error;
    }
  };
  
  const generateAndDownloadTextPDF = async (text, options = {}, useServer = false) => {
    try {
      if (useServer) {
        const blob = await PDFAPIUtils.generateTextPDF(text, options);
        const filename = options.filename || 'text_document.pdf';
        PDFAPIUtils.downloadBlob(blob, filename);
      } else {
        const pdf = await PDFUtils.generateTextPDF(text, options);
        const filename = options.filename || 'text_document.pdf';
        PDFUtils.downloadPDF(pdf, filename);
      }
    } catch (error) {
      console.error('Error generating text PDF:', error);
      throw error;
    }
  };
  
  const generateAndDownloadElementPDF = async (element, options = {}) => {
    try {
      const pdf = await PDFUtils.generateFromElement(element, options);
      const filename = options.filename || 'element_capture.pdf';
      PDFUtils.downloadPDF(pdf, filename);
    } catch (error) {
      console.error('Error generating element PDF:', error);
      throw error;
    }
  };
  
  return {
    generateAndDownloadChatPDF,
    generateAndDownloadTextPDF,
    generateAndDownloadElementPDF
  };
};