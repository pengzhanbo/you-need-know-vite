import connect from 'connect';
import fs, {promises as fsp} from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';

const server = connect();

server.use(async (req, res, next) => {
  let id = req.url === '/' ? '/index.html' : req.url;
  id = path.join(process.cwd(), 'src', id);
  if (/\.[mc]?[tj]s$/.test(id)) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  if (fs.existsSync(id)) {
    const content = await fsp.readFile(id, 'utf-8');
    res.end(content);
  } else {
    next();
  }
})

const watcher = chokidar.watch(path.join(__dirname, 'src/**/*'));
let hasUpdated = false;

const shouldUpdate = () => hasUpdated = true;

watcher.on('add', shouldUpdate);
watcher.on('change', shouldUpdate);
watcher.on('unlink', shouldUpdate);

server.use('/live-reload', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ hasUpdated }));
  hasUpdated = false;
})

server.listen(3001, () => {
  console.log('server listen: http://localhost:3001');
});
