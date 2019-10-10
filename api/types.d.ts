import { Response } from 'express-serve-static-core';

declare module ArcanumAPI {
  interface RoutesConfig {
    REPOS_PATH: string;
    MAIN_BRANCH: string;
  }

  interface ErrorToClient {
    error: boolean;
    message: string;
  }

  interface ErrorWithCode {
    code?: string;
  }

  type GetRepos = (path: string) => Promise<string[]>;
  type HandleError = (res: Response, message?: string) => (error?: Error & ErrorWithCode) => void;
  type Execute = (program: string, args: string[], cwd: string) => Promise<string>;
}
