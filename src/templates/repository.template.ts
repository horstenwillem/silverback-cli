export function createRepository(kebabed, plural, uppercase) {
  return `
import { db } from '../lib/db';
import { logger } from '../lib/logger';
import { Filters } from '../models/filters.model';
import { ${uppercase} } from '../models/${kebabed}.model';
import { tableNames, defaultFilters } from '../constants';
import { applyPagination, applySorting, applySearch } from '../lib/utils';


/**
 * Return all ${plural}
 */
export async function getAll(options: Filters = defaultFilters): Promise<${uppercase}[]> {
  const searchFields = ['id'];
  const sortFields = [];

  const query = db.select('id')
    .from(tableNames.${uppercase.toUpperCase()});

  applyPagination(query, options);
  applySearch(query, options, searchFields);
  applySorting(query, options, sortFields);

  logger.debug(\`Get all ${plural}: \${query.toString()}\`);
  return await query;
}
`;
}
