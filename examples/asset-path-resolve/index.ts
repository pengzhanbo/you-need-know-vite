import connect from 'connect';
import fs, {promises as fsp} from 'node:fs';
import path from 'node:path';

const RE_IMPORTER = /(?:\s+from|import)\s+['"]([^'"]+?)['"]/g;

const server = connect();

server.use(async (req, res, next) => {
  let id = req.url === '/' ? '/index.html' : req.url;
  const isModule = id.startsWith('/@module');
  let relativePath = '';
  if (isModule) {
    const { packageName, id: _id } = await resolveExports(id);
    id = path.join(process.cwd(), 'node_modules', packageName, _id);
    const subDir = path.dirname(_id);
    relativePath = path.join('/@module', packageName, subDir);
  } else {
    id = path.join(process.cwd(), 'src', id);
  }
  if (/\.[mc]?[tj]s$/.test(id)) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  if (fs.existsSync(id)) {
    const content = await fsp.readFile(id, 'utf-8');
    res.end(rewriteImporters(content, relativePath));
  } else {
    next();
  }
})


server.listen(3001, () => {
  console.log('server listen: http://localhost:3001');
});

function rewriteImporters(content: string, relativePath = '') {
  return content.replace(RE_IMPORTER, (match, filepath) => {
    const starts = match.startsWith('import') ? 'import' : ' from';
    if (filepath.startsWith('./') || filepath.startsWith('../') || filepath === '.') {
      return `${starts} '${relativePath? path.join(relativePath, filepath) : filepath}'`;
    }
    if (filepath[0] !== '/') {
      return `${starts} '/@module/${filepath}'`;
    }
    return match;
  })
}

async function resolveExports(id: string) {
  const [,,packageName, ...other] = id.split('/');
  const pathname = other.join('/') || '.';
  let pkg = {} as any;
  try {
    pkg = JSON.parse(await fsp.readFile(path.join(process.cwd(), 'node_modules', packageName, 'package.json'),'utf-8'));
  } catch { /* empty */ }
  if (!pkg.exports && pkg.main) {
    id = pathname === '.' ? pkg.main : pathname;
  } else if (pkg.exports) {
    if (typeof pkg.exports === 'string') {
      id = pathname === '.' ? pkg.exports : pathname;
    } else {
      const subExports = pkg.exports[pathname];
      if (subExports) {
        id = typeof subExports === 'string' ? subExports : (subExports['import'] || subExports['browser']);
      } else {
        id = pathname;
      }
    }
  }
  return { packageName, id };
}
