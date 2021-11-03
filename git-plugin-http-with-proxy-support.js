const get = require('simple-get')
const git = require('isomorphic-git')
const ProxyAgent = require('proxy-agent')

git.cores.create('antora').set('http', async ({ core, emitter, emitterPrefix, url, method, headers, body }) => {
  if (body && Array.isArray(body)) {
    const buffers = []
    for await (const chunk of body) buffers.push(Buffer.from(chunk))
    body = Buffer.concat(buffers)
  }
  return new Promise((resolve, reject) => {
    get({ url, agent: new ProxyAgent(), method, headers, body }, (err, res) => {
      if (err) return reject(err)
      const { url, method, statusCode, statusMessage, headers } = res
      resolve({ url, method, statusCode, statusMessage, headers, body: res })
    })
  })
})
