import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { signAppJwt, getInstallationId, createInstallationToken, putFile } from '@/api/auth/github/github-client';

export async function POST(request: NextRequest) {
  try {
    const { config, privateKey } = await request.json();
    
    if (!config) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    if (!privateKey) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    const appId = process.env.GITHUB_APP_ID;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_REPO_BRANCH;

    if (!appId || !owner || !repo || !branch) {
      return NextResponse.json({ error: 'GitHub configuration not set in environment variables' }, { status: 500 });
    }

    // 1. 签名 JWT
    const jwt = signAppJwt(appId, privateKey);

    // 2. 获取安装 ID
    const installationId = await getInstallationId(jwt, owner, repo);

    // 3. 创建安装令牌
    const token = await createInstallationToken(jwt, installationId);

    // 4. 更新本地配置文件
    const configPath = path.join(process.cwd(), 'config.json');
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    // 5. 提交到 GitHub
    const content = Buffer.from(JSON.stringify(config, null, 2)).toString('base64');
    await putFile(token, owner, repo, 'config.json', content, 'Update config.json', branch);

    return NextResponse.json({ success: true, message: '配置已保存并提交到 GitHub' });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
