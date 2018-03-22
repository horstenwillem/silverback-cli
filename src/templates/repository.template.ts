export function createRepository(name, kebabed, plural, uppercase) {
  return `
import { db, selectAndCount, parseTotalCount } from '../lib/db';
import { logger } from '../lib/logger';
import { Filters } from '../models/filters.model';
import { applyPagination, applySorting, applySearch } from '../lib/filter';
import { tableNames, defaultFilters } from '../constants';
import { ${uppercase} } from '../models/${kebabed}.model';

const defaultReturnValues = ['id'];

/**
 * Create new ${name}
 */
export async function create(values: ${uppercase}): Promise<${uppercase}> {
  const query = db.insert(values, defaultReturnValues)
    .into(tableNames.${plural.toUpperCase()});

  logger.debug(\`Create new ${name}: \${query.toString()}\`);
  return await query;
}


/**
 * Return all ${plural}
 */
export async function getAll(options: Filters = {}): Promise<{ data: ${uppercase}[], totalCount: number }> {
  const allOptions = Object.assign({}, defaultFilters, options);
  const searchFields = ['id'];
  const sortFields = [];

  const query = selectAndCount(db, defaultReturnValues)
    .from(tableNames.${plural.toUpperCase()});

  applyPagination(query, allOptions);
  applySearch(query, allOptions, searchFields);
  applySorting(query, allOptions, sortFields);
  logger.debug(\`Get all ${plural}: \${query.toString()}\`);

  const data = await query;
  return { data, totalCount: parseTotalCount(data) };
}


/**
 * Get a ${name} by id
 */
export async function getById(id: string): Promise<${uppercase}> {
  const query = db.select(defaultReturnValues)
    .where('id', id)
    .from(tableNames.${plural.toUpperCase()})
    .first();

  logger.debug(\`Get ${name} by id: \${query.toString()}\`);
  return await query;
}
`;
}
