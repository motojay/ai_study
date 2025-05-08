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
try {
    // 读取 secrets.json 文件
    const secretsPath = path.join(__dirname, '.trae', 'secrets.json');
    const secretsData = fs.readFileSync(secretsPath, 'utf8');
    const secrets = JSON.parse(secretsData);
    GITHUB_TOKEN = secrets.GITHUB_TOKEN;
    console.log('成功读取 GITHUB_TOKEN:', GITHUB_TOKEN);
} catch (error) {
    console.error('读取 secrets.json 文件时出错:', error);
    process.exit(1);
}

// 处理根路径的 GET 请求
app.get('/', (req, res) => {
    // 当访问根路径时，返回一个简单的消息
    res.send('Hello, World!');
});

// 处理 auth-callback 的 GET 请求
app.get('/auth-callback', (req, res) => {
    // 读取 auth-callback.html 文件内容
    let htmlContent = fs.readFileSync(path.join(__dirname, 'auth-callback.html'), 'utf8');
    // 在 HTML 中注入 GITHUB_TOKEN
    const scriptToInject = `<script>window.GITHUB_TOKEN = "${GITHUB_TOKEN}";</script>`;
    // 将注入脚本插入到 </body> 标签之前
    htmlContent = htmlContent.replace('</body>', `${scriptToInject}</body>`);
    console.log('注入后的 HTML 内容:', htmlContent);
    // 发送修改后的 HTML 内容作为响应
    res.send(htmlContent);
});

// 启动服务器并监听指定端口
app.listen(port, () => {
    // 当服务器成功启动后，在控制台输出提示信息
    console.log(`Server is running on port ${port}`);
});