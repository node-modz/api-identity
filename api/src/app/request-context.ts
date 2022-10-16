import { Request, Response } from "express";
import * as ioRedis from "ioredis";

export type RequestContext = {
  req: Request;
  res: Response;
  redis: ioRedis.Redis;
  user: any;
};
