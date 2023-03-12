import { createServer } from "node:http";
import fs, { promises as fsp } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const server = createServer(async (req, res) => {
  const index = path.join(dirname, "./template/index.html");
  const stream = fs.createReadStream(index);
  const stats = await fsp.lstat(index);
  res.setHeader("Content-Length", stats.size);
  stream.pipe(res);
});

server.listen(3001);
