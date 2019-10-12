declare module "*.svg" {
  const content: any;
  export default content;
}

declare namespace ArcanumReact {
  export interface MatchParams {
    repoId?: string;
    commitHash?: string;
    path?: string;
  }
}