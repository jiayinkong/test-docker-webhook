const http = require('http')
const crypto = require('crypto')
const { spawn } = require('child_process')

const SECRET = '123456'
function sign(body) {
  return `sha1=` + crypto.createHmac('sha1', SECRET).update(body).digest('hex')
}

const server = http.createServer((req, res) => {
  console.log(req.method, req.url)

  if(req.method === 'POST' && req.url === '/webhook') {
    let buffers = [];
    req.on('data', function(buffer) {
      buffers.push(buffer)
    })
    req.on('end', function(buffer) {
      let body = Buffer.concat(buffers)
      let event = req.headers['x-gitHub-event'] // event=push
      // github 请求来的时候，要传递请求体body，另外还会传递一个 signature 过来，你需要验证签名
      let signature = req.headers['x-hub-signature']

      // 请求不合法
      if(signature !== sign(body)) {
        return res.end('Not Allowed')
      }

      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({ ok: true })
      )

      if(event === 'push') {
        // 开始部署
        const payload = JSON.parse(body)
        const child = spawn('sh', [`./${payload.repository.name}.sh`])
        
        const buffers = []
        child.stdout.on('data'm function(buffer) {
          buffers.push(buffer)
        })
        child.stdout.on('end', function(buffer) {
          const log = Buffer.concat(buffers)
          console.log(log)
        })
      }
    })
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