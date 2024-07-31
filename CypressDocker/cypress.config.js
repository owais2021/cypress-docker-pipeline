const { defineConfig } = require('cypress');

// Load environment-specific configurations
const qaConfig = require('./cypress/config/QA-config.config.js');
const stageConfig = require('./cypress/config/stage-config.config.js');
const prodConfig = require('./cypress/config/prod-config.config.js');

let envConfig;

switch (process.env.CYPRESS_ENV) {
  case 'qa':
    envConfig = qaConfig;
    break;
  case 'stage':
    envConfig = stageConfig;
    break;
  case 'prod':
    envConfig = prodConfig;
    break;
  default:
    envConfig = qaConfig;
}

// Ensure envConfig is defined and has a baseUrl property
if (!envConfig || !envConfig.baseUrl) {
  throw new Error('Invalid configuration: baseUrl is missing');
}

module.exports = defineConfig({
  e2e: {
    baseUrl: envConfig.baseUrl, // Move baseUrl inside the e2e object

    // Remove the deprecated experimentalSessionAndOrigin
    // experimentalSessionAndOrigin: true, 

    setupNodeEvents(on, config) {
      // Implement node event listeners here if needed
    },

    // Screenshot and video configuration
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos/testExecutionVideos",

    // Report configuration
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      configFile: "reporter-config.json",
      inlineAssets: true,
      toConsole: true,
    },
  },
});
