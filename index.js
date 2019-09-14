#!/usr/bin/env node

const fs = require ('fs');
const path = require ('path');
const pinyin = require ('pinyin');
const _ = require ('pumelo');

function renameFile (dir) {
  const files = fs.readdirSync (dir);
  for (let index = 0; index < files.length; index++) {
    let item = files[index];
    let fullPath = path.join (dir, item);
    let stat = fs.statSync (fullPath);
    if (stat.isDirectory ()) {
      renameFile (path.join (dir, item));
    } else {
      let lastIndex = item.lastIndexOf ('.');
      if (lastIndex === -1) {
        continue;
      }

      let file_name = item.slice (0, lastIndex);
      let ext = item.slice (lastIndex);

      let arr = pinyin (file_name, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false,
      });

      let new_file_name = _.flat () (arr).join ('_').replace (' ', '_');

      try {
        fs.renameSync (fullPath, path.join (dir, new_file_name + ext));
      } catch (err) {
        throw err;
      }
    }
  }
}

const main = () => {
  if (process.argv.length < 3) {
    throw('缺少文件夹参数');
  }

  let dir = process.argv[2];
  renameFile (dir);
};

(() => {
  main ();
}) ();
