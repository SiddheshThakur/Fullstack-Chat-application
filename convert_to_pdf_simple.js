import puppeteer from 'puppeteer';
import fs from 'fs';

// Read the markdown file
const markdownContent = fs.readFileSync('Chat_Application_Report.md', 'utf8');

// Simple markdown to HTML conversion
function convertMarkdownToHTML(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Code blocks
    html = html.replace(/```javascript\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');
    
    // Lists
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^1\. (.*$)/gim, '<li>$1</li>');
    
    // Wrap lists properly
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Horizontal rules
    html = html.replace(/---/g, '<hr>');
    
    // Paragraphs - handle this more carefully
    const lines = html.split('\n');
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === '') {
            if (processedLines.length > 0 && !processedLines[processedLines.length - 1].endsWith('</p>')) {
                processedLines.push('</p>');
            }
            processedLines.push('<p>');
        } else if (line.startsWith('<h') || line.startsWith('<pre') || line.startsWith('<ul') || line.startsWith('<hr')) {
            if (processedLines.length > 0 && !processedLines[processedLines.length - 1].endsWith('</p>')) {
                processedLines.push('</p>');
            }
            processedLines.push(line);
        } else if (line.startsWith('</h') || line.startsWith('</pre') || line.startsWith('</ul') || line.startsWith('</hr')) {
            processedLines.push(line);
            processedLines.push('<p>');
        } else {
            if (processedLines.length === 0 || processedLines[processedLines.length - 1].endsWith('</p>')) {
                processedLines.push('<p>');
            }
            processedLines.push(line);
        }
    }
    
    html = processedLines.join('\n');
    
    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');
    
    return html;
}

// Convert markdown to HTML
const convertedContent = convertMarkdownToHTML(markdownContent);

// Create HTML document
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Application Technical Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            font-size: 14px;
        }
        
        h1 {
            font-size: 2.2em;
            font-weight: bold;
            color: #1a1a1a;
            margin: 30px 0 20px 0;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
        }
        
        h2 {
            font-size: 1.6em;
            font-weight: bold;
            color: #2563eb;
            margin: 25px 0 15px 0;
            border-left: 4px solid #3b82f6;
            padding-left: 15px;
        }
        
        h3 {
            font-size: 1.3em;
            font-weight: bold;
            color: #374151;
            margin: 20px 0 10px 0;
        }
        
        h4 {
            font-size: 1.1em;
            font-weight: bold;
            color: #4b5563;
            margin: 15px 0 8px 0;
        }
        
        p {
            margin-bottom: 12px;
            text-align: justify;
        }
        
        ul, ol {
            margin: 12px 0;
            padding-left: 25px;
        }
        
        li {
            margin-bottom: 6px;
        }
        
        code {
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.85em;
            color: #dc2626;
        }
        
        pre {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 15px 0;
            font-family: monospace;
            font-size: 0.8em;
            line-height: 1.4;
        }
        
        pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
        
        hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 20px 0;
        }
        
        a {
            color: #3b82f6;
            text-decoration: none;
        }
        
        strong {
            font-weight: bold;
        }
        
        em {
            font-style: italic;
        }
        
        @media print {
            body {
                padding: 20px;
                font-size: 12px;
            }
            
            h1 {
                font-size: 1.8em;
                margin: 20px 0 15px 0;
            }
            
            h2 {
                font-size: 1.4em;
                margin: 18px 0 12px 0;
            }
            
            h3 {
                font-size: 1.2em;
                margin: 15px 0 10px 0;
            }
            
            p {
                margin-bottom: 10px;
            }
            
            pre {
                font-size: 0.7em;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    ${convertedContent}
</body>
</html>
`;

// Write HTML to temporary file for debugging
fs.writeFileSync('temp_report_simple.html', htmlContent);

// Convert to PDF using Puppeteer
async function convertToPDF() {
    console.log('Starting PDF conversion...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Load the HTML content
    await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
    });
    
    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Generating PDF...');
    
    // Generate PDF
    await page.pdf({
        path: 'Chat_Application_Report_Simple.pdf',
        format: 'A4',
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666; padding: 10px;">Chat Application Technical Report</div>',
        footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666; padding: 10px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
    });
    
    await browser.close();
    
    console.log('PDF generated successfully: Chat_Application_Report_Simple.pdf');
    console.log('HTML file saved for debugging: temp_report_simple.html');
}

convertToPDF().catch(console.error); 