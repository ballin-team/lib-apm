<h1 align="center">
  👀
</h1>

<h1 align="center">
  :left_right_arrow: lib-apm
</h1>

<p align="center">
  Robust logger! 💪
</p>

## :package: Content

- [Technologies](#Technologies)
- [Getting Started](#Getting Started)
- [How to install](#How to install)
- [Config](#Config)

## :hammer_and_wrench: Technologies

We are using the following technologies:

- [cls-hooked](https://www.npmjs.com/package/cls-hooked) - used to create and manage context;
- [tslog](https://tslog.js.org/#/) - used as base for the implementation of the lib-logger;
- [typescript](https://www.typescriptlang.org/)

## :climbing: Getting Started

This lib aims to centralize all the necessary tools for the Ballin Team logs.

## How to install

```bash
npm install @ballin-team/lib-apm
```

## Config

```typeScript
import { Logger } from "@ballin-team/lib-apm";

const logger = Logger.createLogger({
  "name": "lib-logger", // service/ms name
  "minLevel": "debug", // the minimum level to log into the terminal
  "suppressStdOutput": false, // suspend log in terminal
  "transports": [  // custom services to execute methods with logObject as parameter
    {
      "provider": "coralogix", // transport type
      "minLevel": "debug", // the minimum level to execute the transport
      "enabled": true, // activate or not the transport
      "options": { // transport options
        "applicationName": "",
        "privateKey": "",
        "subsystemName": "",
        "category": ""
      }
    },
    {
      "provider": "sentry",
      "minLevel": "info",
      "enabled": true
    },
  ]
});
```

### Habilitar source map para TypeScript:

This feature enables lib-apm to reference a correct line number in your TypeScript source code.

```json
// tsconfig.json
{
  // ...
  "compilerOptions": {
    // ...
    "sourceMap": true,
    // we recommend using a current ES version
    "target": "es2019"
  }
}
```

### Use Cases

#### Basic Implementation

```TypeScript
import { Logger } from "@ballin-team/lib-apm";

const logger = new Logger({
  instanceName: 'service name',
  minLevel: 'info',
  transports: [],
});

logger.setRequestId(123)
logger.silly("I am a silly log.");
logger.trace("I am a trace log with a stack trace.");
logger.debug("I am a debug log.");
logger.info("I am an info log.");
logger.warn("I am a warn log with a json object:", {foo: "bar"});
logger.error("I am an error log.");
logger.fatal(new Error("I am a pretty Error with a stacktrace."));
```

#### Implementation with express

```TypeScript
// logger/index.ts
import { Logger } from '@ballin-team/lib-apm'
import * as dotenv from 'dotenv'
dotenv.config({ path: `./environments/.env.${process.env.NODE_ENV}` });

const configLogger = () => {
  const enableTransport = process.env.NODE_ENV === 'production'
  return new Logger({
    name: "ms_test",
    minLevel: "info",
    suppressStdOutput: false,
    transports: [
      {
        provider: 'coralogix',
        minLevel: 'error',
        enabled: enableTransport,
        options: {
          applicationName: "",
          privateKey: "",
          subsystemName: "",
          category: "",
        }
      },
      {
        provider: 'sentry',
        minLevel: 'info',
        enabled: true
      },
    ]
  })
}

export const logger = configLogger()

// app.ts
import { logger } from './logger';
import express from "express";

export const initApp = async () => {
  const app = express()

  // ...setting other configs and middlewares

  app.use(express.json()); // the "express.json" needs to be instantiated before the "logger.setContext"
  app.use(logger.setContext) // will create context for each request

  // ... routes and middlewares

  return app
};

// middleware/setRequestId.ts
import { NextFunction, Response } from 'express'
import { IRequest } from '../interfaces/request'
import { v4 as uuid } from 'uuid'
import { Logger } from '../logger'


export const setRequestId = (req: IRequest, res: Response, next: NextFunction): void => {
  const requestId = (req.headers['x-request-id'] as string) || uuid()

  req.requestId = requestId

  Logger.setRequestId(requestId)
  Logger.info(req.method,req.path,req.body)

  return next()
};

// Now just call the logger anywhere in your code =)
```

## Transports

### Coralogix

Transport Coralogix aims to capture all logs from the level defined in the setup and insert them as an occurrence in case of error;

## :incoming_envelope: Made by

- :feelsgood: Time de cirurgias
