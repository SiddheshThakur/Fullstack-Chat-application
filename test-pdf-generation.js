#!/usr/bin/env node
/**
 * PDF Generation Test Script
 * 
 * This script demonstrates various PDF generation capabilities
 * Run with: node test-pdf-generation.js
 */

import { jsPDF } from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Test data
const sampleChatData = {
  title: 'Team Standup Meeting',
  participants: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
  messages: [
    {
      sender: 'Alice',
      senderName: 'Alice Johnson',
      text: 'Good morning everyone! Ready for our daily standup?',
      timestamp: new Date('2024-01-15T09:00:00Z').toISOString()
    },
    {
      sender: 'Bob',
      senderName: 'Bob Smith',
      text: 'Morning Alice! Yes, I have some updates on the authentication module.',
      timestamp: new Date('2024-01-15T09:01:00Z').toISOString()
    },
    {
      sender: 'Charlie',
      senderName: 'Charlie Brown',
      text: 'Hey team! I finished the UI components yesterday and started on the API integration.',
      timestamp: new Date('2024-01-15T09:02:00Z').toISOString()
    },
    {
      sender: 'Alice',
      senderName: 'Alice Johnson',
      text: 'Great work everyone! Bob, can you share more details about the auth module?',
      timestamp: new Date('2024-01-15T09:03:00Z').toISOString()
    },
    {
      sender: 'Bob',
      senderName: 'Bob Smith',
      text: 'Sure! I implemented JWT token management and OAuth integration. The tests are passing and it\'s ready for review.',
      timestamp: new Date('2024-01-15T09:04:00Z').toISOString()
    }
  ]
};

// Utility functions
function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function ensureOutputDir() {
  const outputDir = './pdf_output';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

// 1. Generate Chat PDF using jsPDF
async function generateChatPDF(chatData) {
  console.log('📄 Generating Chat PDF...');
  
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
  pdf.text(chatData.title, margin, yPosition);
  yPosition += 10;

  // Participants
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Participants: ${chatData.participants.join(', ')}`, margin, yPosition);
  yPosition += 10;

  // Date
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Messages
  for (const message of chatData.messages) {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }

    // Message header
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const senderText = `${message.senderName} - ${formatTimestamp(message.timestamp)}`;
    pdf.text(senderText, margin, yPosition);
    yPosition += 6;

    // Message content
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const splitText = pdf.splitTextToSize(message.text, maxWidth);
    pdf.text(splitText, margin + 5, yPosition);
    yPosition += splitText.length * 5 + 8;
  }

  const outputDir = ensureOutputDir();
  const filename = path.join(outputDir, 'chat_conversation.pdf');
  pdf.save(filename);
  
  console.log(`✅ Chat PDF saved to: ${filename}`);
  return filename;
}

// 2. Generate Text PDF using pdf-lib
async function generateTextPDF() {
  console.log('📄 Generating Text PDF...');
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont('Helvetica');
  const boldFont = await pdfDoc.embedFont('Helvetica-Bold');
  
  let yPosition = height - 50;
  
  // Title
  page.drawText('Sample Text Document', {
    x: 50,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  yPosition -= 40;
  
  // Content
  const content = `This is a sample text document generated using pdf-lib.

It demonstrates:
• Clean text formatting
• Multiple paragraphs
• Professional appearance
• Programmatic PDF creation

Key Features:
- High-quality text rendering
- Precise layout control
- Unicode support
- Embedded fonts

This document was generated on ${new Date().toLocaleDateString()} as part of the PDF generation system demonstration.

The system supports various types of PDF generation including:
1. Chat conversation exports
2. Text documents
3. Reports with data tables
4. HTML to PDF conversion
5. Custom formatted documents

For more information, see the PDF_GENERATION_GUIDE.md file.`;

  const lines = content.split('\n');
  for (const line of lines) {
    if (yPosition < 50) {
      const newPage = pdfDoc.addPage();
      yPosition = newPage.getSize().height - 50;
      newPage.drawText(line, {
        x: 50,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0)
      });
    } else {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0)
      });
    }
    yPosition -= 18;
  }
  
  const pdfBytes = await pdfDoc.save();
  const outputDir = ensureOutputDir();
  const filename = path.join(outputDir, 'text_document.pdf');
  fs.writeFileSync(filename, pdfBytes);
  
  console.log(`✅ Text PDF saved to: ${filename}`);
  return filename;
}

// 3. Generate Report PDF
async function generateReportPDF() {
  console.log('📄 Generating Report PDF...');
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Monthly Performance Report', margin, yPosition);
  yPosition += 15;

  // Subtitle
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 20;

  // Sample data
  const reportData = [
    { name: 'Alice Johnson', tasks: 15, completed: 14, score: 93 },
    { name: 'Bob Smith', tasks: 12, completed: 11, score: 92 },
    { name: 'Charlie Brown', tasks: 18, completed: 16, score: 89 },
    { name: 'Diana Prince', tasks: 20, completed: 19, score: 95 },
    { name: 'Eve Wilson', tasks: 14, completed: 13, score: 93 }
  ];

  // Table headers
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Name', margin, yPosition);
  pdf.text('Tasks', margin + 60, yPosition);
  pdf.text('Completed', margin + 80, yPosition);
  pdf.text('Score', margin + 110, yPosition);
  yPosition += 8;

  // Table data
  pdf.setFont('helvetica', 'normal');
  reportData.forEach(row => {
    pdf.text(row.name, margin, yPosition);
    pdf.text(row.tasks.toString(), margin + 60, yPosition);
    pdf.text(row.completed.toString(), margin + 80, yPosition);
    pdf.text(`${row.score}%`, margin + 110, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Summary
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Summary', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const avgScore = reportData.reduce((sum, row) => sum + row.score, 0) / reportData.length;
  pdf.text(`Average Score: ${avgScore.toFixed(1)}%`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Total Tasks: ${reportData.reduce((sum, row) => sum + row.tasks, 0)}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Completed Tasks: ${reportData.reduce((sum, row) => sum + row.completed, 0)}`, margin, yPosition);

  const outputDir = ensureOutputDir();
  const filename = path.join(outputDir, 'performance_report.pdf');
  pdf.save(filename);
  
  console.log(`✅ Report PDF saved to: ${filename}`);
  return filename;
}

// 4. Generate HTML-style PDF
async function generateStyledPDF() {
  console.log('📄 Generating Styled PDF...');
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  // Header background (simulated)
  pdf.setFillColor(0, 123, 255); // Blue color
  pdf.rect(0, 0, pageWidth, 40, 'F');

  // Header text
  pdf.setTextColor(255, 255, 255); // White text
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PDF Generation System', margin, 25);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Professional Document Generation', margin, 32);

  // Reset text color
  pdf.setTextColor(0, 0, 0);
  let yPosition = 60;

  // Content sections
  const sections = [
    {
      title: 'Overview',
      content: 'This document demonstrates the PDF generation capabilities of our system. It includes styled headers, formatted content, and professional layout.'
    },
    {
      title: 'Features',
      content: 'The system supports multiple PDF generation methods including client-side generation with jsPDF, server-side generation with Puppeteer, and custom styling options.'
    },
    {
      title: 'Use Cases',
      content: 'Perfect for chat exports, reports, invoices, documentation, and any other document generation needs in your application.'
    }
  ];

  sections.forEach(section => {
    // Section title
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(section.title, margin, yPosition);
    yPosition += 8;

    // Section content
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const splitText = pdf.splitTextToSize(section.content, pageWidth - 2 * margin);
    pdf.text(splitText, margin, yPosition);
    yPosition += splitText.length * 5 + 10;
  });

  // Footer
  pdf.setFillColor(240, 240, 240); // Light gray
  pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.text('Generated by PDF Generation System', margin, pageHeight - 10);

  const outputDir = ensureOutputDir();
  const filename = path.join(outputDir, 'styled_document.pdf');
  pdf.save(filename);
  
  console.log(`✅ Styled PDF saved to: ${filename}`);
  return filename;
}

// Main execution
async function main() {
  console.log('🚀 Starting PDF Generation Tests...\n');
  
  try {
    // Ensure output directory exists
    ensureOutputDir();
    
    // Generate different types of PDFs
    await generateChatPDF(sampleChatData);
    await generateTextPDF();
    await generateReportPDF();
    await generateStyledPDF();
    
    console.log('\n✨ All PDF generation tests completed successfully!');
    console.log('📁 Check the ./pdf_output directory for generated PDFs');
    
  } catch (error) {
    console.error('❌ Error during PDF generation:', error);
    process.exit(1);
  }
}

// Run the tests
main();