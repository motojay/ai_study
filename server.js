// 引入 express 模块
const express = require('express');
// 引入文件系统模块，用于读取文件
const fs = require('fs');
// 引入路径模块，用于处理文件路径
const path = require('path');
// 创建一个 express 应用实例
const app = express();
// 定义服务器监听的端口号
const port = 3000;

let GITHUB_TOKEN;
fs.readFile(path.join(__dirname, '.trae', 'secrets.json'), 'utf8', (error, secretsData) => {
  if (error) {
    console.error('读取 secrets.json 文件时出错:', error);
    process.exit(1);
  }
  const secrets = JSON.parse(secretsData);
  GITHUB_TOKEN = secrets.GITHUB_TOKEN;
  console.log('成功读取 GITHUB_TOKEN:', GITHUB_TOKEN);
});

// 处理 auth-callback 的 GET 请求
app.get('/auth-callback', (req, res) => {
  fs.readFile(path.join(__dirname, 'auth-callback.html'), 'utf8', (error, htmlContent) => {
    if (error) {
      res.status(500).send('读取文件失败');
      return;
    }
    // 将 GITHUB_TOKEN 注入到 HTML 中
    const modifiedHtml = htmlContent.replace('<!-- INSERT_GITHUB_TOKEN -->', `<script>window.GITHUB_TOKEN = '${GITHUB_TOKEN}';</script>`);
    res.send(modifiedHtml);
  });
});

// 启动服务器并监听指定端口
app.listen(port, () => {
    // 当服务器成功启动后，在控制台输出提示信息
    console.log(`Server is running on port ${port}`);
});