import fs from 'fs';
import { join } from 'path';
import { execFile } from 'child_process';
import { Response } from 'express-serve-static-core';

export function isRepo(dirPath: string): boolean {
  return fs.existsSync(join(dirPath, '.git'));
}

export async function getRepos(path: string): Promise<string[]> {
  return (await fs.promises.readdir(path, { withFileTypes: true }))
    .filter((entity): boolean => entity.isDirectory() && isRepo(join(path, entity.name)))
    .map((entity): string => entity.name);
}

export function execute(program: string, args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(program, args, { cwd }, (err, out: string) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(out);
      }
    });
  });
}

export function handleError(res: Response, message: string) {
  return (err: Error & ArcanumAPI.ErrorWithCode) => {
    if (!message) {
      switch(err.code) {
        case 'ENOENT':
          message = 'Provided directory does not exist';
          break;
        default:
          message = err.message;
          break;
      }
    }

    const errorToClient: ArcanumAPI.ErrorToClient = {
      error: true,
      message
    };

    res.status(404).json(errorToClient);
  }
}