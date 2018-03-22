# Silverback-cli

Silverback Command Line Interface utility, to create a default set of files/classes/functions

## Installation

Install via npm

```shell
npm install -g silverback-cli
```

## Usage

> The silverback-cli accepts names in kebab-case, camelCase or PascalCase

```sh
silverback create user
```

**This creates the following:**

* user.model.ts

```javascript
export interface User {
  id?: string;
}
```

* user.controller.ts

```javascript
import * as httpStatus from 'http-status';
import { Router, Request, Response } from 'express';
import { handleAsyncFn } from 'tree-house';
import { responder } from '../lib/responder';
import { userSerializer } from '../serializers/user.serializer';
import * as userService from '../services/user.service';

export const routes: Router = Router({ mergeParams: true })
  .get('/', handleAsyncFn(getAll));

/**
 * Return all users
 */
async function getAll(req: Request, res: Response) {
  const users = await userService.getAll(req.query);
  return responder.succes(res, {
    status: httpStatus.OK,
    payload: users,
    serializer: userSerializer,
  });
}
```

* user.service.ts

```javascript
import { User } from '../models/user.model';
import { Filters } from '../models/filters.model';
import * as userRepository from '../repositories/user.repository';

/**
 * Return all users
 */
export function getAll(filters: Filters): Promise<{ data: User[], totalCount: number }> {
  return userRepository.getAll(filters);
}
```

* user.repository.ts

```javascript
import { db, selectAndCount, parseTotalCount } from '../lib/db';
import { logger } from '../lib/logger';
import { Filters } from '../models/filters.model';
import { applyPagination, applySorting, applySearch } from '../lib/filter';
import { tableNames, defaultFilters } from '../constants';
import { User } from '../models/user.model';

const defaultReturnValues = ['id'];

/**
 * Create new user
 */
export async function create(values: User): Promise<User> {
  const query = db.insert(values, defaultReturnValues)
    .into(tableNames.USERS);

  logger.debug(`Create new user: ${query.toString()}`);
  return await query;
}


/**
 * Return all users
 */
export async function getAll(options: Filters = {}): Promise<{ data: User[], totalCount: number }> {
  const allOptions = Object.assign({}, defaultFilters, options);
  const searchFields = ['id'];
  const sortFields = [];

  const query = selectAndCount(db, defaultReturnValues)
    .from(tableNames.USERS);

  applyPagination(query, allOptions);
  applySearch(query, allOptions, searchFields);
  applySorting(query, allOptions, sortFields);
  logger.debug(`Get all users: ${query.toString()}`);

  const data = await query;
  return { data, totalCount: parseTotalCount(data) };
}


/**
 * Get a user by id
 */
export async function getById(id: string): Promise<User> {
  const query = db.select(defaultReturnValues)
    .where('id', id)
    .from(tableNames.USERS)
    .first();

  logger.debug(`Get user by id: ${query.toString()}`);
  return await query;
}
```

* user.serializer.ts

```javascript
import { Serializer } from 'jsonade';

export const userSerializer = new Serializer('users', {
  keyForAttribute: 'camelCase',
  attributes: [
    'id',
  ],
});
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
