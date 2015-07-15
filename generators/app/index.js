'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var mout = require('mout');
var cordova = require('cordova');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  constructor: function(){
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appName', { type: String, required: true });
    this.option('compass', { type: Boolean, required: false });
    this.option('starter', { type: String, required: false });
    this.option('templates', { type: Array, required: false });
    this.option('plugins', { type: Object, required: false });
    this.options.selected = {};

  },

  prompting: {
    testPrompt: function testPrompt(){
      var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to Jad Salhani\'s ' + chalk.red('Ionizer') + ' generator!'
      ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },
},

configuring: {
  commonVariables: function() {
    this.appName = this.appName || this.options.appName || path.basename(process.cwd());
    this.appName = mout.string.pascalCase(this.appName);
    this.appId = this.options.appId || 'com.example.' + this.appName;
    this.appPath = 'app';
    this.root = process.cwd();

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
  },

  packageFiles: function () {
    this.template('_bower.json', 'bower.json');
    this.template('editorconfig', '.editorconfig');
    this.template('_package.json', 'package.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');
    this.template('_gitignore', '.gitignore');
  }
},

writing: {
  cordovaInit: function cordovaInit() {
    var done = this.async();
    cordova.create('.', this.appId, this.appName, function (error) {
      if (error) {
        yeoman.generator.log(chalk.red(error.message + ': Skipping `cordova create`'));
      } else {
        yeoman.generator.log(chalk.red('Created a new Cordova project with name "' + this.appName + '" and id "' + this.appId + '"'));
      }
      done();
    }.bind(this));
  },

  installPlugins: function installPlugins() {
    if (this.plugins.length > 0) {
      yeoman.generator.log(chalk.red('Installing selected Cordova plugins, please wait.'));

        // Turns out plugin() doesn't accept a callback so we try/catch instead
        try {
          cordova.plugin('add', this.plugins);
        } catch (e) {
          yeoman.generator.log(e);
          this.log.error(chalk.red('Please run `yo ionizer` in an empty directory, or in that of an already existing cordova project.'));
          process.exit(1);
        }
      }
    },
  },

  install: function () {
    this.installDependencies();
  }
});
