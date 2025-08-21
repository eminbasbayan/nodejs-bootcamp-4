const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class BlogManager extends EventEmitter {
    constructor() {
        super();
        this.blogsDir = path.join(__dirname, 'blogs');
        this.logsDir = path.join(__dirname, 'logs');
        
        this.ensureDirectories();
    }

    ensureDirectories() {
        if (!fs.existsSync(this.blogsDir)) {
            fs.mkdirSync(this.blogsDir, { recursive: true });
        }
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }
    }

    generateId() {
        return Date.now().toString();
    }

    createBlog(title, content, callback) {
        const blogData = {
            id: this.generateId(),
            title: title,
            content: content,
            date: new Date().toISOString().split('T')[0],
            readCount: 0
        };

        const filePath = path.join(this.blogsDir, `blog-${blogData.id}.json`);
        
        fs.writeFile(filePath, JSON.stringify(blogData, null, 2), (err) => {
            if (err) {
                return callback(err);
            }
            
            this.emit('blogCreated', blogData);
            this.logActivity(`Blog created: ${blogData.title} (ID: ${blogData.id})`);
            callback(null, blogData);
        });
    }

    readBlog(id, callback) {
        const filePath = path.join(this.blogsDir, `blog-${id}.json`);
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return callback(err);
            }
            
            try {
                const blogData = JSON.parse(data);
                blogData.readCount++;
                
                fs.writeFile(filePath, JSON.stringify(blogData, null, 2), (writeErr) => {
                    if (writeErr) {
                        console.error('Error updating read count:', writeErr);
                    }
                });
                
                this.emit('blogRead', blogData);
                this.logActivity(`Blog read: ${blogData.title} (ID: ${blogData.id})`);
                callback(null, blogData);
            } catch (parseErr) {
                callback(parseErr);
            }
        });
    }

    getAllBlogs(callback) {
        fs.readdir(this.blogsDir, (err, files) => {
            if (err) {
                return callback(err);
            }

            const jsonFiles = files.filter(file => path.extname(file) === '.json');
            const blogs = [];
            let pending = jsonFiles.length;

            if (pending === 0) {
                return callback(null, blogs);
            }

            jsonFiles.forEach(file => {
                const filePath = path.join(this.blogsDir, file);
                fs.readFile(filePath, 'utf8', (readErr, data) => {
                    if (readErr) {
                        console.error(`Error reading ${file}:`, readErr);
                    } else {
                        try {
                            blogs.push(JSON.parse(data));
                        } catch (parseErr) {
                            console.error(`Error parsing ${file}:`, parseErr);
                        }
                    }
                    
                    pending--;
                    if (pending === 0) {
                        blogs.sort((a, b) => b.id.localeCompare(a.id));
                        callback(null, blogs);
                    }
                });
            });
        });
    }

    deleteBlog(id, callback) {
        const filePath = path.join(this.blogsDir, `blog-${id}.json`);
        
        fs.readFile(filePath, 'utf8', (readErr, data) => {
            if (readErr) {
                return callback(readErr);
            }
            
            let blogData;
            try {
                blogData = JSON.parse(data);
            } catch (parseErr) {
                return callback(parseErr);
            }
            
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    return callback(unlinkErr);
                }
                
                this.emit('blogDeleted', blogData);
                this.logActivity(`Blog deleted: ${blogData.title} (ID: ${blogData.id})`);
                callback(null, blogData);
            });
        });
    }

    logActivity(message) {
        const logMessage = `[${new Date().toISOString()}] ${message}\n`;
        const logPath = path.join(this.logsDir, 'activity.log');
        
        fs.appendFile(logPath, logMessage, (err) => {
            if (err) {
                console.error('Error writing to log:', err);
            }
        });
    }

    getTopBlogs(limit = 5, callback) {
        this.getAllBlogs((err, blogs) => {
            if (err) {
                return callback(err);
            }
            
            const topBlogs = blogs
                .sort((a, b) => b.readCount - a.readCount)
                .slice(0, limit);
                
            callback(null, topBlogs);
        });
    }

    searchBlogs(query, callback) {
        this.getAllBlogs((err, blogs) => {
            if (err) {
                return callback(err);
            }
            
            const searchTerm = query.toLowerCase();
            const results = blogs.filter(blog => 
                blog.title.toLowerCase().includes(searchTerm) ||
                blog.content.toLowerCase().includes(searchTerm)
            );
            
            callback(null, results);
        });
    }
}

module.exports = BlogManager;