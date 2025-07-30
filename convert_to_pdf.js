import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Read the markdown file
const markdownContent = fs.readFileSync('Chat_Application_Report.md', 'utf8');

// Convert markdown to HTML with proper styling
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Application Technical Report</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        h1 {
            font-size: 2.5em;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 20px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
        }
        
        h2 {
            font-size: 1.8em;
            font-weight: 600;
            color: #2563eb;
            margin: 30px 0 15px 0;
            border-left: 4px solid #3b82f6;
            padding-left: 15px;
        }
        
        h3 {
            font-size: 1.4em;
            font-weight: 600;
            color: #374151;
            margin: 25px 0 10px 0;
        }
        
        h4 {
            font-size: 1.2em;
            font-weight: 500;
            color: #4b5563;
            margin: 20px 0 8px 0;
        }
        
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        code {
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
            color: #dc2626;
        }
        
        pre {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
            line-height: 1.5;
        }
        
        pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
        
        blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 20px;
            margin: 20px 0;
            font-style: italic;
            color: #6b7280;
        }
        
        .emoji {
            font-size: 1.2em;
            margin-right: 8px;
        }
        
        .highlight {
            background-color: #fef3c7;
            padding: 2px 4px;
            border-radius: 4px;
        }
        
        .table-of-contents {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            border: 1px solid #e2e8f0;
        }
        
        .table-of-contents h3 {
            margin-top: 0;
            color: #1e40af;
        }
        
        .table-of-contents ul {
            list-style-type: none;
            padding-left: 0;
        }
        
        .table-of-contents li {
            margin-bottom: 5px;
        }
        
        .table-of-contents a {
            color: #374151;
            text-decoration: none;
            font-weight: 500;
        }
        
        .table-of-contents a:hover {
            color: #3b82f6;
        }
        
        .architecture-diagram {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #f8fafc;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.8em;
            line-height: 1.8;
        }
        
        .file-structure {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.85em;
            line-height: 1.6;
            margin: 20px 0;
        }
        
        .feature-box {
            background-color: #ecfdf5;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .feature-box h4 {
            color: #065f46;
            margin-top: 0;
        }
        
        .security-box {
            background-color: #fef2f2;
            border: 1px solid #ef4444;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .security-box h4 {
            color: #991b1b;
            margin-top: 0;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            
            h1, h2, h3 {
                page-break-after: avoid;
            }
            
            pre, blockquote {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    ${markdownContent
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/```javascript\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>')
        .replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^1\. (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<h[1-6]>)/g, '$1')
        .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
        .replace(/<p>(<pre>)/g, '$1')
        .replace(/(<\/pre>)<\/p>/g, '$1')
        .replace(/<p>(<ul>)/g, '$1')
        .replace(/(<\/ul>)<\/p>/g, '$1')
        .replace(/<p>(<ol>)/g, '$1')
        .replace(/(<\/ol>)<\/p>/g, '$1')
        .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>')
        .replace(/<\/ul><ul>/g, '')
        .replace(/<ul><ul>/g, '<ul>')
        .replace(/<\/ul><\/ul>/g, '</ul>')
        .replace(/---/g, '<hr>')
        .replace(/\n/g, '<br>')
    }
</body>
</html>
`;

// Write HTML to temporary file
fs.writeFileSync('temp_report.html', htmlContent);

// Convert to PDF using Puppeteer
async function convertToPDF() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Load the HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    await page.pdf({
        path: 'Chat_Application_Report.pdf',
        format: 'A4',
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">Chat Application Technical Report</div>',
        footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
    });
    
    await browser.close();
    
    // Clean up temporary file
    fs.unlinkSync('temp_report.html');
    
    console.log('PDF generated successfully: Chat_Application_Report.pdf');
}

convertToPDF().catch(console.error); 