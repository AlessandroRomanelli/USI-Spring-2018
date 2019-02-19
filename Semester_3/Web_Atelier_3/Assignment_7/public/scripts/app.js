const getMousePosition = (canvasEl, evt) => {
  const rect = canvasEl.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};

const cameraClicker = () => {
  let cameraActive = true;
  const player = document.getElementById('player');
  return function (evt) {
    const button = evt.srcElement;
    if (cameraActive) {
      // Redirect the camera video stream to the video player;
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        player.srcObject = stream;
      });
      button.innerHTML = 'Shoot';
    } else {
      this.ctx.drawImage(player, 0, 0, this.canvas.width, this.canvas.height);
      this.img = new Image();
      this.img.src = this.canvas.toDataURL('png');
      socket.emit('canvas.render', this.img.src);
      player.srcObject.getVideoTracks().forEach(track => track.stop());
      button.innerHTML = 'Start Camera';
    }
    cameraActive = !cameraActive;
  };
};

class App {
  constructor(object) {
    if (typeof object !== 'object' || Array.isArray(object) || object === null) { throw new Error(); }

    this.map = object;

    this.canvas = document.getElementById(object.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.currentBrush = new PenBrush();
    this.currentStroke = null;
    this.currentStrokeWidth = undefined;
    this.img = undefined;
    // If we cannot find the canvas corresponding to the provided ID, raise an Error.
    if (this.canvas.tagName.toLowerCase() !== 'canvas') { throw new Error(); }

    this.buttons = object.buttons;
    for (const key in this.buttons) {
      if (this.buttons.hasOwnProperty(key)) {
        this.buttons[key] = document.getElementById(this.buttons[key]);
        // If there isn't a correspondence for every button id, then raise an Error.
        if (this.buttons[key].tagName.toLowerCase() !== 'button') { throw new Error(); }
      }
    }

    // Setting up the brushToolbar
    this.brushToolbar = document.getElementById(object.brushToolbar);
    // If it's defined
    if (this.brushToolbar) {
      this.setupBrushToolbar();
    }

    this.previousPosition = { x: 0, y: 0 };

    this.setupCanvasEvents();

    if (this.buttons) {
      this.setupButtons();
    }
  }

  static get defaultStrokeStyle() {
    return 'black';
  }

  get strokeStyle() {
    if (!this.defaultStrokeStyle) { return App.defaultStrokeStyle; }
    return this.defaultStrokeStyle;
  }

  set strokeStyle(style) {
    if (typeof style !== 'string') { throw new Error(); }
    this.defaultStrokeStyle = style;
  }

  render(dataURL) {
    const img = new Image();
    const { ctx, canvas } = this;
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = dataURL;
    this.img = img;
  }

  draw(evt) {
    if (evt.buttons !== 1) { return; }
    const ctx = this.ctx;
    const mousePos = getMousePosition(this.canvas, evt);

    const stroke = new Stroke(
      this.currentBrush.name,
      this.previousPosition,
      mousePos,
      this.strokeStyle,
      this.currentStrokeWidth,
    );
    history.push(stroke, socket.id);

    this.currentBrush.color = this.strokeStyle;
    this.currentBrush.draw(ctx, this.previousPosition, mousePos, this.currentStrokeWidth);

    socket.emit('canvas.draw', stroke);

    this.previousPosition = mousePos;
  }

  extDraw(stroke) {
    let brush;
    const {
      brushName, start, end, width, color,
    } = stroke;
    if (brushName === 'PenBrush') {
      brush = new PenBrush();
    } else if (brushName === 'DiscBrush') {
      brush = new DiscBrush();
    } else {
      brush = new StarBrush();
    }
    brush.color = color;
    brush.draw(this.ctx, start, end, width);
  }

  clear() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    history.clear(socket.id);
    socket.emit('canvas.clear', {});
    this.refresh(true);
  }

  save() {
    const url = this.canvas.toDataURL('png');
    doJSONRequest('POST', '/favorites', {}, {
      title: 'New Image',
      dataUrl: url,
    });
  }

  undo() {
    history.pop(socket.id);
    const ctx = this.ctx;
    const player = document.getElementById('player');
    socket.emit('canvas.undo', {});
    this.refresh(false);
  }

  refresh(clear) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.img && !clear) {
      this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
    }
    const strokeSets = [];
    const sockets = Object.keys(history.users);
    sockets.forEach((socket) => {
      const entry = history.users[socket];
      for (let i = 0; i < entry.size; i += 1) {
        strokeSets.push([entry.data[i], entry.timestamps[i]]);
      }
    });
    strokeSets.sort((a, b) => a[1] - b[1]);
    strokeSets.forEach((set) => {
      set[0].forEach((stroke) => {
        stroke.draw(this.canvas);
      });
    });
  }


  setupBrushToolbar() {
    // BRUSHES
    // Create a button for each brush available
    for (let i = 0; i < brushes.length; i++) {
      const button = document.createElement('button');
      button.innerHTML = `${brushes[i].name}`;
      this.brushToolbar.append(button);
      // On brush button click
      button.addEventListener('click', (evt) => {
        // Set the current brush to be an instance of that specific class
        this.currentBrush = new (brushes[i])();
      });
    }
    // COLOR PICKER
    // Create a predefined HTML5 colorPicker
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    this.brushToolbar.append(colorPicker);
    // On color change
    colorPicker.addEventListener('input', (evt) => {
      // Set the new strokeStyle
      this.strokeStyle = evt.srcElement.value;
      // Change the current brush color
      this.currentBrush.color = this.strokeStyle;
    });

    // WEBCAM BACKGROUND
    // Create a video element for the webcam stream
    const player = document.createElement('video');
    player.id = 'player';
    // Make sure it's playing the received stream
    player.autoplay = true;
    player.style.display = 'none';
    document.body.append(player);
    // Create a button to take a photo for the background of the canvas
    const backgroundPicker = document.createElement('button');
    backgroundPicker.innerHTML = 'Start Camera';
    this.brushToolbar.append(backgroundPicker);
    // When the button is clicked
    backgroundPicker.addEventListener('click', cameraClicker().bind(this));

    // STROKE WIDTH SLIDER
    // Create a slider
    const slider = document.createElement('input');
    // Init the slider to the right values
    slider.type = 'range';
    slider.min = 1;
    slider.value = 1;
    slider.max = 100;
    slider.step = 1;
    this.brushToolbar.append(slider);
    // On slider change
    slider.addEventListener('input', (evt) => {
      this.currentStrokeWidth = evt.srcElement.value;
    });
  }

  setupCanvasEvents() {
    this.canvas.addEventListener('mousedown', (evt) => {
      this.previousPosition = getMousePosition(this.canvas, evt);
      document.body.style.cursor = 'crosshair';
      history.initializeNewStrokesSet(socket.id);
      socket.emit('canvas.start.drawing', {});
    });

    this.canvas.addEventListener('mouseup', (evt) => {
      document.body.style.cursor = 'default';
    });

    this.canvas.addEventListener('mousemove', this.draw.bind(this));
  }

  setupButtons() {
    this.buttons.clear.addEventListener('click', this.clear.bind(this));
    this.buttons.camera.addEventListener('click', this.save.bind(this));
    this.buttons.undo.addEventListener('click', this.undo.bind(this));
  }
}
