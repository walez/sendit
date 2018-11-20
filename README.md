# Send IT

SendIT is a courier service that helps users deliver parcels to different destinations.

## Basic Concepts behind the architecture

1. All the code you write resides within `src` folder and gets built when you start the server in `dist` folder.
2. All navigation routes are placed in `src/app/routes` folder.
3. All your logic is written in controllers placed within `src/app/controllers` folder.
4. If you have utility functions which you will use across controllers, put them in `src/app/utils` folder.
7. All your static files and content is to be placed in the `public` folder.

## Deployment instructions

### Normal Installation

1. Install node.js and git
2. Add them to path if not already in path.
4. Run npm install to get all the dependencies installed
5. cd to the project directory
6. Run `npm run-script start-dev`

## Building the code

1. Run `npm run build` to build the ES6 code, copy relevant files

## Logging Middleware

Winston logging can be added by using the winston library.
`logger.log('error', 'Internal server error - ' + err.stack, err);`

By default, logging occurs in console in the development environment and gets written to files within logs folder in other environments.

based off: [Node Skeleton](https://github.com/tvvignesh/node-skeleton)