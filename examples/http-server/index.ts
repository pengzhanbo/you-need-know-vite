import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";


const server = createServer(async (req, res) => {
  const index = path.join(process.cwd(), 'src/index.html');
  const stream = fs.createReadStream(index);
  stream.pipe(res);
});

server.listen(3001, () => {
  console.log('server listen: http://localhost:3001');
});
