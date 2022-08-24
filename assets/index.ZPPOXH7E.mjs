//__HEAD__
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
));

// ../imba/packages/imba/vendor/events.js
var require_events = __commonJS({
  "../imba/packages/imba/vendor/events.js"(exports, module) {
    "use strict";
    var R = typeof Reflect == "object" ? Reflect : null, ReflectApply = R && typeof R.apply == "function" ? R.apply : function(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    }, ReflectOwnKeys;
    R && typeof R.ownKeys == "function" ? ReflectOwnKeys = R.ownKeys : Object.getOwnPropertySymbols ? ReflectOwnKeys = function(target) {
      return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
    } : ReflectOwnKeys = function(target) {
      return Object.getOwnPropertyNames(target);
    };
    function ProcessEmitWarning(warning) {
      console && console.warn && console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function(value) {
      return value !== value;
    };
    function EventEmitter2() {
      EventEmitter2.init.call(this);
    }
    module.exports = EventEmitter2;
    module.exports.once = once2;
    EventEmitter2.EventEmitter = EventEmitter2;
    EventEmitter2.prototype._events = void 0;
    EventEmitter2.prototype._eventsCount = 0;
    EventEmitter2.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener != "function")
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }
    Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
      enumerable: !0,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg != "number" || arg < 0 || NumberIsNaN(arg))
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        defaultMaxListeners = arg;
      }
    });
    EventEmitter2.init = function() {
      (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter2.prototype.setMaxListeners = function(n) {
      if (typeof n != "number" || n < 0 || NumberIsNaN(n))
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      return this._maxListeners = n, this;
    };
    function _getMaxListeners(that) {
      return that._maxListeners === void 0 ? EventEmitter2.defaultMaxListeners : that._maxListeners;
    }
    EventEmitter2.prototype.getMaxListeners = function() {
      return _getMaxListeners(this);
    };
    EventEmitter2.prototype.emit = function(type) {
      for (var args = [], i = 1; i < arguments.length; i++)
        args.push(arguments[i]);
      var doError = type === "error", events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return !1;
      if (doError) {
        var er;
        if (args.length > 0 && (er = args[0]), er instanceof Error)
          throw er;
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        throw err.context = er, err;
      }
      var handler = events[type];
      if (handler === void 0)
        return !1;
      if (typeof handler == "function")
        ReflectApply(handler, this, args);
      else
        for (var len = handler.length, listeners = arrayClone(handler, len), i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      return !0;
    };
    function _addListener(target, type, listener, prepend) {
      var m, events, existing;
      if (checkListener(listener), events = target._events, events === void 0 ? (events = target._events = /* @__PURE__ */ Object.create(null), target._eventsCount = 0) : (events.newListener !== void 0 && (target.emit(
        "newListener",
        type,
        listener.listener ? listener.listener : listener
      ), events = target._events), existing = events[type]), existing === void 0)
        existing = events[type] = listener, ++target._eventsCount;
      else if (typeof existing == "function" ? existing = events[type] = prepend ? [listener, existing] : [existing, listener] : prepend ? existing.unshift(listener) : existing.push(listener), m = _getMaxListeners(target), m > 0 && existing.length > m && !existing.warned) {
        existing.warned = !0;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning", w.emitter = target, w.type = type, w.count = existing.length, ProcessEmitWarning(w);
      }
      return target;
    }
    EventEmitter2.prototype.addListener = function(type, listener) {
      return _addListener(this, type, listener, !1);
    };
    EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
    EventEmitter2.prototype.prependListener = function(type, listener) {
      return _addListener(this, type, listener, !0);
    };
    function onceWrapper() {
      if (!this.fired)
        return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: !1, wrapFn: void 0, target, type, listener }, wrapped = onceWrapper.bind(state);
      return wrapped.listener = listener, state.wrapFn = wrapped, wrapped;
    }
    EventEmitter2.prototype.once = function(type, listener) {
      return checkListener(listener), this.on(type, _onceWrap(this, type, listener)), this;
    };
    EventEmitter2.prototype.prependOnceListener = function(type, listener) {
      return checkListener(listener), this.prependListener(type, _onceWrap(this, type, listener)), this;
    };
    EventEmitter2.prototype.removeListener = function(type, listener) {
      var list, events, position, i, originalListener;
      if (checkListener(listener), events = this._events, events === void 0)
        return this;
      if (list = events[type], list === void 0)
        return this;
      if (list === listener || list.listener === listener)
        --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete events[type], events.removeListener && this.emit("removeListener", type, list.listener || listener));
      else if (typeof list != "function") {
        for (position = -1, i = list.length - 1; i >= 0; i--)
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener, position = i;
            break;
          }
        if (position < 0)
          return this;
        position === 0 ? list.shift() : spliceOne(list, position), list.length === 1 && (events[type] = list[0]), events.removeListener !== void 0 && this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.removeAllListeners = function(type) {
      var listeners, events, i;
      if (events = this._events, events === void 0)
        return this;
      if (events.removeListener === void 0)
        return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : events[type] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete events[type]), this;
      if (arguments.length === 0) {
        var keys = Object.keys(events), key;
        for (i = 0; i < keys.length; ++i)
          key = keys[i], key !== "removeListener" && this.removeAllListeners(key);
        return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
      }
      if (listeners = events[type], typeof listeners == "function")
        this.removeListener(type, listeners);
      else if (listeners !== void 0)
        for (i = listeners.length - 1; i >= 0; i--)
          this.removeListener(type, listeners[i]);
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      return evlistener === void 0 ? [] : typeof evlistener == "function" ? unwrap ? [evlistener.listener || evlistener] : [evlistener] : unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter2.prototype.listeners = function(type) {
      return _listeners(this, type, !0);
    };
    EventEmitter2.prototype.rawListeners = function(type) {
      return _listeners(this, type, !1);
    };
    EventEmitter2.listenerCount = function(emitter, type) {
      return typeof emitter.listenerCount == "function" ? emitter.listenerCount(type) : listenerCount.call(emitter, type);
    };
    EventEmitter2.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener == "function")
          return 1;
        if (evlistener !== void 0)
          return evlistener.length;
      }
      return 0;
    }
    EventEmitter2.prototype.eventNames = function() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      for (var copy = new Array(n), i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      for (var ret = new Array(arr.length), i = 0; i < ret.length; ++i)
        ret[i] = arr[i].listener || arr[i];
      return ret;
    }
    function once2(emitter, name) {
      return new Promise(function(resolve, reject) {
        function eventListener() {
          errorListener !== void 0 && emitter.removeListener("error", errorListener), resolve([].slice.call(arguments));
        }
        var errorListener;
        name !== "error" && (errorListener = function(err) {
          emitter.removeListener(name, eventListener), reject(err);
        }, emitter.once("error", errorListener)), emitter.once(name, eventListener);
      });
    }
  }
});

// ../imba/packages/imba/src/imba/utils.imba
var $__initor__$ = Symbol.for("#__initor__"), $__inited__$ = Symbol.for("#__inited__"), $__hooks__$ = Symbol.for("#__hooks__"), $type$ = Symbol.for("#type"), $__listeners__$ = Symbol.for("#__listeners__");
var LazyProxy = class {
  static for(getter) {
    return new Proxy({}, new this(getter));
  }
  constructor(getter) {
    this.getter = getter;
  }
  get target() {
    return this.getter();
  }
  get(_, key) {
    return this.target[key];
  }
  set(_, key, value) {
    return this.target[key] = value, !0;
  }
};
function proxy(getter, placeholder = {}) {
  return new Proxy(placeholder, new LazyProxy(getter));
}
function getDeepPropertyDescriptor(item, key, stop) {
  if (!item)
    return;
  let desc = Object.getOwnPropertyDescriptor(item, key);
  return desc || item == stop ? desc || void 0 : getDeepPropertyDescriptor(Reflect.getPrototypeOf(item), key, stop);
}
var emit__ = function(event, args, node) {
  let prev, cb, ret;
  for (; (prev = node) && (node = node.next); )
    (cb = node.listener) && (node.path && cb[node.path] ? ret = args ? cb[node.path].apply(cb, args) : cb[node.path]() : ret = args ? cb.apply(node, args) : cb.call(node)), node.times && --node.times <= 0 && (prev.next = node.next, node.listener = null);
};
function listen(obj, event, listener, path) {
  var $19;
  let cbs, list, tail;
  return cbs = obj[$__listeners__$] || (obj[$__listeners__$] = {}), list = cbs[event] || (cbs[event] = {}), tail = list.tail || (list.tail = list.next = {}), tail.listener = listener, tail.path = path, list.tail = tail.next = {}, tail;
}
function once(obj, event, listener) {
  let tail = listen(obj, event, listener);
  return tail.times = 1, tail;
}
function unlisten(obj, event, cb, meth) {
  let node, prev, meta = obj[$__listeners__$];
  if (!!meta && (node = meta[event])) {
    for (; (prev = node) && (node = node.next); )
      if (node == cb || node.listener == cb) {
        prev.next = node.next, node.listener = null;
        break;
      }
  }
}
function emit(obj, event, params) {
  let cb;
  (cb = obj[$__listeners__$]) && (cb[event] && emit__(event, params, cb[event]), cb.all && emit__(event, [event, params], cb.all));
}

// ../imba/packages/imba/src/imba/scheduler.imba
function iter$__(a) {
  let v;
  return a && ((v = a.toIterable) ? v.call(a) : a);
}
var $__init__$ = Symbol.for("#__init__"), $__patch__$ = Symbol.for("#__patch__"), $__initor__$2 = Symbol.for("#__initor__"), $__inited__$2 = Symbol.for("#__inited__"), $__hooks__$2 = Symbol.for("#__hooks__"), $schedule$ = Symbol.for("#schedule"), $frames$ = Symbol.for("#frames"), $interval$ = Symbol.for("#interval"), $stage$ = Symbol.for("#stage"), $scheduled$ = Symbol.for("#scheduled"), $version$ = Symbol.for("#version"), $fps$ = Symbol.for("#fps"), $ticker$ = Symbol.for("#ticker"), rAF = globalThis.requestAnimationFrame || function(blk) {
  return globalThis.setTimeout(blk, 1e3 / 60);
};
var SPF = 1 / 60, Scheduled = class {
  [$__patch__$]($$ = {}) {
    var $14;
    ($14 = $$.owner) !== void 0 && (this.owner = $14), ($14 = $$.target) !== void 0 && (this.target = $14), ($14 = $$.active) !== void 0 && (this.active = $14), ($14 = $$.value) !== void 0 && (this.value = $14), ($14 = $$.skip) !== void 0 && (this.skip = $14), ($14 = $$.last) !== void 0 && (this.last = $14);
  }
  constructor($$ = null) {
    this[$__init__$]($$);
  }
  [$__init__$]($$ = null, deep = !0) {
    var $2;
    this.owner = $$ && ($2 = $$.owner) !== void 0 ? $2 : null, this.target = $$ && ($2 = $$.target) !== void 0 ? $2 : null, this.active = $$ && ($2 = $$.active) !== void 0 ? $2 : !1, this.value = $$ && ($2 = $$.value) !== void 0 ? $2 : void 0, this.skip = $$ && ($2 = $$.skip) !== void 0 ? $2 : 0, this.last = $$ && ($2 = $$.last) !== void 0 ? $2 : 0;
  }
  tick(scheduler2, source) {
    return this.last = this.owner[$frames$], this.target.tick(this, source), 1;
  }
  update(o, activate\u03A6) {
    let on = this.active, val = o.value;
    return this.value != val && (this.deactivate(), this.value = val), (this.value || on || activate\u03A6) && this.activate(), this;
  }
  queue() {
    this.owner.add(this);
  }
  activate() {
    return this.value === !0 ? this.owner.on("commit", this) : this.value === !1 || typeof this.value == "number" && (this.value / 16.666666666666668 <= 2 ? this.owner.on("raf", this) : this[$interval$] = globalThis.setInterval(this.queue.bind(this), this.value)), this.active = !0, this;
  }
  deactivate() {
    return this.value === !0 && this.owner.un("commit", this), this.owner.un("raf", this), this[$interval$] && (globalThis.clearInterval(this[$interval$]), this[$interval$] = null), this.active = !1, this;
  }
}, Scheduler = class {
  constructor() {
    var self = this;
    this.id = Symbol(), this.queue = [], this.stage = -1, this[$stage$] = -1, this[$frames$] = 0, this[$scheduled$] = !1, this[$version$] = 0, this.listeners = {}, this.intervals = {}, this.commit = function() {
      return self.add("commit"), self;
    }, this[$fps$] = 0, this.$promise = null, this.$resolve = null, this[$ticker$] = function(e) {
      return self[$scheduled$] = !1, self.tick(e);
    };
  }
  touch() {
    return this[$version$]++;
  }
  get version() {
    return this[$version$];
  }
  add(item, force) {
    return (force || this.queue.indexOf(item) == -1) && this.queue.push(item), this[$scheduled$] || this[$schedule$](), this;
  }
  get committing\u03A6() {
    return this.queue.indexOf("commit") >= 0;
  }
  get syncing\u03A6() {
    return this[$stage$] == 1;
  }
  listen(ns, item) {
    let set = this.listeners[ns], first = !set;
    return set || (set = this.listeners[ns] = /* @__PURE__ */ new Set()), set.add(item), ns == "raf" && first && this.add("raf"), this;
  }
  unlisten(ns, item) {
    var $3;
    let set = this.listeners[ns];
    return set && set.delete(item), ns == "raf" && set && set.size == 0 && ($3 = this.listeners.raf, delete this.listeners.raf), this;
  }
  on(ns, item) {
    return this.listen(ns, item);
  }
  un(ns, item) {
    return this.unlisten(ns, item);
  }
  get promise() {
    var self = this;
    return this.$promise || (this.$promise = new Promise(function(resolve) {
      return self.$resolve = resolve;
    }));
  }
  tick(timestamp) {
    var self = this;
    let items = this.queue, frame = this[$frames$]++;
    if (this.ts || (this.ts = timestamp), this.dt = timestamp - this.ts, this.ts = timestamp, this.queue = [], this[$stage$] = 1, this[$version$]++, items.length)
      for (let i = 0, $42 = iter$__(items), $5 = $42.length; i < $5; i++) {
        let item = $42[i];
        typeof item == "string" && this.listeners[item] ? this.listeners[item].forEach(function(listener) {
          if (listener.tick instanceof Function)
            return listener.tick(self, item);
          if (listener instanceof Function)
            return listener(self, item);
        }) : item instanceof Function ? item(this.dt, this) : item.tick && item.tick(this.dt, this);
      }
    return this[$stage$] = this[$scheduled$] ? 0 : -1, this.$promise && (this.$resolve(this), this.$promise = this.$resolve = null), this.listeners.raf && this.add("raf"), this;
  }
  [$schedule$]() {
    return this[$scheduled$] || (this[$scheduled$] = !0, this[$stage$] == -1 && (this[$stage$] = 0), rAF(this[$ticker$])), this;
  }
  schedule(item, o) {
    var $6, $7;
    return o || (o = item[$6 = this.id] || (item[$6] = { value: !0 })), (o[$7 = this.id] || (o[$7] = new Scheduled({ owner: this, target: item }))).update(o, !0);
  }
  unschedule(item, o = {}) {
    o || (o = item[this.id]);
    let state = o && o[this.id];
    return state && state.active && state.deactivate(), this;
  }
}, scheduler = new Scheduler();
function commit() {
  return scheduler.add("commit").promise;
}
function setTimeout2(fn, ms) {
  return globalThis.setTimeout(function() {
    fn(), commit();
  }, ms);
}
function setInterval(fn, ms) {
  return globalThis.setInterval(function() {
    fn(), commit();
  }, ms);
}
var clearInterval = globalThis.clearInterval, clearTimeout = globalThis.clearTimeout, instance = globalThis.imba || (globalThis.imba = {});
instance.commit = commit;
instance.setTimeout = setTimeout2;
instance.setInterval = setInterval;
instance.clearInterval = clearInterval;
instance.clearTimeout = clearTimeout;

// ../imba/packages/imba/src/imba/dom/flags.imba
var $toStringDeopt$ = Symbol.for("#toStringDeopt"), $__initor__$3 = Symbol.for("#__initor__"), $__inited__$3 = Symbol.for("#__inited__"), $__hooks__$3 = Symbol.for("#__hooks__"), $symbols$ = Symbol.for("#symbols"), $batches$ = Symbol.for("#batches"), $extras$ = Symbol.for("#extras"), $stacks$ = Symbol.for("#stacks"), Flags = class {
  constructor(dom) {
    this.dom = dom, this.string = "";
  }
  contains(ref) {
    return this.dom.classList.contains(ref);
  }
  add(ref) {
    return this.contains(ref) ? this : (this.string += (this.string ? " " : "") + ref, this.dom.classList.add(ref), this);
  }
  remove(ref) {
    if (!this.contains(ref))
      return this;
    let regex = new RegExp("(^|\\s)" + ref + "(?=\\s|$)", "g");
    return this.string = this.string.replace(regex, ""), this.dom.classList.remove(ref), this;
  }
  toggle(ref, bool) {
    return bool === void 0 && (bool = !this.contains(ref)), bool ? this.add(ref) : this.remove(ref);
  }
  incr(ref, duration = 0) {
    var self = this;
    let m = this.stacks, c = m[ref] || 0;
    return c < 1 && this.add(ref), duration > 0 && setTimeout(function() {
      return self.decr(ref);
    }, duration), m[ref] = Math.max(c, 0) + 1;
  }
  decr(ref) {
    let m = this.stacks, c = m[ref] || 0;
    return c == 1 && this.remove(ref), m[ref] = Math.max(c, 1) - 1;
  }
  reconcile(sym, str) {
    let syms = this[$symbols$], vals = this[$batches$], dirty = !0;
    if (!syms)
      syms = this[$symbols$] = [sym], vals = this[$batches$] = [str || ""], this.toString = this.valueOf = this[$toStringDeopt$];
    else {
      let idx = syms.indexOf(sym), val = str || "";
      idx == -1 ? (syms.push(sym), vals.push(val)) : vals[idx] != val ? vals[idx] = val : dirty = !1;
    }
    dirty && (this[$extras$] = " " + vals.join(" "), this.sync());
  }
  valueOf() {
    return this.string;
  }
  toString() {
    return this.string;
  }
  [$toStringDeopt$]() {
    return this.string + (this[$extras$] || "");
  }
  sync() {
    return this.dom.flagSync$();
  }
  get stacks() {
    return this[$stacks$] || (this[$stacks$] = {});
  }
};

// ../imba/packages/imba/src/imba/dom/context.imba
var $__init__$2 = Symbol.for("#__init__"), $__patch__$2 = Symbol.for("#__patch__"), $__initor__$4 = Symbol.for("#__initor__"), $__inited__$4 = Symbol.for("#__inited__"), $__hooks__$4 = Symbol.for("#__hooks__"), $getRenderContext$ = Symbol.for("#getRenderContext"), $getDynamicContext$ = Symbol.for("#getDynamicContext"), $1 = Symbol(), renderContext = {
  context: null
}, Renderer = class {
  [$__patch__$2]($$ = {}) {
    var $2;
    ($2 = $$.stack) !== void 0 && (this.stack = $2);
  }
  constructor($$ = null) {
    this[$__init__$2]($$);
  }
  [$__init__$2]($$ = null, deep = !0) {
    var $3;
    this.stack = $$ && ($3 = $$.stack) !== void 0 ? $3 : [];
  }
  push(el) {
    return this.stack.push(el);
  }
  pop(el) {
    return this.stack.pop();
  }
}, renderer = new Renderer(), RenderContext = class extends Map {
  static [$__init__$2]() {
    return this.prototype[$__initor__$4] = $1, this;
  }
  constructor(parent, sym = null) {
    super(), this._ = parent, this.sym = sym, this[$__initor__$4] === $1 && (this[$__hooks__$4] && this[$__hooks__$4].inited(this), this[$__inited__$4] && this[$__inited__$4]());
  }
  pop() {
    return renderContext.context = null;
  }
  [$getRenderContext$](sym) {
    let out = this.get(sym);
    return out || this.set(sym, out = new RenderContext(this._, sym)), renderContext.context = out;
  }
  [$getDynamicContext$](sym, key) {
    return this[$getRenderContext$](sym)[$getRenderContext$](key);
  }
  run(value) {
    return this.value = value, renderContext.context == this && (renderContext.context = null), this.get(value);
  }
  cache(val) {
    return this.set(this.value, val), val;
  }
};
RenderContext[$__init__$2]();
function createRenderContext(cache, key = Symbol(), up = cache) {
  return renderContext.context = cache[key] || (cache[key] = new RenderContext(up, key));
}
function getRenderContext() {
  let ctx = renderContext.context, res = ctx || new RenderContext(null);
  return ctx && (renderContext.context = null), res;
}

// ../imba/packages/imba/src/imba/dom/core.web.imba
function extend$__(target, ext) {
  let descriptors = Object.getOwnPropertyDescriptors(ext);
  return delete descriptors.constructor, Object.defineProperties(target, descriptors), target;
}
function iter$__2(a) {
  let v;
  return a && ((v = a.toIterable) ? v.call(a) : a);
}
var $parent$ = Symbol.for("#parent"), $closestNode$ = Symbol.for("#closestNode"), $parentNode$ = Symbol.for("#parentNode"), $context$ = Symbol.for("#context"), $__init__$3 = Symbol.for("#__init__"), $$inited$ = Symbol.for("##inited"), $getRenderContext$2 = Symbol.for("#getRenderContext"), $getDynamicContext$2 = Symbol.for("#getDynamicContext"), $insertChild$ = Symbol.for("#insertChild"), $appendChild$ = Symbol.for("#appendChild"), $replaceChild$ = Symbol.for("#replaceChild"), $removeChild$ = Symbol.for("#removeChild"), $insertInto$ = Symbol.for("#insertInto"), $insertIntoDeopt$ = Symbol.for("#insertIntoDeopt"), $removeFrom$ = Symbol.for("#removeFrom"), $removeFromDeopt$ = Symbol.for("#removeFromDeopt"), $replaceWith$ = Symbol.for("#replaceWith"), $replaceWithDeopt$ = Symbol.for("#replaceWithDeopt"), $placeholderNode$ = Symbol.for("#placeholderNode"), $attachToParent$ = Symbol.for("#attachToParent"), $detachFromParent$ = Symbol.for("#detachFromParent"), $placeChild$ = Symbol.for("#placeChild"), $beforeReconcile$ = Symbol.for("#beforeReconcile"), $afterReconcile$ = Symbol.for("#afterReconcile"), $afterVisit$ = Symbol.for("#afterVisit"), $visitContext$ = Symbol.for("#visitContext"), $$parent$ = Symbol.for("##parent"), $$up$ = Symbol.for("##up"), $$context$ = Symbol.for("##context"), $domNode$ = Symbol.for("#domNode"), $$placeholderNode$ = Symbol.for("##placeholderNode"), $domDeopt$ = Symbol.for("#domDeopt"), $$visitContext$ = Symbol.for("##visitContext"), $isRichElement$ = Symbol.for("#isRichElement"), $src$ = Symbol.for("#src"), $htmlNodeName$ = Symbol.for("#htmlNodeName"), $getSlot$ = Symbol.for("#getSlot"), $ImbaElement$ = Symbol.for("#ImbaElement"), $cssns$ = Symbol.for("#cssns"), $cssid$ = Symbol.for("#cssid"), {
  Event,
  UIEvent,
  MouseEvent,
  PointerEvent,
  KeyboardEvent,
  CustomEvent,
  Node,
  Comment,
  Text,
  Element,
  HTMLElement,
  HTMLHtmlElement,
  HTMLSelectElement,
  HTMLInputElement,
  HTMLTextAreaElement,
  HTMLButtonElement,
  HTMLOptionElement,
  HTMLScriptElement,
  SVGElement,
  DocumentFragment,
  ShadowRoot,
  Document,
  Window,
  customElements
} = globalThis.window, descriptorCache = {};
function getDescriptor(item, key, cache) {
  if (!item)
    return cache[key] = null;
  if (cache[key] !== void 0)
    return cache[key];
  let desc = Object.getOwnPropertyDescriptor(item, key);
  return desc !== void 0 || item == SVGElement ? cache[key] = desc || null : getDescriptor(Reflect.getPrototypeOf(item), key, cache);
}
var CustomTagConstructors = {}, CustomTagToElementNames = {}, TYPES = {}, CUSTOM_TYPES = {};
var contextHandler = {
  get(target, name) {
    let ctx = target, val;
    for (; ctx && val == null; )
      (ctx = ctx[$parent$]) && (val = ctx[name]);
    return val;
  },
  set(target, name, value) {
    let ctx = target, val;
    for (; ctx && val == null; ) {
      if (getDeepPropertyDescriptor(ctx, name, Element))
        return ctx[name] = value, !0;
      ctx = ctx[$parent$];
    }
    return !0;
  }
}, \u03A9Document\u03A91 = class {
  get flags() {
    return this.documentElement.flags;
  }
};
extend$__(Document.prototype, \u03A9Document\u03A91.prototype);
var \u03A9Node\u03A92 = class {
  get [$parent$]() {
    return this[$$parent$] || this.parentNode || this[$$up$];
  }
  get [$closestNode$]() {
    return this;
  }
  get [$parentNode$]() {
    return this[$parent$][$closestNode$];
  }
  get [$context$]() {
    return this[$$context$] || (this[$$context$] = new Proxy(this, contextHandler));
  }
  [$__init__$3]() {
    return this;
  }
  [$$inited$]() {
    return this;
  }
  [$getRenderContext$2](sym) {
    return createRenderContext(this, sym);
  }
  [$getDynamicContext$2](sym, key) {
    return this[$getRenderContext$2](sym)[$getRenderContext$2](key);
  }
  [$insertChild$](newnode, refnode) {
    return newnode[$insertInto$](this, refnode);
  }
  [$appendChild$](newnode) {
    return newnode[$insertInto$](this, null);
  }
  [$replaceChild$](newnode, oldnode) {
    let res = this[$insertChild$](newnode, oldnode);
    return this[$removeChild$](oldnode), res;
  }
  [$removeChild$](node) {
    return node[$removeFrom$](this);
  }
  [$insertInto$](parent, before = null) {
    return before ? parent.insertBefore(this, before) : parent.appendChild(this), this;
  }
  [$insertIntoDeopt$](parent, before) {
    return before ? parent.insertBefore(this[$domNode$] || this, before) : parent.appendChild(this[$domNode$] || this), this;
  }
  [$removeFrom$](parent) {
    return parent.removeChild(this);
  }
  [$removeFromDeopt$](parent) {
    return parent.removeChild(this[$domNode$] || this);
  }
  [$replaceWith$](other, parent) {
    return parent[$replaceChild$](other, this);
  }
  [$replaceWithDeopt$](other, parent) {
    return parent[$replaceChild$](other, this[$domNode$] || this);
  }
  get [$placeholderNode$]() {
    return this[$$placeholderNode$] || (this[$$placeholderNode$] = globalThis.document.createComment("placeholder"));
  }
  set [$placeholderNode$](value) {
    let prev = this[$$placeholderNode$];
    this[$$placeholderNode$] = value, prev && prev != value && prev.parentNode && prev[$replaceWith$](value);
  }
  [$attachToParent$]() {
    let ph = this[$domNode$], par = ph && ph.parentNode;
    return ph && par && ph != this && (this[$domNode$] = null, this[$insertInto$](par, ph), ph[$removeFrom$](par)), this;
  }
  [$detachFromParent$]() {
    this[$domDeopt$] != !0 && (this[$domDeopt$] = !0, !0) && (this[$replaceWith$] = this[$replaceWithDeopt$], this[$removeFrom$] = this[$removeFromDeopt$], this[$insertInto$] = this[$insertIntoDeopt$], this[$$up$] || (this[$$up$] = this[$parent$]));
    let ph = this[$placeholderNode$];
    return this.parentNode && ph != this && (ph[$insertInto$](this.parentNode, this), this[$removeFrom$](this.parentNode)), this[$domNode$] = ph, this;
  }
  [$placeChild$](item, f, prev) {
    let type = typeof item;
    if (type === "undefined" || item === null) {
      if (prev && prev instanceof Comment)
        return prev;
      let el = globalThis.document.createComment("");
      return prev ? prev[$replaceWith$](el, this) : el[$insertInto$](this, null);
    }
    if (item === prev)
      return item;
    if (type !== "object") {
      let res, txt = item;
      return f & 128 && f & 256, prev ? prev instanceof Text ? (prev.textContent = txt, prev) : (res = globalThis.document.createTextNode(txt), prev[$replaceWith$](res, this), res) : (this.appendChild(res = globalThis.document.createTextNode(txt)), res);
    } else
      return prev ? prev[$replaceWith$](item, this) : item[$insertInto$](this, null);
  }
};
extend$__(Node.prototype, \u03A9Node\u03A92.prototype);
var \u03A9Element\u03A93 = class {
  log(...params) {
    return console.log(...params), this;
  }
  emit(name, detail, o = { bubbles: !0, cancelable: !0 }) {
    detail != null && (o.detail = detail);
    let event = new CustomEvent(name, o), res = this.dispatchEvent(event);
    return event;
  }
  text$(item) {
    return this.textContent = item, this;
  }
  [$beforeReconcile$]() {
    return this;
  }
  [$afterReconcile$]() {
    return this;
  }
  [$afterVisit$]() {
    this.render && this.render(), this[$$visitContext$] && (this[$$visitContext$] = null);
  }
  get [$visitContext$]() {
    return this[$$visitContext$] || (this[$$visitContext$] = {});
  }
  get flags() {
    return this.$flags || (this.$flags = new Flags(this), this.flag$ == Element.prototype.flag$ && (this.flags$ext = this.className), this.flagDeopt$()), this.$flags;
  }
  flag$(str) {
    let ns = this.flags$ns;
    this.className = ns ? ns + (this.flags$ext = str) : this.flags$ext = str;
  }
  flagDeopt$() {
    var self = this;
    this.flag$ = this.flagExt$, this.flagSelf$ = function(str) {
      return self.flagSync$(self.flags$own = str);
    };
  }
  flagExt$(str) {
    return this.flagSync$(this.flags$ext = str);
  }
  flagSelf$(str) {
    return this.flagDeopt$(), this.flagSelf$(str);
  }
  flagSync$() {
    return this.className = (this.flags$ns || "") + (this.flags$ext || "") + " " + (this.flags$own || "") + " " + (this.$flags || "");
  }
  set$(key, value) {
    let desc = getDeepPropertyDescriptor(this, key, Element);
    !desc || !desc.set ? this.setAttribute(key, value) : this[key] = value;
  }
  get richValue() {
    return this.value;
  }
  set richValue(value) {
    this.value = value;
  }
};
extend$__(Element.prototype, \u03A9Element\u03A93.prototype);
Element.prototype.setns$ = Element.prototype.setAttributeNS;
Element.prototype[$isRichElement$] = !0;
function createElement(name, parent, flags, text) {
  let el = globalThis.document.createElement(name);
  return flags && (el.className = flags), text !== null && el.text$(text), parent && parent[$appendChild$] && parent[$appendChild$](el), el;
}
var \u03A9SVGElement\u03A94 = class {
  set$(key, value) {
    var $14;
    let cache = descriptorCache[$14 = this.nodeName] || (descriptorCache[$14] = {}), desc = getDescriptor(this, key, cache);
    !desc || !desc.set ? this.setAttribute(key, value) : this[key] = value;
  }
  flag$(str) {
    let ns = this.flags$ns;
    this.setAttribute("class", ns ? ns + (this.flags$ext = str) : this.flags$ext = str);
  }
  flagSelf$(str) {
    var self = this;
    return this.flag$ = function(str2) {
      return self.flagSync$(self.flags$ext = str2);
    }, this.flagSelf$ = function(str2) {
      return self.flagSync$(self.flags$own = str2);
    }, this.flagSelf$(str);
  }
  flagSync$() {
    return this.setAttribute("class", (this.flags$ns || "") + (this.flags$ext || "") + " " + (this.flags$own || "") + " " + (this.$flags || ""));
  }
};
extend$__(SVGElement.prototype, \u03A9SVGElement\u03A94.prototype);
var \u03A9SVGSVGElement\u03A95 = class {
  set src(value) {
    if (this[$src$] != value && (this[$src$] = value, !0)) {
      if (value && value.adoptNode)
        value.adoptNode(this);
      else if (value && value.type == "svg") {
        if (value.attributes)
          for (let $42 = value.attributes, $2 = 0, $3 = Object.keys($42), $5 = $3.length, k, v; $2 < $5; $2++)
            k = $3[$2], v = $42[k], this.setAttribute(k, v);
        this.innerHTML = value.content;
      }
    }
  }
};
extend$__(SVGSVGElement.prototype, \u03A9SVGSVGElement\u03A95.prototype);
var navigator = globalThis.navigator, vendor = navigator && navigator.vendor || "", ua = navigator && navigator.userAgent || "", isSafari = vendor.indexOf("Apple") > -1 || ua.indexOf("CriOS") >= 0 || ua.indexOf("FxiOS") >= 0, supportsCustomizedBuiltInElements = !isSafari, CustomDescriptorCache = /* @__PURE__ */ new Map(), CustomHook = class extends HTMLElement {
  connectedCallback() {
    return supportsCustomizedBuiltInElements ? this.parentNode.removeChild(this) : this.parentNode.connectedCallback();
  }
  disconnectedCallback() {
    if (!supportsCustomizedBuiltInElements)
      return this.parentNode.disconnectedCallback();
  }
};
window.customElements.define("i-hook", CustomHook);
function getCustomDescriptors(el, klass) {
  let props = CustomDescriptorCache.get(klass);
  if (!props) {
    props = {};
    let proto = klass.prototype, protos = [proto];
    for (; (proto = proto && Object.getPrototypeOf(proto)) && proto.constructor != el.constructor; )
      protos.unshift(proto);
    for (let $6 = 0, $7 = iter$__2(protos), $82 = $7.length; $6 < $82; $6++) {
      let item = $7[$6], desc = Object.getOwnPropertyDescriptors(item);
      Object.assign(props, desc);
    }
    CustomDescriptorCache.set(klass, props);
  }
  return props;
}
function createComponent(name, parent, flags, text, ctx) {
  let el;
  typeof name != "string" && name && name.nodeName && (name = name.nodeName);
  let cmpname = CustomTagToElementNames[name] || name;
  if (CustomTagConstructors[name]) {
    let cls = CustomTagConstructors[name], typ = cls.prototype[$htmlNodeName$];
    if (typ && supportsCustomizedBuiltInElements)
      el = globalThis.document.createElement(typ, { is: name });
    else if (cls.create$ && typ) {
      el = globalThis.document.createElement(typ), el.setAttribute("is", cmpname);
      let props = getCustomDescriptors(el, cls);
      Object.defineProperties(el, props), el.__slots = {}, el.appendChild(globalThis.document.createElement("i-hook"));
    } else
      cls.create$ ? (el = cls.create$(el), el.__slots = {}) : console.warn("could not create tag " + name);
  } else
    el = globalThis.document.createElement(CustomTagToElementNames[name] || name);
  return el[$$parent$] = parent, el[$__init__$3](), el[$$inited$](), text !== null && el[$getSlot$]("__").text$(text), (flags || el.flags$ns) && el.flag$(flags || ""), el;
}
function defineTag(name, klass, options = {}) {
  TYPES[name] = CUSTOM_TYPES[name] = klass, klass.nodeName = name;
  let componentName = name, proto = klass.prototype;
  if (name.indexOf("-") == -1 && (componentName = "" + name + "-tag", CustomTagToElementNames[name] = componentName), options.cssns) {
    let ns = (proto._ns_ || proto[$cssns$] || "") + " " + (options.cssns || "");
    proto._ns_ = ns.trim() + " ", proto[$cssns$] = options.cssns;
  }
  if (options.cssid) {
    let ids = (proto.flags$ns || "") + " " + options.cssid;
    proto[$cssid$] = options.cssid, proto.flags$ns = ids.trim() + " ";
  }
  return proto[$htmlNodeName$] && !options.extends && (options.extends = proto[$htmlNodeName$]), options.extends ? (proto[$htmlNodeName$] = options.extends, CustomTagConstructors[name] = klass, supportsCustomizedBuiltInElements && window.customElements.define(componentName, klass, { extends: options.extends })) : window.customElements.define(componentName, klass), klass;
}
var instance2 = globalThis.imba || (globalThis.imba = {});
instance2.document = globalThis.document;

// ../imba/packages/imba/src/imba/dom/component.imba
var $__init__$4 = Symbol.for("#__init__"), $__patch__$3 = Symbol.for("#__patch__"), $$inited$2 = Symbol.for("##inited"), $afterVisit$2 = Symbol.for("#afterVisit"), $beforeReconcile$2 = Symbol.for("#beforeReconcile"), $afterReconcile$2 = Symbol.for("#afterReconcile"), $__hooks__$5 = Symbol.for("#__hooks__"), $autorender$ = Symbol.for("#autorender"), $$visitContext$2 = Symbol.for("##visitContext"), hydrator = new class {
  [$__patch__$3]($$ = {}) {
    var $14;
    ($14 = $$.items) !== void 0 && (this.items = $14), ($14 = $$.current) !== void 0 && (this.current = $14), ($14 = $$.lastQueued) !== void 0 && (this.lastQueued = $14), ($14 = $$.tests) !== void 0 && (this.tests = $14);
  }
  constructor($$ = null) {
    this[$__init__$4]($$);
  }
  [$__init__$4]($$ = null, deep = !0) {
    var $2;
    this.items = $$ && ($2 = $$.items) !== void 0 ? $2 : [], this.current = $$ && ($2 = $$.current) !== void 0 ? $2 : null, this.lastQueued = $$ && ($2 = $$.lastQueued) !== void 0 ? $2 : null, this.tests = $$ && ($2 = $$.tests) !== void 0 ? $2 : 0;
  }
  flush() {
    let item = null;
    for (; item = this.items.shift(); ) {
      if (!item.parentNode || item.hydrated\u03A6)
        continue;
      let prev = this.current;
      this.current = item, item.__F |= 1024, item.connectedCallback(), this.current = prev;
    }
  }
  queue(item) {
    var self = this;
    let len = this.items.length, idx = 0, prev = this.lastQueued;
    this.lastQueued = item;
    let BEFORE = Node.DOCUMENT_POSITION_PRECEDING, AFTER = Node.DOCUMENT_POSITION_FOLLOWING;
    if (len) {
      let prevIndex = this.items.indexOf(prev), index = prevIndex, compare = function(a, b) {
        return self.tests++, a.compareDocumentPosition(b);
      };
      (prevIndex == -1 || prev.nodeName != item.nodeName) && (index = prevIndex = 0);
      let curr = this.items[index];
      for (; curr && compare(curr, item) & AFTER; )
        curr = this.items[++index];
      if (index != prevIndex)
        curr ? this.items.splice(index, 0, item) : this.items.push(item);
      else {
        for (; curr && compare(curr, item) & BEFORE; )
          curr = this.items[--index];
        index != prevIndex && (curr ? this.items.splice(index + 1, 0, item) : this.items.unshift(item));
      }
    } else
      this.items.push(item), this.current || globalThis.queueMicrotask(this.flush.bind(this));
  }
}();
var Component = class extends HTMLElement {
  constructor() {
    super(), this.flags$ns && (this.flag$ = this.flagExt$), this.setup$(), this.build();
  }
  setup$() {
    return this.__slots = {}, this.__F = 0;
  }
  [$__init__$4]() {
    return this.__F |= 3, this;
  }
  [$$inited$2]() {
    if (this[$__hooks__$5])
      return this[$__hooks__$5].inited(this);
  }
  flag$(str) {
    this.className = this.flags$ext = str;
  }
  build() {
    return this;
  }
  awaken() {
    return this;
  }
  mount() {
    return this;
  }
  unmount() {
    return this;
  }
  rendered() {
    return this;
  }
  dehydrate() {
    return this;
  }
  hydrate() {
    return this.autoschedule = !0, this;
  }
  tick() {
    return this.commit();
  }
  visit() {
    return this.commit();
  }
  commit() {
    return this.render\u03A6 ? (this.__F |= 256, this.render && this.render(), this.rendered(), this.__F = (this.__F | 512) & -257 & -8193) : (this.__F |= 8192, this);
  }
  get autoschedule() {
    return (this.__F & 64) != 0;
  }
  set autoschedule(value) {
    value ? this.__F |= 64 : this.__F &= -65;
  }
  set autorender(value) {
    let o = this[$autorender$] || (this[$autorender$] = {});
    o.value = value, this.mounted\u03A6 && scheduler.schedule(this, o);
  }
  get render\u03A6() {
    return !this.suspended\u03A6;
  }
  get mounting\u03A6() {
    return (this.__F & 16) != 0;
  }
  get mounted\u03A6() {
    return (this.__F & 32) != 0;
  }
  get awakened\u03A6() {
    return (this.__F & 8) != 0;
  }
  get rendered\u03A6() {
    return (this.__F & 512) != 0;
  }
  get suspended\u03A6() {
    return (this.__F & 4096) != 0;
  }
  get rendering\u03A6() {
    return (this.__F & 256) != 0;
  }
  get scheduled\u03A6() {
    return (this.__F & 128) != 0;
  }
  get hydrated\u03A6() {
    return (this.__F & 2) != 0;
  }
  get ssr\u03A6() {
    return (this.__F & 1024) != 0;
  }
  schedule() {
    return scheduler.on("commit", this), this.__F |= 128, this;
  }
  unschedule() {
    return scheduler.un("commit", this), this.__F &= -129, this;
  }
  async suspend(cb = null) {
    let val = this.flags.incr("_suspended_");
    return this.__F |= 4096, cb instanceof Function && (await cb(), this.unsuspend()), this;
  }
  unsuspend() {
    return this.flags.decr("_suspended_") == 0 && (this.__F &= -4097, this.commit()), this;
  }
  [$afterVisit$2]() {
    if (this.visit(), this[$$visitContext$2])
      return this[$$visitContext$2] = null;
  }
  [$beforeReconcile$2]() {
    return this.__F & 1024 && (this.__F = this.__F & -1025, this.classList.remove("_ssr_"), this.flags$ext && this.flags$ext.indexOf("_ssr_") == 0 && (this.flags$ext = this.flags$ext.slice(5)), this.__F & 512 || (this.innerHTML = "")), this;
  }
  [$afterReconcile$2]() {
    return this;
  }
  connectedCallback() {
    let flags = this.__F, inited = flags & 1, awakened = flags & 8;
    if (!inited && !(flags & 1024)) {
      hydrator.queue(this);
      return;
    }
    if (flags & 48)
      return;
    this.__F |= 16, inited || this[$__init__$4](), flags & 2 || (this.flags$ext = this.className, this.__F |= 2, this.hydrate(), this.commit()), awakened || (this.awaken(), this.__F |= 8), emit(this, "mount");
    let res = this.mount();
    return res && res.then instanceof Function && res.then(scheduler.commit), flags = this.__F = (this.__F | 32) & -17, flags & 64 && this.schedule(), this[$autorender$] && scheduler.schedule(this, this[$autorender$]), this;
  }
  disconnectedCallback() {
    if (this.__F = this.__F & -49, this.__F & 128 && this.unschedule(), emit(this, "unmount"), this.unmount(), this[$autorender$])
      return scheduler.unschedule(this, this[$autorender$]);
  }
};

// ../imba/packages/imba/src/imba/dom/mount.imba
var $insertInto$2 = Symbol.for("#insertInto"), $removeFrom$2 = Symbol.for("#removeFrom");
function mount(mountable, into) {
  let parent = into || globalThis.document.body, element = mountable;
  if (mountable instanceof Function) {
    let ctx = new RenderContext(parent, null), tick = function() {
      let prev = renderContext.context;
      renderContext.context = ctx;
      let res = mountable(ctx);
      return renderContext.context == ctx && (renderContext.context = prev), res;
    };
    element = tick(), scheduler.listen("commit", tick);
  } else
    element.__F |= 64;
  return element[$insertInto$2](parent), element;
}
function unmount(el) {
  return el && el[$removeFrom$2] && el[$removeFrom$2](el.parentNode), el;
}
var instance3 = globalThis.imba || (globalThis.imba = {});
instance3.mount = mount;
instance3.unmount = unmount;

// ../imba/packages/imba/src/imba/router/index.imba
var import_events = __toESM(require_events());

// ../imba/packages/imba/src/imba/router/location.imba
var $getQueryParam$ = Symbol.for("#getQueryParam"), $setQueryParam$ = Symbol.for("#setQueryParam"), $__initor__$5 = Symbol.for("#__initor__"), $__inited__$5 = Symbol.for("#__inited__"), $__hooks__$6 = Symbol.for("#__hooks__"), $query$ = Symbol.for("#query");
var Location = class {
  static parse(url, router2) {
    return url instanceof Location ? url : new Location(url, router2);
  }
  constructor(url, router2) {
    this.router = router2, this.parse(url);
  }
  parse(url) {
    var _a;
    let alias;
    return url instanceof URL || (url = new URL(url, this.router.origin)), (alias = (_a = this.router) == null ? void 0 : _a.aliases[url.pathname]) && (url.pathname = alias), this.url = url, this;
  }
  get active\u03A6() {
    return this.router.location == this;
  }
  reparse() {
    return this.parse(this.url);
  }
  get searchParams() {
    return this.url.searchParams;
  }
  search() {
    let str = this.searchParams ? this.searchParams.toString() : "";
    return str ? "?" + str : "";
  }
  update(value) {
    if (value instanceof Object)
      for (let $14 = 0, $2 = Object.keys(value), $3 = $2.length, k, v; $14 < $3; $14++)
        k = $2[$14], v = value[k], this.searchParams.set(k, v);
    else
      typeof value == "string" && this.parse(value);
    return this;
  }
  clone() {
    return new Location(this.url.href, this.router);
  }
  equals(other) {
    return this.toString() == String(other);
  }
  get href() {
    return this.url.href;
  }
  get path() {
    return this.url.href.slice(this.url.origin.length);
  }
  get pathname() {
    return this.url.pathname;
  }
  get query() {
    return this[$query$] || (this[$query$] = new Proxy({}, {
      get: this[$getQueryParam$].bind(this),
      set: this[$setQueryParam$].bind(this)
    }));
  }
  toString() {
    return this.href;
  }
  [$getQueryParam$](target, name) {
    return this.searchParams.get(name);
  }
  [$setQueryParam$](target, name, value) {
    return this[$getQueryParam$](target, name) != value && (value == null || value == "" ? this.searchParams.delete(name) : this.searchParams.set(name, value), this.active\u03A6 && (this.router.history.replaceState({}, null, this.url.toString()), this.router.touch())), !0;
  }
};

// ../imba/packages/imba/src/imba/router/request.imba
var $__initor__$6 = Symbol.for("#__initor__"), $__inited__$6 = Symbol.for("#__inited__"), $__hooks__$7 = Symbol.for("#__hooks__"), Request = class {
  constructor(router2, loc, referrer) {
    this.router = router2, loc && (this.location = Location.parse(loc), this.original = this.location.clone()), this.referrer = referrer;
  }
  redirect(path) {
    var _a, _b;
    return (_b = (_a = this.location) == null ? void 0 : _a.update) == null || _b.call(_a, path), this;
  }
  get path() {
    var _a;
    return (_a = this.location) == null ? void 0 : _a.path;
  }
  get url() {
    var _a, _b;
    return (_b = (_a = this.location) == null ? void 0 : _a.toString) == null ? void 0 : _b.call(_a);
  }
  set path(value) {
    this.location.path = value;
  }
  abort(forced = !1) {
    return this.aborted = !0, forced && (this.forceAbort = forced), this;
  }
  match(str) {
    return this.location ? this.router.route(str).match(this.path) : null;
  }
};

// ../imba/packages/imba/src/imba/router/route.imba
function iter$__3(a) {
  let v;
  return a && ((v = a.toIterable) ? v.call(a) : a);
}
var $__initor__$7 = Symbol.for("#__initor__"), $__inited__$7 = Symbol.for("#__inited__"), $__hooks__$8 = Symbol.for("#__hooks__"), $routes$ = Symbol.for("#routes"), $match$ = Symbol.for("#match"), $symbol$ = Symbol.for("#symbol"), $matches$ = Symbol.for("#matches"), cacheMap = /* @__PURE__ */ new Map(), urlCache = {}, queryCache = {}, anyRegex = /.*/;
function cacheForMatch(match) {
  if (!cacheMap.has(match)) {
    let map = /* @__PURE__ */ new Map();
    return cacheMap.set(match, map), map;
  }
  return cacheMap.get(match);
}
function combinedDeepMatch(parent, params) {
  let map = cacheForMatch(parent);
  if (!map.has(params)) {
    let item = Object.create(parent);
    return Object.assign(item, params), map.set(params, item), item;
  }
  return map.get(params);
}
var Match = class {
};
function parseUrl(str) {
  if (urlCache[str])
    return urlCache[str];
  let url = urlCache[str] = { url: str }, qryidx = str.indexOf("?"), hshidx = str.indexOf("#");
  if (hshidx >= 0 && (url.hash = str.slice(hshidx + 1), str = url.url = str.slice(0, hshidx)), qryidx >= 0) {
    let q = url.query = str.slice(qryidx + 1);
    str = str.slice(0, qryidx), url.query = queryCache[q] || (queryCache[q] = new URLSearchParams(q));
  }
  return url.path = str, url;
}
var RootRoute = class {
  constructor(router2) {
    this.router = router2, this.fullPath = "", this[$routes$] = {}, this[$match$] = new Match(), this[$match$].path = "";
  }
  route(pattern) {
    var $14;
    return ($14 = this[$routes$])[pattern] || ($14[pattern] = new Route(this.router, pattern, this));
  }
  match() {
    return this[$match$];
  }
  resolve(url) {
    return "/";
  }
}, Route = class {
  constructor(router2, str, parent) {
    this.parent = parent || router2.rootRoute, this.router = router2, this.status = 200, this.path = str, this[$symbol$] = Symbol(), this[$matches$] = {}, this[$routes$] = {};
  }
  route(pattern) {
    var $2;
    return ($2 = this[$routes$])[pattern] || ($2[pattern] = new Route(this.router, pattern, this));
  }
  get fullPath() {
    return "" + this.parent.fullPath + "/" + this.$path;
  }
  load(cb) {
    return this.router.queue.add(cb);
  }
  set path(path) {
    var self = this;
    if (this.$path == path)
      return;
    if (this.raw = path, this.$path = path, this.groups = [], this.cache = {}, this.dynamic = !1, path.indexOf("?") >= 0) {
      let parts = path.split("?");
      path = parts.shift(), this.query = {};
      for (let $3 = 0, $42 = iter$__3(parts.join("?").split("&")), $5 = $42.length; $3 < $5; $3++) {
        let pair = $42[$3];
        if (!pair)
          continue;
        let [k, v] = pair.split("=");
        k[0] == "!" && (this.dynamic = !0, k = k.slice(1), v = !1), v === "" && (v = !1), v && v[0] == ":" && (this.dynamic = !0), this.query[k] = v || v !== !1;
      }
    }
    if (path = path.replace(/\:(\w+|\*)(\.)?/g, function(m, id, dot) {
      return self.dynamic = !0, id != "*" && self.groups.push(id), dot ? "([^/#.?]+)." : "([^/#?]+)";
    }), path == "" && this.query)
      return;
    if (path == "*")
      return this.regex = anyRegex, this;
    path = "^" + path;
    let end = path[path.length - 1];
    (end == "$" || end == "/") && (path = path.slice(0, -1) + "(?=/?[#?]|/?$)"), end != "/" && end != "$" && path != "^/" && (path = path + "(?=[/#?]|$)"), this.regex = new RegExp(path);
  }
  match(str = this.router.path) {
    var _a, _b;
    var match, $123;
    let up = this.parent.match(str);
    if (!up)
      return null;
    let url = parseUrl(str), matcher = url.url, prefix = "";
    if (up.path && url.path.indexOf(up.path) == 0 && (prefix = up.path + "/", matcher = matcher.slice(prefix.length)), match = this.regex ? matcher.match(this.regex) : [""]) {
      let fullpath = prefix + match[0], matchid = [this.$path], params = {};
      if (this.groups.length)
        for (let i = 0, $6 = iter$__3(match), $7 = $6.length, name; i < $7; i++) {
          let item = $6[i];
          (name = this.groups[i - 1]) && (params[name] = item, matchid.push(item));
        }
      if (this.query)
        for (let $10 = this.query, $82 = 0, $9 = Object.keys($10), $11 = $9.length, k, v; $82 < $11; $82++) {
          k = $9[$82], v = $10[k];
          let name = k, m = (_b = (_a = url.query) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a, k);
          if (v === !1) {
            if (m)
              return null;
            matchid.push("1");
            continue;
          }
          if (v[0] == ":" && (name = v.slice(1), v = !0), v == !0 && m || v == m)
            params[name] = m, matchid.push(m);
          else
            return null;
        }
      let key = matchid.join("*");
      params = ($123 = this[$matches$])[key] || ($123[key] = params);
      let result = combinedDeepMatch(up, params);
      return result.path = fullpath, result;
    }
    return null;
  }
  resolve(url = this.router.path) {
    if (this.raw[0] == "/" && !this.dynamic)
      return this.raw.replace(/\$/g, "");
    let up = this.parent.match(url), upres = this.parent.resolve(url), out;
    if (this.dynamic) {
      let m = this.match(url);
      return m ? m.path : null;
    }
    return this.raw[0] == "?" ? out = (upres || "/") + this.raw : out = upres + "/" + this.raw, out.replace(/\$/g, "").replace(/\/\/+/g, "/");
  }
};

// ../imba/packages/imba/src/imba/queue.imba
var $__initor__$8 = Symbol.for("#__initor__"), $__inited__$8 = Symbol.for("#__inited__"), $__hooks__$9 = Symbol.for("#__hooks__"), $__init__$5 = Symbol.for("#__init__"), $idler$ = Symbol.for("#idler"), $resolve$ = Symbol.for("#resolve"), $12 = Symbol(), Queue = class extends Set {
  static [$__init__$5]() {
    return this.prototype[$__initor__$8] = $12, this;
  }
  constructor() {
    super(), this[$idler$] = Promise.resolve(this), this[$__initor__$8] === $12 && (this[$__hooks__$9] && this[$__hooks__$9].inited(this), this[$__inited__$8] && this[$__inited__$8]());
  }
  emit(name, ...params) {
    return emit(this, name, params);
  }
  on(name, ...params) {
    return listen(this, name, ...params);
  }
  once(name, ...params) {
    return once(this, name, ...params);
  }
  un(name, ...params) {
    return unlisten(this, name, ...params);
  }
  add(value) {
    var self = this;
    if (value instanceof Function && (value = value()), !this.has(value)) {
      value.then(function() {
        return self.delete(value);
      });
      let first = this.size == 0;
      super.add(value), first && (this[$idler$] = this[$resolve$] = null, this.emit("busy", this));
    }
    return value;
  }
  delete(value) {
    return super.delete(value) ? (this.size == 0 && (this[$resolve$] && (this[$resolve$](this), this[$resolve$] = null), this.emit("idle", this)), !0) : !1;
  }
  get idle() {
    var self = this;
    return this[$idler$] || (this[$idler$] = new Promise(function(resolve) {
      return self[$resolve$] = resolve;
    }));
  }
};
Queue[$__init__$5]();

// ../imba/packages/imba/src/imba/router/index.imba
function extend$__2(target, ext) {
  let descriptors = Object.getOwnPropertyDescriptors(ext);
  return delete descriptors.constructor, Object.defineProperties(target, descriptors), target;
}
var $__initor__$9 = Symbol.for("#__initor__"), $__inited__$9 = Symbol.for("#__inited__"), $__hooks__$10 = Symbol.for("#__hooks__"), $__init__$6 = Symbol.for("#__init__"), $enter$ = Symbol.for("#enter"), $resolved$ = Symbol.for("#resolved"), $leave$ = Symbol.for("#leave"), $afterVisitRouted$ = Symbol.for("#afterVisitRouted"), $afterVisitRouteTo$ = Symbol.for("#afterVisitRouteTo"), $router$ = Symbol.for("#router"), $routes$2 = Symbol.for("#routes"), $version$2 = Symbol.for("#version"), $doc$ = Symbol.for("#doc"), $origin$ = Symbol.for("#origin"), $request$ = Symbol.for("#request"), $hash$ = Symbol.for("#hash"), $routeTo$ = Symbol.for("#routeTo"), $path$ = Symbol.for("#path"), $match$2 = Symbol.for("#match"), $options$ = Symbol.for("#options"), $cache$ = Symbol.for("#cache"), $unmatched$ = Symbol.for("#unmatched"), $active$ = Symbol.for("#active"), $resolvedPath$ = Symbol.for("#resolvedPath"), $dataKey$ = Symbol.for("#dataKey"), $activeKey$ = Symbol.for("#activeKey"), $urlKey$ = Symbol.for("#urlKey"), $dataMap$ = Symbol.for("#dataMap"), $href$ = Symbol.for("#href"), $route$ = Symbol.for("#route"), $context$2 = Symbol.for("#context"), $afterVisit$3 = Symbol.for("#afterVisit"), $routeHandler$ = Symbol.for("#routeHandler"), $parentNode$2 = Symbol.for("#parentNode"), $visitContext$2 = Symbol.for("#visitContext"), $$visitContext$3 = Symbol.for("##visitContext"), $attachToParent$2 = Symbol.for("#attachToParent"), $detachFromParent$2 = Symbol.for("#detachFromParent"), $13 = Symbol();
var \u03A9Document\u03A912 = class {
  get router() {
    return this[$router$] || (this[$router$] = new Router(this));
  }
};
extend$__2(Document.prototype, \u03A9Document\u03A912.prototype);
function use_router() {
  return !0;
}
var router = proxy(function() {
  return globalThis.document.router;
}), Router = class extends import_events.EventEmitter {
  static [$__init__$6]() {
    return this.prototype[$__initor__$9] = $13, this;
  }
  constructor(doc, o = {}) {
    super(), this[$routes$2] = {}, this.aliases = {}, this.redirects = {}, this.rules = {}, this.options = o, this.busy = [], this[$version$2] = 0, this[$doc$] = doc, this.queue = new Queue(), this.web\u03A6 = !!doc.defaultView, this.root = new RootRoute(this), this.history = globalThis.window.history, this.location = new Location(o.url || doc.location.href, this), this.mode = o.mode || "history", this.queue.on("busy", function() {
      return globalThis.document.flags.incr("_routing_");
    }), this.queue.on("idle", function() {
      return globalThis.document.flags.decr("_routing_"), commit();
    }), this.setup(), this[$__initor__$9] === $13 && (this[$__hooks__$10] && this[$__hooks__$10].inited(this), this[$__inited__$9] && this[$__inited__$9]());
  }
  get origin() {
    return this[$origin$] || (this[$origin$] = this[$doc$].location.origin);
  }
  get query() {
    return this.location.query;
  }
  init() {
    return this.refresh({ mode: "replace" }), this;
  }
  alias(from, to) {
    return this.aliases[from] = to, this.location.reparse(), this;
  }
  touch() {
    return this[$version$2]++;
  }
  option(key, value) {
    return value == null ? this.options[key] : (this.options[key] = value, this);
  }
  get realpath() {
    let loc = this[$doc$].location;
    return loc.href.slice(loc.origin.length);
  }
  get state() {
    return {};
  }
  get ctx() {
    return this[$request$];
  }
  pushState(state, title, url) {
    return this.history.pushState(state, title || null, String(url));
  }
  replaceState(state, title, url) {
    return this.history.replaceState(state, title || null, String(url));
  }
  refresh(params = {}) {
    var self = this;
    if (this.refreshing)
      return;
    this.refreshing = !0;
    let original = this.location, loc = Location.parse(params.location || this.realpath, this), mode = params.mode, prev = this[$request$];
    if (!loc.equals(original) || !prev) {
      let req = new Request(this, loc, original);
      req.mode = mode, this[$request$] = req, this.emit("beforechange", req), req.aborted && (!req.forceAbort && globalThis.window.confirm("Are you sure you want to leave? You might have unsaved changes") ? req.aborted = !1 : mode == "pop" ? this.pushState(this.state, null, String(original)) : mode == "replace" && this.replaceState(this.state, null, String(original))), req.aborted || (this.location = req.location, mode == "push" ? this.pushState(params.state || this.state, null, String(this.location)) : mode == "replace" && this.replaceState(params.state || this.state, null, String(this.location)), this.location.state = globalThis.window.history.state, this.emit("change", req), this.touch(), commit());
    }
    return scheduler.add(function() {
      let hash = self[$doc$].location.hash;
      if (hash != self[$hash$])
        return self.emit("hashchange", self[$hash$] = hash);
    }), this.refreshing = !1, this;
  }
  onpopstate(e) {
    return this.refresh({ pop: !0, mode: "pop" }), this;
  }
  onbeforeunload(e) {
    let req = new Request(this, null, this.location);
    if (this.emit("beforechange", req), req.aborted)
      return !0;
  }
  onhashchange(e) {
    return this.emit("hashchange", this[$hash$] = this[$doc$].location.hash), commit();
  }
  setup() {
    this.onclick = this.onclick.bind(this), this.onhashchange = this.onhashchange.bind(this);
    let win = globalThis.window;
    return this[$hash$] = this[$doc$].location.hash, this.location = Location.parse(this.realpath, this), this.history.replaceState(this.state, null, String(this.location)), win.onpopstate = this.onpopstate.bind(this), win.onbeforeunload = this.onbeforeunload.bind(this), win.addEventListener("hashchange", this.onhashchange), win.addEventListener("click", this.onclick, { capture: !0 }), win.document.documentElement.emit("routerinit", this), this.refresh, this;
  }
  onclick(e) {
    if (e.metaKey || e.altKey)
      return;
    let a = null, r = null, t = e.target;
    for (; t && (!a || !r); )
      !a && t.nodeName == "A" && (a = t), !r && t[$routeTo$] && (r = t), t = t.parentNode;
    if (a && r != a && (!r || r.contains(a))) {
      let href = a.getAttribute("href");
      href && !href.match(/\:\/\//) && (!a.getAttribute("target") || a.getAttribute("target") == "_self") && !a.classList.contains("external") && a.addEventListener("click", this.onclicklink.bind(this), { once: !0 });
    }
    return !0;
  }
  onclicklink(e) {
    let a = e.currentTarget || e.target;
    a[$routeTo$] && a[$routeTo$].resolve();
    let href = a.getAttribute("href"), url = new URL(a.href), target = url.href.slice(url.origin.length), currpath = this.realpath.split("#")[0], newpath = target.split("#")[0];
    return currpath == newpath ? globalThis.document.location.hash = url.hash : a[$routeTo$] ? a[$routeTo$].go() : this.go(target), e.stopPropagation(), e.preventDefault();
  }
  get url() {
    return this.location.url;
  }
  get path() {
    let path = this.location.path;
    return this.aliases[path] || path;
  }
  get pathname() {
    return this.location.pathname;
  }
  serializeParams(params) {
    var $2;
    if (params instanceof Object) {
      $2 = [];
      for (let $3 = 0, $42 = Object.keys(params), $5 = $42.length, key, val; $3 < $5; $3++)
        key = $42[$3], val = params[key], $2.push([key, globalThis.encodeURI(val)].join("="));
      return $2.join("&");
    }
    return params || "";
  }
  get hash() {
    return this[$hash$];
  }
  set hash(value) {
    this.history.replaceState({}, null, "#" + this.serializeParams(value));
  }
  match(pattern) {
    return this.route(pattern).match(this.path);
  }
  route(pattern) {
    return this.root.route(pattern);
  }
  go(url, state = {}) {
    let loc = this.location.clone().update(url, state);
    return this.refresh({ push: !0, mode: "push", location: loc, state }), this;
  }
  replace(url, state = {}) {
    let loc = this.location.clone().update(url, state);
    return this.refresh({ replace: !0, mode: "replace", location: loc, state });
  }
};
Router[$__init__$6]();
var ElementRoute = class {
  constructor(node, path, parent, options = {}) {
    this.parent = parent, this.node = node, this[$path$] = path, this[$match$2] = null, this[$options$] = options, this[$cache$] = {}, this[$unmatched$] = {}, this[$active$] = null, this[$resolvedPath$] = null, this[$dataKey$] = Symbol(), this[$activeKey$] = Symbol(), this[$urlKey$] = Symbol();
  }
  get router() {
    return this.node.ownerDocument.router;
  }
  get route() {
    return (this.parent ? this.parent.route : this.router).route(this[$path$]);
  }
  get match() {
    return this[$match$2];
  }
  get params() {
    return this[$match$2] || this[$unmatched$];
  }
  get state() {
    let map = this[$dataMap$] || (this[$dataMap$] = /* @__PURE__ */ new Map()), pars = this.params, data = this[$dataMap$].get(pars);
    return data || this[$dataMap$].set(pars, data = {}), data;
  }
  set state(value) {
    (this[$dataMap$] || (this[$dataMap$] = /* @__PURE__ */ new Map())).set(this.params, value);
  }
  set path(value) {
    this[$path$] != value && (this[$path$] = value, !0) && this.router.touch();
  }
  get path() {
    return this[$path$];
  }
  get isActive() {
    return !!this[$active$];
  }
  get active\u03A6() {
    return !!this[$active$];
  }
  resolve() {
    let v = this.router[$version$2];
    if (!(this[$version$2] != v && (this[$version$2] = v, !0)))
      return;
    let r = this.route, o = this[$options$], url = this.router.path, match = r.match(url), shown = this[$active$], last = this[$match$2], changed = match != last, prevUrl = match && match[this[$urlKey$]];
    return match && (this[$active$] = !0, this[$match$2] = match, match[this[$urlKey$]] = url), match && (changed || prevUrl != url) && this[$resolved$](match, last, prevUrl), !shown && match && this[$enter$](), !match && (shown || shown === null) && (this[$active$] = !1, this[$leave$]()), this[$match$2];
  }
  [$enter$]() {
    var _a, _b;
    return this.node.flags.remove("not-routed"), this.node.flags.add("routed"), (_b = (_a = this.node) == null ? void 0 : _a.routeDidEnter) == null ? void 0 : _b.call(_a, this);
  }
  [$resolved$](match, prev, prevUrl = "") {
    var _a, _b;
    return (_b = (_a = this.node) == null ? void 0 : _a.routeDidResolve) == null ? void 0 : _b.call(_a, this, match, prev, prevUrl);
  }
  [$leave$]() {
    var _a, _b;
    return this.node.flags.add("not-routed"), this.node.flags.remove("routed"), (_b = (_a = this.node) == null ? void 0 : _a.routeDidLeave) == null ? void 0 : _b.call(_a, this);
  }
}, ElementRouteTo = class extends ElementRoute {
  [$enter$]() {
    return this;
  }
  [$resolved$]() {
    return this;
  }
  [$leave$]() {
    return this;
  }
  resolve() {
    let v = this.router[$version$2];
    if (!(this[$version$2] != v && (this[$version$2] = v, !0)))
      return;
    let o = this[$options$], r = this.route, url = this.router.path, href = this.route.resolve(url), match = this.route.match(url);
    match && (this[$match$2] = match, this[$match$2][this[$urlKey$]] = url), o.sticky && this[$match$2] && (href = this[$match$2][this[$urlKey$]]), this[$href$] != href && (this[$href$] = href, !0) && this.node.nodeName == "A" && this.node.setAttribute("href", href), this.node.flags.toggle("active", !!match);
  }
  go() {
    return this.resolve(), this[$options$] && this[$options$].replace ? this.router.replace(this[$href$]) : this.router.go(this[$href$]);
  }
}, \u03A9Node\u03A922 = class {
  get router() {
    return this.ownerDocument.router;
  }
};
extend$__2(Node.prototype, \u03A9Node\u03A922.prototype);
var \u03A9Element\u03A932 = class {
  set route(value) {
    if (this[$route$]) {
      this[$route$].path = value;
      return;
    }
    let par = value[0] != "/" ? this[$context$2].route : null;
    this[$route$] = new ElementRoute(this, value, par, this.route__), this[$afterVisit$3] = this[$afterVisitRouted$];
  }
  get route() {
    return this[$route$];
  }
  set route\u039Eto(value) {
    var self = this;
    if (this[$routeTo$]) {
      this[$routeTo$].path = value;
      return;
    }
    let par = value[0] != "/" ? this[$context$2].route : null;
    this[$route$] = this[$routeTo$] = new ElementRouteTo(this, value, par, this.routeTo__), this[$afterVisit$3] = this[$afterVisitRouteTo$], this.onclick = function(e) {
      if (!e.altKey && !e.metaKey && !e[$routeHandler$])
        return e.preventDefault(), e[$routeHandler$] = self[$routeTo$], self[$routeTo$].go();
    };
  }
  [$afterVisitRouted$]() {
    if (this[$route$]) {
      let up = this[$parentNode$2], ctx = up && up[$visitContext$2];
      if (ctx && ctx.matchedRoute && ctx.matchedRoute != this[$route$]) {
        this[$route$][$active$] != !1 && (this[$route$][$active$] = !1, !0) && (this[$route$][$leave$](), this[$route$][$version$2] = -1);
        return;
      }
      if (this[$route$].resolve(), this[$route$].active\u03A6)
        ctx.matchedRoute = this[$route$];
      else
        return;
    }
    if (this.visit && this.visit(), this[$$visitContext$3])
      return this[$$visitContext$3] = null;
  }
  [$afterVisitRouteTo$]() {
    if (this[$routeTo$] && this[$routeTo$].resolve(), this.visit)
      return this.visit();
  }
  routeDidEnter(route) {
    return this[$attachToParent$2]();
  }
  routeDidLeave(route) {
    return this[$detachFromParent$2]();
  }
  routeDidResolve(route, match, prev) {
    var self = this;
    this.routed instanceof Function && match != prev && this.router.queue.add(async function() {
      self.suspend();
      let res = await self.routed(match, route.state, prev);
      return self.unsuspend();
    });
  }
};
extend$__2(Element.prototype, \u03A9Element\u03A932.prototype);

// index.imba
var $beforeReconcile$3 = Symbol.for("#beforeReconcile"), $afterVisit$4 = Symbol.for("#afterVisit"), $afterReconcile$3 = Symbol.for("#afterReconcile"), $$up$2 = Symbol.for("##up"), $4 = Symbol(), $8 = Symbol(), $122 = Symbol(), $16 = Symbol(), $20 = Symbol(), $24 = Symbol(), $27, $28 = getRenderContext(), $29 = Symbol(), $30, $31;
use_router();
var App = class extends Component {
  render() {
    var $14, $2, $3, $5, $6, $7, $9, $10, $11, $132, $142, $15, $17, $18, $19, $21, $22, $23, $25, $26;
    return $14 = this, $14[$beforeReconcile$3](), $2 = $3 = 1, $14[$4] === 1 || ($2 = $3 = 0, $14[$4] = 1), $2 || ($5 = createElement("div", $14, null, "Hello world!")), $2 || ($6 = createElement("nav", $14, null, null)), $9 = $10 = 1, ($7 = $14[$8]) || ($9 = $10 = 0, $14[$8] = $7 = createElement("a", $6, null, "Home")), $9 || ($7.route\u039Eto = "/home"), $9 || !$7.setup || $7.setup($10), $7[$afterVisit$4]($10), $132 = $142 = 1, ($11 = $14[$122]) || ($132 = $142 = 0, $14[$122] = $11 = createElement("a", $6, null, "About")), $132 || ($11.route\u039Eto = "/about"), $132 || !$11.setup || $11.setup($142), $11[$afterVisit$4]($142), $17 = $18 = 1, ($15 = $14[$16]) || ($17 = $18 = 0, $14[$16] = $15 = createElement("main", $14, null, null)), $21 = $22 = 1, ($19 = $15[$20]) || ($21 = $22 = 0, $15[$20] = $19 = createElement("div", $15, null, "Welcome home")), $21 || ($19.route = "/home"), $21 || !$19.setup || $19.setup($22), $19[$afterVisit$4]($22), $25 = $26 = 1, ($23 = $15[$24]) || ($25 = $26 = 0, $15[$24] = $23 = createElement("div", $15, null, "About me")), $25 || ($23.route = "/about"), $25 || !$23.setup || $23.setup($26), $23[$afterVisit$4]($26), $17 || !$15.setup || $15.setup($18), $15[$afterVisit$4]($18), $14[$afterReconcile$3]($3), $14;
  }
};
defineTag("app-cwn-an", App, {});
mount(($30 = $31 = 1, ($27 = $28[$29]) || ($30 = $31 = 0, $27 = $28[$29] = $27 = createComponent(App, null, null, null)), $30 || ($27[$$up$2] = $28._), $30 || $28.sym || !$27.setup || $27.setup($31), $28.sym || $27[$afterVisit$4]($31), $27));
//__FOOT__
