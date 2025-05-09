# 从环境变量中获取 DEPLOY_TOKEN
$DEPLOY_TOKEN = $env:DEPLOY_TOKEN

if (-not $DEPLOY_TOKEN) {
    Write-Error "未从环境变量中获取到 DEPLOY_TOKEN，请检查配置"
    exit 1
} else {
    Write-Host "成功从环境变量读取 DEPLOY_TOKEN: $DEPLOY_TOKEN"
}

# 设置请求头，包含认证信息
$headers = @{
    "Authorization" = "token $DEPLOY_TOKEN"
}

# 发送请求到 GitHub API，获取指定仓库的信息
Invoke-WebRequest -Uri "https://api.github.com/repos/motojay/ai_study/" -Headers $headers


### 3. 临时修改 DNS
你可以临时将 DNS 服务器修改为公共 DNS，如 Google 的 `8.8.8.8` 和 `8.8.4.4` 或者阿里云的 `223.5.5.5` 和 `223.6.6.6`。修改完成后再次运行脚本。

### 4. 检查防火墙和代理设置
防火墙或者代理设置可能会阻止对 `api.github.com` 的访问。你可以暂时关闭防火墙或者检查代理设置是否正确。