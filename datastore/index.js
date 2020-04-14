const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// items[id] = text;
// callback(null, { id, text });
exports.create = (text, callback) => {
// writeFile takes filepath and getNextUniqueId
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        callback(new Error('error writing data'));
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  //use file systems readdir and pass in exports dataDir and a
  // callback that takes in an error and the file data
  fs.readdir(exports.dataDir, (err, items) => {
    if (err) {
      callback(new Error('could not read directory'));
    } else {
      let data = _.map(items, (text, id) => {
        return { id: text.split('.')[0], text: text.split('.')[0] };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`cannot read file with this id: ${id}`));
    } else {
      callback(null, {id: id, text: data.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  //handle if file doesnt exist do not create it
  //write to the file takes path.join
  //fs.access
  fs.access(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`file does nor exist: ${err}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error(`could not write/update file at this id: ${id}`));
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`no file with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
