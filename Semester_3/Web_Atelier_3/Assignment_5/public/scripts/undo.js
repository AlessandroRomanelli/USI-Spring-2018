class Stroke {
  constructor(brushName, startPos, endPos, brush, color, width) {
    this.brushName = brushName;
    this.start = startPos;
    this.end = endPos;
    this.brush = brush;
    this.color = color;
    this.width = width;
  }

  draw(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = this.color;
    this.brush.draw(ctx, this.start, this.end, this.width);
  }
}

const history = {
  data: [],
  pop() {
    return this.data.pop();
  },
  push(stroke) {
    if (typeof stroke !== 'object') { throw new Error(); }
    this.data[this.data.length - 1].push(stroke);
  },
  initializeNewStrokesSet() {
    this.data.push([]);
  },
  clear() {
    this.data = [];
  },
};
