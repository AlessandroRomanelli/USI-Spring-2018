function tests() {
  test('App class constructors and methods', (assert) => {
    // The App class must be defined
    equal(typeof App === 'function', true, 'The App class must be defined');
    equal(/^\s*class\s+/.test(App.toString()), true, 'App is a function but it is not defined using the class keyword');


    // The App class constructor should throw an error if its argument is undefined
    assert.throws(() => {
      new App(undefined);
    }, 'The App class constructor should throw an error if its argument is undefined');
    // The App class constructor should throw an error if its argument is not a canvas
    assert.throws(() => {
      new App('');
    }, 'The App class constructor should throw an error if its argument is not an object');
    assert.throws(() => {
      new App(1);
    }, 'The App class constructor should throw an error if its argument is a number');
    assert.throws(() => {
      new App([]);
    }, 'The App class constructor should throw an error if its argument is an array');
    assert.throws(() => {
      new App(true);
    }, 'The App class constructor should throw an error if its argument is a boolean');

    // The default Stroke Style should be accessible in a static way, and should be equal to "black"
    equal(App.defaultStrokeStyle === 'black', true, 'The default Stroke Style should be accessible in a static way, and should be equal to "black"');

    assert.throws(() => {
      new App({});
    }, "The App class constructor should throw an error if its argument options object is not pointing to a canvas element under the 'canvas' property");

    const app = new App({ canvas: 'test-canvas' });
    equal(app.strokeStyle, 'black', 'Getter for strokeStyle is not defined');

    // The draw method must be defined
    equal(typeof app.draw === 'function', true, 'The draw method must be defined');
  });


  test('History and Stroke object literals fields and methods', (assert) => {
    // The Stroke class must be defined
    equal(typeof Stroke === 'function', true, 'The Stroke class must be defined');
    equal(/^\s*class\s+/.test(Stroke.toString()), true, 'Stroke is a function but it is not defined using the class keyword');

    equal((function () {
      try {
        const stroke = new Stroke('square');
      } catch (err) {
        return false;
      }

      return true;
    }()), true, 'Stroke can be instantiated');

    const stroke = new Stroke('square');
    const stroke1 = new Stroke('circle');
    const stroke2 = new Stroke('triangle');
    history.initializeNewStrokesSet();

    assert.throws(() => {
      history.push();
    }, 'Must pass a Stroke instance when you push in the history');

    equal((function () {
      try {
        history.push(stroke);
      } catch (err) {
        return false;
      }
      return true;
    }()), true, 'History push accepts Stroke instances as a parameter');

    equal(history.pop()[0] === stroke, true, 'Pop returns an array containing the pushed Stroke instance');

    history.initializeNewStrokesSet();

    history.push(stroke);
    history.push(stroke1);
    history.push(stroke2);

    equal(history.pop().length, 3, 'Pop returns an array containing the pushed Stroke instances');

    history.initializeNewStrokesSet();

    equal(history.pop().length, 0, 'Pop on an empty history should return an empty array');

    history.initializeNewStrokesSet();

    history.push(stroke);
    history.push(stroke1);

    history.initializeNewStrokesSet();

    history.push(stroke2);

    equal(history.pop().length, 1, 'Pop return an array containing the most recent set of Strokes (Expected 1 Stroke)');

    equal(history.pop().length, 2, 'Pop return an array containing the most recent set of Strokes (Expected 2 Strokes)');
  });
}
