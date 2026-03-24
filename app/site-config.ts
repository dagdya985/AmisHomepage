import configData from "../config.json";
import type { SiteConfig, ProfileConfig, LinkConfig, Project, Skill, TechItem, Language, I18nText, GuestbookConfig, FriendLinksConfig } from "../types";

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
  guestbook?: GuestbookConfig;
  friendLinks?: FriendLinksConfig;
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

export const guestbookConfig = appConfig.guestbook || {
  enabled: false,
  walineUrl: "",
  title: { zh: "留言板", en: "Guestbook" }
};

export const friendLinksConfig = appConfig.friendLinks || {
  enabled: false,
  title: { zh: "友链", en: "Friend Links" },
  links: []
};

export const siteConfig = appConfig.site;
export type { Language, I18nText };
