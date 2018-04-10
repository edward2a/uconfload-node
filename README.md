# uConfLoad
**The Universal Config Loader**

==== Code can be _not production quality_, feedback welcome ====

## TL;DR (How to?)
You can check the _very basic_ tests/test.js.
```js
// load module
const uconfload = require('uconfload');

// load -c arg for config file location
const args = uconfload.loadArgs();

// load config file
const config = uconfload.loadConfig(args.config);

// update config with env vars
uconfload.loadEnv(config);

```

## Why?
Simple, I wanted to have something that I find relatively simple, that I can use in container and non-container applications, and that will be the same across different programming languages (check uconfload for python also).

## But there is _blah_!
Yes, I know, but this makes my life easier by (maybe) using _blah_ as an underlying component.

## The details
The following functions are available as part of the package:
- loadArgs
- loadConfig
- loadEnv

### loadArgs
Parse command line arguments. Only '-c|--config' supported at the moment, to indicate where the config file is located.
Returns a Namespace object.

### loadConfig
Read and (YAML)parse the config file.
Returns a dictionary (associative array; hash; dict; etc.) object.

### loadEnv
Parse the passed object and update the keys starting with 'env:\<type\>:' with the corresponding environment variable.
Logs an error if a required environment variable is not present.

Supported \<type\> conversions are:
- str -> no conversion
- list -> convert a CSV to [] (array) object
- bool -> convert _[Nn0]o?|[Ff]alse_ or _\[yY1\](es)?|[Tt]rue_ to corresponding boolean object
- int|float -> convert to number object
