import chalk from 'chalk';
import { writeFileSync, existsSync } from 'fs';
import { upperFirst, kebabCase, camelCase } from 'lodash';
import * as pluralize from 'pluralize';

import * as contentController from './templates';

export default class SilverbackCLI {
  async start(options) {
    try {
      const action = options[2];
      const name = options[3];
      const path = process.cwd();

      if (!action || !name) throw new Error('Incorrect syntax. Correct syntax is as follows: create "name"');

      if (action === 'create') {
        this.checkFolderExistance(path);
        this.createFiles(name, path);
      } else {
        throw new Error(`Action "${action}" is not supported. Supported actions are: [create]`);
      }
      console.log(chalk.green('Done! 🦍'));
    } catch (err) {
      console.log(chalk.red(err));
    }
  }

  createFiles(name, path) {
    try {
      const pascalCased = upperFirst(camelCase(name));
      const camelCased = camelCase(name);
      const kebabCased = kebabCase(name);
      const pluralized = pluralize.plural(camelCased);

      writeFileSync(`${path}/src/models/${kebabCased}.model.ts`, this.createModel(pascalCased));
      writeFileSync(`${path}/src/controllers/${kebabCased}.controller.ts`, this.createController(camelCased, kebabCased, pluralized));
      writeFileSync(`${path}/src/services/${kebabCased}.service.ts`, this.createService(camelCased, kebabCased, pluralized, pascalCased));
      writeFileSync(`${path}/src/repositories/${kebabCased}.repository.ts`, this.createRepository(camelCased, kebabCased, pluralized));
      writeFileSync(`${path}/src/serializers/${kebabCased}.serializer.ts`, this.createSerializer(camelCased, pluralized));
    } catch (err) {
      throw err;
    }
  }

  checkFolderExistance(path) {
    const controllersExist = existsSync(`${path}/src/controllers`);
    const servicesExists = existsSync(`${path}/src/services`);
    const modelsExists = existsSync(`${path}/src/models`);
    const repositoriesExists = existsSync(`${path}/src/repositories`);
    const serializersExists = existsSync(`${path}/src/serializers`);

    if (!controllersExist || !servicesExists || !modelsExists || !repositoriesExists || !serializersExists) {
      throw new Error('Not all folders exists!');
    }
  }

  createController(name, kebabCased, plural) {
    return contentController.createController(name, kebabCased, plural);
  }

  createModel(name) {
    return contentController.createModel(upperFirst(name));
  }

  createService(name, kebabCased, plural, pascalCased) {
    return contentController.createService(name, kebabCased, plural, pascalCased);
  }

  createRepository(name, kebabCased, plural) {
    return contentController.createRepository(name, kebabCased, plural, upperFirst(name));
  }

  createSerializer(name, plural) {
    return contentController.createSerializer(name, plural);
  }
}
