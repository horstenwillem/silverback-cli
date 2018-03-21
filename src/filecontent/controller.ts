
export function createController(name, kebabed, plural) {
  return `
import * as httpStatus from 'http-status';
import { Router, Request, Response } from 'express';
import { handleAsyncFn } from 'tree-house';
import { responder } from '../lib/responder';
import { ${name}Serializer } from '../serializers/${kebabed}.serializer';
import * as ${name}Service from '../services/${kebabed}.service';

export const routes: Router = Router({ mergeParams: true })
  .get('/', handleAsyncFn(getAll));

/**
 * Return all ${plural}
 */
async function getAll(req: Request, res: Response) {
  const ${plural} = await ${name}Service.getAll(req.query);
  return responder.succes(res, {
    status: httpStatus.OK,
    payload: ${plural},
    serializer: ${name}Serializer,
  });
}
`;
}
