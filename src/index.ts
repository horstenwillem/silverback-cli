#!/usr/bin/env node

import SilverbackCLI from './silverback-cli';

const program = new SilverbackCLI();
program.start(process.argv);
