import connect from "connect";
import fs, { promises as fsp } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const server = connect();

server.use(async (req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url
  const assert = path.join(dirname, `./template/${url}`);
  if (fs.existsSync(assert)) {
    const stream = fs.createReadStream(assert);
    const stats = await fsp.lstat(assert);
    res.setHeader("Content-Length", stats.size);
    stream.pipe(res);
  } else {
    res.end();
  }
})

server.listen(3001, () => {
  console.log('server listen: http://localhost:3001');
})
