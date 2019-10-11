

declare namespace Express {
  export interface RequestData {
    REPOS_PATH: string;
    MAIN_BRANCH: string;
  }

  export interface RequestHelpers {
    getRepos: ArcanumAPI.GetRepos;
    handleError: ArcanumAPI.HandleError;
    execute: ArcanumAPI.Execute;
  }

  export interface Request {
    data: RequestData;
    helpers: RequestHelpers;
  }
}