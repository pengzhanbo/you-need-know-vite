---
title: 简化版 Vite
---

## 最小化实现

在这个最小化的版本中，先不考虑最终的打包构建，也不考虑 cli 工具的实现，其核心的功能是：

- 启动一个可用的开发服务
- 正确响应请求的资源
- 监听资源更新时，实现对资源的重载


## 开发服务

在 node 中，实现一个 开发服务 很简单，可以通过内置的 `http` 模块，实现一个 `http` 服务：

```ts
import { createServer } from "node:http"

const server = createServer(async (req, res) => {
  res.end('Hello Word');
})
server.listen(3000);
```

但这太简单了，我们需要这个 http 服务，能够根据请求的资源链接，返回相关的 `html/css/javascript`资源，以及图片等各种资源。

比如，如果我们期望返回一个本地磁盘中的一个 `html` 资源，我们可能需要这么实现：

```ts
import { createServer } from "node:http";
import fs, { promises as fsp } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const server = createServer(async (req, res) => {
  /**
   * 获取 `html` 在本地磁盘的路径地址，通过 `fs` 读取
   */
  const index = path.join(dirname, "./template/index.html");
  /**
   * 创建文件读取流
   */
  const stream = fs.createReadStream(index);
  const stats = await fsp.lstat(index);
  /**
   * 发送资源内容
   */
  res.setHeader("Content-Length", stats.size);
  stream.pipe(res);
});

server.listen(3000);

```

可以预见的是，我们可能需要预先对各种资源在 `http server` 中进行处理，同时还要使 `http server` 保证可用，并实现
其他各种相关功能。

但我们并不必须要从零开始实现这些功能，得益于 `node` 强大的开源社区，有很多的 `http-server` 实现，这让我们可以从如
`express` / `koa` / `fastify` / `connect` 等库中选择。

在 `vite` 中，使用了 `connect` 作为 `http-server`，所以在我们的简化版中，也同样选择 `connect`。

> 在 `vite` 的 `2.0` 版本之前，选择的是 `koa` 作为 `http-server`。 为什么从 `koa` 切换到 `connect`，原因我还未做深入了解。

使用 `connect` 启动一个 `http-server` 非常简单：

```ts
import connect from 'connect'

const server = connect()

server.listen(3000)
```
