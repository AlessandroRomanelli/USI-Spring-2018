function jsc_utils(jsc) {
    function copyArgs(f) {
        function f_(...args) {
            let copies = args.map(a => {
                if (typeof a === "function") return a;
                else return _.cloneDeep(a);
            });
            return f.apply(this, copies);
        };
        return f_;
    }

    // patch the function to use copied arbitrary values
    // jsverify goes crazy if arbitrary arguments are mutated
    function patchArgs(args) {
        let args_ = _.initial(args);
        let f = _.last(args);
        args_.push(copyArgs(f));
        return args_;
    }

    function mocha_property(name, ...args) {
        let args_ = patchArgs(args);
        args_.unshift(name);
        return jsc.property.apply(this, args_);
    }

    function pretty_function(data) {
        function display(pair) {
            let [as, r] = pair;
            if (!_.isArray(as)) as = [as];
            return '\t\tcase ' + JSON.stringify(as) + ': return ' +
                    JSON.stringify(r) + ';';
        }
        return 'function(...args) {\n\tswitch(args) {\n' + data.map(display).join('\n') + '}\n}';
    }
    function pretty(v) {
        if (typeof v === 'function') {
            if (v.original_fun !== undefined) v = v.original_fun;
                return pretty_function(v.internalMap.data);
            return JSON.stringify(v.internalMap.data, undefined, 2);
        }
        return JSON.stringify(v, undefined, 2);
    }

    function qunit_property_result(name, ...args) {
        let args_ = patchArgs(args);
        let res = jsc.check(jsc.forall.apply(this, args_));
        if (res == true)
            return QUnit.assert.pushResult({result: true, message: name});
        let ce = '(' + _.take(res.counterexample, args.length - 1).map(pretty).join(',\n ') + ')\n';
        return QUnit.assert.pushResult(
            {result: false,
             actual: res.exc.actual,
             expected: res.exc.expected,
             message: name + ' failed after ' +
             res.tests + ' tests, counterexample:\n' + ce,
             expectedLog: res.exc.expectedLog,
             resultLog: res.exc.resultLog,
             outputLog: res.exc.outputLog});
    }

    function qunit_property(name, ...args) {
        let args_ = patchArgs(args);
        return ok(jsc.assert(jsc.forall.apply(this,args_)) || true, name);
    }

    function propEqual(x,y,rl,el,ol) {
        if (_.isEqual(x,y)) return true;
        throw { actual: x, expected: y, expectedLog: el, resultLog: rl, outputLog: ol};
    }

    return {
        mocha_property: mocha_property,
        qunit_property: qunit_property,
        qunit_property_result: qunit_property_result,
        propEqual: propEqual
    };
}

function arbitrary_utils(jsc) {
    /* custom arbitraries */
    function set(arb) {
        return arb.smap(_.uniq, _.identity);
    }

    function oneOfWeight(...args) {
        return jsc.oneof(_.flatMap(args, x => _.fill(Array(x[1]), x[0])));
    }

    function equalLengthArrays(...args) {
        // generate an array of tuples
        let arbA = jsc.array(jsc.tuple(args));
        return arbA.smap(
            x => {
                if (x.length == 0) return _.map(args, x => []);
                return _.unzip(x);
            },
            y => _.zip.apply(null, y)
        );
    }

    function sortedArray(t) {
        return jsc.array(t).smap(_.sortBy,_.identity);
    }

    function vect(t, n) {
        return jsc.tuple(_.fill(Array(n), t));
    }

    function roseTree(t, max_level) {
        if (max_level <= 0) return jsc.array(t);
        return jsc.array(jsc.oneof(t, roseTree(t, max_level - 1)));
    }

    function charRange(min,max) {
        return jsc.nonshrink(jsc.integer(min.charCodeAt(0), max.charCodeAt(0)).smap(
            String.fromCharCode,
            c => c.charCodeAt(0)));
    }

    let lLetter = charRange('a', 'z');
    let uLetter = charRange('A', 'Z');
    let letter = jsc.oneof(lLetter, uLetter);

    let whitespace = oneOfWeight([jsc.constant(' '), 5],
                                 [jsc.constant('  '), 4],
                                 [jsc.constant('   '), 1],
                                 [jsc.constant('\t'), 1]);

    let punctuation = oneOfWeight([jsc.constant('.'), 3],
                                  [jsc.constant('...'),1],
                                  [jsc.constant('!'), 1],
                                  [jsc.constant('?'), 1]);

    function permutation(n) {
        return jsc.tuple(_.times(n-1, i => jsc.nat(n-i-1)));
    }

    function some(arb,min,max) {
        return jsc.bless({
            generator: jsc.integer(min,max).generator
                .flatmap(n => vect(arb,n).generator)
        });
    }

    function word(l,min,max) {
        return some(l,min,max).smap(a => a.join(''), s => s.split(''));
    }

    function sentence(w,wSp,initWSp,trailWSp,p,min,max) {
        return jsc.bless({
            generator: jsc.integer(min,max).generator.flatmap(
                n => jsc.generator.tuple([vect(w,n).generator,
                                          vect(wSp, n-1).generator,
                                          initWSp.generator,
                                          trailWSp.generator,
                                          p.generator]).map(a => {
                                              let [ws,wSps,iWs,tWs,p] = a;
                                              wSps.push(p + tWs);
                                              return iWs +
                                                  _.zipWith(ws, wSps, _.add).join('');
                                          }))
        });
    }

    let posInteger = jsc.nat.smap(x => x+1, x => x-1);

    // jsverify doesn't have arbitrary multi-argument functions
    // but it has curried functions and functions accepting tuples
    // to get usual multi-argument functions we can either uncurry
    // the generated function (in case we choose to generated
    // curried function) or grab all functions arguments as an
    // array and pass it to the generated function accepting tuples.
    // Here we choose to use tuple-based version to get better counterexamples.
    // There is a small catch: we have to ensure the right length of the tuple,
    // otherwise f(1,2,ununsed_arg) won't be the same as f(1,2).
    function fixManyArgFun(n,f) {
        let fixed_f = function(...args) {
            let as = _.take(args,n);
            let d = n - as.length;
            if (d) as.concat(_.fill(Array(d), undefined));
            return f(as);
        };
        fixed_f.original_fun = f;
        return fixed_f;
    }

    // arbitrary function taking n arguments
    function fnN(n, returnArb) {
        let funArb = jsc.fn(returnArb);
        let oldShow = funArb.show;
        return funArb.smap(f => fixManyArgFun(n,f),
                           f => f.original_fun,
                           f => oldShow(f.original_fun));
    }

    function fn2(returnArb) { return fnN(2, returnArb); }
    function fn3(returnArb) { return fnN(3, returnArb); }

    let anything = jsc.oneof(jsc.json, jsc.fn(jsc.json), jsc.falsy);

    return {
        set: set,
        oneOfWeight: oneOfWeight,
        vect: vect,
        equalLengthArrays: equalLengthArrays,
        sortedArray: sortedArray,
        roseTree: roseTree,
        charRange: charRange,
        permutation: permutation,
        uLetter: uLetter,
        lLetter: lLetter,
        letter: letter,
        whitespace: whitespace,
        punctuation: punctuation,
        some: some,
        word: word,
        sentence: sentence,
        posInteger: posInteger,
        fnN : fnN,
        fn2 : fn2,
        fn3 : fn3,
        anything
    };
}
