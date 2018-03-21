import chalk from 'chalk';
import { writeFileSync, existsSync } from 'fs';
import { upperFirst, kebabCase } from 'lodash';
import * as pluralize from 'pluralize';

import * as contentController from './filecontent';

export default class SilverbackCLI {
  async start(options) {
    try {
      const action = options[2];
      const name = options[3];

      if (!action || !name) throw new Error('Incorrect syntax. Correct syntax is as follows: "create "name"');

      if (action === 'create') {
        this.checkFolderExistance();
        await this.createFiles(name);
      }
      throw new Error(`Action "${action}" is not supported. Supported actions are: [create]`);
    } catch (err) {
      console.log(chalk.red(err));
    }
  }

  async createFiles(name) {
    try {
      const kebabCased = kebabCase(name);
      const pluralized = pluralize.plural(name);

      writeFileSync(`./source/models/${kebabCased}.model.ts`, this.createModel({ name }));
      writeFileSync(`./source/controllers/${kebabCased}.controller.ts`, this.createController(name, kebabCased, pluralized));
      writeFileSync(`./source/services/${kebabCased}.service.ts`, this.createService(name, kebabCased, pluralized));
      writeFileSync(`./source/repositories/${kebabCased}.repository.ts`, this.createRepository(name, kebabCased, pluralized));
      writeFileSync(`./source/serializers/${kebabCased}.serializer.ts`, this.createSerializer(name, pluralized));
    } catch (err) {
      throw err;
    }
  }

  checkFolderExistance() {
    const controllersExist = existsSync('./source/controllers');
    const servicesExists = existsSync('./source/services');
    const modelsExists = existsSync('./source/models');
    const repositoriesExists = existsSync('./source/repositories');
    const serializersExists = existsSync('./source/serializers');

    if (!controllersExist || !servicesExists || !modelsExists || !repositoriesExists || !serializersExists) {
      throw new Error('Not all folders exists!');
    }
  }

  createController(name, kebabed, plural) {
    return contentController.createController(name, kebabed, plural);
  }

  createModel({ name }) {
    return contentController.createModel(upperFirst(name));
  }

  createService(name, kebabed, plural) {
    return contentController.createService(name, kebabed, plural, upperFirst(name));
  }

  createRepository(name, kebabed, plural) {
    return contentController.createRepository(kebabed, plural, upperFirst(name));
  }

  createSerializer(name, plural) {
    return contentController.createSerializer(name, plural);
  }
}
