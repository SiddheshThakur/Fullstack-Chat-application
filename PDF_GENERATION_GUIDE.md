# PDF Generation System

A comprehensive PDF generation solution for your chat application with both client-side and server-side capabilities.

## 🚀 Features

- **Client-side PDF Generation**: Fast, offline-capable PDF creation using jsPDF
- **Server-side PDF Generation**: High-quality PDFs with full CSS support using Puppeteer
- **Chat Conversation PDFs**: Beautifully formatted chat exports
- **HTML to PDF Conversion**: Convert any HTML content to PDF
- **Screenshot to PDF**: Capture DOM elements as PDF
- **Text to PDF**: Simple text document generation
- **Report Generation**: Structured data reports

## 📦 Installation

### Backend Dependencies

```bash
cd Backend
npm install puppeteer jspdf html-pdf pdf-lib
```

### Frontend Dependencies

```bash
cd Frontend
npm install jspdf html2canvas pdf-lib
```

## 🛠️ Setup

### 1. Backend Setup

Add the PDF routes to your Express app:

```javascript
// In your main server file (e.g., src/index.js)
import pdfRoutes from './routes/pdfRoutes.js';

app.use('/api/pdf', pdfRoutes);
```

### 2. Frontend Setup

Import the PDF utilities in your React components:

```javascript
import { usePDFGeneration, PDFUtils, PDFAPIUtils } from './utils/pdfUtils';
```

## 🔧 API Endpoints

### Server-side PDF Generation

#### 1. Generate PDF from HTML
```
POST /api/pdf/generate-html
Content-Type: application/json

{
  "htmlContent": "<html><body><h1>Hello World</h1></body></html>",
  "options": {
    "format": "A4",
    "orientation": "portrait"
  }
}
```

#### 2. Generate PDF from URL
```
POST /api/pdf/generate-url
Content-Type: application/json

{
  "url": "https://example.com",
  "options": {
    "format": "A4",
    "printBackground": true
  }
}
```

#### 3. Generate Chat PDF
```
POST /api/pdf/generate-chat
Content-Type: application/json

{
  "chatData": {
    "title": "Team Meeting",
    "participants": ["Alice", "Bob", "Charlie"],
    "messages": [
      {
        "sender": "Alice",
        "senderName": "Alice Johnson",
        "text": "Hello everyone!",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "options": {
    "format": "A4"
  }
}
```

#### 4. Generate Text PDF
```
POST /api/pdf/generate-text
Content-Type: application/json

{
  "text": "This is a sample text document...",
  "options": {
    "fontSize": 12,
    "title": "My Document"
  }
}
```

#### 5. Generate Report PDF
```
POST /api/pdf/generate-report
Content-Type: application/json

{
  "reportData": {
    "title": "Monthly Report",
    "data": [
      {"name": "Alice", "score": 95},
      {"name": "Bob", "score": 87}
    ]
  },
  "options": {
    "format": "A4"
  }
}
```

## 💻 Client-side Usage

### Using the React Hook

```javascript
import React from 'react';
import { usePDFGeneration } from '../utils/pdfUtils';

const MyComponent = () => {
  const { generateAndDownloadChatPDF } = usePDFGeneration();

  const handleExportChat = async () => {
    const chatData = {
      title: 'My Chat',
      participants: ['User1', 'User2'],
      messages: [
        {
          sender: 'User1',
          text: 'Hello!',
          timestamp: new Date().toISOString()
        }
      ]
    };

    try {
      await generateAndDownloadChatPDF(chatData, false); // false = client-side
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <button onClick={handleExportChat}>
      Export Chat as PDF
    </button>
  );
};
```

### Using PDF Utils Directly

```javascript
import { PDFUtils } from '../utils/pdfUtils';

// Generate chat PDF
const pdf = await PDFUtils.generateChatPDF(chatData);
PDFUtils.downloadPDF(pdf, 'my-chat.pdf');

// Generate text PDF
const textPdf = await PDFUtils.generateTextPDF('Hello World', {
  title: 'My Document',
  fontSize: 14
});
PDFUtils.downloadPDF(textPdf, 'my-document.pdf');

// Generate PDF from DOM element
const element = document.getElementById('chat-container');
const elementPdf = await PDFUtils.generateFromElement(element);
PDFUtils.downloadPDF(elementPdf, 'chat-screenshot.pdf');
```

## 🎨 Customization Options

### PDF Format Options

```javascript
const options = {
  format: 'A4',           // 'A4', 'A3', 'Letter', etc.
  orientation: 'portrait', // 'portrait' or 'landscape'
  margin: {
    top: '20px',
    right: '20px',
    bottom: '20px',
    left: '20px'
  },
  printBackground: true,
  displayHeaderFooter: false
};
```

### Chat PDF Styling

The chat PDF generation creates beautifully formatted conversations with:
- Gradient header with title and participants
- Color-coded messages (sent/received)
- Timestamps for each message
- Professional footer with generation date
- Responsive design for different page sizes

### Custom HTML Templates

Create custom HTML templates for server-side generation:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: #007bff; color: white; padding: 20px; }
    .content { margin: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{title}}</h1>
  </div>
  <div class="content">
    {{content}}
  </div>
</body>
</html>
```

## 📊 Performance Comparison

| Feature | Client-side | Server-side |
|---------|-------------|-------------|
| Speed | Fast | Moderate |
| Quality | Good | Excellent |
| CSS Support | Limited | Full |
| Offline | Yes | No |
| File Size | Smaller | Larger |
| Browser Compatibility | Modern browsers | All |

## 🔍 Use Cases

### 1. Chat Export
- Export entire conversations
- Share important discussions
- Archive team communications
- Legal compliance documentation

### 2. Report Generation
- Monthly/quarterly reports
- User analytics
- Performance dashboards
- Data summaries

### 3. Document Creation
- Invoices and receipts
- Certificates and letters
- Terms and conditions
- User manuals

### 4. Content Backup
- Website snapshots
- Form submissions
- User-generated content
- Configuration backups

## 🛡️ Security Considerations

- **Server-side**: Runs in controlled environment, better for sensitive data
- **Client-side**: Data never leaves the browser, good for privacy
- **URL Generation**: Validate URLs to prevent SSRF attacks
- **HTML Content**: Sanitize HTML to prevent XSS attacks
- **File Size**: Implement limits to prevent DoS attacks

## 🐛 Troubleshooting

### Common Issues

1. **Puppeteer not working in production**
   - Ensure all dependencies are installed
   - Add `--no-sandbox` flag for Docker environments
   - Check Chrome/Chromium installation

2. **Client-side PDF quality issues**
   - Increase canvas scale in html2canvas options
   - Use server-side generation for better quality
   - Optimize CSS for print media

3. **Large file sizes**
   - Optimize images before PDF generation
   - Use appropriate compression settings
   - Consider pagination for large documents

4. **Memory issues**
   - Implement PDF service cleanup
   - Use streaming for large documents
   - Set appropriate timeouts

## 📝 Example Implementation

See `Frontend/src/components/PDFGenerator.jsx` for a complete working example with:
- Multiple PDF generation methods
- Error handling
- Loading states
- User interface
- Preview functionality

## 🤝 Contributing

To extend the PDF generation system:

1. Add new templates to `pdfService.js`
2. Create corresponding API endpoints
3. Update client-side utilities
4. Add tests for new functionality
5. Update documentation

## 📄 License

This PDF generation system is part of your chat application and follows the same license terms.