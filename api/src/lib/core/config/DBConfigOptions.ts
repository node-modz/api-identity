import { ConnectionOptions } from "typeorm";


export type DBConfigOptions = ConnectionOptions & {
  url?: string;
};
