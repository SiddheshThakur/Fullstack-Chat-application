import express from 'express';
import pdfService from '../services/pdfService.js';

const router = express.Router();

// Generate PDF from HTML content
router.post('/generate-html', async (req, res) => {
  try {
    const { htmlContent, options = {} } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: 'HTML content is required' });
    }
    
    const pdfBuffer = await pdfService.generateFromHTML(htmlContent, options);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="document.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Generate PDF from URL
router.post('/generate-url', async (req, res) => {
  try {
    const { url, options = {} } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const pdfBuffer = await pdfService.generateFromURL(url, options);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="webpage.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF from URL' });
  }
});

// Generate chat conversation PDF
router.post('/generate-chat', async (req, res) => {
  try {
    const { chatData, options = {} } = req.body;
    
    if (!chatData || !chatData.messages) {
      return res.status(400).json({ error: 'Chat data with messages is required' });
    }
    
    const pdfBuffer = await pdfService.generateChatPDF(chatData, options);
    
    const filename = `chat_${chatData.title || 'conversation'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Chat PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate chat PDF' });
  }
});

// Generate simple text PDF
router.post('/generate-text', async (req, res) => {
  try {
    const { text, options = {} } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }
    
    const pdfBuffer = await pdfService.generateTextPDF(text, options);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="text_document.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Text PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate text PDF' });
  }
});

// Generate report PDF
router.post('/generate-report', async (req, res) => {
  try {
    const { reportData, options = {} } = req.body;
    
    if (!reportData) {
      return res.status(400).json({ error: 'Report data is required' });
    }
    
    const pdfBuffer = await pdfService.generateReportPDF(reportData, options);
    
    const filename = `report_${reportData.title || 'document'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Report PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate report PDF' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'PDF service is running' });
});

export default router;