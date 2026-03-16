const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Get the file path
    let filePath = req.url === '/' ? '/src/index.html' : req.url;
    
    // Handle login.html, datenschutz.html, impressum.html at root
    if (filePath === '/login.html' || filePath === '/datenschutz.html' || filePath === '/impressum.html') {
        filePath = '/src' + filePath;
    }
    
    // If accessing root without specific file, serve index.html
    if (filePath === '/') {
        filePath = '/src/index.html';
    }
    
    const fullPath = path.join(__dirname, filePath);
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'text/plain';
    
    // Read the file
    fs.readFile(fullPath, 'utf8', (err, content) => {
        if (err) {
            // File not found
            if (err.code === 'ENOENT') {
                // Try serving index.html for SPA routing
                fs.readFile(path.join(__dirname, 'src', 'index.html'), 'utf8', (err2, indexContent) => {
                    if (err2) {
                        res.writeHead(404);
                        res.end('Not found');
                        return;
                    }
                    serveHtml(res, indexContent);
                });
            } else {
                res.writeHead(500);
                res.end('Server error: ' + err.code);
            }
            return;
        }
        
        // If it's an HTML file, inject the config
        if (ext === '.html') {
            serveHtml(res, content);
        } else {
            // Serve other files as-is
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

function serveHtml(res, content) {
    // Inject Supabase config from environment variables
    const configScript = `<script>
    window.CONFIG = {
        SUPABASE_URL: '${process.env.SUPABASE_URL || ''}',
        SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY || ''}'
    };
</script>`;
    
    // Inject config BEFORE the Supabase client library
    content = content.replace(
        '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/umd/supabase.min.js"></script>',
        configScript + '\n    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/umd/supabase.min.js"></script>'
    );
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content, 'utf8');
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: SUPABASE_URL=${process.env.SUPABASE_URL ? 'SET' : 'NOT SET'}`);
    console.log(`Environment: SUPABASE_ANON_KEY=${process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}`);
});
