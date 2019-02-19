const fs = require('fs');

const matchObject = (obj, queryKeys) => {
  let match = true;
  queryKeys.forEach((key) => {
    if (queryKeys[key] !== obj[key]) {
      match = false;
    }
  });
  return match;
};

class ObservableArray {
  constructor() {
    this.array = [];
    this.onPush = [];
    this.onModify = [];
    this.onRemove = [];
    this.initStorage();
  }

  push(element) {
    this.array.push(element);
    this.invokeHandlers('onPush');
  }

  modify(id, changes) {
    const obj = this.get(id);
    Object.keys(changes).forEach((key) => {
      obj[key] = changes[key];
    });
    this.invokeHandlers('onModify');
  }

  remove(id) {
    let index = -1;
    this.array.forEach((obj, i) => {
      if (obj._id === id) {
        index = i;
      }
    });
    if (index > -1) this.array.splice(index, 1);
    this.invokeHandlers('onRemove');
  }

  invokeHandlers(handlersKey) {
    this[handlersKey].forEach((handler) => {
      if (typeof handler === 'function') {
        handler(this.array);
      }
    });
  }

  registerHandler(keys, handler) {
    keys.forEach((key) => {
      if (key in this) {
        if (typeof handler === 'function') {
          this[key].push(handler.bind(this));
        } else {
          throw new Error('Invalid Handler: must be a function!');
        }
      } else {
        throw new Error('Invalid event: must be one of the following: \n onPush \n onModify \n onRemove');
      }
    });
  }

  initStorage() {
    const root = `${__dirname}/..`;
    fs.readFile(`${root}/storage/data.json`, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const storage = JSON.parse(data);
        this.array = storage.data;
      }
    });
  }

  saveStorage() {
    const root = `${__dirname}/..`;
    const data = JSON.stringify({
      data: this.array,
    });

    fs.writeFile(`${root}/storage/data.json`, data, (err) => {
      if (err) console.error(err);
      console.log('File saved!');
    });
  }

  get bookmarked() {
    const bookmarked = [];
    this.array.forEach((obj) => {
      if (obj.bookmarked === true) {
        bookmarked.push(obj);
      }
    });
    return bookmarked;
  }

  contains(id) {
    let contained = false;
    this.array.forEach((obj) => {
      if (obj._id === id) {
        contained = true;
      }
    });
    return contained;
  }

  get(id) {
    let data;
    this.array.forEach((obj) => {
      if (obj._id === id) {
        data = obj;
      }
    });
    return data;
  }

  find(query) {
    const result = [];
    this.array.forEach((obj) => {
      if (this.matchObject(obj, query)) {
        result.push(obj);
      }
    });
    return result;
  }

  matchObject(obj, query) {
    let match = true;
    Object.keys(query).forEach((key) => {
      if (query[key] !== obj[key]) {
        match = false;
      }
    });
    return match;
  }

  get length() {
    return this.array.length;
  }

  get copy() {
    return this.array.slice();
  }
}

module.exports = ObservableArray;
