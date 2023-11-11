const http = require('http')
const server = http.createServer((req, res) => {
  console.log(req.method, req.url)

  if(req.method === 'POST' && req.url === '/webhook') {
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({ ok: true })
    )
  } else {
    res.end('Not Found')
  }
})

server.listen(4000, () => {
  console.log('webhook 服务已经在 4000 端口启动')
})