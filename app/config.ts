import configData from "../config.json";

export type Language = "zh" | "en";

export type I18nText = {
  zh: string;
  en: string;
};

export interface SiteConfig {
  name: string;
  title: string;
  url: string;
  ogImage: string;
  author: string;
  description: I18nText;
  keywords: string[];
  footer: I18nText;
}

export interface ProfileConfig {
  name: string;
  avatar: string;
  location: I18nText;
  focus: I18nText;
  hobbies: I18nText;
  motto: I18nText;
  typeWriterTexts: {
    zh: string[];
    en: string[];
  };
  currentFocus: Array<{
    icon: string;
    text: I18nText;
  }>;
}

export interface LinkConfig {
  url: string;
  show?: boolean;
  title: I18nText;
  description?: I18nText;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  description: I18nText;
  url: string;
  image: string;
  tags: string[];
  icon: string;
  gradient: string;
}

export interface Skill {
  name: string;
  level: number;
  color: string;
  icon: string;
}

export interface TechItem {
  name: string;
  color: string;
  icon: string;
}

interface AppConfig {
  site: SiteConfig;
  profile: ProfileConfig;
  links: Record<string, LinkConfig>;
  projects: {
    featured: Project[];
    moreProjectsUrl: string;
  };
  skills: Skill[];
  techStack: {
    backend: TechItem[];
    mobile: TechItem[];
    frontend: TechItem[];
  };
  translations: {
    zh: Record<string, string>;
    en: Record<string, string>;
  };
}

const appConfig: AppConfig = configData as AppConfig;

export const linksConfig = appConfig.links;

export const projectsConfig: Project[] = appConfig.projects.featured;

export const moreProjectsConfig = {
  url: appConfig.projects.moreProjectsUrl,
  title: {
    zh: appConfig.translations.zh.moreProjects || "查看更多项目",
    en: appConfig.translations.en.moreProjects || "View More Projects",
  },
};

export const skillsConfig: Skill[] = appConfig.skills;

export const socialConfig = {
  email: {
    url: appConfig.links.email?.url || "",
    icon: appConfig.links.email?.icon || "fas fa-envelope",
    color: "from-blue-400 to-blue-600",
  },
};

export const techStackConfig = {
  backend: appConfig.techStack.backend as TechItem[],
  mobile: appConfig.techStack.mobile as TechItem[],
  frontend: appConfig.techStack.frontend as TechItem[],
};

export const aboutMeConfig = {
  name: appConfig.profile.name,
  location: appConfig.profile.location,
  focus: appConfig.profile.focus,
  hobbies: appConfig.profile.hobbies,
  currentFocus: appConfig.profile.currentFocus,
  motto: appConfig.profile.motto,
};

export const translations = {
  zh: {
    siteTitle: appConfig.translations.zh.siteTitle || appConfig.site.title,
    typeWriterText: appConfig.profile.typeWriterTexts.zh[0],
    typeWriterText2: appConfig.profile.typeWriterTexts.zh[1],
    quickLinks: appConfig.translations.zh.quickLinks,
    footer: appConfig.site.footer.zh,
    nav: {
      blog: appConfig.links.blog?.title.zh || "Blog",
      github: appConfig.links.github?.title.zh || "GitHub",
      gitee: appConfig.links.gitee?.title.zh || "Gitee",
    },
    aboutMe: appConfig.translations.zh.aboutMe,
    techStack: appConfig.translations.zh.techStack,
    backend: appConfig.translations.zh.backend,
    mobile: appConfig.translations.zh.mobile,
    frontend: appConfig.translations.zh.frontend,
    currentFocus: appConfig.translations.zh.currentFocus,
    featuredProjects: appConfig.translations.zh.featuredProjects,
    skills: appConfig.translations.zh.skills,
    viewProject: appConfig.translations.zh.viewProject,
    moreProjects: appConfig.translations.zh.moreProjects,
  },
  en: {
    siteTitle: appConfig.translations.en.siteTitle || appConfig.site.title,
    typeWriterText: appConfig.profile.typeWriterTexts.en[0],
    typeWriterText2: appConfig.profile.typeWriterTexts.en[1],
    quickLinks: appConfig.translations.en.quickLinks,
    footer: appConfig.site.footer.en,
    nav: {
      blog: appConfig.links.blog?.title.en || "Blog",
      github: appConfig.links.github?.title.en || "GitHub",
      gitee: appConfig.links.gitee?.title.en || "Gitee",
    },
    aboutMe: appConfig.translations.en.aboutMe,
    techStack: appConfig.translations.en.techStack,
    backend: appConfig.translations.en.backend,
    mobile: appConfig.translations.en.mobile,
    frontend: appConfig.translations.en.frontend,
    currentFocus: appConfig.translations.en.currentFocus,
    featuredProjects: appConfig.translations.en.featuredProjects,
    skills: appConfig.translations.en.skills,
    viewProject: appConfig.translations.en.viewProject,
    moreProjects: appConfig.translations.en.moreProjects,
  },
};

export const siteConfig = appConfig.site;
