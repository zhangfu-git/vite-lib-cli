#! /usr/bin/env node

import { Command } from 'commander';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import downloadGitRepo from 'download-git-repo';
import path from 'path';

const program = new Command();

const REPO = 'zhangfu-git/vite-lib-template#main';

program
  .name('vite-lib-cli')
  .description('SDK库初始化脚手架, 支持IE11配置')
  .version('0.0.1')

program.command('create')
.description('创建一个lib项目, 支持es2015转换、支持ie11转换')
.argument('[name]', '项目文件夹名称')
.action(async(folderName='lib_demo') => {
  /** 项目已存进行错误提示, 并且终止 */
  if (fs.existsSync(folderName)) {
    return console.log(logSymbols.error, chalk.red('The project already exsists!'));
  }
  const dir = path.join(process.cwd(), folderName); 
  // 创建文件夹
  fs.mkdirSync(dir);

  /** 获取用户版本号 */
  const name_version = await getProjectNameAndVersion();

  /** 开始下载模版 */
  const isDownloadSuccess = await downloadTemplate(REPO, dir);
  if (!isDownloadSuccess) return;

  /** 修改模版 */
})

program.parse(process.argv);

// 获取项目名称和版本号
function getProjectNameAndVersion() {
  return inquirer.prompt([
    {
      name: 'projectName',
      message: '项目名称',
      default: 'sdk'
    },
    {
      name: 'projectVersion',
      message: '项目版本号',
      default: '1.0.0'
    }
  ])
}

function downloadTemplate(repo, dir) {
  const spinner = ora('正在下载模版');
  spinner.start();
  return new Promise((resolve) => {
 
    downloadGitRepo(repo, dir, (err) => {
      if (!err) {
        spinner.succeed();
        return resolve(true);
      }
      spinner.fail();
      console.log(logSymbols.error, chalk.red(err))
      resolve(false);
    })
  });
}