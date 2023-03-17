import connect from 'connect';
import fs, {promises as fsp} from 'node:fs';
import path from 'node:path';
import { transform } from 'esbuild'

const server = connect();

server.use(async (req, res, next) => {
  const url = req.url === '/' ? '/index.html' : req.url
  const assert = path.join(process.cwd(), `./src/${url}`);
  if (/\.[mc]?[tj]s$/.test(url)) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  if (fs.existsSync(assert)) {
    let content = await fsp.readFile(assert, 'utf-8');
    if (/\.[mc]?ts/.test(url)) {
      content = await transformWithEsbuild(content)
    }
    res.end(content);
  } else {
    next();
  }

})


server.listen(3001, () => {
  console.log('server listen: http://localhost:3001');
});

async function transformWithEsbuild(code: string) {
  const result = await transform(code, {
    target: 'esnext',
    charset: 'utf8',
    platform: 'browser',
    format: 'esm',
    loader: 'js',
  })
  return result.code
}
