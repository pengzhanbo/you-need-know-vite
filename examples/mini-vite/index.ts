import connect from 'connect';
import fs, {promises as fsp} from 'node:fs';
import path from 'node:path';
import { transform } from 'esbuild';
import chokidar from 'chokidar';

/**
 * import * from 'url'
 * import 'url'
 */
const RE_IMPORTER = /(?:\s+from|import)\s+['"]([^'"]+?)['"]/g;

const server = connect();

server.use(async (req, res, next) => {
  let id = req.url === '/' ? '/index.html' : req.url;
  const isModule = id.startsWith('/@module');
  let relativePath = '';
  if (isModule) {
    const { packageName, id: _id } = await resolveExports(id);
    /**
     * 这里仅考虑非 monorepo 的项目，仅有当前上下文的 node_modules；
     * 如果是 monorepo 类型的，可能其包保存在上层 node_modules 下，
     * 就需要递归的向上查找各层级的 node_modules
     */
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
    let content = await fsp.readFile(id, 'utf-8');
    if (/\.[mc]?ts/.test(id)) {
      content = await transformWithEsbuild(content)
    }
    res.end(rewriteImporters(content, relativePath));
  } else {
    next();
  }
});

/**
 * 监听 `src` 目录下的资源文件
 */
const watcher = chokidar.watch(path.join(process.cwd(), 'src/**/*'));
let hasUpdated = false;

const shouldUpdate = () => hasUpdated = true;

/**
 * 对文件的 增删改 进行监听
 */
watcher.on('add', shouldUpdate);
watcher.on('change', shouldUpdate);
watcher.on('unlink', shouldUpdate);

/**
 * 询问当前是否有文件发生变更
 */
server.use('/live-reload', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ hasUpdated }));
  hasUpdated = false;
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
  return result.code;
}

/**
 * 对当前资源的内容，将内容中的 `import *` 语句路径部分做转换处理
 * @param content 
 * @param relativePath 
 * @returns 
 */
function rewriteImporters(content: string, relativePath = '') {
  return content.replace(RE_IMPORTER, (match, filepath) => {
    const starts = match.startsWith('import') ? 'import' : ' from';
    /**
     * 处理相对路径的文件导入
     */
    if (filepath.startsWith('./') || filepath.startsWith('../') || filepath === '.') {
      return `${starts} '${relativePath? path.join(relativePath, filepath) : filepath}'`;
    }
    /**
     * 非相对路径、绝对路径的，认为导入的是 `node_modules` 下的模块
     */
    if (filepath[0] !== '/') {
      return `${starts} '/@module/${filepath}'`;
    }
    return match;
  })
}

/**
 * 对第三方的模块包导入， 通过查找其包的 `package.json` 文件，
 * 找到 `main` 和 `exports` 字段，获取该包的真实入口地址。
 * @param id 
 * @returns 
 */
async function resolveExports(id: string) {
  // /@module/js-cookie
  // /@module/axios/dist/esm/axios.js
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
      // 在规范中 exports 是一个多层级的嵌套，且key支持 glob 模式，
      // 这里为方便处理，仅考虑单层嵌套，静态路径的方式
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
