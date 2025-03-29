import { trim } from 'lodash';

export const castCommaListEnvVarToArray = (envVar: string): Array<string> => {
  return envVar ? envVar?.split(',')?.map(trim) : [];
};
