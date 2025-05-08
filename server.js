// 引入 express 模块
const express = require('express');
// 创建一个 express 应用实例
const app = express();
// 定义服务器监听的端口号
const port = 3000;

// 处理根路径的 GET 请求
app.get('/', (req, res) => {
    // 当访问根路径时，返回一个简单的消息
    res.send('Hello, World!');
});

// 处理 auth-callback 的 GET 请求
app.get('/auth-callback', (req, res) => {
    // 发送 auth-callback.html 文件作为响应
    res.sendFile(__dirname + '/auth-callback.html');
});

// 启动服务器并监听指定端口
app.listen(port, () => {
    // 当服务器成功启动后，在控制台输出提示信息
    console.log(`Server is running on port ${port}`);
});