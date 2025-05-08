# 从 secrets.json 文件中读取内容并转换为对象
$secrets = Get-Content -Path "e:\ai_study\ai_study\.trae\secrets.json" | ConvertFrom-Json
# 从对象中获取 GITHUB_TOKEN
$GITHUB_TOKEN = $secrets.GITHUB_TOKEN

# 设置请求头，包含认证信息
$headers = @{
    "Authorization" = "token $GITHUB_TOKEN"
}

# 发送请求到 GitHub API，获取指定仓库的信息
Invoke-WebRequest -Uri "https://api.github.com/repos/motojay/ai_study/" -Headers $headers


### 3. 临时修改 DNS
你可以临时将 DNS 服务器修改为公共 DNS，如 Google 的 `8.8.8.8` 和 `8.8.4.4` 或者阿里云的 `223.5.5.5` 和 `223.6.6.6`。修改完成后再次运行脚本。

### 4. 检查防火墙和代理设置
防火墙或者代理设置可能会阻止对 `api.github.com` 的访问。你可以暂时关闭防火墙或者检查代理设置是否正确。

修改后的 `e:\ai_study\ai_study\your_script.ps1` 脚本无需改动，其内容如下：