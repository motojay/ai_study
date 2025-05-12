// 引入 express 模块，用于创建和管理 Web 服务器
const express = require('express');
// 引入文件系统模块，用于读取文件
const fs = require('fs');
// 引入路径模块，用于处理文件路径
const path = require('path');
// 引入 node-fetch 模块，用于发起 HTTP 请求
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// 创建一个 express 应用实例
const app = express();
// 定义服务器监听的端口号
const port = 3000;

// 直接从环境变量中获取 DEPLOY_TOKEN
const DEPLOY_TOKEN = process.env.DEPLOY_TOKEN;

// 从环境变量中获取飞书应用的 APP_ID 和 APP_SECRET
const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!DEPLOY_TOKEN) {
  console.error('未从环境变量中获取到 DEPLOY_TOKEN，请检查配置');
  process.exit(1);
} 

if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
  console.error('未从环境变量中获取到 FEISHU_APP_ID 或 FEISHU_APP_SECRET，请检查配置');
  process.exit(1);
}

console.log('成功从环境变量读取 DEPLOY_TOKEN:', DEPLOY_TOKEN);
console.log('成功从环境变量读取 FEISHU_APP_ID:', FEISHU_APP_ID);
console.log('成功从环境变量读取 FEISHU_APP_SECRET:', FEISHU_APP_SECRET);

// 解析 POST 请求的 JSON 数据
app.use(express.json());

// 处理 auth-callback 的 POST 请求
app.post('/ai_study/auth-callback', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        res.redirect(`https://motojay.github.io/ai_study/auth-result.html?success=false&message=未获取到授权码`);
        return;
    }

    try {
        // 第一步：使用授权码获取 user_access_token
        const feishuHeaders = {
            'Content-Type': 'application/json',
            // 手动设置 Basic Auth 的 Authorization 头
            'Authorization': `Basic ${Buffer.from(`${FEISHU_APP_ID}:${FEISHU_APP_SECRET}`).toString('base64')}`
        };
        const feishuBody = {
            "grant_type": "authorization_code",
            "code": code
        };

        const feishuResponse = await fetch('https://open.feishu.cn/open-apis/authen/v1/access_token', {
            method: 'POST',
            headers: feishuHeaders,
            body: JSON.stringify(feishuBody)
        });

        if (!feishuResponse.ok) {
            const feishuResponseText = await feishuResponse.text();
            throw new Error(`飞书 API 请求失败，状态码: ${feishuResponse.status}，响应内容: ${feishuResponseText}`);
        }

        const feishuData = await feishuResponse.json();
        const userAccessToken = feishuData.data.access_token;
        console.log('成功获取 user_access_token:', userAccessToken);

        // 第二步：向 GitHub API 发送请求，触发 feishu_oauth 事件
        const githubHeaders = {
            'Authorization': `token ${DEPLOY_TOKEN}`,
            'Accept': 'application/vnd.github.everest-preview+json',
            'Content-Type': 'application/json'
        };
        const githubBody = { 
            event_type: 'feishu_oauth', 
            client_payload: { 
                code: code,
                userAccessToken: userAccessToken
            } 
        };

        const githubResponse = await fetch('https://api.github.com/repos/motojay/ai_study/dispatches', {
            method: 'POST',
            headers: githubHeaders,
            body: JSON.stringify(githubBody)
        });

        if (!githubResponse.ok) {
            throw new Error('GitHub API 返回错误状态，状态码: ' + githubResponse.status);
        }

        // 返回成功响应给前端
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('请求出错:', error);
        // 返回错误响应给前端
        res.status(500).json({ success: false, message: error.message });
    }
});

// 处理 auth-callback 的 GET 请求
app.get('/ai_study/auth-callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        // 返回错误的 JSON 响应
        res.status(400).json({ success: false, message: '未获取到授权码' });
        return;
    }

    try {
        // 第一步：使用授权码获取 user_access_token
        const feishuHeaders = {
            'Content-Type': 'application/json',
            // 手动设置 Basic Auth 的 Authorization 头
            'Authorization': `Basic ${Buffer.from(`${FEISHU_APP_ID}:${FEISHU_APP_SECRET}`).toString('base64')}`
        };
        const feishuBody = {
            "grant_type": "authorization_code",
            "code": code
        };

        const feishuResponse = await fetch('https://open.feishu.cn/open-apis/authen/v1/access_token', {
            method: 'POST',
            headers: feishuHeaders,
            body: JSON.stringify(feishuBody)
        });

        if (!feishuResponse.ok) {
            const feishuResponseText = await feishuResponse.text();
            throw new Error(`飞书 API 请求失败，状态码: ${feishuResponse.status}，响应内容: ${feishuResponseText}`);
        }

        const feishuData = await feishuResponse.json();
        const userAccessToken = feishuData.data.access_token;
        console.log('成功获取 user_access_token:', userAccessToken);

        // 第二步：向 GitHub API 发送请求，触发 feishu_oauth 事件
        const githubHeaders = {
            'Authorization': `token ${DEPLOY_TOKEN}`,
            'Accept': 'application/vnd.github.everest-preview+json',
            'Content-Type': 'application/json'
        };
        const githubBody = { 
            event_type: 'feishu_oauth', 
            client_payload: { 
                code: code,
                userAccessToken: userAccessToken
            } 
        };

        const githubResponse = await fetch('https://api.github.com/repos/motojay/ai_study/dispatches', {
            method: 'POST',
            headers: githubHeaders,
            body: JSON.stringify(githubBody)
        });

        if (!githubResponse.ok) {
            throw new Error('GitHub API 返回错误状态，状态码: ' + githubResponse.status);
        }

        // 返回成功的 JSON 响应
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('请求出错:', error);
        // 返回错误的 JSON 响应
        res.status(500).json({ success: false, message: error.message });
    }
});

// 启动服务器并监听指定端口
app.listen(port, () => {
  // 当服务器成功启动后，在控制台输出提示信息
  console.log(`Server is running on port ${port}`);
});
