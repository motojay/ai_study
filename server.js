// 引入 express 模块，用于创建和管理 Web 服务器
const express = require('express');
// 引入文件系统模块，用于读取文件
const fs = require('fs');
// 引入路径模块，用于处理文件路径
const path = require('path');
// 引入 node-fetch 模块，用于发起 HTTP 请求
const fetch = require('node-fetch');
// 创建一个 express 应用实例
const app = express();
// 定义服务器监听的端口号
const port = 3000;

// 直接从环境变量中获取 DEPLOY_TOKEN
const DEPLOY_TOKEN = process.env.DEPLOY_TOKEN;

if (!DEPLOY_TOKEN) {
  console.error('未从环境变量中获取到 DEPLOY_TOKEN，请检查配置');
  process.exit(1);
} else {
  console.log('成功从环境变量读取 DEPLOY_TOKEN:', DEPLOY_TOKEN);
}

// 处理 auth-callback 的 GET 请求
app.get('/auth-callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.status(400).send('未获取到授权码');
    return;
  }

  const headers = {
    'Authorization': `token ${DEPLOY_TOKEN}`,
    'Accept': 'application/vnd.github.everest-preview+json',
    'Content-Type': 'application/json'
  };
  const body = { 
    event_type: 'feishu_oauth', 
    client_payload: { code } 
  };

  try {
    const response = await fetch('https://api.github.com/repos/motojay/ai_study/dispatches', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error('API 返回错误状态，状态码: ' + response.status);
    }

    res.send(`<script>alert('授权成功！Token 将在后台处理。'); window.location.href = 'https://飞书应用主页';</script>`);
  } catch (error) {
    console.error('请求 GitHub API 出错:', error);
    res.status(500).send('授权失败: ' + error.message);
  }
});

// 启动服务器并监听指定端口
app.listen(port, () => {
  // 当服务器成功启动后，在控制台输出提示信息
  console.log(`Server is running on port ${port}`);
});