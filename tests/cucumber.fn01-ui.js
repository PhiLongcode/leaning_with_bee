/** @type {import('@cucumber/cucumber').IConfiguration} */
export default {
  paths: ['features/fn01/vocab_learning_ui.feature'],
  import: ['support/**/*.ts', 'step-definitions/**/*.ts'],
  format: [
    '@serenity-js/cucumber',
    'progress-bar',
    'html:reports/cucumber-report.html',
  ],
  formatOptions: {
    snippetInterface: 'async-await',
  },
};
