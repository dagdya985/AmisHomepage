/**
 * 环境变量类型定义
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // GitHub App 配置
      GITHUB_APP_ID: string
      GITHUB_REPO_OWNER: string
      GITHUB_REPO_NAME: string
      GITHUB_REPO_BRANCH: string
      
      // Server 配置
      PORT: string
    }
  }
}

export {}
