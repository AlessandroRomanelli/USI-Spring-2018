// const count = 1;

const drawStar = (ctx, x, y, size) => {
  const length = size / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.rotate((Math.PI / 10));
  for (let i = 4; i >= 0; i -= 1) {
    ctx.lineTo(0, length);
    ctx.translate(0, length);
    ctx.rotate((Math.PI * 2 / 10));
    ctx.lineTo(0, -length);
    ctx.translate(0, -length);
    ctx.rotate(-(Math.PI * 6 / 10));
  }
  ctx.lineTo(0, length);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

class PenBrush {
  constructor() {
    this.opacity = 1;
    this.name = 'PenBrush';
    this.color = 'black';
  }

  draw(ctx, posStart, posEnd, width = 1) {
    ctx.lineWidth = width;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(posStart.x, posStart.y);
    ctx.lineTo(posEnd.x, posEnd.y);
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1;
  }
}

class DiscBrush extends PenBrush {
  constructor() {
    super();
    this.name = 'DiscBrush';
    this.lineWidth = 50;
  }

  draw(ctx, posStart, posEnd, width = 50) {
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(posStart.x, posStart.y, width / 2, 0, Math.PI * 2, false); // 0 <-> false
    ctx.stroke();
    ctx.closePath();
  }
}

class StarBrush extends PenBrush {
  constructor() {
    super();
    this.name = 'StarBrush';
  }

  draw(ctx, posStart, posEnd, width = 15) {
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    drawStar(ctx, posStart.x, posStart.y, width);
    ctx.stroke();
    ctx.closePath();
  }
}

const brushes = [PenBrush, DiscBrush, StarBrush];
