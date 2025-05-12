# ai_study 项目

## 项目简介
这是一个 AI 学习相关的项目，涉及飞书 OAuth 授权等功能。

## GitHub Actions 工作流说明

### `feishu-oauth.yml` 工作流
该工作流位于 `.github/workflows/feishu-oauth.yml`，用于处理飞书 OAuth 授权相关任务。

#### 启用环节
此工作流会在接收到 `repository_dispatch` 事件，且事件类型为 `feishu_oauth` 时启用。在项目的 `server.js` 文件中，当成功从飞书获取 `user_access_token` 后，会向 GitHub API 发送请求，触发 `feishu_oauth` 事件


## 功能说明
### 飞书授权回调
- 前端页面 `auth-callback.html` 负责从 URL 查询参数中获取授权码 `code`，并将其重定向到后端 `/auth-callback` 接口。
- 后端 `server.js` 负责从环境变量中获取 `DEPLOY_TOKEN`、`FEISHU_APP_ID` 和 `FEISHU_APP_SECRET`。使用授权码 `code` 向飞书 API 请求 `user_access_token`，然后使用 `DEPLOY_TOKEN` 向 GitHub API 发送请求，触发 `feishu_oauth` 事件。
- 如果请求成功，前端将弹出提示框告知用户授权成功，并跳转到飞书应用主页；如果请求失败，将返回错误信息。

## 安全注意事项
- 避免在前端直接暴露敏感令牌，所有与 GitHub API 和飞书 API 的交互都在后端完成。
- 在正式环境中，需要在部署环境里设置 `DEPLOY_TOKEN`、`FEISHU_APP_ID` 和 `FEISHU_APP_SECRET` 环境变量。

## 本地测试步骤
### 1. 安装依赖
在项目根目录（`e:\ai_study\ai_study`）下打开命令提示符或 PowerShell，运行以下命令：
```bash
npm install express node-fetch@latest
```

## 飞书授权流程说明

### 发起授权请求
在 `index.html` 页面中，点击 “飞书授权登录” 按钮会触发以下操作：
1. 生成随机的 `state` 参数。
2. 将 `state` 参数存储到 `localStorage` 中。
3. 构建包含 `state` 参数的飞书授权请求 URL。
4. 跳转到飞书授权页面。

### 处理授权回调
`auth-callback.html` 页面会接收飞书授权回调的参数，验证 `state` 和 `code` 参数：
- 若 `state` 参数不存在或与 `localStorage` 中存储的 `feishu_auth_state` 不一致，会显示 “安全验证失败，请重新发起授权请求” 的错误信息。
- 若 `code` 参数不存在，会显示 “未获取到授权码” 的错误信息。
- 若验证通过，会将 `code` 转发给后端服务。

### 后端处理
`server.js` 服务会接收前端转发的 `code`，使用该 `code` 调用飞书 API 获取 `user_access_token`，并触发 GitHub API 事件。

## GitHub Pages 静态托管与回调处理说明

GitHub Pages 是静态托管服务，无法执行后端返回的 HTML 脚本。因此，我们需要创建静态前端页面来处理回调结果。在本项目中，`server.js` 负责处理飞书授权回调逻辑，当处理完成后，会将结果通过 URL 参数的形式重定向到 `auth-result.html` 页面。

`auth-result.html` 是一个静态前端页面，它会从 URL 参数中获取 `success` 和 `message`，并根据这些参数显示授权成功或失败的信息。具体来说：
- 当 `success` 为 `true` 时，显示授权成功信息。
- 当 `success` 为 `false` 时，显示授权失败信息，并附带具体的错误消息。

这样，通过静态页面 `auth-result.html` 就可以在 GitHub Pages 上正确展示回调结果了。