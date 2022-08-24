//__HEAD__
// ../imba/packages/imba/src/imba/utils.imba
var $__initor__$ = Symbol.for("#__initor__"), $__inited__$ = Symbol.for("#__inited__"), $__hooks__$ = Symbol.for("#__hooks__"), $type$ = Symbol.for("#type"), $__listeners__$ = Symbol.for("#__listeners__");
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
    var $12;
    ($12 = $$.owner) !== void 0 && (this.owner = $12), ($12 = $$.target) !== void 0 && (this.target = $12), ($12 = $$.active) !== void 0 && (this.active = $12), ($12 = $$.value) !== void 0 && (this.value = $12), ($12 = $$.skip) !== void 0 && (this.skip = $12), ($12 = $$.last) !== void 0 && (this.last = $12);
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
    var $62, $72;
    return o || (o = item[$62 = this.id] || (item[$62] = { value: !0 })), (o[$72 = this.id] || (o[$72] = new Scheduled({ owner: this, target: item }))).update(o, !0);
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
    var $12;
    let cache = descriptorCache[$12 = this.nodeName] || (descriptorCache[$12] = {}), desc = getDescriptor(this, key, cache);
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
    for (let $62 = 0, $72 = iter$__2(protos), $82 = $72.length; $62 < $82; $62++) {
      let item = $72[$62], desc = Object.getOwnPropertyDescriptors(item);
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
    var $12;
    ($12 = $$.items) !== void 0 && (this.items = $12), ($12 = $$.current) !== void 0 && (this.current = $12), ($12 = $$.lastQueued) !== void 0 && (this.lastQueued = $12), ($12 = $$.tests) !== void 0 && (this.tests = $12);
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

// index.imba
var $beforeReconcile$3 = Symbol.for("#beforeReconcile"), $afterReconcile$3 = Symbol.for("#afterReconcile"), $$up$2 = Symbol.for("##up"), $afterVisit$3 = Symbol.for("#afterVisit"), $4 = Symbol(), $6, $7 = getRenderContext(), $8 = Symbol(), $9, $10, App = class extends Component {
  render() {
    var $12, $2, $3, $5;
    return $12 = this, $12[$beforeReconcile$3](), $2 = $3 = 1, $12[$4] === 1 || ($2 = $3 = 0, $12[$4] = 1), $2 || ($5 = createElement("div", $12, null, "Hello world!!")), $12[$afterReconcile$3]($3), $12;
  }
};
defineTag("app-cwn-ah", App, {});
mount(($9 = $10 = 1, ($6 = $7[$8]) || ($9 = $10 = 0, $6 = $7[$8] = $6 = createComponent(App, null, null, null)), $9 || ($6[$$up$2] = $7._), $9 || $7.sym || !$6.setup || $6.setup($10), $7.sym || $6[$afterVisit$3]($10), $6));
//__FOOT__
