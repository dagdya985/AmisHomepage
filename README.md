# Amis's Homepage

我的个人主页，使用 Next.js + TypeScript + Tailwind CSS 构建。

## 在线预览

🌐 [https://www.amisweb.cn](https://www.amisweb.cn)

## 功能特性

- 🎨 **现代化设计** - 全屏背景图 + 渐变遮罩 + 动态背景（暗色：星空，亮色：落叶）
- ✍️ **SVG 绘画标题** - 手写风格标题，动态计算 viewBox
- ⌨️ **打字机效果** - 动态打字机文字效果，支持多文本循环
- 👤 **头像动画** - 呼吸光圈效果，悬停放大
- 🔗 **社交链接** - 背景图中心展示 Email、GitHub、Gitee、Blog 等社交链接
- 📋 **关于我卡片** - 从 GitHub README 加载个人信息
- 🌟 **精选项目** - 展示 Vibe Music Server 和 App 等项目，图片悬停放大效果
- 📊 **技能可视化** - 进度条展示技术栈，数字动画效果
- 🌍 **多语言支持** - 支持中文/英文切换，自动检测系统语言
- 🌓 **主题切换** - 支持亮色/暗色模式切换，默认暗色主题，模糊过渡动画，主题适配所有组件
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 🎬 **滚动动画** - 各卡片的淡入/滑入效果
- 🧭 **桌面端导航** - 右上角导航链接到精选项目、关于我、技能，右侧侧边导航
- 📱 **移动端导航** - 移动端左下角简洁的圆形导航按钮
- ⚡ **性能优化** - Next.js Image 图片优化、页面加载动画
- 🔝 **返回顶部** - 滚动时显示返回顶部按钮

## 技术栈

- [Next.js 16](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS
- [Font Awesome](https://fontawesome.com/) - 图标库

## 快速开始

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 开发模式

```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm dev
```

访问 http://localhost:9998

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 pnpm
pnpm build
```

### 启动生产服务器

```bash
# 使用 npm
npm start

# 或使用 pnpm
pnpm start
```

## 项目结构

```
.
├── app/
│   ├── components/         # 组件
│   │   ├── DrawnTitle.tsx       # SVG 绘画标题组件
│   │   ├── TypeWriter.tsx       # 打字机效果组件
│   │   ├── LanguageSwitcher.tsx # 语言切换组件
│   │   ├── ThemeSwitcher.tsx    # 主题切换组件
│   │   ├── Avatar.tsx           # 头像组件
│   │   ├── AboutCard.tsx        # 关于我卡片组件
│   │   ├── FeaturedProjects.tsx # 精选项目组件
│   │   ├── Skills.tsx           # 技能可视化组件
│   │   ├── StarryBackground.tsx # 星空动态背景组件（暗色）
│   │   ├── LightBackground.tsx  # 落叶动态背景组件（亮色）
│   │   ├── ThemeTransition.tsx  # 主题切换过渡动画组件
│   │   ├── LoadingScreen.tsx    # 加载动画组件
│   │   ├── SectionNav.tsx       # 桌面端侧边导航组件
│   │   └── MobileNav.tsx        # 移动端底部导航组件
│   ├── contexts/           # React Context
│   │   ├── LanguageContext.tsx  # 语言管理
│   │   └── ThemeContext.tsx     # 主题管理
│   ├── hooks/              # 自定义 Hooks
│   │   └── useScrollAnimation.ts # 滚动动画 Hook
│   ├── config.ts           # 链接配置和翻译
│   ├── config/
│   │   └── themeConfig.ts       # 主题配色配置
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   ├── metadata.ts         # SEO 元数据配置
│   ├── sitemap.ts          # 网站地图
│   └── page.tsx            # 首页
├── public/
│   ├── images/             # 图片资源
│   │   ├── index.jpg       # 暗色主题背景图（银河）
│   │   ├── index4.jpg      # 亮色主题背景图（迷雾森林）
│   │   ├── index2.jpg      # 项目图片
│   │   ├── index3.jpg      # 项目图片
│   │   ├── avatar.jpg      # 头像
│   │   └── icon.png        # 网站图标
│   ├── markdown/           # Markdown 文件
│   │   └── aboutMeContent.md # 关于我内容
│   ├── robots.txt          # 爬虫规则
│   └── svg/                # SVG 图标
├── .env.example            # 环境变量示例
├── Dockerfile              # Docker 配置
├── docker-compose.yml      # Docker Compose 配置
├── next.config.ts          # Next.js 配置
├── tailwind.config.ts      # Tailwind 配置
└── package.json
```

## 配置说明

### 修改链接

编辑 `app/config.ts` 中的 `linksConfig`：

```typescript
export const linksConfig = {
  blog: {
    url: "https://your-blog.com",
    title: { zh: "博客", en: "Blog" },
    description: { zh: "描述", en: "Description" },
  },
  github: {
    url: "https://github.com/yourname",
    // ...
  },
  // ...
};
```

### 修改项目配置

编辑 `app/config.ts` 中的 `projectsConfig`：

```typescript
export const projectsConfig: Project[] = [
  {
    id: "project-id",
    name: "项目名称",
    description: {
      zh: "项目描述",
      en: "Project description",
    },
    url: "https://github.com/yourname/project",
    image: "/images/project.jpg",
    tags: ["Tag1", "Tag2"],
    icon: "fas fa-icon",
    gradient: "from-blue-500 to-purple-600",
  },
  // ...
];
```

### 修改技能配置

编辑 `app/config.ts` 中的 `skillsConfig`：

```typescript
export const skillsConfig: Skill[] = [
  { name: "技能名称", level: 90, color: "from-blue-500 to-purple-600", icon: "fas fa-icon" },
  // ...
];
```

### 修改翻译文本

编辑 `app/config.ts` 中的 `translations`：

```typescript
export const translations = {
  zh: {
    siteTitle: "你的主页标题",
    // ...
  },
  en: {
    // ...
  },
};
```

### 更换背景图

将背景图片放入 `public/images/index.jpg`，建议使用 1920x1080 或更高分辨率的图片。

### 更换头像

将头像图片放入 `public/images/avatar.jpg`，建议使用 512x512 像素的图片。

### 更换网站图标

将图标放入 `public/images/icon.png`，建议使用 512x512 像素的 PNG 图片。

### 更换关于我内容

编辑 `public/markdown/aboutMeContent.md` 文件。

## 自定义

### 打字机效果

在 `app/page.tsx` 中修改 TypeWriter 组件参数：

```tsx
<TypeWriter 
  texts={[t("typeWriterText"), t("typeWriterText2")]} 
  typeSpeed={120}      // 打字速度 (ms)
  deleteSpeed={80}     // 删除速度 (ms)
  delay={800}          // 开始延迟 (ms)
  pauseTime={2000}     // 暂停时间 (ms)
/>
```

### 头像大小

在 `app/page.tsx` 中修改 Avatar 组件的 size 属性：

```tsx
<Avatar 
  src="/images/avatar.jpg" 
  alt="Amis" 
  size={140}  // 头像大小 (px)
  className="mb-6"
/>
```

### 卡片样式

卡片使用 Tailwind CSS 类名控制样式：

```tsx
className="group bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300"
```

## 部署

### 第一步：获取代码

选择以下任一方式：

**方式 A：Fork（推荐）**
- 点击右上角 `Fork` 按钮，将项目 Fork 到你的 GitHub 账户
- 方便后续拉取更新

**方式 B：直接克隆**
```bash
git clone https://github.com/AmisKwok/AmisHomepage.git
```

### 第二步：克隆到本地

**如果选择了 Fork：**
```bash
git clone https://github.com/你的用户名/AmisHomepage.git
cd AmisHomepage
```

**如果选择了直接克隆：**
```bash
cd AmisHomepage
```

### 第三步：安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 第四步：修改配置

- 修改 `app/config.ts` 中的链接、项目和技能配置
- 替换 `public/images/` 中的背景图、头像和图标
- 编辑 `public/markdown/aboutMeContent.md` 修改关于我内容

### 第五步：环境变量配置

复制环境变量示例文件：

```bash
cp .env.example .env
```

`.env` 文件内容：

```env
PORT=9998
```

你可以根据需要修改端口号。

### 第六步：推送到你的仓库（Fork 用户）

```bash
git add .
git commit -m "Update config"
git push origin main
```

### 第七步：部署到 Vercel

1. 访问 [Vercel](https://vercel.com/)
2. 点击 `New Project`
3. 导入你的仓库
4. 点击 `Deploy` 完成部署

### 第八步：绑定自定义域名（可选）

- 在 Vercel 项目设置中添加域名
- 按提示配置 DNS 解析

### 拉取更新（Fork 用户）

```bash
git remote add upstream https://github.com/AmisKwok/AmisHomepage.git
git fetch upstream
git merge upstream/main
```

---

## 其他部署方式

### Docker 部署

**使用 Docker Compose（推荐）**

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

**使用 Docker 命令**

```bash
# 构建镜像
docker build -t amis-homepage .

# 运行容器
docker run -d -p 9998:9998 --name amis-homepage amis-homepage
```

访问 http://localhost:9998

### 服务器部署

**方式一：使用 PM2**

1. 安装 PM2
```bash
npm install -g pm2
# 或
pnpm add -g pm2
```

2. 安装依赖并构建项目
```bash
# 使用 npm
npm install
npm run build

# 或使用 pnpm
pnpm install
pnpm build
```

3. 启动服务
```bash
# 使用 npm
pm2 start npm --name "amis-homepage" -- start

# 使用 pnpm
pm2 start pnpm --name "amis-homepage" -- start
```

4. 常用命令
```bash
pm2 list                    # 查看所有进程
pm2 logs amis-homepage      # 查看日志
pm2 restart amis-homepage   # 重启
pm2 stop amis-homepage      # 停止
pm2 delete amis-homepage    # 删除

# 开机自启
pm2 startup
pm2 save
```

**方式二：使用 Systemd**

1. 构建项目
```bash
npm run build
```

2. 创建服务文件
```bash
sudo nano /etc/systemd/system/amis-homepage.service
```

3. 写入以下内容
```ini
[Unit]
Description=Amis Homepage
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/AmisHomepage
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

4. 启动服务
```bash
sudo systemctl daemon-reload
sudo systemctl enable amis-homepage
sudo systemctl start amis-homepage
sudo systemctl status amis-homepage
```

**方式三：Nginx 反向代理**

1. 配置 Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:9998;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

2. 重启 Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 静态导出部署

```bash
npm run build
```

将 `dist` 目录部署到任何静态托管服务。

## License

本项目采用 [CC BY-NC-SA 4.0](LICENSE) 许可协议。

**简单来说：**
- ✅ 可以自由分享和修改
- ❌ **禁止商业用途**
- 📋 修改后必须使用相同协议

详见 [LICENSE](LICENSE) 文件。

---

Made with ❤️ by Amis
