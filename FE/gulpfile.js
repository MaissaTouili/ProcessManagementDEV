'use strict';

const build = require('@microsoft/sp-build-web');
const gulp = require('gulp');
const path = require('path');
const mime = require('mime');
const rename = require('gulp-rename');
const header = require('gulp-header');


build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(require('gulp'));


