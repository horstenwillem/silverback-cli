
export function createService(name, kebabed, plural, uppercase) {
  return `
import { ${uppercase} } from '../models/${kebabed}.model';
import { Filters } from '../models/filters.model';
import * as ${name}Repository from '../repositories/${kebabed}.repository';

/**
 * Return all ${plural}
 */
export function getAll(filters: Filters): Promise<${uppercase}[]> {
  return ${name}Repository.getAll(filters);
}
`;
}
