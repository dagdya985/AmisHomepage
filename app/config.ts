// 链接配置
export const linksConfig = {
  blog: {
    url: "https://www.amisblog.cn",
    title: {
      zh: "Amis的博客",
      en: "Amis's Blog",
    },
    description: {
      zh: "记录技术文章和生活感悟",
      en: "Technical articles and life insights",
    },
  },
  github: {
    url: "https://github.com/AmisKwok",
    title: {
      zh: "GitHub",
      en: "GitHub",
    },
    description: {
      zh: "开源项目和代码仓库",
      en: "Open source projects and code repositories",
    },
  },
  gitee: {
    url: "https://gitee.com/AmisKwok",
    title: {
      zh: "Gitee",
      en: "Gitee",
    },
    description: {
      zh: "国内代码托管平台",
      en: "Domestic code hosting platform",
    },
  },
  email: {
    url: "mailto:amiskwokk@gmail.com",
    title: {
      zh: "邮箱",
      en: "Email",
    },
  },
};

// 多语言文本配置
export const translations = {
  zh: {
    siteName: "Amis的主页",
    siteTitle: "欢迎来到Amis的主页",
    typeWriterText: "记录技术文章和生活感悟",
    typeWriterText2: "热爱编程，追求极致，永不止步",
    quickLinks: "快速链接",
    footer: "© 2026 Amis的个人主页. All Rights Reserved.",
    nav: {
      blog: "Blog",
      github: "GitHub",
      gitee: "Gitee",
    },
  },
  en: {
    siteName: "Amis's Homepage",
    siteTitle: "Welcome to Amis's Homepage",
    typeWriterText: "Recording technical articles and life insights",
    typeWriterText2: "Passionate about coding, pursuing excellence, never stopping",
    quickLinks: "Quick Links",
    footer: "© 2026 Amis's Personal Homepage. All Rights Reserved.",
    nav: {
      blog: "Blog",
      github: "GitHub",
      gitee: "Gitee",
    },
  },
};

export type Language = "zh" | "en";
