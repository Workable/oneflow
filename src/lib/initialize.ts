import { initializeConfig } from './questions';
import * as inquirer from 'inquirer';
import * as chalk from 'chalk';
import * as figlet from 'figlet';
import * as homeConfig from 'home-config';
const config = homeConfig.load('.oneflowrc');
const packageJson = require('../../package.json');

export default async function initialize() {
  const sampleConfig = require('../../config.sample.json');
  Object.assign(sampleConfig, config);
  console.log(chalk.yellow(figlet.textSync(packageJson.name, { horizontalLayout: 'full' })));
  console.log(chalk.magenta(`Welcome to ${packageJson.name}. Please follow the steps below to configure it!\n\n`));

  const answers = await inquirer.prompt(initializeConfig(sampleConfig));
  Object.assign(config, sampleConfig, answers, { initialized: true });

  config.save();
  console.log(chalk.magenta('Your ~/.oneflowrc file has been created! You are ready to use oneflow.'));
  console.log(chalk.magenta('Type oneflow -h to see available commands'));
  console.log(
    `${chalk.magenta('To add autocomplete support type:')} ${chalk.bold.magenta('oneflow completion >> ~/.bashrc')}`
  );
}
