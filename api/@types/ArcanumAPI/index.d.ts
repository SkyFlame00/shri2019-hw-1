declare namespace ArcanumAPI {
  type Response = import('express-serve-static-core').Response;

  export interface RoutesConfig {
    REPOS_PATH: string;
    MAIN_BRANCH: string;
  }

  export interface ErrorToClient {
    error: boolean;
    message: string;
  }

  export interface ErrorWithCode {
    code?: string;
  }

  export type GetRepos = (path: string) => Promise<string[]>;
  export type HandleError = (res: Response, message?: string) => (error?: Error & ErrorWithCode) => Response;
  export type Execute = (program: string, args: string[], cwd: string) => Promise<string>;
}
