import puppeteer from 'puppeteer';
import { jsPDF } from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

class PDFService {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Generate PDF from HTML content
  async generateFromHTML(htmlContent, options = {}) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();
    
    try {
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        ...options
      });
      
      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  // Generate PDF from URL
  async generateFromURL(url, options = {}) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        ...options
      });
      
      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  // Generate chat conversation PDF
  async generateChatPDF(chatData, options = {}) {
    const htmlContent = this.createChatHTML(chatData, options);
    return await this.generateFromHTML(htmlContent, options);
  }

  // Create HTML template for chat conversation
  createChatHTML(chatData, options = {}) {
    const { title = 'Chat Conversation', participants = [], messages = [] } = chatData;
    
    const css = `
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 10px 0;
        }
        .participants {
          font-size: 14px;
          opacity: 0.9;
        }
        .message {
          margin: 10px 0;
          padding: 15px;
          border-radius: 12px;
          max-width: 80%;
          word-wrap: break-word;
        }
        .message.sent {
          background-color: #007bff;
          color: white;
          margin-left: auto;
        }
        .message.received {
          background-color: #e9ecef;
          color: #333;
          margin-right: auto;
        }
        .message-header {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 5px;
        }
        .message-text {
          font-size: 14px;
          line-height: 1.4;
        }
        .timestamp {
          font-size: 11px;
          opacity: 0.7;
          margin-top: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          border-top: 1px solid #dee2e6;
          color: #6c757d;
          font-size: 12px;
        }
      </style>
    `;

    const messagesHTML = messages.map(msg => `
      <div class="message ${msg.sender === 'me' ? 'sent' : 'received'}">
        <div class="message-header">${msg.senderName || msg.sender}</div>
        <div class="message-text">${msg.text}</div>
        <div class="timestamp">${msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}</div>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          ${css}
        </head>
        <body>
          <div class="header">
            <div class="title">${title}</div>
            <div class="participants">Participants: ${participants.join(', ')}</div>
          </div>
          <div class="messages">
            ${messagesHTML}
          </div>
          <div class="footer">
            Generated on ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `;
  }

  // Generate simple text PDF using pdf-lib
  async generateTextPDF(text, options = {}) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont('Helvetica');
    const fontSize = options.fontSize || 12;
    const lineHeight = fontSize * 1.2;
    
    const lines = text.split('\n');
    let y = height - 50;
    
    for (const line of lines) {
      if (y < 50) {
        const newPage = pdfDoc.addPage();
        y = newPage.getSize().height - 50;
        newPage.drawText(line, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0)
        });
      } else {
        page.drawText(line, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0)
        });
      }
      y -= lineHeight;
    }
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  // Generate report PDF
  async generateReportPDF(reportData, options = {}) {
    const htmlContent = this.createReportHTML(reportData, options);
    return await this.generateFromHTML(htmlContent, options);
  }

  createReportHTML(reportData, options = {}) {
    const { title = 'Report', data = [], charts = [] } = reportData;
    
    const css = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; color: #333; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #f8f9fa; font-weight: bold; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #495057; }
      </style>
    `;

    const dataHTML = data.length > 0 ? `
      <div class="section">
        <div class="section-title">Data Summary</div>
        <table class="table">
          <thead>
            <tr>
              ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          ${css}
        </head>
        <body>
          <div class="header">
            <div class="title">${title}</div>
            <div>Generated on ${new Date().toLocaleString()}</div>
          </div>
          ${dataHTML}
        </body>
      </html>
    `;
  }
}

export default new PDFService();