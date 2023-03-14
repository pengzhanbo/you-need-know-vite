import connect from "connect";
import fs, {promises as fsp} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const server = connect();

server.use(async (req, res) => {
  let id = req.url === '/' ? '/index.html' : req.url
  if (id.startsWith('/@module')) {
    const [,,packageName, pathname = '.'] = id.split('/')
    let pkg = {} as any
    try {
      
      pkg = JSON.parse(await fsp.readFile(path.join(dirname, 'node_modules', packageName, 'package.json'),'utf-8'))
    } catch { /* empty */ }
    if (!pkg.exports && pkg.main) {
      id = pkg.main
    } else if (pkg.exports) {
      if (typeof pkg.exports === 'string') {
        id = pkg.exports
      } else {
        const subExports = pkg.exports[pathname]
        id = typeof subExports === 'string' ? subExports : subExports['default']['default']
      }
    }
    id = path.join('.', 'node_modules', packageName, id)
  } else {
    id = path.join('.', 'template', id)
  }
  const assert = path.join(dirname, id);
  if (id.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript')
  }
  if (fs.existsSync(assert)) {
    const stream = fs.createReadStream(assert);
    stream.pipe(res);
  } else {
    res.end();
  }
})

server.listen(3001, () => {
  console.log('server listen: http://localhost:3001');
})
