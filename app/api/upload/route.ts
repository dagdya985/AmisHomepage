import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, putFile } from '@/api/auth/github/github-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const privateKey = formData.get('privateKey') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
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

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // 验证文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // 生成文件名
    const filename = `${Date.now()}_${file.name}`;
    const path = `public/images/config/${filename}`;

    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString('base64');

    // 1. 签名 JWT
    const jwt = signAppJwt(appId, privateKey);

    // 2. 获取安装 ID
    const installationId = await getInstallationId(jwt, owner, repo);

    // 3. 创建安装令牌
    const token = await createInstallationToken(jwt, installationId);

    // 4. 上传文件到 GitHub
    await putFile(token, owner, repo, path, content, `Upload image: ${filename}`, branch);

    // 返回文件路径
    const relativePath = `/images/config/${filename}`;

    return NextResponse.json({ success: true, path: relativePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
