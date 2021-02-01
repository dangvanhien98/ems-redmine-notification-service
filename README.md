# nestjs-structure

NestJS project structure

## Documentation

-[OpenAPI](docs/openAPI.yml)
 
## Configuration

1. Create a `.env` file
    - Create the [.env](.env) file to `.env` to fix Environment.
2. Configuration database
    - Edit the file in the [config](src/common/config/mysql.config.js) folder.

## Installation

```sh
# 1. Nest CLI
$ npm i -g @nestjs/cli
# 2. Create a new Nest project
$ nest new project-name
```

## Development

```sh
$ npm run start
```

Run [http://localhost:3000](http://localhost:3000)

## Test

```sh
npm test # exclude e2e
npm run test:e2e
```

## Folders

```js
+-- dist                                         // Source build
+-- src                                          // Soucer code for the application
|   +-- common                                   // Global Nest Module
|   |    +-- config                              // Environment Configuration
|   |        +-- mysql.config.js                 // Configuration database
|   |	 +-- connect		                     // Connect to database
|   |    +-- decorator                           // Decorator is an expression which returns a function and can take a target, name and property descriptor as arguments
|   |    +-- filter                              // Handle exceptions
|   |    +-- guards                              // Guards determine request will be handled by the route handler or not, depending on certain conditions present at run-time
|   |    +-- interceptors                        // Guards determine request will be handled by the route handler or not, depending on certain conditions present at run-time
|   |    +-- pipes                               // Transformation and validation 
|   |    +-- providers                           // Inject dependencies
|   |    +-- middleware                          // Middleware is a function which is called before the route handler
|   |    +-- constants                           // Nest constants    
|   |    +-- utils                               // Nest Utils
|   +-- module                                   // Nest Module
|   |    +-- user               
|   |    |   +-- user.controller.ts              // Controllers are responsible for handling incoming requests and returning responses to the client
|   |	 |   +-- user.model.i.ts                 // Extend class interface
|   |    |   +-- user.module.ts                  // Nest Module  
|   |    |   +-- user.service.ts                 // Service will be responsible for providing some data, some validation logic or logic to validate  
|   +-- app.controller.ts                        // Basic controller sample with a single route.
|   +-- app.module.ts                            // The root module of the application
|   +-- app.service.ts		                     // File service for application
|   +-- main.ts		                             // The entry file of the application which uses the core function NestFactory to create a Nest application instance.
+-- docs                                         // Document api
|   +-- dll
|   |	+-- create_table.sql                     // This file create table database
|   +-- openAPI.yml                              // Decument OpenAPI
+-- test                                         // Jest Testing
+-- .env              		                     // The spec files are unit tests for your source files
+-- README.md                                    // This instructions file
+-- nest-cli.json                                // File Nest CLI
+-- package.json                                 // This file holds various metadata relevant to the project
+-- tsconfig.json                                // This file specifies the root files and the compiler options required to compile the project
```

## Implements

- See [app](src/app.ts)
    - [main.ts](src/main.ts): The entry file of the application which uses the core function NestFactory to create a Nest application instance. 
    - [app.module](src/app.module.ts): The root module of the application.
    - [app.controller.ts](src/app.controller.ts): Basic controller sample with a single route.
    - [app.service.ts](src/app.service.ts): File service for application
- [Connect to database](src/common/connect/connectDB.ts)
- [Decorator expression](src/common/decorator/description.txt)
- [Nest Constants](src/common/constants/description.txt)
- [Global Exception Filter](src/common/filters/description.txt)
- [Global Authenticated Guard](src/common/guards/description.txt)
- [Global Logging Middleware](src/common/middleware/description.txt)
- [Transformation and validation](src/common/pipes/description.txt)
- [Inject dependencies](src/common/providers/description.txt)
- [Nest Utils](src/common/utils/description.txt)
- Nest module
  - [Controller](src/module/user/user.controller.ts)
  - [Model extend interface](src/module/user/user.model.i.ts)
  - [Module](src/module/user/user.module.ts)
  - [Service](src/module/user/user.service.ts) 

### Links

- [Nest Starter](https://github.com/CatsMiaow/nestjs-starter)
- [Nest Sample](https://github.com/nestjs/nest/tree/master/sample)
- [Awesome Nest](https://github.com/juliandavidmr/awesome-nestjs)
- [NestJS](https://docs.nestjs.com)

