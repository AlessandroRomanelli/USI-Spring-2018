class Stroke {
  constructor(brushName, startPos, endPos, color, width) {
    this.brushName = brushName;
    this.start = startPos;
    this.end = endPos;
    this.color = color;
    this.width = width;
    if (brushName === 'PenBrush') {
      this.brush = new PenBrush();
    } else if (brushName === 'DiscBrush') {
      this.brush = new DiscBrush();
    } else {
      this.brush = new StarBrush();
    }
  }

  draw(canvas) {
    const ctx = canvas.getContext('2d');
    this.brush.color = this.color;
    this.brush.draw(ctx, this.start, this.end, this.width);
  }
}

const history = {

  users: {},

  pop(socketId) {
    if (socketId in this.users) {
      const socketHistory = this.users[socketId];
      socketHistory.size -= 1;
      socketHistory.timestamps.pop();
      return socketHistory.data.pop();
    }
    throw new Error('Popping from socketId history not registered');
  },

  push(stroke, socketId) {
    if (typeof stroke !== 'object') { throw new Error(); }
    if (socketId in this.users) {
      const size = this.users[socketId].data.length;
      this.users[socketId].data[size - 1].push(stroke);
    } else {
      throw new Error('Pushing to socketId history not registered');
    }
  },

  initializeNewStrokesSet(socketId) {
    if (!(socketId in this.users)) {
      this.users[socketId] = {
        data: [],
        timestamps: [],
        size: 0,
      };
    }
    const socketHistory = this.users[socketId];
    if (socketHistory.size < 1 || socketHistory.data[socketHistory.size - 1].length !== 0) {
      socketHistory.data.push([]);
      socketHistory.timestamps.push(Date.now());
      socketHistory.size += 1;
    }
  },

  clear(socketId) {
    if (socketId in this.users) {
      delete this.users[socketId];
    }
  },
};
