#!/usr/bin/env node

const uconfload = require('uconfload');

const args = uconfload.loadArgs();
const config = uconfload.loadConfig(args.config);
uconfload.loadEnv(config);
console.log(args);
console.log(config);
