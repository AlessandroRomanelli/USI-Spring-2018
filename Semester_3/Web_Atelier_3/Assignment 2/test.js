function tests(property,
  propEqual,
  jsc,
  arbs,
  xmlParser) {
  // simple utility functions
  function words(s) { return _.words(s, /[^\s]+/g); }
  function compose(f, g) { return x => f(g(x)); }
  function vectorSum(arr1, arr2) { return _.zipWith(arr1, arr2, _.add); }

  window.vectorSum = vectorSum;

  // how to generate sentences (for mkPrettyPrinter & mkIndenter)
  const sentence =
        // words are 2-12 lower letters
        arbs.sentence(arbs.word(arbs.lLetter, 2, 12),
          // prefer white space between words
          arbs.oneOfWeight([arbs.whitespace, 8],
            // but rarely put '\n'
            [jsc.constant('\n'), 1]),
          // prefer no leading whitespace
          arbs.oneOfWeight([jsc.constant(''), 3],
            // but sometimes add some
            [arbs.whitespace, 1]),
          // slightly prefer adding trailing whitespace
          arbs.oneOfWeight([arbs.whitespace, 2],
            // but sometimes don't
            [jsc.constant(''), 1]),
          // use '.', '!', '?' or '...' at the end
          arbs.punctuation,
          // sentence has 5 to 30 words
          5,
          30);

  test('Scalar product', () => {
    property(
      "doesn't change the source array",
      'array number', 'number',
      (arr, num) => {
        const copy = _.cloneDeep(arr);
        const t = scalar_product(copy, num);
        return propEqual(copy, arr, `scalar_product([${copy}],${num})`, `[${arr}]`);
      },
    );
    property(
      'preserves the length of the array',
      'array number', 'number',
      (arr, num) => propEqual(scalar_product(arr, num).length, arr.length, `scalar_product([${arr}],${num}).length`, `${arr}.length`),
    );
    property(
      'returns zero array if the factor is zero',
      'array number',
      (arr) => {
	              const z = _.cloneDeep(arr);
	              _.fill(z, 0);
	              return propEqual(scalar_product(arr, 0), z, `scalar_product([${arr}],0)`, `[${z}]`);
      },
    );
    property(
      'preserves the array if the factor is one',
      'array number',
      (arr) => {
	              const c = _.cloneDeep(arr);
	              return propEqual(scalar_product(arr, 1), c, `scalar_product([${arr}],1))`, `[${c}]`);
      },
    );
    // have to restrict it to integers because of the rounding errors
    // better to compare up to rounding error
    property(
      'allows factors to be combined',
      'array integer', 'integer', 'integer',
      (arr, n1, n2) => propEqual(scalar_product(scalar_product(arr, n1), n2),
        scalar_product(arr, n1 * n2), `scalar_product(scalar_product([${arr}],${n1}),${n2})`, `scalar_product([${arr}], ${n1}*${n2})`),
    );
    property(
      'returns undefined if first argument is not an array',
      jsc.suchthat(arbs.anything, x => !_.isArray(x)), arbs.anything,
      (notArr, x) => propEqual(scalar_product(notArr, x), undefined, `scalar_product(${notArr}, ${x})`, 'undefined'),
    );
    property(
      'if factor is not passed, array is returned as is',
      'array number',
      arr => propEqual(scalar_product(arr), arr, `scalar_product([${arr}])`, `[${arr}]`),
    );
  });

  test('Inner product', () => {
    property(
      "doesn't change the source arrays",
      arbs.equalLengthArrays(jsc.number, jsc.number),
      (arrs) => {
        const [a1, a2] = arrs;
        const copy1 = _.cloneDeep(a1);
        const copy2 = _.cloneDeep(a2);
        const t = inner_product(a1, a2);
        return propEqual(a1, copy1) && propEqual(a2, copy2);
      },
    );
    property(
      'is symmetric',
      arbs.equalLengthArrays(jsc.number, jsc.number),
      (arrs) => {
        const [a1, a2] = arrs;
        return propEqual(inner_product(a1, a2), inner_product(a2, a1), `inner_product([${a1}],[${a2}])`, `inner_product([${a2}],[${a1}])`);
      },
    );
    property(
      'returns non-negative number when multiplying vector to itself',
      'array number',
      arr => inner_product(arr, arr) >= 0,
    );
    property(
      'returns zero if one of vectors is zero vector',
      'array number',
      (arr) => {
        const z = new Array(arr.length);
        _.fill(z, 0);
        return propEqual(inner_product(arr, z), 0, `inner_product([${arr}],[${z}])`, '0');
      },
    );
    property(
      "if argument arrays sizes don't match, returns undefined",
      jsc.array(arbs.anything),
      arr1 => jsc.forall(
        jsc.suchthat(jsc.array(arbs.anything),
          x => x.length !== arr1.length),
        arr2 => propEqual(inner_product(arr1, arr2), undefined, `inner_product([${arr1}],[${arr2}])`, 'undefined'),
      ),
    );
  });

  test('mapReduce', () => {
    // mapReduce is pretty agnostic to the array contents
    // so we could use "json" arbitrary instead of "number"
    // to get better coverage
    // Unfortunately, it is also quite slower
    property(
      "doesn't change the source array",
      'array integer', 'integer -> integer',
      (arr, f) => {
        const copy = arr.slice();
        const t = mapReduce(copy, f);
        return propEqual(copy, arr, `[${copy}]`, `[${arr}]`);
      },
    );
    property(
      'mapReduce([],f,g,seed) == seed',
      'integer -> integer', arbs.fn2(jsc.integer), 'integer',
      (f, combine, seed) => propEqual(mapReduce([], f, combine, seed), seed, `mapReduce([],${f},${combine},${seed})`, `${seed}`),
    );
    property(
      'mapReduce(arr,identity,combine,seed) == reduce(arr,combine,seed)',
      'array integer', arbs.fn2(jsc.integer), 'integer',
      (arr, combine, seed) => propEqual(mapReduce(arr, _.identity, combine, seed),
        _.reduce(arr, combine, seed), `mapReduce([${arr}],${_.identity},${combine},${seed})`, `_.reduce([${arr}],${combine},${seed})`),
    );
    property(
      'mapReduce(arr,f,combine,seed) == '
                + 'mapReduce(arr,identity,(a,x) => combine(a,f(x)),f(seed))',
      'array integer', 'integer -> integer', arbs.fn2(jsc.integer),
      'integer',
      (arr, f, combine, seed) => propEqual(
        mapReduce(arr, f, combine, seed),
        mapReduce(arr, _.identity, (a, x) => combine(a, f(x)), seed), `mapReduce([${arr}],${f},${combine},${seed})`, `mapReduce([${arr}],${_.identity},(a,x) => ${combine}(a,${f}(x)),${seed})`,
      ),
    );
    property(
      'mapReduce(arr1.concat(arr2),f) == mapReduce(arr1,f) + mapReduce(arr2,f)',
      'array integer', 'array integer', 'integer -> integer',
      (arr1, arr2, f) => propEqual(
        mapReduce(arr1.concat(arr2), f),
        mapReduce(arr1, f) + mapReduce(arr2, f), `mapReduce([${arr1}].concat([${arr2}]),${f})`, `mapReduce([${arr1}],${f}) + mapReduce([${arr2}],${f})`,
      ),
    );
    property(
      'mapReduce(arr1.concat(arr2),f,+,0) == '
                + 'mapReduce(arr1,f,+,0) + mapReduce(arr2,f,+,0)',
      'array integer', 'array integer', 'integer -> integer',
      (arr1, arr2, f) => propEqual(
        mapReduce(arr1.concat(arr2), f, _.add, 0),
        mapReduce(arr1, f, _.add, 0) + mapReduce(arr2, f, _.add, 0), `mapReduce([${arr1}].concat([${arr2}]),${f}, ${_.add}, 0)`, `mapReduce([${arr1}],${f},${_.add},0) + mapReduce([${arr2}],${f},${_.add},0)`,
      ),
    );
    property(
      'mapReduce(arr,f,(a,x) => a.concat([x]),[]) == map(arr,f)',
      'array integer', 'integer -> integer',
      (arr, f) => propEqual(mapReduce(arr, f, (a, x) => a.concat([x]), []),
        _.map(arr, f), `mapReduce([${arr}],${f},(a,x) => a.concat([x]), [])`, `${_.map(arr, f)}`),
    );
    property(
      'mapReduce(arr,f,(a,x) => a.concat(x),[]) == flatMap(arr,f)',
      'array integer', 'integer -> array integer',
      (arr, f) => propEqual(mapReduce(arr, f, (a, x) => a.concat(x), []),
        _.flatMap(arr, f), `mapReduce([${arr}],${f},(a,x) => a.concat(x),[])`,
        `[${_.flatMap(arr, f)}]`),
    );
    property(
      'mapReduce([1,2,3],f,g,0) == g(g(g(0,f(1)),f(2),f(3))',
      'integer -> integer', arbs.fn2(jsc.integer),
      (f, g) => propEqual(mapReduce([1, 2, 3], f, g, 0),
        g(g(g(0, f(1)), f(2)), f(3)), `mapReduce([1,2,3],${f},${g},0)`, `${g(g(g(0, f(1)), f(2)), f(3))}`),
    );
    property(
      'if the first argument is not an array, returns undefined',
      jsc.suchthat(arbs.anything, x => !Array.isArray(x)),
      'number -> number',
      (notArr, f) => propEqual(mapReduce(notArr, f), undefined),
    );
    property(
      'if the second argument is not a function, returns undefined',
      'array integer', jsc.suchthat(arbs.anything, x => typeof x !== 'function'),
      (arr, notF) => propEqual(mapReduce(arr, notF), undefined),
    );
  });

  test('mergeSortedArrays', () => {
    property(
      "doesn't change the source arrays",
      arbs.sortedArray(jsc.integer), arbs.sortedArray(jsc.integer),
      (a, b) => {
        const copy1 = _.cloneDeep(a);
        const copy2 = _.cloneDeep(b);
        const t = mergeSortedArrays(copy1, copy2);
        return propEqual(copy1, a) && propEqual(copy2, b);
      },
    );
    property(
      'produces sorted results',
      arbs.sortedArray(jsc.integer), arbs.sortedArray(jsc.integer),
      (a, b) => {
        const t = mergeSortedArrays(a, b);
        return propEqual(t, _.sortBy(t), `[${t}]`, `mergeSortedArrays([${a}],[${b}])`);
      },
    );
    property(
      'has length equal to the sum of individual lengths',
      arbs.sortedArray(jsc.integer), arbs.sortedArray(jsc.integer),
      (a, b) => propEqual(mergeSortedArrays(a, b).length, a.length + b.length, `mergeSortedArrays([${a}],[${b}]).length`, `[${a}].length + [${b}].length`),
    );
  });

  test('range', () => {
    property(
      'results in undefined if step is zero',
      'integer', 'integer',
      (x, y) => propEqual(range(x, y, 0), undefined, `range(${x},${y},0)`, undefined, `[${range(x, y, 0)}]`),
    );
    property(
      'results in empty array if x > y and step > 0 or x < y and step < 0',
      'integer',
      x => jsc.forall(
        jsc.suchthat(jsc.integer, y => y != x), arbs.posInteger,
        (y, stepMod) => {
          const s = x > y ? stepMod : -stepMod;
          return propEqual(range(x, y, s), [], `range(${x},${y},${s})`, undefined, `[${range(x, y, s)}]`);
        },
      ),
    );
    property(
      'produces array without repetitions',
      'integer', 'integer', jsc.suchthat(jsc.integer, x => x != 0),
      (x, y, step) => {
        const r = range(x, y, step);
        return propEqual(r.length, _.uniq(r).length, `range(${x},${y},${step})`, undefined, `[${range(x, y, step)}]`);
      },
    );
    property(
      'produces array with all elements >= min(x,y)',
      'integer', 'integer', jsc.suchthat(jsc.integer, x => x != 0),
      (x, y, step) => {
        const r = range(x, y, step);
        const l = _.min([x, y]);
        return propEqual(_.every(r, a => a >= l), true, `range(${x},${y},${step})`, undefined, `[${range(x, y, step)}]`);
      },
    );
    property(
      'produces array with all elements <= max(x,y)',
      'integer', 'integer', jsc.suchthat(jsc.integer, x => x != 0),
      (x, y, step) => {
        const r = range(x, y, step);
        const h = _.max([x, y]);
        return propEqual(_.every(r, a => a <= h), true, `range(${x},${y},${step})`, undefined, `[${range(x, y, step)}]`);
      },
    );
    property(
      'returns undefined, if either argument is not a number',
      'number', 'number', jsc.suchthat(jsc.number, x => x != 0),
      jsc.suchthat(arbs.anything, x => !_.isNumber(x) || _.isNaN(x)),
      jsc.suchthat(arbs.anything, x => !_.isNumber(x) || _.isNaN(x)),
      jsc.suchthat(arbs.anything, x => !_.isNumber(x) || _.isNaN(x)),
      jsc.suchthat(arbs.anything, x => !_.isUndefined(x)
                         && (!_.isNumber(x) || _.isNaN(x))),
      (x, y, step, nN1, nN2, nN3, nN4) => propEqual(range(nN1, nN2, step), undefined)
                    && propEqual(range(nN1, y, step), undefined)
                    && propEqual(range(x, nN2, step), undefined)
                    && propEqual(range(nN1, nN2, nN3), undefined)
                    && propEqual(range(x, y, nN4), undefined)
                    && propEqual(range(nN1, y, nN3), undefined)
                    && propEqual(range(x, nN2, nN3), undefined),
    );
  });

  test('flatten', () => {
    property(
      "doesn't change the input array",
      'array json',
      (a) => {
        const copy = _.cloneDeep(a);
        const t = flatten(copy);
        return propEqual(copy, a, `flatten([${a}])`);
      },
    );
    property(
      'simply returns the input, if it is not an array',
      jsc.oneof(jsc.number, jsc.bool, jsc.falsy, jsc.string),
      inp => propEqual(flatten(inp), inp, `flatten(${inp})`),
    );
    property(
      'simply returns the input, if it is already flattened',
      jsc.array(jsc.oneof(jsc.number, jsc.bool, jsc.falsy, jsc.string)),
      a => propEqual(flatten(a), a, `flatten([${a}])`, `[${a}]`),
    );
    property(
      'flatten([arr]) == flatten(arr)',
      'array json',
      a => propEqual(flatten([a]), flatten(a), `flatten([[${a}]])`, `flatten([${a}])`),
    );
  });

  test('mkPrettyPrinter', () => {
    property(
      'output has no too long lines',
      jsc.integer(20, 80), jsc.array(sentence),
      (ls, input) => {
        const inp = input.join('\n');
        const pp = mkPrettyPrinter(ls);
        const r = pp(inp);
        return propEqual(_.every(r, l => l.length <= ls), true, `mkPrettyPrinter(${ls})("${inp.replace(/\n/, '\\n')}")`, undefined, `[${mkPrettyPrinter(ls)(inp)}]`);
      },
    );
    property(
      'output has all input words in the same order',
      jsc.integer(20, 80), jsc.array(sentence),
      (ls, input) => {
        const inp = input.join('\n');
        const ws = words(inp);
        const pp = mkPrettyPrinter(ls);
        const r = pp(inp);
        return propEqual(words(r.join('\n')), ws, `mkPrettyPrinter(${ls})("${inp.replace(/\n/, '\\n')}")`, undefined);
      },
    );
    property(
      'output has no leading or trailing white spaces',
      jsc.integer(20, 80), jsc.array(sentence),
      (ls, input) => {
        const inp = input.join('\n');
        const pp = mkPrettyPrinter(ls);
        const r = pp(inp);
        return propEqual(_.every(r, l => (l == _.trim(l))), true, `mkPrettyPrinter(${ls})("${inp.replace(/\n/, '\\n')}")`, undefined, `[${mkPrettyPrinter(ls)(inp)}]`);
      },
    );
    property(
      'does not use global variables',
      arbs.vect(jsc.integer(20, 80), 5),
      arbs.permutation(5), jsc.array(sentence),
      (lss, perm, input) => {
        const inp = input.join('\n');
        const pps = lss.map(mkPrettyPrinter);
        for (const i in perm) {
          const j = perm[i];
          const r = pps[j](inp);
          _.every(r, l => propEqual(l.length <= lss[j], true));
          pps.splice(j, 1);
          lss.splice(j, 1);
        }
        return true;
      },
    );
    property(
      'returns undefined if called with not a number',
      jsc.suchthat(arbs.anything, x => !_.isUndefined(x)
                         && (!_.isNumber(x) || _.isNaN(x))),
      nN => propEqual(mkPrettyPrinter(nN), undefined, `mkPrettyPrinter(${nN})`),
    );
    property(
      'if pretty-printer is called with non-string, it returns undefined',
      jsc.integer(50, 80),
      jsc.suchthat(arbs.anything, x => !_.isString(x)),
      (ls, nStr) => propEqual(mkPrettyPrinter(ls)(nStr), undefined, `mkPrettyPrinter(${ls})(${nStr})`),
    );
  });

  test('mkIndenter', () => {
    const indenterInput = jsc.oneof(jsc.nat(20), sentence, jsc.array(sentence));
    // it's easier to generate absolute indentation levels
    // and then turn them into relative ones
    function fixIndentationLevels(arr, curLvl) {
      for (const i in arr) {
        if (typeof arr[i] === 'number') {
          const t = arr[i];
          arr[i] -= curLvl;
          curLvl = t;
        }
      }
      return curLvl;
    }
    function properlyIndented(il) {
      return (l) => {
        const b = l.substr(0, il);
        const e = l.slice(il);
        return propEqual(b, ' '.repeat(il))
                    && propEqual(e, _.trim(e))
                    && !_.includes(e, '\n')
                    && !_.includes(e, '\t')
                    && !_.includes(e, '  ');
      };
    }
    function properlyIndentedLI(il) {
      return (l, ix) => {
        const b = l.substr(0, il + 2);
        const e = l.slice(il + 2);
        const expectedIndent = i ? ' '.repeat(il + 2) : `${' '.repeat(il)}* `;
        return propEqual(b, expectedIndent)
                    && propEqual(e, _.trim(e))
                    && !_.includes(e, '\n')
                    && !_.includes(e, '\t')
                    && !_.includes(e, '  ');
      };
    }
    function noEarlyWraps(ls, ss, rl, el, ol) {
      const lss = _.initial(ss).map(x => x.length);
      const nexts = _.tail(ss).map(x => words(x)[0].length);
      return propEqual(_.every(_.zipWith(lss, nexts, _.add), s => s >= ls), true, rl, el, ol);
    }

    property(
      "returned function doesn't change its argument",
      jsc.integer(50, 80), jsc.nat(12), jsc.array(sentence),
      (ls, il, arr) => {
        const copy = _.cloneDeep(arr);
        const i = mkIndenter(ls, il);
        const t = i(copy);
        return propEqual(copy, arr, `mkIndenter(${ls}, ${il})([${arr}])`);
      },
    );
    property(
      'freshly created indenter returns indentation level passed '
                + 'during creation',
      jsc.integer(50, 80), jsc.nat(20),
      (ls, il) => {
        const i = mkIndenter(ls, il);
        return propEqual(i(true), il, `mkIndenter(${ls}, ${il})(true)`);
      },
    );
    property(
      'freshly created indenter returns an empty array',
      jsc.integer(50, 80), jsc.nat(20),
      (ls, il) => {
        const i = mkIndenter(ls, il);
        return propEqual(i(), [], `mkIndenter(${ls}, ${il})()`);
      },
    );
    property(
      "content request doesn't change the indentation level",
      jsc.integer(50, 80), jsc.nat(20), jsc.array(indenterInput),
      (ls, il, arr) => {
        fixIndentationLevels(arr, il);
        const i = mkIndenter(ls, il);
        arr.forEach(i);
        const il2 = i(true);
        i();
        return propEqual(i(true), il2, `var i = mkIndenter(${ls}, ${il});i(true);i(true)`);
      },
    );
    property(
      "output doesn't have too long lines",
      jsc.integer(50, 80), jsc.nat(20), jsc.array(indenterInput),
      (ls, il, arr) => {
        fixIndentationLevels(arr, il);
        const i = mkIndenter(ls, il);
        arr.forEach(i);
        const r = i();
        return propEqual(_.every(r, l => l.length <= ls), true, `mkIndenter(${ls}, ${il})()`);
      },
    );
    property(
      "integer input doesn't produce any output and changes the "
                + 'indentation level',
      jsc.integer(50, 80), jsc.nat(12), jsc.integer(-12, 12),
      (ls, il, int) => {
        const i = mkIndenter(ls, il);
        i(int);
        return propEqual(i(true), il + int, `var i = mkIndenter(${ls}, ${il}); i(${int}); i(true); i()`)
                    && propEqual(i(), [], `var i = mkIndenter(${ls}, ${il}); i(${int}); i(true); i()`);
      },
    );
    property(
      'string input produces properly indented results '
                + "and doesn't change the indentation level",
      jsc.integer(50, 80), jsc.nat(20), sentence,
      (ls, il, s) => {
        const i = mkIndenter(ls, il);
        i(s);
        const r = i();
        return propEqual(_.every(r, properlyIndented(il)), true, `var i = mkIndenter(${ls}, ${il}); i("${s}"); i(); i(true)`)
                    && propEqual(i(true), il, `var i = mkIndenter(${ls}, ${il}); i("${s}"); i(); i(true)`);
      },
    );
    property(
      "string input doesn't wrap lines too early",
      jsc.integer(50, 80), jsc.nat(20), sentence,
      (ls, il, s) => {
        const i = mkIndenter(ls, il);
        i(s);
        const r = i();
        return noEarlyWraps(ls, r, `var i = mkIndenter(${ls}, ${il}); i("${s.replace(/\n/, '\\n')}"); i()`, undefined, `[${i()}]`);
      },
    );
    property(
      'empty array input does nothing',
      jsc.integer(50, 80), jsc.nat(20),
      (ls, il) => {
        const i = mkIndenter(ls, il);
        i([]);
        return propEqual(i(), [], `var i = mkIndenter(${ls}, ${il}); i([]); i(); i(true)`) && propEqual(i(true), il, `var i = mkIndenter(${ls}, ${il}); i([]); i(); i(true)`);
      },
    );
    property(
      "it doesn't use global variables",
      jsc.integer(2, 5),
      (n) => {
        const inputsArb = arbs.vect(jsc.tuple([jsc.integer(50, 80),
          jsc.nat(20),
          jsc.array(sentence)]),
        n);
        return jsc.forall(
          inputsArb,
          (inputs) => {
            const seqOuts = _.map(inputs, (inp) => {
              const i = mkIndenter(inp[0], inp[1]);
              inp[2].forEach(i);
              return i();
            });
            const sz = _.sum(_.map(inputs, x => x[2].length)) + 2 * n;
            return jsc.forall(
              arbs.vect(jsc.nat(n - 1), sz),
              (schedule) => {
                const cnts = _.fill(Array(n), -1);
                const outs = _.fill(Array(n), undefined);
                const is = [];
                schedule.forEach((i_) => {
                  let i = i_;
                  for (; cnts[i] > inputs[i][2].length; i++, i %= n);
                  const inp = inputs[i];
                  if (cnts[i] == -1) is[i] = mkIndenter(inp[0], inp[1]);
                  else if (cnts[i] == inp[2].length) outs[i] = is[i]();
                  else is[i](inp[2][cnts[i]]);
                  cnts[i]++;
                });
                const os = _.zip(seqOuts, outs);
                return _.every(os, o => propEqual(o[0], o[1]));
              },
            );
          },
        );
      },
    );
    property(
      'returns undefined if either argument is not a number',
      jsc.suchthat(arbs.anything, x => !_.isNumber(x) || _.isNaN(x)),
      jsc.suchthat(arbs.anything, x => !_.isUndefined(x)
                         && (!_.isNumber(x) || _.isNaN(x))),
      jsc.integer(50, 80), jsc.nat(20),
      (nN1, nN2, ls, il) => propEqual(mkIndenter(nN1), undefined)
                    && propEqual(mkIndenter(nN1, il), undefined)
                    && propEqual(mkIndenter(ls, nN2), undefined)
                    && propEqual(mkIndenter(nN1, nN2), undefined),
    );
    property(
      'sample input works',
      'unit',
      (u) => {
        const i = mkIndenter(20);
        i('Short line');
        i('This line is longer than 20 characters');
        i(8);
        i('Big indent');
        i('Not so long line');
        i(-6);
        i('Small indent');
        i(['Item 1', 'Item 2', 'Really really long Item 3']);
        return propEqual(i(),
          ['Short line',
            'This line is longer',
            'than 20 characters',
            '        Big indent',
            '        Not so long',
            '        line',
            '  Small indent',
            '  * Item 1',
            '  * Item 2',
            '  * Really really',
            '    long Item 3']);
      },
    );
  });

  test('letter_frequency', () => {
    property(
      'Concatenation of strings produces merge of maps',
      jsc.array(arbs.letter), jsc.array(arbs.letter),
      (arr1, arr2) => {
        const s1 = arr1.join('');
        const s2 = arr2.join('');
        const expected = _.assignWith(letter_frequency(s1),
          letter_frequency(s2),
          _.add);
        return propEqual(letter_frequency(s1 + s2), expected);
      },
    );
    property(
      'Map values are always positive',
      jsc.array(arbs.letter),
      (arr) => {
        const s = arr.join('');
        const r = letter_frequency(s);
        return _.every(r, x => x > 0);
      },
    );
    property(
      'Hello example works',
      'unit',
      u => propEqual(letter_frequency('Hello'),
        {
          H: 1,
          E: 1,
          L: 2,
          O: 1,
        }),
    );
  });

  test('display_letter_frequency', () => {
    // how to generate frequency table
    const fTable = jsc.array(jsc.tuple([arbs.uLetter, arbs.posInteger])).smap(
      _.fromPairs,
      _.toPairs,
    );

    property(
      'first arguments is not modified',
      fTable,
      (ft) => {
        const copy = _.cloneDeep(ft);
        const dom = {};
        display_letter_frequency(copy, dom);
        return propEqual(copy, ft);
      },
    );
    property(
      'Output is a table with right number of rows and 2 columns',
      fTable,
      (ft) => {
        const dom = {};
        display_letter_frequency(ft, dom);
        const out = xmlParser.parseFromString(dom.innerHTML, 'text/xml');
        const d = out.documentElement;
        const cs = d.children;
        return propEqual(d.tagName, 'table')
                    && propEqual(cs.length, _.size(ft))
                    && _.every(_.range(cs.length).map((i) => {
                      const c = cs.item(i);
                      const subcs = c.children;
                      return propEqual(c.tagName, 'tr')
                            && propEqual(subcs.length, 2)
                            && _.every(_.range(subcs.length).map((j) => {
                              const subc = subcs.item(j);
                              return propEqual(subc.tagName, 'td')
                                    && propEqual(subc.children.length, 0);
                            }));
                    }));
      },
    );
    property(
      'Every row has key/value pair from the frequency table',
      fTable,
      (ft) => {
        function isInMap(k, v) {
          const i = parseInt(v);
          return propEqual(`${i}`, v)
                        && propEqual(ft[k], i);
        }
        const dom = {};
        display_letter_frequency(ft, dom);
        const out = xmlParser.parseFromString(dom.innerHTML, 'text/xml');
        const d = out.documentElement;
        const cs = d.children;
        return propEqual(d.tagName, 'table')
                    && _.every(_.range(cs.length).map((i) => {
                      const c = cs.item(i);
                      const subcs = c.children;
                      return propEqual(c.tagName, 'tr')
                            && propEqual(subcs.length, 2)
                            && propEqual(subcs.item(0).tagName, 'td')
                            && propEqual(subcs.item(1).tagName, 'td')
                            && isInMap(subcs.item(0).innerHTML, subcs.item(1).innerHTML);
                    }));
      },
    );
    property(
      'Does nothing if either argument is not an object',
      fTable,
      jsc.dict(arbs.anything),
      jsc.suchthat(arbs.anything, x => !_.isObject(x)),
      jsc.suchthat(arbs.anything, x => !_.isObject(x)),
      jsc.suchthat(arbs.anything, x => !_.isObject(x)),
      (ft, nO1, nO2, nO3, o) => {
        const copyO = _.cloneDeep(o);
        const copyNO2 = _.cloneDeep(nO2);
        const copyNO3 = _.cloneDeep(nO3);
        display_letter_frequency(nO1, copyNO2);
        display_letter_frequency(nO1, copyO);
        display_letter_frequency(ft, copyNO3);
        return propEqual(copyNO2, nO2)
                    && propEqual(copyO, o)
                    && propEqual(copyNO3, nO3);
      },
    );
  });
}
