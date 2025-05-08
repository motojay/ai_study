// 引入 express 模块，用于创建和管理 Web 服务器
const express = require('express');
// 引入文件系统模块，用于读取和操作文件
const fs = require('fs');
// 引入路径模块，用于处理和转换文件路径
const path = require('path');
// 创建一个 express 应用实例，后续将使用这个实例来配置和启动服务器
const app = express();
// 定义服务器监听的端口号，客户端可以通过这个端口访问服务器
const port = 3000;

// 定义一个变量，用于存储从 secrets.json 文件中读取的 GITHUB_TOKEN
let GITHUB_TOKEN;
// 读取本地的 secrets.json 文件，该文件包含敏感信息如 GITHUB_TOKEN
fs.readFile(path.join(__dirname, '.trae', 'secrets.json'), 'utf8', (error, secretsData) => {
  // 检查读取文件时是否发生错误
  if (error) {
    // 如果发生错误，在控制台输出错误信息，并终止当前进程
    console.error('读取 secrets.json 文件时出错:', error);
    process.exit(1);
  }
  // 将读取到的 JSON 格式的文件内容解析为 JavaScript 对象
  const secrets = JSON.parse(secretsData);
  // 从解析后的对象中提取 GITHUB_TOKEN 并赋值给之前定义的变量
  GITHUB_TOKEN = secrets.GITHUB_TOKEN;
  // 在控制台输出成功读取到的 GITHUB_TOKEN，方便调试
  console.log('成功读取 GITHUB_TOKEN:', GITHUB_TOKEN);
});

// 定义一个路由，当客户端访问 /auth-callback 路径时，执行以下操作
app.get('/auth-callback', (req, res) => {
  // 读取 auth-callback.html 文件，该文件是授权回调页面
  fs.readFile(path.join(__dirname, 'auth-callback.html'), 'utf8', (error, htmlContent) => {
    // 检查读取文件时是否发生错误
    if (error) {
      // 如果发生错误，向客户端发送 500 状态码和错误信息
      res.status(500).send('读取文件失败');
      return;
    }
    // 将 GITHUB_TOKEN 注入到 HTML 文件中，通过替换特定注释实现
    const modifiedHtml = htmlContent.replace('<!-- INSERT_GITHUB_TOKEN -->', `<script>window.GITHUB_TOKEN = '${GITHUB_TOKEN}';</script>`);
    // 将修改后的 HTML 内容发送给客户端
    res.send(modifiedHtml);
  });
});

// 启动服务器并监听指定的端口号
app.listen(port, () => {
  // 当服务器成功启动后，在控制台输出提示信息，告知服务器正在运行的端口
  console.log(`Server is running on port ${port}`);
});