const http = require('http');
const url = require('url');
const BlogManager = require('./blogManager');
const path = require('path');
const fs = require('fs');

const blogManager = new BlogManager();
const PORT = 3000;

blogManager.on('blogCreated', (blog) => {
    console.log(`New blog created: ${blog.title}`);
});

blogManager.on('blogRead', (blog) => {
    console.log(`Blog read: ${blog.title} (Total reads: ${blog.readCount})`);
});

blogManager.on('blogDeleted', (blog) => {
    console.log(`Blog deleted: ${blog.title}`);
});

function parseRequestBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (err) {
            callback(err);
        }
    });
}

function sendResponse(res, statusCode, data, contentType = 'application/json') {
    res.writeHead(statusCode, { 'Content-Type': contentType });
    if (contentType === 'application/json') {
        res.end(JSON.stringify(data));
    } else {
        res.end(data);
    }
}

function send404(res) {
    const filePath = path.join(__dirname, 'public', '404.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            sendResponse(res, 404, { error: 'Page not found' });
        } else {
            sendResponse(res, 404, data, 'text/html');
        }
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (method === 'GET' && pathname === '/') {
        const welcomeHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Blog Sistemi</title>
                <meta charset="UTF-8">
            </head>
            <body>
                <h1>Blog Sistemine Hoş Geldiniz!</h1>
                <p>Node.js core modülleri kullanılarak oluşturulmuş basit bir blog sistemi.</p>
                <h2>Mevcut Endpoint'ler:</h2>
                <ul>
                    <li>GET / - Ana sayfa (bu sayfa)</li>
                    <li>GET /blogs - Tüm blog yazıları</li>
                    <li>GET /blog/:id - Belirli bir blog yazısı</li>
                    <li>POST /create - Yeni blog oluştur</li>
                    <li>GET /top - En çok okunan 5 blog</li>
                    <li>GET /search?q=kelime - Blog arama</li>
                    <li>DELETE /blog/:id - Blog sil</li>
                </ul>
            </body>
            </html>
        `;
        sendResponse(res, 200, welcomeHtml, 'text/html');
    }
    
    else if (method === 'GET' && pathname === '/blogs') {
        blogManager.getAllBlogs((err, blogs) => {
            if (err) {
                sendResponse(res, 500, { error: 'Error reading blogs' });
            } else {
                sendResponse(res, 200, { blogs: blogs, count: blogs.length });
            }
        });
    }
    
    else if (method === 'GET' && pathname.startsWith('/blog/')) {
        const id = pathname.split('/')[2];
        blogManager.readBlog(id, (err, blog) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    send404(res);
                } else {
                    sendResponse(res, 500, { error: 'Error reading blog' });
                }
            } else {
                sendResponse(res, 200, blog);
            }
        });
    }
    
    else if (method === 'POST' && pathname === '/create') {
        parseRequestBody(req, (err, data) => {
            if (err) {
                sendResponse(res, 400, { error: 'Invalid JSON' });
                return;
            }
            
            if (!data.title || !data.content) {
                sendResponse(res, 400, { error: 'Title and content are required' });
                return;
            }
            
            blogManager.createBlog(data.title, data.content, (createErr, blog) => {
                if (createErr) {
                    sendResponse(res, 500, { error: 'Error creating blog' });
                } else {
                    sendResponse(res, 201, { message: 'Blog created successfully', blog: blog });
                }
            });
        });
    }
    
    else if (method === 'DELETE' && pathname.startsWith('/blog/')) {
        const id = pathname.split('/')[2];
        blogManager.deleteBlog(id, (err, blog) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    send404(res);
                } else {
                    sendResponse(res, 500, { error: 'Error deleting blog' });
                }
            } else {
                sendResponse(res, 200, { message: 'Blog deleted successfully', blog: blog });
            }
        });
    }
    
    else if (method === 'GET' && pathname === '/top') {
        blogManager.getTopBlogs(5, (err, blogs) => {
            if (err) {
                sendResponse(res, 500, { error: 'Error getting top blogs' });
            } else {
                sendResponse(res, 200, { topBlogs: blogs });
            }
        });
    }
    
    else if (method === 'GET' && pathname === '/search') {
        const query = parsedUrl.query.q;
        if (!query) {
            sendResponse(res, 400, { error: 'Query parameter "q" is required' });
            return;
        }
        
        blogManager.searchBlogs(query, (err, results) => {
            if (err) {
                sendResponse(res, 500, { error: 'Error searching blogs' });
            } else {
                sendResponse(res, 200, { query: query, results: results, count: results.length });
            }
        });
    }
    
    else {
        send404(res);
    }
});

server.listen(PORT, () => {
    console.log(`Blog server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});