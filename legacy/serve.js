// Tiny local web server: run `node serve.js`, then open http://localhost:8080
const http = require("http"), fs = require("fs"), path = require("path");
const root = __dirname, port = process.env.PORT || 8080;
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".md": "text/plain" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
    const type = types[path.extname(file).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": /^text|json/.test(type) ? type + "; charset=utf-8" : type });
    res.end(data);
  });
}).listen(port, () => console.log("Chair service site running at http://localhost:" + port));
