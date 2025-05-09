# ai_study
AI时代的学习内容

## 功能说明
### 飞书授权回调
- 前端页面 `auth-callback.html` 负责从 URL 查询参数中获取授权码 `code`，并将其重定向到后端 `/auth-callback` 接口。
- 后端 `server.js` 负责从环境变量中获取 `DEPLOY_TOKEN`，并使用该令牌向 GitHub API 发送请求，触发 `feishu_oauth` 事件。
- 如果请求成功，前端将弹出提示框告知用户授权成功，并跳转到飞书应用主页；如果请求失败，将返回错误信息。

## 安全注意事项
- 避免在前端直接暴露敏感令牌，所有与 GitHub API 的交互都在后端完成。
- 在正式环境中，需要在部署环境里设置 `DEPLOY_TOKEN` 环境变量。