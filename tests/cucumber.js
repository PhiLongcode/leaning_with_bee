/** @type {import('@cucumber/cucumber').IConfiguration} */
export default {
  paths: ['features/**/*.feature'],
  import: ['support/**/*.ts', 'step-definitions/**/*.ts'],
  format: [
    '@serenity-js/cucumber',
    'progress-bar',
    'html:reports/cucumber-report.html',
  ],
  formatOptions: {
    snippetInterface: 'async-await',
    specDirectory: 'features',
  },
};
