import { defineComponent as fm, ref as Ln, shallowRef as Iw, computed as Gn, watch as jd, onMounted as Lw, nextTick as Bw, onUnmounted as jw, h as Nw, watchEffect as Fw, toRaw as Hw, openBlock as Jw, createBlock as Kw, unref as ek, mergeProps as tk } from "vue";
class Pe {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, t, i) {
    [e, t] = Xr(this, e, t);
    let r = [];
    return this.decompose(
      0,
      e,
      r,
      2
      /* Open.To */
    ), i.length && i.decompose(
      0,
      i.length,
      r,
      3
      /* Open.To */
    ), this.decompose(
      t,
      this.length,
      r,
      1
      /* Open.From */
    ), $i.from(r, this.length - (t - e) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, t = this.length) {
    [e, t] = Xr(this, e, t);
    let i = [];
    return this.decompose(e, t, i, 0), $i.from(i, t - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let t = this.scanIdentical(e, 1), i = this.length - this.scanIdentical(e, -1), r = new Rs(this), s = new Rs(e);
    for (let l = t, O = t; ; ) {
      if (r.next(l), s.next(l), l = 0, r.lineBreak != s.lineBreak || r.done != s.done || r.value != s.value)
        return !1;
      if (O += r.value.length, r.done || O >= i)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new Rs(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, t = this.length) {
    return new um(this, e, t);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, t) {
    let i;
    if (e == null)
      i = this.iter();
    else {
      t == null && (t = this.lines + 1);
      let r = this.line(e).from;
      i = this.iterRange(r, Math.max(r, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
    }
    return new dm(i);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? Pe.empty : e.length <= 32 ? new Ge(e) : $i.from(Ge.split(e, []));
  }
}
class Ge extends Pe {
  constructor(e, t = ik(e)) {
    super(), this.text = e, this.length = t;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, t, i, r) {
    for (let s = 0; ; s++) {
      let l = this.text[s], O = r + l.length;
      if ((t ? i : O) >= e)
        return new nk(r, O, i, l);
      r = O + 1, i++;
    }
  }
  decompose(e, t, i, r) {
    let s = e <= 0 && t >= this.length ? this : new Ge(Nd(this.text, e, t), Math.min(t, this.length) - Math.max(0, e));
    if (r & 1) {
      let l = i.pop(), O = vl(s.text, l.text.slice(), 0, s.length);
      if (O.length <= 32)
        i.push(new Ge(O, l.length + s.length));
      else {
        let h = O.length >> 1;
        i.push(new Ge(O.slice(0, h)), new Ge(O.slice(h)));
      }
    } else
      i.push(s);
  }
  replace(e, t, i) {
    if (!(i instanceof Ge))
      return super.replace(e, t, i);
    [e, t] = Xr(this, e, t);
    let r = vl(this.text, vl(i.text, Nd(this.text, 0, e)), t), s = this.length + i.length - (t - e);
    return r.length <= 32 ? new Ge(r, s) : $i.from(Ge.split(r, []), s);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Xr(this, e, t);
    let r = "";
    for (let s = 0, l = 0; s <= t && l < this.text.length; l++) {
      let O = this.text[l], h = s + O.length;
      s > e && l && (r += i), e < h && t > s && (r += O.slice(Math.max(0, e - s), t - s)), s = h + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.text)
      e.push(t);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, t) {
    let i = [], r = -1;
    for (let s of e)
      i.push(s), r += s.length + 1, i.length == 32 && (t.push(new Ge(i, r)), i = [], r = -1);
    return r > -1 && t.push(new Ge(i, r)), t;
  }
}
class $i extends Pe {
  constructor(e, t) {
    super(), this.children = e, this.length = t, this.lines = 0;
    for (let i of e)
      this.lines += i.lines;
  }
  lineInner(e, t, i, r) {
    for (let s = 0; ; s++) {
      let l = this.children[s], O = r + l.length, h = i + l.lines - 1;
      if ((t ? h : O) >= e)
        return l.lineInner(e, t, i, r);
      r = O + 1, i = h + 1;
    }
  }
  decompose(e, t, i, r) {
    for (let s = 0, l = 0; l <= t && s < this.children.length; s++) {
      let O = this.children[s], h = l + O.length;
      if (e <= h && t >= l) {
        let f = r & ((l <= e ? 1 : 0) | (h >= t ? 2 : 0));
        l >= e && h <= t && !f ? i.push(O) : O.decompose(e - l, t - l, i, f);
      }
      l = h + 1;
    }
  }
  replace(e, t, i) {
    if ([e, t] = Xr(this, e, t), i.lines < this.lines)
      for (let r = 0, s = 0; r < this.children.length; r++) {
        let l = this.children[r], O = s + l.length;
        if (e >= s && t <= O) {
          let h = l.replace(e - s, t - s, i), f = this.lines - l.lines + h.lines;
          if (h.lines < f >> 4 && h.lines > f >> 6) {
            let u = this.children.slice();
            return u[r] = h, new $i(u, this.length - (t - e) + i.length);
          }
          return super.replace(s, O, h);
        }
        s = O + 1;
      }
    return super.replace(e, t, i);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Xr(this, e, t);
    let r = "";
    for (let s = 0, l = 0; s < this.children.length && l <= t; s++) {
      let O = this.children[s], h = l + O.length;
      l > e && s && (r += i), e < h && t > l && (r += O.sliceString(e - l, t - l, i)), l = h + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.children)
      t.flatten(e);
  }
  scanIdentical(e, t) {
    if (!(e instanceof $i))
      return 0;
    let i = 0, [r, s, l, O] = t > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; r += t, s += t) {
      if (r == l || s == O)
        return i;
      let h = this.children[r], f = e.children[s];
      if (h != f)
        return i + h.scanIdentical(f, t);
      i += h.length + 1;
    }
  }
  static from(e, t = e.reduce((i, r) => i + r.length + 1, -1)) {
    let i = 0;
    for (let Q of e)
      i += Q.lines;
    if (i < 32) {
      let Q = [];
      for (let b of e)
        b.flatten(Q);
      return new Ge(Q, t);
    }
    let r = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), s = r << 1, l = r >> 1, O = [], h = 0, f = -1, u = [];
    function d(Q) {
      let b;
      if (Q.lines > s && Q instanceof $i)
        for (let v of Q.children)
          d(v);
      else Q.lines > l && (h > l || !h) ? (g(), O.push(Q)) : Q instanceof Ge && h && (b = u[u.length - 1]) instanceof Ge && Q.lines + b.lines <= 32 ? (h += Q.lines, f += Q.length + 1, u[u.length - 1] = new Ge(b.text.concat(Q.text), b.length + 1 + Q.length)) : (h + Q.lines > r && g(), h += Q.lines, f += Q.length + 1, u.push(Q));
    }
    function g() {
      h != 0 && (O.push(u.length == 1 ? u[0] : $i.from(u, f)), f = -1, h = u.length = 0);
    }
    for (let Q of e)
      d(Q);
    return g(), O.length == 1 ? O[0] : new $i(O, t);
  }
}
Pe.empty = /* @__PURE__ */ new Ge([""], 0);
function ik(n) {
  let e = -1;
  for (let t of n)
    e += t.length + 1;
  return e;
}
function vl(n, e, t = 0, i = 1e9) {
  for (let r = 0, s = 0, l = !0; s < n.length && r <= i; s++) {
    let O = n[s], h = r + O.length;
    h >= t && (h > i && (O = O.slice(0, i - r)), r < t && (O = O.slice(t - r)), l ? (e[e.length - 1] += O, l = !1) : e.push(O)), r = h + 1;
  }
  return e;
}
function Nd(n, e, t) {
  return vl(n, [""], e, t);
}
class Rs {
  constructor(e, t = 1) {
    this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof Ge ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, t) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, r = this.nodes[i], s = this.offsets[i], l = s >> 1, O = r instanceof Ge ? r.text.length : r.children.length;
      if (l == (t > 0 ? O : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        t > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((s & 1) == (t > 0 ? 0 : 1)) {
        if (this.offsets[i] += t, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (r instanceof Ge) {
        let h = r.text[l + (t < 0 ? -1 : 0)];
        if (this.offsets[i] += t, h.length > Math.max(0, e))
          return this.value = e == 0 ? h : t > 0 ? h.slice(e) : h.slice(0, h.length - e), this;
        e -= h.length;
      } else {
        let h = r.children[l + (t < 0 ? -1 : 0)];
        e > h.length ? (e -= h.length, this.offsets[i] += t) : (t < 0 && this.offsets[i]--, this.nodes.push(h), this.offsets.push(t > 0 ? 1 : (h instanceof Ge ? h.text.length : h.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class um {
  constructor(e, t, i) {
    this.value = "", this.done = !1, this.cursor = new Rs(e, t > i ? -1 : 1), this.pos = t > i ? e.length : 0, this.from = Math.min(t, i), this.to = Math.max(t, i);
  }
  nextInner(e, t) {
    if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
    let i = t < 0 ? this.pos - this.from : this.to - this.pos;
    e > i && (e = i), i -= e;
    let { value: r } = this.cursor.next(e);
    return this.pos += (r.length + e) * t, this.value = r.length <= i ? r : t < 0 ? r.slice(r.length - i) : r.slice(0, i), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class dm {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: t, lineBreak: i, value: r } = this.inner.next(e);
    return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = r, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (Pe.prototype[Symbol.iterator] = function() {
  return this.iter();
}, Rs.prototype[Symbol.iterator] = um.prototype[Symbol.iterator] = dm.prototype[Symbol.iterator] = function() {
  return this;
});
class nk {
  /**
  @internal
  */
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.number = i, this.text = r;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function Xr(n, e, t) {
  return e = Math.max(0, Math.min(n.length, e)), [e, Math.max(e, Math.min(n.length, t))];
}
let vr = /* @__PURE__ */ "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((n) => n ? parseInt(n, 36) : 1);
for (let n = 1; n < vr.length; n++)
  vr[n] += vr[n - 1];
function rk(n) {
  for (let e = 1; e < vr.length; e += 2)
    if (vr[e] > n)
      return vr[e - 1] <= n;
  return !1;
}
function Fd(n) {
  return n >= 127462 && n <= 127487;
}
const Hd = 8205;
function at(n, e, t = !0, i = !0) {
  return (t ? pm : sk)(n, e, i);
}
function pm(n, e, t) {
  if (e == n.length)
    return e;
  e && gm(n.charCodeAt(e)) && mm(n.charCodeAt(e - 1)) && e--;
  let i = rt(n, e);
  for (e += Ft(i); e < n.length; ) {
    let r = rt(n, e);
    if (i == Hd || r == Hd || t && rk(r))
      e += Ft(r), i = r;
    else if (Fd(r)) {
      let s = 0, l = e - 2;
      for (; l >= 0 && Fd(rt(n, l)); )
        s++, l -= 2;
      if (s % 2 == 0)
        break;
      e += 2;
    } else
      break;
  }
  return e;
}
function sk(n, e, t) {
  for (; e > 0; ) {
    let i = pm(n, e - 2, t);
    if (i < e)
      return i;
    e--;
  }
  return 0;
}
function gm(n) {
  return n >= 56320 && n < 57344;
}
function mm(n) {
  return n >= 55296 && n < 56320;
}
function rt(n, e) {
  let t = n.charCodeAt(e);
  if (!mm(t) || e + 1 == n.length)
    return t;
  let i = n.charCodeAt(e + 1);
  return gm(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function Rc(n) {
  return n <= 65535 ? String.fromCharCode(n) : (n -= 65536, String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
}
function Ft(n) {
  return n < 65536 ? 1 : 2;
}
const kh = /\r\n?|\n/;
var ot = /* @__PURE__ */ function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
}(ot || (ot = {}));
class ki {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2)
      e += this.sections[t];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t + 1];
      e += i < 0 ? this.sections[t] : i;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let t = 0, i = 0, r = 0; t < this.sections.length; ) {
      let s = this.sections[t++], l = this.sections[t++];
      l < 0 ? (e(i, r, s), r += s) : r += l, i += s;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, t = !1) {
    Th(this, e, t);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], r = this.sections[t++];
      r < 0 ? e.push(i, r) : e.push(r, i);
    }
    return new ki(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : Qm(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `other` happened before the ones in `this`.
  */
  mapDesc(e, t = !1) {
    return e.empty ? this : Zh(this, e, t);
  }
  mapPos(e, t = -1, i = ot.Simple) {
    let r = 0, s = 0;
    for (let l = 0; l < this.sections.length; ) {
      let O = this.sections[l++], h = this.sections[l++], f = r + O;
      if (h < 0) {
        if (f > e)
          return s + (e - r);
        s += O;
      } else {
        if (i != ot.Simple && f >= e && (i == ot.TrackDel && r < e && f > e || i == ot.TrackBefore && r < e || i == ot.TrackAfter && f > e))
          return null;
        if (f > e || f == e && t < 0 && !O)
          return e == r || t < 0 ? s : s + h;
        s += h;
      }
      r = f;
    }
    if (e > r)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${r}`);
    return s;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, t = e) {
    for (let i = 0, r = 0; i < this.sections.length && r <= t; ) {
      let s = this.sections[i++], l = this.sections[i++], O = r + s;
      if (l >= 0 && r <= t && O >= e)
        return r < e && O > t ? "cover" : !0;
      r = O;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], r = this.sections[t++];
      e += (e ? " " : "") + i + (r >= 0 ? ":" + r : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((t) => typeof t != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new ki(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new ki(e);
  }
}
class Ke extends ki {
  constructor(e, t) {
    super(e), this.inserted = t;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return Th(this, (t, i, r, s, l) => e = e.replace(r, r + (i - t), l), !1), e;
  }
  mapDesc(e, t = !1) {
    return Zh(this, e, t, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let t = this.sections.slice(), i = [];
    for (let r = 0, s = 0; r < t.length; r += 2) {
      let l = t[r], O = t[r + 1];
      if (O >= 0) {
        t[r] = O, t[r + 1] = l;
        let h = r >> 1;
        for (; i.length < h; )
          i.push(Pe.empty);
        i.push(l ? e.slice(s, s + l) : Pe.empty);
      }
      s += l;
    }
    return new Ke(t, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : Qm(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, t = !1) {
    return e.empty ? this : Zh(this, e, t, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, t = !1) {
    Th(this, e, t);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return ki.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let t = [], i = [], r = [], s = new Ys(this);
    e: for (let l = 0, O = 0; ; ) {
      let h = l == e.length ? 1e9 : e[l++];
      for (; O < h || O == h && s.len == 0; ) {
        if (s.done)
          break e;
        let u = Math.min(s.len, h - O);
        ct(r, u, -1);
        let d = s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0;
        ct(t, u, d), d > 0 && dn(i, t, s.text), s.forward(u), O += u;
      }
      let f = e[l++];
      for (; O < f; ) {
        if (s.done)
          break e;
        let u = Math.min(s.len, f - O);
        ct(t, u, -1), ct(r, u, s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0), s.forward(u), O += u;
      }
    }
    return {
      changes: new Ke(t, i),
      filtered: ki.create(r)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t], r = this.sections[t + 1];
      r < 0 ? e.push(i) : r == 0 ? e.push([i]) : e.push([i].concat(this.inserted[t >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, t, i) {
    let r = [], s = [], l = 0, O = null;
    function h(u = !1) {
      if (!u && !r.length)
        return;
      l < t && ct(r, t - l, -1);
      let d = new Ke(r, s);
      O = O ? O.compose(d.map(O)) : d, r = [], s = [], l = 0;
    }
    function f(u) {
      if (Array.isArray(u))
        for (let d of u)
          f(d);
      else if (u instanceof Ke) {
        if (u.length != t)
          throw new RangeError(`Mismatched change set length (got ${u.length}, expected ${t})`);
        h(), O = O ? O.compose(u.map(O)) : u;
      } else {
        let { from: d, to: g = d, insert: Q } = u;
        if (d > g || d < 0 || g > t)
          throw new RangeError(`Invalid change range ${d} to ${g} (in doc of length ${t})`);
        let b = Q ? typeof Q == "string" ? Pe.of(Q.split(i || kh)) : Q : Pe.empty, v = b.length;
        if (d == g && v == 0)
          return;
        d < l && h(), d > l && ct(r, d - l, -1), ct(r, g - d, v), dn(s, r, b), l = g;
      }
    }
    return f(e), h(!O), O;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new Ke(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let t = [], i = [];
    for (let r = 0; r < e.length; r++) {
      let s = e[r];
      if (typeof s == "number")
        t.push(s, -1);
      else {
        if (!Array.isArray(s) || typeof s[0] != "number" || s.some((l, O) => O && typeof l != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (s.length == 1)
          t.push(s[0], 0);
        else {
          for (; i.length < r; )
            i.push(Pe.empty);
          i[r] = Pe.of(s.slice(1)), t.push(s[0], i[r].length);
        }
      }
    }
    return new Ke(t, i);
  }
  /**
  @internal
  */
  static createSet(e, t) {
    return new Ke(e, t);
  }
}
function ct(n, e, t, i = !1) {
  if (e == 0 && t <= 0)
    return;
  let r = n.length - 2;
  r >= 0 && t <= 0 && t == n[r + 1] ? n[r] += e : e == 0 && n[r] == 0 ? n[r + 1] += t : i ? (n[r] += e, n[r + 1] += t) : n.push(e, t);
}
function dn(n, e, t) {
  if (t.length == 0)
    return;
  let i = e.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(t);
  else {
    for (; n.length < i; )
      n.push(Pe.empty);
    n.push(t);
  }
}
function Th(n, e, t) {
  let i = n.inserted;
  for (let r = 0, s = 0, l = 0; l < n.sections.length; ) {
    let O = n.sections[l++], h = n.sections[l++];
    if (h < 0)
      r += O, s += O;
    else {
      let f = r, u = s, d = Pe.empty;
      for (; f += O, u += h, h && i && (d = d.append(i[l - 2 >> 1])), !(t || l == n.sections.length || n.sections[l + 1] < 0); )
        O = n.sections[l++], h = n.sections[l++];
      e(r, f, s, u, d), r = f, s = u;
    }
  }
}
function Zh(n, e, t, i = !1) {
  let r = [], s = i ? [] : null, l = new Ys(n), O = new Ys(e);
  for (let h = -1; ; )
    if (l.ins == -1 && O.ins == -1) {
      let f = Math.min(l.len, O.len);
      ct(r, f, -1), l.forward(f), O.forward(f);
    } else if (O.ins >= 0 && (l.ins < 0 || h == l.i || l.off == 0 && (O.len < l.len || O.len == l.len && !t))) {
      let f = O.len;
      for (ct(r, O.ins, -1); f; ) {
        let u = Math.min(l.len, f);
        l.ins >= 0 && h < l.i && l.len <= u && (ct(r, 0, l.ins), s && dn(s, r, l.text), h = l.i), l.forward(u), f -= u;
      }
      O.next();
    } else if (l.ins >= 0) {
      let f = 0, u = l.len;
      for (; u; )
        if (O.ins == -1) {
          let d = Math.min(u, O.len);
          f += d, u -= d, O.forward(d);
        } else if (O.ins == 0 && O.len < u)
          u -= O.len, O.next();
        else
          break;
      ct(r, f, h < l.i ? l.ins : 0), s && h < l.i && dn(s, r, l.text), h = l.i, l.forward(l.len - u);
    } else {
      if (l.done && O.done)
        return s ? Ke.createSet(r, s) : ki.create(r);
      throw new Error("Mismatched change set lengths");
    }
}
function Qm(n, e, t = !1) {
  let i = [], r = t ? [] : null, s = new Ys(n), l = new Ys(e);
  for (let O = !1; ; ) {
    if (s.done && l.done)
      return r ? Ke.createSet(i, r) : ki.create(i);
    if (s.ins == 0)
      ct(i, s.len, 0, O), s.next();
    else if (l.len == 0 && !l.done)
      ct(i, 0, l.ins, O), r && dn(r, i, l.text), l.next();
    else {
      if (s.done || l.done)
        throw new Error("Mismatched change set lengths");
      {
        let h = Math.min(s.len2, l.len), f = i.length;
        if (s.ins == -1) {
          let u = l.ins == -1 ? -1 : l.off ? 0 : l.ins;
          ct(i, h, u, O), r && u && dn(r, i, l.text);
        } else l.ins == -1 ? (ct(i, s.off ? 0 : s.len, h, O), r && dn(r, i, s.textBit(h))) : (ct(i, s.off ? 0 : s.len, l.off ? 0 : l.ins, O), r && !l.off && dn(r, i, l.text));
        O = (s.ins > h || l.ins >= 0 && l.len > h) && (O || i.length > f), s.forward2(h), l.forward(h);
      }
    }
  }
}
class Ys {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, t = this.i - 2 >> 1;
    return t >= e.length ? Pe.empty : e[t];
  }
  textBit(e) {
    let { inserted: t } = this.set, i = this.i - 2 >> 1;
    return i >= t.length && !e ? Pe.empty : t[i].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class Bn {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.flags = i;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  The goal column (stored vertical offset) associated with a
  cursor. This is used to preserve the vertical position when
  [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
  lines of different length.
  */
  get goalColumn() {
    let e = this.flags >> 6;
    return e == 16777215 ? void 0 : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, t = -1) {
    let i, r;
    return this.empty ? i = r = e.mapPos(this.from, t) : (i = e.mapPos(this.from, 1), r = e.mapPos(this.to, -1)), i == this.from && r == this.to ? this : new Bn(i, r, this.flags);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, t = e) {
    if (e <= this.anchor && t >= this.anchor)
      return X.range(e, t);
    let i = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
    return X.range(this.anchor, i);
  }
  /**
  Compare this range to another range.
  */
  eq(e, t = !1) {
    return this.anchor == e.anchor && this.head == e.head && (!t || !this.empty || this.assoc == e.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return X.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Bn(e, t, i);
  }
}
class X {
  constructor(e, t) {
    this.ranges = e, this.mainIndex = t;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, t = -1) {
    return e.empty ? this : X.create(this.ranges.map((i) => i.map(e, t)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(e, t = !1) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let i = 0; i < this.ranges.length; i++)
      if (!this.ranges[i].eq(e.ranges[i], t))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new X([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, t = !0) {
    return X.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, t = this.mainIndex) {
    let i = this.ranges.slice();
    return i[t] = e, X.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new X(e.ranges.map((t) => Bn.fromJSON(t)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, t = e) {
    return new X([X.range(e, t)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, t = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, r = 0; r < e.length; r++) {
      let s = e[r];
      if (s.empty ? s.from <= i : s.from < i)
        return X.normalized(e.slice(), t);
      i = s.to;
    }
    return new X(e, t);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, t = 0, i, r) {
    return Bn.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (i == null ? 7 : Math.min(6, i)) | (r ?? 16777215) << 6);
  }
  /**
  Create a selection range.
  */
  static range(e, t, i, r) {
    let s = (i ?? 16777215) << 6 | (r == null ? 7 : Math.min(6, r));
    return t < e ? Bn.create(t, e, 48 | s) : Bn.create(e, t, (t > e ? 8 : 0) | s);
  }
  /**
  @internal
  */
  static normalized(e, t = 0) {
    let i = e[t];
    e.sort((r, s) => r.from - s.from), t = e.indexOf(i);
    for (let r = 1; r < e.length; r++) {
      let s = e[r], l = e[r - 1];
      if (s.empty ? s.from <= l.to : s.from < l.to) {
        let O = l.from, h = Math.max(s.to, l.to);
        r <= t && t--, e.splice(--r, 2, s.anchor > s.head ? X.range(h, O) : X.range(O, h));
      }
    }
    return new X(e, t);
  }
}
function Pm(n, e) {
  for (let t of n.ranges)
    if (t.to > e)
      throw new RangeError("Selection points outside of document");
}
let _c = 0;
class j {
  constructor(e, t, i, r, s) {
    this.combine = e, this.compareInput = t, this.compare = i, this.isStatic = r, this.id = _c++, this.default = e([]), this.extensions = typeof s == "function" ? s(this) : s;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new j(e.combine || ((t) => t), e.compareInput || ((t, i) => t === i), e.compare || (e.combine ? (t, i) => t === i : Xc), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new wl([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new wl(e, this, 1, t);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new wl(e, this, 2, t);
  }
  from(e, t) {
    return t || (t = (i) => i), this.compute([e], (i) => t(i.field(e)));
  }
}
function Xc(n, e) {
  return n == e || n.length == e.length && n.every((t, i) => t === e[i]);
}
class wl {
  constructor(e, t, i, r) {
    this.dependencies = e, this.facet = t, this.type = i, this.value = r, this.id = _c++;
  }
  dynamicSlot(e) {
    var t;
    let i = this.value, r = this.facet.compareInput, s = this.id, l = e[s] >> 1, O = this.type == 2, h = !1, f = !1, u = [];
    for (let d of this.dependencies)
      d == "doc" ? h = !0 : d == "selection" ? f = !0 : ((t = e[d.id]) !== null && t !== void 0 ? t : 1) & 1 || u.push(e[d.id]);
    return {
      create(d) {
        return d.values[l] = i(d), 1;
      },
      update(d, g) {
        if (h && g.docChanged || f && (g.docChanged || g.selection) || Rh(d, u)) {
          let Q = i(d);
          if (O ? !Jd(Q, d.values[l], r) : !r(Q, d.values[l]))
            return d.values[l] = Q, 1;
        }
        return 0;
      },
      reconfigure: (d, g) => {
        let Q, b = g.config.address[s];
        if (b != null) {
          let v = El(g, b);
          if (this.dependencies.every((w) => w instanceof j ? g.facet(w) === d.facet(w) : w instanceof Ne ? g.field(w, !1) == d.field(w, !1) : !0) || (O ? Jd(Q = i(d), v, r) : r(Q = i(d), v)))
            return d.values[l] = v, 0;
        } else
          Q = i(d);
        return d.values[l] = Q, 1;
      }
    };
  }
}
function Jd(n, e, t) {
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!t(n[i], e[i]))
      return !1;
  return !0;
}
function Rh(n, e) {
  let t = !1;
  for (let i of e)
    _s(n, i) & 1 && (t = !0);
  return t;
}
function ok(n, e, t) {
  let i = t.map((h) => n[h.id]), r = t.map((h) => h.type), s = i.filter((h) => !(h & 1)), l = n[e.id] >> 1;
  function O(h) {
    let f = [];
    for (let u = 0; u < i.length; u++) {
      let d = El(h, i[u]);
      if (r[u] == 2)
        for (let g of d)
          f.push(g);
      else
        f.push(d);
    }
    return e.combine(f);
  }
  return {
    create(h) {
      for (let f of i)
        _s(h, f);
      return h.values[l] = O(h), 1;
    },
    update(h, f) {
      if (!Rh(h, s))
        return 0;
      let u = O(h);
      return e.compare(u, h.values[l]) ? 0 : (h.values[l] = u, 1);
    },
    reconfigure(h, f) {
      let u = Rh(h, i), d = f.config.facets[e.id], g = f.facet(e);
      if (d && !u && Xc(t, d))
        return h.values[l] = g, 0;
      let Q = O(h);
      return e.compare(Q, g) ? (h.values[l] = g, 0) : (h.values[l] = Q, 1);
    }
  };
}
const Kd = /* @__PURE__ */ j.define({ static: !0 });
class Ne {
  constructor(e, t, i, r, s) {
    this.id = e, this.createF = t, this.updateF = i, this.compareF = r, this.spec = s, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let t = new Ne(_c++, e.create, e.update, e.compare || ((i, r) => i === r), e);
    return e.provide && (t.provides = e.provide(t)), t;
  }
  create(e) {
    let t = e.facet(Kd).find((i) => i.field == this);
    return ((t == null ? void 0 : t.create) || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let t = e[this.id] >> 1;
    return {
      create: (i) => (i.values[t] = this.create(i), 1),
      update: (i, r) => {
        let s = i.values[t], l = this.updateF(s, r);
        return this.compareF(s, l) ? 0 : (i.values[t] = l, 1);
      },
      reconfigure: (i, r) => r.config.address[this.id] != null ? (i.values[t] = r.field(this), 0) : (i.values[t] = this.create(i), 1)
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, Kd.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const Dn = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function gs(n) {
  return (e) => new Sm(e, n);
}
const Tn = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ gs(Dn.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ gs(Dn.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ gs(Dn.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ gs(Dn.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ gs(Dn.lowest)
};
class Sm {
  constructor(e, t) {
    this.inner = e, this.prec = t;
  }
}
class qr {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new _h(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return qr.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class _h {
  constructor(e, t) {
    this.compartment = e, this.inner = t;
  }
}
class zl {
  constructor(e, t, i, r, s, l) {
    for (this.base = e, this.compartments = t, this.dynamicSlots = i, this.address = r, this.staticValues = s, this.facets = l, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let t = this.address[e.id];
    return t == null ? e.default : this.staticValues[t >> 1];
  }
  static resolve(e, t, i) {
    let r = [], s = /* @__PURE__ */ Object.create(null), l = /* @__PURE__ */ new Map();
    for (let g of lk(e, t, l))
      g instanceof Ne ? r.push(g) : (s[g.facet.id] || (s[g.facet.id] = [])).push(g);
    let O = /* @__PURE__ */ Object.create(null), h = [], f = [];
    for (let g of r)
      O[g.id] = f.length << 1, f.push((Q) => g.slot(Q));
    let u = i == null ? void 0 : i.config.facets;
    for (let g in s) {
      let Q = s[g], b = Q[0].facet, v = u && u[g] || [];
      if (Q.every(
        (w) => w.type == 0
        /* Provider.Static */
      ))
        if (O[b.id] = h.length << 1 | 1, Xc(v, Q))
          h.push(i.facet(b));
        else {
          let w = b.combine(Q.map((Z) => Z.value));
          h.push(i && b.compare(w, i.facet(b)) ? i.facet(b) : w);
        }
      else {
        for (let w of Q)
          w.type == 0 ? (O[w.id] = h.length << 1 | 1, h.push(w.value)) : (O[w.id] = f.length << 1, f.push((Z) => w.dynamicSlot(Z)));
        O[b.id] = f.length << 1, f.push((w) => ok(w, b, Q));
      }
    }
    let d = f.map((g) => g(O));
    return new zl(e, l, d, O, h, s);
  }
}
function lk(n, e, t) {
  let i = [[], [], [], [], []], r = /* @__PURE__ */ new Map();
  function s(l, O) {
    let h = r.get(l);
    if (h != null) {
      if (h <= O)
        return;
      let f = i[h].indexOf(l);
      f > -1 && i[h].splice(f, 1), l instanceof _h && t.delete(l.compartment);
    }
    if (r.set(l, O), Array.isArray(l))
      for (let f of l)
        s(f, O);
    else if (l instanceof _h) {
      if (t.has(l.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let f = e.get(l.compartment) || l.inner;
      t.set(l.compartment, f), s(f, O);
    } else if (l instanceof Sm)
      s(l.inner, l.prec);
    else if (l instanceof Ne)
      i[O].push(l), l.provides && s(l.provides, O);
    else if (l instanceof wl)
      i[O].push(l), l.facet.extensions && s(l.facet.extensions, Dn.default);
    else {
      let f = l.extension;
      if (!f)
        throw new Error(`Unrecognized extension value in extension set (${l}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      s(f, O);
    }
  }
  return s(n, Dn.default), i.reduce((l, O) => l.concat(O));
}
function _s(n, e) {
  if (e & 1)
    return 2;
  let t = e >> 1, i = n.status[t];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[t] = 4;
  let r = n.computeSlot(n, n.config.dynamicSlots[t]);
  return n.status[t] = 2 | r;
}
function El(n, e) {
  return e & 1 ? n.config.staticValues[e >> 1] : n.values[e >> 1];
}
const $m = /* @__PURE__ */ j.define(), Xh = /* @__PURE__ */ j.define({
  combine: (n) => n.some((e) => e),
  static: !0
}), bm = /* @__PURE__ */ j.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), ym = /* @__PURE__ */ j.define(), xm = /* @__PURE__ */ j.define(), vm = /* @__PURE__ */ j.define(), wm = /* @__PURE__ */ j.define({
  combine: (n) => n.length ? n[0] : !1
});
class Hi {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new ak();
  }
}
class ak {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new Hi(this, e);
  }
}
class Ok {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new ie(this, e);
  }
}
class ie {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let t = this.type.map(this.value, e);
    return t === void 0 ? void 0 : t == this.value ? this : new ie(this.type, t);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new Ok(e.map || ((t) => t));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, t) {
    if (!e.length)
      return e;
    let i = [];
    for (let r of e) {
      let s = r.map(t);
      s && i.push(s);
    }
    return i;
  }
}
ie.reconfigure = /* @__PURE__ */ ie.define();
ie.appendConfig = /* @__PURE__ */ ie.define();
class Be {
  constructor(e, t, i, r, s, l) {
    this.startState = e, this.changes = t, this.selection = i, this.effects = r, this.annotations = s, this.scrollIntoView = l, this._doc = null, this._state = null, i && Pm(i, t.newLength), s.some((O) => O.type == Be.time) || (this.annotations = s.concat(Be.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, t, i, r, s, l) {
    return new Be(e, t, i, r, s, l);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let t of this.annotations)
      if (t.type == e)
        return t.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let t = this.annotation(Be.userEvent);
    return !!(t && (t == e || t.length > e.length && t.slice(0, e.length) == e && t[e.length] == "."));
  }
}
Be.time = /* @__PURE__ */ Hi.define();
Be.userEvent = /* @__PURE__ */ Hi.define();
Be.addToHistory = /* @__PURE__ */ Hi.define();
Be.remote = /* @__PURE__ */ Hi.define();
function hk(n, e) {
  let t = [];
  for (let i = 0, r = 0; ; ) {
    let s, l;
    if (i < n.length && (r == e.length || e[r] >= n[i]))
      s = n[i++], l = n[i++];
    else if (r < e.length)
      s = e[r++], l = e[r++];
    else
      return t;
    !t.length || t[t.length - 1] < s ? t.push(s, l) : t[t.length - 1] < l && (t[t.length - 1] = l);
  }
}
function km(n, e, t) {
  var i;
  let r, s, l;
  return t ? (r = e.changes, s = Ke.empty(e.changes.length), l = n.changes.compose(e.changes)) : (r = e.changes.map(n.changes), s = n.changes.mapDesc(e.changes, !0), l = n.changes.compose(r)), {
    changes: l,
    selection: e.selection ? e.selection.map(s) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(r),
    effects: ie.mapEffects(n.effects, r).concat(ie.mapEffects(e.effects, s)),
    annotations: n.annotations.length ? n.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: n.scrollIntoView || e.scrollIntoView
  };
}
function qh(n, e, t) {
  let i = e.selection, r = wr(e.annotations);
  return e.userEvent && (r = r.concat(Be.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof Ke ? e.changes : Ke.of(e.changes || [], t, n.facet(bm)),
    selection: i && (i instanceof X ? i : X.single(i.anchor, i.head)),
    effects: wr(e.effects),
    annotations: r,
    scrollIntoView: !!e.scrollIntoView
  };
}
function Tm(n, e, t) {
  let i = qh(n, e.length ? e[0] : {}, n.doc.length);
  e.length && e[0].filter === !1 && (t = !1);
  for (let s = 1; s < e.length; s++) {
    e[s].filter === !1 && (t = !1);
    let l = !!e[s].sequential;
    i = km(i, qh(n, e[s], l ? i.changes.newLength : n.doc.length), l);
  }
  let r = Be.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return fk(t ? ck(r) : r);
}
function ck(n) {
  let e = n.startState, t = !0;
  for (let r of e.facet(ym)) {
    let s = r(n);
    if (s === !1) {
      t = !1;
      break;
    }
    Array.isArray(s) && (t = t === !0 ? s : hk(t, s));
  }
  if (t !== !0) {
    let r, s;
    if (t === !1)
      s = n.changes.invertedDesc, r = Ke.empty(e.doc.length);
    else {
      let l = n.changes.filter(t);
      r = l.changes, s = l.filtered.mapDesc(l.changes).invertedDesc;
    }
    n = Be.create(e, r, n.selection && n.selection.map(s), ie.mapEffects(n.effects, s), n.annotations, n.scrollIntoView);
  }
  let i = e.facet(xm);
  for (let r = i.length - 1; r >= 0; r--) {
    let s = i[r](n);
    s instanceof Be ? n = s : Array.isArray(s) && s.length == 1 && s[0] instanceof Be ? n = s[0] : n = Tm(e, wr(s), !1);
  }
  return n;
}
function fk(n) {
  let e = n.startState, t = e.facet(vm), i = n;
  for (let r = t.length - 1; r >= 0; r--) {
    let s = t[r](n);
    s && Object.keys(s).length && (i = km(i, qh(e, s, n.changes.newLength), !0));
  }
  return i == n ? n : Be.create(e, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const uk = [];
function wr(n) {
  return n == null ? uk : Array.isArray(n) ? n : [n];
}
var qe = /* @__PURE__ */ function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
}(qe || (qe = {}));
const dk = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let Ch;
try {
  Ch = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function pk(n) {
  if (Ch)
    return Ch.test(n);
  for (let e = 0; e < n.length; e++) {
    let t = n[e];
    if (/\w/.test(t) || t > "" && (t.toUpperCase() != t.toLowerCase() || dk.test(t)))
      return !0;
  }
  return !1;
}
function gk(n) {
  return (e) => {
    if (!/\S/.test(e))
      return qe.Space;
    if (pk(e))
      return qe.Word;
    for (let t = 0; t < n.length; t++)
      if (e.indexOf(n[t]) > -1)
        return qe.Word;
    return qe.Other;
  };
}
class ce {
  constructor(e, t, i, r, s, l) {
    this.config = e, this.doc = t, this.selection = i, this.values = r, this.status = e.statusTemplate.slice(), this.computeSlot = s, l && (l._state = this);
    for (let O = 0; O < this.config.dynamicSlots.length; O++)
      _s(this, O << 1);
    this.computeSlot = null;
  }
  field(e, t = !0) {
    let i = this.config.address[e.id];
    if (i == null) {
      if (t)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return _s(this, i), El(this, i);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return Tm(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let t = this.config, { base: i, compartments: r } = t;
    for (let O of e.effects)
      O.is(qr.reconfigure) ? (t && (r = /* @__PURE__ */ new Map(), t.compartments.forEach((h, f) => r.set(f, h)), t = null), r.set(O.value.compartment, O.value.extension)) : O.is(ie.reconfigure) ? (t = null, i = O.value) : O.is(ie.appendConfig) && (t = null, i = wr(i).concat(O.value));
    let s;
    t ? s = e.startState.values.slice() : (t = zl.resolve(i, r, this), s = new ce(t, this.doc, this.selection, t.dynamicSlots.map(() => null), (h, f) => f.reconfigure(h, this), null).values);
    let l = e.startState.facet(Xh) ? e.newSelection : e.newSelection.asSingle();
    new ce(t, e.newDoc, l, s, (O, h) => h.update(O, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
      changes: { from: t.from, to: t.to, insert: e },
      range: X.cursor(t.from + e.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let t = this.selection, i = e(t.ranges[0]), r = this.changes(i.changes), s = [i.range], l = wr(i.effects);
    for (let O = 1; O < t.ranges.length; O++) {
      let h = e(t.ranges[O]), f = this.changes(h.changes), u = f.map(r);
      for (let g = 0; g < O; g++)
        s[g] = s[g].map(u);
      let d = r.mapDesc(f, !0);
      s.push(h.range.map(d)), r = r.compose(u), l = ie.mapEffects(l, u).concat(ie.mapEffects(wr(h.effects), d));
    }
    return {
      changes: r,
      selection: X.create(s, t.mainIndex),
      effects: l
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof Ke ? e : Ke.of(e, this.doc.length, this.facet(ce.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return Pe.of(e.split(this.facet(ce.lineSeparator) || kh));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, t = this.doc.length) {
    return this.doc.sliceString(e, t, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let t = this.config.address[e.id];
    return t == null ? e.default : (_s(this, t), El(this, t));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let t = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let i in e) {
        let r = e[i];
        r instanceof Ne && this.config.address[r.id] != null && (t[i] = r.spec.toJSON(this.field(e[i]), this));
      }
    return t;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, t = {}, i) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let r = [];
    if (i) {
      for (let s in i)
        if (Object.prototype.hasOwnProperty.call(e, s)) {
          let l = i[s], O = e[s];
          r.push(l.init((h) => l.spec.fromJSON(O, h)));
        }
    }
    return ce.create({
      doc: e.doc,
      selection: X.fromJSON(e.selection),
      extensions: t.extensions ? r.concat([t.extensions]) : r
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let t = zl.resolve(e.extensions || [], /* @__PURE__ */ new Map()), i = e.doc instanceof Pe ? e.doc : Pe.of((e.doc || "").split(t.staticFacet(ce.lineSeparator) || kh)), r = e.selection ? e.selection instanceof X ? e.selection : X.single(e.selection.anchor, e.selection.head) : X.single(0);
    return Pm(r, i.length), t.staticFacet(Xh) || (r = r.asSingle()), new ce(t, i, r, t.dynamicSlots.map(() => null), (s, l) => l.create(s), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(ce.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(ce.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(wm);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...t) {
    for (let i of this.facet(ce.phrases))
      if (Object.prototype.hasOwnProperty.call(i, e)) {
        e = i[e];
        break;
      }
    return t.length && (e = e.replace(/\$(\$|\d*)/g, (i, r) => {
      if (r == "$")
        return "$";
      let s = +(r || 1);
      return !s || s > t.length ? i : t[s - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, t, i = -1) {
    let r = [];
    for (let s of this.facet($m))
      for (let l of s(this, t, i))
        Object.prototype.hasOwnProperty.call(l, e) && r.push(l[e]);
    return r;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    return gk(this.languageDataAt("wordChars", e).join(""));
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: t, from: i, length: r } = this.doc.lineAt(e), s = this.charCategorizer(e), l = e - i, O = e - i;
    for (; l > 0; ) {
      let h = at(t, l, !1);
      if (s(t.slice(h, l)) != qe.Word)
        break;
      l = h;
    }
    for (; O < r; ) {
      let h = at(t, O);
      if (s(t.slice(O, h)) != qe.Word)
        break;
      O = h;
    }
    return l == O ? null : X.range(l + i, O + i);
  }
}
ce.allowMultipleSelections = Xh;
ce.tabSize = /* @__PURE__ */ j.define({
  combine: (n) => n.length ? n[0] : 4
});
ce.lineSeparator = bm;
ce.readOnly = wm;
ce.phrases = /* @__PURE__ */ j.define({
  compare(n, e) {
    let t = Object.keys(n), i = Object.keys(e);
    return t.length == i.length && t.every((r) => n[r] == e[r]);
  }
});
ce.languageData = $m;
ce.changeFilter = ym;
ce.transactionFilter = xm;
ce.transactionExtender = vm;
qr.reconfigure = /* @__PURE__ */ ie.define();
function ci(n, e, t = {}) {
  let i = {};
  for (let r of n)
    for (let s of Object.keys(r)) {
      let l = r[s], O = i[s];
      if (O === void 0)
        i[s] = l;
      else if (!(O === l || l === void 0)) if (Object.hasOwnProperty.call(t, s))
        i[s] = t[s](O, l);
      else
        throw new Error("Config merge conflict for field " + s);
    }
  for (let r in e)
    i[r] === void 0 && (i[r] = e[r]);
  return i;
}
class Hn {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, t = e) {
    return Wh.create(e, t, this);
  }
}
Hn.prototype.startSide = Hn.prototype.endSide = 0;
Hn.prototype.point = !1;
Hn.prototype.mapMode = ot.TrackDel;
let Wh = class Zm {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.value = i;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Zm(e, t, i);
  }
};
function Yh(n, e) {
  return n.from - e.from || n.value.startSide - e.value.startSide;
}
class qc {
  constructor(e, t, i, r) {
    this.from = e, this.to = t, this.value = i, this.maxPoint = r;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, t, i, r = 0) {
    let s = i ? this.to : this.from;
    for (let l = r, O = s.length; ; ) {
      if (l == O)
        return l;
      let h = l + O >> 1, f = s[h] - e || (i ? this.value[h].endSide : this.value[h].startSide) - t;
      if (h == l)
        return f >= 0 ? l : O;
      f >= 0 ? O = h : l = h + 1;
    }
  }
  between(e, t, i, r) {
    for (let s = this.findIndex(t, -1e9, !0), l = this.findIndex(i, 1e9, !1, s); s < l; s++)
      if (r(this.from[s] + e, this.to[s] + e, this.value[s]) === !1)
        return !1;
  }
  map(e, t) {
    let i = [], r = [], s = [], l = -1, O = -1;
    for (let h = 0; h < this.value.length; h++) {
      let f = this.value[h], u = this.from[h] + e, d = this.to[h] + e, g, Q;
      if (u == d) {
        let b = t.mapPos(u, f.startSide, f.mapMode);
        if (b == null || (g = Q = b, f.startSide != f.endSide && (Q = t.mapPos(u, f.endSide), Q < g)))
          continue;
      } else if (g = t.mapPos(u, f.startSide), Q = t.mapPos(d, f.endSide), g > Q || g == Q && f.startSide > 0 && f.endSide <= 0)
        continue;
      (Q - g || f.endSide - f.startSide) < 0 || (l < 0 && (l = g), f.point && (O = Math.max(O, Q - g)), i.push(f), r.push(g - l), s.push(Q - l));
    }
    return { mapped: i.length ? new qc(r, s, i, O) : null, pos: l };
  }
}
class Qe {
  constructor(e, t, i, r) {
    this.chunkPos = e, this.chunk = t, this.nextLayer = i, this.maxPoint = r;
  }
  /**
  @internal
  */
  static create(e, t, i, r) {
    return new Qe(e, t, i, r);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let t of this.chunk)
      e += t.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: t = [], sort: i = !1, filterFrom: r = 0, filterTo: s = this.length } = e, l = e.filter;
    if (t.length == 0 && !l)
      return this;
    if (i && (t = t.slice().sort(Yh)), this.isEmpty)
      return t.length ? Qe.of(t) : this;
    let O = new Rm(this, null, -1).goto(0), h = 0, f = [], u = new Sn();
    for (; O.value || h < t.length; )
      if (h < t.length && (O.from - t[h].from || O.startSide - t[h].value.startSide) >= 0) {
        let d = t[h++];
        u.addInner(d.from, d.to, d.value) || f.push(d);
      } else O.rangeIndex == 1 && O.chunkIndex < this.chunk.length && (h == t.length || this.chunkEnd(O.chunkIndex) < t[h].from) && (!l || r > this.chunkEnd(O.chunkIndex) || s < this.chunkPos[O.chunkIndex]) && u.addChunk(this.chunkPos[O.chunkIndex], this.chunk[O.chunkIndex]) ? O.nextChunk() : ((!l || r > O.to || s < O.from || l(O.from, O.to, O.value)) && (u.addInner(O.from, O.to, O.value) || f.push(Wh.create(O.from, O.to, O.value))), O.next());
    return u.finishInner(this.nextLayer.isEmpty && !f.length ? Qe.empty : this.nextLayer.update({ add: f, filter: l, filterFrom: r, filterTo: s }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let t = [], i = [], r = -1;
    for (let l = 0; l < this.chunk.length; l++) {
      let O = this.chunkPos[l], h = this.chunk[l], f = e.touchesRange(O, O + h.length);
      if (f === !1)
        r = Math.max(r, h.maxPoint), t.push(h), i.push(e.mapPos(O));
      else if (f === !0) {
        let { mapped: u, pos: d } = h.map(O, e);
        u && (r = Math.max(r, u.maxPoint), t.push(u), i.push(d));
      }
    }
    let s = this.nextLayer.map(e);
    return t.length == 0 ? s : new Qe(i, t, s || Qe.empty, r);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, t, i) {
    if (!this.isEmpty) {
      for (let r = 0; r < this.chunk.length; r++) {
        let s = this.chunkPos[r], l = this.chunk[r];
        if (t >= s && e <= s + l.length && l.between(s, e - s, t - s, i) === !1)
          return;
      }
      this.nextLayer.between(e, t, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return As.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, t = 0) {
    return As.from(e).goto(t);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, t, i, r, s = -1) {
    let l = e.filter((d) => d.maxPoint > 0 || !d.isEmpty && d.maxPoint >= s), O = t.filter((d) => d.maxPoint > 0 || !d.isEmpty && d.maxPoint >= s), h = ep(l, O, i), f = new ms(l, h, s), u = new ms(O, h, s);
    i.iterGaps((d, g, Q) => tp(f, d, u, g, Q, r)), i.empty && i.length == 0 && tp(f, 0, u, 0, 0, r);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, t, i = 0, r) {
    r == null && (r = 999999999);
    let s = e.filter((u) => !u.isEmpty && t.indexOf(u) < 0), l = t.filter((u) => !u.isEmpty && e.indexOf(u) < 0);
    if (s.length != l.length)
      return !1;
    if (!s.length)
      return !0;
    let O = ep(s, l), h = new ms(s, O, 0).goto(i), f = new ms(l, O, 0).goto(i);
    for (; ; ) {
      if (h.to != f.to || !Ah(h.active, f.active) || h.point && (!f.point || !h.point.eq(f.point)))
        return !1;
      if (h.to > r)
        return !0;
      h.next(), f.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, t, i, r, s = -1) {
    let l = new ms(e, null, s).goto(t), O = t, h = l.openStart;
    for (; ; ) {
      let f = Math.min(l.to, i);
      if (l.point) {
        let u = l.activeForPoint(l.to), d = l.pointFrom < t ? u.length + 1 : l.point.startSide < 0 ? u.length : Math.min(u.length, h);
        r.point(O, f, l.point, u, d, l.pointRank), h = Math.min(l.openEnd(f), u.length);
      } else f > O && (r.span(O, f, l.active, h), h = l.openEnd(f));
      if (l.to > i)
        return h + (l.point && l.to > i ? 1 : 0);
      O = l.to, l.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, t = !1) {
    let i = new Sn();
    for (let r of e instanceof Wh ? [e] : t ? mk(e) : e)
      i.add(r.from, r.to, r.value);
    return i.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(e) {
    if (!e.length)
      return Qe.empty;
    let t = e[e.length - 1];
    for (let i = e.length - 2; i >= 0; i--)
      for (let r = e[i]; r != Qe.empty; r = r.nextLayer)
        t = new Qe(r.chunkPos, r.chunk, t, Math.max(r.maxPoint, t.maxPoint));
    return t;
  }
}
Qe.empty = /* @__PURE__ */ new Qe([], [], null, -1);
function mk(n) {
  if (n.length > 1)
    for (let e = n[0], t = 1; t < n.length; t++) {
      let i = n[t];
      if (Yh(e, i) > 0)
        return n.slice().sort(Yh);
      e = i;
    }
  return n;
}
Qe.empty.nextLayer = Qe.empty;
class Sn {
  finishChunk(e) {
    this.chunks.push(new qc(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, t, i) {
    this.addInner(e, t, i) || (this.nextLayer || (this.nextLayer = new Sn())).add(e, t, i);
  }
  /**
  @internal
  */
  addInner(e, t, i) {
    let r = e - this.lastTo || i.startSide - this.last.endSide;
    if (r <= 0 && (e - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return r < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = i, this.lastFrom = e, this.lastTo = t, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, t) {
    if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
    let i = t.value.length - 1;
    return this.last = t.value[i], this.lastFrom = t.from[i] + e, this.lastTo = t.to[i] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(Qe.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let t = Qe.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, t;
  }
}
function ep(n, e, t) {
  let i = /* @__PURE__ */ new Map();
  for (let s of n)
    for (let l = 0; l < s.chunk.length; l++)
      s.chunk[l].maxPoint <= 0 && i.set(s.chunk[l], s.chunkPos[l]);
  let r = /* @__PURE__ */ new Set();
  for (let s of e)
    for (let l = 0; l < s.chunk.length; l++) {
      let O = i.get(s.chunk[l]);
      O != null && (t ? t.mapPos(O) : O) == s.chunkPos[l] && !(t != null && t.touchesRange(O, O + s.chunk[l].length)) && r.add(s.chunk[l]);
    }
  return r;
}
class Rm {
  constructor(e, t, i, r = 0) {
    this.layer = e, this.skip = t, this.minPoint = i, this.rank = r;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, t = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, t, !1), this;
  }
  gotoInner(e, t, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let r = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(r) || this.layer.chunkEnd(this.chunkIndex) < e || r.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let r = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
      (!i || this.rangeIndex < r) && this.setRangeIndex(r);
    }
    this.next();
  }
  forward(e, t) {
    (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], i = e + t.from[this.rangeIndex];
        if (this.from = i, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class As {
  constructor(e) {
    this.heap = e;
  }
  static from(e, t = null, i = -1) {
    let r = [];
    for (let s = 0; s < e.length; s++)
      for (let l = e[s]; !l.isEmpty; l = l.nextLayer)
        l.maxPoint >= i && r.push(new Rm(l, t, i, s));
    return r.length == 1 ? r[0] : new As(r);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, t = -1e9) {
    for (let i of this.heap)
      i.goto(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      NO(this.heap, i);
    return this.next(), this;
  }
  forward(e, t) {
    for (let i of this.heap)
      i.forward(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      NO(this.heap, i);
    (this.to - e || this.value.endSide - t) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), NO(this.heap, 0);
    }
  }
}
function NO(n, e) {
  for (let t = n[e]; ; ) {
    let i = (e << 1) + 1;
    if (i >= n.length)
      break;
    let r = n[i];
    if (i + 1 < n.length && r.compare(n[i + 1]) >= 0 && (r = n[i + 1], i++), t.compare(r) < 0)
      break;
    n[i] = t, n[e] = r, e = i;
  }
}
class ms {
  constructor(e, t, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = As.from(e, t, i);
  }
  goto(e, t = -1e9) {
    return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
  }
  forward(e, t) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, t);
  }
  removeActive(e) {
    il(this.active, e), il(this.activeTo, e), il(this.activeRank, e), this.minActive = ip(this.active, this.activeTo);
  }
  addActive(e) {
    let t = 0, { value: i, to: r, rank: s } = this.cursor;
    for (; t < this.activeRank.length && (s - this.activeRank[t] || r - this.activeTo[t]) > 0; )
      t++;
    nl(this.active, t, i), nl(this.activeTo, t, r), nl(this.activeRank, t, s), e && nl(e, t, this.cursor.from), this.minActive = ip(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, t = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let r = this.minActive;
      if (r > -1 && (this.activeTo[r] - this.cursor.from || this.active[r].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[r] > e) {
          this.to = this.activeTo[r], this.endSide = this.active[r].endSide;
          break;
        }
        this.removeActive(r), i && il(i, r);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let s = this.cursor.value;
          if (!s.point)
            this.addActive(i), this.cursor.next();
          else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = s, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = s.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (i) {
      this.openStart = 0;
      for (let r = i.length - 1; r >= 0 && i[r] < e; r--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let t = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > e || this.activeTo[i] == e && this.active[i].endSide >= this.point.endSide) && t.push(this.active[i]);
    return t.reverse();
  }
  openEnd(e) {
    let t = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > e; i--)
      t++;
    return t;
  }
}
function tp(n, e, t, i, r, s) {
  n.goto(e), t.goto(i);
  let l = i + r, O = i, h = i - e;
  for (; ; ) {
    let f = n.to + h - t.to || n.endSide - t.endSide, u = f < 0 ? n.to + h : t.to, d = Math.min(u, l);
    if (n.point || t.point ? n.point && t.point && (n.point == t.point || n.point.eq(t.point)) && Ah(n.activeForPoint(n.to), t.activeForPoint(t.to)) || s.comparePoint(O, d, n.point, t.point) : d > O && !Ah(n.active, t.active) && s.compareRange(O, d, n.active, t.active), u > l)
      break;
    O = u, f <= 0 && n.next(), f >= 0 && t.next();
  }
}
function Ah(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] != e[t] && !n[t].eq(e[t]))
      return !1;
  return !0;
}
function il(n, e) {
  for (let t = e, i = n.length - 1; t < i; t++)
    n[t] = n[t + 1];
  n.pop();
}
function nl(n, e, t) {
  for (let i = n.length - 1; i >= e; i--)
    n[i + 1] = n[i];
  n[e] = t;
}
function ip(n, e) {
  let t = -1, i = 1e9;
  for (let r = 0; r < e.length; r++)
    (e[r] - i || n[r].endSide - n[t].endSide) < 0 && (t = r, i = e[r]);
  return t;
}
function zr(n, e, t = n.length) {
  let i = 0;
  for (let r = 0; r < t; )
    n.charCodeAt(r) == 9 ? (i += e - i % e, r++) : (i++, r = at(n, r));
  return i;
}
function Uh(n, e, t, i) {
  for (let r = 0, s = 0; ; ) {
    if (s >= e)
      return r;
    if (r == n.length)
      break;
    s += n.charCodeAt(r) == 9 ? t - s % t : 1, r = at(n, r);
  }
  return i === !0 ? -1 : n.length;
}
const Vh = "ͼ", np = typeof Symbol > "u" ? "__" + Vh : Symbol.for(Vh), zh = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), rp = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class $n {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, t) {
    this.rules = [];
    let { finish: i } = t || {};
    function r(l) {
      return /^@/.test(l) ? [l] : l.split(/,\s*/);
    }
    function s(l, O, h, f) {
      let u = [], d = /^@(\w+)\b/.exec(l[0]), g = d && d[1] == "keyframes";
      if (d && O == null) return h.push(l[0] + ";");
      for (let Q in O) {
        let b = O[Q];
        if (/&/.test(Q))
          s(
            Q.split(/,\s*/).map((v) => l.map((w) => v.replace(/&/, w))).reduce((v, w) => v.concat(w)),
            b,
            h
          );
        else if (b && typeof b == "object") {
          if (!d) throw new RangeError("The value of a property (" + Q + ") should be a primitive value.");
          s(r(Q), b, u, g);
        } else b != null && u.push(Q.replace(/_.*/, "").replace(/[A-Z]/g, (v) => "-" + v.toLowerCase()) + ": " + b + ";");
      }
      (u.length || g) && h.push((i && !d && !f ? l.map(i) : l).join(", ") + " {" + u.join(" ") + "}");
    }
    for (let l in e) s(r(l), e[l], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = rp[np] || 1;
    return rp[np] = e + 1, Vh + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, t, i) {
    let r = e[zh], s = i && i.nonce;
    r ? s && r.setNonce(s) : r = new Qk(e, s), r.mount(Array.isArray(t) ? t : [t], e);
  }
}
let sp = /* @__PURE__ */ new Map();
class Qk {
  constructor(e, t) {
    let i = e.ownerDocument || e, r = i.defaultView;
    if (!e.head && e.adoptedStyleSheets && r.CSSStyleSheet) {
      let s = sp.get(i);
      if (s) return e[zh] = s;
      this.sheet = new r.CSSStyleSheet(), sp.set(i, this);
    } else
      this.styleTag = i.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
    this.modules = [], e[zh] = this;
  }
  mount(e, t) {
    let i = this.sheet, r = 0, s = 0;
    for (let l = 0; l < e.length; l++) {
      let O = e[l], h = this.modules.indexOf(O);
      if (h < s && h > -1 && (this.modules.splice(h, 1), s--, h = -1), h == -1) {
        if (this.modules.splice(s++, 0, O), i) for (let f = 0; f < O.rules.length; f++)
          i.insertRule(O.rules[f], r++);
      } else {
        for (; s < h; ) r += this.modules[s++].rules.length;
        r += O.rules.length, s++;
      }
    }
    if (i)
      t.adoptedStyleSheets.indexOf(this.sheet) < 0 && (t.adoptedStyleSheets = [this.sheet, ...t.adoptedStyleSheets]);
    else {
      let l = "";
      for (let h = 0; h < this.modules.length; h++)
        l += this.modules[h].getRules() + `
`;
      this.styleTag.textContent = l;
      let O = t.head || t;
      this.styleTag.parentNode != O && O.insertBefore(this.styleTag, O.firstChild);
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var bn = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, Us = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, Pk = typeof navigator < "u" && /Mac/.test(navigator.platform), Sk = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var st = 0; st < 10; st++) bn[48 + st] = bn[96 + st] = String(st);
for (var st = 1; st <= 24; st++) bn[st + 111] = "F" + st;
for (var st = 65; st <= 90; st++)
  bn[st] = String.fromCharCode(st + 32), Us[st] = String.fromCharCode(st);
for (var FO in bn) Us.hasOwnProperty(FO) || (Us[FO] = bn[FO]);
function $k(n) {
  var e = Pk && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Sk && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Us : bn)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
function Vs(n) {
  let e;
  return n.nodeType == 11 ? e = n.getSelection ? n : n.ownerDocument : e = n, e.getSelection();
}
function Eh(n, e) {
  return e ? n == e || n.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function bk(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function kl(n, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return Eh(n, e.anchorNode);
  } catch {
    return !1;
  }
}
function Cr(n) {
  return n.nodeType == 3 ? Kn(n, 0, n.nodeValue.length).getClientRects() : n.nodeType == 1 ? n.getClientRects() : [];
}
function Xs(n, e, t, i) {
  return t ? op(n, e, t, i, -1) || op(n, e, t, i, 1) : !1;
}
function Jn(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}
function Ml(n) {
  return n.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
function op(n, e, t, i, r) {
  for (; ; ) {
    if (n == t && e == i)
      return !0;
    if (e == (r < 0 ? 0 : Ni(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let s = n.parentNode;
      if (!s || s.nodeType != 1)
        return !1;
      e = Jn(n) + (r < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (r < 0 ? -1 : 0)], n.nodeType == 1 && n.contentEditable == "false")
        return !1;
      e = r < 0 ? Ni(n) : 0;
    } else
      return !1;
  }
}
function Ni(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function ua(n, e) {
  let t = e ? n.left : n.right;
  return { left: t, right: t, top: n.top, bottom: n.bottom };
}
function yk(n) {
  let e = n.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function _m(n, e) {
  let t = e.width / n.offsetWidth, i = e.height / n.offsetHeight;
  return (t > 0.995 && t < 1.005 || !isFinite(t) || Math.abs(e.width - n.offsetWidth) < 1) && (t = 1), (i > 0.995 && i < 1.005 || !isFinite(i) || Math.abs(e.height - n.offsetHeight) < 1) && (i = 1), { scaleX: t, scaleY: i };
}
function xk(n, e, t, i, r, s, l, O) {
  let h = n.ownerDocument, f = h.defaultView || window;
  for (let u = n, d = !1; u && !d; )
    if (u.nodeType == 1) {
      let g, Q = u == h.body, b = 1, v = 1;
      if (Q)
        g = yk(f);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(u).position) && (d = !0), u.scrollHeight <= u.clientHeight && u.scrollWidth <= u.clientWidth) {
          u = u.assignedSlot || u.parentNode;
          continue;
        }
        let Y = u.getBoundingClientRect();
        ({ scaleX: b, scaleY: v } = _m(u, Y)), g = {
          left: Y.left,
          right: Y.left + u.clientWidth * b,
          top: Y.top,
          bottom: Y.top + u.clientHeight * v
        };
      }
      let w = 0, Z = 0;
      if (r == "nearest")
        e.top < g.top ? (Z = -(g.top - e.top + l), t > 0 && e.bottom > g.bottom + Z && (Z = e.bottom - g.bottom + Z + l)) : e.bottom > g.bottom && (Z = e.bottom - g.bottom + l, t < 0 && e.top - Z < g.top && (Z = -(g.top + Z - e.top + l)));
      else {
        let Y = e.bottom - e.top, U = g.bottom - g.top;
        Z = (r == "center" && Y <= U ? e.top + Y / 2 - U / 2 : r == "start" || r == "center" && t < 0 ? e.top - l : e.bottom - U + l) - g.top;
      }
      if (i == "nearest" ? e.left < g.left ? (w = -(g.left - e.left + s), t > 0 && e.right > g.right + w && (w = e.right - g.right + w + s)) : e.right > g.right && (w = e.right - g.right + s, t < 0 && e.left < g.left + w && (w = -(g.left + w - e.left + s))) : w = (i == "center" ? e.left + (e.right - e.left) / 2 - (g.right - g.left) / 2 : i == "start" == O ? e.left - s : e.right - (g.right - g.left) + s) - g.left, w || Z)
        if (Q)
          f.scrollBy(w, Z);
        else {
          let Y = 0, U = 0;
          if (Z) {
            let V = u.scrollTop;
            u.scrollTop += Z / v, U = (u.scrollTop - V) * v;
          }
          if (w) {
            let V = u.scrollLeft;
            u.scrollLeft += w / b, Y = (u.scrollLeft - V) * b;
          }
          e = {
            left: e.left - Y,
            top: e.top - U,
            right: e.right - Y,
            bottom: e.bottom - U
          }, Y && Math.abs(Y - w) < 1 && (i = "nearest"), U && Math.abs(U - Z) < 1 && (r = "nearest");
        }
      if (Q)
        break;
      u = u.assignedSlot || u.parentNode;
    } else if (u.nodeType == 11)
      u = u.host;
    else
      break;
}
function vk(n) {
  let e = n.ownerDocument;
  for (let t = n.parentNode; t && t != e.body; )
    if (t.nodeType == 1) {
      if (t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth)
        return t;
      t = t.assignedSlot || t.parentNode;
    } else if (t.nodeType == 11)
      t = t.host;
    else
      break;
  return null;
}
class wk {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: t, focusNode: i } = e;
    this.set(t, Math.min(e.anchorOffset, t ? Ni(t) : 0), i, Math.min(e.focusOffset, i ? Ni(i) : 0));
  }
  set(e, t, i, r) {
    this.anchorNode = e, this.anchorOffset = t, this.focusNode = i, this.focusOffset = r;
  }
}
let Qr = null;
function Xm(n) {
  if (n.setActive)
    return n.setActive();
  if (Qr)
    return n.focus(Qr);
  let e = [];
  for (let t = n; t && (e.push(t, t.scrollTop, t.scrollLeft), t != t.ownerDocument); t = t.parentNode)
    ;
  if (n.focus(Qr == null ? {
    get preventScroll() {
      return Qr = { preventScroll: !0 }, !0;
    }
  } : void 0), !Qr) {
    Qr = !1;
    for (let t = 0; t < e.length; ) {
      let i = e[t++], r = e[t++], s = e[t++];
      i.scrollTop != r && (i.scrollTop = r), i.scrollLeft != s && (i.scrollLeft = s);
    }
  }
}
let lp;
function Kn(n, e, t = e) {
  let i = lp || (lp = document.createRange());
  return i.setEnd(n, t), i.setStart(n, e), i;
}
function kr(n, e, t, i) {
  let r = { key: e, code: e, keyCode: t, which: t, cancelable: !0 };
  i && ({ altKey: r.altKey, ctrlKey: r.ctrlKey, shiftKey: r.shiftKey, metaKey: r.metaKey } = i);
  let s = new KeyboardEvent("keydown", r);
  s.synthetic = !0, n.dispatchEvent(s);
  let l = new KeyboardEvent("keyup", r);
  return l.synthetic = !0, n.dispatchEvent(l), s.defaultPrevented || l.defaultPrevented;
}
function kk(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function qm(n) {
  for (; n.attributes.length; )
    n.removeAttributeNode(n.attributes[0]);
}
function Tk(n, e) {
  let t = e.focusNode, i = e.focusOffset;
  if (!t || e.anchorNode != t || e.anchorOffset != i)
    return !1;
  for (i = Math.min(i, Ni(t)); ; )
    if (i) {
      if (t.nodeType != 1)
        return !1;
      let r = t.childNodes[i - 1];
      r.contentEditable == "false" ? i-- : (t = r, i = Ni(t));
    } else {
      if (t == n)
        return !0;
      i = Jn(t), t = t.parentNode;
    }
}
function Cm(n) {
  return n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
function Wm(n, e) {
  for (let t = n, i = e; ; ) {
    if (t.nodeType == 3 && i > 0)
      return { node: t, offset: i };
    if (t.nodeType == 1 && i > 0) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i - 1], i = Ni(t);
    } else if (t.parentNode && !Ml(t))
      i = Jn(t), t = t.parentNode;
    else
      return null;
  }
}
function Ym(n, e) {
  for (let t = n, i = e; ; ) {
    if (t.nodeType == 3 && i < t.nodeValue.length)
      return { node: t, offset: i };
    if (t.nodeType == 1 && i < t.childNodes.length) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i], i = 0;
    } else if (t.parentNode && !Ml(t))
      i = Jn(t) + 1, t = t.parentNode;
    else
      return null;
  }
}
class ft {
  constructor(e, t, i = !0) {
    this.node = e, this.offset = t, this.precise = i;
  }
  static before(e, t) {
    return new ft(e.parentNode, Jn(e), t);
  }
  static after(e, t) {
    return new ft(e.parentNode, Jn(e) + 1, t);
  }
}
const Cc = [];
class ve {
  constructor() {
    this.parent = null, this.dom = null, this.flags = 2;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e) {
    let t = this.posAtStart;
    for (let i of this.children) {
      if (i == e)
        return t;
      t += i.length + i.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  sync(e, t) {
    if (this.flags & 2) {
      let i = this.dom, r = null, s;
      for (let l of this.children) {
        if (l.flags & 7) {
          if (!l.dom && (s = r ? r.nextSibling : i.firstChild)) {
            let O = ve.get(s);
            (!O || !O.parent && O.canReuseDOM(l)) && l.reuseDOM(s);
          }
          l.sync(e, t), l.flags &= -8;
        }
        if (s = r ? r.nextSibling : i.firstChild, t && !t.written && t.node == i && s != l.dom && (t.written = !0), l.dom.parentNode == i)
          for (; s && s != l.dom; )
            s = ap(s);
        else
          i.insertBefore(l.dom, s);
        r = l.dom;
      }
      for (s = r ? r.nextSibling : i.firstChild, s && t && t.node == i && (t.written = !0); s; )
        s = ap(s);
    } else if (this.flags & 1)
      for (let i of this.children)
        i.flags & 7 && (i.sync(e, t), i.flags &= -8);
  }
  reuseDOM(e) {
  }
  localPosFromDOM(e, t) {
    let i;
    if (e == this.dom)
      i = this.dom.childNodes[t];
    else {
      let r = Ni(e) == 0 ? 0 : t == 0 ? -1 : 1;
      for (; ; ) {
        let s = e.parentNode;
        if (s == this.dom)
          break;
        r == 0 && s.firstChild != s.lastChild && (e == s.firstChild ? r = -1 : r = 1), e = s;
      }
      r < 0 ? i = e : i = e.nextSibling;
    }
    if (i == this.dom.firstChild)
      return 0;
    for (; i && !ve.get(i); )
      i = i.nextSibling;
    if (!i)
      return this.length;
    for (let r = 0, s = 0; ; r++) {
      let l = this.children[r];
      if (l.dom == i)
        return s;
      s += l.length + l.breakAfter;
    }
  }
  domBoundsAround(e, t, i = 0) {
    let r = -1, s = -1, l = -1, O = -1;
    for (let h = 0, f = i, u = i; h < this.children.length; h++) {
      let d = this.children[h], g = f + d.length;
      if (f < e && g > t)
        return d.domBoundsAround(e, t, f);
      if (g >= e && r == -1 && (r = h, s = f), f > t && d.dom.parentNode == this.dom) {
        l = h, O = u;
        break;
      }
      u = g, f = g + d.breakAfter;
    }
    return {
      from: s,
      to: O < 0 ? i + this.length : O,
      startDOM: (r ? this.children[r - 1].dom.nextSibling : null) || this.dom.firstChild,
      endDOM: l < this.children.length && l >= 0 ? this.children[l].dom : null
    };
  }
  markDirty(e = !1) {
    this.flags |= 2, this.markParentsDirty(e);
  }
  markParentsDirty(e) {
    for (let t = this.parent; t; t = t.parent) {
      if (e && (t.flags |= 2), t.flags & 1)
        return;
      t.flags |= 1, e = !1;
    }
  }
  setParent(e) {
    this.parent != e && (this.parent = e, this.flags & 7 && this.markParentsDirty(!0));
  }
  setDOM(e) {
    this.dom != e && (this.dom && (this.dom.cmView = null), this.dom = e, e.cmView = this);
  }
  get rootView() {
    for (let e = this; ; ) {
      let t = e.parent;
      if (!t)
        return e;
      e = t;
    }
  }
  replaceChildren(e, t, i = Cc) {
    this.markDirty();
    for (let r = e; r < t; r++) {
      let s = this.children[r];
      s.parent == this && i.indexOf(s) < 0 && s.destroy();
    }
    this.children.splice(e, t - e, ...i);
    for (let r = 0; r < i.length; r++)
      i[r].setParent(this);
  }
  ignoreMutation(e) {
    return !1;
  }
  ignoreEvent(e) {
    return !1;
  }
  childCursor(e = this.length) {
    return new Am(this.children, e, this.children.length);
  }
  childPos(e, t = 1) {
    return this.childCursor().findPos(e, t);
  }
  toString() {
    let e = this.constructor.name.replace("View", "");
    return e + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + (e == "Text" ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
  }
  static get(e) {
    return e.cmView;
  }
  get isEditable() {
    return !0;
  }
  get isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  merge(e, t, i, r, s, l) {
    return !1;
  }
  become(e) {
    return !1;
  }
  canReuseDOM(e) {
    return e.constructor == this.constructor && !((this.flags | e.flags) & 8);
  }
  // When this is a zero-length view with a side, this should return a
  // number <= 0 to indicate it is before its position, or a
  // number > 0 when after its position.
  getSide() {
    return 0;
  }
  destroy() {
    for (let e of this.children)
      e.parent == this && e.destroy();
    this.parent = null;
  }
}
ve.prototype.breakAfter = 0;
function ap(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Am {
  constructor(e, t, i) {
    this.children = e, this.pos = t, this.i = i, this.off = 0;
  }
  findPos(e, t = 1) {
    for (; ; ) {
      if (e > this.pos || e == this.pos && (t > 0 || this.i == 0 || this.children[this.i - 1].breakAfter))
        return this.off = e - this.pos, this;
      let i = this.children[--this.i];
      this.pos -= i.length + i.breakAfter;
    }
  }
}
function Um(n, e, t, i, r, s, l, O, h) {
  let { children: f } = n, u = f.length ? f[e] : null, d = s.length ? s[s.length - 1] : null, g = d ? d.breakAfter : l;
  if (!(e == i && u && !l && !g && s.length < 2 && u.merge(t, r, s.length ? d : null, t == 0, O, h))) {
    if (i < f.length) {
      let Q = f[i];
      Q && (r < Q.length || Q.breakAfter && (d != null && d.breakAfter)) ? (e == i && (Q = Q.split(r), r = 0), !g && d && Q.merge(0, r, d, !0, 0, h) ? s[s.length - 1] = Q : ((r || Q.children.length && !Q.children[0].length) && Q.merge(0, r, null, !1, 0, h), s.push(Q))) : Q != null && Q.breakAfter && (d ? d.breakAfter = 1 : l = 1), i++;
    }
    for (u && (u.breakAfter = l, t > 0 && (!l && s.length && u.merge(t, u.length, s[0], !1, O, 0) ? u.breakAfter = s.shift().breakAfter : (t < u.length || u.children.length && u.children[u.children.length - 1].length == 0) && u.merge(t, u.length, null, !1, O, 0), e++)); e < i && s.length; )
      if (f[i - 1].become(s[s.length - 1]))
        i--, s.pop(), h = s.length ? 0 : O;
      else if (f[e].become(s[0]))
        e++, s.shift(), O = s.length ? 0 : h;
      else
        break;
    !s.length && e && i < f.length && !f[e - 1].breakAfter && f[i].merge(0, 0, f[e - 1], !1, O, h) && e--, (e < i || s.length) && n.replaceChildren(e, i, s);
  }
}
function Vm(n, e, t, i, r, s) {
  let l = n.childCursor(), { i: O, off: h } = l.findPos(t, 1), { i: f, off: u } = l.findPos(e, -1), d = e - t;
  for (let g of i)
    d += g.length;
  n.length += d, Um(n, f, u, O, h, i, 0, r, s);
}
let vt = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, Mh = typeof document < "u" ? document : { documentElement: { style: {} } };
const Gh = /* @__PURE__ */ /Edge\/(\d+)/.exec(vt.userAgent), zm = /* @__PURE__ */ /MSIE \d/.test(vt.userAgent), Dh = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(vt.userAgent), da = !!(zm || Dh || Gh), Op = !da && /* @__PURE__ */ /gecko\/(\d+)/i.test(vt.userAgent), HO = !da && /* @__PURE__ */ /Chrome\/(\d+)/.exec(vt.userAgent), hp = "webkitFontSmoothing" in Mh.documentElement.style, Em = !da && /* @__PURE__ */ /Apple Computer/.test(vt.vendor), cp = Em && (/* @__PURE__ */ /Mobile\/\w+/.test(vt.userAgent) || vt.maxTouchPoints > 2);
var B = {
  mac: cp || /* @__PURE__ */ /Mac/.test(vt.platform),
  windows: /* @__PURE__ */ /Win/.test(vt.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(vt.platform),
  ie: da,
  ie_version: zm ? Mh.documentMode || 6 : Dh ? +Dh[1] : Gh ? +Gh[1] : 0,
  gecko: Op,
  gecko_version: Op ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(vt.userAgent) || [0, 0])[1] : 0,
  chrome: !!HO,
  chrome_version: HO ? +HO[1] : 0,
  ios: cp,
  android: /* @__PURE__ */ /Android\b/.test(vt.userAgent),
  webkit: hp,
  safari: Em,
  webkit_version: hp ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(vt.userAgent) || [0, 0])[1] : 0,
  tabSize: Mh.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
const Zk = 256;
class Oi extends ve {
  constructor(e) {
    super(), this.text = e;
  }
  get length() {
    return this.text.length;
  }
  createDOM(e) {
    this.setDOM(e || document.createTextNode(this.text));
  }
  sync(e, t) {
    this.dom || this.createDOM(), this.dom.nodeValue != this.text && (t && t.node == this.dom && (t.written = !0), this.dom.nodeValue = this.text);
  }
  reuseDOM(e) {
    e.nodeType == 3 && this.createDOM(e);
  }
  merge(e, t, i) {
    return this.flags & 8 || i && (!(i instanceof Oi) || this.length - (t - e) + i.length > Zk || i.flags & 8) ? !1 : (this.text = this.text.slice(0, e) + (i ? i.text : "") + this.text.slice(t), this.markDirty(), !0);
  }
  split(e) {
    let t = new Oi(this.text.slice(e));
    return this.text = this.text.slice(0, e), this.markDirty(), t.flags |= this.flags & 8, t;
  }
  localPosFromDOM(e, t) {
    return e == this.dom ? t : t ? this.text.length : 0;
  }
  domAtPos(e) {
    return new ft(this.dom, e);
  }
  domBoundsAround(e, t, i) {
    return { from: i, to: i + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(e, t) {
    return Rk(this.dom, e, t);
  }
}
class Fi extends ve {
  constructor(e, t = [], i = 0) {
    super(), this.mark = e, this.children = t, this.length = i;
    for (let r of t)
      r.setParent(this);
  }
  setAttrs(e) {
    if (qm(e), this.mark.class && (e.className = this.mark.class), this.mark.attrs)
      for (let t in this.mark.attrs)
        e.setAttribute(t, this.mark.attrs[t]);
    return e;
  }
  canReuseDOM(e) {
    return super.canReuseDOM(e) && !((this.flags | e.flags) & 8);
  }
  reuseDOM(e) {
    e.nodeName == this.mark.tagName.toUpperCase() && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    this.dom ? this.flags & 4 && this.setAttrs(this.dom) : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))), super.sync(e, t);
  }
  merge(e, t, i, r, s, l) {
    return i && (!(i instanceof Fi && i.mark.eq(this.mark)) || e && s <= 0 || t < this.length && l <= 0) ? !1 : (Vm(this, e, t, i ? i.children.slice() : [], s - 1, l - 1), this.markDirty(), !0);
  }
  split(e) {
    let t = [], i = 0, r = -1, s = 0;
    for (let O of this.children) {
      let h = i + O.length;
      h > e && t.push(i < e ? O.split(e - i) : O), r < 0 && i >= e && (r = s), i = h, s++;
    }
    let l = this.length - e;
    return this.length = e, r > -1 && (this.children.length = r, this.markDirty()), new Fi(this.mark, t, l);
  }
  domAtPos(e) {
    return Mm(this, e);
  }
  coordsAt(e, t) {
    return Dm(this, e, t);
  }
}
function Rk(n, e, t) {
  let i = n.nodeValue.length;
  e > i && (e = i);
  let r = e, s = e, l = 0;
  e == 0 && t < 0 || e == i && t >= 0 ? B.chrome || B.gecko || (e ? (r--, l = 1) : s < i && (s++, l = -1)) : t < 0 ? r-- : s < i && s++;
  let O = Kn(n, r, s).getClientRects();
  if (!O.length)
    return null;
  let h = O[(l ? l < 0 : t >= 0) ? 0 : O.length - 1];
  return B.safari && !l && h.width == 0 && (h = Array.prototype.find.call(O, (f) => f.width) || h), l ? ua(h, l < 0) : h || null;
}
class pn extends ve {
  static create(e, t, i) {
    return new pn(e, t, i);
  }
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.side = i, this.prevWidget = null;
  }
  split(e) {
    let t = pn.create(this.widget, this.length - e, this.side);
    return this.length -= e, t;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  getSide() {
    return this.side;
  }
  merge(e, t, i, r, s, l) {
    return i && (!(i instanceof pn) || !this.widget.compare(i.widget) || e > 0 && s <= 0 || t < this.length && l <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  become(e) {
    return e instanceof pn && e.side == this.side && this.widget.constructor == e.widget.constructor ? (this.widget.compare(e.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get overrideDOMText() {
    if (this.length == 0)
      return Pe.empty;
    let e = this;
    for (; e.parent; )
      e = e.parent;
    let { view: t } = e, i = t && t.state.doc, r = this.posAtStart;
    return i ? i.slice(r, r + this.length) : Pe.empty;
  }
  domAtPos(e) {
    return (this.length ? e == 0 : this.side > 0) ? ft.before(this.dom) : ft.after(this.dom, e == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e, t) {
    let i = this.widget.coordsAt(this.dom, e, t);
    if (i)
      return i;
    let r = this.dom.getClientRects(), s = null;
    if (!r.length)
      return null;
    let l = this.side ? this.side < 0 : e > 0;
    for (let O = l ? r.length - 1 : 0; s = r[O], !(e > 0 ? O == 0 : O == r.length - 1 || s.top < s.bottom); O += l ? -1 : 1)
      ;
    return ua(s, !l);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class Wr extends ve {
  constructor(e) {
    super(), this.side = e;
  }
  get length() {
    return 0;
  }
  merge() {
    return !1;
  }
  become(e) {
    return e instanceof Wr && e.side == this.side;
  }
  split() {
    return new Wr(this.side);
  }
  sync() {
    if (!this.dom) {
      let e = document.createElement("img");
      e.className = "cm-widgetBuffer", e.setAttribute("aria-hidden", "true"), this.setDOM(e);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(e) {
    return this.side > 0 ? ft.before(this.dom) : ft.after(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e) {
    return this.dom.getBoundingClientRect();
  }
  get overrideDOMText() {
    return Pe.empty;
  }
  get isHidden() {
    return !0;
  }
}
Oi.prototype.children = pn.prototype.children = Wr.prototype.children = Cc;
function Mm(n, e) {
  let t = n.dom, { children: i } = n, r = 0;
  for (let s = 0; r < i.length; r++) {
    let l = i[r], O = s + l.length;
    if (!(O == s && l.getSide() <= 0)) {
      if (e > s && e < O && l.dom.parentNode == t)
        return l.domAtPos(e - s);
      if (e <= s)
        break;
      s = O;
    }
  }
  for (let s = r; s > 0; s--) {
    let l = i[s - 1];
    if (l.dom.parentNode == t)
      return l.domAtPos(l.length);
  }
  for (let s = r; s < i.length; s++) {
    let l = i[s];
    if (l.dom.parentNode == t)
      return l.domAtPos(0);
  }
  return new ft(t, 0);
}
function Gm(n, e, t) {
  let i, { children: r } = n;
  t > 0 && e instanceof Fi && r.length && (i = r[r.length - 1]) instanceof Fi && i.mark.eq(e.mark) ? Gm(i, e.children[0], t - 1) : (r.push(e), e.setParent(n)), n.length += e.length;
}
function Dm(n, e, t) {
  let i = null, r = -1, s = null, l = -1;
  function O(f, u) {
    for (let d = 0, g = 0; d < f.children.length && g <= u; d++) {
      let Q = f.children[d], b = g + Q.length;
      b >= u && (Q.children.length ? O(Q, u - g) : (!s || s.isHidden && t > 0) && (b > u || g == b && Q.getSide() > 0) ? (s = Q, l = u - g) : (g < u || g == b && Q.getSide() < 0 && !Q.isHidden) && (i = Q, r = u - g)), g = b;
    }
  }
  O(n, e);
  let h = (t < 0 ? i : s) || i || s;
  return h ? h.coordsAt(Math.max(0, h == i ? r : l), t) : _k(n);
}
function _k(n) {
  let e = n.dom.lastChild;
  if (!e)
    return n.dom.getBoundingClientRect();
  let t = Cr(e);
  return t[t.length - 1] || null;
}
function Ih(n, e) {
  for (let t in n)
    t == "class" && e.class ? e.class += " " + n.class : t == "style" && e.style ? e.style += ";" + n.style : e[t] = n[t];
  return e;
}
const fp = /* @__PURE__ */ Object.create(null);
function Gl(n, e, t) {
  if (n == e)
    return !0;
  n || (n = fp), e || (e = fp);
  let i = Object.keys(n), r = Object.keys(e);
  if (i.length - (t && i.indexOf(t) > -1 ? 1 : 0) != r.length - (t && r.indexOf(t) > -1 ? 1 : 0))
    return !1;
  for (let s of i)
    if (s != t && (r.indexOf(s) == -1 || n[s] !== e[s]))
      return !1;
  return !0;
}
function Lh(n, e, t) {
  let i = !1;
  if (e)
    for (let r in e)
      t && r in t || (i = !0, r == "style" ? n.style.cssText = "" : n.removeAttribute(r));
  if (t)
    for (let r in t)
      e && e[r] == t[r] || (i = !0, r == "style" ? n.style.cssText = t[r] : n.setAttribute(r, t[r]));
  return i;
}
function Xk(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t = 0; t < n.attributes.length; t++) {
    let i = n.attributes[t];
    e[i.name] = i.value;
  }
  return e;
}
class Ie extends ve {
  constructor() {
    super(...arguments), this.children = [], this.length = 0, this.prevAttrs = void 0, this.attrs = null, this.breakAfter = 0;
  }
  // Consumes source
  merge(e, t, i, r, s, l) {
    if (i) {
      if (!(i instanceof Ie))
        return !1;
      this.dom || i.transferDOM(this);
    }
    return r && this.setDeco(i ? i.attrs : null), Vm(this, e, t, i ? i.children.slice() : [], s, l), !0;
  }
  split(e) {
    let t = new Ie();
    if (t.breakAfter = this.breakAfter, this.length == 0)
      return t;
    let { i, off: r } = this.childPos(e);
    r && (t.append(this.children[i].split(r), 0), this.children[i].merge(r, this.children[i].length, null, !1, 0, 0), i++);
    for (let s = i; s < this.children.length; s++)
      t.append(this.children[s], 0);
    for (; i > 0 && this.children[i - 1].length == 0; )
      this.children[--i].destroy();
    return this.children.length = i, this.markDirty(), this.length = e, t;
  }
  transferDOM(e) {
    this.dom && (this.markDirty(), e.setDOM(this.dom), e.prevAttrs = this.prevAttrs === void 0 ? this.attrs : this.prevAttrs, this.prevAttrs = void 0, this.dom = null);
  }
  setDeco(e) {
    Gl(this.attrs, e) || (this.dom && (this.prevAttrs = this.attrs, this.markDirty()), this.attrs = e);
  }
  append(e, t) {
    Gm(this, e, t);
  }
  // Only called when building a line view in ContentBuilder
  addLineDeco(e) {
    let t = e.spec.attributes, i = e.spec.class;
    t && (this.attrs = Ih(t, this.attrs || {})), i && (this.attrs = Ih({ class: i }, this.attrs || {}));
  }
  domAtPos(e) {
    return Mm(this, e);
  }
  reuseDOM(e) {
    e.nodeName == "DIV" && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    var i;
    this.dom ? this.flags & 4 && (qm(this.dom), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0) : (this.setDOM(document.createElement("div")), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0), this.prevAttrs !== void 0 && (Lh(this.dom, this.prevAttrs, this.attrs), this.dom.classList.add("cm-line"), this.prevAttrs = void 0), super.sync(e, t);
    let r = this.dom.lastChild;
    for (; r && ve.get(r) instanceof Fi; )
      r = r.lastChild;
    if (!r || !this.length || r.nodeName != "BR" && ((i = ve.get(r)) === null || i === void 0 ? void 0 : i.isEditable) == !1 && (!B.ios || !this.children.some((s) => s instanceof Oi))) {
      let s = document.createElement("BR");
      s.cmIgnore = !0, this.dom.appendChild(s);
    }
  }
  measureTextSize() {
    if (this.children.length == 0 || this.length > 20)
      return null;
    let e = 0, t;
    for (let i of this.children) {
      if (!(i instanceof Oi) || /[^ -~]/.test(i.text))
        return null;
      let r = Cr(i.dom);
      if (r.length != 1)
        return null;
      e += r[0].width, t = r[0].height;
    }
    return e ? {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: e / this.length,
      textHeight: t
    } : null;
  }
  coordsAt(e, t) {
    let i = Dm(this, e, t);
    if (!this.children.length && i && this.parent) {
      let { heightOracle: r } = this.parent.view.viewState, s = i.bottom - i.top;
      if (Math.abs(s - r.lineHeight) < 2 && r.textHeight < s) {
        let l = (s - r.textHeight) / 2;
        return { top: i.top + l, bottom: i.bottom - l, left: i.left, right: i.left };
      }
    }
    return i;
  }
  become(e) {
    return e instanceof Ie && this.children.length == 0 && e.children.length == 0 && Gl(this.attrs, e.attrs) && this.breakAfter == e.breakAfter;
  }
  covers() {
    return !0;
  }
  static find(e, t) {
    for (let i = 0, r = 0; i < e.children.length; i++) {
      let s = e.children[i], l = r + s.length;
      if (l >= t) {
        if (s instanceof Ie)
          return s;
        if (l > t)
          break;
      }
      r = l + s.breakAfter;
    }
    return null;
  }
}
class Bi extends ve {
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.deco = i, this.breakAfter = 0, this.prevWidget = null;
  }
  merge(e, t, i, r, s, l) {
    return i && (!(i instanceof Bi) || !this.widget.compare(i.widget) || e > 0 && s <= 0 || t < this.length && l <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  domAtPos(e) {
    return e == 0 ? ft.before(this.dom) : ft.after(this.dom, e == this.length);
  }
  split(e) {
    let t = this.length - e;
    this.length = e;
    let i = new Bi(this.widget, t, this.deco);
    return i.breakAfter = this.breakAfter, i;
  }
  get children() {
    return Cc;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : Pe.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(e) {
    return e instanceof Bi && e.widget.constructor == this.widget.constructor ? (e.widget.compare(this.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, this.deco = e.deco, this.breakAfter = e.breakAfter, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  coordsAt(e, t) {
    return this.widget.coordsAt(this.dom, e, t);
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
  covers(e) {
    let { startSide: t, endSide: i } = this.deco;
    return t == i ? !1 : e < 0 ? t < 0 : i > 0;
  }
}
class Zi {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, t) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, t, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var Qt = /* @__PURE__ */ function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
}(Qt || (Qt = {}));
class H extends Hn {
  constructor(e, t, i, r) {
    super(), this.startSide = e, this.endSide = t, this.widget = i, this.spec = r;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new Ks(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), i = !!e.block;
    return t += i && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new yn(e, t, t, i, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let t = !!e.block, i, r;
    if (e.isBlockGap)
      i = -5e8, r = 4e8;
    else {
      let { start: s, end: l } = Im(e, t);
      i = (s ? t ? -3e8 : -1 : 5e8) - 1, r = (l ? t ? 2e8 : 1 : -6e8) + 1;
    }
    return new yn(e, i, r, t, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new eo(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, t = !1) {
    return Qe.of(e, t);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
H.none = Qe.empty;
class Ks extends H {
  constructor(e) {
    let { start: t, end: i } = Im(e);
    super(t ? -1 : 5e8, i ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.class = e.class || "", this.attrs = e.attributes || null;
  }
  eq(e) {
    var t, i;
    return this == e || e instanceof Ks && this.tagName == e.tagName && (this.class || ((t = this.attrs) === null || t === void 0 ? void 0 : t.class)) == (e.class || ((i = e.attrs) === null || i === void 0 ? void 0 : i.class)) && Gl(this.attrs, e.attrs, "class");
  }
  range(e, t = e) {
    if (e >= t)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, t);
  }
}
Ks.prototype.point = !1;
class eo extends H {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof eo && this.spec.class == e.spec.class && Gl(this.spec.attributes, e.spec.attributes);
  }
  range(e, t = e) {
    if (t != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, t);
  }
}
eo.prototype.mapMode = ot.TrackBefore;
eo.prototype.point = !0;
class yn extends H {
  constructor(e, t, i, r, s, l) {
    super(t, i, s, e), this.block = r, this.isReplace = l, this.mapMode = r ? t <= 0 ? ot.TrackBefore : ot.TrackAfter : ot.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? Qt.WidgetRange : this.startSide <= 0 ? Qt.WidgetBefore : Qt.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof yn && qk(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, t = e) {
    if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && t != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, t);
  }
}
yn.prototype.point = !0;
function Im(n, e = !1) {
  let { inclusiveStart: t, inclusiveEnd: i } = n;
  return t == null && (t = n.inclusive), i == null && (i = n.inclusive), { start: t ?? e, end: i ?? e };
}
function qk(n, e) {
  return n == e || !!(n && e && n.compare(e));
}
function Bh(n, e, t, i = 0) {
  let r = t.length - 1;
  r >= 0 && t[r] + i >= n ? t[r] = Math.max(t[r], e) : t.push(n, e);
}
class qs {
  constructor(e, t, i, r) {
    this.doc = e, this.pos = t, this.end = i, this.disallowBlockEffectsFor = r, this.content = [], this.curLine = null, this.breakAtStart = 0, this.pendingBuffer = 0, this.bufferMarks = [], this.atCursorPos = !0, this.openStart = -1, this.openEnd = -1, this.text = "", this.textOff = 0, this.cursor = e.iter(), this.skip = t;
  }
  posCovered() {
    if (this.content.length == 0)
      return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let e = this.content[this.content.length - 1];
    return !(e.breakAfter || e instanceof Bi && e.deco.endSide < 0);
  }
  getLine() {
    return this.curLine || (this.content.push(this.curLine = new Ie()), this.atCursorPos = !0), this.curLine;
  }
  flushBuffer(e = this.bufferMarks) {
    this.pendingBuffer && (this.curLine.append(rl(new Wr(-1), e), e.length), this.pendingBuffer = 0);
  }
  addBlockWidget(e) {
    this.flushBuffer(), this.curLine = null, this.content.push(e);
  }
  finish(e) {
    this.pendingBuffer && e <= this.bufferMarks.length ? this.flushBuffer() : this.pendingBuffer = 0, !this.posCovered() && !(e && this.content.length && this.content[this.content.length - 1] instanceof Bi) && this.getLine();
  }
  buildText(e, t, i) {
    for (; e > 0; ) {
      if (this.textOff == this.text.length) {
        let { value: s, lineBreak: l, done: O } = this.cursor.next(this.skip);
        if (this.skip = 0, O)
          throw new Error("Ran out of text content when drawing inline views");
        if (l) {
          this.posCovered() || this.getLine(), this.content.length ? this.content[this.content.length - 1].breakAfter = 1 : this.breakAtStart = 1, this.flushBuffer(), this.curLine = null, this.atCursorPos = !0, e--;
          continue;
        } else
          this.text = s, this.textOff = 0;
      }
      let r = Math.min(
        this.text.length - this.textOff,
        e,
        512
        /* T.Chunk */
      );
      this.flushBuffer(t.slice(t.length - i)), this.getLine().append(rl(new Oi(this.text.slice(this.textOff, this.textOff + r)), t), i), this.atCursorPos = !0, this.textOff += r, e -= r, i = 0;
    }
  }
  span(e, t, i, r) {
    this.buildText(t - e, i, r), this.pos = t, this.openStart < 0 && (this.openStart = r);
  }
  point(e, t, i, r, s, l) {
    if (this.disallowBlockEffectsFor[l] && i instanceof yn) {
      if (i.block)
        throw new RangeError("Block decorations may not be specified via plugins");
      if (t > this.doc.lineAt(this.pos).to)
        throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
    }
    let O = t - e;
    if (i instanceof yn)
      if (i.block)
        i.startSide > 0 && !this.posCovered() && this.getLine(), this.addBlockWidget(new Bi(i.widget || Yr.block, O, i));
      else {
        let h = pn.create(i.widget || Yr.inline, O, O ? 0 : i.startSide), f = this.atCursorPos && !h.isEditable && s <= r.length && (e < t || i.startSide > 0), u = !h.isEditable && (e < t || s > r.length || i.startSide <= 0), d = this.getLine();
        this.pendingBuffer == 2 && !f && !h.isEditable && (this.pendingBuffer = 0), this.flushBuffer(r), f && (d.append(rl(new Wr(1), r), s), s = r.length + Math.max(0, s - r.length)), d.append(rl(h, r), s), this.atCursorPos = u, this.pendingBuffer = u ? e < t || s > r.length ? 1 : 2 : 0, this.pendingBuffer && (this.bufferMarks = r.slice());
      }
    else this.doc.lineAt(this.pos).from == this.pos && this.getLine().addLineDeco(i);
    O && (this.textOff + O <= this.text.length ? this.textOff += O : (this.skip += O - (this.text.length - this.textOff), this.text = "", this.textOff = 0), this.pos = t), this.openStart < 0 && (this.openStart = s);
  }
  static build(e, t, i, r, s) {
    let l = new qs(e, t, i, s);
    return l.openEnd = Qe.spans(r, t, i, l), l.openStart < 0 && (l.openStart = l.openEnd), l.finish(l.openEnd), l;
  }
}
function rl(n, e) {
  for (let t of e)
    n = new Fi(t, [n], n.length);
  return n;
}
class Yr extends Zi {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
Yr.inline = /* @__PURE__ */ new Yr("span");
Yr.block = /* @__PURE__ */ new Yr("div");
var Re = /* @__PURE__ */ function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
}(Re || (Re = {}));
const er = Re.LTR, Wc = Re.RTL;
function Lm(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    e.push(1 << +n[t]);
  return e;
}
const Ck = /* @__PURE__ */ Lm("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), Wk = /* @__PURE__ */ Lm("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), jh = /* @__PURE__ */ Object.create(null), gi = [];
for (let n of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ n.charCodeAt(0), t = /* @__PURE__ */ n.charCodeAt(1);
  jh[e] = t, jh[t] = -e;
}
function Bm(n) {
  return n <= 247 ? Ck[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? Wk[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8204 ? 256 : 64336 <= n && n <= 65023 ? 4 : 1;
}
const Yk = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class gn {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Wc : er;
  }
  /**
  @internal
  */
  constructor(e, t, i) {
    this.from = e, this.to = t, this.level = i;
  }
  /**
  @internal
  */
  side(e, t) {
    return this.dir == t == e ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(e, t) {
    return e == (this.dir == t);
  }
  /**
  @internal
  */
  static find(e, t, i, r) {
    let s = -1;
    for (let l = 0; l < e.length; l++) {
      let O = e[l];
      if (O.from <= t && O.to >= t) {
        if (O.level == i)
          return l;
        (s < 0 || (r != 0 ? r < 0 ? O.from < t : O.to > t : e[s].level > O.level)) && (s = l);
      }
    }
    if (s < 0)
      throw new RangeError("Index out of range");
    return s;
  }
}
function jm(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++) {
    let i = n[t], r = e[t];
    if (i.from != r.from || i.to != r.to || i.direction != r.direction || !jm(i.inner, r.inner))
      return !1;
  }
  return !0;
}
const xe = [];
function Ak(n, e, t, i, r) {
  for (let s = 0; s <= i.length; s++) {
    let l = s ? i[s - 1].to : e, O = s < i.length ? i[s].from : t, h = s ? 256 : r;
    for (let f = l, u = h, d = h; f < O; f++) {
      let g = Bm(n.charCodeAt(f));
      g == 512 ? g = u : g == 8 && d == 4 && (g = 16), xe[f] = g == 4 ? 2 : g, g & 7 && (d = g), u = g;
    }
    for (let f = l, u = h, d = h; f < O; f++) {
      let g = xe[f];
      if (g == 128)
        f < O - 1 && u == xe[f + 1] && u & 24 ? g = xe[f] = u : xe[f] = 256;
      else if (g == 64) {
        let Q = f + 1;
        for (; Q < O && xe[Q] == 64; )
          Q++;
        let b = f && u == 8 || Q < t && xe[Q] == 8 ? d == 1 ? 1 : 8 : 256;
        for (let v = f; v < Q; v++)
          xe[v] = b;
        f = Q - 1;
      } else g == 8 && d == 1 && (xe[f] = 1);
      u = g, g & 7 && (d = g);
    }
  }
}
function Uk(n, e, t, i, r) {
  let s = r == 1 ? 2 : 1;
  for (let l = 0, O = 0, h = 0; l <= i.length; l++) {
    let f = l ? i[l - 1].to : e, u = l < i.length ? i[l].from : t;
    for (let d = f, g, Q, b; d < u; d++)
      if (Q = jh[g = n.charCodeAt(d)])
        if (Q < 0) {
          for (let v = O - 3; v >= 0; v -= 3)
            if (gi[v + 1] == -Q) {
              let w = gi[v + 2], Z = w & 2 ? r : w & 4 ? w & 1 ? s : r : 0;
              Z && (xe[d] = xe[gi[v]] = Z), O = v;
              break;
            }
        } else {
          if (gi.length == 189)
            break;
          gi[O++] = d, gi[O++] = g, gi[O++] = h;
        }
      else if ((b = xe[d]) == 2 || b == 1) {
        let v = b == r;
        h = v ? 0 : 1;
        for (let w = O - 3; w >= 0; w -= 3) {
          let Z = gi[w + 2];
          if (Z & 2)
            break;
          if (v)
            gi[w + 2] |= 2;
          else {
            if (Z & 4)
              break;
            gi[w + 2] |= 4;
          }
        }
      }
  }
}
function Vk(n, e, t, i) {
  for (let r = 0, s = i; r <= t.length; r++) {
    let l = r ? t[r - 1].to : n, O = r < t.length ? t[r].from : e;
    for (let h = l; h < O; ) {
      let f = xe[h];
      if (f == 256) {
        let u = h + 1;
        for (; ; )
          if (u == O) {
            if (r == t.length)
              break;
            u = t[r++].to, O = r < t.length ? t[r].from : e;
          } else if (xe[u] == 256)
            u++;
          else
            break;
        let d = s == 1, g = (u < e ? xe[u] : i) == 1, Q = d == g ? d ? 1 : 2 : i;
        for (let b = u, v = r, w = v ? t[v - 1].to : n; b > h; )
          b == w && (b = t[--v].from, w = v ? t[v - 1].to : n), xe[--b] = Q;
        h = u;
      } else
        s = f, h++;
    }
  }
}
function Nh(n, e, t, i, r, s, l) {
  let O = i % 2 ? 2 : 1;
  if (i % 2 == r % 2)
    for (let h = e, f = 0; h < t; ) {
      let u = !0, d = !1;
      if (f == s.length || h < s[f].from) {
        let v = xe[h];
        v != O && (u = !1, d = v == 16);
      }
      let g = !u && O == 1 ? [] : null, Q = u ? i : i + 1, b = h;
      e: for (; ; )
        if (f < s.length && b == s[f].from) {
          if (d)
            break e;
          let v = s[f];
          if (!u)
            for (let w = v.to, Z = f + 1; ; ) {
              if (w == t)
                break e;
              if (Z < s.length && s[Z].from == w)
                w = s[Z++].to;
              else {
                if (xe[w] == O)
                  break e;
                break;
              }
            }
          if (f++, g)
            g.push(v);
          else {
            v.from > h && l.push(new gn(h, v.from, Q));
            let w = v.direction == er != !(Q % 2);
            Fh(n, w ? i + 1 : i, r, v.inner, v.from, v.to, l), h = v.to;
          }
          b = v.to;
        } else {
          if (b == t || (u ? xe[b] != O : xe[b] == O))
            break;
          b++;
        }
      g ? Nh(n, h, b, i + 1, r, g, l) : h < b && l.push(new gn(h, b, Q)), h = b;
    }
  else
    for (let h = t, f = s.length; h > e; ) {
      let u = !0, d = !1;
      if (!f || h > s[f - 1].to) {
        let v = xe[h - 1];
        v != O && (u = !1, d = v == 16);
      }
      let g = !u && O == 1 ? [] : null, Q = u ? i : i + 1, b = h;
      e: for (; ; )
        if (f && b == s[f - 1].to) {
          if (d)
            break e;
          let v = s[--f];
          if (!u)
            for (let w = v.from, Z = f; ; ) {
              if (w == e)
                break e;
              if (Z && s[Z - 1].to == w)
                w = s[--Z].from;
              else {
                if (xe[w - 1] == O)
                  break e;
                break;
              }
            }
          if (g)
            g.push(v);
          else {
            v.to < h && l.push(new gn(v.to, h, Q));
            let w = v.direction == er != !(Q % 2);
            Fh(n, w ? i + 1 : i, r, v.inner, v.from, v.to, l), h = v.from;
          }
          b = v.from;
        } else {
          if (b == e || (u ? xe[b - 1] != O : xe[b - 1] == O))
            break;
          b--;
        }
      g ? Nh(n, b, h, i + 1, r, g, l) : b < h && l.push(new gn(b, h, Q)), h = b;
    }
}
function Fh(n, e, t, i, r, s, l) {
  let O = e % 2 ? 2 : 1;
  Ak(n, r, s, i, O), Uk(n, r, s, i, O), Vk(r, s, i, O), Nh(n, r, s, e, t, i, l);
}
function zk(n, e, t) {
  if (!n)
    return [new gn(0, 0, e == Wc ? 1 : 0)];
  if (e == er && !t.length && !Yk.test(n))
    return Nm(n.length);
  if (t.length)
    for (; n.length > xe.length; )
      xe[xe.length] = 256;
  let i = [], r = e == er ? 0 : 1;
  return Fh(n, r, r, t, 0, n.length, i), i;
}
function Nm(n) {
  return [new gn(0, n, 0)];
}
let Fm = "";
function Ek(n, e, t, i, r) {
  var s;
  let l = i.head - n.from, O = gn.find(e, l, (s = i.bidiLevel) !== null && s !== void 0 ? s : -1, i.assoc), h = e[O], f = h.side(r, t);
  if (l == f) {
    let g = O += r ? 1 : -1;
    if (g < 0 || g >= e.length)
      return null;
    h = e[O = g], l = h.side(!r, t), f = h.side(r, t);
  }
  let u = at(n.text, l, h.forward(r, t));
  (u < h.from || u > h.to) && (u = f), Fm = n.text.slice(Math.min(l, u), Math.max(l, u));
  let d = O == (r ? e.length - 1 : 0) ? null : e[O + (r ? 1 : -1)];
  return d && u == f && d.level + (r ? 0 : 1) < h.level ? X.cursor(d.side(!r, t) + n.from, d.forward(r, t) ? 1 : -1, d.level) : X.cursor(u + n.from, h.forward(r, t) ? -1 : 1, h.level);
}
function Mk(n, e, t) {
  for (let i = e; i < t; i++) {
    let r = Bm(n.charCodeAt(i));
    if (r == 1)
      return er;
    if (r == 2 || r == 4)
      return Wc;
  }
  return er;
}
const Hm = /* @__PURE__ */ j.define(), Jm = /* @__PURE__ */ j.define(), Km = /* @__PURE__ */ j.define(), eQ = /* @__PURE__ */ j.define(), Hh = /* @__PURE__ */ j.define(), tQ = /* @__PURE__ */ j.define(), iQ = /* @__PURE__ */ j.define(), nQ = /* @__PURE__ */ j.define({
  combine: (n) => n.some((e) => e)
}), rQ = /* @__PURE__ */ j.define({
  combine: (n) => n.some((e) => e)
}), sQ = /* @__PURE__ */ j.define();
class Tr {
  constructor(e, t = "nearest", i = "nearest", r = 5, s = 5, l = !1) {
    this.range = e, this.y = t, this.x = i, this.yMargin = r, this.xMargin = s, this.isSnapshot = l;
  }
  map(e) {
    return e.empty ? this : new Tr(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new Tr(X.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const sl = /* @__PURE__ */ ie.define({ map: (n, e) => n.map(e) }), oQ = /* @__PURE__ */ ie.define();
function mt(n, e, t) {
  let i = n.facet(eQ);
  i.length ? i[0](e) : window.onerror ? window.onerror(String(e), t, void 0, void 0, e) : t ? console.error(t + ":", e) : console.error(e);
}
const fn = /* @__PURE__ */ j.define({ combine: (n) => n.length ? n[0] : !0 });
let Gk = 0;
const xs = /* @__PURE__ */ j.define();
class ze {
  constructor(e, t, i, r, s) {
    this.id = e, this.create = t, this.domEventHandlers = i, this.domEventObservers = r, this.extension = s(this);
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, t) {
    const { eventHandlers: i, eventObservers: r, provide: s, decorations: l } = t || {};
    return new ze(Gk++, e, i, r, (O) => {
      let h = [xs.of(O)];
      return l && h.push(zs.of((f) => {
        let u = f.plugin(O);
        return u ? l(u) : H.none;
      })), s && h.push(s(O)), h;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, t) {
    return ze.define((i) => new e(i), t);
  }
}
class JO {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(t);
          } catch (i) {
            if (mt(t.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.create(e);
      } catch (t) {
        mt(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var t;
    if (!((t = this.value) === null || t === void 0) && t.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        mt(e.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const lQ = /* @__PURE__ */ j.define(), Yc = /* @__PURE__ */ j.define(), zs = /* @__PURE__ */ j.define(), aQ = /* @__PURE__ */ j.define(), Ac = /* @__PURE__ */ j.define(), OQ = /* @__PURE__ */ j.define();
function up(n, e) {
  let t = n.state.facet(OQ);
  if (!t.length)
    return t;
  let i = t.map((s) => s instanceof Function ? s(n) : s), r = [];
  return Qe.spans(i, e.from, e.to, {
    point() {
    },
    span(s, l, O, h) {
      let f = s - e.from, u = l - e.from, d = r;
      for (let g = O.length - 1; g >= 0; g--, h--) {
        let Q = O[g].spec.bidiIsolate, b;
        if (Q == null && (Q = Mk(e.text, f, u)), h > 0 && d.length && (b = d[d.length - 1]).to == f && b.direction == Q)
          b.to = u, d = b.inner;
        else {
          let v = { from: f, to: u, direction: Q, inner: [] };
          d.push(v), d = v.inner;
        }
      }
    }
  }), r;
}
const hQ = /* @__PURE__ */ j.define();
function cQ(n) {
  let e = 0, t = 0, i = 0, r = 0;
  for (let s of n.state.facet(hQ)) {
    let l = s(n);
    l && (l.left != null && (e = Math.max(e, l.left)), l.right != null && (t = Math.max(t, l.right)), l.top != null && (i = Math.max(i, l.top)), l.bottom != null && (r = Math.max(r, l.bottom)));
  }
  return { left: e, right: t, top: i, bottom: r };
}
const vs = /* @__PURE__ */ j.define();
class Jt {
  constructor(e, t, i, r) {
    this.fromA = e, this.toA = t, this.fromB = i, this.toB = r;
  }
  join(e) {
    return new Jt(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let t = e.length, i = this;
    for (; t > 0; t--) {
      let r = e[t - 1];
      if (!(r.fromA > i.toA)) {
        if (r.toA < i.fromA)
          break;
        i = i.join(r), e.splice(t - 1, 1);
      }
    }
    return e.splice(t, 0, i), e;
  }
  static extendWithRanges(e, t) {
    if (t.length == 0)
      return e;
    let i = [];
    for (let r = 0, s = 0, l = 0, O = 0; ; r++) {
      let h = r == e.length ? null : e[r], f = l - O, u = h ? h.fromB : 1e9;
      for (; s < t.length && t[s] < u; ) {
        let d = t[s], g = t[s + 1], Q = Math.max(O, d), b = Math.min(u, g);
        if (Q <= b && new Jt(Q + f, b + f, Q, b).addToSet(i), g > u)
          break;
        s += 2;
      }
      if (!h)
        return i;
      new Jt(h.fromA, h.toA, h.fromB, h.toB).addToSet(i), l = h.toA, O = h.toB;
    }
  }
}
class Dl {
  constructor(e, t, i) {
    this.view = e, this.state = t, this.transactions = i, this.flags = 0, this.startState = e.state, this.changes = Ke.empty(this.startState.doc.length);
    for (let s of i)
      this.changes = this.changes.compose(s.changes);
    let r = [];
    this.changes.iterChangedRanges((s, l, O, h) => r.push(new Jt(s, l, O, h))), this.changedRanges = r;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Dl(e, t, i);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 10) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
class dp extends ve {
  get length() {
    return this.view.state.doc.length;
  }
  constructor(e) {
    super(), this.view = e, this.decorations = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.markedForComposition = /* @__PURE__ */ new Set(), this.editContextFormatting = H.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.setDOM(e.contentDOM), this.children = [new Ie()], this.children[0].setParent(this), this.updateDeco(), this.updateInner([new Jt(0, 0, 0, e.state.doc.length)], 0, null);
  }
  // Update the document view to a given state.
  update(e) {
    var t;
    let i = e.changedRanges;
    this.minWidth > 0 && i.length && (i.every(({ fromA: f, toA: u }) => u < this.minWidthFrom || f > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(e);
    let r = -1;
    this.view.inputState.composing >= 0 && !this.view.observer.editContext && (!((t = this.domChanged) === null || t === void 0) && t.newSel ? r = this.domChanged.newSel.head : !Fk(e.changes, this.hasComposition) && !e.selectionSet && (r = e.state.selection.main.head));
    let s = r > -1 ? Ik(this.view, e.changes, r) : null;
    if (this.domChanged = null, this.hasComposition) {
      this.markedForComposition.clear();
      let { from: f, to: u } = this.hasComposition;
      i = new Jt(f, u, e.changes.mapPos(f, -1), e.changes.mapPos(u, 1)).addToSet(i.slice());
    }
    this.hasComposition = s ? { from: s.range.fromB, to: s.range.toB } : null, (B.ie || B.chrome) && !s && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let l = this.decorations, O = this.updateDeco(), h = jk(l, O, e.changes);
    return i = Jt.extendWithRanges(i, h), !(this.flags & 7) && i.length == 0 ? !1 : (this.updateInner(i, e.startState.doc.length, s), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, t, i) {
    this.view.viewState.mustMeasureContent = !0, this.updateChildren(e, t, i);
    let { observer: r } = this.view;
    r.ignore(() => {
      this.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let l = B.chrome || B.ios ? { node: r.selectionRange.focusNode, written: !1 } : void 0;
      this.sync(this.view, l), this.flags &= -8, l && (l.written || r.selectionRange.focusNode != l.node) && (this.forceSelection = !0), this.dom.style.height = "";
    }), this.markedForComposition.forEach(
      (l) => l.flags &= -9
      /* ViewFlag.Composition */
    );
    let s = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let l of this.children)
        l instanceof Bi && l.widget instanceof pp && s.push(l.dom);
    r.updateGaps(s);
  }
  updateChildren(e, t, i) {
    let r = i ? i.range.addToSet(e.slice()) : e, s = this.childCursor(t);
    for (let l = r.length - 1; ; l--) {
      let O = l >= 0 ? r[l] : null;
      if (!O)
        break;
      let { fromA: h, toA: f, fromB: u, toB: d } = O, g, Q, b, v;
      if (i && i.range.fromB < d && i.range.toB > u) {
        let V = qs.build(this.view.state.doc, u, i.range.fromB, this.decorations, this.dynamicDecorationMap), W = qs.build(this.view.state.doc, i.range.toB, d, this.decorations, this.dynamicDecorationMap);
        Q = V.breakAtStart, b = V.openStart, v = W.openEnd;
        let M = this.compositionView(i);
        W.breakAtStart ? M.breakAfter = 1 : W.content.length && M.merge(M.length, M.length, W.content[0], !1, W.openStart, 0) && (M.breakAfter = W.content[0].breakAfter, W.content.shift()), V.content.length && M.merge(0, 0, V.content[V.content.length - 1], !0, 0, V.openEnd) && V.content.pop(), g = V.content.concat(M).concat(W.content);
      } else
        ({ content: g, breakAtStart: Q, openStart: b, openEnd: v } = qs.build(this.view.state.doc, u, d, this.decorations, this.dynamicDecorationMap));
      let { i: w, off: Z } = s.findPos(f, 1), { i: Y, off: U } = s.findPos(h, -1);
      Um(this, Y, U, w, Z, g, Q, b, v);
    }
    i && this.fixCompositionDOM(i);
  }
  updateEditContextFormatting(e) {
    this.editContextFormatting = this.editContextFormatting.map(e.changes);
    for (let t of e.transactions)
      for (let i of t.effects)
        i.is(oQ) && (this.editContextFormatting = i.value);
  }
  compositionView(e) {
    let t = new Oi(e.text.nodeValue);
    t.flags |= 8;
    for (let { deco: r } of e.marks)
      t = new Fi(r, [t], t.length);
    let i = new Ie();
    return i.append(t, 0), i;
  }
  fixCompositionDOM(e) {
    let t = (s, l) => {
      l.flags |= 8 | (l.children.some(
        (h) => h.flags & 7
        /* ViewFlag.Dirty */
      ) ? 1 : 0), this.markedForComposition.add(l);
      let O = ve.get(s);
      O && O != l && (O.dom = null), l.setDOM(s);
    }, i = this.childPos(e.range.fromB, 1), r = this.children[i.i];
    t(e.line, r);
    for (let s = e.marks.length - 1; s >= -1; s--)
      i = r.childPos(i.off, 1), r = r.children[i.i], t(s >= 0 ? e.marks[s].node : e.text, r);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, t = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let i = this.view.root.activeElement, r = i == this.dom, s = !r && kl(this.dom, this.view.observer.selectionRange) && !(i && this.dom.contains(i));
    if (!(r || t || s))
      return;
    let l = this.forceSelection;
    this.forceSelection = !1;
    let O = this.view.state.selection.main, h = this.moveToLine(this.domAtPos(O.anchor)), f = O.empty ? h : this.moveToLine(this.domAtPos(O.head));
    if (B.gecko && O.empty && !this.hasComposition && Dk(h)) {
      let d = document.createTextNode("");
      this.view.observer.ignore(() => h.node.insertBefore(d, h.node.childNodes[h.offset] || null)), h = f = new ft(d, 0), l = !0;
    }
    let u = this.view.observer.selectionRange;
    (l || !u.focusNode || (!Xs(h.node, h.offset, u.anchorNode, u.anchorOffset) || !Xs(f.node, f.offset, u.focusNode, u.focusOffset)) && !this.suppressWidgetCursorChange(u, O)) && (this.view.observer.ignore(() => {
      B.android && B.chrome && this.dom.contains(u.focusNode) && Nk(u.focusNode, this.dom) && (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
      let d = Vs(this.view.root);
      if (d) if (O.empty) {
        if (B.gecko) {
          let g = Lk(h.node, h.offset);
          if (g && g != 3) {
            let Q = (g == 1 ? Wm : Ym)(h.node, h.offset);
            Q && (h = new ft(Q.node, Q.offset));
          }
        }
        d.collapse(h.node, h.offset), O.bidiLevel != null && d.caretBidiLevel !== void 0 && (d.caretBidiLevel = O.bidiLevel);
      } else if (d.extend) {
        d.collapse(h.node, h.offset);
        try {
          d.extend(f.node, f.offset);
        } catch {
        }
      } else {
        let g = document.createRange();
        O.anchor > O.head && ([h, f] = [f, h]), g.setEnd(f.node, f.offset), g.setStart(h.node, h.offset), d.removeAllRanges(), d.addRange(g);
      }
      s && this.view.root.activeElement == this.dom && (this.dom.blur(), i && i.focus());
    }), this.view.observer.setSelectionRange(h, f)), this.impreciseAnchor = h.precise ? null : new ft(u.anchorNode, u.anchorOffset), this.impreciseHead = f.precise ? null : new ft(u.focusNode, u.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(e, t) {
    return this.hasComposition && t.empty && Xs(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, t = e.state.selection.main, i = Vs(e.root), { anchorNode: r, anchorOffset: s } = e.observer.selectionRange;
    if (!i || !t.empty || !t.assoc || !i.modify)
      return;
    let l = Ie.find(this, t.head);
    if (!l)
      return;
    let O = l.posAtStart;
    if (t.head == O || t.head == O + l.length)
      return;
    let h = this.coordsAt(t.head, -1), f = this.coordsAt(t.head, 1);
    if (!h || !f || h.bottom > f.top)
      return;
    let u = this.domAtPos(t.head + t.assoc);
    i.collapse(u.node, u.offset), i.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let d = e.observer.selectionRange;
    e.docView.posFromDOM(d.anchorNode, d.anchorOffset) != t.from && i.collapse(r, s);
  }
  // If a position is in/near a block widget, move it to a nearby text
  // line, since we don't want the cursor inside a block widget.
  moveToLine(e) {
    let t = this.dom, i;
    if (e.node != t)
      return e;
    for (let r = e.offset; !i && r < t.childNodes.length; r++) {
      let s = ve.get(t.childNodes[r]);
      s instanceof Ie && (i = s.domAtPos(0));
    }
    for (let r = e.offset - 1; !i && r >= 0; r--) {
      let s = ve.get(t.childNodes[r]);
      s instanceof Ie && (i = s.domAtPos(s.length));
    }
    return i ? new ft(i.node, i.offset, !0) : e;
  }
  nearest(e) {
    for (let t = e; t; ) {
      let i = ve.get(t);
      if (i && i.rootView == this)
        return i;
      t = t.parentNode;
    }
    return null;
  }
  posFromDOM(e, t) {
    let i = this.nearest(e);
    if (!i)
      throw new RangeError("Trying to find position for a DOM position outside of the document");
    return i.localPosFromDOM(e, t) + i.posAtStart;
  }
  domAtPos(e) {
    let { i: t, off: i } = this.childCursor().findPos(e, -1);
    for (; t < this.children.length - 1; ) {
      let r = this.children[t];
      if (i < r.length || r instanceof Ie)
        break;
      t++, i = 0;
    }
    return this.children[t].domAtPos(i);
  }
  coordsAt(e, t) {
    let i = null, r = 0;
    for (let s = this.length, l = this.children.length - 1; l >= 0; l--) {
      let O = this.children[l], h = s - O.breakAfter, f = h - O.length;
      if (h < e)
        break;
      if (f <= e && (f < e || O.covers(-1)) && (h > e || O.covers(1)) && (!i || O instanceof Ie && !(i instanceof Ie && t >= 0)))
        i = O, r = f;
      else if (i && f == e && h == e && O instanceof Bi && Math.abs(t) < 2) {
        if (O.deco.startSide < 0)
          break;
        l && (i = null);
      }
      s = f;
    }
    return i ? i.coordsAt(e - r, t) : null;
  }
  coordsForChar(e) {
    let { i: t, off: i } = this.childPos(e, 1), r = this.children[t];
    if (!(r instanceof Ie))
      return null;
    for (; r.children.length; ) {
      let { i: O, off: h } = r.childPos(i, 1);
      for (; ; O++) {
        if (O == r.children.length)
          return null;
        if ((r = r.children[O]).length)
          break;
      }
      i = h;
    }
    if (!(r instanceof Oi))
      return null;
    let s = at(r.text, i);
    if (s == i)
      return null;
    let l = Kn(r.dom, i, s).getClientRects();
    for (let O = 0; O < l.length; O++) {
      let h = l[O];
      if (O == l.length - 1 || h.top < h.bottom && h.left < h.right)
        return h;
    }
    return null;
  }
  measureVisibleLineHeights(e) {
    let t = [], { from: i, to: r } = e, s = this.view.contentDOM.clientWidth, l = s > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, O = -1, h = this.view.textDirection == Re.LTR;
    for (let f = 0, u = 0; u < this.children.length; u++) {
      let d = this.children[u], g = f + d.length;
      if (g > r)
        break;
      if (f >= i) {
        let Q = d.dom.getBoundingClientRect();
        if (t.push(Q.height), l) {
          let b = d.dom.lastChild, v = b ? Cr(b) : [];
          if (v.length) {
            let w = v[v.length - 1], Z = h ? w.right - Q.left : Q.right - w.left;
            Z > O && (O = Z, this.minWidth = s, this.minWidthFrom = f, this.minWidthTo = g);
          }
        }
      }
      f = g + d.breakAfter;
    }
    return t;
  }
  textDirectionAt(e) {
    let { i: t } = this.childPos(e, 1);
    return getComputedStyle(this.children[t].dom).direction == "rtl" ? Re.RTL : Re.LTR;
  }
  measureTextSize() {
    for (let s of this.children)
      if (s instanceof Ie) {
        let l = s.measureTextSize();
        if (l)
          return l;
      }
    let e = document.createElement("div"), t, i, r;
    return e.className = "cm-line", e.style.width = "99999px", e.style.position = "absolute", e.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.dom.appendChild(e);
      let s = Cr(e.firstChild)[0];
      t = e.getBoundingClientRect().height, i = s ? s.width / 27 : 7, r = s ? s.height : t, e.remove();
    }), { lineHeight: t, charWidth: i, textHeight: r };
  }
  childCursor(e = this.length) {
    let t = this.children.length;
    return t && (e -= this.children[--t].length), new Am(this.children, e, t);
  }
  computeBlockGapDeco() {
    let e = [], t = this.view.viewState;
    for (let i = 0, r = 0; ; r++) {
      let s = r == t.viewports.length ? null : t.viewports[r], l = s ? s.from - 1 : this.length;
      if (l > i) {
        let O = (t.lineBlockAt(l).bottom - t.lineBlockAt(i).top) / this.view.scaleY;
        e.push(H.replace({
          widget: new pp(O),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, l));
      }
      if (!s)
        break;
      i = s.to + 1;
    }
    return H.set(e);
  }
  updateDeco() {
    let e = 1, t = this.view.state.facet(zs).map((s) => (this.dynamicDecorationMap[e++] = typeof s == "function") ? s(this.view) : s), i = !1, r = this.view.state.facet(aQ).map((s, l) => {
      let O = typeof s == "function";
      return O && (i = !0), O ? s(this.view) : s;
    });
    for (r.length && (this.dynamicDecorationMap[e++] = i, t.push(Qe.join(r))), this.decorations = [
      this.editContextFormatting,
      ...t,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ]; e < this.decorations.length; )
      this.dynamicDecorationMap[e++] = !1;
    return this.decorations;
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let f = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = f.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    for (let f of this.view.state.facet(sQ))
      try {
        if (f(this.view, e.range, e))
          return !0;
      } catch (u) {
        mt(this.view.state, u, "scroll handler");
      }
    let { range: t } = e, i = this.coordsAt(t.head, t.empty ? t.assoc : t.head > t.anchor ? -1 : 1), r;
    if (!i)
      return;
    !t.empty && (r = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (i = {
      left: Math.min(i.left, r.left),
      top: Math.min(i.top, r.top),
      right: Math.max(i.right, r.right),
      bottom: Math.max(i.bottom, r.bottom)
    });
    let s = cQ(this.view), l = {
      left: i.left - s.left,
      top: i.top - s.top,
      right: i.right + s.right,
      bottom: i.bottom + s.bottom
    }, { offsetWidth: O, offsetHeight: h } = this.view.scrollDOM;
    xk(this.view.scrollDOM, l, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, O), -O), Math.max(Math.min(e.yMargin, h), -h), this.view.textDirection == Re.LTR);
  }
}
function Dk(n) {
  return n.node.nodeType == 1 && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
class pp extends Zi {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return e.className = "cm-gap", this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
  ignoreEvent() {
    return !1;
  }
}
function fQ(n, e) {
  let t = n.observer.selectionRange;
  if (!t.focusNode)
    return null;
  let i = Wm(t.focusNode, t.focusOffset), r = Ym(t.focusNode, t.focusOffset), s = i || r;
  if (r && i && r.node != i.node) {
    let O = ve.get(r.node);
    if (!O || O instanceof Oi && O.text != r.node.nodeValue)
      s = r;
    else if (n.docView.lastCompositionAfterCursor) {
      let h = ve.get(i.node);
      !h || h instanceof Oi && h.text != i.node.nodeValue || (s = r);
    }
  }
  if (n.docView.lastCompositionAfterCursor = s != i, !s)
    return null;
  let l = e - s.offset;
  return { from: l, to: l + s.node.nodeValue.length, node: s.node };
}
function Ik(n, e, t) {
  let i = fQ(n, t);
  if (!i)
    return null;
  let { node: r, from: s, to: l } = i, O = r.nodeValue;
  if (/[\n\r]/.test(O) || n.state.doc.sliceString(i.from, i.to) != O)
    return null;
  let h = e.invertedDesc, f = new Jt(h.mapPos(s), h.mapPos(l), s, l), u = [];
  for (let d = r.parentNode; ; d = d.parentNode) {
    let g = ve.get(d);
    if (g instanceof Fi)
      u.push({ node: d, deco: g.mark });
    else {
      if (g instanceof Ie || d.nodeName == "DIV" && d.parentNode == n.contentDOM)
        return { range: f, text: r, marks: u, line: d };
      if (d != n.contentDOM)
        u.push({ node: d, deco: new Ks({
          inclusive: !0,
          attributes: Xk(d),
          tagName: d.tagName.toLowerCase()
        }) });
      else
        return null;
    }
  }
}
function Lk(n, e) {
  return n.nodeType != 1 ? 0 : (e && n.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < n.childNodes.length && n.childNodes[e].contentEditable == "false" ? 2 : 0);
}
let Bk = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    Bh(e, t, this.changes);
  }
  comparePoint(e, t) {
    Bh(e, t, this.changes);
  }
};
function jk(n, e, t) {
  let i = new Bk();
  return Qe.compare(n, e, t, i), i.changes;
}
function Nk(n, e) {
  for (let t = n; t && t != e; t = t.assignedSlot || t.parentNode)
    if (t.nodeType == 1 && t.contentEditable == "false")
      return !0;
  return !1;
}
function Fk(n, e) {
  let t = !1;
  return e && n.iterChangedRanges((i, r) => {
    i < e.to && r > e.from && (t = !0);
  }), t;
}
function Hk(n, e, t = 1) {
  let i = n.charCategorizer(e), r = n.doc.lineAt(e), s = e - r.from;
  if (r.length == 0)
    return X.cursor(e);
  s == 0 ? t = 1 : s == r.length && (t = -1);
  let l = s, O = s;
  t < 0 ? l = at(r.text, s, !1) : O = at(r.text, s);
  let h = i(r.text.slice(l, O));
  for (; l > 0; ) {
    let f = at(r.text, l, !1);
    if (i(r.text.slice(f, l)) != h)
      break;
    l = f;
  }
  for (; O < r.length; ) {
    let f = at(r.text, O);
    if (i(r.text.slice(O, f)) != h)
      break;
    O = f;
  }
  return X.range(l + r.from, O + r.from);
}
function Jk(n, e) {
  return e.left > n ? e.left - n : Math.max(0, n - e.right);
}
function Kk(n, e) {
  return e.top > n ? e.top - n : Math.max(0, n - e.bottom);
}
function KO(n, e) {
  return n.top < e.bottom - 1 && n.bottom > e.top + 1;
}
function gp(n, e) {
  return e < n.top ? { top: e, left: n.left, right: n.right, bottom: n.bottom } : n;
}
function mp(n, e) {
  return e > n.bottom ? { top: n.top, left: n.left, right: n.right, bottom: e } : n;
}
function Jh(n, e, t) {
  let i, r, s, l, O = !1, h, f, u, d;
  for (let b = n.firstChild; b; b = b.nextSibling) {
    let v = Cr(b);
    for (let w = 0; w < v.length; w++) {
      let Z = v[w];
      r && KO(r, Z) && (Z = gp(mp(Z, r.bottom), r.top));
      let Y = Jk(e, Z), U = Kk(t, Z);
      if (Y == 0 && U == 0)
        return b.nodeType == 3 ? Qp(b, e, t) : Jh(b, e, t);
      if (!i || l > U || l == U && s > Y) {
        i = b, r = Z, s = Y, l = U;
        let V = U ? t < Z.top ? -1 : 1 : Y ? e < Z.left ? -1 : 1 : 0;
        O = !V || (V > 0 ? w < v.length - 1 : w > 0);
      }
      Y == 0 ? t > Z.bottom && (!u || u.bottom < Z.bottom) ? (h = b, u = Z) : t < Z.top && (!d || d.top > Z.top) && (f = b, d = Z) : u && KO(u, Z) ? u = mp(u, Z.bottom) : d && KO(d, Z) && (d = gp(d, Z.top));
    }
  }
  if (u && u.bottom >= t ? (i = h, r = u) : d && d.top <= t && (i = f, r = d), !i)
    return { node: n, offset: 0 };
  let g = Math.max(r.left, Math.min(r.right, e));
  if (i.nodeType == 3)
    return Qp(i, g, t);
  if (O && i.contentEditable != "false")
    return Jh(i, g, t);
  let Q = Array.prototype.indexOf.call(n.childNodes, i) + (e >= (r.left + r.right) / 2 ? 1 : 0);
  return { node: n, offset: Q };
}
function Qp(n, e, t) {
  let i = n.nodeValue.length, r = -1, s = 1e9, l = 0;
  for (let O = 0; O < i; O++) {
    let h = Kn(n, O, O + 1).getClientRects();
    for (let f = 0; f < h.length; f++) {
      let u = h[f];
      if (u.top == u.bottom)
        continue;
      l || (l = e - u.left);
      let d = (u.top > t ? u.top - t : t - u.bottom) - 1;
      if (u.left - 1 <= e && u.right + 1 >= e && d < s) {
        let g = e >= (u.left + u.right) / 2, Q = g;
        if ((B.chrome || B.gecko) && Kn(n, O).getBoundingClientRect().left == u.right && (Q = !g), d <= 0)
          return { node: n, offset: O + (Q ? 1 : 0) };
        r = O + (Q ? 1 : 0), s = d;
      }
    }
  }
  return { node: n, offset: r > -1 ? r : l > 0 ? n.nodeValue.length : 0 };
}
function uQ(n, e, t, i = -1) {
  var r, s;
  let l = n.contentDOM.getBoundingClientRect(), O = l.top + n.viewState.paddingTop, h, { docHeight: f } = n.viewState, { x: u, y: d } = e, g = d - O;
  if (g < 0)
    return 0;
  if (g > f)
    return n.state.doc.length;
  for (let V = n.viewState.heightOracle.textHeight / 2, W = !1; h = n.elementAtHeight(g), h.type != Qt.Text; )
    for (; g = i > 0 ? h.bottom + V : h.top - V, !(g >= 0 && g <= f); ) {
      if (W)
        return t ? null : 0;
      W = !0, i = -i;
    }
  d = O + g;
  let Q = h.from;
  if (Q < n.viewport.from)
    return n.viewport.from == 0 ? 0 : t ? null : Pp(n, l, h, u, d);
  if (Q > n.viewport.to)
    return n.viewport.to == n.state.doc.length ? n.state.doc.length : t ? null : Pp(n, l, h, u, d);
  let b = n.dom.ownerDocument, v = n.root.elementFromPoint ? n.root : b, w = v.elementFromPoint(u, d);
  w && !n.contentDOM.contains(w) && (w = null), w || (u = Math.max(l.left + 1, Math.min(l.right - 1, u)), w = v.elementFromPoint(u, d), w && !n.contentDOM.contains(w) && (w = null));
  let Z, Y = -1;
  if (w && ((r = n.docView.nearest(w)) === null || r === void 0 ? void 0 : r.isEditable) != !1) {
    if (b.caretPositionFromPoint) {
      let V = b.caretPositionFromPoint(u, d);
      V && ({ offsetNode: Z, offset: Y } = V);
    } else if (b.caretRangeFromPoint) {
      let V = b.caretRangeFromPoint(u, d);
      V && ({ startContainer: Z, startOffset: Y } = V, (!n.contentDOM.contains(Z) || B.safari && eT(Z, Y, u) || B.chrome && tT(Z, Y, u)) && (Z = void 0));
    }
  }
  if (!Z || !n.docView.dom.contains(Z)) {
    let V = Ie.find(n.docView, Q);
    if (!V)
      return g > h.top + h.height / 2 ? h.to : h.from;
    ({ node: Z, offset: Y } = Jh(V.dom, u, d));
  }
  let U = n.docView.nearest(Z);
  if (!U)
    return null;
  if (U.isWidget && ((s = U.dom) === null || s === void 0 ? void 0 : s.nodeType) == 1) {
    let V = U.dom.getBoundingClientRect();
    return e.y < V.top || e.y <= V.bottom && e.x <= (V.left + V.right) / 2 ? U.posAtStart : U.posAtEnd;
  } else
    return U.localPosFromDOM(Z, Y) + U.posAtStart;
}
function Pp(n, e, t, i, r) {
  let s = Math.round((i - e.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && t.height > n.defaultLineHeight * 1.5) {
    let O = n.viewState.heightOracle.textHeight, h = Math.floor((r - t.top - (n.defaultLineHeight - O) * 0.5) / O);
    s += h * n.viewState.heightOracle.lineLength;
  }
  let l = n.state.sliceDoc(t.from, t.to);
  return t.from + Uh(l, s, n.state.tabSize);
}
function eT(n, e, t) {
  let i;
  if (n.nodeType != 3 || e != (i = n.nodeValue.length))
    return !1;
  for (let r = n.nextSibling; r; r = r.nextSibling)
    if (r.nodeType != 1 || r.nodeName != "BR")
      return !1;
  return Kn(n, i - 1, i).getBoundingClientRect().left > t;
}
function tT(n, e, t) {
  if (e != 0)
    return !1;
  for (let r = n; ; ) {
    let s = r.parentNode;
    if (!s || s.nodeType != 1 || s.firstChild != r)
      return !1;
    if (s.classList.contains("cm-line"))
      break;
    r = s;
  }
  let i = n.nodeType == 1 ? n.getBoundingClientRect() : Kn(n, 0, Math.max(n.nodeValue.length, 1)).getBoundingClientRect();
  return t - i.left > 5;
}
function Kh(n, e) {
  let t = n.lineBlockAt(e);
  if (Array.isArray(t.type)) {
    for (let i of t.type)
      if (i.to > e || i.to == e && (i.to == t.to || i.type == Qt.Text))
        return i;
  }
  return t;
}
function iT(n, e, t, i) {
  let r = Kh(n, e.head), s = !i || r.type != Qt.Text || !(n.lineWrapping || r.widgetLineBreaks) ? null : n.coordsAtPos(e.assoc < 0 && e.head > r.from ? e.head - 1 : e.head);
  if (s) {
    let l = n.dom.getBoundingClientRect(), O = n.textDirectionAt(r.from), h = n.posAtCoords({
      x: t == (O == Re.LTR) ? l.right - 1 : l.left + 1,
      y: (s.top + s.bottom) / 2
    });
    if (h != null)
      return X.cursor(h, t ? -1 : 1);
  }
  return X.cursor(t ? r.to : r.from, t ? -1 : 1);
}
function Sp(n, e, t, i) {
  let r = n.state.doc.lineAt(e.head), s = n.bidiSpans(r), l = n.textDirectionAt(r.from);
  for (let O = e, h = null; ; ) {
    let f = Ek(r, s, l, O, t), u = Fm;
    if (!f) {
      if (r.number == (t ? n.state.doc.lines : 1))
        return O;
      u = `
`, r = n.state.doc.line(r.number + (t ? 1 : -1)), s = n.bidiSpans(r), f = n.visualLineSide(r, !t);
    }
    if (h) {
      if (!h(u))
        return O;
    } else {
      if (!i)
        return f;
      h = i(u);
    }
    O = f;
  }
}
function nT(n, e, t) {
  let i = n.state.charCategorizer(e), r = i(t);
  return (s) => {
    let l = i(s);
    return r == qe.Space && (r = l), r == l;
  };
}
function rT(n, e, t, i) {
  let r = e.head, s = t ? 1 : -1;
  if (r == (t ? n.state.doc.length : 0))
    return X.cursor(r, e.assoc);
  let l = e.goalColumn, O, h = n.contentDOM.getBoundingClientRect(), f = n.coordsAtPos(r, e.assoc || -1), u = n.documentTop;
  if (f)
    l == null && (l = f.left - h.left), O = s < 0 ? f.top : f.bottom;
  else {
    let Q = n.viewState.lineBlockAt(r);
    l == null && (l = Math.min(h.right - h.left, n.defaultCharacterWidth * (r - Q.from))), O = (s < 0 ? Q.top : Q.bottom) + u;
  }
  let d = h.left + l, g = i ?? n.viewState.heightOracle.textHeight >> 1;
  for (let Q = 0; ; Q += 10) {
    let b = O + (g + Q) * s, v = uQ(n, { x: d, y: b }, !1, s);
    if (b < h.top || b > h.bottom || (s < 0 ? v < r : v > r)) {
      let w = n.docView.coordsForChar(v), Z = !w || b < w.top ? -1 : 1;
      return X.cursor(v, Z, void 0, l);
    }
  }
}
function Tl(n, e, t) {
  for (; ; ) {
    let i = 0;
    for (let r of n)
      r.between(e - 1, e + 1, (s, l, O) => {
        if (e > s && e < l) {
          let h = i || t || (e - s < l - e ? -1 : 1);
          e = h < 0 ? s : l, i = h;
        }
      });
    if (!i)
      return e;
  }
}
function eh(n, e, t) {
  let i = Tl(n.state.facet(Ac).map((r) => r(n)), t.from, e.head > t.from ? -1 : 1);
  return i == t.from ? t : X.cursor(i, i < t.from ? 1 : -1);
}
class sT {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.lastTouchTime = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.pendingIOSKey = void 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, B.safari && e.contentDOM.addEventListener("input", () => null), B.gecko && $T(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !uT(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || this.runHandlers(e.type, e);
  }
  runHandlers(e, t) {
    let i = this.handlers[e];
    if (i) {
      for (let r of i.observers)
        r(this.view, t);
      for (let r of i.handlers) {
        if (t.defaultPrevented)
          break;
        if (r(this.view, t)) {
          t.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let t = oT(e), i = this.handlers, r = this.view.contentDOM;
    for (let s in t)
      if (s != "scroll") {
        let l = !t[s].handlers.length, O = i[s];
        O && l != !O.handlers.length && (r.removeEventListener(s, this.handleEvent), O = null), O || r.addEventListener(s, this.handleEvent, { passive: l });
      }
    for (let s in i)
      s != "scroll" && !t[s] && r.removeEventListener(s, this.handleEvent);
    this.handlers = t;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode))
      return !0;
    if (this.tabFocusMode > 0 && e.keyCode != 27 && pQ.indexOf(e.keyCode) < 0 && (this.tabFocusMode = -1), B.android && B.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    let t;
    return B.ios && !e.synthetic && !e.altKey && !e.metaKey && ((t = dQ.find((i) => i.keyCode == e.keyCode)) && !e.ctrlKey || lT.indexOf(e.key) > -1 && e.ctrlKey && !e.shiftKey) ? (this.pendingIOSKey = t || e, setTimeout(() => this.flushIOSKey(), 250), !0) : (e.keyCode != 229 && this.view.observer.forceFlush(), !1);
  }
  flushIOSKey(e) {
    let t = this.pendingIOSKey;
    return !t || t.key == "Enter" && e && e.from < e.to && /^\S+$/.test(e.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, kr(this.view.contentDOM, t.key, t.keyCode, t instanceof KeyboardEvent ? t : void 0));
  }
  ignoreDuringComposition(e) {
    return /^key/.test(e.type) ? this.composing > 0 ? !0 : B.safari && !B.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1 : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.view.observer.update(e), this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function $p(n, e) {
  return (t, i) => {
    try {
      return e.call(n, i, t);
    } catch (r) {
      mt(t.state, r);
    }
  };
}
function oT(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(i) {
    return e[i] || (e[i] = { observers: [], handlers: [] });
  }
  for (let i of n) {
    let r = i.spec;
    if (r && r.domEventHandlers)
      for (let s in r.domEventHandlers) {
        let l = r.domEventHandlers[s];
        l && t(s).handlers.push($p(i.value, l));
      }
    if (r && r.domEventObservers)
      for (let s in r.domEventObservers) {
        let l = r.domEventObservers[s];
        l && t(s).observers.push($p(i.value, l));
      }
  }
  for (let i in hi)
    t(i).handlers.push(hi[i]);
  for (let i in Kt)
    t(i).observers.push(Kt[i]);
  return e;
}
const dQ = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], lT = "dthko", pQ = [16, 17, 18, 20, 91, 92, 224, 225], ol = 6;
function ll(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function aT(n, e) {
  return Math.max(Math.abs(n.clientX - e.clientX), Math.abs(n.clientY - e.clientY));
}
class OT {
  constructor(e, t, i, r) {
    this.view = e, this.startEvent = t, this.style = i, this.mustSelect = r, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = t, this.scrollParent = vk(e.contentDOM), this.atoms = e.state.facet(Ac).map((l) => l(e));
    let s = e.contentDOM.ownerDocument;
    s.addEventListener("mousemove", this.move = this.move.bind(this)), s.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(ce.allowMultipleSelections) && hT(e, t), this.dragging = fT(e, t) && PQ(t) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    var t;
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && aT(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let i = 0, r = 0, s = ((t = this.scrollParent) === null || t === void 0 ? void 0 : t.getBoundingClientRect()) || { left: 0, top: 0, right: this.view.win.innerWidth, bottom: this.view.win.innerHeight }, l = cQ(this.view);
    e.clientX - l.left <= s.left + ol ? i = -ll(s.left - e.clientX) : e.clientX + l.right >= s.right - ol && (i = ll(e.clientX - s.right)), e.clientY - l.top <= s.top + ol ? r = -ll(s.top - e.clientY) : e.clientY + l.bottom >= s.bottom - ol && (r = ll(e.clientY - s.bottom)), this.setScrollSpeed(i, r);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, t) {
    this.scrollSpeed = { x: e, y: t }, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    this.scrollParent ? (this.scrollParent.scrollLeft += this.scrollSpeed.x, this.scrollParent.scrollTop += this.scrollSpeed.y) : this.view.win.scrollBy(this.scrollSpeed.x, this.scrollSpeed.y), this.dragging === !1 && this.select(this.lastEvent);
  }
  skipAtoms(e) {
    let t = null;
    for (let i = 0; i < e.ranges.length; i++) {
      let r = e.ranges[i], s = null;
      if (r.empty) {
        let l = Tl(this.atoms, r.from, 0);
        l != r.from && (s = X.cursor(l, -1));
      } else {
        let l = Tl(this.atoms, r.from, -1), O = Tl(this.atoms, r.to, 1);
        (l != r.from || O != r.to) && (s = X.range(r.from == r.anchor ? l : O, r.from == r.head ? l : O));
      }
      s && (t || (t = e.ranges.slice()), t[i] = s);
    }
    return t ? X.create(t, e.mainIndex) : e;
  }
  select(e) {
    let { view: t } = this, i = this.skipAtoms(this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !i.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    e.transactions.some((t) => t.isUserEvent("input.type")) ? this.destroy() : this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function hT(n, e) {
  let t = n.state.facet(Hm);
  return t.length ? t[0](e) : B.mac ? e.metaKey : e.ctrlKey;
}
function cT(n, e) {
  let t = n.state.facet(Jm);
  return t.length ? t[0](e) : B.mac ? !e.altKey : !e.ctrlKey;
}
function fT(n, e) {
  let { main: t } = n.state.selection;
  if (t.empty)
    return !1;
  let i = Vs(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let r = i.getRangeAt(0).getClientRects();
  for (let s = 0; s < r.length; s++) {
    let l = r[s];
    if (l.left <= e.clientX && l.right >= e.clientX && l.top <= e.clientY && l.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function uT(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target, i; t != n.contentDOM; t = t.parentNode)
    if (!t || t.nodeType == 11 || (i = ve.get(t)) && i.ignoreEvent(e))
      return !1;
  return !0;
}
const hi = /* @__PURE__ */ Object.create(null), Kt = /* @__PURE__ */ Object.create(null), gQ = B.ie && B.ie_version < 15 || B.ios && B.webkit_version < 604;
function dT(n) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let t = e.appendChild(document.createElement("textarea"));
  t.style.cssText = "position: fixed; left: -10000px; top: 10px", t.focus(), setTimeout(() => {
    n.focus(), t.remove(), mQ(n, t.value);
  }, 50);
}
function mQ(n, e) {
  let { state: t } = n, i, r = 1, s = t.toText(e), l = s.lines == t.selection.ranges.length;
  if (ec != null && t.selection.ranges.every((h) => h.empty) && ec == s.toString()) {
    let h = -1;
    i = t.changeByRange((f) => {
      let u = t.doc.lineAt(f.from);
      if (u.from == h)
        return { range: f };
      h = u.from;
      let d = t.toText((l ? s.line(r++).text : e) + t.lineBreak);
      return {
        changes: { from: u.from, insert: d },
        range: X.cursor(f.from + d.length)
      };
    });
  } else l ? i = t.changeByRange((h) => {
    let f = s.line(r++);
    return {
      changes: { from: h.from, to: h.to, insert: f.text },
      range: X.cursor(h.from + f.length)
    };
  }) : i = t.replaceSelection(s);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
Kt.scroll = (n) => {
  n.inputState.lastScrollTop = n.scrollDOM.scrollTop, n.inputState.lastScrollLeft = n.scrollDOM.scrollLeft;
};
hi.keydown = (n, e) => (n.inputState.setSelectionOrigin("select"), e.keyCode == 27 && n.inputState.tabFocusMode != 0 && (n.inputState.tabFocusMode = Date.now() + 2e3), !1);
Kt.touchstart = (n, e) => {
  n.inputState.lastTouchTime = Date.now(), n.inputState.setSelectionOrigin("select.pointer");
};
Kt.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
hi.mousedown = (n, e) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let t = null;
  for (let i of n.state.facet(Km))
    if (t = i(n, e), t)
      break;
  if (!t && e.button == 0 && (t = mT(n, e)), t) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new OT(n, e, t, i)), i && n.observer.ignore(() => {
      Xm(n.contentDOM);
      let s = n.root.activeElement;
      s && !s.contains(n.contentDOM) && s.blur();
    });
    let r = n.inputState.mouseSelection;
    if (r)
      return r.start(e), r.dragging === !1;
  }
  return !1;
};
function bp(n, e, t, i) {
  if (i == 1)
    return X.cursor(e, t);
  if (i == 2)
    return Hk(n.state, e, t);
  {
    let r = Ie.find(n.docView, e), s = n.state.doc.lineAt(r ? r.posAtEnd : e), l = r ? r.posAtStart : s.from, O = r ? r.posAtEnd : s.to;
    return O < n.state.doc.length && O == s.to && O++, X.range(l, O);
  }
}
let QQ = (n, e) => n >= e.top && n <= e.bottom, yp = (n, e, t) => QQ(e, t) && n >= t.left && n <= t.right;
function pT(n, e, t, i) {
  let r = Ie.find(n.docView, e);
  if (!r)
    return 1;
  let s = e - r.posAtStart;
  if (s == 0)
    return 1;
  if (s == r.length)
    return -1;
  let l = r.coordsAt(s, -1);
  if (l && yp(t, i, l))
    return -1;
  let O = r.coordsAt(s, 1);
  return O && yp(t, i, O) ? 1 : l && QQ(i, l) ? -1 : 1;
}
function xp(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  return { pos: t, bias: pT(n, t, e.clientX, e.clientY) };
}
const gT = B.ie && B.ie_version <= 11;
let vp = null, wp = 0, kp = 0;
function PQ(n) {
  if (!gT)
    return n.detail;
  let e = vp, t = kp;
  return vp = n, kp = Date.now(), wp = !e || t > Date.now() - 400 && Math.abs(e.clientX - n.clientX) < 2 && Math.abs(e.clientY - n.clientY) < 2 ? (wp + 1) % 3 : 1;
}
function mT(n, e) {
  let t = xp(n, e), i = PQ(e), r = n.state.selection;
  return {
    update(s) {
      s.docChanged && (t.pos = s.changes.mapPos(t.pos), r = r.map(s.changes));
    },
    get(s, l, O) {
      let h = xp(n, s), f, u = bp(n, h.pos, h.bias, i);
      if (t.pos != h.pos && !l) {
        let d = bp(n, t.pos, t.bias, i), g = Math.min(d.from, u.from), Q = Math.max(d.to, u.to);
        u = g < u.from ? X.range(g, Q) : X.range(Q, g);
      }
      return l ? r.replaceRange(r.main.extend(u.from, u.to)) : O && i == 1 && r.ranges.length > 1 && (f = QT(r, h.pos)) ? f : O ? r.addRange(u) : X.create([u]);
    }
  };
}
function QT(n, e) {
  for (let t = 0; t < n.ranges.length; t++) {
    let { from: i, to: r } = n.ranges[t];
    if (i <= e && r >= e)
      return X.create(n.ranges.slice(0, t).concat(n.ranges.slice(t + 1)), n.mainIndex == t ? 0 : n.mainIndex - (n.mainIndex > t ? 1 : 0));
  }
  return null;
}
hi.dragstart = (n, e) => {
  let { selection: { main: t } } = n.state;
  if (e.target.draggable) {
    let r = n.docView.nearest(e.target);
    if (r && r.isWidget) {
      let s = r.posAtStart, l = s + r.length;
      (s >= t.to || l <= t.from) && (t = X.range(s, l));
    }
  }
  let { inputState: i } = n;
  return i.mouseSelection && (i.mouseSelection.dragging = !0), i.draggedContent = t, e.dataTransfer && (e.dataTransfer.setData("Text", n.state.sliceDoc(t.from, t.to)), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
hi.dragend = (n) => (n.inputState.draggedContent = null, !1);
function Tp(n, e, t, i) {
  if (!t)
    return;
  let r = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: s } = n.inputState, l = i && s && cT(n, e) ? { from: s.from, to: s.to } : null, O = { from: r, insert: t }, h = n.state.changes(l ? [l, O] : O);
  n.focus(), n.dispatch({
    changes: h,
    selection: { anchor: h.mapPos(r, -1), head: h.mapPos(r, 1) },
    userEvent: l ? "move.drop" : "input.drop"
  }), n.inputState.draggedContent = null;
}
hi.drop = (n, e) => {
  if (!e.dataTransfer)
    return !1;
  if (n.state.readOnly)
    return !0;
  let t = e.dataTransfer.files;
  if (t && t.length) {
    let i = Array(t.length), r = 0, s = () => {
      ++r == t.length && Tp(n, e, i.filter((l) => l != null).join(n.state.lineBreak), !1);
    };
    for (let l = 0; l < t.length; l++) {
      let O = new FileReader();
      O.onerror = s, O.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(O.result) || (i[l] = O.result), s();
      }, O.readAsText(t[l]);
    }
    return !0;
  } else {
    let i = e.dataTransfer.getData("Text");
    if (i)
      return Tp(n, e, i, !0), !0;
  }
  return !1;
};
hi.paste = (n, e) => {
  if (n.state.readOnly)
    return !0;
  n.observer.flush();
  let t = gQ ? null : e.clipboardData;
  return t ? (mQ(n, t.getData("text/plain") || t.getData("text/uri-list")), !0) : (dT(n), !1);
};
function PT(n, e) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let i = t.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = e, i.focus(), i.selectionEnd = e.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function ST(n) {
  let e = [], t = [], i = !1;
  for (let r of n.selection.ranges)
    r.empty || (e.push(n.sliceDoc(r.from, r.to)), t.push(r));
  if (!e.length) {
    let r = -1;
    for (let { from: s } of n.selection.ranges) {
      let l = n.doc.lineAt(s);
      l.number > r && (e.push(l.text), t.push({ from: l.from, to: Math.min(n.doc.length, l.to + 1) })), r = l.number;
    }
    i = !0;
  }
  return { text: e.join(n.lineBreak), ranges: t, linewise: i };
}
let ec = null;
hi.copy = hi.cut = (n, e) => {
  let { text: t, ranges: i, linewise: r } = ST(n.state);
  if (!t && !r)
    return !1;
  ec = r ? t : null, e.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let s = gQ ? null : e.clipboardData;
  return s ? (s.clearData(), s.setData("text/plain", t), !0) : (PT(n, t), !1);
};
const SQ = /* @__PURE__ */ Hi.define();
function $Q(n, e) {
  let t = [];
  for (let i of n.facet(iQ)) {
    let r = i(n, e);
    r && t.push(r);
  }
  return t ? n.update({ effects: t, annotations: SQ.of(!0) }) : null;
}
function bQ(n) {
  setTimeout(() => {
    let e = n.hasFocus;
    if (e != n.inputState.notifiedFocused) {
      let t = $Q(n.state, e);
      t ? n.dispatch(t) : n.update([]);
    }
  }, 10);
}
Kt.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), bQ(n);
};
Kt.blur = (n) => {
  n.observer.clearSelectionRange(), bQ(n);
};
Kt.compositionstart = Kt.compositionupdate = (n) => {
  n.observer.editContext || (n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0 && (n.inputState.composing = 0));
};
Kt.compositionend = (n) => {
  n.observer.editContext || (n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, B.chrome && B.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50));
};
Kt.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
hi.beforeinput = (n, e) => {
  var t;
  let i;
  if (B.chrome && B.android && (i = dQ.find((r) => r.inputType == e.inputType)) && (n.observer.delayAndroidKey(i.key, i.keyCode), i.key == "Backspace" || i.key == "Delete")) {
    let r = ((t = window.visualViewport) === null || t === void 0 ? void 0 : t.height) || 0;
    setTimeout(() => {
      var s;
      (((s = window.visualViewport) === null || s === void 0 ? void 0 : s.height) || 0) > r + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
  return B.ios && e.inputType == "deleteContentForward" && n.observer.flushSoon(), B.safari && e.inputType == "insertText" && n.inputState.composing >= 0 && setTimeout(() => Kt.compositionend(n, e), 20), !1;
};
const Zp = /* @__PURE__ */ new Set();
function $T(n) {
  Zp.has(n) || (Zp.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const Rp = ["pre-wrap", "normal", "pre-line", "break-spaces"];
class bT {
  constructor(e) {
    this.lineWrapping = e, this.doc = Pe.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30, this.heightChanged = !1;
  }
  heightForGap(e, t) {
    let i = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((t - e - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / (this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return Rp.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let t = !1;
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      r < 0 ? i++ : this.heightSamples[Math.floor(r * 10)] || (t = !0, this.heightSamples[Math.floor(r * 10)] = !0);
    }
    return t;
  }
  refresh(e, t, i, r, s, l) {
    let O = Rp.indexOf(e) > -1, h = Math.round(t) != Math.round(this.lineHeight) || this.lineWrapping != O;
    if (this.lineWrapping = O, this.lineHeight = t, this.charWidth = i, this.textHeight = r, this.lineLength = s, h) {
      this.heightSamples = {};
      for (let f = 0; f < l.length; f++) {
        let u = l[f];
        u < 0 ? f++ : this.heightSamples[Math.floor(u * 10)] = !0;
      }
    }
    return h;
  }
}
class yT {
  constructor(e, t) {
    this.from = e, this.heights = t, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class bi {
  /**
  @internal
  */
  constructor(e, t, i, r, s) {
    this.from = e, this.length = t, this.top = i, this.height = r, this._content = s;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? Qt.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof yn ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let t = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new bi(this.from, this.length + e.length, this.top, this.height + e.height, t);
  }
}
var Ze = /* @__PURE__ */ function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
}(Ze || (Ze = {}));
const Zl = 1e-3;
class Pt {
  constructor(e, t, i = 2) {
    this.length = e, this.height = t, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e, t) {
    this.height != t && (Math.abs(this.height - t) > Zl && (e.heightChanged = !0), this.height = t);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, t, i) {
    return Pt.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, t) {
    t.push(this);
  }
  decomposeRight(e, t) {
    t.push(this);
  }
  applyChanges(e, t, i, r) {
    let s = this, l = i.doc;
    for (let O = r.length - 1; O >= 0; O--) {
      let { fromA: h, toA: f, fromB: u, toB: d } = r[O], g = s.lineAt(h, Ze.ByPosNoHeight, i.setDoc(t), 0, 0), Q = g.to >= f ? g : s.lineAt(f, Ze.ByPosNoHeight, i, 0, 0);
      for (d += Q.to - f, f = Q.to; O > 0 && g.from <= r[O - 1].toA; )
        h = r[O - 1].fromA, u = r[O - 1].fromB, O--, h < g.from && (g = s.lineAt(h, Ze.ByPosNoHeight, i, 0, 0));
      u += g.from - h, h = g.from;
      let b = Uc.build(i.setDoc(l), e, u, d);
      s = s.replace(h, f, b);
    }
    return s.updateHeight(i, 0);
  }
  static empty() {
    return new Vt(0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let t = 0, i = e.length, r = 0, s = 0;
    for (; ; )
      if (t == i)
        if (r > s * 2) {
          let O = e[t - 1];
          O.break ? e.splice(--t, 1, O.left, null, O.right) : e.splice(--t, 1, O.left, O.right), i += 1 + O.break, r -= O.size;
        } else if (s > r * 2) {
          let O = e[i];
          O.break ? e.splice(i, 1, O.left, null, O.right) : e.splice(i, 1, O.left, O.right), i += 2 + O.break, s -= O.size;
        } else
          break;
      else if (r < s) {
        let O = e[t++];
        O && (r += O.size);
      } else {
        let O = e[--i];
        O && (s += O.size);
      }
    let l = 0;
    return e[t - 1] == null ? (l = 1, t--) : e[t] == null && (l = 1, i++), new xT(Pt.of(e.slice(0, t)), l, Pt.of(e.slice(i)));
  }
}
Pt.prototype.size = 1;
class yQ extends Pt {
  constructor(e, t, i) {
    super(e, t), this.deco = i;
  }
  blockAt(e, t, i, r) {
    return new bi(r, this.length, i, this.height, this.deco || 0);
  }
  lineAt(e, t, i, r, s) {
    return this.blockAt(0, i, r, s);
  }
  forEachLine(e, t, i, r, s, l) {
    e <= s + this.length && t >= s && l(this.blockAt(0, i, r, s));
  }
  updateHeight(e, t = 0, i = !1, r) {
    return r && r.from <= t && r.more && this.setHeight(e, r.heights[r.index++]), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class Vt extends yQ {
  constructor(e, t) {
    super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0;
  }
  blockAt(e, t, i, r) {
    return new bi(r, this.length, i, this.height, this.breaks);
  }
  replace(e, t, i) {
    let r = i[0];
    return i.length == 1 && (r instanceof Vt || r instanceof nt && r.flags & 4) && Math.abs(this.length - r.length) < 10 ? (r instanceof nt ? r = new Vt(r.length, this.height) : r.height = this.height, this.outdated || (r.outdated = !1), r) : Pt.of(i);
  }
  updateHeight(e, t = 0, i = !1, r) {
    return r && r.from <= t && r.more ? this.setHeight(e, r.heights[r.index++]) : (i || this.outdated) && this.setHeight(e, Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class nt extends Pt {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, t) {
    let i = e.doc.lineAt(t).number, r = e.doc.lineAt(t + this.length).number, s = r - i + 1, l, O = 0;
    if (e.lineWrapping) {
      let h = Math.min(this.height, e.lineHeight * s);
      l = h / s, this.length > s + 1 && (O = (this.height - h) / (this.length - s - 1));
    } else
      l = this.height / s;
    return { firstLine: i, lastLine: r, perLine: l, perChar: O };
  }
  blockAt(e, t, i, r) {
    let { firstLine: s, lastLine: l, perLine: O, perChar: h } = this.heightMetrics(t, r);
    if (t.lineWrapping) {
      let f = r + (e < t.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (e - i) / this.height)) * this.length)), u = t.doc.lineAt(f), d = O + u.length * h, g = Math.max(i, e - d / 2);
      return new bi(u.from, u.length, g, d, 0);
    } else {
      let f = Math.max(0, Math.min(l - s, Math.floor((e - i) / O))), { from: u, length: d } = t.doc.line(s + f);
      return new bi(u, d, i + O * f, O, 0);
    }
  }
  lineAt(e, t, i, r, s) {
    if (t == Ze.ByHeight)
      return this.blockAt(e, i, r, s);
    if (t == Ze.ByPosNoHeight) {
      let { from: Q, to: b } = i.doc.lineAt(e);
      return new bi(Q, b - Q, 0, 0, 0);
    }
    let { firstLine: l, perLine: O, perChar: h } = this.heightMetrics(i, s), f = i.doc.lineAt(e), u = O + f.length * h, d = f.number - l, g = r + O * d + h * (f.from - s - d);
    return new bi(f.from, f.length, Math.max(r, Math.min(g, r + this.height - u)), u, 0);
  }
  forEachLine(e, t, i, r, s, l) {
    e = Math.max(e, s), t = Math.min(t, s + this.length);
    let { firstLine: O, perLine: h, perChar: f } = this.heightMetrics(i, s);
    for (let u = e, d = r; u <= t; ) {
      let g = i.doc.lineAt(u);
      if (u == e) {
        let b = g.number - O;
        d += h * b + f * (e - s - b);
      }
      let Q = h + f * g.length;
      l(new bi(g.from, g.length, d, Q, 0)), d += Q, u = g.to + 1;
    }
  }
  replace(e, t, i) {
    let r = this.length - t;
    if (r > 0) {
      let s = i[i.length - 1];
      s instanceof nt ? i[i.length - 1] = new nt(s.length + r) : i.push(null, new nt(r - 1));
    }
    if (e > 0) {
      let s = i[0];
      s instanceof nt ? i[0] = new nt(e + s.length) : i.unshift(new nt(e - 1), null);
    }
    return Pt.of(i);
  }
  decomposeLeft(e, t) {
    t.push(new nt(e - 1), null);
  }
  decomposeRight(e, t) {
    t.push(null, new nt(this.length - e - 1));
  }
  updateHeight(e, t = 0, i = !1, r) {
    let s = t + this.length;
    if (r && r.from <= t + this.length && r.more) {
      let l = [], O = Math.max(t, r.from), h = -1;
      for (r.from > t && l.push(new nt(r.from - t - 1).updateHeight(e, t)); O <= s && r.more; ) {
        let u = e.doc.lineAt(O).length;
        l.length && l.push(null);
        let d = r.heights[r.index++];
        h == -1 ? h = d : Math.abs(d - h) >= Zl && (h = -2);
        let g = new Vt(u, d);
        g.outdated = !1, l.push(g), O += u + 1;
      }
      O <= s && l.push(null, new nt(s - O).updateHeight(e, O));
      let f = Pt.of(l);
      return (h < 0 || Math.abs(f.height - this.height) >= Zl || Math.abs(h - this.heightMetrics(e, t).perLine) >= Zl) && (e.heightChanged = !0), f;
    } else (i || this.outdated) && (this.setHeight(e, e.heightForGap(t, t + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class xT extends Pt {
  constructor(e, t, i) {
    super(e.length + t + i.length, e.height + i.height, t | (e.outdated || i.outdated ? 2 : 0)), this.left = e, this.right = i, this.size = e.size + i.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(e, t, i, r) {
    let s = i + this.left.height;
    return e < s ? this.left.blockAt(e, t, i, r) : this.right.blockAt(e, t, s, r + this.left.length + this.break);
  }
  lineAt(e, t, i, r, s) {
    let l = r + this.left.height, O = s + this.left.length + this.break, h = t == Ze.ByHeight ? e < l : e < O, f = h ? this.left.lineAt(e, t, i, r, s) : this.right.lineAt(e, t, i, l, O);
    if (this.break || (h ? f.to < O : f.from > O))
      return f;
    let u = t == Ze.ByPosNoHeight ? Ze.ByPosNoHeight : Ze.ByPos;
    return h ? f.join(this.right.lineAt(O, u, i, l, O)) : this.left.lineAt(O, u, i, r, s).join(f);
  }
  forEachLine(e, t, i, r, s, l) {
    let O = r + this.left.height, h = s + this.left.length + this.break;
    if (this.break)
      e < h && this.left.forEachLine(e, t, i, r, s, l), t >= h && this.right.forEachLine(e, t, i, O, h, l);
    else {
      let f = this.lineAt(h, Ze.ByPos, i, r, s);
      e < f.from && this.left.forEachLine(e, f.from - 1, i, r, s, l), f.to >= e && f.from <= t && l(f), t > f.to && this.right.forEachLine(f.to + 1, t, i, O, h, l);
    }
  }
  replace(e, t, i) {
    let r = this.left.length + this.break;
    if (t < r)
      return this.balanced(this.left.replace(e, t, i), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - r, t - r, i));
    let s = [];
    e > 0 && this.decomposeLeft(e, s);
    let l = s.length;
    for (let O of i)
      s.push(O);
    if (e > 0 && _p(s, l - 1), t < this.length) {
      let O = s.length;
      this.decomposeRight(t, s), _p(s, O);
    }
    return Pt.of(s);
  }
  decomposeLeft(e, t) {
    let i = this.left.length;
    if (e <= i)
      return this.left.decomposeLeft(e, t);
    t.push(this.left), this.break && (i++, e >= i && t.push(null)), e > i && this.right.decomposeLeft(e - i, t);
  }
  decomposeRight(e, t) {
    let i = this.left.length, r = i + this.break;
    if (e >= r)
      return this.right.decomposeRight(e - r, t);
    e < i && this.left.decomposeRight(e, t), this.break && e < r && t.push(null), t.push(this.right);
  }
  balanced(e, t) {
    return e.size > 2 * t.size || t.size > 2 * e.size ? Pt.of(this.break ? [e, null, t] : [e, t]) : (this.left = e, this.right = t, this.height = e.height + t.height, this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
  }
  updateHeight(e, t = 0, i = !1, r) {
    let { left: s, right: l } = this, O = t + s.length + this.break, h = null;
    return r && r.from <= t + s.length && r.more ? h = s = s.updateHeight(e, t, i, r) : s.updateHeight(e, t, i), r && r.from <= O + l.length && r.more ? h = l = l.updateHeight(e, O, i, r) : l.updateHeight(e, O, i), h ? this.balanced(s, l) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function _p(n, e) {
  let t, i;
  n[e] == null && (t = n[e - 1]) instanceof nt && (i = n[e + 1]) instanceof nt && n.splice(e - 1, 3, new nt(t.length + 1 + i.length));
}
const vT = 5;
class Uc {
  constructor(e, t) {
    this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, t) {
    if (this.lineStart > -1) {
      let i = Math.min(t, this.lineEnd), r = this.nodes[this.nodes.length - 1];
      r instanceof Vt ? r.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new Vt(i - this.pos, -1)), this.writtenTo = i, t > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = t;
  }
  point(e, t, i) {
    if (e < t || i.heightRelevant) {
      let r = i.widget ? i.widget.estimatedHeight : 0, s = i.widget ? i.widget.lineBreaks : 0;
      r < 0 && (r = this.oracle.lineHeight);
      let l = t - e;
      i.block ? this.addBlock(new yQ(l, r, i)) : (l || s || r >= vT) && this.addLineDeco(r, s, l);
    } else t > e && this.span(e, t);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new Vt(this.pos - e, -1)), this.writtenTo = this.pos;
  }
  blankContent(e, t) {
    let i = new nt(t - e);
    return this.oracle.doc.lineAt(e).to == t && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof Vt)
      return e;
    let t = new Vt(0, -1);
    return this.nodes.push(t), t;
  }
  addBlock(e) {
    this.enterLine();
    let t = e.deco;
    t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, t && t.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, t, i) {
    let r = this.ensureLine();
    r.length += i, r.collapsed += i, r.widgetHeight = Math.max(r.widgetHeight, e), r.breaks += t, this.writtenTo = this.pos = this.pos + i;
  }
  finish(e) {
    let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(t instanceof Vt) && !this.isCovered ? this.nodes.push(new Vt(0, -1)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = e;
    for (let r of this.nodes)
      r instanceof Vt && r.updateHeight(this.oracle, i), i += r ? r.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, t, i, r) {
    let s = new Uc(i, e);
    return Qe.spans(t, i, r, s, 0), s.finish(i);
  }
}
function wT(n, e, t) {
  let i = new kT();
  return Qe.compare(n, e, t, i, 0), i.changes;
}
class kT {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, t, i, r) {
    (e < t || i && i.heightRelevant || r && r.heightRelevant) && Bh(e, t, this.changes, 5);
  }
}
function TT(n, e) {
  let t = n.getBoundingClientRect(), i = n.ownerDocument, r = i.defaultView || window, s = Math.max(0, t.left), l = Math.min(r.innerWidth, t.right), O = Math.max(0, t.top), h = Math.min(r.innerHeight, t.bottom);
  for (let f = n.parentNode; f && f != i.body; )
    if (f.nodeType == 1) {
      let u = f, d = window.getComputedStyle(u);
      if ((u.scrollHeight > u.clientHeight || u.scrollWidth > u.clientWidth) && d.overflow != "visible") {
        let g = u.getBoundingClientRect();
        s = Math.max(s, g.left), l = Math.min(l, g.right), O = Math.max(O, g.top), h = f == n.parentNode ? g.bottom : Math.min(h, g.bottom);
      }
      f = d.position == "absolute" || d.position == "fixed" ? u.offsetParent : u.parentNode;
    } else if (f.nodeType == 11)
      f = f.host;
    else
      break;
  return {
    left: s - t.left,
    right: Math.max(s, l) - t.left,
    top: O - (t.top + e),
    bottom: Math.max(O, h) - (t.top + e)
  };
}
function ZT(n, e) {
  let t = n.getBoundingClientRect();
  return {
    left: 0,
    right: t.right - t.left,
    top: e,
    bottom: t.bottom - (t.top + e)
  };
}
class th {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.size = i;
  }
  static same(e, t) {
    if (e.length != t.length)
      return !1;
    for (let i = 0; i < e.length; i++) {
      let r = e[i], s = t[i];
      if (r.from != s.from || r.to != s.to || r.size != s.size)
        return !1;
    }
    return !0;
  }
  draw(e, t) {
    return H.replace({
      widget: new RT(this.size * (t ? e.scaleY : e.scaleX), t)
    }).range(this.from, this.to);
  }
}
class RT extends Zi {
  constructor(e, t) {
    super(), this.size = e, this.vertical = t;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class Xp {
  constructor(e) {
    this.state = e, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scrollTop = 0, this.scrolledToBottom = !1, this.scaleX = 1, this.scaleY = 1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = qp, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = Re.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let t = e.facet(Yc).some((i) => typeof i != "function" && i.class == "cm-lineWrapping");
    this.heightOracle = new bT(t), this.stateDeco = e.facet(zs).filter((i) => typeof i != "function"), this.heightMap = Pt.empty().applyChanges(this.stateDeco, Pe.empty, this.heightOracle.setDoc(e.doc), [new Jt(0, 0, 0, e.doc.length)]);
    for (let i = 0; i < 2 && (this.viewport = this.getViewport(0, null), !!this.updateForViewport()); i++)
      ;
    this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = H.set(this.lineGaps.map((i) => i.draw(this, !1))), this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: t } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let r = i ? t.head : t.anchor;
      if (!e.some(({ from: s, to: l }) => r >= s && r <= l)) {
        let { from: s, to: l } = this.lineBlockAt(r);
        e.push(new al(s, l));
      }
    }
    return this.viewports = e.sort((i, r) => i.from - r.from), this.updateScaler();
  }
  updateScaler() {
    let e = this.scaler;
    return this.scaler = this.heightMap.height <= 7e6 ? qp : new Vc(this.heightOracle, this.heightMap, this.viewports), e.eq(this.scaler) ? 0 : 2;
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(ws(e, this.scaler));
    });
  }
  update(e, t = null) {
    this.state = e.state;
    let i = this.stateDeco;
    this.stateDeco = this.state.facet(zs).filter((u) => typeof u != "function");
    let r = e.changedRanges, s = Jt.extendWithRanges(r, wT(i, this.stateDeco, e ? e.changes : Ke.empty(this.state.doc.length))), l = this.heightMap.height, O = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollTop);
    this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), s), this.heightMap.height != l && (e.flags |= 2), O ? (this.scrollAnchorPos = e.changes.mapPos(O.from, -1), this.scrollAnchorHeight = O.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = this.heightMap.height);
    let h = s.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (t && (t.range.head < h.from || t.range.head > h.to) || !this.viewportIsAppropriate(h)) && (h = this.getViewport(0, t));
    let f = h.from != this.viewport.from || h.to != this.viewport.to;
    this.viewport = h, e.flags |= this.updateForViewport(), (f || !e.changes.empty || e.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && e.selectionSet && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(rQ) && (this.mustEnforceCursorAssoc = !0);
  }
  measure(e) {
    let t = e.contentDOM, i = window.getComputedStyle(t), r = this.heightOracle, s = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? Re.RTL : Re.LTR;
    let l = this.heightOracle.mustRefreshForWrapping(s), O = t.getBoundingClientRect(), h = l || this.mustMeasureContent || this.contentDOMHeight != O.height;
    this.contentDOMHeight = O.height, this.mustMeasureContent = !1;
    let f = 0, u = 0;
    if (O.width && O.height) {
      let { scaleX: V, scaleY: W } = _m(t, O);
      (V > 5e-3 && Math.abs(this.scaleX - V) > 5e-3 || W > 5e-3 && Math.abs(this.scaleY - W) > 5e-3) && (this.scaleX = V, this.scaleY = W, f |= 8, l = h = !0);
    }
    let d = (parseInt(i.paddingTop) || 0) * this.scaleY, g = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != d || this.paddingBottom != g) && (this.paddingTop = d, this.paddingBottom = g, f |= 10), this.editorWidth != e.scrollDOM.clientWidth && (r.lineWrapping && (h = !0), this.editorWidth = e.scrollDOM.clientWidth, f |= 8);
    let Q = e.scrollDOM.scrollTop * this.scaleY;
    this.scrollTop != Q && (this.scrollAnchorHeight = -1, this.scrollTop = Q), this.scrolledToBottom = Cm(e.scrollDOM);
    let b = (this.printing ? ZT : TT)(t, this.paddingTop), v = b.top - this.pixelViewport.top, w = b.bottom - this.pixelViewport.bottom;
    this.pixelViewport = b;
    let Z = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (Z != this.inView && (this.inView = Z, Z && (h = !0)), !this.inView && !this.scrollTarget)
      return 0;
    let Y = O.width;
    if ((this.contentDOMWidth != Y || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = O.width, this.editorHeight = e.scrollDOM.clientHeight, f |= 8), h) {
      let V = e.docView.measureVisibleLineHeights(this.viewport);
      if (r.mustRefreshForHeights(V) && (l = !0), l || r.lineWrapping && Math.abs(Y - this.contentDOMWidth) > r.charWidth) {
        let { lineHeight: W, charWidth: M, textHeight: z } = e.docView.measureTextSize();
        l = W > 0 && r.refresh(s, W, M, z, Y / M, V), l && (e.docView.minWidth = 0, f |= 8);
      }
      v > 0 && w > 0 ? u = Math.max(v, w) : v < 0 && w < 0 && (u = Math.min(v, w)), r.heightChanged = !1;
      for (let W of this.viewports) {
        let M = W.from == this.viewport.from ? V : e.docView.measureVisibleLineHeights(W);
        this.heightMap = (l ? Pt.empty().applyChanges(this.stateDeco, Pe.empty, this.heightOracle, [new Jt(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(r, 0, l, new yT(W.from, M));
      }
      r.heightChanged && (f |= 2);
    }
    let U = !this.viewportIsAppropriate(this.viewport, u) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return U && (f & 2 && (f |= this.updateScaler()), this.viewport = this.getViewport(u, this.scrollTarget), f |= this.updateForViewport()), (f & 2 || U) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(l ? [] : this.lineGaps, e)), f |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), f;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, t) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), r = this.heightMap, s = this.heightOracle, { visibleTop: l, visibleBottom: O } = this, h = new al(r.lineAt(l - i * 1e3, Ze.ByHeight, s, 0, 0).from, r.lineAt(O + (1 - i) * 1e3, Ze.ByHeight, s, 0, 0).to);
    if (t) {
      let { head: f } = t.range;
      if (f < h.from || f > h.to) {
        let u = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), d = r.lineAt(f, Ze.ByPos, s, 0, 0), g;
        t.y == "center" ? g = (d.top + d.bottom) / 2 - u / 2 : t.y == "start" || t.y == "nearest" && f < h.from ? g = d.top : g = d.bottom - u, h = new al(r.lineAt(g - 1e3 / 2, Ze.ByHeight, s, 0, 0).from, r.lineAt(g + u + 1e3 / 2, Ze.ByHeight, s, 0, 0).to);
      }
    }
    return h;
  }
  mapViewport(e, t) {
    let i = t.mapPos(e.from, -1), r = t.mapPos(e.to, 1);
    return new al(this.heightMap.lineAt(i, Ze.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(r, Ze.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: t }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: r } = this.heightMap.lineAt(e, Ze.ByPos, this.heightOracle, 0, 0), { bottom: s } = this.heightMap.lineAt(t, Ze.ByPos, this.heightOracle, 0, 0), { visibleTop: l, visibleBottom: O } = this;
    return (e == 0 || r <= l - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (t == this.state.doc.length || s >= O + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && r > l - 2 * 1e3 && s < O + 2 * 1e3;
  }
  mapLineGaps(e, t) {
    if (!e.length || t.empty)
      return e;
    let i = [];
    for (let r of e)
      t.touchesRange(r.from, r.to) || i.push(new th(t.mapPos(r.from), t.mapPos(r.to), r.size));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, t) {
    let i = this.heightOracle.lineWrapping, r = i ? 1e4 : 2e3, s = r >> 1, l = r << 1;
    if (this.defaultTextDirection != Re.LTR && !i)
      return [];
    let O = [], h = (u, d, g, Q) => {
      if (d - u < s)
        return;
      let b = this.state.selection.main, v = [b.from];
      b.empty || v.push(b.to);
      for (let Z of v)
        if (Z > u && Z < d) {
          h(u, Z - 10, g, Q), h(Z + 10, d, g, Q);
          return;
        }
      let w = XT(e, (Z) => Z.from >= g.from && Z.to <= g.to && Math.abs(Z.from - u) < s && Math.abs(Z.to - d) < s && !v.some((Y) => Z.from < Y && Z.to > Y));
      if (!w) {
        if (d < g.to && t && i && t.visibleRanges.some((Z) => Z.from <= d && Z.to >= d)) {
          let Z = t.moveToLineBoundary(X.cursor(d), !1, !0).head;
          Z > u && (d = Z);
        }
        w = new th(u, d, this.gapSize(g, u, d, Q));
      }
      O.push(w);
    }, f = (u) => {
      if (u.length < l || u.type != Qt.Text)
        return;
      let d = _T(u.from, u.to, this.stateDeco);
      if (d.total < l)
        return;
      let g = this.scrollTarget ? this.scrollTarget.range.head : null, Q, b;
      if (i) {
        let v = r / this.heightOracle.lineLength * this.heightOracle.lineHeight, w, Z;
        if (g != null) {
          let Y = hl(d, g), U = ((this.visibleBottom - this.visibleTop) / 2 + v) / u.height;
          w = Y - U, Z = Y + U;
        } else
          w = (this.visibleTop - u.top - v) / u.height, Z = (this.visibleBottom - u.top + v) / u.height;
        Q = Ol(d, w), b = Ol(d, Z);
      } else {
        let v = d.total * this.heightOracle.charWidth, w = r * this.heightOracle.charWidth, Z, Y;
        if (g != null) {
          let U = hl(d, g), V = ((this.pixelViewport.right - this.pixelViewport.left) / 2 + w) / v;
          Z = U - V, Y = U + V;
        } else
          Z = (this.pixelViewport.left - w) / v, Y = (this.pixelViewport.right + w) / v;
        Q = Ol(d, Z), b = Ol(d, Y);
      }
      Q > u.from && h(u.from, Q, u, d), b < u.to && h(b, u.to, u, d);
    };
    for (let u of this.viewportLines)
      Array.isArray(u.type) ? u.type.forEach(f) : f(u);
    return O;
  }
  gapSize(e, t, i, r) {
    let s = hl(r, i) - hl(r, t);
    return this.heightOracle.lineWrapping ? e.height * s : r.total * this.heightOracle.charWidth * s;
  }
  updateLineGaps(e) {
    th.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = H.set(e.map((t) => t.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges() {
    let e = this.stateDeco;
    this.lineGaps.length && (e = e.concat(this.lineGapDeco));
    let t = [];
    Qe.spans(e, this.viewport.from, this.viewport.to, {
      span(r, s) {
        t.push({ from: r, to: s });
      },
      point() {
      }
    }, 20);
    let i = t.length != this.visibleRanges.length || this.visibleRanges.some((r, s) => r.from != t[s].from || r.to != t[s].to);
    return this.visibleRanges = t, i ? 4 : 0;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || ws(this.heightMap.lineAt(e, Ze.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return e >= this.viewportLines[0].top && e <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((t) => t.top <= e && t.bottom >= e) || ws(this.heightMap.lineAt(this.scaler.fromDOM(e), Ze.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  scrollAnchorAt(e) {
    let t = this.lineBlockAtHeight(e + 8);
    return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return ws(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class al {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
function _T(n, e, t) {
  let i = [], r = n, s = 0;
  return Qe.spans(t, n, e, {
    span() {
    },
    point(l, O) {
      l > r && (i.push({ from: r, to: l }), s += l - r), r = O;
    }
  }, 20), r < e && (i.push({ from: r, to: e }), s += e - r), { total: s, ranges: i };
}
function Ol({ total: n, ranges: e }, t) {
  if (t <= 0)
    return e[0].from;
  if (t >= 1)
    return e[e.length - 1].to;
  let i = Math.floor(n * t);
  for (let r = 0; ; r++) {
    let { from: s, to: l } = e[r], O = l - s;
    if (i <= O)
      return s + i;
    i -= O;
  }
}
function hl(n, e) {
  let t = 0;
  for (let { from: i, to: r } of n.ranges) {
    if (e <= r) {
      t += e - i;
      break;
    }
    t += r - i;
  }
  return t / n.total;
}
function XT(n, e) {
  for (let t of n)
    if (e(t))
      return t;
}
const qp = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1,
  eq(n) {
    return n == this;
  }
};
class Vc {
  constructor(e, t, i) {
    let r = 0, s = 0, l = 0;
    this.viewports = i.map(({ from: O, to: h }) => {
      let f = t.lineAt(O, Ze.ByPos, e, 0, 0).top, u = t.lineAt(h, Ze.ByPos, e, 0, 0).bottom;
      return r += u - f, { from: O, to: h, top: f, bottom: u, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - r) / (t.height - r);
    for (let O of this.viewports)
      O.domTop = l + (O.top - s) * this.scale, l = O.domBottom = O.domTop + (O.bottom - O.top), s = O.bottom;
  }
  toDOM(e) {
    for (let t = 0, i = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.top)
        return r + (e - i) * this.scale;
      if (e <= s.bottom)
        return s.domTop + (e - s.top);
      i = s.bottom, r = s.domBottom;
    }
  }
  fromDOM(e) {
    for (let t = 0, i = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.domTop)
        return i + (e - r) / this.scale;
      if (e <= s.domBottom)
        return s.top + (e - s.domTop);
      i = s.bottom, r = s.domBottom;
    }
  }
  eq(e) {
    return e instanceof Vc ? this.scale == e.scale && this.viewports.length == e.viewports.length && this.viewports.every((t, i) => t.from == e.viewports[i].from && t.to == e.viewports[i].to) : !1;
  }
}
function ws(n, e) {
  if (e.scale == 1)
    return n;
  let t = e.toDOM(n.top), i = e.toDOM(n.bottom);
  return new bi(n.from, n.length, t, i - t, Array.isArray(n._content) ? n._content.map((r) => ws(r, e)) : n._content);
}
const cl = /* @__PURE__ */ j.define({ combine: (n) => n.join(" ") }), tc = /* @__PURE__ */ j.define({ combine: (n) => n.indexOf(!0) > -1 }), ic = /* @__PURE__ */ $n.newName(), xQ = /* @__PURE__ */ $n.newName(), vQ = /* @__PURE__ */ $n.newName(), wQ = { "&light": "." + xQ, "&dark": "." + vQ };
function nc(n, e, t) {
  return new $n(e, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (r) => {
        if (r == "&")
          return n;
        if (!t || !t[r])
          throw new RangeError(`Unsupported selector: ${r}`);
        return t[r];
      }) : n + " " + i;
    }
  });
}
const qT = /* @__PURE__ */ nc("." + ic, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // https://github.com/codemirror/dev/issues/456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#444"
  },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    insetInlineStart: 0,
    zIndex: 200
  },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    borderRight: "1px solid #ddd"
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top"
  },
  ".cm-highlightSpace:before": {
    content: "attr(data-display)",
    position: "absolute",
    pointerEvents: "none",
    color: "#888"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, wQ), ks = "￿";
class CT {
  constructor(e, t) {
    this.points = e, this.text = "", this.lineSeparator = t.facet(ce.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += ks;
  }
  readRange(e, t) {
    if (!e)
      return this;
    let i = e.parentNode;
    for (let r = e; ; ) {
      this.findPointBefore(i, r);
      let s = this.text.length;
      this.readNode(r);
      let l = r.nextSibling;
      if (l == t)
        break;
      let O = ve.get(r), h = ve.get(l);
      (O && h ? O.breakAfter : (O ? O.breakAfter : Ml(r)) || Ml(l) && (r.nodeName != "BR" || r.cmIgnore) && this.text.length > s) && this.lineBreak(), r = l;
    }
    return this.findPointBefore(i, t), this;
  }
  readTextNode(e) {
    let t = e.nodeValue;
    for (let i of this.points)
      i.node == e && (i.pos = this.text.length + Math.min(i.offset, t.length));
    for (let i = 0, r = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let s = -1, l = 1, O;
      if (this.lineSeparator ? (s = t.indexOf(this.lineSeparator, i), l = this.lineSeparator.length) : (O = r.exec(t)) && (s = O.index, l = O[0].length), this.append(t.slice(i, s < 0 ? t.length : s)), s < 0)
        break;
      if (this.lineBreak(), l > 1)
        for (let h of this.points)
          h.node == e && h.pos > this.text.length && (h.pos -= l - 1);
      i = s + l;
    }
  }
  readNode(e) {
    if (e.cmIgnore)
      return;
    let t = ve.get(e), i = t && t.overrideDOMText;
    if (i != null) {
      this.findPointInside(e, i.length);
      for (let r = i.iter(); !r.next().done; )
        r.lineBreak ? this.lineBreak() : this.append(r.value);
    } else e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, t) {
    for (let i of this.points)
      i.node == e && e.childNodes[i.offset] == t && (i.pos = this.text.length);
  }
  findPointInside(e, t) {
    for (let i of this.points)
      (e.nodeType == 3 ? i.node == e : e.contains(i.node)) && (i.pos = this.text.length + (WT(e, i.node, i.offset) ? t : 0));
  }
}
function WT(n, e, t) {
  for (; ; ) {
    if (!e || t < Ni(e))
      return !1;
    if (e == n)
      return !0;
    t = Jn(e) + 1, e = e.parentNode;
  }
}
class Cp {
  constructor(e, t) {
    this.node = e, this.offset = t, this.pos = -1;
  }
}
class YT {
  constructor(e, t, i, r) {
    this.typeOver = r, this.bounds = null, this.text = "", this.domChanged = t > -1;
    let { impreciseHead: s, impreciseAnchor: l } = e.docView;
    if (e.state.readOnly && t > -1)
      this.newSel = null;
    else if (t > -1 && (this.bounds = e.docView.domBoundsAround(t, i, 0))) {
      let O = s || l ? [] : VT(e), h = new CT(O, e.state);
      h.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = h.text, this.newSel = zT(O, this.bounds.from);
    } else {
      let O = e.observer.selectionRange, h = s && s.node == O.focusNode && s.offset == O.focusOffset || !Eh(e.contentDOM, O.focusNode) ? e.state.selection.main.head : e.docView.posFromDOM(O.focusNode, O.focusOffset), f = l && l.node == O.anchorNode && l.offset == O.anchorOffset || !Eh(e.contentDOM, O.anchorNode) ? e.state.selection.main.anchor : e.docView.posFromDOM(O.anchorNode, O.anchorOffset), u = e.viewport;
      if ((B.ios || B.chrome) && e.state.selection.main.empty && h != f && (u.from > 0 || u.to < e.state.doc.length)) {
        let d = Math.min(h, f), g = Math.max(h, f), Q = u.from - d, b = u.to - g;
        (Q == 0 || Q == 1 || d == 0) && (b == 0 || b == -1 || g == e.state.doc.length) && (h = 0, f = e.state.doc.length);
      }
      this.newSel = X.single(f, h);
    }
  }
}
function kQ(n, e) {
  let t, { newSel: i } = e, r = n.state.selection.main, s = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: l, to: O } = e.bounds, h = r.from, f = null;
    (s === 8 || B.android && e.text.length < O - l) && (h = r.to, f = "end");
    let u = UT(n.state.doc.sliceString(l, O, ks), e.text, h - l, f);
    u && (B.chrome && s == 13 && u.toB == u.from + 2 && e.text.slice(u.from, u.toB) == ks + ks && u.toB--, t = {
      from: l + u.from,
      to: l + u.toA,
      insert: Pe.of(e.text.slice(u.from, u.toB).split(ks))
    });
  } else i && (!n.hasFocus && n.state.facet(fn) || i.main.eq(r)) && (i = null);
  if (!t && !i)
    return !1;
  if (!t && e.typeOver && !r.empty && i && i.main.empty ? t = { from: r.from, to: r.to, insert: n.state.doc.slice(r.from, r.to) } : t && t.from >= r.from && t.to <= r.to && (t.from != r.from || t.to != r.to) && r.to - r.from - (t.to - t.from) <= 4 ? t = {
    from: r.from,
    to: r.to,
    insert: n.state.doc.slice(r.from, t.from).append(t.insert).append(n.state.doc.slice(t.to, r.to))
  } : (B.mac || B.android) && t && t.from == t.to && t.from == r.head - 1 && /^\. ?$/.test(t.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && t.insert.length == 2 && (i = X.single(i.main.anchor - 1, i.main.head - 1)), t = { from: r.from, to: r.to, insert: Pe.of([" "]) }) : B.chrome && t && t.from == t.to && t.from == r.head && t.insert.toString() == `
 ` && n.lineWrapping && (i && (i = X.single(i.main.anchor - 1, i.main.head - 1)), t = { from: r.from, to: r.to, insert: Pe.of([" "]) }), t)
    return TQ(n, t, i, s);
  if (i && !i.main.eq(r)) {
    let l = !1, O = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (l = !0), O = n.inputState.lastSelectionOrigin), n.dispatch({ selection: i, scrollIntoView: l, userEvent: O }), !0;
  } else
    return !1;
}
function TQ(n, e, t, i = -1) {
  if (B.ios && n.inputState.flushIOSKey(e))
    return !0;
  let r = n.state.selection.main;
  if (B.android && (e.to == r.to && // GBoard will sometimes remove a space it just inserted
  // after a completion when you press enter
  (e.from == r.from || e.from == r.from - 1 && n.state.sliceDoc(e.from, r.from) == " ") && e.insert.length == 1 && e.insert.lines == 2 && kr(n.contentDOM, "Enter", 13) || (e.from == r.from - 1 && e.to == r.to && e.insert.length == 0 || i == 8 && e.insert.length < e.to - e.from && e.to > r.head) && kr(n.contentDOM, "Backspace", 8) || e.from == r.from && e.to == r.to + 1 && e.insert.length == 0 && kr(n.contentDOM, "Delete", 46)))
    return !0;
  let s = e.insert.toString();
  n.inputState.composing >= 0 && n.inputState.composing++;
  let l, O = () => l || (l = AT(n, e, t));
  return n.state.facet(tQ).some((h) => h(n, e.from, e.to, s, O)) || n.dispatch(O()), !0;
}
function AT(n, e, t) {
  let i, r = n.state, s = r.selection.main;
  if (e.from >= s.from && e.to <= s.to && e.to - e.from >= (s.to - s.from) / 3 && (!t || t.main.empty && t.main.from == e.from + e.insert.length) && n.inputState.composing < 0) {
    let O = s.from < e.from ? r.sliceDoc(s.from, e.from) : "", h = s.to > e.to ? r.sliceDoc(e.to, s.to) : "";
    i = r.replaceSelection(n.state.toText(O + e.insert.sliceString(0, void 0, n.state.lineBreak) + h));
  } else {
    let O = r.changes(e), h = t && t.main.to <= O.newLength ? t.main : void 0;
    if (r.selection.ranges.length > 1 && n.inputState.composing >= 0 && e.to <= s.to && e.to >= s.to - 10) {
      let f = n.state.sliceDoc(e.from, e.to), u, d = t && fQ(n, t.main.head);
      if (d) {
        let b = e.insert.length - (e.to - e.from);
        u = { from: d.from, to: d.to - b };
      } else
        u = n.state.doc.lineAt(s.head);
      let g = s.to - e.to, Q = s.to - s.from;
      i = r.changeByRange((b) => {
        if (b.from == s.from && b.to == s.to)
          return { changes: O, range: h || b.map(O) };
        let v = b.to - g, w = v - f.length;
        if (b.to - b.from != Q || n.state.sliceDoc(w, v) != f || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        b.to >= u.from && b.from <= u.to)
          return { range: b };
        let Z = r.changes({ from: w, to: v, insert: e.insert }), Y = b.to - s.to;
        return {
          changes: Z,
          range: h ? X.range(Math.max(0, h.anchor + Y), Math.max(0, h.head + Y)) : b.map(Z)
        };
      });
    } else
      i = {
        changes: O,
        selection: h && r.selection.replaceRange(h)
      };
  }
  let l = "input.type";
  return (n.composing || n.inputState.compositionPendingChange && n.inputState.compositionEndedAt > Date.now() - 50) && (n.inputState.compositionPendingChange = !1, l += ".compose", n.inputState.compositionFirstChange && (l += ".start", n.inputState.compositionFirstChange = !1)), r.update(i, { userEvent: l, scrollIntoView: !0 });
}
function UT(n, e, t, i) {
  let r = Math.min(n.length, e.length), s = 0;
  for (; s < r && n.charCodeAt(s) == e.charCodeAt(s); )
    s++;
  if (s == r && n.length == e.length)
    return null;
  let l = n.length, O = e.length;
  for (; l > 0 && O > 0 && n.charCodeAt(l - 1) == e.charCodeAt(O - 1); )
    l--, O--;
  if (i == "end") {
    let h = Math.max(0, s - Math.min(l, O));
    t -= l + h - s;
  }
  if (l < s && n.length < e.length) {
    let h = t <= s && t >= l ? s - t : 0;
    s -= h, O = s + (O - l), l = s;
  } else if (O < s) {
    let h = t <= s && t >= O ? s - t : 0;
    s -= h, l = s + (l - O), O = s;
  }
  return { from: s, toA: l, toB: O };
}
function VT(n) {
  let e = [];
  if (n.root.activeElement != n.contentDOM)
    return e;
  let { anchorNode: t, anchorOffset: i, focusNode: r, focusOffset: s } = n.observer.selectionRange;
  return t && (e.push(new Cp(t, i)), (r != t || s != i) && e.push(new Cp(r, s))), e;
}
function zT(n, e) {
  if (n.length == 0)
    return null;
  let t = n[0].pos, i = n.length == 2 ? n[1].pos : t;
  return t > -1 && i > -1 ? X.single(t + e, i + e) : null;
}
const ET = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, ih = B.ie && B.ie_version <= 11;
class MT {
  constructor(e) {
    this.view = e, this.active = !1, this.editContext = null, this.selectionRange = new wk(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
      for (let i of t)
        this.queue.push(i);
      (B.ie && B.ie_version <= 11 || B.ios && e.composing) && t.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), window.EditContext && e.constructor.EDIT_CONTEXT !== !1 && // Chrome <126 doesn't support inverted selections in edit context (#1392)
    !(B.chrome && B.chrome_version < 126) && (this.editContext = new DT(e), e.state.facet(fn) && (e.contentDOM.editContext = this.editContext.editContext)), ih && (this.onCharData = (t) => {
      this.queue.push({
        target: t.target,
        type: "characterData",
        oldValue: t.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var t;
      ((t = this.view.docView) === null || t === void 0 ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((t) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((t) => {
      t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(!1), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint(e) {
    e.type == "change" && !e.matches || (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500));
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, i) => t != e[i]))) {
      this.gapIntersection.disconnect();
      for (let t of e)
        this.gapIntersection.observe(t);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let t = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, r = this.selectionRange;
    if (i.state.facet(fn) ? i.root.activeElement != this.dom : !kl(i.dom, r))
      return;
    let s = r.anchorNode && i.docView.nearest(r.anchorNode);
    if (s && s.ignoreEvent(e)) {
      t || (this.selectionChanged = !1);
      return;
    }
    (B.ie && B.ie_version <= 11 || B.android && B.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    r.focusNode && Xs(r.focusNode, r.focusOffset, r.anchorNode, r.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, t = Vs(e.root);
    if (!t)
      return !1;
    let i = B.safari && e.root.nodeType == 11 && bk(this.dom.ownerDocument) == this.dom && GT(this.view, t) || t;
    if (!i || this.selectionRange.eq(i))
      return !1;
    let r = kl(this.dom, i);
    return r && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && Tk(this.dom, i) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(i), r && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, t) {
    this.selectionRange.set(e.node, e.offset, t.node, t.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, t = null;
    for (let i = this.dom; i; )
      if (i.nodeType == 1)
        !t && e < this.scrollTargets.length && this.scrollTargets[e] == i ? e++ : t || (t = this.scrollTargets.slice(0, e)), t && t.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = t)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, ET), ih && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), ih && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, t) {
    var i;
    if (!this.delayedAndroidKey) {
      let r = () => {
        let s = this.delayedAndroidKey;
        s && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = s.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && s.force && kr(this.dom, s.key, s.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(r);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: t,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((i = this.delayedAndroidKey) === null || i === void 0) && i.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let t = -1, i = -1, r = !1;
    for (let s of e) {
      let l = this.readMutation(s);
      l && (l.typeOver && (r = !0), t == -1 ? { from: t, to: i } = l : (t = Math.min(l.from, t), i = Math.max(l.to, i)));
    }
    return { from: t, to: i, typeOver: r };
  }
  readChange() {
    let { from: e, to: t, typeOver: i } = this.processRecords(), r = this.selectionChanged && kl(this.dom, this.selectionRange);
    if (e < 0 && !r)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let s = new YT(this.view, e, t, i);
    return this.view.docView.domChanged = { newSel: s.newSel ? s.newSel.main : null }, s;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let t = this.readChange();
    if (!t)
      return this.view.requestMeasure(), !1;
    let i = this.view.state, r = kQ(this.view, t);
    return this.view.state == i && (t.domChanged || t.newSel && !t.newSel.main.eq(this.view.state.selection.main)) && this.view.update([]), r;
  }
  readMutation(e) {
    let t = this.view.docView.nearest(e.target);
    if (!t || t.ignoreMutation(e))
      return null;
    if (t.markDirty(e.type == "attributes"), e.type == "attributes" && (t.flags |= 4), e.type == "childList") {
      let i = Wp(t, e.previousSibling || e.target.previousSibling, -1), r = Wp(t, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: i ? t.posAfter(i) : t.posAtStart,
        to: r ? t.posBefore(r) : t.posAtEnd,
        typeOver: !1
      };
    } else return e.type == "characterData" ? { from: t.posAtStart, to: t.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), this.printQuery ? this.printQuery.addEventListener("change", this.onPrint) : e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), this.printQuery ? this.printQuery.removeEventListener("change", this.onPrint) : e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  update(e) {
    this.editContext && (this.editContext.update(e), e.startState.facet(fn) != e.state.facet(fn) && (e.view.contentDOM.editContext = e.state.facet(fn) ? this.editContext.editContext : null));
  }
  destroy() {
    var e, t, i;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (t = this.gapIntersection) === null || t === void 0 || t.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
    for (let r of this.scrollTargets)
      r.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey);
  }
}
function Wp(n, e, t) {
  for (; e; ) {
    let i = ve.get(e);
    if (i && i.parent == n)
      return i;
    let r = e.parentNode;
    e = r != n.dom ? r : t > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function Yp(n, e) {
  let t = e.startContainer, i = e.startOffset, r = e.endContainer, s = e.endOffset, l = n.docView.domAtPos(n.state.selection.main.anchor);
  return Xs(l.node, l.offset, r, s) && ([t, i, r, s] = [r, s, t, i]), { anchorNode: t, anchorOffset: i, focusNode: r, focusOffset: s };
}
function GT(n, e) {
  if (e.getComposedRanges) {
    let r = e.getComposedRanges(n.root)[0];
    if (r)
      return Yp(n, r);
  }
  let t = null;
  function i(r) {
    r.preventDefault(), r.stopImmediatePropagation(), t = r.getTargetRanges()[0];
  }
  return n.contentDOM.addEventListener("beforeinput", i, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", i, !0), t ? Yp(n, t) : null;
}
class DT {
  constructor(e) {
    this.from = 0, this.to = 0, this.pendingContextChange = null, this.resetRange(e.state);
    let t = this.editContext = new window.EditContext({
      text: e.state.doc.sliceString(this.from, this.to),
      selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, e.state.selection.main.anchor))),
      selectionEnd: this.toContextPos(e.state.selection.main.head)
    });
    t.addEventListener("textupdate", (i) => {
      let { anchor: r } = e.state.selection.main, s = {
        from: this.toEditorPos(i.updateRangeStart),
        to: this.toEditorPos(i.updateRangeEnd),
        insert: Pe.of(i.text.split(`
`))
      };
      s.from == this.from && r < this.from ? s.from = r : s.to == this.to && r > this.to && (s.to = r), !(s.from == s.to && !s.insert.length) && (this.pendingContextChange = s, TQ(e, s, X.single(this.toEditorPos(i.selectionStart), this.toEditorPos(i.selectionEnd))), this.pendingContextChange && this.revertPending(e.state));
    }), t.addEventListener("characterboundsupdate", (i) => {
      let r = [], s = null;
      for (let l = this.toEditorPos(i.rangeStart), O = this.toEditorPos(i.rangeEnd); l < O; l++) {
        let h = e.coordsForChar(l);
        s = h && new DOMRect(h.left, h.top, h.right - h.left, h.bottom - h.top) || s || new DOMRect(), r.push(s);
      }
      t.updateCharacterBounds(i.rangeStart, r);
    }), t.addEventListener("textformatupdate", (i) => {
      let r = [];
      for (let s of i.getTextFormats()) {
        let l = s.underlineStyle, O = s.underlineThickness;
        if (l != "None" && O != "None") {
          let h = `text-decoration: underline ${l == "Dashed" ? "dashed " : l == "Squiggle" ? "wavy " : ""}${O == "Thin" ? 1 : 2}px`;
          r.push(H.mark({ attributes: { style: h } }).range(this.toEditorPos(s.rangeStart), this.toEditorPos(s.rangeEnd)));
        }
      }
      e.dispatch({ effects: oQ.of(H.set(r)) });
    }), t.addEventListener("compositionstart", () => {
      e.inputState.composing < 0 && (e.inputState.composing = 0, e.inputState.compositionFirstChange = !0);
    }), t.addEventListener("compositionend", () => {
      e.inputState.composing = -1, e.inputState.compositionFirstChange = null;
    }), this.measureReq = { read: (i) => {
      this.editContext.updateControlBounds(i.contentDOM.getBoundingClientRect());
      let r = Vs(i.root);
      r && r.rangeCount && this.editContext.updateSelectionBounds(r.getRangeAt(0).getBoundingClientRect());
    } };
  }
  applyEdits(e) {
    let t = 0, i = !1, r = this.pendingContextChange;
    return e.changes.iterChanges((s, l, O, h, f) => {
      if (i)
        return;
      let u = f.length - (l - s);
      if (r && l >= r.to)
        if (r.from == s && r.to == l && r.insert.eq(f)) {
          r = this.pendingContextChange = null, t += u, this.to += u;
          return;
        } else
          r = null, this.revertPending(e.state);
      if (s += t, l += t, l <= this.from)
        this.from += u, this.to += u;
      else if (s < this.to) {
        if (s < this.from || l > this.to || this.to - this.from + f.length > 3e4) {
          i = !0;
          return;
        }
        this.editContext.updateText(this.toContextPos(s), this.toContextPos(l), f.toString()), this.to += u;
      }
      t += u;
    }), r && !i && this.revertPending(e.state), !i;
  }
  update(e) {
    !this.applyEdits(e) || !this.rangeIsValid(e.state) ? (this.pendingContextChange = null, this.resetRange(e.state), this.editContext.updateText(0, this.editContext.text.length, e.state.doc.sliceString(this.from, this.to)), this.setSelection(e.state)) : (e.docChanged || e.selectionSet) && this.setSelection(e.state), (e.geometryChanged || e.docChanged || e.selectionSet) && e.view.requestMeasure(this.measureReq);
  }
  resetRange(e) {
    let { head: t } = e.selection.main;
    this.from = Math.max(
      0,
      t - 1e4
      /* CxVp.Margin */
    ), this.to = Math.min(
      e.doc.length,
      t + 1e4
      /* CxVp.Margin */
    );
  }
  revertPending(e) {
    let t = this.pendingContextChange;
    this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(t.from), this.toContextPos(t.to + t.insert.length), e.doc.sliceString(t.from, t.to));
  }
  setSelection(e) {
    let { main: t } = e.selection, i = this.toContextPos(Math.max(this.from, Math.min(this.to, t.anchor))), r = this.toContextPos(t.head);
    (this.editContext.selectionStart != i || this.editContext.selectionEnd != r) && this.editContext.updateSelection(i, r);
  }
  rangeIsValid(e) {
    let { head: t } = e.selection.main;
    return !(this.from > 0 && t - this.from < 500 || this.to < e.doc.length && this.to - t < 500 || this.to - this.from > 1e4 * 3);
  }
  toEditorPos(e) {
    return e + this.from;
  }
  toContextPos(e) {
    return e - this.from;
  }
}
class I {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: t } = e;
    this.dispatchTransactions = e.dispatchTransactions || t && ((i) => i.forEach((r) => t(r, this))) || ((i) => this.update(i)), this.dispatch = this.dispatch.bind(this), this._root = e.root || kk(e.parent) || document, this.viewState = new Xp(e.state || ce.create(e)), e.scrollTo && e.scrollTo.is(sl) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(xs).map((i) => new JO(i));
    for (let i of this.plugins)
      i.update(this);
    this.observer = new MT(this), this.inputState = new sT(this), this.inputState.ensureHandlers(this.plugins), this.docView = new dp(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure();
  }
  dispatch(...e) {
    let t = e.length == 1 && e[0] instanceof Be ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(t, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let t = !1, i = !1, r, s = this.state;
    for (let g of e) {
      if (g.startState != s)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      s = g.state;
    }
    if (this.destroyed) {
      this.viewState.state = s;
      return;
    }
    let l = this.hasFocus, O = 0, h = null;
    e.some((g) => g.annotation(SQ)) ? (this.inputState.notifiedFocused = l, O = 1) : l != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = l, h = $Q(s, l), h || (O = 1));
    let f = this.observer.delayedAndroidKey, u = null;
    if (f ? (this.observer.clearDelayedAndroidKey(), u = this.observer.readChange(), (u && !this.state.doc.eq(s.doc) || !this.state.selection.eq(s.selection)) && (u = null)) : this.observer.clear(), s.facet(ce.phrases) != this.state.facet(ce.phrases))
      return this.setState(s);
    r = Dl.create(this, s, e), r.flags |= O;
    let d = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let g of e) {
        if (d && (d = d.map(g.changes)), g.scrollIntoView) {
          let { main: Q } = g.state.selection;
          d = new Tr(Q.empty ? Q : X.cursor(Q.head, Q.head > Q.anchor ? -1 : 1));
        }
        for (let Q of g.effects)
          Q.is(sl) && (d = Q.value.clip(this.state));
      }
      this.viewState.update(r, d), this.bidiCache = Il.update(this.bidiCache, r.changes), r.empty || (this.updatePlugins(r), this.inputState.update(r)), t = this.docView.update(r), this.state.facet(vs) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(t, e.some((g) => g.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (r.startState.facet(cl) != r.state.facet(cl) && (this.viewState.mustMeasureContent = !0), (t || i || d || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), t && this.docViewUpdate(), !r.empty)
      for (let g of this.state.facet(Hh))
        try {
          g(r);
        } catch (Q) {
          mt(this.state, Q, "update listener");
        }
    (h || u) && Promise.resolve().then(() => {
      h && this.state == h.startState && this.dispatch(h), u && !kQ(this, u) && f.force && kr(this.contentDOM, f.key, f.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let t = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new Xp(e), this.plugins = e.facet(xs).map((i) => new JO(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView.destroy(), this.docView = new dp(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    t && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let t = e.startState.facet(xs), i = e.state.facet(xs);
    if (t != i) {
      let r = [];
      for (let s of i) {
        let l = t.indexOf(s);
        if (l < 0)
          r.push(new JO(s));
        else {
          let O = this.plugins[l];
          O.mustUpdate = e, r.push(O);
        }
      }
      for (let s of this.plugins)
        s.mustUpdate != e && s.destroy(this);
      this.plugins = r, this.pluginMap.clear();
    } else
      for (let r of this.plugins)
        r.mustUpdate = e;
    for (let r = 0; r < this.plugins.length; r++)
      this.plugins[r].update(this);
    t != i && this.inputState.ensureHandlers(this.plugins);
  }
  docViewUpdate() {
    for (let e of this.plugins) {
      let t = e.value;
      if (t && t.docViewUpdate)
        try {
          t.docViewUpdate(this);
        } catch (i) {
          mt(this.state, i, "doc view update listener");
        }
    }
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let t = null, i = this.scrollDOM, r = i.scrollTop * this.scaleY, { scrollAnchorPos: s, scrollAnchorHeight: l } = this.viewState;
    Math.abs(r - this.viewState.scrollTop) > 1 && (l = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let O = 0; ; O++) {
        if (l < 0)
          if (Cm(i))
            s = -1, l = this.viewState.heightMap.height;
          else {
            let Q = this.viewState.scrollAnchorAt(r);
            s = Q.from, l = Q.top;
          }
        this.updateState = 1;
        let h = this.viewState.measure(this);
        if (!h && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (O > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let f = [];
        h & 4 || ([this.measureRequests, f] = [f, this.measureRequests]);
        let u = f.map((Q) => {
          try {
            return Q.read(this);
          } catch (b) {
            return mt(this.state, b), Ap;
          }
        }), d = Dl.create(this, this.state, []), g = !1;
        d.flags |= h, t ? t.flags |= h : t = d, this.updateState = 2, d.empty || (this.updatePlugins(d), this.inputState.update(d), this.updateAttrs(), g = this.docView.update(d), g && this.docViewUpdate());
        for (let Q = 0; Q < f.length; Q++)
          if (u[Q] != Ap)
            try {
              let b = f[Q];
              b.write && b.write(u[Q], this);
            } catch (b) {
              mt(this.state, b);
            }
        if (g && this.docView.updateSelection(!0), !d.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, l = -1;
              continue;
            } else {
              let b = (s < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(s).top) - l;
              if (b > 1 || b < -1) {
                r = r + b, i.scrollTop = r / this.scaleY, l = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (t && !t.empty)
      for (let O of this.state.facet(Hh))
        O(t);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return ic + " " + (this.state.facet(tc) ? vQ : xQ) + " " + this.state.facet(cl);
  }
  updateAttrs() {
    let e = Up(this, lQ, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), t = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      translate: "no",
      contenteditable: this.state.facet(fn) ? "true" : "false",
      class: "cm-content",
      style: `${B.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (t["aria-readonly"] = "true"), Up(this, Yc, t);
    let i = this.observer.ignore(() => {
      let r = Lh(this.contentDOM, this.contentAttrs, t), s = Lh(this.dom, this.editorAttrs, e);
      return r || s;
    });
    return this.editorAttrs = e, this.contentAttrs = t, i;
  }
  showAnnouncements(e) {
    let t = !0;
    for (let i of e)
      for (let r of i.effects)
        if (r.is(I.announce)) {
          t && (this.announceDOM.textContent = ""), t = !1;
          let s = this.announceDOM.appendChild(document.createElement("div"));
          s.textContent = r.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(vs);
    let e = this.state.facet(I.cspNonce);
    $n.mount(this.root, this.styleModules.concat(qT).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let t = 0; t < this.measureRequests.length; t++)
          if (this.measureRequests[t].key === e.key) {
            this.measureRequests[t] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let t = this.pluginMap.get(e);
    return (t === void 0 || t && t.spec != e) && this.pluginMap.set(e, t = this.plugins.find((i) => i.spec == e) || null), t && t.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line breaks, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, t, i) {
    return eh(this, e, Sp(this, e, t, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, t) {
    return eh(this, e, Sp(this, e, t, (i) => nT(this, e.head, i)));
  }
  /**
  Get the cursor position visually at the start or end of a line.
  Note that this may differ from the _logical_ position at its
  start or end (which is simply at `line.from`/`line.to`) if text
  at the start or end goes against the line's base text direction.
  */
  visualLineSide(e, t) {
    let i = this.bidiSpans(e), r = this.textDirectionAt(e.from), s = i[t ? i.length - 1 : 0];
    return X.cursor(s.side(t, r) + e.from, s.forward(!t, r) ? 1 : -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, t, i = !0) {
    return iT(this, e, t, i);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, t, i) {
    return eh(this, e, rT(this, e, t, i));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e) {
    return this.docView.domAtPos(e);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, t = 0) {
    return this.docView.posFromDOM(e, t);
  }
  posAtCoords(e, t = !0) {
    return this.readMeasured(), uQ(this, e, t);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, t = 1) {
    this.readMeasured();
    let i = this.docView.coordsAt(e, t);
    if (!i || i.left == i.right)
      return i;
    let r = this.state.doc.lineAt(e), s = this.bidiSpans(r), l = s[gn.find(s, e - r.from, -1, t)];
    return ua(i, l.dir == Re.LTR == t > 0);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(nQ) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > IT)
      return Nm(e.length);
    let t = this.textDirectionAt(e.from), i;
    for (let s of this.bidiCache)
      if (s.from == e.from && s.dir == t && (s.fresh || jm(s.isolates, i = up(this, e))))
        return s.order;
    i || (i = up(this, e));
    let r = zk(e.text, t, i);
    return this.bidiCache.push(new Il(e.from, e.to, t, i, !0, r)), r;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || B.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      Xm(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    this.root.activeElement == this.contentDOM && this.contentDOM.blur();
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, t = {}) {
    return sl.of(new Tr(typeof e == "number" ? X.cursor(e) : e, t.y, t.x, t.yMargin, t.xMargin));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: t } = this.scrollDOM, i = this.viewState.scrollAnchorAt(e);
    return sl.of(new Tr(X.cursor(i.from), "start", "start", i.top - e, t, !0));
  }
  /**
  Enable or disable tab-focus mode, which disables key bindings
  for Tab and Shift-Tab, letting the browser's default
  focus-changing behavior go through instead. This is useful to
  prevent trapping keyboard users in your editor.
  
  Without argument, this toggles the mode. With a boolean, it
  enables (true) or disables it (false). Given a number, it
  temporarily enables the mode until that number of milliseconds
  have passed or another non-Tab key is pressed.
  */
  setTabFocusMode(e) {
    e == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof e == "boolean" ? this.inputState.tabFocusMode = e ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + e);
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return ze.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return ze.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, t) {
    let i = $n.newName(), r = [cl.of(i), vs.of(nc(`.${i}`, e))];
    return t && t.dark && r.push(tc.of(!0)), r;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return Tn.lowest(vs.of(nc("." + ic, e, wQ)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var t;
    let i = e.querySelector(".cm-content"), r = i && ve.get(i) || ve.get(e);
    return ((t = r == null ? void 0 : r.rootView) === null || t === void 0 ? void 0 : t.view) || null;
  }
}
I.styleModule = vs;
I.inputHandler = tQ;
I.scrollHandler = sQ;
I.focusChangeEffect = iQ;
I.perLineTextDirection = nQ;
I.exceptionSink = eQ;
I.updateListener = Hh;
I.editable = fn;
I.mouseSelectionStyle = Km;
I.dragMovesSelection = Jm;
I.clickAddsSelectionRange = Hm;
I.decorations = zs;
I.outerDecorations = aQ;
I.atomicRanges = Ac;
I.bidiIsolatedRanges = OQ;
I.scrollMargins = hQ;
I.darkTheme = tc;
I.cspNonce = /* @__PURE__ */ j.define({ combine: (n) => n.length ? n[0] : "" });
I.contentAttributes = Yc;
I.editorAttributes = lQ;
I.lineWrapping = /* @__PURE__ */ I.contentAttributes.of({ class: "cm-lineWrapping" });
I.announce = /* @__PURE__ */ ie.define();
const IT = 4096, Ap = {};
class Il {
  constructor(e, t, i, r, s, l) {
    this.from = e, this.to = t, this.dir = i, this.isolates = r, this.fresh = s, this.order = l;
  }
  static update(e, t) {
    if (t.empty && !e.some((s) => s.fresh))
      return e;
    let i = [], r = e.length ? e[e.length - 1].dir : Re.LTR;
    for (let s = Math.max(0, e.length - 10); s < e.length; s++) {
      let l = e[s];
      l.dir == r && !t.touchesRange(l.from, l.to) && i.push(new Il(t.mapPos(l.from, 1), t.mapPos(l.to, -1), l.dir, l.isolates, !1, l.order));
    }
    return i;
  }
}
function Up(n, e, t) {
  for (let i = n.state.facet(e), r = i.length - 1; r >= 0; r--) {
    let s = i[r], l = typeof s == "function" ? s(n) : s;
    l && Ih(l, t);
  }
  return t;
}
const LT = B.mac ? "mac" : B.windows ? "win" : B.linux ? "linux" : "key";
function BT(n, e) {
  const t = n.split(/-(?!$)/);
  let i = t[t.length - 1];
  i == "Space" && (i = " ");
  let r, s, l, O;
  for (let h = 0; h < t.length - 1; ++h) {
    const f = t[h];
    if (/^(cmd|meta|m)$/i.test(f))
      O = !0;
    else if (/^a(lt)?$/i.test(f))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(f))
      s = !0;
    else if (/^s(hift)?$/i.test(f))
      l = !0;
    else if (/^mod$/i.test(f))
      e == "mac" ? O = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + f);
  }
  return r && (i = "Alt-" + i), s && (i = "Ctrl-" + i), O && (i = "Meta-" + i), l && (i = "Shift-" + i), i;
}
function fl(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
const jT = /* @__PURE__ */ Tn.default(/* @__PURE__ */ I.domEventHandlers({
  keydown(n, e) {
    return RQ(ZQ(e.state), n, e, "editor");
  }
})), Er = /* @__PURE__ */ j.define({ enables: jT }), Vp = /* @__PURE__ */ new WeakMap();
function ZQ(n) {
  let e = n.facet(Er), t = Vp.get(e);
  return t || Vp.set(e, t = HT(e.reduce((i, r) => i.concat(r), []))), t;
}
function NT(n, e, t) {
  return RQ(ZQ(n.state), e, n, t);
}
let un = null;
const FT = 4e3;
function HT(n, e = LT) {
  let t = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), r = (l, O) => {
    let h = i[l];
    if (h == null)
      i[l] = O;
    else if (h != O)
      throw new Error("Key binding " + l + " is used both as a regular binding and as a multi-stroke prefix");
  }, s = (l, O, h, f, u) => {
    var d, g;
    let Q = t[l] || (t[l] = /* @__PURE__ */ Object.create(null)), b = O.split(/ (?!$)/).map((Z) => BT(Z, e));
    for (let Z = 1; Z < b.length; Z++) {
      let Y = b.slice(0, Z).join(" ");
      r(Y, !0), Q[Y] || (Q[Y] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(U) => {
          let V = un = { view: U, prefix: Y, scope: l };
          return setTimeout(() => {
            un == V && (un = null);
          }, FT), !0;
        }]
      });
    }
    let v = b.join(" ");
    r(v, !1);
    let w = Q[v] || (Q[v] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((g = (d = Q._any) === null || d === void 0 ? void 0 : d.run) === null || g === void 0 ? void 0 : g.slice()) || []
    });
    h && w.run.push(h), f && (w.preventDefault = !0), u && (w.stopPropagation = !0);
  };
  for (let l of n) {
    let O = l.scope ? l.scope.split(" ") : ["editor"];
    if (l.any)
      for (let f of O) {
        let u = t[f] || (t[f] = /* @__PURE__ */ Object.create(null));
        u._any || (u._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        let { any: d } = l;
        for (let g in u)
          u[g].run.push((Q) => d(Q, rc));
      }
    let h = l[e] || l.key;
    if (h)
      for (let f of O)
        s(f, h, l.run, l.preventDefault, l.stopPropagation), l.shift && s(f, "Shift-" + h, l.shift, l.preventDefault, l.stopPropagation);
  }
  return t;
}
let rc = null;
function RQ(n, e, t, i) {
  rc = e;
  let r = $k(e), s = rt(r, 0), l = Ft(s) == r.length && r != " ", O = "", h = !1, f = !1, u = !1;
  un && un.view == t && un.scope == i && (O = un.prefix + " ", pQ.indexOf(e.keyCode) < 0 && (f = !0, un = null));
  let d = /* @__PURE__ */ new Set(), g = (w) => {
    if (w) {
      for (let Z of w.run)
        if (!d.has(Z) && (d.add(Z), Z(t)))
          return w.stopPropagation && (u = !0), !0;
      w.preventDefault && (w.stopPropagation && (u = !0), f = !0);
    }
    return !1;
  }, Q = n[i], b, v;
  return Q && (g(Q[O + fl(r, e, !l)]) ? h = !0 : l && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(B.windows && e.ctrlKey && e.altKey) && (b = bn[e.keyCode]) && b != r ? (g(Q[O + fl(b, e, !0)]) || e.shiftKey && (v = Us[e.keyCode]) != r && v != b && g(Q[O + fl(v, e, !1)])) && (h = !0) : l && e.shiftKey && g(Q[O + fl(r, e, !0)]) && (h = !0), !h && g(Q._any) && (h = !0)), f && (h = !0), h && u && e.stopPropagation(), rc = null, h;
}
class to {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, t, i, r, s) {
    this.className = e, this.left = t, this.top = i, this.width = r, this.height = s;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, t) {
    return t.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, t, i) {
    if (i.empty) {
      let r = e.coordsAtPos(i.head, i.assoc || 1);
      if (!r)
        return [];
      let s = _Q(e);
      return [new to(t, r.left - s.left, r.top - s.top, null, r.bottom - r.top)];
    } else
      return JT(e, t, i);
  }
}
function _Q(n) {
  let e = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == Re.LTR ? e.left : e.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: e.top - n.scrollDOM.scrollTop * n.scaleY };
}
function zp(n, e, t, i) {
  let r = n.coordsAtPos(e, t * 2);
  if (!r)
    return i;
  let s = n.dom.getBoundingClientRect(), l = (r.top + r.bottom) / 2, O = n.posAtCoords({ x: s.left + 1, y: l }), h = n.posAtCoords({ x: s.right - 1, y: l });
  return O == null || h == null ? i : { from: Math.max(i.from, Math.min(O, h)), to: Math.min(i.to, Math.max(O, h)) };
}
function JT(n, e, t) {
  if (t.to <= n.viewport.from || t.from >= n.viewport.to)
    return [];
  let i = Math.max(t.from, n.viewport.from), r = Math.min(t.to, n.viewport.to), s = n.textDirection == Re.LTR, l = n.contentDOM, O = l.getBoundingClientRect(), h = _Q(n), f = l.querySelector(".cm-line"), u = f && window.getComputedStyle(f), d = O.left + (u ? parseInt(u.paddingLeft) + Math.min(0, parseInt(u.textIndent)) : 0), g = O.right - (u ? parseInt(u.paddingRight) : 0), Q = Kh(n, i), b = Kh(n, r), v = Q.type == Qt.Text ? Q : null, w = b.type == Qt.Text ? b : null;
  if (v && (n.lineWrapping || Q.widgetLineBreaks) && (v = zp(n, i, 1, v)), w && (n.lineWrapping || b.widgetLineBreaks) && (w = zp(n, r, -1, w)), v && w && v.from == w.from && v.to == w.to)
    return Y(U(t.from, t.to, v));
  {
    let W = v ? U(t.from, null, v) : V(Q, !1), M = w ? U(null, t.to, w) : V(b, !0), z = [];
    return (v || Q).to < (w || b).from - (v && w ? 1 : 0) || Q.widgetLineBreaks > 1 && W.bottom + n.defaultLineHeight / 2 < M.top ? z.push(Z(d, W.bottom, g, M.top)) : W.bottom < M.top && n.elementAtHeight((W.bottom + M.top) / 2).type == Qt.Text && (W.bottom = M.top = (W.bottom + M.top) / 2), Y(W).concat(z).concat(Y(M));
  }
  function Z(W, M, z, te) {
    return new to(
      e,
      W - h.left,
      M - h.top - 0.01,
      z - W,
      te - M + 0.01
      /* C.Epsilon */
    );
  }
  function Y({ top: W, bottom: M, horizontal: z }) {
    let te = [];
    for (let oe = 0; oe < z.length; oe += 2)
      te.push(Z(z[oe], W, z[oe + 1], M));
    return te;
  }
  function U(W, M, z) {
    let te = 1e9, oe = -1e9, fe = [];
    function le(N, pe, Fe, Ae, Ue) {
      let St = n.coordsAtPos(N, N == z.to ? -2 : 2), _e = n.coordsAtPos(Fe, Fe == z.from ? 2 : -2);
      !St || !_e || (te = Math.min(St.top, _e.top, te), oe = Math.max(St.bottom, _e.bottom, oe), Ue == Re.LTR ? fe.push(s && pe ? d : St.left, s && Ae ? g : _e.right) : fe.push(!s && Ae ? d : _e.left, !s && pe ? g : St.right));
    }
    let ne = W ?? z.from, E = M ?? z.to;
    for (let N of n.visibleRanges)
      if (N.to > ne && N.from < E)
        for (let pe = Math.max(N.from, ne), Fe = Math.min(N.to, E); ; ) {
          let Ae = n.state.doc.lineAt(pe);
          for (let Ue of n.bidiSpans(Ae)) {
            let St = Ue.from + Ae.from, _e = Ue.to + Ae.from;
            if (St >= Fe)
              break;
            _e > pe && le(Math.max(St, pe), W == null && St <= ne, Math.min(_e, Fe), M == null && _e >= E, Ue.dir);
          }
          if (pe = Ae.to + 1, pe >= Fe)
            break;
        }
    return fe.length == 0 && le(ne, W == null, E, M == null, n.textDirection), { top: te, bottom: oe, horizontal: fe };
  }
  function V(W, M) {
    let z = O.top + (M ? W.top : W.bottom);
    return { top: z, bottom: z, horizontal: [] };
  }
}
function KT(n, e) {
  return n.constructor == e.constructor && n.eq(e);
}
class eZ {
  constructor(e, t) {
    this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(Rl) != e.state.facet(Rl) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  docViewUpdate(e) {
    this.layer.updateOnDocViewUpdate !== !1 && e.requestMeasure(this.measureReq);
  }
  setOrder(e) {
    let t = 0, i = e.facet(Rl);
    for (; t < i.length && i[t] != this.layer; )
      t++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: t } = this.view;
    (e != this.scaleX || t != this.scaleY) && (this.scaleX = e, this.scaleY = t, this.dom.style.transform = `scale(${1 / e}, ${1 / t})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((t, i) => !KT(t, this.drawn[i]))) {
      let t = this.dom.firstChild, i = 0;
      for (let r of e)
        r.update && t && r.constructor && this.drawn[i].constructor && r.update(t, this.drawn[i]) ? (t = t.nextSibling, i++) : this.dom.insertBefore(r.draw(), t);
      for (; t; ) {
        let r = t.nextSibling;
        t.remove(), t = r;
      }
      this.drawn = e;
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const Rl = /* @__PURE__ */ j.define();
function XQ(n) {
  return [
    ze.define((e) => new eZ(e, n)),
    Rl.of(n)
  ];
}
const qQ = !B.ios, Es = /* @__PURE__ */ j.define({
  combine(n) {
    return ci(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0
    }, {
      cursorBlinkRate: (e, t) => Math.min(e, t),
      drawRangeCursor: (e, t) => e || t
    });
  }
});
function CQ(n = {}) {
  return [
    Es.of(n),
    tZ,
    iZ,
    nZ,
    rQ.of(!0)
  ];
}
function WQ(n) {
  return n.startState.facet(Es) != n.state.facet(Es);
}
const tZ = /* @__PURE__ */ XQ({
  above: !0,
  markers(n) {
    let { state: e } = n, t = e.facet(Es), i = [];
    for (let r of e.selection.ranges) {
      let s = r == e.selection.main;
      if (r.empty ? !s || qQ : t.drawRangeCursor) {
        let l = s ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", O = r.empty ? r : X.cursor(r.head, r.head > r.anchor ? -1 : 1);
        for (let h of to.forRange(n, l, O))
          i.push(h);
      }
    }
    return i;
  },
  update(n, e) {
    n.transactions.some((i) => i.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let t = WQ(n);
    return t && Ep(n.state, e), n.docChanged || n.selectionSet || t;
  },
  mount(n, e) {
    Ep(e.state, n);
  },
  class: "cm-cursorLayer"
});
function Ep(n, e) {
  e.style.animationDuration = n.facet(Es).cursorBlinkRate + "ms";
}
const iZ = /* @__PURE__ */ XQ({
  above: !1,
  markers(n) {
    return n.state.selection.ranges.map((e) => e.empty ? [] : to.forRange(n, "cm-selectionBackground", e)).reduce((e, t) => e.concat(t));
  },
  update(n, e) {
    return n.docChanged || n.selectionSet || n.viewportChanged || WQ(n);
  },
  class: "cm-selectionLayer"
}), sc = {
  ".cm-line": {
    "& ::selection, &::selection": { backgroundColor: "transparent !important" }
  },
  ".cm-content": {
    "& :focus": {
      caretColor: "initial !important",
      "&::selection, & ::selection": {
        backgroundColor: "Highlight !important"
      }
    }
  }
};
qQ && (sc[".cm-line"].caretColor = sc[".cm-content"].caretColor = "transparent !important");
const nZ = /* @__PURE__ */ Tn.highest(/* @__PURE__ */ I.theme(sc)), YQ = /* @__PURE__ */ ie.define({
  map(n, e) {
    return n == null ? null : e.mapPos(n);
  }
}), Ts = /* @__PURE__ */ Ne.define({
  create() {
    return null;
  },
  update(n, e) {
    return n != null && (n = e.changes.mapPos(n)), e.effects.reduce((t, i) => i.is(YQ) ? i.value : t, n);
  }
}), rZ = /* @__PURE__ */ ze.fromClass(class {
  constructor(n) {
    this.view = n, this.cursor = null, this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
  }
  update(n) {
    var e;
    let t = n.state.field(Ts);
    t == null ? this.cursor != null && ((e = this.cursor) === null || e === void 0 || e.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (n.startState.field(Ts) != t || n.docChanged || n.geometryChanged) && this.view.requestMeasure(this.measureReq));
  }
  readPos() {
    let { view: n } = this, e = n.state.field(Ts), t = e != null && n.coordsAtPos(e);
    if (!t)
      return null;
    let i = n.scrollDOM.getBoundingClientRect();
    return {
      left: t.left - i.left + n.scrollDOM.scrollLeft * n.scaleX,
      top: t.top - i.top + n.scrollDOM.scrollTop * n.scaleY,
      height: t.bottom - t.top
    };
  }
  drawCursor(n) {
    if (this.cursor) {
      let { scaleX: e, scaleY: t } = this.view;
      n ? (this.cursor.style.left = n.left / e + "px", this.cursor.style.top = n.top / t + "px", this.cursor.style.height = n.height / t + "px") : this.cursor.style.left = "-100000px";
    }
  }
  destroy() {
    this.cursor && this.cursor.remove();
  }
  setDropPos(n) {
    this.view.state.field(Ts) != n && this.view.dispatch({ effects: YQ.of(n) });
  }
}, {
  eventObservers: {
    dragover(n) {
      this.setDropPos(this.view.posAtCoords({ x: n.clientX, y: n.clientY }));
    },
    dragleave(n) {
      (n.target == this.view.contentDOM || !this.view.contentDOM.contains(n.relatedTarget)) && this.setDropPos(null);
    },
    dragend() {
      this.setDropPos(null);
    },
    drop() {
      this.setDropPos(null);
    }
  }
});
function sZ() {
  return [Ts, rZ];
}
function Mp(n, e, t, i, r) {
  e.lastIndex = 0;
  for (let s = n.iterRange(t, i), l = t, O; !s.next().done; l += s.value.length)
    if (!s.lineBreak)
      for (; O = e.exec(s.value); )
        r(l + O.index, O);
}
function oZ(n, e) {
  let t = n.visibleRanges;
  if (t.length == 1 && t[0].from == n.viewport.from && t[0].to == n.viewport.to)
    return t;
  let i = [];
  for (let { from: r, to: s } of t)
    r = Math.max(n.state.doc.lineAt(r).from, r - e), s = Math.min(n.state.doc.lineAt(s).to, s + e), i.length && i[i.length - 1].to >= r ? i[i.length - 1].to = s : i.push({ from: r, to: s });
  return i;
}
class lZ {
  /**
  Create a decorator.
  */
  constructor(e) {
    const { regexp: t, decoration: i, decorate: r, boundary: s, maxLength: l = 1e3 } = e;
    if (!t.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = t, r)
      this.addMatch = (O, h, f, u) => r(u, f, f + O[0].length, O, h);
    else if (typeof i == "function")
      this.addMatch = (O, h, f, u) => {
        let d = i(O, h, f);
        d && u(f, f + O[0].length, d);
      };
    else if (i)
      this.addMatch = (O, h, f, u) => u(f, f + O[0].length, i);
    else
      throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
    this.boundary = s, this.maxLength = l;
  }
  /**
  Compute the full set of decorations for matches in the given
  view's viewport. You'll want to call this when initializing your
  plugin.
  */
  createDeco(e) {
    let t = new Sn(), i = t.add.bind(t);
    for (let { from: r, to: s } of oZ(e, this.maxLength))
      Mp(e.state.doc, this.regexp, r, s, (l, O) => this.addMatch(O, e, l, i));
    return t.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(e, t) {
    let i = 1e9, r = -1;
    return e.docChanged && e.changes.iterChanges((s, l, O, h) => {
      h > e.view.viewport.from && O < e.view.viewport.to && (i = Math.min(O, i), r = Math.max(h, r));
    }), e.viewportChanged || r - i > 1e3 ? this.createDeco(e.view) : r > -1 ? this.updateRange(e.view, t.map(e.changes), i, r) : t;
  }
  updateRange(e, t, i, r) {
    for (let s of e.visibleRanges) {
      let l = Math.max(s.from, i), O = Math.min(s.to, r);
      if (O > l) {
        let h = e.state.doc.lineAt(l), f = h.to < O ? e.state.doc.lineAt(O) : h, u = Math.max(s.from, h.from), d = Math.min(s.to, f.to);
        if (this.boundary) {
          for (; l > h.from; l--)
            if (this.boundary.test(h.text[l - 1 - h.from])) {
              u = l;
              break;
            }
          for (; O < f.to; O++)
            if (this.boundary.test(f.text[O - f.from])) {
              d = O;
              break;
            }
        }
        let g = [], Q, b = (v, w, Z) => g.push(Z.range(v, w));
        if (h == f)
          for (this.regexp.lastIndex = u - h.from; (Q = this.regexp.exec(h.text)) && Q.index < d - h.from; )
            this.addMatch(Q, e, Q.index + h.from, b);
        else
          Mp(e.state.doc, this.regexp, u, d, (v, w) => this.addMatch(w, e, v, b));
        t = t.update({ filterFrom: u, filterTo: d, filter: (v, w) => v < u || w > d, add: g });
      }
    }
    return t;
  }
}
const oc = /x/.unicode != null ? "gu" : "g", aZ = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, oc), OZ = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8237: "left-to-right override",
  8238: "right-to-left override",
  8294: "left-to-right isolate",
  8295: "right-to-left isolate",
  8297: "pop directional isolate",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
let nh = null;
function hZ() {
  var n;
  if (nh == null && typeof document < "u" && document.body) {
    let e = document.body.style;
    nh = ((n = e.tabSize) !== null && n !== void 0 ? n : e.MozTabSize) != null;
  }
  return nh || !1;
}
const _l = /* @__PURE__ */ j.define({
  combine(n) {
    let e = ci(n, {
      render: null,
      specialChars: aZ,
      addSpecialChars: null
    });
    return (e.replaceTabs = !hZ()) && (e.specialChars = new RegExp("	|" + e.specialChars.source, oc)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, oc)), e;
  }
});
function AQ(n = {}) {
  return [_l.of(n), cZ()];
}
let Gp = null;
function cZ() {
  return Gp || (Gp = ze.fromClass(class {
    constructor(n) {
      this.view = n, this.decorations = H.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(n.state.facet(_l)), this.decorations = this.decorator.createDeco(n);
    }
    makeDecorator(n) {
      return new lZ({
        regexp: n.specialChars,
        decoration: (e, t, i) => {
          let { doc: r } = t.state, s = rt(e[0], 0);
          if (s == 9) {
            let l = r.lineAt(i), O = t.state.tabSize, h = zr(l.text, O, i - l.from);
            return H.replace({
              widget: new pZ((O - h % O) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[s] || (this.decorationCache[s] = H.replace({ widget: new dZ(n, s) }));
        },
        boundary: n.replaceTabs ? void 0 : /[^]/
      });
    }
    update(n) {
      let e = n.state.facet(_l);
      n.startState.facet(_l) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(n.view)) : this.decorations = this.decorator.updateDeco(n, this.decorations);
    }
  }, {
    decorations: (n) => n.decorations
  }));
}
const fZ = "•";
function uZ(n) {
  return n >= 32 ? fZ : n == 10 ? "␤" : String.fromCharCode(9216 + n);
}
class dZ extends Zi {
  constructor(e, t) {
    super(), this.options = e, this.code = t;
  }
  eq(e) {
    return e.code == this.code;
  }
  toDOM(e) {
    let t = uZ(this.code), i = e.state.phrase("Control character") + " " + (OZ[this.code] || "0x" + this.code.toString(16)), r = this.options.render && this.options.render(this.code, i, t);
    if (r)
      return r;
    let s = document.createElement("span");
    return s.textContent = t, s.title = i, s.setAttribute("aria-label", i), s.className = "cm-specialChar", s;
  }
  ignoreEvent() {
    return !1;
  }
}
class pZ extends Zi {
  constructor(e) {
    super(), this.width = e;
  }
  eq(e) {
    return e.width == this.width;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.textContent = "	", e.className = "cm-tab", e.style.width = this.width + "px", e;
  }
  ignoreEvent() {
    return !1;
  }
}
function gZ() {
  return QZ;
}
const mZ = /* @__PURE__ */ H.line({ class: "cm-activeLine" }), QZ = /* @__PURE__ */ ze.fromClass(class {
  constructor(n) {
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.docChanged || n.selectionSet) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = -1, t = [];
    for (let i of n.state.selection.ranges) {
      let r = n.lineBlockAt(i.head);
      r.from > e && (t.push(mZ.range(r.from)), e = r.from);
    }
    return H.set(t);
  }
}, {
  decorations: (n) => n.decorations
});
class PZ extends Zi {
  constructor(e) {
    super(), this.content = e;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.className = "cm-placeholder", e.style.pointerEvents = "none", e.appendChild(typeof this.content == "string" ? document.createTextNode(this.content) : this.content), typeof this.content == "string" ? e.setAttribute("aria-label", "placeholder " + this.content) : e.setAttribute("aria-hidden", "true"), e;
  }
  coordsAt(e) {
    let t = e.firstChild ? Cr(e.firstChild) : [];
    if (!t.length)
      return null;
    let i = window.getComputedStyle(e.parentNode), r = ua(t[0], i.direction != "rtl"), s = parseInt(i.lineHeight);
    return r.bottom - r.top > s * 1.5 ? { left: r.left, right: r.right, top: r.top, bottom: r.top + s } : r;
  }
  ignoreEvent() {
    return !1;
  }
}
function SZ(n) {
  return ze.fromClass(class {
    constructor(e) {
      this.view = e, this.placeholder = n ? H.set([H.widget({ widget: new PZ(n), side: 1 }).range(0)]) : H.none;
    }
    get decorations() {
      return this.view.state.doc.length ? H.none : this.placeholder;
    }
  }, { decorations: (e) => e.decorations });
}
const lc = 2e3;
function $Z(n, e, t) {
  let i = Math.min(e.line, t.line), r = Math.max(e.line, t.line), s = [];
  if (e.off > lc || t.off > lc || e.col < 0 || t.col < 0) {
    let l = Math.min(e.off, t.off), O = Math.max(e.off, t.off);
    for (let h = i; h <= r; h++) {
      let f = n.doc.line(h);
      f.length <= O && s.push(X.range(f.from + l, f.to + O));
    }
  } else {
    let l = Math.min(e.col, t.col), O = Math.max(e.col, t.col);
    for (let h = i; h <= r; h++) {
      let f = n.doc.line(h), u = Uh(f.text, l, n.tabSize, !0);
      if (u < 0)
        s.push(X.cursor(f.to));
      else {
        let d = Uh(f.text, O, n.tabSize);
        s.push(X.range(f.from + u, f.from + d));
      }
    }
  }
  return s;
}
function bZ(n, e) {
  let t = n.coordsAtPos(n.viewport.from);
  return t ? Math.round(Math.abs((t.left - e) / n.defaultCharacterWidth)) : -1;
}
function Dp(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), i = n.state.doc.lineAt(t), r = t - i.from, s = r > lc ? -1 : r == i.length ? bZ(n, e.clientX) : zr(i.text, n.state.tabSize, t - i.from);
  return { line: i.number, col: s, off: r };
}
function yZ(n, e) {
  let t = Dp(n, e), i = n.state.selection;
  return t ? {
    update(r) {
      if (r.docChanged) {
        let s = r.changes.mapPos(r.startState.doc.line(t.line).from), l = r.state.doc.lineAt(s);
        t = { line: l.number, col: t.col, off: Math.min(t.off, l.length) }, i = i.map(r.changes);
      }
    },
    get(r, s, l) {
      let O = Dp(n, r);
      if (!O)
        return i;
      let h = $Z(n.state, t, O);
      return h.length ? l ? X.create(h.concat(i.ranges)) : X.create(h) : i;
    }
  } : null;
}
function xZ(n) {
  let e = (t) => t.altKey && t.button == 0;
  return I.mouseSelectionStyle.of((t, i) => e(i) ? yZ(t, i) : null);
}
const vZ = {
  Alt: [18, (n) => !!n.altKey],
  Control: [17, (n) => !!n.ctrlKey],
  Shift: [16, (n) => !!n.shiftKey],
  Meta: [91, (n) => !!n.metaKey]
}, wZ = { style: "cursor: crosshair" };
function kZ(n = {}) {
  let [e, t] = vZ[n.key || "Alt"], i = ze.fromClass(class {
    constructor(r) {
      this.view = r, this.isDown = !1;
    }
    set(r) {
      this.isDown != r && (this.isDown = r, this.view.update([]));
    }
  }, {
    eventObservers: {
      keydown(r) {
        this.set(r.keyCode == e || t(r));
      },
      keyup(r) {
        (r.keyCode == e || !t(r)) && this.set(!1);
      },
      mousemove(r) {
        this.set(t(r));
      }
    }
  });
  return [
    i,
    I.contentAttributes.of((r) => {
      var s;
      return !((s = r.plugin(i)) === null || s === void 0) && s.isDown ? wZ : null;
    })
  ];
}
const Qs = "-10000px";
class UQ {
  constructor(e, t, i, r) {
    this.facet = t, this.createTooltipView = i, this.removeTooltipView = r, this.input = e.state.facet(t), this.tooltips = this.input.filter((l) => l);
    let s = null;
    this.tooltipViews = this.tooltips.map((l) => s = i(l, s));
  }
  update(e, t) {
    var i;
    let r = e.state.facet(this.facet), s = r.filter((h) => h);
    if (r === this.input) {
      for (let h of this.tooltipViews)
        h.update && h.update(e);
      return !1;
    }
    let l = [], O = t ? [] : null;
    for (let h = 0; h < s.length; h++) {
      let f = s[h], u = -1;
      if (f) {
        for (let d = 0; d < this.tooltips.length; d++) {
          let g = this.tooltips[d];
          g && g.create == f.create && (u = d);
        }
        if (u < 0)
          l[h] = this.createTooltipView(f, h ? l[h - 1] : null), O && (O[h] = !!f.above);
        else {
          let d = l[h] = this.tooltipViews[u];
          O && (O[h] = t[u]), d.update && d.update(e);
        }
      }
    }
    for (let h of this.tooltipViews)
      l.indexOf(h) < 0 && (this.removeTooltipView(h), (i = h.destroy) === null || i === void 0 || i.call(h));
    return t && (O.forEach((h, f) => t[f] = h), t.length = O.length), this.input = r, this.tooltips = s, this.tooltipViews = l, !0;
  }
}
function TZ(n) {
  let { win: e } = n;
  return { top: 0, left: 0, bottom: e.innerHeight, right: e.innerWidth };
}
const rh = /* @__PURE__ */ j.define({
  combine: (n) => {
    var e, t, i;
    return {
      position: B.ios ? "absolute" : ((e = n.find((r) => r.position)) === null || e === void 0 ? void 0 : e.position) || "fixed",
      parent: ((t = n.find((r) => r.parent)) === null || t === void 0 ? void 0 : t.parent) || null,
      tooltipSpace: ((i = n.find((r) => r.tooltipSpace)) === null || i === void 0 ? void 0 : i.tooltipSpace) || TZ
    };
  }
}), Ip = /* @__PURE__ */ new WeakMap(), zc = /* @__PURE__ */ ze.fromClass(class {
  constructor(n) {
    this.view = n, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let e = n.state.facet(rh);
    this.position = e.position, this.parent = e.parent, this.classes = n.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new UQ(n, pa, (t, i) => this.createTooltip(t, i), (t) => {
      this.resizeObserver && this.resizeObserver.unobserve(t.dom), t.dom.remove();
    }), this.above = this.manager.tooltips.map((t) => !!t.above), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((t) => {
      Date.now() > this.lastTransaction - 50 && t.length > 0 && t[t.length - 1].intersectionRatio < 1 && this.measureSoon();
    }, { threshold: [1] }) : null, this.observeIntersection(), n.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
  }
  createContainer() {
    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
  }
  observeIntersection() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      for (let n of this.manager.tooltipViews)
        this.intersectionObserver.observe(n.dom);
    }
  }
  measureSoon() {
    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
      this.measureTimeout = -1, this.maybeMeasure();
    }, 50));
  }
  update(n) {
    n.transactions.length && (this.lastTransaction = Date.now());
    let e = this.manager.update(n, this.above);
    e && this.observeIntersection();
    let t = e || n.geometryChanged, i = n.state.facet(rh);
    if (i.position != this.position && !this.madeAbsolute) {
      this.position = i.position;
      for (let r of this.manager.tooltipViews)
        r.dom.style.position = this.position;
      t = !0;
    }
    if (i.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = i.parent, this.createContainer();
      for (let r of this.manager.tooltipViews)
        this.container.appendChild(r.dom);
      t = !0;
    } else this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    t && this.maybeMeasure();
  }
  createTooltip(n, e) {
    let t = n.create(this.view), i = e ? e.dom : null;
    if (t.dom.classList.add("cm-tooltip"), n.arrow && !t.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let r = document.createElement("div");
      r.className = "cm-tooltip-arrow", t.dom.appendChild(r);
    }
    return t.dom.style.position = this.position, t.dom.style.top = Qs, t.dom.style.left = "0px", this.container.insertBefore(t.dom, i), t.mount && t.mount(this.view), this.resizeObserver && this.resizeObserver.observe(t.dom), t;
  }
  destroy() {
    var n, e, t;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let i of this.manager.tooltipViews)
      i.dom.remove(), (n = i.destroy) === null || n === void 0 || n.call(i);
    this.parent && this.container.remove(), (e = this.resizeObserver) === null || e === void 0 || e.disconnect(), (t = this.intersectionObserver) === null || t === void 0 || t.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let n = this.view.dom.getBoundingClientRect(), e = 1, t = 1, i = !1;
    if (this.position == "fixed" && this.manager.tooltipViews.length) {
      let { dom: r } = this.manager.tooltipViews[0];
      if (B.gecko)
        i = r.offsetParent != this.container.ownerDocument.body;
      else if (r.style.top == Qs && r.style.left == "0px") {
        let s = r.getBoundingClientRect();
        i = Math.abs(s.top + 1e4) > 1 || Math.abs(s.left) > 1;
      }
    }
    if (i || this.position == "absolute")
      if (this.parent) {
        let r = this.parent.getBoundingClientRect();
        r.width && r.height && (e = r.width / this.parent.offsetWidth, t = r.height / this.parent.offsetHeight);
      } else
        ({ scaleX: e, scaleY: t } = this.view.viewState);
    return {
      editor: n,
      parent: this.parent ? this.container.getBoundingClientRect() : n,
      pos: this.manager.tooltips.map((r, s) => {
        let l = this.manager.tooltipViews[s];
        return l.getCoords ? l.getCoords(r.pos) : this.view.coordsAtPos(r.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: r }) => r.getBoundingClientRect()),
      space: this.view.state.facet(rh).tooltipSpace(this.view),
      scaleX: e,
      scaleY: t,
      makeAbsolute: i
    };
  }
  writeMeasure(n) {
    var e;
    if (n.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let O of this.manager.tooltipViews)
        O.dom.style.position = "absolute";
    }
    let { editor: t, space: i, scaleX: r, scaleY: s } = n, l = [];
    for (let O = 0; O < this.manager.tooltips.length; O++) {
      let h = this.manager.tooltips[O], f = this.manager.tooltipViews[O], { dom: u } = f, d = n.pos[O], g = n.size[O];
      if (!d || d.bottom <= Math.max(t.top, i.top) || d.top >= Math.min(t.bottom, i.bottom) || d.right < Math.max(t.left, i.left) - 0.1 || d.left > Math.min(t.right, i.right) + 0.1) {
        u.style.top = Qs;
        continue;
      }
      let Q = h.arrow ? f.dom.querySelector(".cm-tooltip-arrow") : null, b = Q ? 7 : 0, v = g.right - g.left, w = (e = Ip.get(f)) !== null && e !== void 0 ? e : g.bottom - g.top, Z = f.offset || RZ, Y = this.view.textDirection == Re.LTR, U = g.width > i.right - i.left ? Y ? i.left : i.right - g.width : Y ? Math.min(d.left - (Q ? 14 : 0) + Z.x, i.right - v) : Math.max(i.left, d.left - v + (Q ? 14 : 0) - Z.x), V = this.above[O];
      !h.strictSide && (V ? d.top - (g.bottom - g.top) - Z.y < i.top : d.bottom + (g.bottom - g.top) + Z.y > i.bottom) && V == i.bottom - d.bottom > d.top - i.top && (V = this.above[O] = !V);
      let W = (V ? d.top - i.top : i.bottom - d.bottom) - b;
      if (W < w && f.resize !== !1) {
        if (W < this.view.defaultLineHeight) {
          u.style.top = Qs;
          continue;
        }
        Ip.set(f, w), u.style.height = (w = W) / s + "px";
      } else u.style.height && (u.style.height = "");
      let M = V ? d.top - w - b - Z.y : d.bottom + b + Z.y, z = U + v;
      if (f.overlap !== !0)
        for (let te of l)
          te.left < z && te.right > U && te.top < M + w && te.bottom > M && (M = V ? te.top - w - 2 - b : te.bottom + b + 2);
      if (this.position == "absolute" ? (u.style.top = (M - n.parent.top) / s + "px", u.style.left = (U - n.parent.left) / r + "px") : (u.style.top = M / s + "px", u.style.left = U / r + "px"), Q) {
        let te = d.left + (Y ? Z.x : -Z.x) - (U + 14 - 7);
        Q.style.left = te / r + "px";
      }
      f.overlap !== !0 && l.push({ left: U, top: M, right: z, bottom: M + w }), u.classList.toggle("cm-tooltip-above", V), u.classList.toggle("cm-tooltip-below", !V), f.positioned && f.positioned(n.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let n of this.manager.tooltipViews)
        n.dom.style.top = Qs;
  }
}, {
  eventObservers: {
    scroll() {
      this.maybeMeasure();
    }
  }
}), ZZ = /* @__PURE__ */ I.baseTheme({
  ".cm-tooltip": {
    zIndex: 100,
    boxSizing: "border-box"
  },
  "&light .cm-tooltip": {
    border: "1px solid #bbb",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #bbb"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tooltip-arrow": {
    height: "7px",
    width: `${7 * 2}px`,
    position: "absolute",
    zIndex: -1,
    overflow: "hidden",
    "&:before, &:after": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent"
    },
    ".cm-tooltip-above &": {
      bottom: "-7px",
      "&:before": {
        borderTop: "7px solid #bbb"
      },
      "&:after": {
        borderTop: "7px solid #f5f5f5",
        bottom: "1px"
      }
    },
    ".cm-tooltip-below &": {
      top: "-7px",
      "&:before": {
        borderBottom: "7px solid #bbb"
      },
      "&:after": {
        borderBottom: "7px solid #f5f5f5",
        top: "1px"
      }
    }
  },
  "&dark .cm-tooltip .cm-tooltip-arrow": {
    "&:before": {
      borderTopColor: "#333338",
      borderBottomColor: "#333338"
    },
    "&:after": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    }
  }
}), RZ = { x: 0, y: 0 }, pa = /* @__PURE__ */ j.define({
  enables: [zc, ZZ]
}), Ll = /* @__PURE__ */ j.define({
  combine: (n) => n.reduce((e, t) => e.concat(t), [])
});
class ga {
  // Needs to be static so that host tooltip instances always match
  static create(e) {
    return new ga(e);
  }
  constructor(e) {
    this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new UQ(e, Ll, (t, i) => this.createHostedView(t, i), (t) => t.dom.remove());
  }
  createHostedView(e, t) {
    let i = e.create(this.view);
    return i.dom.classList.add("cm-tooltip-section"), this.dom.insertBefore(i.dom, t ? t.dom.nextSibling : this.dom.firstChild), this.mounted && i.mount && i.mount(this.view), i;
  }
  mount(e) {
    for (let t of this.manager.tooltipViews)
      t.mount && t.mount(e);
    this.mounted = !0;
  }
  positioned(e) {
    for (let t of this.manager.tooltipViews)
      t.positioned && t.positioned(e);
  }
  update(e) {
    this.manager.update(e);
  }
  destroy() {
    var e;
    for (let t of this.manager.tooltipViews)
      (e = t.destroy) === null || e === void 0 || e.call(t);
  }
  passProp(e) {
    let t;
    for (let i of this.manager.tooltipViews) {
      let r = i[e];
      if (r !== void 0) {
        if (t === void 0)
          t = r;
        else if (t !== r)
          return;
      }
    }
    return t;
  }
  get offset() {
    return this.passProp("offset");
  }
  get getCoords() {
    return this.passProp("getCoords");
  }
  get overlap() {
    return this.passProp("overlap");
  }
  get resize() {
    return this.passProp("resize");
  }
}
const _Z = /* @__PURE__ */ pa.compute([Ll], (n) => {
  let e = n.facet(Ll);
  return e.length === 0 ? null : {
    pos: Math.min(...e.map((t) => t.pos)),
    end: Math.max(...e.map((t) => {
      var i;
      return (i = t.end) !== null && i !== void 0 ? i : t.pos;
    })),
    create: ga.create,
    above: e[0].above,
    arrow: e.some((t) => t.arrow)
  };
});
class XZ {
  constructor(e, t, i, r, s) {
    this.view = e, this.source = t, this.field = i, this.setHover = r, this.hoverTime = s, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: e.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), e.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), e.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update() {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active.length)
      return;
    let e = Date.now() - this.lastMove.time;
    e < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - e) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: e, lastMove: t } = this, i = e.docView.nearest(t.target);
    if (!i)
      return;
    let r, s = 1;
    if (i instanceof pn)
      r = i.posAtStart;
    else {
      if (r = e.posAtCoords(t), r == null)
        return;
      let O = e.coordsAtPos(r);
      if (!O || t.y < O.top || t.y > O.bottom || t.x < O.left - e.defaultCharacterWidth || t.x > O.right + e.defaultCharacterWidth)
        return;
      let h = e.bidiSpans(e.state.doc.lineAt(r)).find((u) => u.from <= r && u.to >= r), f = h && h.dir == Re.RTL ? -1 : 1;
      s = t.x < O.left ? -f : f;
    }
    let l = this.source(e, r, s);
    if (l != null && l.then) {
      let O = this.pending = { pos: r };
      l.then((h) => {
        this.pending == O && (this.pending = null, h && !(Array.isArray(h) && !h.length) && e.dispatch({ effects: this.setHover.of(Array.isArray(h) ? h : [h]) }));
      }, (h) => mt(e.state, h, "hover tooltip"));
    } else l && !(Array.isArray(l) && !l.length) && e.dispatch({ effects: this.setHover.of(Array.isArray(l) ? l : [l]) });
  }
  get tooltip() {
    let e = this.view.plugin(zc), t = e ? e.manager.tooltips.findIndex((i) => i.create == ga.create) : -1;
    return t > -1 ? e.manager.tooltipViews[t] : null;
  }
  mousemove(e) {
    var t, i;
    this.lastMove = { x: e.clientX, y: e.clientY, target: e.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let { active: r, tooltip: s } = this;
    if (r.length && s && !qZ(s.dom, e) || this.pending) {
      let { pos: l } = r[0] || this.pending, O = (i = (t = r[0]) === null || t === void 0 ? void 0 : t.end) !== null && i !== void 0 ? i : l;
      (l == O ? this.view.posAtCoords(this.lastMove) != l : !CZ(this.view, l, O, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of([]) }), this.pending = null);
    }
  }
  mouseleave(e) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
    let { active: t } = this;
    if (t.length) {
      let { tooltip: i } = this;
      i && i.dom.contains(e.relatedTarget) ? this.watchTooltipLeave(i.dom) : this.view.dispatch({ effects: this.setHover.of([]) });
    }
  }
  watchTooltipLeave(e) {
    let t = (i) => {
      e.removeEventListener("mouseleave", t), this.active.length && !this.view.dom.contains(i.relatedTarget) && this.view.dispatch({ effects: this.setHover.of([]) });
    };
    e.addEventListener("mouseleave", t);
  }
  destroy() {
    clearTimeout(this.hoverTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
const ul = 4;
function qZ(n, e) {
  let t = n.getBoundingClientRect();
  return e.clientX >= t.left - ul && e.clientX <= t.right + ul && e.clientY >= t.top - ul && e.clientY <= t.bottom + ul;
}
function CZ(n, e, t, i, r, s) {
  let l = n.scrollDOM.getBoundingClientRect(), O = n.documentTop + n.documentPadding.top + n.contentHeight;
  if (l.left > i || l.right < i || l.top > r || Math.min(l.bottom, O) < r)
    return !1;
  let h = n.posAtCoords({ x: i, y: r }, !1);
  return h >= e && h <= t;
}
function WZ(n, e = {}) {
  let t = ie.define(), i = Ne.define({
    create() {
      return [];
    },
    update(r, s) {
      if (r.length && (e.hideOnChange && (s.docChanged || s.selection) ? r = [] : e.hideOn && (r = r.filter((l) => !e.hideOn(s, l))), s.docChanged)) {
        let l = [];
        for (let O of r) {
          let h = s.changes.mapPos(O.pos, -1, ot.TrackDel);
          if (h != null) {
            let f = Object.assign(/* @__PURE__ */ Object.create(null), O);
            f.pos = h, f.end != null && (f.end = s.changes.mapPos(f.end)), l.push(f);
          }
        }
        r = l;
      }
      for (let l of s.effects)
        l.is(t) && (r = l.value), l.is(YZ) && (r = []);
      return r;
    },
    provide: (r) => Ll.from(r)
  });
  return [
    i,
    ze.define((r) => new XZ(
      r,
      n,
      i,
      t,
      e.hoverTime || 300
      /* Hover.Time */
    )),
    _Z
  ];
}
function VQ(n, e) {
  let t = n.plugin(zc);
  if (!t)
    return null;
  let i = t.manager.tooltips.indexOf(e);
  return i < 0 ? null : t.manager.tooltipViews[i];
}
const YZ = /* @__PURE__ */ ie.define(), Lp = /* @__PURE__ */ j.define({
  combine(n) {
    let e, t;
    for (let i of n)
      e = e || i.topContainer, t = t || i.bottomContainer;
    return { topContainer: e, bottomContainer: t };
  }
});
function Ms(n, e) {
  let t = n.plugin(zQ), i = t ? t.specs.indexOf(e) : -1;
  return i > -1 ? t.panels[i] : null;
}
const zQ = /* @__PURE__ */ ze.fromClass(class {
  constructor(n) {
    this.input = n.state.facet(Gs), this.specs = this.input.filter((t) => t), this.panels = this.specs.map((t) => t(n));
    let e = n.state.facet(Lp);
    this.top = new dl(n, !0, e.topContainer), this.bottom = new dl(n, !1, e.bottomContainer), this.top.sync(this.panels.filter((t) => t.top)), this.bottom.sync(this.panels.filter((t) => !t.top));
    for (let t of this.panels)
      t.dom.classList.add("cm-panel"), t.mount && t.mount();
  }
  update(n) {
    let e = n.state.facet(Lp);
    this.top.container != e.topContainer && (this.top.sync([]), this.top = new dl(n.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new dl(n.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let t = n.state.facet(Gs);
    if (t != this.input) {
      let i = t.filter((h) => h), r = [], s = [], l = [], O = [];
      for (let h of i) {
        let f = this.specs.indexOf(h), u;
        f < 0 ? (u = h(n.view), O.push(u)) : (u = this.panels[f], u.update && u.update(n)), r.push(u), (u.top ? s : l).push(u);
      }
      this.specs = i, this.panels = r, this.top.sync(s), this.bottom.sync(l);
      for (let h of O)
        h.dom.classList.add("cm-panel"), h.mount && h.mount();
    } else
      for (let i of this.panels)
        i.update && i.update(n);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (n) => I.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return t && { top: t.top.scrollMargin(), bottom: t.bottom.scrollMargin() };
  })
});
class dl {
  constructor(e, t, i) {
    this.view = e, this.top = t, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(e) {
    for (let t of this.panels)
      t.destroy && e.indexOf(t) < 0 && t.destroy();
    this.panels = e, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let e = this.dom.firstChild;
    for (let t of this.panels)
      if (t.dom.parentNode == this.dom) {
        for (; e != t.dom; )
          e = Bp(e);
        e = e.nextSibling;
      } else
        this.dom.insertBefore(t.dom, e);
    for (; e; )
      e = Bp(e);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let e of this.classes.split(" "))
        e && this.container.classList.remove(e);
      for (let e of (this.classes = this.view.themeClasses).split(" "))
        e && this.container.classList.add(e);
    }
  }
}
function Bp(n) {
  let e = n.nextSibling;
  return n.remove(), e;
}
const Gs = /* @__PURE__ */ j.define({
  enables: zQ
});
class Ti extends Hn {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
Ti.prototype.elementClass = "";
Ti.prototype.toDOM = void 0;
Ti.prototype.mapMode = ot.TrackBefore;
Ti.prototype.startSide = Ti.prototype.endSide = -1;
Ti.prototype.point = !0;
const Xl = /* @__PURE__ */ j.define(), AZ = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => Qe.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {}
}, Cs = /* @__PURE__ */ j.define();
function EQ(n) {
  return [MQ(), Cs.of(Object.assign(Object.assign({}, AZ), n))];
}
const jp = /* @__PURE__ */ j.define({
  combine: (n) => n.some((e) => e)
});
function MQ(n) {
  return [
    UZ
  ];
}
const UZ = /* @__PURE__ */ ze.fromClass(class {
  constructor(n) {
    this.view = n, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(Cs).map((e) => new Fp(n, e));
    for (let e of this.gutters)
      this.dom.appendChild(e.dom);
    this.fixed = !n.state.facet(jp), this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  update(n) {
    if (this.updateGutters(n)) {
      let e = this.prevViewport, t = n.view.viewport, i = Math.min(e.to, t.to) - Math.max(e.from, t.from);
      this.syncGutters(i < (t.to - t.from) * 0.8);
    }
    n.geometryChanged && (this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px"), this.view.state.facet(jp) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : ""), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let e = this.dom.nextSibling;
    n && this.dom.remove();
    let t = Qe.iter(this.view.state.facet(Xl), this.view.viewport.from), i = [], r = this.gutters.map((s) => new VZ(s, this.view.viewport, -this.view.documentPadding.top));
    for (let s of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(s.type)) {
        let l = !0;
        for (let O of s.type)
          if (O.type == Qt.Text && l) {
            ac(t, i, O.from);
            for (let h of r)
              h.line(this.view, O, i);
            l = !1;
          } else if (O.widget)
            for (let h of r)
              h.widget(this.view, O);
      } else if (s.type == Qt.Text) {
        ac(t, i, s.from);
        for (let l of r)
          l.line(this.view, s, i);
      } else if (s.widget)
        for (let l of r)
          l.widget(this.view, s);
    for (let s of r)
      s.finish();
    n && this.view.scrollDOM.insertBefore(this.dom, e);
  }
  updateGutters(n) {
    let e = n.startState.facet(Cs), t = n.state.facet(Cs), i = n.docChanged || n.heightChanged || n.viewportChanged || !Qe.eq(n.startState.facet(Xl), n.state.facet(Xl), n.view.viewport.from, n.view.viewport.to);
    if (e == t)
      for (let r of this.gutters)
        r.update(n) && (i = !0);
    else {
      i = !0;
      let r = [];
      for (let s of t) {
        let l = e.indexOf(s);
        l < 0 ? r.push(new Fp(this.view, s)) : (this.gutters[l].update(n), r.push(this.gutters[l]));
      }
      for (let s of this.gutters)
        s.dom.remove(), r.indexOf(s) < 0 && s.destroy();
      for (let s of r)
        this.dom.appendChild(s.dom);
      this.gutters = r;
    }
    return i;
  }
  destroy() {
    for (let n of this.gutters)
      n.destroy();
    this.dom.remove();
  }
}, {
  provide: (n) => I.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return !t || t.gutters.length == 0 || !t.fixed ? null : e.textDirection == Re.LTR ? { left: t.dom.offsetWidth * e.scaleX } : { right: t.dom.offsetWidth * e.scaleX };
  })
});
function Np(n) {
  return Array.isArray(n) ? n : [n];
}
function ac(n, e, t) {
  for (; n.value && n.from <= t; )
    n.from == t && e.push(n.value), n.next();
}
class VZ {
  constructor(e, t, i) {
    this.gutter = e, this.height = i, this.i = 0, this.cursor = Qe.iter(e.markers, t.from);
  }
  addElement(e, t, i) {
    let { gutter: r } = this, s = (t.top - this.height) / e.scaleY, l = t.height / e.scaleY;
    if (this.i == r.elements.length) {
      let O = new GQ(e, l, s, i);
      r.elements.push(O), r.dom.appendChild(O.dom);
    } else
      r.elements[this.i].update(e, l, s, i);
    this.height = t.bottom, this.i++;
  }
  line(e, t, i) {
    let r = [];
    ac(this.cursor, r, t.from), i.length && (r = r.concat(i));
    let s = this.gutter.config.lineMarker(e, t, r);
    s && r.unshift(s);
    let l = this.gutter;
    r.length == 0 && !l.config.renderEmptyElements || this.addElement(e, t, r);
  }
  widget(e, t) {
    let i = this.gutter.config.widgetMarker(e, t.widget, t);
    i && this.addElement(e, t, [i]);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let t = e.elements.pop();
      e.dom.removeChild(t.dom), t.destroy();
    }
  }
}
class Fp {
  constructor(e, t) {
    this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in t.domEventHandlers)
      this.dom.addEventListener(i, (r) => {
        let s = r.target, l;
        if (s != this.dom && this.dom.contains(s)) {
          for (; s.parentNode != this.dom; )
            s = s.parentNode;
          let h = s.getBoundingClientRect();
          l = (h.top + h.bottom) / 2;
        } else
          l = r.clientY;
        let O = e.lineBlockAtHeight(l - e.documentTop);
        t.domEventHandlers[i](e, O, r) && r.preventDefault();
      });
    this.markers = Np(t.markers(e)), t.initialSpacer && (this.spacer = new GQ(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let t = this.markers;
    if (this.markers = Np(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let r = this.config.updateSpacer(this.spacer.markers[0], e);
      r != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [r]);
    }
    let i = e.view.viewport;
    return !Qe.eq(this.markers, t, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class GQ {
  constructor(e, t, i, r) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, i, r);
  }
  update(e, t, i, r) {
    this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""), zZ(this.markers, r) || this.setMarkers(e, r);
  }
  setMarkers(e, t) {
    let i = "cm-gutterElement", r = this.dom.firstChild;
    for (let s = 0, l = 0; ; ) {
      let O = l, h = s < t.length ? t[s++] : null, f = !1;
      if (h) {
        let u = h.elementClass;
        u && (i += " " + u);
        for (let d = l; d < this.markers.length; d++)
          if (this.markers[d].compare(h)) {
            O = d, f = !0;
            break;
          }
      } else
        O = this.markers.length;
      for (; l < O; ) {
        let u = this.markers[l++];
        if (u.toDOM) {
          u.destroy(r);
          let d = r.nextSibling;
          r.remove(), r = d;
        }
      }
      if (!h)
        break;
      h.toDOM && (f ? r = r.nextSibling : this.dom.insertBefore(h.toDOM(e), r)), f && l++;
    }
    this.dom.className = i, this.markers = t;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function zZ(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].compare(e[t]))
      return !1;
  return !0;
}
const EZ = /* @__PURE__ */ j.define(), br = /* @__PURE__ */ j.define({
  combine(n) {
    return ci(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, t) {
        let i = Object.assign({}, e);
        for (let r in t) {
          let s = i[r], l = t[r];
          i[r] = s ? (O, h, f) => s(O, h, f) || l(O, h, f) : l;
        }
        return i;
      }
    });
  }
});
class sh extends Ti {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function oh(n, e) {
  return n.state.facet(br).formatNumber(e, n.state);
}
const MZ = /* @__PURE__ */ Cs.compute([br], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(EZ);
  },
  lineMarker(e, t, i) {
    return i.some((r) => r.toDOM) ? null : new sh(oh(e, e.state.doc.lineAt(t.from).number));
  },
  widgetMarker: () => null,
  lineMarkerChange: (e) => e.startState.facet(br) != e.state.facet(br),
  initialSpacer(e) {
    return new sh(oh(e, Hp(e.state.doc.lines)));
  },
  updateSpacer(e, t) {
    let i = oh(t.view, Hp(t.view.state.doc.lines));
    return i == e.number ? e : new sh(i);
  },
  domEventHandlers: n.facet(br).domEventHandlers
}));
function GZ(n = {}) {
  return [
    br.of(n),
    MQ(),
    MZ
  ];
}
function Hp(n) {
  let e = 9;
  for (; e < n; )
    e = e * 10 + 9;
  return e;
}
const DZ = /* @__PURE__ */ new class extends Ti {
  constructor() {
    super(...arguments), this.elementClass = "cm-activeLineGutter";
  }
}(), IZ = /* @__PURE__ */ Xl.compute(["selection"], (n) => {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let r = n.doc.lineAt(i.head).from;
    r > t && (t = r, e.push(DZ.range(r)));
  }
  return Qe.of(e);
});
function LZ() {
  return IZ;
}
const DQ = 1024;
let BZ = 0;
class lh {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
class ue {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = BZ++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    });
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = Rt.match(e)), (t) => {
      let i = e(t);
      return i === void 0 ? null : [this, i];
    };
  }
}
ue.closedBy = new ue({ deserialize: (n) => n.split(" ") });
ue.openedBy = new ue({ deserialize: (n) => n.split(" ") });
ue.group = new ue({ deserialize: (n) => n.split(" ") });
ue.isolate = new ue({ deserialize: (n) => {
  if (n && n != "rtl" && n != "ltr" && n != "auto")
    throw new RangeError("Invalid value for isolate: " + n);
  return n || "auto";
} });
ue.contextHash = new ue({ perNode: !0 });
ue.lookAhead = new ue({ perNode: !0 });
ue.mounted = new ue({ perNode: !0 });
class Bl {
  constructor(e, t, i) {
    this.tree = e, this.overlay = t, this.parser = i;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[ue.mounted.id];
  }
}
const jZ = /* @__PURE__ */ Object.create(null);
class Rt {
  /**
  @internal
  */
  constructor(e, t, i, r = 0) {
    this.name = e, this.props = t, this.id = i, this.flags = r;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let t = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : jZ, i = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), r = new Rt(e.name || "", t, e.id, i);
    if (e.props) {
      for (let s of e.props)
        if (Array.isArray(s) || (s = s(r)), s) {
          if (s[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          t[s[0].id] = s[1];
        }
    }
    return r;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let t = this.prop(ue.group);
      return t ? t.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e)
      for (let r of i.split(" "))
        t[r] = e[i];
    return (i) => {
      for (let r = i.prop(ue.group), s = -1; s < (r ? r.length : 0); s++) {
        let l = t[s < 0 ? i.name : r[s]];
        if (l)
          return l;
      }
    };
  }
}
Rt.none = new Rt(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class Ec {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(e) {
    this.types = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].id != t)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...e) {
    let t = [];
    for (let i of this.types) {
      let r = null;
      for (let s of e) {
        let l = s(i);
        l && (r || (r = Object.assign({}, i.props)), r[l[0].id] = l[1]);
      }
      t.push(r ? new Rt(i.name, r, i.id, i.flags) : i);
    }
    return new Ec(t);
  }
}
const pl = /* @__PURE__ */ new WeakMap(), Jp = /* @__PURE__ */ new WeakMap();
var Le;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays";
})(Le || (Le = {}));
class je {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, t, i, r, s) {
    if (this.type = e, this.children = t, this.positions = i, this.length = r, this.props = null, s && s.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [l, O] of s)
        this.props[typeof l == "number" ? l : l.id] = O;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = Bl.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let t = "";
    for (let i of this.children) {
      let r = i.toString();
      r && (t && (t += ","), t += r);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new hc(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, t = 0, i = 0) {
    let r = pl.get(this) || this.topNode, s = new hc(r);
    return s.moveTo(e, t), pl.set(this, s._tree), s;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new Zt(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, t = 0) {
    let i = Ds(pl.get(this) || this.topNode, e, t, !1);
    return pl.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, t = 0) {
    let i = Ds(Jp.get(this) || this.topNode, e, t, !0);
    return Jp.set(this, i), i;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, t = 0) {
    return HZ(this, e, t);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: t, leave: i, from: r = 0, to: s = this.length } = e, l = e.mode || 0, O = (l & Le.IncludeAnonymous) > 0;
    for (let h = this.cursor(l | Le.IncludeAnonymous); ; ) {
      let f = !1;
      if (h.from <= s && h.to >= r && (!O && h.type.isAnonymous || t(h) !== !1)) {
        if (h.firstChild())
          continue;
        f = !0;
      }
      for (; f && i && (O || !h.type.isAnonymous) && i(h), !h.nextSibling(); ) {
        if (!h.parent())
          return;
        f = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let t in this.props)
        e.push([+t, this.props[t]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : Dc(Rt.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, i, r) => new je(this.type, t, i, r, this.propValues), e.makeTree || ((t, i, r) => new je(Rt.none, t, i, r)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return JZ(e);
  }
}
je.empty = new je(Rt.none, [], [], 0);
class Mc {
  constructor(e, t) {
    this.buffer = e, this.index = t;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new Mc(this.buffer, this.index);
  }
}
class xn {
  /**
  Create a tree buffer.
  */
  constructor(e, t, i) {
    this.buffer = e, this.length = t, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return Rt.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let t = 0; t < this.buffer.length; )
      e.push(this.childString(t)), t = this.buffer[t + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let t = this.buffer[e], i = this.buffer[e + 3], r = this.set.types[t], s = r.name;
    if (/\W/.test(s) && !r.isError && (s = JSON.stringify(s)), e += 4, i == e)
      return s;
    let l = [];
    for (; e < i; )
      l.push(this.childString(e)), e = this.buffer[e + 3];
    return s + "(" + l.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, t, i, r, s) {
    let { buffer: l } = this, O = -1;
    for (let h = e; h != t && !(IQ(s, r, l[h + 1], l[h + 2]) && (O = h, i > 0)); h = l[h + 3])
      ;
    return O;
  }
  /**
  @internal
  */
  slice(e, t, i) {
    let r = this.buffer, s = new Uint16Array(t - e), l = 0;
    for (let O = e, h = 0; O < t; ) {
      s[h++] = r[O++], s[h++] = r[O++] - i;
      let f = s[h++] = r[O++] - i;
      s[h++] = r[O++] - e, l = Math.max(l, f);
    }
    return new xn(s, l, this.set);
  }
}
function IQ(n, e, t, i) {
  switch (n) {
    case -2:
      return t < e;
    case -1:
      return i >= e && t < e;
    case 0:
      return t < e && i > e;
    case 1:
      return t <= e && i > e;
    case 2:
      return i > e;
    case 4:
      return !0;
  }
}
function Ds(n, e, t, i) {
  for (var r; n.from == n.to || (t < 1 ? n.from >= e : n.from > e) || (t > -1 ? n.to <= e : n.to < e); ) {
    let l = !i && n instanceof Zt && n.index < 0 ? null : n.parent;
    if (!l)
      return n;
    n = l;
  }
  let s = i ? 0 : Le.IgnoreOverlays;
  if (i)
    for (let l = n, O = l.parent; O; l = O, O = l.parent)
      l instanceof Zt && l.index < 0 && ((r = O.enter(e, t, s)) === null || r === void 0 ? void 0 : r.from) != l.from && (n = O);
  for (; ; ) {
    let l = n.enter(e, t, s);
    if (!l)
      return n;
    n = l;
  }
}
class LQ {
  cursor(e = 0) {
    return new hc(this, e);
  }
  getChild(e, t = null, i = null) {
    let r = Kp(this, e, t, i);
    return r.length ? r[0] : null;
  }
  getChildren(e, t = null, i = null) {
    return Kp(this, e, t, i);
  }
  resolve(e, t = 0) {
    return Ds(this, e, t, !1);
  }
  resolveInner(e, t = 0) {
    return Ds(this, e, t, !0);
  }
  matchContext(e) {
    return Oc(this, e);
  }
  enterUnfinishedNodesBefore(e) {
    let t = this.childBefore(e), i = this;
    for (; t; ) {
      let r = t.lastChild;
      if (!r || r.to != t.to)
        break;
      r.type.isError && r.from == r.to ? (i = t, t = r.prevSibling) : t = r;
    }
    return i;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class Zt extends LQ {
  constructor(e, t, i, r) {
    super(), this._tree = e, this.from = t, this.index = i, this._parent = r;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, t, i, r, s = 0) {
    for (let l = this; ; ) {
      for (let { children: O, positions: h } = l._tree, f = t > 0 ? O.length : -1; e != f; e += t) {
        let u = O[e], d = h[e] + l.from;
        if (IQ(r, i, d, d + u.length)) {
          if (u instanceof xn) {
            if (s & Le.ExcludeBuffers)
              continue;
            let g = u.findChild(0, u.buffer.length, t, i - d, r);
            if (g > -1)
              return new yi(new NZ(l, u, e, d), null, g);
          } else if (s & Le.IncludeAnonymous || !u.type.isAnonymous || Gc(u)) {
            let g;
            if (!(s & Le.IgnoreMounts) && (g = Bl.get(u)) && !g.overlay)
              return new Zt(g.tree, d, e, l);
            let Q = new Zt(u, d, e, l);
            return s & Le.IncludeAnonymous || !Q.type.isAnonymous ? Q : Q.nextChild(t < 0 ? u.children.length - 1 : 0, t, i, r);
          }
        }
      }
      if (s & Le.IncludeAnonymous || !l.type.isAnonymous || (l.index >= 0 ? e = l.index + t : e = t < 0 ? -1 : l._parent._tree.children.length, l = l._parent, !l))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    let r;
    if (!(i & Le.IgnoreOverlays) && (r = Bl.get(this._tree)) && r.overlay) {
      let s = e - this.from;
      for (let { from: l, to: O } of r.overlay)
        if ((t > 0 ? l <= s : l < s) && (t < 0 ? O >= s : O > s))
          return new Zt(r.tree, r.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, t, i);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function Kp(n, e, t, i) {
  let r = n.cursor(), s = [];
  if (!r.firstChild())
    return s;
  if (t != null) {
    for (let l = !1; !l; )
      if (l = r.type.is(t), !r.nextSibling())
        return s;
  }
  for (; ; ) {
    if (i != null && r.type.is(i))
      return s;
    if (r.type.is(e) && s.push(r.node), !r.nextSibling())
      return i == null ? s : [];
  }
}
function Oc(n, e, t = e.length - 1) {
  for (let i = n.parent; t >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (e[t] && e[t] != i.name)
        return !1;
      t--;
    }
  }
  return !0;
}
class NZ {
  constructor(e, t, i, r) {
    this.parent = e, this.buffer = t, this.index = i, this.start = r;
  }
}
class yi extends LQ {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, t, i) {
    super(), this.context = e, this._parent = t, this.index = i, this.type = e.buffer.set.types[e.buffer.buffer[i]];
  }
  child(e, t, i) {
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.context.start, i);
    return s < 0 ? null : new yi(this.context, this, s);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    if (i & Le.ExcludeBuffers)
      return null;
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], t > 0 ? 1 : -1, e - this.context.start, t);
    return s < 0 ? null : new yi(this.context, this, s);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, t = e.buffer[this.index + 3];
    return t < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new yi(this.context, this._parent, t) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, t = this._parent ? this._parent.index + 4 : 0;
    return this.index == t ? this.externalSibling(-1) : new yi(this.context, this._parent, e.findChild(
      t,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], t = [], { buffer: i } = this.context, r = this.index + 4, s = i.buffer[this.index + 3];
    if (s > r) {
      let l = i.buffer[this.index + 1];
      e.push(i.slice(r, s, l)), t.push(0);
    }
    return new je(this.type, e, t, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function BQ(n) {
  if (!n.length)
    return null;
  let e = 0, t = n[0];
  for (let s = 1; s < n.length; s++) {
    let l = n[s];
    (l.from > t.from || l.to < t.to) && (t = l, e = s);
  }
  let i = t instanceof Zt && t.index < 0 ? null : t.parent, r = n.slice();
  return i ? r[e] = i : r.splice(e, 1), new FZ(r, t);
}
class FZ {
  constructor(e, t) {
    this.heads = e, this.node = t;
  }
  get next() {
    return BQ(this.heads);
  }
}
function HZ(n, e, t) {
  let i = n.resolveInner(e, t), r = null;
  for (let s = i instanceof Zt ? i : i.context.parent; s; s = s.parent)
    if (s.index < 0) {
      let l = s.parent;
      (r || (r = [i])).push(l.resolve(e, t)), s = l;
    } else {
      let l = Bl.get(s.tree);
      if (l && l.overlay && l.overlay[0].from <= e && l.overlay[l.overlay.length - 1].to >= e) {
        let O = new Zt(l.tree, l.overlay[0].from + s.from, -1, s);
        (r || (r = [i])).push(Ds(O, e, t, !1));
      }
    }
  return r ? BQ(r) : i;
}
class hc {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, t = 0) {
    if (this.mode = t, this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, e instanceof Zt)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let i = e._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, t) {
    this.index = e;
    let { start: i, buffer: r } = this.buffer;
    return this.type = t || r.set.types[r.buffer[e]], this.from = i + r.buffer[e + 1], this.to = i + r.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof Zt ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, t, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, i, this.mode));
    let { buffer: r } = this.buffer, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.buffer.start, i);
    return s < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(s));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, t, i = this.mode) {
    return this.buffer ? i & Le.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & Le.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & Le.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: t } = this.buffer, i = this.stack.length - 1;
    if (e < 0) {
      let r = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != r)
        return this.yieldBuf(t.findChild(
          r,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let r = t.buffer[this.index + 3];
      if (r < (i < 0 ? t.buffer.length : t.buffer[this.stack[i] + 3]))
        return this.yieldBuf(r);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let t, i, { buffer: r } = this;
    if (r) {
      if (e > 0) {
        if (this.index < r.buffer.buffer.length)
          return !1;
      } else
        for (let s = 0; s < this.index; s++)
          if (r.buffer.buffer[s + 3] < this.index)
            return !1;
      ({ index: t, parent: i } = r);
    } else
      ({ index: t, _parent: i } = this._tree);
    for (; i; { index: t, _parent: i } = i)
      if (t > -1)
        for (let s = t + e, l = e < 0 ? -1 : i._tree.children.length; s != l; s += e) {
          let O = i._tree.children[s];
          if (this.mode & Le.IncludeAnonymous || O instanceof xn || !O.type.isAnonymous || Gc(O))
            return !1;
        }
    return !0;
  }
  move(e, t) {
    if (t && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traveral. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, t = 0) {
    for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, t); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, t = null, i = 0;
    if (e && e.context == this.buffer)
      e: for (let r = this.index, s = this.stack.length; s >= 0; ) {
        for (let l = e; l; l = l._parent)
          if (l.index == r) {
            if (r == this.index)
              return l;
            t = l, i = s + 1;
            break e;
          }
        r = this.stack[--s];
      }
    for (let r = i; r < this.stack.length; r++)
      t = new yi(this.buffer, t, this.stack[r]);
    return this.bufferNode = new yi(this.buffer, t, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, t) {
    for (let i = 0; ; ) {
      let r = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (r = !0);
      }
      for (; r && t && t(this), r = this.type.isAnonymous, !this.nextSibling(); ) {
        if (!i)
          return;
        this.parent(), i--, r = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return Oc(this.node, e);
    let { buffer: t } = this.buffer, { types: i } = t.set;
    for (let r = e.length - 1, s = this.stack.length - 1; r >= 0; s--) {
      if (s < 0)
        return Oc(this.node, e, r);
      let l = i[t.buffer[this.stack[s]]];
      if (!l.isAnonymous) {
        if (e[r] && e[r] != l.name)
          return !1;
        r--;
      }
    }
    return !0;
  }
}
function Gc(n) {
  return n.children.some((e) => e instanceof xn || !e.type.isAnonymous || Gc(e));
}
function JZ(n) {
  var e;
  let { buffer: t, nodeSet: i, maxBufferLength: r = DQ, reused: s = [], minRepeatType: l = i.types.length } = n, O = Array.isArray(t) ? new Mc(t, t.length) : t, h = i.types, f = 0, u = 0;
  function d(W, M, z, te, oe, fe) {
    let { id: le, start: ne, end: E, size: N } = O, pe = u;
    for (; N < 0; )
      if (O.next(), N == -1) {
        let _e = s[le];
        z.push(_e), te.push(ne - W);
        return;
      } else if (N == -3) {
        f = le;
        return;
      } else if (N == -4) {
        u = le;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${N}`);
    let Fe = h[le], Ae, Ue, St = ne - W;
    if (E - ne <= r && (Ue = w(O.pos - M, oe))) {
      let _e = new Uint16Array(Ue.size - Ue.skip), Ce = O.pos - Ue.size, Et = _e.length;
      for (; O.pos > Ce; )
        Et = Z(Ue.start, _e, Et);
      Ae = new xn(_e, E - Ue.start, i), St = Ue.start - W;
    } else {
      let _e = O.pos - N;
      O.next();
      let Ce = [], Et = [], _i = le >= l ? le : -1, Ki = 0, ti = E;
      for (; O.pos > _e; )
        _i >= 0 && O.id == _i && O.size >= 0 ? (O.end <= ti - r && (b(Ce, Et, ne, Ki, O.end, ti, _i, pe), Ki = Ce.length, ti = O.end), O.next()) : fe > 2500 ? g(ne, _e, Ce, Et) : d(ne, _e, Ce, Et, _i, fe + 1);
      if (_i >= 0 && Ki > 0 && Ki < Ce.length && b(Ce, Et, ne, Ki, ne, ti, _i, pe), Ce.reverse(), Et.reverse(), _i > -1 && Ki > 0) {
        let Rn = Q(Fe);
        Ae = Dc(Fe, Ce, Et, 0, Ce.length, 0, E - ne, Rn, Rn);
      } else
        Ae = v(Fe, Ce, Et, E - ne, pe - E);
    }
    z.push(Ae), te.push(St);
  }
  function g(W, M, z, te) {
    let oe = [], fe = 0, le = -1;
    for (; O.pos > M; ) {
      let { id: ne, start: E, end: N, size: pe } = O;
      if (pe > 4)
        O.next();
      else {
        if (le > -1 && E < le)
          break;
        le < 0 && (le = N - r), oe.push(ne, E, N), fe++, O.next();
      }
    }
    if (fe) {
      let ne = new Uint16Array(fe * 4), E = oe[oe.length - 2];
      for (let N = oe.length - 3, pe = 0; N >= 0; N -= 3)
        ne[pe++] = oe[N], ne[pe++] = oe[N + 1] - E, ne[pe++] = oe[N + 2] - E, ne[pe++] = pe;
      z.push(new xn(ne, oe[2] - E, i)), te.push(E - W);
    }
  }
  function Q(W) {
    return (M, z, te) => {
      let oe = 0, fe = M.length - 1, le, ne;
      if (fe >= 0 && (le = M[fe]) instanceof je) {
        if (!fe && le.type == W && le.length == te)
          return le;
        (ne = le.prop(ue.lookAhead)) && (oe = z[fe] + le.length + ne);
      }
      return v(W, M, z, te, oe);
    };
  }
  function b(W, M, z, te, oe, fe, le, ne) {
    let E = [], N = [];
    for (; W.length > te; )
      E.push(W.pop()), N.push(M.pop() + z - oe);
    W.push(v(i.types[le], E, N, fe - oe, ne - fe)), M.push(oe - z);
  }
  function v(W, M, z, te, oe = 0, fe) {
    if (f) {
      let le = [ue.contextHash, f];
      fe = fe ? [le].concat(fe) : [le];
    }
    if (oe > 25) {
      let le = [ue.lookAhead, oe];
      fe = fe ? [le].concat(fe) : [le];
    }
    return new je(W, M, z, te, fe);
  }
  function w(W, M) {
    let z = O.fork(), te = 0, oe = 0, fe = 0, le = z.end - r, ne = { size: 0, start: 0, skip: 0 };
    e: for (let E = z.pos - W; z.pos > E; ) {
      let N = z.size;
      if (z.id == M && N >= 0) {
        ne.size = te, ne.start = oe, ne.skip = fe, fe += 4, te += 4, z.next();
        continue;
      }
      let pe = z.pos - N;
      if (N < 0 || pe < E || z.start < le)
        break;
      let Fe = z.id >= l ? 4 : 0, Ae = z.start;
      for (z.next(); z.pos > pe; ) {
        if (z.size < 0)
          if (z.size == -3)
            Fe += 4;
          else
            break e;
        else z.id >= l && (Fe += 4);
        z.next();
      }
      oe = Ae, te += N, fe += Fe;
    }
    return (M < 0 || te == W) && (ne.size = te, ne.start = oe, ne.skip = fe), ne.size > 4 ? ne : void 0;
  }
  function Z(W, M, z) {
    let { id: te, start: oe, end: fe, size: le } = O;
    if (O.next(), le >= 0 && te < l) {
      let ne = z;
      if (le > 4) {
        let E = O.pos - (le - 4);
        for (; O.pos > E; )
          z = Z(W, M, z);
      }
      M[--z] = ne, M[--z] = fe - W, M[--z] = oe - W, M[--z] = te;
    } else le == -3 ? f = te : le == -4 && (u = te);
    return z;
  }
  let Y = [], U = [];
  for (; O.pos > 0; )
    d(n.start || 0, n.bufferStart || 0, Y, U, -1, 0);
  let V = (e = n.length) !== null && e !== void 0 ? e : Y.length ? U[0] + Y[0].length : 0;
  return new je(h[n.topID], Y.reverse(), U.reverse(), V);
}
const eg = /* @__PURE__ */ new WeakMap();
function ql(n, e) {
  if (!n.isAnonymous || e instanceof xn || e.type != n)
    return 1;
  let t = eg.get(e);
  if (t == null) {
    t = 1;
    for (let i of e.children) {
      if (i.type != n || !(i instanceof je)) {
        t = 1;
        break;
      }
      t += ql(n, i);
    }
    eg.set(e, t);
  }
  return t;
}
function Dc(n, e, t, i, r, s, l, O, h) {
  let f = 0;
  for (let b = i; b < r; b++)
    f += ql(n, e[b]);
  let u = Math.ceil(
    f * 1.5 / 8
    /* Balance.BranchFactor */
  ), d = [], g = [];
  function Q(b, v, w, Z, Y) {
    for (let U = w; U < Z; ) {
      let V = U, W = v[U], M = ql(n, b[U]);
      for (U++; U < Z; U++) {
        let z = ql(n, b[U]);
        if (M + z >= u)
          break;
        M += z;
      }
      if (U == V + 1) {
        if (M > u) {
          let z = b[V];
          Q(z.children, z.positions, 0, z.children.length, v[V] + Y);
          continue;
        }
        d.push(b[V]);
      } else {
        let z = v[U - 1] + b[U - 1].length - W;
        d.push(Dc(n, b, v, V, U, W, z, null, h));
      }
      g.push(W + Y - s);
    }
  }
  return Q(e, t, i, r, 0), (O || h)(d, g, l);
}
class jQ {
  constructor() {
    this.map = /* @__PURE__ */ new WeakMap();
  }
  setBuffer(e, t, i) {
    let r = this.map.get(e);
    r || this.map.set(e, r = /* @__PURE__ */ new Map()), r.set(t, i);
  }
  getBuffer(e, t) {
    let i = this.map.get(e);
    return i && i.get(t);
  }
  /**
  Set the value for this syntax node.
  */
  set(e, t) {
    e instanceof yi ? this.setBuffer(e.context.buffer, e.index, t) : e instanceof Zt && this.map.set(e.tree, t);
  }
  /**
  Retrieve value for this syntax node, if it exists in the map.
  */
  get(e) {
    return e instanceof yi ? this.getBuffer(e.context.buffer, e.index) : e instanceof Zt ? this.map.get(e.tree) : void 0;
  }
  /**
  Set the value for the node that a cursor currently points to.
  */
  cursorSet(e, t) {
    e.buffer ? this.setBuffer(e.buffer.buffer, e.index, t) : this.map.set(e.tree, t);
  }
  /**
  Retrieve the value for the node that a cursor currently points
  to.
  */
  cursorGet(e) {
    return e.buffer ? this.getBuffer(e.buffer.buffer, e.index) : this.map.get(e.tree);
  }
}
class Fn {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, t, i, r, s = !1, l = !1) {
    this.from = e, this.to = t, this.tree = i, this.offset = r, this.open = (s ? 1 : 0) | (l ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, t = [], i = !1) {
    let r = [new Fn(0, e.length, e, 0, !1, i)];
    for (let s of t)
      s.to > e.length && r.push(s);
    return r;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, t, i = 128) {
    if (!t.length)
      return e;
    let r = [], s = 1, l = e.length ? e[0] : null;
    for (let O = 0, h = 0, f = 0; ; O++) {
      let u = O < t.length ? t[O] : null, d = u ? u.fromA : 1e9;
      if (d - h >= i)
        for (; l && l.from < d; ) {
          let g = l;
          if (h >= g.from || d <= g.to || f) {
            let Q = Math.max(g.from, h) - f, b = Math.min(g.to, d) - f;
            g = Q >= b ? null : new Fn(Q, b, g.tree, g.offset + f, O > 0, !!u);
          }
          if (g && r.push(g), l.to > d)
            break;
          l = s < e.length ? e[s++] : null;
        }
      if (!u)
        break;
      h = u.toA, f = u.toA - u.toB;
    }
    return r;
  }
}
class NQ {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, t, i) {
    return typeof e == "string" && (e = new KZ(e)), i = i ? i.length ? i.map((r) => new lh(r.from, r.to)) : [new lh(0, 0)] : [new lh(0, e.length)], this.createParse(e, t || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, t, i) {
    let r = this.startParse(e, t, i);
    for (; ; ) {
      let s = r.advance();
      if (s)
        return s;
    }
  }
}
class KZ {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, t) {
    return this.string.slice(e, t);
  }
}
new ue({ perNode: !0 });
let eR = 0;
class Si {
  /**
  @internal
  */
  constructor(e, t, i) {
    this.set = e, this.base = t, this.modified = i, this.id = eR++;
  }
  /**
  Define a new tag. If `parent` is given, the tag is treated as a
  sub-tag of that parent, and
  [highlighters](#highlight.tagHighlighter) that don't mention
  this tag will try to fall back to the parent tag (or grandparent
  tag, etc).
  */
  static define(e) {
    if (e != null && e.base)
      throw new Error("Can not derive from a modified tag");
    let t = new Si([], null, []);
    if (t.set.push(t), e)
      for (let i of e.set)
        t.set.push(i);
    return t;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier() {
    let e = new jl();
    return (t) => t.modified.indexOf(e) > -1 ? t : jl.get(t.base || t, t.modified.concat(e).sort((i, r) => i.id - r.id));
  }
}
let tR = 0;
class jl {
  constructor() {
    this.instances = [], this.id = tR++;
  }
  static get(e, t) {
    if (!t.length)
      return e;
    let i = t[0].instances.find((O) => O.base == e && iR(t, O.modified));
    if (i)
      return i;
    let r = [], s = new Si(r, e, t);
    for (let O of t)
      O.instances.push(s);
    let l = nR(t);
    for (let O of e.set)
      if (!O.modified.length)
        for (let h of l)
          r.push(jl.get(O, h));
    return s;
  }
}
function iR(n, e) {
  return n.length == e.length && n.every((t, i) => t == e[i]);
}
function nR(n) {
  let e = [[]];
  for (let t = 0; t < n.length; t++)
    for (let i = 0, r = e.length; i < r; i++)
      e.push(e[i].concat(n[t]));
  return e.sort((t, i) => i.length - t.length);
}
function Mr(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let i = n[t];
    Array.isArray(i) || (i = [i]);
    for (let r of t.split(" "))
      if (r) {
        let s = [], l = 2, O = r;
        for (let d = 0; ; ) {
          if (O == "..." && d > 0 && d + 3 == r.length) {
            l = 1;
            break;
          }
          let g = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(O);
          if (!g)
            throw new RangeError("Invalid path: " + r);
          if (s.push(g[0] == "*" ? "" : g[0][0] == '"' ? JSON.parse(g[0]) : g[0]), d += g[0].length, d == r.length)
            break;
          let Q = r[d++];
          if (d == r.length && Q == "!") {
            l = 0;
            break;
          }
          if (Q != "/")
            throw new RangeError("Invalid path: " + r);
          O = r.slice(d);
        }
        let h = s.length - 1, f = s[h];
        if (!f)
          throw new RangeError("Invalid path: " + r);
        let u = new Nl(i, l, h > 0 ? s.slice(0, h) : null);
        e[f] = u.sort(e[f]);
      }
  }
  return FQ.add(e);
}
const FQ = new ue();
class Nl {
  constructor(e, t, i, r) {
    this.tags = e, this.mode = t, this.context = i, this.next = r;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
Nl.empty = new Nl([], 2, null);
function HQ(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let s of n)
    if (!Array.isArray(s.tag))
      t[s.tag.id] = s.class;
    else
      for (let l of s.tag)
        t[l.id] = s.class;
  let { scope: i, all: r = null } = e || {};
  return {
    style: (s) => {
      let l = r;
      for (let O of s)
        for (let h of O.set) {
          let f = t[h.id];
          if (f) {
            l = l ? l + " " + f : f;
            break;
          }
        }
      return l;
    },
    scope: i
  };
}
function rR(n, e) {
  let t = null;
  for (let i of n) {
    let r = i.style(e);
    r && (t = t ? t + " " + r : r);
  }
  return t;
}
function sR(n, e, t, i = 0, r = n.length) {
  let s = new oR(i, Array.isArray(e) ? e : [e], t);
  s.highlightRange(n.cursor(), i, r, "", s.highlighters), s.flush(r);
}
class oR {
  constructor(e, t, i) {
    this.at = e, this.highlighters = t, this.span = i, this.class = "";
  }
  startSpan(e, t) {
    t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, t, i, r, s) {
    let { type: l, from: O, to: h } = e;
    if (O >= i || h <= t)
      return;
    l.isTop && (s = this.highlighters.filter((Q) => !Q.scope || Q.scope(l)));
    let f = r, u = lR(e) || Nl.empty, d = rR(s, u.tags);
    if (d && (f && (f += " "), f += d, u.mode == 1 && (r += (r ? " " : "") + d)), this.startSpan(Math.max(t, O), f), u.opaque)
      return;
    let g = e.tree && e.tree.prop(ue.mounted);
    if (g && g.overlay) {
      let Q = e.node.enter(g.overlay[0].from + O, 1), b = this.highlighters.filter((w) => !w.scope || w.scope(g.tree.type)), v = e.firstChild();
      for (let w = 0, Z = O; ; w++) {
        let Y = w < g.overlay.length ? g.overlay[w] : null, U = Y ? Y.from + O : h, V = Math.max(t, Z), W = Math.min(i, U);
        if (V < W && v)
          for (; e.from < W && (this.highlightRange(e, V, W, r, s), this.startSpan(Math.min(W, e.to), f), !(e.to >= U || !e.nextSibling())); )
            ;
        if (!Y || U > i)
          break;
        Z = Y.to + O, Z > t && (this.highlightRange(Q.cursor(), Math.max(t, Y.from + O), Math.min(i, Z), "", b), this.startSpan(Math.min(i, Z), f));
      }
      v && e.parent();
    } else if (e.firstChild()) {
      g && (r = "");
      do
        if (!(e.to <= t)) {
          if (e.from >= i)
            break;
          this.highlightRange(e, t, i, r, s), this.startSpan(Math.min(i, e.to), f);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function lR(n) {
  let e = n.type.prop(FQ);
  for (; e && e.context && !n.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const G = Si.define, gl = G(), hn = G(), tg = G(hn), ig = G(hn), cn = G(), ml = G(cn), ah = G(cn), Pi = G(), zn = G(Pi), mi = G(), Qi = G(), cc = G(), Ps = G(cc), Ql = G(), $ = {
  /**
  A comment.
  */
  comment: gl,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: G(gl),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: G(gl),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: G(gl),
  /**
  Any kind of identifier.
  */
  name: hn,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: G(hn),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: tg,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: G(tg),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: ig,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: G(ig),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: G(hn),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: G(hn),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: G(hn),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: G(hn),
  /**
  A literal value.
  */
  literal: cn,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: ml,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: G(ml),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: G(ml),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: G(ml),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: ah,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: G(ah),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: G(ah),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: G(cn),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: G(cn),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: G(cn),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: G(cn),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: G(cn),
  /**
  A language keyword.
  */
  keyword: mi,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: G(mi),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: G(mi),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: G(mi),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: G(mi),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: G(mi),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: G(mi),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: G(mi),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: G(mi),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: G(mi),
  /**
  An operator.
  */
  operator: Qi,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: G(Qi),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: G(Qi),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: G(Qi),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: G(Qi),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: G(Qi),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: G(Qi),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: G(Qi),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: G(Qi),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: G(Qi),
  /**
  Program or markup punctuation.
  */
  punctuation: cc,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: G(cc),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: Ps,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: G(Ps),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: G(Ps),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: G(Ps),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: G(Ps),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: Pi,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: zn,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: G(zn),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: G(zn),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: G(zn),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: G(zn),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: G(zn),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: G(zn),
  /**
  A prose separator (such as a horizontal rule).
  */
  contentSeparator: G(Pi),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: G(Pi),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: G(Pi),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: G(Pi),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: G(Pi),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: G(Pi),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: G(Pi),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: G(Pi),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: G(),
  /**
  Deleted text.
  */
  deleted: G(),
  /**
  Changed text.
  */
  changed: G(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: G(),
  /**
  Metadata or meta-instruction.
  */
  meta: Ql,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: G(Ql),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: G(Ql),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: G(Ql),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: Si.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: Si.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: Si.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: Si.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: Si.defineModifier(),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: Si.defineModifier()
};
HQ([
  { tag: $.link, class: "tok-link" },
  { tag: $.heading, class: "tok-heading" },
  { tag: $.emphasis, class: "tok-emphasis" },
  { tag: $.strong, class: "tok-strong" },
  { tag: $.keyword, class: "tok-keyword" },
  { tag: $.atom, class: "tok-atom" },
  { tag: $.bool, class: "tok-bool" },
  { tag: $.url, class: "tok-url" },
  { tag: $.labelName, class: "tok-labelName" },
  { tag: $.inserted, class: "tok-inserted" },
  { tag: $.deleted, class: "tok-deleted" },
  { tag: $.literal, class: "tok-literal" },
  { tag: $.string, class: "tok-string" },
  { tag: $.number, class: "tok-number" },
  { tag: [$.regexp, $.escape, $.special($.string)], class: "tok-string2" },
  { tag: $.variableName, class: "tok-variableName" },
  { tag: $.local($.variableName), class: "tok-variableName tok-local" },
  { tag: $.definition($.variableName), class: "tok-variableName tok-definition" },
  { tag: $.special($.variableName), class: "tok-variableName2" },
  { tag: $.definition($.propertyName), class: "tok-propertyName tok-definition" },
  { tag: $.typeName, class: "tok-typeName" },
  { tag: $.namespace, class: "tok-namespace" },
  { tag: $.className, class: "tok-className" },
  { tag: $.macroName, class: "tok-macroName" },
  { tag: $.propertyName, class: "tok-propertyName" },
  { tag: $.operator, class: "tok-operator" },
  { tag: $.comment, class: "tok-comment" },
  { tag: $.meta, class: "tok-meta" },
  { tag: $.invalid, class: "tok-invalid" },
  { tag: $.punctuation, class: "tok-punctuation" }
]);
var Oh;
const yr = /* @__PURE__ */ new ue();
function JQ(n) {
  return j.define({
    combine: n ? (e) => e.concat(n) : void 0
  });
}
const Ic = /* @__PURE__ */ new ue();
class ai {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, t, i = [], r = "") {
    this.data = e, this.name = r, ce.prototype.hasOwnProperty("tree") || Object.defineProperty(ce.prototype, "tree", { get() {
      return De(this);
    } }), this.parser = t, this.extension = [
      wn.of(this),
      ce.languageData.of((s, l, O) => {
        let h = ng(s, l, O), f = h.type.prop(yr);
        if (!f)
          return [];
        let u = s.facet(f), d = h.type.prop(Ic);
        if (d) {
          let g = h.resolve(l - h.from, O);
          for (let Q of d)
            if (Q.test(g, s)) {
              let b = s.facet(Q.facet);
              return Q.type == "replace" ? b : b.concat(u);
            }
        }
        return u;
      })
    ].concat(i);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, t, i = -1) {
    return ng(e, t, i).type.prop(yr) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let t = e.facet(wn);
    if ((t == null ? void 0 : t.data) == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!t || !t.allowsNesting)
      return [];
    let i = [], r = (s, l) => {
      if (s.prop(yr) == this.data) {
        i.push({ from: l, to: l + s.length });
        return;
      }
      let O = s.prop(ue.mounted);
      if (O) {
        if (O.tree.prop(yr) == this.data) {
          if (O.overlay)
            for (let h of O.overlay)
              i.push({ from: h.from + l, to: h.to + l });
          else
            i.push({ from: l, to: l + s.length });
          return;
        } else if (O.overlay) {
          let h = i.length;
          if (r(O.tree, O.overlay[0].from + l), i.length > h)
            return;
        }
      }
      for (let h = 0; h < s.children.length; h++) {
        let f = s.children[h];
        f instanceof je && r(f, s.positions[h] + l);
      }
    };
    return r(De(e), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
ai.setState = /* @__PURE__ */ ie.define();
function ng(n, e, t) {
  let i = n.facet(wn), r = De(n).topNode;
  if (!i || i.allowsNesting)
    for (let s = r; s; s = s.enter(e, t, Le.ExcludeBuffers))
      s.type.isTop && (r = s);
  return r;
}
class vn extends ai {
  constructor(e, t, i) {
    super(e, t, [], i), this.parser = t;
  }
  /**
  Define a language from a parser.
  */
  static define(e) {
    let t = JQ(e.languageData);
    return new vn(t, e.parser.configure({
      props: [yr.add((i) => i.isTop ? t : void 0)]
    }), e.name);
  }
  /**
  Create a new instance of this language with a reconfigured
  version of its parser and optionally a new name.
  */
  configure(e, t) {
    return new vn(this.data, this.parser.configure(e), t || this.name);
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function De(n) {
  let e = n.field(ai.state, !1);
  return e ? e.tree : je.empty;
}
class aR {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, t) {
    let i = this.cursorPos - this.string.length;
    return e < i || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - i, t - i);
  }
}
let Ss = null;
class Fl {
  constructor(e, t, i = [], r, s, l, O, h) {
    this.parser = e, this.state = t, this.fragments = i, this.tree = r, this.treeLen = s, this.viewport = l, this.skipped = O, this.scheduleOn = h, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Fl(e, t, [], je.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new aR(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, t) {
    return t != null && t >= this.state.doc.length && (t = void 0), this.tree != je.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof e == "number") {
        let r = Date.now() + e;
        e = () => Date.now() > r;
      }
      for (this.parse || (this.parse = this.startParse()), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t); ; ) {
        let r = this.parse.advance();
        if (r)
          if (this.fragments = this.withoutTempSkipped(Fn.addTree(r, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = r, this.parse = null, this.treeLen < (t ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, t;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(t = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(Fn.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let t = Ss;
    Ss = this;
    try {
      return e();
    } finally {
      Ss = t;
    }
  }
  withoutTempSkipped(e) {
    for (let t; t = this.tempSkipped.pop(); )
      e = rg(e, t.from, t.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, t) {
    let { fragments: i, tree: r, treeLen: s, viewport: l, skipped: O } = this;
    if (this.takeTree(), !e.empty) {
      let h = [];
      if (e.iterChangedRanges((f, u, d, g) => h.push({ fromA: f, toA: u, fromB: d, toB: g })), i = Fn.applyChanges(i, h), r = je.empty, s = 0, l = { from: e.mapPos(l.from, -1), to: e.mapPos(l.to, 1) }, this.skipped.length) {
        O = [];
        for (let f of this.skipped) {
          let u = e.mapPos(f.from, 1), d = e.mapPos(f.to, -1);
          u < d && O.push({ from: u, to: d });
        }
      }
    }
    return new Fl(this.parser, t, i, r, s, l, O, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let t = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: r, to: s } = this.skipped[i];
      r < e.to && s > e.from && (this.fragments = rg(this.fragments, r, s), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= t ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, t) {
    this.skipped.push({ from: e, to: t });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends NQ {
      createParse(t, i, r) {
        let s = r[0].from, l = r[r.length - 1].to;
        return {
          parsedPos: s,
          advance() {
            let h = Ss;
            if (h) {
              for (let f of r)
                h.tempSkipped.push(f);
              e && (h.scheduleOn = h.scheduleOn ? Promise.all([h.scheduleOn, e]) : e);
            }
            return this.parsedPos = l, new je(Rt.none, [], [], l - s);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let t = this.fragments;
    return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return Ss;
  }
}
function rg(n, e, t) {
  return Fn.applyChanges(n, [{ fromA: e, toA: t, fromB: e, toB: t }]);
}
class Ar {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let t = this.context.changes(e.changes, e.state), i = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
    return t.work(20, i) || t.takeTree(), new Ar(t);
  }
  static init(e) {
    let t = Math.min(3e3, e.doc.length), i = Fl.create(e.facet(wn).parser, e, { from: 0, to: t });
    return i.work(20, t) || i.takeTree(), new Ar(i);
  }
}
ai.state = /* @__PURE__ */ Ne.define({
  create: Ar.init,
  update(n, e) {
    for (let t of e.effects)
      if (t.is(ai.setState))
        return t.value;
    return e.startState.facet(wn) != e.state.facet(wn) ? Ar.init(e.state) : n.apply(e);
  }
});
let KQ = (n) => {
  let e = setTimeout(
    () => n(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (KQ = (n) => {
  let e = -1, t = setTimeout(
    () => {
      e = requestIdleCallback(n, {
        timeout: 400
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(t) : cancelIdleCallback(e);
});
const hh = typeof navigator < "u" && (!((Oh = navigator.scheduling) === null || Oh === void 0) && Oh.isInputPending) ? () => navigator.scheduling.isInputPending() : null, OR = /* @__PURE__ */ ze.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let t = this.view.state.field(ai.state).context;
    (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, t = e.field(ai.state);
    (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = KQ(this.work));
  }
  work(e) {
    this.working = null;
    let t = Date.now();
    if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: r } } = this.view, s = i.field(ai.state);
    if (s.tree == s.context.tree && s.context.isDone(
      r + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let l = Date.now() + Math.min(this.chunkBudget, 100, e && !hh ? Math.max(25, e.timeRemaining() - 5) : 1e9), O = s.context.treeLen < r && i.doc.length > r + 1e3, h = s.context.work(() => hh && hh() || Date.now() > l, r + (O ? 0 : 1e5));
    this.chunkBudget -= Date.now() - t, (h || this.chunkBudget <= 0) && (s.context.takeTree(), this.view.dispatch({ effects: ai.setState.of(new Ar(s.context)) })), this.chunkBudget > 0 && !(h && !O) && this.scheduleWork(), this.checkAsyncSchedule(s.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((t) => mt(this.view.state, t)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), wn = /* @__PURE__ */ j.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    ai.state,
    OR,
    I.contentAttributes.compute([n], (e) => {
      let t = e.facet(n);
      return t && t.name ? { "data-language": t.name } : {};
    })
  ]
});
class io {
  /**
  Create a language support object.
  */
  constructor(e, t = []) {
    this.language = e, this.support = t, this.extension = [e, t];
  }
}
const hR = /* @__PURE__ */ j.define(), no = /* @__PURE__ */ j.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let e = n[0];
    if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return e;
  }
});
function Hl(n) {
  let e = n.facet(no);
  return e.charCodeAt(0) == 9 ? n.tabSize * e.length : e.length;
}
function Is(n, e) {
  let t = "", i = n.tabSize, r = n.facet(no)[0];
  if (r == "	") {
    for (; e >= i; )
      t += "	", e -= i;
    r = " ";
  }
  for (let s = 0; s < e; s++)
    t += r;
  return t;
}
function Lc(n, e) {
  n instanceof ce && (n = new ma(n));
  for (let i of n.state.facet(hR)) {
    let r = i(n, e);
    if (r !== void 0)
      return r;
  }
  let t = De(n.state);
  return t.length >= e ? cR(n, t, e) : null;
}
class ma {
  /**
  Create an indent context.
  */
  constructor(e, t = {}) {
    this.state = e, this.options = t, this.unit = Hl(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, t = 1) {
    let i = this.state.doc.lineAt(e), { simulateBreak: r, simulateDoubleBreak: s } = this.options;
    return r != null && r >= i.from && r <= i.to ? s && r == e ? { text: "", from: e } : (t < 0 ? r < e : r <= e) ? { text: i.text.slice(r - i.from), from: r } : { text: i.text.slice(0, r - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, t = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: i, from: r } = this.lineAt(e, t);
    return i.slice(e - r, Math.min(i.length, e + 100 - r));
  }
  /**
  Find the column for the given position.
  */
  column(e, t = 1) {
    let { text: i, from: r } = this.lineAt(e, t), s = this.countColumn(i, e - r), l = this.options.overrideIndentation ? this.options.overrideIndentation(r) : -1;
    return l > -1 && (s += l - this.countColumn(i, i.search(/\S|$/))), s;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, t = e.length) {
    return zr(e, this.state.tabSize, t);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, t = 1) {
    let { text: i, from: r } = this.lineAt(e, t), s = this.options.overrideIndentation;
    if (s) {
      let l = s(r);
      if (l > -1)
        return l;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Gr = /* @__PURE__ */ new ue();
function cR(n, e, t) {
  let i = e.resolveStack(t), r = i.node.enterUnfinishedNodesBefore(t);
  if (r != i.node) {
    let s = [];
    for (let l = r; l != i.node; l = l.parent)
      s.push(l);
    for (let l = s.length - 1; l >= 0; l--)
      i = { node: s[l], next: i };
  }
  return e0(i, n, t);
}
function e0(n, e, t) {
  for (let i = n; i; i = i.next) {
    let r = uR(i.node);
    if (r)
      return r(Bc.create(e, t, i));
  }
  return 0;
}
function fR(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function uR(n) {
  let e = n.type.prop(Gr);
  if (e)
    return e;
  let t = n.firstChild, i;
  if (t && (i = t.type.prop(ue.closedBy))) {
    let r = n.lastChild, s = r && i.indexOf(r.name) > -1;
    return (l) => t0(l, !0, 1, void 0, s && !fR(l) ? r.from : void 0);
  }
  return n.parent == null ? dR : null;
}
function dR() {
  return 0;
}
class Bc extends ma {
  constructor(e, t, i) {
    super(e.state, e.options), this.base = e, this.pos = t, this.context = i;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Bc(e, t, i);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let t = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let i = e.resolve(t.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if (pR(i, e))
        break;
      t = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(t.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return e0(this.context.next, this.base, this.pos);
  }
}
function pR(n, e) {
  for (let t = e; t; t = t.parent)
    if (n == t)
      return !0;
  return !1;
}
function gR(n) {
  let e = n.node, t = e.childAfter(e.from), i = e.lastChild;
  if (!t)
    return null;
  let r = n.options.simulateBreak, s = n.state.doc.lineAt(t.from), l = r == null || r <= s.from ? s.to : Math.min(s.to, r);
  for (let O = t.to; ; ) {
    let h = e.childAfter(O);
    if (!h || h == i)
      return null;
    if (!h.type.isSkipped)
      return h.from < l ? t : null;
    O = h.to;
  }
}
function Ws({ closing: n, align: e = !0, units: t = 1 }) {
  return (i) => t0(i, e, t, n);
}
function t0(n, e, t, i, r) {
  let s = n.textAfter, l = s.match(/^\s*/)[0].length, O = i && s.slice(l, l + i.length) == i || r == n.pos + l, h = e ? gR(n) : null;
  return h ? O ? n.column(h.from) : n.column(h.to) : n.baseIndent + (O ? 0 : n.unit * t);
}
const i0 = (n) => n.baseIndent;
function ji({ except: n, units: e = 1 } = {}) {
  return (t) => {
    let i = n && n.test(t.textAfter);
    return t.baseIndent + (i ? 0 : e * t.unit);
  };
}
const mR = 200;
function QR() {
  return ce.transactionFilter.of((n) => {
    if (!n.docChanged || !n.isUserEvent("input.type") && !n.isUserEvent("input.complete"))
      return n;
    let e = n.startState.languageDataAt("indentOnInput", n.startState.selection.main.head);
    if (!e.length)
      return n;
    let t = n.newDoc, { head: i } = n.newSelection.main, r = t.lineAt(i);
    if (i > r.from + mR)
      return n;
    let s = t.sliceString(r.from, i);
    if (!e.some((f) => f.test(s)))
      return n;
    let { state: l } = n, O = -1, h = [];
    for (let { head: f } of l.selection.ranges) {
      let u = l.doc.lineAt(f);
      if (u.from == O)
        continue;
      O = u.from;
      let d = Lc(l, u.from);
      if (d == null)
        continue;
      let g = /^\s*/.exec(u.text)[0], Q = Is(l, d);
      g != Q && h.push({ from: u.from, to: u.from + g.length, insert: Q });
    }
    return h.length ? [n, { changes: h, sequential: !0 }] : n;
  });
}
const PR = /* @__PURE__ */ j.define(), Dr = /* @__PURE__ */ new ue();
function Qa(n) {
  let e = n.firstChild, t = n.lastChild;
  return e && e.to < t.from ? { from: e.to, to: t.type.isError ? n.to : t.from } : null;
}
function SR(n, e, t) {
  let i = De(n);
  if (i.length < t)
    return null;
  let r = i.resolveStack(t, 1), s = null;
  for (let l = r; l; l = l.next) {
    let O = l.node;
    if (O.to <= t || O.from > t)
      continue;
    if (s && O.from < e)
      break;
    let h = O.type.prop(Dr);
    if (h && (O.to < i.length - 50 || i.length == n.doc.length || !$R(O))) {
      let f = h(O, n);
      f && f.from <= t && f.from >= e && f.to > t && (s = f);
    }
  }
  return s;
}
function $R(n) {
  let e = n.lastChild;
  return e && e.to == n.to && e.type.isError;
}
function Jl(n, e, t) {
  for (let i of n.facet(PR)) {
    let r = i(n, e, t);
    if (r)
      return r;
  }
  return SR(n, e, t);
}
function n0(n, e) {
  let t = e.mapPos(n.from, 1), i = e.mapPos(n.to, -1);
  return t >= i ? void 0 : { from: t, to: i };
}
const Pa = /* @__PURE__ */ ie.define({ map: n0 }), ro = /* @__PURE__ */ ie.define({ map: n0 });
function r0(n) {
  let e = [];
  for (let { head: t } of n.state.selection.ranges)
    e.some((i) => i.from <= t && i.to >= t) || e.push(n.lineBlockAt(t));
  return e;
}
const tr = /* @__PURE__ */ Ne.define({
  create() {
    return H.none;
  },
  update(n, e) {
    n = n.map(e.changes);
    for (let t of e.effects)
      if (t.is(Pa) && !bR(n, t.value.from, t.value.to)) {
        let { preparePlaceholder: i } = e.state.facet(l0), r = i ? H.replace({ widget: new ZR(i(e.state, t.value)) }) : sg;
        n = n.update({ add: [r.range(t.value.from, t.value.to)] });
      } else t.is(ro) && (n = n.update({
        filter: (i, r) => t.value.from != i || t.value.to != r,
        filterFrom: t.value.from,
        filterTo: t.value.to
      }));
    if (e.selection) {
      let t = !1, { head: i } = e.selection.main;
      n.between(i, i, (r, s) => {
        r < i && s > i && (t = !0);
      }), t && (n = n.update({
        filterFrom: i,
        filterTo: i,
        filter: (r, s) => s <= i || r >= i
      }));
    }
    return n;
  },
  provide: (n) => I.decorations.from(n),
  toJSON(n, e) {
    let t = [];
    return n.between(0, e.doc.length, (i, r) => {
      t.push(i, r);
    }), t;
  },
  fromJSON(n) {
    if (!Array.isArray(n) || n.length % 2)
      throw new RangeError("Invalid JSON for fold state");
    let e = [];
    for (let t = 0; t < n.length; ) {
      let i = n[t++], r = n[t++];
      if (typeof i != "number" || typeof r != "number")
        throw new RangeError("Invalid JSON for fold state");
      e.push(sg.range(i, r));
    }
    return H.set(e, !0);
  }
});
function Kl(n, e, t) {
  var i;
  let r = null;
  return (i = n.field(tr, !1)) === null || i === void 0 || i.between(e, t, (s, l) => {
    (!r || r.from > s) && (r = { from: s, to: l });
  }), r;
}
function bR(n, e, t) {
  let i = !1;
  return n.between(e, e, (r, s) => {
    r == e && s == t && (i = !0);
  }), i;
}
function s0(n, e) {
  return n.field(tr, !1) ? e : e.concat(ie.appendConfig.of(a0()));
}
const yR = (n) => {
  for (let e of r0(n)) {
    let t = Jl(n.state, e.from, e.to);
    if (t)
      return n.dispatch({ effects: s0(n.state, [Pa.of(t), o0(n, t)]) }), !0;
  }
  return !1;
}, xR = (n) => {
  if (!n.state.field(tr, !1))
    return !1;
  let e = [];
  for (let t of r0(n)) {
    let i = Kl(n.state, t.from, t.to);
    i && e.push(ro.of(i), o0(n, i, !1));
  }
  return e.length && n.dispatch({ effects: e }), e.length > 0;
};
function o0(n, e, t = !0) {
  let i = n.state.doc.lineAt(e.from).number, r = n.state.doc.lineAt(e.to).number;
  return I.announce.of(`${n.state.phrase(t ? "Folded lines" : "Unfolded lines")} ${i} ${n.state.phrase("to")} ${r}.`);
}
const vR = (n) => {
  let { state: e } = n, t = [];
  for (let i = 0; i < e.doc.length; ) {
    let r = n.lineBlockAt(i), s = Jl(e, r.from, r.to);
    s && t.push(Pa.of(s)), i = (s ? n.lineBlockAt(s.to) : r).to + 1;
  }
  return t.length && n.dispatch({ effects: s0(n.state, t) }), !!t.length;
}, wR = (n) => {
  let e = n.state.field(tr, !1);
  if (!e || !e.size)
    return !1;
  let t = [];
  return e.between(0, n.state.doc.length, (i, r) => {
    t.push(ro.of({ from: i, to: r }));
  }), n.dispatch({ effects: t }), !0;
}, kR = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: yR },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: xR },
  { key: "Ctrl-Alt-[", run: vR },
  { key: "Ctrl-Alt-]", run: wR }
], TR = {
  placeholderDOM: null,
  preparePlaceholder: null,
  placeholderText: "…"
}, l0 = /* @__PURE__ */ j.define({
  combine(n) {
    return ci(n, TR);
  }
});
function a0(n) {
  return [tr, XR];
}
function O0(n, e) {
  let { state: t } = n, i = t.facet(l0), r = (l) => {
    let O = n.lineBlockAt(n.posAtDOM(l.target)), h = Kl(n.state, O.from, O.to);
    h && n.dispatch({ effects: ro.of(h) }), l.preventDefault();
  };
  if (i.placeholderDOM)
    return i.placeholderDOM(n, r, e);
  let s = document.createElement("span");
  return s.textContent = i.placeholderText, s.setAttribute("aria-label", t.phrase("folded code")), s.title = t.phrase("unfold"), s.className = "cm-foldPlaceholder", s.onclick = r, s;
}
const sg = /* @__PURE__ */ H.replace({ widget: /* @__PURE__ */ new class extends Zi {
  toDOM(n) {
    return O0(n, null);
  }
}() });
class ZR extends Zi {
  constructor(e) {
    super(), this.value = e;
  }
  eq(e) {
    return this.value == e.value;
  }
  toDOM(e) {
    return O0(e, this.value);
  }
}
const RR = {
  openText: "⌄",
  closedText: "›",
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => !1
};
class ch extends Ti {
  constructor(e, t) {
    super(), this.config = e, this.open = t;
  }
  eq(e) {
    return this.config == e.config && this.open == e.open;
  }
  toDOM(e) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let t = document.createElement("span");
    return t.textContent = this.open ? this.config.openText : this.config.closedText, t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line"), t;
  }
}
function _R(n = {}) {
  let e = Object.assign(Object.assign({}, RR), n), t = new ch(e, !0), i = new ch(e, !1), r = ze.fromClass(class {
    constructor(l) {
      this.from = l.viewport.from, this.markers = this.buildMarkers(l);
    }
    update(l) {
      (l.docChanged || l.viewportChanged || l.startState.facet(wn) != l.state.facet(wn) || l.startState.field(tr, !1) != l.state.field(tr, !1) || De(l.startState) != De(l.state) || e.foldingChanged(l)) && (this.markers = this.buildMarkers(l.view));
    }
    buildMarkers(l) {
      let O = new Sn();
      for (let h of l.viewportLineBlocks) {
        let f = Kl(l.state, h.from, h.to) ? i : Jl(l.state, h.from, h.to) ? t : null;
        f && O.add(h.from, h.from, f);
      }
      return O.finish();
    }
  }), { domEventHandlers: s } = e;
  return [
    r,
    EQ({
      class: "cm-foldGutter",
      markers(l) {
        var O;
        return ((O = l.plugin(r)) === null || O === void 0 ? void 0 : O.markers) || Qe.empty;
      },
      initialSpacer() {
        return new ch(e, !1);
      },
      domEventHandlers: Object.assign(Object.assign({}, s), { click: (l, O, h) => {
        if (s.click && s.click(l, O, h))
          return !0;
        let f = Kl(l.state, O.from, O.to);
        if (f)
          return l.dispatch({ effects: ro.of(f) }), !0;
        let u = Jl(l.state, O.from, O.to);
        return u ? (l.dispatch({ effects: Pa.of(u) }), !0) : !1;
      } })
    }),
    a0()
  ];
}
const XR = /* @__PURE__ */ I.baseTheme({
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    color: "#888",
    borderRadius: ".2em",
    margin: "0 1px",
    padding: "0 1px",
    cursor: "pointer"
  },
  ".cm-foldGutter span": {
    padding: "0 1px",
    cursor: "pointer"
  }
});
class so {
  constructor(e, t) {
    this.specs = e;
    let i;
    function r(O) {
      let h = $n.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + h] = O, h;
    }
    const s = typeof t.all == "string" ? t.all : t.all ? r(t.all) : void 0, l = t.scope;
    this.scope = l instanceof ai ? (O) => O.prop(yr) == l.data : l ? (O) => O == l : void 0, this.style = HQ(e.map((O) => ({
      tag: O.tag,
      class: O.class || r(Object.assign({}, O, { tag: null }))
    })), {
      all: s
    }).style, this.module = i ? new $n(i) : null, this.themeType = t.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, t) {
    return new so(e, t || {});
  }
}
const fc = /* @__PURE__ */ j.define(), h0 = /* @__PURE__ */ j.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function fh(n) {
  let e = n.facet(fc);
  return e.length ? e : n.facet(h0);
}
function jc(n, e) {
  let t = [CR], i;
  return n instanceof so && (n.module && t.push(I.styleModule.of(n.module)), i = n.themeType), e != null && e.fallback ? t.push(h0.of(n)) : i ? t.push(fc.computeN([I.darkTheme], (r) => r.facet(I.darkTheme) == (i == "dark") ? [n] : [])) : t.push(fc.of(n)), t;
}
class qR {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = De(e.state), this.decorations = this.buildDeco(e, fh(e.state)), this.decoratedTo = e.viewport.to;
  }
  update(e) {
    let t = De(e.state), i = fh(e.state), r = i != fh(e.startState), { viewport: s } = e.view, l = e.changes.mapPos(this.decoratedTo, 1);
    t.length < s.to && !r && t.type == this.tree.type && l >= s.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = l) : (t != this.tree || e.viewportChanged || r) && (this.tree = t, this.decorations = this.buildDeco(e.view, i), this.decoratedTo = s.to);
  }
  buildDeco(e, t) {
    if (!t || !this.tree.length)
      return H.none;
    let i = new Sn();
    for (let { from: r, to: s } of e.visibleRanges)
      sR(this.tree, t, (l, O, h) => {
        i.add(l, O, this.markCache[h] || (this.markCache[h] = H.mark({ class: h })));
      }, r, s);
    return i.finish();
  }
}
const CR = /* @__PURE__ */ Tn.high(/* @__PURE__ */ ze.fromClass(qR, {
  decorations: (n) => n.decorations
})), c0 = /* @__PURE__ */ so.define([
  {
    tag: $.meta,
    color: "#404740"
  },
  {
    tag: $.link,
    textDecoration: "underline"
  },
  {
    tag: $.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: $.emphasis,
    fontStyle: "italic"
  },
  {
    tag: $.strong,
    fontWeight: "bold"
  },
  {
    tag: $.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: $.keyword,
    color: "#708"
  },
  {
    tag: [$.atom, $.bool, $.url, $.contentSeparator, $.labelName],
    color: "#219"
  },
  {
    tag: [$.literal, $.inserted],
    color: "#164"
  },
  {
    tag: [$.string, $.deleted],
    color: "#a11"
  },
  {
    tag: [$.regexp, $.escape, /* @__PURE__ */ $.special($.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ $.definition($.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ $.local($.variableName),
    color: "#30a"
  },
  {
    tag: [$.typeName, $.namespace],
    color: "#085"
  },
  {
    tag: $.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ $.special($.variableName), $.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ $.definition($.propertyName),
    color: "#00c"
  },
  {
    tag: $.comment,
    color: "#940"
  },
  {
    tag: $.invalid,
    color: "#f00"
  }
]), WR = /* @__PURE__ */ I.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), f0 = 1e4, u0 = "()[]{}", d0 = /* @__PURE__ */ j.define({
  combine(n) {
    return ci(n, {
      afterCursor: !0,
      brackets: u0,
      maxScanDistance: f0,
      renderMatch: UR
    });
  }
}), YR = /* @__PURE__ */ H.mark({ class: "cm-matchingBracket" }), AR = /* @__PURE__ */ H.mark({ class: "cm-nonmatchingBracket" });
function UR(n) {
  let e = [], t = n.matched ? YR : AR;
  return e.push(t.range(n.start.from, n.start.to)), n.end && e.push(t.range(n.end.from, n.end.to)), e;
}
const VR = /* @__PURE__ */ Ne.define({
  create() {
    return H.none;
  },
  update(n, e) {
    if (!e.docChanged && !e.selection)
      return n;
    let t = [], i = e.state.facet(d0);
    for (let r of e.state.selection.ranges) {
      if (!r.empty)
        continue;
      let s = xi(e.state, r.head, -1, i) || r.head > 0 && xi(e.state, r.head - 1, 1, i) || i.afterCursor && (xi(e.state, r.head, 1, i) || r.head < e.state.doc.length && xi(e.state, r.head + 1, -1, i));
      s && (t = t.concat(i.renderMatch(s, e.state)));
    }
    return H.set(t, !0);
  },
  provide: (n) => I.decorations.from(n)
}), zR = [
  VR,
  WR
];
function ER(n = {}) {
  return [d0.of(n), zR];
}
const MR = /* @__PURE__ */ new ue();
function uc(n, e, t) {
  let i = n.prop(e < 0 ? ue.openedBy : ue.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let r = t.indexOf(n.name);
    if (r > -1 && r % 2 == (e < 0 ? 1 : 0))
      return [t[r + e]];
  }
  return null;
}
function dc(n) {
  let e = n.type.prop(MR);
  return e ? e(n.node) : n;
}
function xi(n, e, t, i = {}) {
  let r = i.maxScanDistance || f0, s = i.brackets || u0, l = De(n), O = l.resolveInner(e, t);
  for (let h = O; h; h = h.parent) {
    let f = uc(h.type, t, s);
    if (f && h.from < h.to) {
      let u = dc(h);
      if (u && (t > 0 ? e >= u.from && e < u.to : e > u.from && e <= u.to))
        return GR(n, e, t, h, u, f, s);
    }
  }
  return DR(n, e, t, l, O.type, r, s);
}
function GR(n, e, t, i, r, s, l) {
  let O = i.parent, h = { from: r.from, to: r.to }, f = 0, u = O == null ? void 0 : O.cursor();
  if (u && (t < 0 ? u.childBefore(i.from) : u.childAfter(i.to)))
    do
      if (t < 0 ? u.to <= i.from : u.from >= i.to) {
        if (f == 0 && s.indexOf(u.type.name) > -1 && u.from < u.to) {
          let d = dc(u);
          return { start: h, end: d ? { from: d.from, to: d.to } : void 0, matched: !0 };
        } else if (uc(u.type, t, l))
          f++;
        else if (uc(u.type, -t, l)) {
          if (f == 0) {
            let d = dc(u);
            return {
              start: h,
              end: d && d.from < d.to ? { from: d.from, to: d.to } : void 0,
              matched: !1
            };
          }
          f--;
        }
      }
    while (t < 0 ? u.prevSibling() : u.nextSibling());
  return { start: h, matched: !1 };
}
function DR(n, e, t, i, r, s, l) {
  let O = t < 0 ? n.sliceDoc(e - 1, e) : n.sliceDoc(e, e + 1), h = l.indexOf(O);
  if (h < 0 || h % 2 == 0 != t > 0)
    return null;
  let f = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e }, u = n.doc.iterRange(e, t > 0 ? n.doc.length : 0), d = 0;
  for (let g = 0; !u.next().done && g <= s; ) {
    let Q = u.value;
    t < 0 && (g += Q.length);
    let b = e + g * t;
    for (let v = t > 0 ? 0 : Q.length - 1, w = t > 0 ? Q.length : -1; v != w; v += t) {
      let Z = l.indexOf(Q[v]);
      if (!(Z < 0 || i.resolveInner(b + v, 1).type != r))
        if (Z % 2 == 0 == t > 0)
          d++;
        else {
          if (d == 1)
            return { start: f, end: { from: b + v, to: b + v + 1 }, matched: Z >> 1 == h >> 1 };
          d--;
        }
    }
    t > 0 && (g += Q.length);
  }
  return u.done ? { start: f, matched: !1 } : null;
}
const IR = /* @__PURE__ */ Object.create(null), og = [Rt.none], lg = [], ag = /* @__PURE__ */ Object.create(null), LR = /* @__PURE__ */ Object.create(null);
for (let [n, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  LR[n] = /* @__PURE__ */ BR(IR, e);
function uh(n, e) {
  lg.indexOf(n) > -1 || (lg.push(n), console.warn(e));
}
function BR(n, e) {
  let t = [];
  for (let O of e.split(" ")) {
    let h = [];
    for (let f of O.split(".")) {
      let u = n[f] || $[f];
      u ? typeof u == "function" ? h.length ? h = h.map(u) : uh(f, `Modifier ${f} used at start of tag`) : h.length ? uh(f, `Tag ${f} used as modifier`) : h = Array.isArray(u) ? u : [u] : uh(f, `Unknown highlighting tag ${f}`);
    }
    for (let f of h)
      t.push(f);
  }
  if (!t.length)
    return 0;
  let i = e.replace(/ /g, "_"), r = i + " " + t.map((O) => O.id), s = ag[r];
  if (s)
    return s.id;
  let l = ag[r] = Rt.define({
    id: og.length,
    name: i,
    props: [Mr({ [i]: t })]
  });
  return og.push(l), l.id;
}
Re.RTL, Re.LTR;
const jR = (n) => {
  let { state: e } = n, t = e.doc.lineAt(e.selection.main.from), i = Fc(n.state, t.from);
  return i.line ? NR(n) : i.block ? HR(n) : !1;
};
function Nc(n, e) {
  return ({ state: t, dispatch: i }) => {
    if (t.readOnly)
      return !1;
    let r = n(e, t);
    return r ? (i(t.update(r)), !0) : !1;
  };
}
const NR = /* @__PURE__ */ Nc(
  e_,
  0
  /* CommentOption.Toggle */
), FR = /* @__PURE__ */ Nc(
  p0,
  0
  /* CommentOption.Toggle */
), HR = /* @__PURE__ */ Nc(
  (n, e) => p0(n, e, KR(e)),
  0
  /* CommentOption.Toggle */
);
function Fc(n, e) {
  let t = n.languageDataAt("commentTokens", e);
  return t.length ? t[0] : {};
}
const $s = 50;
function JR(n, { open: e, close: t }, i, r) {
  let s = n.sliceDoc(i - $s, i), l = n.sliceDoc(r, r + $s), O = /\s*$/.exec(s)[0].length, h = /^\s*/.exec(l)[0].length, f = s.length - O;
  if (s.slice(f - e.length, f) == e && l.slice(h, h + t.length) == t)
    return {
      open: { pos: i - O, margin: O && 1 },
      close: { pos: r + h, margin: h && 1 }
    };
  let u, d;
  r - i <= 2 * $s ? u = d = n.sliceDoc(i, r) : (u = n.sliceDoc(i, i + $s), d = n.sliceDoc(r - $s, r));
  let g = /^\s*/.exec(u)[0].length, Q = /\s*$/.exec(d)[0].length, b = d.length - Q - t.length;
  return u.slice(g, g + e.length) == e && d.slice(b, b + t.length) == t ? {
    open: {
      pos: i + g + e.length,
      margin: /\s/.test(u.charAt(g + e.length)) ? 1 : 0
    },
    close: {
      pos: r - Q - t.length,
      margin: /\s/.test(d.charAt(b - 1)) ? 1 : 0
    }
  } : null;
}
function KR(n) {
  let e = [];
  for (let t of n.selection.ranges) {
    let i = n.doc.lineAt(t.from), r = t.to <= i.to ? i : n.doc.lineAt(t.to), s = e.length - 1;
    s >= 0 && e[s].to > i.from ? e[s].to = r.to : e.push({ from: i.from + /^\s*/.exec(i.text)[0].length, to: r.to });
  }
  return e;
}
function p0(n, e, t = e.selection.ranges) {
  let i = t.map((s) => Fc(e, s.from).block);
  if (!i.every((s) => s))
    return null;
  let r = t.map((s, l) => JR(e, i[l], s.from, s.to));
  if (n != 2 && !r.every((s) => s))
    return { changes: e.changes(t.map((s, l) => r[l] ? [] : [{ from: s.from, insert: i[l].open + " " }, { from: s.to, insert: " " + i[l].close }])) };
  if (n != 1 && r.some((s) => s)) {
    let s = [];
    for (let l = 0, O; l < r.length; l++)
      if (O = r[l]) {
        let h = i[l], { open: f, close: u } = O;
        s.push({ from: f.pos - h.open.length, to: f.pos + f.margin }, { from: u.pos - u.margin, to: u.pos + h.close.length });
      }
    return { changes: s };
  }
  return null;
}
function e_(n, e, t = e.selection.ranges) {
  let i = [], r = -1;
  for (let { from: s, to: l } of t) {
    let O = i.length, h = 1e9, f = Fc(e, s).line;
    if (f) {
      for (let u = s; u <= l; ) {
        let d = e.doc.lineAt(u);
        if (d.from > r && (s == l || l > d.from)) {
          r = d.from;
          let g = /^\s*/.exec(d.text)[0].length, Q = g == d.length, b = d.text.slice(g, g + f.length) == f ? g : -1;
          g < d.text.length && g < h && (h = g), i.push({ line: d, comment: b, token: f, indent: g, empty: Q, single: !1 });
        }
        u = d.to + 1;
      }
      if (h < 1e9)
        for (let u = O; u < i.length; u++)
          i[u].indent < i[u].line.text.length && (i[u].indent = h);
      i.length == O + 1 && (i[O].single = !0);
    }
  }
  if (n != 2 && i.some((s) => s.comment < 0 && (!s.empty || s.single))) {
    let s = [];
    for (let { line: O, token: h, indent: f, empty: u, single: d } of i)
      (d || !u) && s.push({ from: O.from + f, insert: h + " " });
    let l = e.changes(s);
    return { changes: l, selection: e.selection.map(l, 1) };
  } else if (n != 1 && i.some((s) => s.comment >= 0)) {
    let s = [];
    for (let { line: l, comment: O, token: h } of i)
      if (O >= 0) {
        let f = l.from + O, u = f + h.length;
        l.text[u - l.from] == " " && u++, s.push({ from: f, to: u });
      }
    return { changes: s };
  }
  return null;
}
const pc = /* @__PURE__ */ Hi.define(), t_ = /* @__PURE__ */ Hi.define(), i_ = /* @__PURE__ */ j.define(), g0 = /* @__PURE__ */ j.define({
  combine(n) {
    return ci(n, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (e, t) => t
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (e, t) => (i, r) => e(i, r) || t(i, r)
    });
  }
}), m0 = /* @__PURE__ */ Ne.define({
  create() {
    return vi.empty;
  },
  update(n, e) {
    let t = e.state.facet(g0), i = e.annotation(pc);
    if (i) {
      let h = kt.fromTransaction(e, i.selection), f = i.side, u = f == 0 ? n.undone : n.done;
      return h ? u = ea(u, u.length, t.minDepth, h) : u = $0(u, e.startState.selection), new vi(f == 0 ? i.rest : u, f == 0 ? u : i.rest);
    }
    let r = e.annotation(t_);
    if ((r == "full" || r == "before") && (n = n.isolate()), e.annotation(Be.addToHistory) === !1)
      return e.changes.empty ? n : n.addMapping(e.changes.desc);
    let s = kt.fromTransaction(e), l = e.annotation(Be.time), O = e.annotation(Be.userEvent);
    return s ? n = n.addChanges(s, l, O, t, e) : e.selection && (n = n.addSelection(e.startState.selection, l, O, t.newGroupDelay)), (r == "full" || r == "after") && (n = n.isolate()), n;
  },
  toJSON(n) {
    return { done: n.done.map((e) => e.toJSON()), undone: n.undone.map((e) => e.toJSON()) };
  },
  fromJSON(n) {
    return new vi(n.done.map(kt.fromJSON), n.undone.map(kt.fromJSON));
  }
});
function Q0(n = {}) {
  return [
    m0,
    g0.of(n),
    I.domEventHandlers({
      beforeinput(e, t) {
        let i = e.inputType == "historyUndo" ? P0 : e.inputType == "historyRedo" ? gc : null;
        return i ? (e.preventDefault(), i(t)) : !1;
      }
    })
  ];
}
function Sa(n, e) {
  return function({ state: t, dispatch: i }) {
    if (!e && t.readOnly)
      return !1;
    let r = t.field(m0, !1);
    if (!r)
      return !1;
    let s = r.pop(n, t, e);
    return s ? (i(s), !0) : !1;
  };
}
const P0 = /* @__PURE__ */ Sa(0, !1), gc = /* @__PURE__ */ Sa(1, !1), n_ = /* @__PURE__ */ Sa(0, !0), r_ = /* @__PURE__ */ Sa(1, !0);
class kt {
  constructor(e, t, i, r, s) {
    this.changes = e, this.effects = t, this.mapped = i, this.startSelection = r, this.selectionsAfter = s;
  }
  setSelAfter(e) {
    return new kt(this.changes, this.effects, this.mapped, this.startSelection, e);
  }
  toJSON() {
    var e, t, i;
    return {
      changes: (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
      mapped: (t = this.mapped) === null || t === void 0 ? void 0 : t.toJSON(),
      startSelection: (i = this.startSelection) === null || i === void 0 ? void 0 : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((r) => r.toJSON())
    };
  }
  static fromJSON(e) {
    return new kt(e.changes && Ke.fromJSON(e.changes), [], e.mapped && ki.fromJSON(e.mapped), e.startSelection && X.fromJSON(e.startSelection), e.selectionsAfter.map(X.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(e, t) {
    let i = Ht;
    for (let r of e.startState.facet(i_)) {
      let s = r(e);
      s.length && (i = i.concat(s));
    }
    return !i.length && e.changes.empty ? null : new kt(e.changes.invert(e.startState.doc), i, void 0, t || e.startState.selection, Ht);
  }
  static selection(e) {
    return new kt(void 0, Ht, void 0, void 0, e);
  }
}
function ea(n, e, t, i) {
  let r = e + 1 > t + 20 ? e - t - 1 : 0, s = n.slice(r, e);
  return s.push(i), s;
}
function s_(n, e) {
  let t = [], i = !1;
  return n.iterChangedRanges((r, s) => t.push(r, s)), e.iterChangedRanges((r, s, l, O) => {
    for (let h = 0; h < t.length; ) {
      let f = t[h++], u = t[h++];
      O >= f && l <= u && (i = !0);
    }
  }), i;
}
function o_(n, e) {
  return n.ranges.length == e.ranges.length && n.ranges.filter((t, i) => t.empty != e.ranges[i].empty).length === 0;
}
function S0(n, e) {
  return n.length ? e.length ? n.concat(e) : n : e;
}
const Ht = [], l_ = 200;
function $0(n, e) {
  if (n.length) {
    let t = n[n.length - 1], i = t.selectionsAfter.slice(Math.max(0, t.selectionsAfter.length - l_));
    return i.length && i[i.length - 1].eq(e) ? n : (i.push(e), ea(n, n.length - 1, 1e9, t.setSelAfter(i)));
  } else
    return [kt.selection([e])];
}
function a_(n) {
  let e = n[n.length - 1], t = n.slice();
  return t[n.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), t;
}
function dh(n, e) {
  if (!n.length)
    return n;
  let t = n.length, i = Ht;
  for (; t; ) {
    let r = O_(n[t - 1], e, i);
    if (r.changes && !r.changes.empty || r.effects.length) {
      let s = n.slice(0, t);
      return s[t - 1] = r, s;
    } else
      e = r.mapped, t--, i = r.selectionsAfter;
  }
  return i.length ? [kt.selection(i)] : Ht;
}
function O_(n, e, t) {
  let i = S0(n.selectionsAfter.length ? n.selectionsAfter.map((O) => O.map(e)) : Ht, t);
  if (!n.changes)
    return kt.selection(i);
  let r = n.changes.map(e), s = e.mapDesc(n.changes, !0), l = n.mapped ? n.mapped.composeDesc(s) : s;
  return new kt(r, ie.mapEffects(n.effects, e), l, n.startSelection.map(s), i);
}
const h_ = /^(input\.type|delete)($|\.)/;
class vi {
  constructor(e, t, i = 0, r = void 0) {
    this.done = e, this.undone = t, this.prevTime = i, this.prevUserEvent = r;
  }
  isolate() {
    return this.prevTime ? new vi(this.done, this.undone) : this;
  }
  addChanges(e, t, i, r, s) {
    let l = this.done, O = l[l.length - 1];
    return O && O.changes && !O.changes.empty && e.changes && (!i || h_.test(i)) && (!O.selectionsAfter.length && t - this.prevTime < r.newGroupDelay && r.joinToEvent(s, s_(O.changes, e.changes)) || // For compose (but not compose.start) events, always join with previous event
    i == "input.type.compose") ? l = ea(l, l.length - 1, r.minDepth, new kt(e.changes.compose(O.changes), S0(e.effects, O.effects), O.mapped, O.startSelection, Ht)) : l = ea(l, l.length, r.minDepth, e), new vi(l, Ht, t, i);
  }
  addSelection(e, t, i, r) {
    let s = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Ht;
    return s.length > 0 && t - this.prevTime < r && i == this.prevUserEvent && i && /^select($|\.)/.test(i) && o_(s[s.length - 1], e) ? this : new vi($0(this.done, e), this.undone, t, i);
  }
  addMapping(e) {
    return new vi(dh(this.done, e), dh(this.undone, e), this.prevTime, this.prevUserEvent);
  }
  pop(e, t, i) {
    let r = e == 0 ? this.done : this.undone;
    if (r.length == 0)
      return null;
    let s = r[r.length - 1], l = s.selectionsAfter[0] || t.selection;
    if (i && s.selectionsAfter.length)
      return t.update({
        selection: s.selectionsAfter[s.selectionsAfter.length - 1],
        annotations: pc.of({ side: e, rest: a_(r), selection: l }),
        userEvent: e == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (s.changes) {
      let O = r.length == 1 ? Ht : r.slice(0, r.length - 1);
      return s.mapped && (O = dh(O, s.mapped)), t.update({
        changes: s.changes,
        selection: s.startSelection,
        effects: s.effects,
        annotations: pc.of({ side: e, rest: O, selection: l }),
        filter: !1,
        userEvent: e == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
vi.empty = /* @__PURE__ */ new vi(Ht, Ht);
const b0 = [
  { key: "Mod-z", run: P0, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: gc, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: gc, preventDefault: !0 },
  { key: "Mod-u", run: n_, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: r_, preventDefault: !0 }
];
function Ir(n, e) {
  return X.create(n.ranges.map(e), n.mainIndex);
}
function Ri(n, e) {
  return n.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function fi({ state: n, dispatch: e }, t) {
  let i = Ir(n.selection, t);
  return i.eq(n.selection, !0) ? !1 : (e(Ri(n, i)), !0);
}
function $a(n, e) {
  return X.cursor(e ? n.to : n.from);
}
function y0(n, e) {
  return fi(n, (t) => t.empty ? n.moveByChar(t, e) : $a(t, e));
}
function ut(n) {
  return n.textDirectionAt(n.state.selection.main.head) == Re.LTR;
}
const x0 = (n) => y0(n, !ut(n)), v0 = (n) => y0(n, ut(n));
function w0(n, e) {
  return fi(n, (t) => t.empty ? n.moveByGroup(t, e) : $a(t, e));
}
const c_ = (n) => w0(n, !ut(n)), f_ = (n) => w0(n, ut(n));
function u_(n, e, t) {
  if (e.type.prop(t))
    return !0;
  let i = e.to - e.from;
  return i && (i > 2 || /[^\s,.;:]/.test(n.sliceDoc(e.from, e.to))) || e.firstChild;
}
function ba(n, e, t) {
  let i = De(n).resolveInner(e.head), r = t ? ue.closedBy : ue.openedBy;
  for (let h = e.head; ; ) {
    let f = t ? i.childAfter(h) : i.childBefore(h);
    if (!f)
      break;
    u_(n, f, r) ? i = f : h = t ? f.to : f.from;
  }
  let s = i.type.prop(r), l, O;
  return s && (l = t ? xi(n, i.from, 1) : xi(n, i.to, -1)) && l.matched ? O = t ? l.end.to : l.end.from : O = t ? i.to : i.from, X.cursor(O, t ? -1 : 1);
}
const d_ = (n) => fi(n, (e) => ba(n.state, e, !ut(n))), p_ = (n) => fi(n, (e) => ba(n.state, e, ut(n)));
function k0(n, e) {
  return fi(n, (t) => {
    if (!t.empty)
      return $a(t, e);
    let i = n.moveVertically(t, e);
    return i.head != t.head ? i : n.moveToLineBoundary(t, e);
  });
}
const T0 = (n) => k0(n, !1), Z0 = (n) => k0(n, !0);
function R0(n) {
  let e = n.scrollDOM.clientHeight < n.scrollDOM.scrollHeight - 2, t = 0, i = 0, r;
  if (e) {
    for (let s of n.state.facet(I.scrollMargins)) {
      let l = s(n);
      l != null && l.top && (t = Math.max(l == null ? void 0 : l.top, t)), l != null && l.bottom && (i = Math.max(l == null ? void 0 : l.bottom, i));
    }
    r = n.scrollDOM.clientHeight - t - i;
  } else
    r = (n.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: t,
    marginBottom: i,
    selfScroll: e,
    height: Math.max(n.defaultLineHeight, r - 5)
  };
}
function _0(n, e) {
  let t = R0(n), { state: i } = n, r = Ir(i.selection, (l) => l.empty ? n.moveVertically(l, e, t.height) : $a(l, e));
  if (r.eq(i.selection))
    return !1;
  let s;
  if (t.selfScroll) {
    let l = n.coordsAtPos(i.selection.main.head), O = n.scrollDOM.getBoundingClientRect(), h = O.top + t.marginTop, f = O.bottom - t.marginBottom;
    l && l.top > h && l.bottom < f && (s = I.scrollIntoView(r.main.head, { y: "start", yMargin: l.top - h }));
  }
  return n.dispatch(Ri(i, r), { effects: s }), !0;
}
const Og = (n) => _0(n, !1), mc = (n) => _0(n, !0);
function Zn(n, e, t) {
  let i = n.lineBlockAt(e.head), r = n.moveToLineBoundary(e, t);
  if (r.head == e.head && r.head != (t ? i.to : i.from) && (r = n.moveToLineBoundary(e, t, !1)), !t && r.head == i.from && i.length) {
    let s = /^\s*/.exec(n.state.sliceDoc(i.from, Math.min(i.from + 100, i.to)))[0].length;
    s && e.head != i.from + s && (r = X.cursor(i.from + s));
  }
  return r;
}
const g_ = (n) => fi(n, (e) => Zn(n, e, !0)), m_ = (n) => fi(n, (e) => Zn(n, e, !1)), Q_ = (n) => fi(n, (e) => Zn(n, e, !ut(n))), P_ = (n) => fi(n, (e) => Zn(n, e, ut(n))), S_ = (n) => fi(n, (e) => X.cursor(n.lineBlockAt(e.head).from, 1)), $_ = (n) => fi(n, (e) => X.cursor(n.lineBlockAt(e.head).to, -1));
function b_(n, e, t) {
  let i = !1, r = Ir(n.selection, (s) => {
    let l = xi(n, s.head, -1) || xi(n, s.head, 1) || s.head > 0 && xi(n, s.head - 1, 1) || s.head < n.doc.length && xi(n, s.head + 1, -1);
    if (!l || !l.end)
      return s;
    i = !0;
    let O = l.start.from == s.head ? l.end.to : l.end.from;
    return X.cursor(O);
  });
  return i ? (e(Ri(n, r)), !0) : !1;
}
const y_ = ({ state: n, dispatch: e }) => b_(n, e);
function ei(n, e) {
  let t = Ir(n.state.selection, (i) => {
    let r = e(i);
    return X.range(i.anchor, r.head, r.goalColumn, r.bidiLevel || void 0);
  });
  return t.eq(n.state.selection) ? !1 : (n.dispatch(Ri(n.state, t)), !0);
}
function X0(n, e) {
  return ei(n, (t) => n.moveByChar(t, e));
}
const q0 = (n) => X0(n, !ut(n)), C0 = (n) => X0(n, ut(n));
function W0(n, e) {
  return ei(n, (t) => n.moveByGroup(t, e));
}
const x_ = (n) => W0(n, !ut(n)), v_ = (n) => W0(n, ut(n)), w_ = (n) => ei(n, (e) => ba(n.state, e, !ut(n))), k_ = (n) => ei(n, (e) => ba(n.state, e, ut(n)));
function Y0(n, e) {
  return ei(n, (t) => n.moveVertically(t, e));
}
const A0 = (n) => Y0(n, !1), U0 = (n) => Y0(n, !0);
function V0(n, e) {
  return ei(n, (t) => n.moveVertically(t, e, R0(n).height));
}
const hg = (n) => V0(n, !1), cg = (n) => V0(n, !0), T_ = (n) => ei(n, (e) => Zn(n, e, !0)), Z_ = (n) => ei(n, (e) => Zn(n, e, !1)), R_ = (n) => ei(n, (e) => Zn(n, e, !ut(n))), __ = (n) => ei(n, (e) => Zn(n, e, ut(n))), X_ = (n) => ei(n, (e) => X.cursor(n.lineBlockAt(e.head).from)), q_ = (n) => ei(n, (e) => X.cursor(n.lineBlockAt(e.head).to)), fg = ({ state: n, dispatch: e }) => (e(Ri(n, { anchor: 0 })), !0), ug = ({ state: n, dispatch: e }) => (e(Ri(n, { anchor: n.doc.length })), !0), dg = ({ state: n, dispatch: e }) => (e(Ri(n, { anchor: n.selection.main.anchor, head: 0 })), !0), pg = ({ state: n, dispatch: e }) => (e(Ri(n, { anchor: n.selection.main.anchor, head: n.doc.length })), !0), C_ = ({ state: n, dispatch: e }) => (e(n.update({ selection: { anchor: 0, head: n.doc.length }, userEvent: "select" })), !0), W_ = ({ state: n, dispatch: e }) => {
  let t = ya(n).map(({ from: i, to: r }) => X.range(i, Math.min(r + 1, n.doc.length)));
  return e(n.update({ selection: X.create(t), userEvent: "select" })), !0;
}, Y_ = ({ state: n, dispatch: e }) => {
  let t = Ir(n.selection, (i) => {
    var r;
    let s = De(n).resolveStack(i.from, 1);
    for (let l = s; l; l = l.next) {
      let { node: O } = l;
      if ((O.from < i.from && O.to >= i.to || O.to > i.to && O.from <= i.from) && (!((r = O.parent) === null || r === void 0) && r.parent))
        return X.range(O.to, O.from);
    }
    return i;
  });
  return e(Ri(n, t)), !0;
}, A_ = ({ state: n, dispatch: e }) => {
  let t = n.selection, i = null;
  return t.ranges.length > 1 ? i = X.create([t.main]) : t.main.empty || (i = X.create([X.cursor(t.main.head)])), i ? (e(Ri(n, i)), !0) : !1;
};
function oo(n, e) {
  if (n.state.readOnly)
    return !1;
  let t = "delete.selection", { state: i } = n, r = i.changeByRange((s) => {
    let { from: l, to: O } = s;
    if (l == O) {
      let h = e(s);
      h < l ? (t = "delete.backward", h = Pl(n, h, !1)) : h > l && (t = "delete.forward", h = Pl(n, h, !0)), l = Math.min(l, h), O = Math.max(O, h);
    } else
      l = Pl(n, l, !1), O = Pl(n, O, !0);
    return l == O ? { range: s } : { changes: { from: l, to: O }, range: X.cursor(l, l < s.head ? -1 : 1) };
  });
  return r.changes.empty ? !1 : (n.dispatch(i.update(r, {
    scrollIntoView: !0,
    userEvent: t,
    effects: t == "delete.selection" ? I.announce.of(i.phrase("Selection deleted")) : void 0
  })), !0);
}
function Pl(n, e, t) {
  if (n instanceof I)
    for (let i of n.state.facet(I.atomicRanges).map((r) => r(n)))
      i.between(e, e, (r, s) => {
        r < e && s > e && (e = t ? s : r);
      });
  return e;
}
const z0 = (n, e, t) => oo(n, (i) => {
  let r = i.from, { state: s } = n, l = s.doc.lineAt(r), O, h;
  if (t && !e && r > l.from && r < l.from + 200 && !/[^ \t]/.test(O = l.text.slice(0, r - l.from))) {
    if (O[O.length - 1] == "	")
      return r - 1;
    let f = zr(O, s.tabSize), u = f % Hl(s) || Hl(s);
    for (let d = 0; d < u && O[O.length - 1 - d] == " "; d++)
      r--;
    h = r;
  } else
    h = at(l.text, r - l.from, e, e) + l.from, h == r && l.number != (e ? s.doc.lines : 1) ? h += e ? 1 : -1 : !e && /[\ufe00-\ufe0f]/.test(l.text.slice(h - l.from, r - l.from)) && (h = at(l.text, h - l.from, !1, !1) + l.from);
  return h;
}), Qc = (n) => z0(n, !1, !0), E0 = (n) => z0(n, !0, !1), M0 = (n, e) => oo(n, (t) => {
  let i = t.head, { state: r } = n, s = r.doc.lineAt(i), l = r.charCategorizer(i);
  for (let O = null; ; ) {
    if (i == (e ? s.to : s.from)) {
      i == t.head && s.number != (e ? r.doc.lines : 1) && (i += e ? 1 : -1);
      break;
    }
    let h = at(s.text, i - s.from, e) + s.from, f = s.text.slice(Math.min(i, h) - s.from, Math.max(i, h) - s.from), u = l(f);
    if (O != null && u != O)
      break;
    (f != " " || i != t.head) && (O = u), i = h;
  }
  return i;
}), G0 = (n) => M0(n, !1), U_ = (n) => M0(n, !0), V_ = (n) => oo(n, (e) => {
  let t = n.lineBlockAt(e.head).to;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), z_ = (n) => oo(n, (e) => {
  let t = n.moveToLineBoundary(e, !1).head;
  return e.head > t ? t : Math.max(0, e.head - 1);
}), E_ = (n) => oo(n, (e) => {
  let t = n.moveToLineBoundary(e, !0).head;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), M_ = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => ({
    changes: { from: i.from, to: i.to, insert: Pe.of(["", ""]) },
    range: X.cursor(i.from)
  }));
  return e(n.update(t, { scrollIntoView: !0, userEvent: "input" })), !0;
}, G_ = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => {
    if (!i.empty || i.from == 0 || i.from == n.doc.length)
      return { range: i };
    let r = i.from, s = n.doc.lineAt(r), l = r == s.from ? r - 1 : at(s.text, r - s.from, !1) + s.from, O = r == s.to ? r + 1 : at(s.text, r - s.from, !0) + s.from;
    return {
      changes: { from: l, to: O, insert: n.doc.slice(r, O).append(n.doc.slice(l, r)) },
      range: X.cursor(O)
    };
  });
  return t.changes.empty ? !1 : (e(n.update(t, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function ya(n) {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let r = n.doc.lineAt(i.from), s = n.doc.lineAt(i.to);
    if (!i.empty && i.to == s.from && (s = n.doc.lineAt(i.to - 1)), t >= r.number) {
      let l = e[e.length - 1];
      l.to = s.to, l.ranges.push(i);
    } else
      e.push({ from: r.from, to: s.to, ranges: [i] });
    t = s.number + 1;
  }
  return e;
}
function D0(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [], r = [];
  for (let s of ya(n)) {
    if (t ? s.to == n.doc.length : s.from == 0)
      continue;
    let l = n.doc.lineAt(t ? s.to + 1 : s.from - 1), O = l.length + 1;
    if (t) {
      i.push({ from: s.to, to: l.to }, { from: s.from, insert: l.text + n.lineBreak });
      for (let h of s.ranges)
        r.push(X.range(Math.min(n.doc.length, h.anchor + O), Math.min(n.doc.length, h.head + O)));
    } else {
      i.push({ from: l.from, to: s.from }, { from: s.to, insert: n.lineBreak + l.text });
      for (let h of s.ranges)
        r.push(X.range(h.anchor - O, h.head - O));
    }
  }
  return i.length ? (e(n.update({
    changes: i,
    scrollIntoView: !0,
    selection: X.create(r, n.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const D_ = ({ state: n, dispatch: e }) => D0(n, e, !1), I_ = ({ state: n, dispatch: e }) => D0(n, e, !0);
function I0(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [];
  for (let r of ya(n))
    t ? i.push({ from: r.from, insert: n.doc.slice(r.from, r.to) + n.lineBreak }) : i.push({ from: r.to, insert: n.lineBreak + n.doc.slice(r.from, r.to) });
  return e(n.update({ changes: i, scrollIntoView: !0, userEvent: "input.copyline" })), !0;
}
const L_ = ({ state: n, dispatch: e }) => I0(n, e, !1), B_ = ({ state: n, dispatch: e }) => I0(n, e, !0), j_ = (n) => {
  if (n.state.readOnly)
    return !1;
  let { state: e } = n, t = e.changes(ya(e).map(({ from: r, to: s }) => (r > 0 ? r-- : s < e.doc.length && s++, { from: r, to: s }))), i = Ir(e.selection, (r) => {
    let s;
    if (n.lineWrapping) {
      let l = n.lineBlockAt(r.head), O = n.coordsAtPos(r.head, r.assoc || 1);
      O && (s = l.bottom + n.documentTop - O.bottom + n.defaultLineHeight / 2);
    }
    return n.moveVertically(r, !0, s);
  }).map(t);
  return n.dispatch({ changes: t, selection: i, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function N_(n, e) {
  if (/\(\)|\[\]|\{\}/.test(n.sliceDoc(e - 1, e + 1)))
    return { from: e, to: e };
  let t = De(n).resolveInner(e), i = t.childBefore(e), r = t.childAfter(e), s;
  return i && r && i.to <= e && r.from >= e && (s = i.type.prop(ue.closedBy)) && s.indexOf(r.name) > -1 && n.doc.lineAt(i.to).from == n.doc.lineAt(r.from).from && !/\S/.test(n.sliceDoc(i.to, r.from)) ? { from: i.to, to: r.from } : null;
}
const F_ = /* @__PURE__ */ L0(!1), H_ = /* @__PURE__ */ L0(!0);
function L0(n) {
  return ({ state: e, dispatch: t }) => {
    if (e.readOnly)
      return !1;
    let i = e.changeByRange((r) => {
      let { from: s, to: l } = r, O = e.doc.lineAt(s), h = !n && s == l && N_(e, s);
      n && (s = l = (l <= O.to ? O : e.doc.lineAt(l)).to);
      let f = new ma(e, { simulateBreak: s, simulateDoubleBreak: !!h }), u = Lc(f, s);
      for (u == null && (u = zr(/^\s*/.exec(e.doc.lineAt(s).text)[0], e.tabSize)); l < O.to && /\s/.test(O.text[l - O.from]); )
        l++;
      h ? { from: s, to: l } = h : s > O.from && s < O.from + 100 && !/\S/.test(O.text.slice(0, s)) && (s = O.from);
      let d = ["", Is(e, u)];
      return h && d.push(Is(e, f.lineIndent(O.from, -1))), {
        changes: { from: s, to: l, insert: Pe.of(d) },
        range: X.cursor(s + 1 + d[1].length)
      };
    });
    return t(e.update(i, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function Hc(n, e) {
  let t = -1;
  return n.changeByRange((i) => {
    let r = [];
    for (let l = i.from; l <= i.to; ) {
      let O = n.doc.lineAt(l);
      O.number > t && (i.empty || i.to > O.from) && (e(O, r, i), t = O.number), l = O.to + 1;
    }
    let s = n.changes(r);
    return {
      changes: r,
      range: X.range(s.mapPos(i.anchor, 1), s.mapPos(i.head, 1))
    };
  });
}
const J_ = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = /* @__PURE__ */ Object.create(null), i = new ma(n, { overrideIndentation: (s) => {
    let l = t[s];
    return l ?? -1;
  } }), r = Hc(n, (s, l, O) => {
    let h = Lc(i, s.from);
    if (h == null)
      return;
    /\S/.test(s.text) || (h = 0);
    let f = /^\s*/.exec(s.text)[0], u = Is(n, h);
    (f != u || O.from < s.from + f.length) && (t[s.from] = h, l.push({ from: s.from, to: s.from + f.length, insert: u }));
  });
  return r.changes.empty || e(n.update(r, { userEvent: "indent" })), !0;
}, B0 = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(Hc(n, (t, i) => {
  i.push({ from: t.from, insert: n.facet(no) });
}), { userEvent: "input.indent" })), !0), j0 = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(Hc(n, (t, i) => {
  let r = /^\s*/.exec(t.text)[0];
  if (!r)
    return;
  let s = zr(r, n.tabSize), l = 0, O = Is(n, Math.max(0, s - Hl(n)));
  for (; l < r.length && l < O.length && r.charCodeAt(l) == O.charCodeAt(l); )
    l++;
  i.push({ from: t.from + l, to: t.from + r.length, insert: O.slice(l) });
}), { userEvent: "delete.dedent" })), !0), K_ = (n) => (n.setTabFocusMode(), !0), eX = [
  { key: "Ctrl-b", run: x0, shift: q0, preventDefault: !0 },
  { key: "Ctrl-f", run: v0, shift: C0 },
  { key: "Ctrl-p", run: T0, shift: A0 },
  { key: "Ctrl-n", run: Z0, shift: U0 },
  { key: "Ctrl-a", run: S_, shift: X_ },
  { key: "Ctrl-e", run: $_, shift: q_ },
  { key: "Ctrl-d", run: E0 },
  { key: "Ctrl-h", run: Qc },
  { key: "Ctrl-k", run: V_ },
  { key: "Ctrl-Alt-h", run: G0 },
  { key: "Ctrl-o", run: M_ },
  { key: "Ctrl-t", run: G_ },
  { key: "Ctrl-v", run: mc }
], tX = /* @__PURE__ */ [
  { key: "ArrowLeft", run: x0, shift: q0, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: c_, shift: x_, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: Q_, shift: R_, preventDefault: !0 },
  { key: "ArrowRight", run: v0, shift: C0, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: f_, shift: v_, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: P_, shift: __, preventDefault: !0 },
  { key: "ArrowUp", run: T0, shift: A0, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: fg, shift: dg },
  { mac: "Ctrl-ArrowUp", run: Og, shift: hg },
  { key: "ArrowDown", run: Z0, shift: U0, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: ug, shift: pg },
  { mac: "Ctrl-ArrowDown", run: mc, shift: cg },
  { key: "PageUp", run: Og, shift: hg },
  { key: "PageDown", run: mc, shift: cg },
  { key: "Home", run: m_, shift: Z_, preventDefault: !0 },
  { key: "Mod-Home", run: fg, shift: dg },
  { key: "End", run: g_, shift: T_, preventDefault: !0 },
  { key: "Mod-End", run: ug, shift: pg },
  { key: "Enter", run: F_ },
  { key: "Mod-a", run: C_ },
  { key: "Backspace", run: Qc, shift: Qc },
  { key: "Delete", run: E0 },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: G0 },
  { key: "Mod-Delete", mac: "Alt-Delete", run: U_ },
  { mac: "Mod-Backspace", run: z_ },
  { mac: "Mod-Delete", run: E_ }
].concat(/* @__PURE__ */ eX.map((n) => ({ mac: n.key, run: n.run, shift: n.shift }))), N0 = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: d_, shift: w_ },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: p_, shift: k_ },
  { key: "Alt-ArrowUp", run: D_ },
  { key: "Shift-Alt-ArrowUp", run: L_ },
  { key: "Alt-ArrowDown", run: I_ },
  { key: "Shift-Alt-ArrowDown", run: B_ },
  { key: "Escape", run: A_ },
  { key: "Mod-Enter", run: H_ },
  { key: "Alt-l", mac: "Ctrl-l", run: W_ },
  { key: "Mod-i", run: Y_, preventDefault: !0 },
  { key: "Mod-[", run: j0 },
  { key: "Mod-]", run: B0 },
  { key: "Mod-Alt-\\", run: J_ },
  { key: "Shift-Mod-k", run: j_ },
  { key: "Shift-Mod-\\", run: y_ },
  { key: "Mod-/", run: jR },
  { key: "Alt-A", run: FR },
  { key: "Ctrl-m", mac: "Shift-Alt-m", run: K_ }
].concat(tX), iX = { key: "Tab", run: B0, shift: j0 };
function ke() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var e = 1, t = arguments[1];
  if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
    for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i)) {
      var r = t[i];
      typeof r == "string" ? n.setAttribute(i, r) : r != null && (n[i] = r);
    }
    e++;
  }
  for (; e < arguments.length; e++) F0(n, arguments[e]);
  return n;
}
function F0(n, e) {
  if (typeof e == "string")
    n.appendChild(document.createTextNode(e));
  else if (e != null) if (e.nodeType != null)
    n.appendChild(e);
  else if (Array.isArray(e))
    for (var t = 0; t < e.length; t++) F0(n, e[t]);
  else
    throw new RangeError("Unsupported child node: " + e);
}
class nX {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.diagnostic = i;
  }
}
class In {
  constructor(e, t, i) {
    this.diagnostics = e, this.panel = t, this.selected = i;
  }
  static init(e, t, i) {
    let r = e, s = i.facet(wi).markerFilter;
    s && (r = s(r, i));
    let l = H.set(r.map((O) => O.from == O.to || O.from == O.to - 1 && i.doc.lineAt(O.from).to == O.from ? H.widget({
      widget: new fX(O),
      diagnostic: O
    }).range(O.from) : H.mark({
      attributes: { class: "cm-lintRange cm-lintRange-" + O.severity + (O.markClass ? " " + O.markClass : "") },
      diagnostic: O
    }).range(O.from, O.to)), !0);
    return new In(l, t, Ur(l));
  }
}
function Ur(n, e = null, t = 0) {
  let i = null;
  return n.between(t, 1e9, (r, s, { spec: l }) => {
    if (!(e && l.diagnostic != e))
      return i = new nX(r, s, l.diagnostic), !1;
  }), i;
}
function H0(n, e) {
  let t = e.pos, i = e.end || t, r = n.state.facet(wi).hideOn(n, t, i);
  if (r != null)
    return r;
  let s = n.startState.doc.lineAt(e.pos);
  return !!(n.effects.some((l) => l.is(xa)) || n.changes.touchesRange(s.from, Math.max(s.to, i)));
}
function J0(n, e) {
  return n.field(Tt, !1) ? e : e.concat(ie.appendConfig.of(o1));
}
function rX(n, e) {
  return {
    effects: J0(n, [xa.of(e)])
  };
}
const xa = /* @__PURE__ */ ie.define(), Jc = /* @__PURE__ */ ie.define(), K0 = /* @__PURE__ */ ie.define(), Tt = /* @__PURE__ */ Ne.define({
  create() {
    return new In(H.none, null, null);
  },
  update(n, e) {
    if (e.docChanged && n.diagnostics.size) {
      let t = n.diagnostics.map(e.changes), i = null, r = n.panel;
      if (n.selected) {
        let s = e.changes.mapPos(n.selected.from, 1);
        i = Ur(t, n.selected.diagnostic, s) || Ur(t, null, s);
      }
      !t.size && r && e.state.facet(wi).autoPanel && (r = null), n = new In(t, r, i);
    }
    for (let t of e.effects)
      if (t.is(xa)) {
        let i = e.state.facet(wi).autoPanel ? t.value.length ? Ls.open : null : n.panel;
        n = In.init(t.value, i, e.state);
      } else t.is(Jc) ? n = new In(n.diagnostics, t.value ? Ls.open : null, n.selected) : t.is(K0) && (n = new In(n.diagnostics, n.panel, t.value));
    return n;
  },
  provide: (n) => [
    Gs.from(n, (e) => e.panel),
    I.decorations.from(n, (e) => e.diagnostics)
  ]
});
function sX(n) {
  let e = n.field(Tt, !1);
  return e ? e.diagnostics.size : 0;
}
const oX = /* @__PURE__ */ H.mark({ class: "cm-lintRange cm-lintRange-active" });
function lX(n, e, t) {
  let { diagnostics: i } = n.state.field(Tt), r = [], s = 2e8, l = 0;
  i.between(e - (t < 0 ? 1 : 0), e + (t > 0 ? 1 : 0), (h, f, { spec: u }) => {
    e >= h && e <= f && (h == f || (e > h || t > 0) && (e < f || t < 0)) && (r.push(u.diagnostic), s = Math.min(h, s), l = Math.max(f, l));
  });
  let O = n.state.facet(wi).tooltipFilter;
  return O && (r = O(r, n.state)), r.length ? {
    pos: s,
    end: l,
    above: n.state.doc.lineAt(s).to < l,
    create() {
      return { dom: e1(n, r) };
    }
  } : null;
}
function e1(n, e) {
  return ke("ul", { class: "cm-tooltip-lint" }, e.map((t) => n1(n, t, !1)));
}
const aX = (n) => {
  let e = n.state.field(Tt, !1);
  (!e || !e.panel) && n.dispatch({ effects: J0(n.state, [Jc.of(!0)]) });
  let t = Ms(n, Ls.open);
  return t && t.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, gg = (n) => {
  let e = n.state.field(Tt, !1);
  return !e || !e.panel ? !1 : (n.dispatch({ effects: Jc.of(!1) }), !0);
}, OX = (n) => {
  let e = n.state.field(Tt, !1);
  if (!e)
    return !1;
  let t = n.state.selection.main, i = e.diagnostics.iter(t.to + 1);
  return !i.value && (i = e.diagnostics.iter(0), !i.value || i.from == t.from && i.to == t.to) ? !1 : (n.dispatch({ selection: { anchor: i.from, head: i.to }, scrollIntoView: !0 }), !0);
}, hX = [
  { key: "Mod-Shift-m", run: aX, preventDefault: !0 },
  { key: "F8", run: OX }
], t1 = /* @__PURE__ */ ze.fromClass(class {
  constructor(n) {
    this.view = n, this.timeout = -1, this.set = !0;
    let { delay: e } = n.state.facet(wi);
    this.lintTime = Date.now() + e, this.run = this.run.bind(this), this.timeout = setTimeout(this.run, e);
  }
  run() {
    clearTimeout(this.timeout);
    let n = Date.now();
    if (n < this.lintTime - 10)
      this.timeout = setTimeout(this.run, this.lintTime - n);
    else {
      this.set = !1;
      let { state: e } = this.view, { sources: t } = e.facet(wi);
      t.length && Promise.all(t.map((i) => Promise.resolve(i(this.view)))).then((i) => {
        let r = i.reduce((s, l) => s.concat(l));
        this.view.state.doc == e.doc && this.view.dispatch(rX(this.view.state, r));
      }, (i) => {
        mt(this.view.state, i);
      });
    }
  }
  update(n) {
    let e = n.state.facet(wi);
    (n.docChanged || e != n.startState.facet(wi) || e.needsRefresh && e.needsRefresh(n)) && (this.lintTime = Date.now() + e.delay, this.set || (this.set = !0, this.timeout = setTimeout(this.run, e.delay)));
  }
  force() {
    this.set && (this.lintTime = Date.now(), this.run());
  }
  destroy() {
    clearTimeout(this.timeout);
  }
}), wi = /* @__PURE__ */ j.define({
  combine(n) {
    return Object.assign({ sources: n.map((e) => e.source).filter((e) => e != null) }, ci(n.map((e) => e.config), {
      delay: 750,
      markerFilter: null,
      tooltipFilter: null,
      needsRefresh: null,
      hideOn: () => null
    }, {
      needsRefresh: (e, t) => e ? t ? (i) => e(i) || t(i) : e : t
    }));
  }
});
function cX(n, e = {}) {
  return [
    wi.of({ source: n, config: e }),
    t1,
    o1
  ];
}
function mg(n) {
  let e = n.plugin(t1);
  e && e.force();
}
function i1(n) {
  let e = [];
  if (n)
    e: for (let { name: t } of n) {
      for (let i = 0; i < t.length; i++) {
        let r = t[i];
        if (/[a-zA-Z]/.test(r) && !e.some((s) => s.toLowerCase() == r.toLowerCase())) {
          e.push(r);
          continue e;
        }
      }
      e.push("");
    }
  return e;
}
function n1(n, e, t) {
  var i;
  let r = t ? i1(e.actions) : [];
  return ke("li", { class: "cm-diagnostic cm-diagnostic-" + e.severity }, ke("span", { class: "cm-diagnosticText" }, e.renderMessage ? e.renderMessage(n) : e.message), (i = e.actions) === null || i === void 0 ? void 0 : i.map((s, l) => {
    let O = !1, h = (g) => {
      if (g.preventDefault(), O)
        return;
      O = !0;
      let Q = Ur(n.state.field(Tt).diagnostics, e);
      Q && s.apply(n, Q.from, Q.to);
    }, { name: f } = s, u = r[l] ? f.indexOf(r[l]) : -1, d = u < 0 ? f : [
      f.slice(0, u),
      ke("u", f.slice(u, u + 1)),
      f.slice(u + 1)
    ];
    return ke("button", {
      type: "button",
      class: "cm-diagnosticAction",
      onclick: h,
      onmousedown: h,
      "aria-label": ` Action: ${f}${u < 0 ? "" : ` (access key "${r[l]})"`}.`
    }, d);
  }), e.source && ke("div", { class: "cm-diagnosticSource" }, e.source));
}
class fX extends Zi {
  constructor(e) {
    super(), this.diagnostic = e;
  }
  eq(e) {
    return e.diagnostic == this.diagnostic;
  }
  toDOM() {
    return ke("span", { class: "cm-lintPoint cm-lintPoint-" + this.diagnostic.severity });
  }
}
class Qg {
  constructor(e, t) {
    this.diagnostic = t, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = n1(e, t, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class Ls {
  constructor(e) {
    this.view = e, this.items = [];
    let t = (r) => {
      if (r.keyCode == 27)
        gg(this.view), this.view.focus();
      else if (r.keyCode == 38 || r.keyCode == 33)
        this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
      else if (r.keyCode == 40 || r.keyCode == 34)
        this.moveSelection((this.selectedIndex + 1) % this.items.length);
      else if (r.keyCode == 36)
        this.moveSelection(0);
      else if (r.keyCode == 35)
        this.moveSelection(this.items.length - 1);
      else if (r.keyCode == 13)
        this.view.focus();
      else if (r.keyCode >= 65 && r.keyCode <= 90 && this.selectedIndex >= 0) {
        let { diagnostic: s } = this.items[this.selectedIndex], l = i1(s.actions);
        for (let O = 0; O < l.length; O++)
          if (l[O].toUpperCase().charCodeAt(0) == r.keyCode) {
            let h = Ur(this.view.state.field(Tt).diagnostics, s);
            h && s.actions[O].apply(e, h.from, h.to);
          }
      } else
        return;
      r.preventDefault();
    }, i = (r) => {
      for (let s = 0; s < this.items.length; s++)
        this.items[s].dom.contains(r.target) && this.moveSelection(s);
    };
    this.list = ke("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: t,
      onclick: i
    }), this.dom = ke("div", { class: "cm-panel-lint" }, this.list, ke("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => gg(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let e = this.view.state.field(Tt).selected;
    if (!e)
      return -1;
    for (let t = 0; t < this.items.length; t++)
      if (this.items[t].diagnostic == e.diagnostic)
        return t;
    return -1;
  }
  update() {
    let { diagnostics: e, selected: t } = this.view.state.field(Tt), i = 0, r = !1, s = null;
    for (e.between(0, this.view.state.doc.length, (l, O, { spec: h }) => {
      let f = -1, u;
      for (let d = i; d < this.items.length; d++)
        if (this.items[d].diagnostic == h.diagnostic) {
          f = d;
          break;
        }
      f < 0 ? (u = new Qg(this.view, h.diagnostic), this.items.splice(i, 0, u), r = !0) : (u = this.items[f], f > i && (this.items.splice(i, f - i), r = !0)), t && u.diagnostic == t.diagnostic ? u.dom.hasAttribute("aria-selected") || (u.dom.setAttribute("aria-selected", "true"), s = u) : u.dom.hasAttribute("aria-selected") && u.dom.removeAttribute("aria-selected"), i++;
    }); i < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      r = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new Qg(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), r = !0), s ? (this.list.setAttribute("aria-activedescendant", s.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: s.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: l, panel: O }) => {
        let h = O.height / this.list.offsetHeight;
        l.top < O.top ? this.list.scrollTop -= (O.top - l.top) / h : l.bottom > O.bottom && (this.list.scrollTop += (l.bottom - O.bottom) / h);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), r && this.sync();
  }
  sync() {
    let e = this.list.firstChild;
    function t() {
      let i = e;
      e = i.nextSibling, i.remove();
    }
    for (let i of this.items)
      if (i.dom.parentNode == this.list) {
        for (; e != i.dom; )
          t();
        e = i.dom.nextSibling;
      } else
        this.list.insertBefore(i.dom, e);
    for (; e; )
      t();
  }
  moveSelection(e) {
    if (this.selectedIndex < 0)
      return;
    let t = this.view.state.field(Tt), i = Ur(t.diagnostics, this.items[e].diagnostic);
    i && this.view.dispatch({
      selection: { anchor: i.from, head: i.to },
      scrollIntoView: !0,
      effects: K0.of(i)
    });
  }
  static open(e) {
    return new Ls(e);
  }
}
function Cl(n, e = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(n)}</svg>')`;
}
function Sl(n) {
  return Cl(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${n}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const uX = /* @__PURE__ */ I.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
  ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
  ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
  ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: 0.7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ Sl("#d11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ Sl("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ Sl("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ Sl("#66d") },
  ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": { borderBottomColor: "orange" }
  },
  ".cm-lintPoint-info": {
    "&:after": { borderBottomColor: "#999" }
  },
  ".cm-lintPoint-hint": {
    "&:after": { borderBottomColor: "#66d" }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": { textDecoration: "underline" }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": { textDecoration: "none" },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  }
});
function Pg(n) {
  return n == "error" ? 4 : n == "warning" ? 3 : n == "info" ? 2 : 1;
}
class dX extends Ti {
  constructor(e) {
    super(), this.diagnostics = e, this.severity = e.reduce((t, i) => Pg(t) < Pg(i.severity) ? i.severity : t, "hint");
  }
  toDOM(e) {
    let t = document.createElement("div");
    t.className = "cm-lint-marker cm-lint-marker-" + this.severity;
    let i = this.diagnostics, r = e.state.facet(va).tooltipFilter;
    return r && (i = r(i, e.state)), i.length && (t.onmouseover = () => gX(e, t, i)), t;
  }
}
function pX(n, e) {
  let t = (i) => {
    let r = e.getBoundingClientRect();
    if (!(i.clientX > r.left - 10 && i.clientX < r.right + 10 && i.clientY > r.top - 10 && i.clientY < r.bottom + 10)) {
      for (let s = i.target; s; s = s.parentNode)
        if (s.nodeType == 1 && s.classList.contains("cm-tooltip-lint"))
          return;
      window.removeEventListener("mousemove", t), n.state.field(s1) && n.dispatch({ effects: Kc.of(null) });
    }
  };
  window.addEventListener("mousemove", t);
}
function gX(n, e, t) {
  function i() {
    let l = n.elementAtHeight(e.getBoundingClientRect().top + 5 - n.documentTop);
    n.coordsAtPos(l.from) && n.dispatch({ effects: Kc.of({
      pos: l.from,
      above: !1,
      create() {
        return {
          dom: e1(n, t),
          getCoords: () => e.getBoundingClientRect()
        };
      }
    }) }), e.onmouseout = e.onmousemove = null, pX(n, e);
  }
  let { hoverTime: r } = n.state.facet(va), s = setTimeout(i, r);
  e.onmouseout = () => {
    clearTimeout(s), e.onmouseout = e.onmousemove = null;
  }, e.onmousemove = () => {
    clearTimeout(s), s = setTimeout(i, r);
  };
}
function mX(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r of e) {
    let s = n.lineAt(r.from);
    (t[s.from] || (t[s.from] = [])).push(r);
  }
  let i = [];
  for (let r in t)
    i.push(new dX(t[r]).range(+r));
  return Qe.of(i, !0);
}
const QX = /* @__PURE__ */ EQ({
  class: "cm-gutter-lint",
  markers: (n) => n.state.field(r1)
}), r1 = /* @__PURE__ */ Ne.define({
  create() {
    return Qe.empty;
  },
  update(n, e) {
    n = n.map(e.changes);
    let t = e.state.facet(va).markerFilter;
    for (let i of e.effects)
      if (i.is(xa)) {
        let r = i.value;
        t && (r = t(r || [], e.state)), n = mX(e.state.doc, r.slice(0));
      }
    return n;
  }
}), Kc = /* @__PURE__ */ ie.define(), s1 = /* @__PURE__ */ Ne.define({
  create() {
    return null;
  },
  update(n, e) {
    return n && e.docChanged && (n = H0(e, n) ? null : Object.assign(Object.assign({}, n), { pos: e.changes.mapPos(n.pos) })), e.effects.reduce((t, i) => i.is(Kc) ? i.value : t, n);
  },
  provide: (n) => pa.from(n)
}), PX = /* @__PURE__ */ I.baseTheme({
  ".cm-gutter-lint": {
    width: "1.4em",
    "& .cm-gutterElement": {
      padding: ".2em"
    }
  },
  ".cm-lint-marker": {
    width: "1em",
    height: "1em"
  },
  ".cm-lint-marker-info": {
    content: /* @__PURE__ */ Cl('<path fill="#aaf" stroke="#77e" stroke-width="6" stroke-linejoin="round" d="M5 5L35 5L35 35L5 35Z"/>')
  },
  ".cm-lint-marker-warning": {
    content: /* @__PURE__ */ Cl('<path fill="#fe8" stroke="#fd7" stroke-width="6" stroke-linejoin="round" d="M20 6L37 35L3 35Z"/>')
  },
  ".cm-lint-marker-error": {
    content: /* @__PURE__ */ Cl('<circle cx="20" cy="20" r="15" fill="#f87" stroke="#f43" stroke-width="6"/>')
  }
}), o1 = [
  Tt,
  /* @__PURE__ */ I.decorations.compute([Tt], (n) => {
    let { selected: e, panel: t } = n.field(Tt);
    return !e || !t || e.from == e.to ? H.none : H.set([
      oX.range(e.from, e.to)
    ]);
  }),
  /* @__PURE__ */ WZ(lX, { hideOn: H0 }),
  uX
], va = /* @__PURE__ */ j.define({
  combine(n) {
    return ci(n, {
      hoverTime: 300,
      markerFilter: null,
      tooltipFilter: null
    });
  }
});
function SX(n = {}) {
  return [va.of(n), r1, QX, PX, s1];
}
const Sg = typeof String.prototype.normalize == "function" ? (n) => n.normalize("NFKD") : (n) => n;
class Vr {
  /**
  Create a text cursor. The query is the search string, `from` to
  `to` provides the region to search.
  
  When `normalize` is given, it will be called, on both the query
  string and the content it is matched against, before comparing.
  You can, for example, create a case-insensitive search by
  passing `s => s.toLowerCase()`.
  
  Text is always normalized with
  [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  (when supported).
  */
  constructor(e, t, i = 0, r = e.length, s, l) {
    this.test = l, this.value = { from: 0, to: 0 }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = e.iterRange(i, r), this.bufferStart = i, this.normalize = s ? (O) => s(Sg(O)) : Sg, this.query = this.normalize(t);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done)
        return -1;
      this.bufferPos = 0, this.buffer = this.iter.value;
    }
    return rt(this.buffer, this.bufferPos);
  }
  /**
  Look for the next match. Updates the iterator's
  [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
  [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
  at least once before using the cursor.
  */
  next() {
    for (; this.matches.length; )
      this.matches.pop();
    return this.nextOverlapping();
  }
  /**
  The `next` method will ignore matches that partially overlap a
  previous match. This method behaves like `next`, but includes
  such matches.
  */
  nextOverlapping() {
    for (; ; ) {
      let e = this.peek();
      if (e < 0)
        return this.done = !0, this;
      let t = Rc(e), i = this.bufferStart + this.bufferPos;
      this.bufferPos += Ft(e);
      let r = this.normalize(t);
      for (let s = 0, l = i; ; s++) {
        let O = r.charCodeAt(s), h = this.match(O, l, this.bufferPos + this.bufferStart);
        if (s == r.length - 1) {
          if (h)
            return this.value = h, this;
          break;
        }
        l == i && s < t.length && t.charCodeAt(s) == O && l++;
      }
    }
  }
  match(e, t, i) {
    let r = null;
    for (let s = 0; s < this.matches.length; s += 2) {
      let l = this.matches[s], O = !1;
      this.query.charCodeAt(l) == e && (l == this.query.length - 1 ? r = { from: this.matches[s + 1], to: i } : (this.matches[s]++, O = !0)), O || (this.matches.splice(s, 2), s -= 2);
    }
    return this.query.charCodeAt(0) == e && (this.query.length == 1 ? r = { from: t, to: i } : this.matches.push(1, t)), r && this.test && !this.test(r.from, r.to, this.buffer, this.bufferStart) && (r = null), r;
  }
}
typeof Symbol < "u" && (Vr.prototype[Symbol.iterator] = function() {
  return this;
});
const l1 = { from: -1, to: -1, match: /* @__PURE__ */ /.*/.exec("") }, ef = "gm" + (/x/.unicode == null ? "" : "u");
class a1 {
  /**
  Create a cursor that will search the given range in the given
  document. `query` should be the raw pattern (as you'd pass it to
  `new RegExp`).
  */
  constructor(e, t, i, r = 0, s = e.length) {
    if (this.text = e, this.to = s, this.curLine = "", this.done = !1, this.value = l1, /\\[sWDnr]|\n|\r|\[\^/.test(t))
      return new O1(e, t, i, r, s);
    this.re = new RegExp(t, ef + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.iter = e.iter();
    let l = e.lineAt(r);
    this.curLineStart = l.from, this.matchPos = ta(e, r), this.getLine(this.curLineStart);
  }
  getLine(e) {
    this.iter.next(e), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
  }
  /**
  Move to the next match, if there is one.
  */
  next() {
    for (let e = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = e;
      let t = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (t) {
        let i = this.curLineStart + t.index, r = i + t[0].length;
        if (this.matchPos = ta(this.text, r + (i == r ? 1 : 0)), i == this.curLineStart + this.curLine.length && this.nextLine(), (i < r || i > this.value.to) && (!this.test || this.test(i, r, t)))
          return this.value = { from: i, to: r, match: t }, this;
        e = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to)
        this.nextLine(), e = 0;
      else
        return this.done = !0, this;
    }
  }
}
const ph = /* @__PURE__ */ new WeakMap();
class Zr {
  constructor(e, t) {
    this.from = e, this.text = t;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(e, t, i) {
    let r = ph.get(e);
    if (!r || r.from >= i || r.to <= t) {
      let O = new Zr(t, e.sliceString(t, i));
      return ph.set(e, O), O;
    }
    if (r.from == t && r.to == i)
      return r;
    let { text: s, from: l } = r;
    return l > t && (s = e.sliceString(t, l) + s, l = t), r.to < i && (s += e.sliceString(r.to, i)), ph.set(e, new Zr(l, s)), new Zr(t, s.slice(t - l, i - l));
  }
}
class O1 {
  constructor(e, t, i, r, s) {
    this.text = e, this.to = s, this.done = !1, this.value = l1, this.matchPos = ta(e, r), this.re = new RegExp(t, ef + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.flat = Zr.get(e, r, this.chunkEnd(
      r + 5e3
      /* Chunk.Base */
    ));
  }
  chunkEnd(e) {
    return e >= this.to ? this.to : this.text.lineAt(e).to;
  }
  next() {
    for (; ; ) {
      let e = this.re.lastIndex = this.matchPos - this.flat.from, t = this.re.exec(this.flat.text);
      if (t && !t[0] && t.index == e && (this.re.lastIndex = e + 1, t = this.re.exec(this.flat.text)), t) {
        let i = this.flat.from + t.index, r = i + t[0].length;
        if ((this.flat.to >= this.to || t.index + t[0].length <= this.flat.text.length - 10) && (!this.test || this.test(i, r, t)))
          return this.value = { from: i, to: r, match: t }, this.matchPos = ta(this.text, r + (i == r ? 1 : 0)), this;
      }
      if (this.flat.to == this.to)
        return this.done = !0, this;
      this.flat = Zr.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
    }
  }
}
typeof Symbol < "u" && (a1.prototype[Symbol.iterator] = O1.prototype[Symbol.iterator] = function() {
  return this;
});
function $X(n) {
  try {
    return new RegExp(n, ef), !0;
  } catch {
    return !1;
  }
}
function ta(n, e) {
  if (e >= n.length)
    return e;
  let t = n.lineAt(e), i;
  for (; e < t.to && (i = t.text.charCodeAt(e - t.from)) >= 56320 && i < 57344; )
    e++;
  return e;
}
function Pc(n) {
  let e = String(n.state.doc.lineAt(n.state.selection.main.head).number), t = ke("input", { class: "cm-textfield", name: "line", value: e }), i = ke("form", {
    class: "cm-gotoLine",
    onkeydown: (s) => {
      s.keyCode == 27 ? (s.preventDefault(), n.dispatch({ effects: ia.of(!1) }), n.focus()) : s.keyCode == 13 && (s.preventDefault(), r());
    },
    onsubmit: (s) => {
      s.preventDefault(), r();
    }
  }, ke("label", n.state.phrase("Go to line"), ": ", t), " ", ke("button", { class: "cm-button", type: "submit" }, n.state.phrase("go")));
  function r() {
    let s = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(t.value);
    if (!s)
      return;
    let { state: l } = n, O = l.doc.lineAt(l.selection.main.head), [, h, f, u, d] = s, g = u ? +u.slice(1) : 0, Q = f ? +f : O.number;
    if (f && d) {
      let w = Q / 100;
      h && (w = w * (h == "-" ? -1 : 1) + O.number / l.doc.lines), Q = Math.round(l.doc.lines * w);
    } else f && h && (Q = Q * (h == "-" ? -1 : 1) + O.number);
    let b = l.doc.line(Math.max(1, Math.min(l.doc.lines, Q))), v = X.cursor(b.from + Math.max(0, Math.min(g, b.length)));
    n.dispatch({
      effects: [ia.of(!1), I.scrollIntoView(v.from, { y: "center" })],
      selection: v
    }), n.focus();
  }
  return { dom: i };
}
const ia = /* @__PURE__ */ ie.define(), $g = /* @__PURE__ */ Ne.define({
  create() {
    return !0;
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(ia) && (n = t.value);
    return n;
  },
  provide: (n) => Gs.from(n, (e) => e ? Pc : null)
}), bX = (n) => {
  let e = Ms(n, Pc);
  if (!e) {
    let t = [ia.of(!0)];
    n.state.field($g, !1) == null && t.push(ie.appendConfig.of([$g, yX])), n.dispatch({ effects: t }), e = Ms(n, Pc);
  }
  return e && e.dom.querySelector("input").select(), !0;
}, yX = /* @__PURE__ */ I.baseTheme({
  ".cm-panel.cm-gotoLine": {
    padding: "2px 6px 4px",
    "& label": { fontSize: "80%" }
  }
}), xX = {
  highlightWordAroundCursor: !1,
  minSelectionLength: 1,
  maxMatches: 100,
  wholeWords: !1
}, vX = /* @__PURE__ */ j.define({
  combine(n) {
    return ci(n, xX, {
      highlightWordAroundCursor: (e, t) => e || t,
      minSelectionLength: Math.min,
      maxMatches: Math.min
    });
  }
});
function wX(n) {
  return [_X, RX];
}
const kX = /* @__PURE__ */ H.mark({ class: "cm-selectionMatch" }), TX = /* @__PURE__ */ H.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
function bg(n, e, t, i) {
  return (t == 0 || n(e.sliceDoc(t - 1, t)) != qe.Word) && (i == e.doc.length || n(e.sliceDoc(i, i + 1)) != qe.Word);
}
function ZX(n, e, t, i) {
  return n(e.sliceDoc(t, t + 1)) == qe.Word && n(e.sliceDoc(i - 1, i)) == qe.Word;
}
const RX = /* @__PURE__ */ ze.fromClass(class {
  constructor(n) {
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.selectionSet || n.docChanged || n.viewportChanged) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = n.state.facet(vX), { state: t } = n, i = t.selection;
    if (i.ranges.length > 1)
      return H.none;
    let r = i.main, s, l = null;
    if (r.empty) {
      if (!e.highlightWordAroundCursor)
        return H.none;
      let h = t.wordAt(r.head);
      if (!h)
        return H.none;
      l = t.charCategorizer(r.head), s = t.sliceDoc(h.from, h.to);
    } else {
      let h = r.to - r.from;
      if (h < e.minSelectionLength || h > 200)
        return H.none;
      if (e.wholeWords) {
        if (s = t.sliceDoc(r.from, r.to), l = t.charCategorizer(r.head), !(bg(l, t, r.from, r.to) && ZX(l, t, r.from, r.to)))
          return H.none;
      } else if (s = t.sliceDoc(r.from, r.to), !s)
        return H.none;
    }
    let O = [];
    for (let h of n.visibleRanges) {
      let f = new Vr(t.doc, s, h.from, h.to);
      for (; !f.next().done; ) {
        let { from: u, to: d } = f.value;
        if ((!l || bg(l, t, u, d)) && (r.empty && u <= r.from && d >= r.to ? O.push(TX.range(u, d)) : (u >= r.to || d <= r.from) && O.push(kX.range(u, d)), O.length > e.maxMatches))
          return H.none;
      }
    }
    return H.set(O);
  }
}, {
  decorations: (n) => n.decorations
}), _X = /* @__PURE__ */ I.baseTheme({
  ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
  ".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" }
}), XX = ({ state: n, dispatch: e }) => {
  let { selection: t } = n, i = X.create(t.ranges.map((r) => n.wordAt(r.head) || X.cursor(r.head)), t.mainIndex);
  return i.eq(t) ? !1 : (e(n.update({ selection: i })), !0);
};
function qX(n, e) {
  let { main: t, ranges: i } = n.selection, r = n.wordAt(t.head), s = r && r.from == t.from && r.to == t.to;
  for (let l = !1, O = new Vr(n.doc, e, i[i.length - 1].to); ; )
    if (O.next(), O.done) {
      if (l)
        return null;
      O = new Vr(n.doc, e, 0, Math.max(0, i[i.length - 1].from - 1)), l = !0;
    } else {
      if (l && i.some((h) => h.from == O.value.from))
        continue;
      if (s) {
        let h = n.wordAt(O.value.from);
        if (!h || h.from != O.value.from || h.to != O.value.to)
          continue;
      }
      return O.value;
    }
}
const CX = ({ state: n, dispatch: e }) => {
  let { ranges: t } = n.selection;
  if (t.some((s) => s.from === s.to))
    return XX({ state: n, dispatch: e });
  let i = n.sliceDoc(t[0].from, t[0].to);
  if (n.selection.ranges.some((s) => n.sliceDoc(s.from, s.to) != i))
    return !1;
  let r = qX(n, i);
  return r ? (e(n.update({
    selection: n.selection.addRange(X.range(r.from, r.to), !1),
    effects: I.scrollIntoView(r.to)
  })), !0) : !1;
}, Lr = /* @__PURE__ */ j.define({
  combine(n) {
    return ci(n, {
      top: !1,
      caseSensitive: !1,
      literal: !1,
      regexp: !1,
      wholeWord: !1,
      createPanel: (e) => new LX(e),
      scrollToMatch: (e) => I.scrollIntoView(e)
    });
  }
});
class h1 {
  /**
  Create a query object.
  */
  constructor(e) {
    this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && (!this.regexp || $X(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!e.wholeWord;
  }
  /**
  @internal
  */
  unquote(e) {
    return this.literal ? e : e.replace(/\\([nrt\\])/g, (t, i) => i == "n" ? `
` : i == "r" ? "\r" : i == "t" ? "	" : "\\");
  }
  /**
  Compare this query to another query.
  */
  eq(e) {
    return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord;
  }
  /**
  @internal
  */
  create() {
    return this.regexp ? new UX(this) : new YX(this);
  }
  /**
  Get a search cursor for this query, searching through the given
  range in the given state.
  */
  getCursor(e, t = 0, i) {
    let r = e.doc ? e : ce.create({ doc: e });
    return i == null && (i = r.doc.length), this.regexp ? $r(this, r, t, i) : Sr(this, r, t, i);
  }
}
class c1 {
  constructor(e) {
    this.spec = e;
  }
}
function Sr(n, e, t, i) {
  return new Vr(e.doc, n.unquoted, t, i, n.caseSensitive ? void 0 : (r) => r.toLowerCase(), n.wholeWord ? WX(e.doc, e.charCategorizer(e.selection.main.head)) : void 0);
}
function WX(n, e) {
  return (t, i, r, s) => ((s > t || s + r.length < i) && (s = Math.max(0, t - 2), r = n.sliceString(s, Math.min(n.length, i + 2))), (e(na(r, t - s)) != qe.Word || e(ra(r, t - s)) != qe.Word) && (e(ra(r, i - s)) != qe.Word || e(na(r, i - s)) != qe.Word));
}
class YX extends c1 {
  constructor(e) {
    super(e);
  }
  nextMatch(e, t, i) {
    let r = Sr(this.spec, e, i, e.doc.length).nextOverlapping();
    return r.done && (r = Sr(this.spec, e, 0, t).nextOverlapping()), r.done ? null : r.value;
  }
  // Searching in reverse is, rather than implementing an inverted search
  // cursor, done by scanning chunk after chunk forward.
  prevMatchInRange(e, t, i) {
    for (let r = i; ; ) {
      let s = Math.max(t, r - 1e4 - this.spec.unquoted.length), l = Sr(this.spec, e, s, r), O = null;
      for (; !l.nextOverlapping().done; )
        O = l.value;
      if (O)
        return O;
      if (s == t)
        return null;
      r -= 1e4;
    }
  }
  prevMatch(e, t, i) {
    return this.prevMatchInRange(e, 0, t) || this.prevMatchInRange(e, i, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace);
  }
  matchAll(e, t) {
    let i = Sr(this.spec, e, 0, e.doc.length), r = [];
    for (; !i.next().done; ) {
      if (r.length >= t)
        return null;
      r.push(i.value);
    }
    return r;
  }
  highlight(e, t, i, r) {
    let s = Sr(this.spec, e, Math.max(0, t - this.spec.unquoted.length), Math.min(i + this.spec.unquoted.length, e.doc.length));
    for (; !s.next().done; )
      r(s.value.from, s.value.to);
  }
}
function $r(n, e, t, i) {
  return new a1(e.doc, n.search, {
    ignoreCase: !n.caseSensitive,
    test: n.wholeWord ? AX(e.charCategorizer(e.selection.main.head)) : void 0
  }, t, i);
}
function na(n, e) {
  return n.slice(at(n, e, !1), e);
}
function ra(n, e) {
  return n.slice(e, at(n, e));
}
function AX(n) {
  return (e, t, i) => !i[0].length || (n(na(i.input, i.index)) != qe.Word || n(ra(i.input, i.index)) != qe.Word) && (n(ra(i.input, i.index + i[0].length)) != qe.Word || n(na(i.input, i.index + i[0].length)) != qe.Word);
}
class UX extends c1 {
  nextMatch(e, t, i) {
    let r = $r(this.spec, e, i, e.doc.length).next();
    return r.done && (r = $r(this.spec, e, 0, t).next()), r.done ? null : r.value;
  }
  prevMatchInRange(e, t, i) {
    for (let r = 1; ; r++) {
      let s = Math.max(
        t,
        i - r * 1e4
        /* FindPrev.ChunkSize */
      ), l = $r(this.spec, e, s, i), O = null;
      for (; !l.next().done; )
        O = l.value;
      if (O && (s == t || O.from > s + 10))
        return O;
      if (s == t)
        return null;
    }
  }
  prevMatch(e, t, i) {
    return this.prevMatchInRange(e, 0, t) || this.prevMatchInRange(e, i, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace).replace(/\$([$&\d+])/g, (t, i) => i == "$" ? "$" : i == "&" ? e.match[0] : i != "0" && +i < e.match.length ? e.match[i] : t);
  }
  matchAll(e, t) {
    let i = $r(this.spec, e, 0, e.doc.length), r = [];
    for (; !i.next().done; ) {
      if (r.length >= t)
        return null;
      r.push(i.value);
    }
    return r;
  }
  highlight(e, t, i, r) {
    let s = $r(this.spec, e, Math.max(
      0,
      t - 250
      /* RegExp.HighlightMargin */
    ), Math.min(i + 250, e.doc.length));
    for (; !s.next().done; )
      r(s.value.from, s.value.to);
  }
}
const Bs = /* @__PURE__ */ ie.define(), tf = /* @__PURE__ */ ie.define(), mn = /* @__PURE__ */ Ne.define({
  create(n) {
    return new gh(Sc(n).create(), null);
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(Bs) ? n = new gh(t.value.create(), n.panel) : t.is(tf) && (n = new gh(n.query, t.value ? nf : null));
    return n;
  },
  provide: (n) => Gs.from(n, (e) => e.panel)
});
class gh {
  constructor(e, t) {
    this.query = e, this.panel = t;
  }
}
const VX = /* @__PURE__ */ H.mark({ class: "cm-searchMatch" }), zX = /* @__PURE__ */ H.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), EX = /* @__PURE__ */ ze.fromClass(class {
  constructor(n) {
    this.view = n, this.decorations = this.highlight(n.state.field(mn));
  }
  update(n) {
    let e = n.state.field(mn);
    (e != n.startState.field(mn) || n.docChanged || n.selectionSet || n.viewportChanged) && (this.decorations = this.highlight(e));
  }
  highlight({ query: n, panel: e }) {
    if (!e || !n.spec.valid)
      return H.none;
    let { view: t } = this, i = new Sn();
    for (let r = 0, s = t.visibleRanges, l = s.length; r < l; r++) {
      let { from: O, to: h } = s[r];
      for (; r < l - 1 && h > s[r + 1].from - 2 * 250; )
        h = s[++r].to;
      n.highlight(t.state, O, h, (f, u) => {
        let d = t.state.selection.ranges.some((g) => g.from == f && g.to == u);
        i.add(f, u, d ? zX : VX);
      });
    }
    return i.finish();
  }
}, {
  decorations: (n) => n.decorations
});
function lo(n) {
  return (e) => {
    let t = e.state.field(mn, !1);
    return t && t.query.spec.valid ? n(e, t) : d1(e);
  };
}
const sa = /* @__PURE__ */ lo((n, { query: e }) => {
  let { to: t } = n.state.selection.main, i = e.nextMatch(n.state, t, t);
  if (!i)
    return !1;
  let r = X.single(i.from, i.to), s = n.state.facet(Lr);
  return n.dispatch({
    selection: r,
    effects: [rf(n, i), s.scrollToMatch(r.main, n)],
    userEvent: "select.search"
  }), u1(n), !0;
}), oa = /* @__PURE__ */ lo((n, { query: e }) => {
  let { state: t } = n, { from: i } = t.selection.main, r = e.prevMatch(t, i, i);
  if (!r)
    return !1;
  let s = X.single(r.from, r.to), l = n.state.facet(Lr);
  return n.dispatch({
    selection: s,
    effects: [rf(n, r), l.scrollToMatch(s.main, n)],
    userEvent: "select.search"
  }), u1(n), !0;
}), MX = /* @__PURE__ */ lo((n, { query: e }) => {
  let t = e.matchAll(n.state, 1e3);
  return !t || !t.length ? !1 : (n.dispatch({
    selection: X.create(t.map((i) => X.range(i.from, i.to))),
    userEvent: "select.search.matches"
  }), !0);
}), GX = ({ state: n, dispatch: e }) => {
  let t = n.selection;
  if (t.ranges.length > 1 || t.main.empty)
    return !1;
  let { from: i, to: r } = t.main, s = [], l = 0;
  for (let O = new Vr(n.doc, n.sliceDoc(i, r)); !O.next().done; ) {
    if (s.length > 1e3)
      return !1;
    O.value.from == i && (l = s.length), s.push(X.range(O.value.from, O.value.to));
  }
  return e(n.update({
    selection: X.create(s, l),
    userEvent: "select.search.matches"
  })), !0;
}, yg = /* @__PURE__ */ lo((n, { query: e }) => {
  let { state: t } = n, { from: i, to: r } = t.selection.main;
  if (t.readOnly)
    return !1;
  let s = e.nextMatch(t, i, i);
  if (!s)
    return !1;
  let l = [], O, h, f = [];
  if (s.from == i && s.to == r && (h = t.toText(e.getReplacement(s)), l.push({ from: s.from, to: s.to, insert: h }), s = e.nextMatch(t, s.from, s.to), f.push(I.announce.of(t.phrase("replaced match on line $", t.doc.lineAt(i).number) + "."))), s) {
    let u = l.length == 0 || l[0].from >= s.to ? 0 : s.to - s.from - h.length;
    O = X.single(s.from - u, s.to - u), f.push(rf(n, s)), f.push(t.facet(Lr).scrollToMatch(O.main, n));
  }
  return n.dispatch({
    changes: l,
    selection: O,
    effects: f,
    userEvent: "input.replace"
  }), !0;
}), DX = /* @__PURE__ */ lo((n, { query: e }) => {
  if (n.state.readOnly)
    return !1;
  let t = e.matchAll(n.state, 1e9).map((r) => {
    let { from: s, to: l } = r;
    return { from: s, to: l, insert: e.getReplacement(r) };
  });
  if (!t.length)
    return !1;
  let i = n.state.phrase("replaced $ matches", t.length) + ".";
  return n.dispatch({
    changes: t,
    effects: I.announce.of(i),
    userEvent: "input.replace.all"
  }), !0;
});
function nf(n) {
  return n.state.facet(Lr).createPanel(n);
}
function Sc(n, e) {
  var t, i, r, s, l;
  let O = n.selection.main, h = O.empty || O.to > O.from + 100 ? "" : n.sliceDoc(O.from, O.to);
  if (e && !h)
    return e;
  let f = n.facet(Lr);
  return new h1({
    search: ((t = e == null ? void 0 : e.literal) !== null && t !== void 0 ? t : f.literal) ? h : h.replace(/\n/g, "\\n"),
    caseSensitive: (i = e == null ? void 0 : e.caseSensitive) !== null && i !== void 0 ? i : f.caseSensitive,
    literal: (r = e == null ? void 0 : e.literal) !== null && r !== void 0 ? r : f.literal,
    regexp: (s = e == null ? void 0 : e.regexp) !== null && s !== void 0 ? s : f.regexp,
    wholeWord: (l = e == null ? void 0 : e.wholeWord) !== null && l !== void 0 ? l : f.wholeWord
  });
}
function f1(n) {
  let e = Ms(n, nf);
  return e && e.dom.querySelector("[main-field]");
}
function u1(n) {
  let e = f1(n);
  e && e == n.root.activeElement && e.select();
}
const d1 = (n) => {
  let e = n.state.field(mn, !1);
  if (e && e.panel) {
    let t = f1(n);
    if (t && t != n.root.activeElement) {
      let i = Sc(n.state, e.query.spec);
      i.valid && n.dispatch({ effects: Bs.of(i) }), t.focus(), t.select();
    }
  } else
    n.dispatch({ effects: [
      tf.of(!0),
      e ? Bs.of(Sc(n.state, e.query.spec)) : ie.appendConfig.of(jX)
    ] });
  return !0;
}, p1 = (n) => {
  let e = n.state.field(mn, !1);
  if (!e || !e.panel)
    return !1;
  let t = Ms(n, nf);
  return t && t.dom.contains(n.root.activeElement) && n.focus(), n.dispatch({ effects: tf.of(!1) }), !0;
}, IX = [
  { key: "Mod-f", run: d1, scope: "editor search-panel" },
  { key: "F3", run: sa, shift: oa, scope: "editor search-panel", preventDefault: !0 },
  { key: "Mod-g", run: sa, shift: oa, scope: "editor search-panel", preventDefault: !0 },
  { key: "Escape", run: p1, scope: "editor search-panel" },
  { key: "Mod-Shift-l", run: GX },
  { key: "Mod-Alt-g", run: bX },
  { key: "Mod-d", run: CX, preventDefault: !0 }
];
class LX {
  constructor(e) {
    this.view = e;
    let t = this.query = e.state.field(mn).query.spec;
    this.commit = this.commit.bind(this), this.searchField = ke("input", {
      value: t.search,
      placeholder: At(e, "Find"),
      "aria-label": At(e, "Find"),
      class: "cm-textfield",
      name: "search",
      form: "",
      "main-field": "true",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.replaceField = ke("input", {
      value: t.replace,
      placeholder: At(e, "Replace"),
      "aria-label": At(e, "Replace"),
      class: "cm-textfield",
      name: "replace",
      form: "",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.caseField = ke("input", {
      type: "checkbox",
      name: "case",
      form: "",
      checked: t.caseSensitive,
      onchange: this.commit
    }), this.reField = ke("input", {
      type: "checkbox",
      name: "re",
      form: "",
      checked: t.regexp,
      onchange: this.commit
    }), this.wordField = ke("input", {
      type: "checkbox",
      name: "word",
      form: "",
      checked: t.wholeWord,
      onchange: this.commit
    });
    function i(r, s, l) {
      return ke("button", { class: "cm-button", name: r, onclick: s, type: "button" }, l);
    }
    this.dom = ke("div", { onkeydown: (r) => this.keydown(r), class: "cm-search" }, [
      this.searchField,
      i("next", () => sa(e), [At(e, "next")]),
      i("prev", () => oa(e), [At(e, "previous")]),
      i("select", () => MX(e), [At(e, "all")]),
      ke("label", null, [this.caseField, At(e, "match case")]),
      ke("label", null, [this.reField, At(e, "regexp")]),
      ke("label", null, [this.wordField, At(e, "by word")]),
      ...e.state.readOnly ? [] : [
        ke("br"),
        this.replaceField,
        i("replace", () => yg(e), [At(e, "replace")]),
        i("replaceAll", () => DX(e), [At(e, "replace all")])
      ],
      ke("button", {
        name: "close",
        onclick: () => p1(e),
        "aria-label": At(e, "close"),
        type: "button"
      }, ["×"])
    ]);
  }
  commit() {
    let e = new h1({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      wholeWord: this.wordField.checked,
      replace: this.replaceField.value
    });
    e.eq(this.query) || (this.query = e, this.view.dispatch({ effects: Bs.of(e) }));
  }
  keydown(e) {
    NT(this.view, e, "search-panel") ? e.preventDefault() : e.keyCode == 13 && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? oa : sa)(this.view)) : e.keyCode == 13 && e.target == this.replaceField && (e.preventDefault(), yg(this.view));
  }
  update(e) {
    for (let t of e.transactions)
      for (let i of t.effects)
        i.is(Bs) && !i.value.eq(this.query) && this.setQuery(i.value);
  }
  setQuery(e) {
    this.query = e, this.searchField.value = e.search, this.replaceField.value = e.replace, this.caseField.checked = e.caseSensitive, this.reField.checked = e.regexp, this.wordField.checked = e.wholeWord;
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(Lr).top;
  }
}
function At(n, e) {
  return n.state.phrase(e);
}
const $l = 30, bl = /[\s\.,:;?!]/;
function rf(n, { from: e, to: t }) {
  let i = n.state.doc.lineAt(e), r = n.state.doc.lineAt(t).to, s = Math.max(i.from, e - $l), l = Math.min(r, t + $l), O = n.state.sliceDoc(s, l);
  if (s != i.from) {
    for (let h = 0; h < $l; h++)
      if (!bl.test(O[h + 1]) && bl.test(O[h])) {
        O = O.slice(h);
        break;
      }
  }
  if (l != r) {
    for (let h = O.length - 1; h > O.length - $l; h--)
      if (!bl.test(O[h - 1]) && bl.test(O[h])) {
        O = O.slice(0, h);
        break;
      }
  }
  return I.announce.of(`${n.state.phrase("current match")}. ${O} ${n.state.phrase("on line")} ${i.number}.`);
}
const BX = /* @__PURE__ */ I.baseTheme({
  ".cm-panel.cm-search": {
    padding: "2px 6px 4px",
    position: "relative",
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    },
    "& input, & button, & label": {
      margin: ".2em .6em .2em 0"
    },
    "& input[type=checkbox]": {
      marginRight: ".2em"
    },
    "& label": {
      fontSize: "80%",
      whiteSpace: "pre"
    }
  },
  "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
  "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
  "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
  "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
}), jX = [
  mn,
  /* @__PURE__ */ Tn.low(EX),
  BX
];
class g1 {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(e, t, i, r) {
    this.state = e, this.pos = t, this.explicit = i, this.view = r, this.abortListeners = [];
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(e) {
    let t = De(this.state).resolveInner(this.pos, -1);
    for (; t && e.indexOf(t.name) < 0; )
      t = t.parent;
    return t ? {
      from: t.from,
      to: this.pos,
      text: this.state.sliceDoc(t.from, this.pos),
      type: t.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(e) {
    let t = this.state.doc.lineAt(this.pos), i = Math.max(t.from, this.pos - 250), r = t.text.slice(i - t.from, this.pos - t.from), s = r.search(m1(e, !1));
    return s < 0 ? null : { from: i + s, to: this.pos, text: r.slice(s) };
  }
  /**
  Yields true when the query has been aborted. Can be useful in
  asynchronous queries to avoid doing work that will be ignored.
  */
  get aborted() {
    return this.abortListeners == null;
  }
  /**
  Allows you to register abort handlers, which will be called when
  the query is
  [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
  */
  addEventListener(e, t) {
    e == "abort" && this.abortListeners && this.abortListeners.push(t);
  }
}
function xg(n) {
  let e = Object.keys(n).join(""), t = /\w/.test(e);
  return t && (e = e.replace(/\w/g, "")), `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function NX(n) {
  let e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  for (let { label: r } of n) {
    e[r[0]] = !0;
    for (let s = 1; s < r.length; s++)
      t[r[s]] = !0;
  }
  let i = xg(e) + xg(t) + "*$";
  return [new RegExp("^" + i), new RegExp(i)];
}
function ao(n) {
  let e = n.map((r) => typeof r == "string" ? { label: r } : r), [t, i] = e.every((r) => /^\w+$/.test(r.label)) ? [/\w*$/, /\w+$/] : NX(e);
  return (r) => {
    let s = r.matchBefore(i);
    return s || r.explicit ? { from: s ? s.from : r.pos, options: e, validFor: t } : null;
  };
}
function sf(n, e) {
  return (t) => {
    for (let i = De(t.state).resolveInner(t.pos, -1); i; i = i.parent) {
      if (n.indexOf(i.name) > -1)
        return null;
      if (i.type.isTop)
        break;
    }
    return e(t);
  };
}
class vg {
  constructor(e, t, i, r) {
    this.completion = e, this.source = t, this.match = i, this.score = r;
  }
}
function Qn(n) {
  return n.selection.main.from;
}
function m1(n, e) {
  var t;
  let { source: i } = n, r = e && i[0] != "^", s = i[i.length - 1] != "$";
  return !r && !s ? n : new RegExp(`${r ? "^" : ""}(?:${i})${s ? "$" : ""}`, (t = n.flags) !== null && t !== void 0 ? t : n.ignoreCase ? "i" : "");
}
const of = /* @__PURE__ */ Hi.define();
function FX(n, e, t, i) {
  let { main: r } = n.selection, s = t - r.from, l = i - r.from;
  return Object.assign(Object.assign({}, n.changeByRange((O) => O != r && t != i && n.sliceDoc(O.from + s, O.from + l) != n.sliceDoc(t, i) ? { range: O } : {
    changes: { from: O.from + s, to: i == r.from ? O.to : O.from + l, insert: e },
    range: X.cursor(O.from + s + e.length)
  })), { scrollIntoView: !0, userEvent: "input.complete" });
}
const wg = /* @__PURE__ */ new WeakMap();
function HX(n) {
  if (!Array.isArray(n))
    return n;
  let e = wg.get(n);
  return e || wg.set(n, e = ao(n)), e;
}
const la = /* @__PURE__ */ ie.define(), js = /* @__PURE__ */ ie.define();
class JX {
  constructor(e) {
    this.pattern = e, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
    for (let t = 0; t < e.length; ) {
      let i = rt(e, t), r = Ft(i);
      this.chars.push(i);
      let s = e.slice(t, t + r), l = s.toUpperCase();
      this.folded.push(rt(l == s ? s.toLowerCase() : l, 0)), t += r;
    }
    this.astral = e.length != this.chars.length;
  }
  ret(e, t) {
    return this.score = e, this.matched = t, this;
  }
  // Matches a given word (completion) against the pattern (input).
  // Will return a boolean indicating whether there was a match and,
  // on success, set `this.score` to the score, `this.matched` to an
  // array of `from, to` pairs indicating the matched parts of `word`.
  //
  // The score is a number that is more negative the worse the match
  // is. See `Penalty` above.
  match(e) {
    if (this.pattern.length == 0)
      return this.ret(-100, []);
    if (e.length < this.pattern.length)
      return null;
    let { chars: t, folded: i, any: r, precise: s, byWord: l } = this;
    if (t.length == 1) {
      let Y = rt(e, 0), U = Ft(Y), V = U == e.length ? 0 : -100;
      if (Y != t[0]) if (Y == i[0])
        V += -200;
      else
        return null;
      return this.ret(V, [0, U]);
    }
    let O = e.indexOf(this.pattern);
    if (O == 0)
      return this.ret(e.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
    let h = t.length, f = 0;
    if (O < 0) {
      for (let Y = 0, U = Math.min(e.length, 200); Y < U && f < h; ) {
        let V = rt(e, Y);
        (V == t[f] || V == i[f]) && (r[f++] = Y), Y += Ft(V);
      }
      if (f < h)
        return null;
    }
    let u = 0, d = 0, g = !1, Q = 0, b = -1, v = -1, w = /[a-z]/.test(e), Z = !0;
    for (let Y = 0, U = Math.min(e.length, 200), V = 0; Y < U && d < h; ) {
      let W = rt(e, Y);
      O < 0 && (u < h && W == t[u] && (s[u++] = Y), Q < h && (W == t[Q] || W == i[Q] ? (Q == 0 && (b = Y), v = Y + 1, Q++) : Q = 0));
      let M, z = W < 255 ? W >= 48 && W <= 57 || W >= 97 && W <= 122 ? 2 : W >= 65 && W <= 90 ? 1 : 0 : (M = Rc(W)) != M.toLowerCase() ? 1 : M != M.toUpperCase() ? 2 : 0;
      (!Y || z == 1 && w || V == 0 && z != 0) && (t[d] == W || i[d] == W && (g = !0) ? l[d++] = Y : l.length && (Z = !1)), V = z, Y += Ft(W);
    }
    return d == h && l[0] == 0 && Z ? this.result(-100 + (g ? -200 : 0), l, e) : Q == h && b == 0 ? this.ret(-200 - e.length + (v == e.length ? 0 : -100), [0, v]) : O > -1 ? this.ret(-700 - e.length, [O, O + this.pattern.length]) : Q == h ? this.ret(-900 - e.length, [b, v]) : d == h ? this.result(-100 + (g ? -200 : 0) + -700 + (Z ? 0 : -1100), l, e) : t.length == 2 ? null : this.result((r[0] ? -700 : 0) + -200 + -1100, r, e);
  }
  result(e, t, i) {
    let r = [], s = 0;
    for (let l of t) {
      let O = l + (this.astral ? Ft(rt(i, l)) : 1);
      s && r[s - 1] == l ? r[s - 1] = O : (r[s++] = l, r[s++] = O);
    }
    return this.ret(e - i.length, r);
  }
}
class KX {
  constructor(e) {
    this.pattern = e, this.matched = [], this.score = 0, this.folded = e.toLowerCase();
  }
  match(e) {
    if (e.length < this.pattern.length)
      return null;
    let t = e.slice(0, this.pattern.length), i = t == this.pattern ? 0 : t.toLowerCase() == this.folded ? -200 : null;
    return i == null ? null : (this.matched = [0, t.length], this.score = i + (e.length == this.pattern.length ? 0 : -100), this);
  }
}
const lt = /* @__PURE__ */ j.define({
  combine(n) {
    return ci(n, {
      activateOnTyping: !0,
      activateOnCompletion: () => !1,
      activateOnTypingDelay: 100,
      selectOnOpen: !0,
      override: null,
      closeOnBlur: !0,
      maxRenderedOptions: 100,
      defaultKeymap: !0,
      tooltipClass: () => "",
      optionClass: () => "",
      aboveCursor: !1,
      icons: !0,
      addToOptions: [],
      positionInfo: eq,
      filterStrict: !1,
      compareCompletions: (e, t) => e.label.localeCompare(t.label),
      interactionDelay: 75,
      updateSyncTime: 100
    }, {
      defaultKeymap: (e, t) => e && t,
      closeOnBlur: (e, t) => e && t,
      icons: (e, t) => e && t,
      tooltipClass: (e, t) => (i) => kg(e(i), t(i)),
      optionClass: (e, t) => (i) => kg(e(i), t(i)),
      addToOptions: (e, t) => e.concat(t),
      filterStrict: (e, t) => e || t
    });
  }
});
function kg(n, e) {
  return n ? e ? n + " " + e : n : e;
}
function eq(n, e, t, i, r, s) {
  let l = n.textDirection == Re.RTL, O = l, h = !1, f = "top", u, d, g = e.left - r.left, Q = r.right - e.right, b = i.right - i.left, v = i.bottom - i.top;
  if (O && g < Math.min(b, Q) ? O = !1 : !O && Q < Math.min(b, g) && (O = !0), b <= (O ? g : Q))
    u = Math.max(r.top, Math.min(t.top, r.bottom - v)) - e.top, d = Math.min(400, O ? g : Q);
  else {
    h = !0, d = Math.min(
      400,
      (l ? e.right : r.right - e.left) - 30
      /* Info.Margin */
    );
    let Y = r.bottom - e.bottom;
    Y >= v || Y > e.top ? u = t.bottom - e.top : (f = "bottom", u = e.bottom - t.top);
  }
  let w = (e.bottom - e.top) / s.offsetHeight, Z = (e.right - e.left) / s.offsetWidth;
  return {
    style: `${f}: ${u / w}px; max-width: ${d / Z}px`,
    class: "cm-completionInfo-" + (h ? l ? "left-narrow" : "right-narrow" : O ? "left" : "right")
  };
}
function tq(n) {
  let e = n.addToOptions.slice();
  return n.icons && e.push({
    render(t) {
      let i = document.createElement("div");
      return i.classList.add("cm-completionIcon"), t.type && i.classList.add(...t.type.split(/\s+/g).map((r) => "cm-completionIcon-" + r)), i.setAttribute("aria-hidden", "true"), i;
    },
    position: 20
  }), e.push({
    render(t, i, r, s) {
      let l = document.createElement("span");
      l.className = "cm-completionLabel";
      let O = t.displayLabel || t.label, h = 0;
      for (let f = 0; f < s.length; ) {
        let u = s[f++], d = s[f++];
        u > h && l.appendChild(document.createTextNode(O.slice(h, u)));
        let g = l.appendChild(document.createElement("span"));
        g.appendChild(document.createTextNode(O.slice(u, d))), g.className = "cm-completionMatchedText", h = d;
      }
      return h < O.length && l.appendChild(document.createTextNode(O.slice(h))), l;
    },
    position: 50
  }, {
    render(t) {
      if (!t.detail)
        return null;
      let i = document.createElement("span");
      return i.className = "cm-completionDetail", i.textContent = t.detail, i;
    },
    position: 80
  }), e.sort((t, i) => t.position - i.position).map((t) => t.render);
}
function mh(n, e, t) {
  if (n <= t)
    return { from: 0, to: n };
  if (e < 0 && (e = 0), e <= n >> 1) {
    let r = Math.floor(e / t);
    return { from: r * t, to: (r + 1) * t };
  }
  let i = Math.floor((n - e) / t);
  return { from: n - (i + 1) * t, to: n - i * t };
}
class iq {
  constructor(e, t, i) {
    this.view = e, this.stateField = t, this.applyCompletion = i, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
      read: () => this.measureInfo(),
      write: (h) => this.placeInfo(h),
      key: this
    }, this.space = null, this.currentClass = "";
    let r = e.state.field(t), { options: s, selected: l } = r.open, O = e.state.facet(lt);
    this.optionContent = tq(O), this.optionClass = O.optionClass, this.tooltipClass = O.tooltipClass, this.range = mh(s.length, l, O.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.updateTooltipClass(e.state), this.dom.addEventListener("mousedown", (h) => {
      let { options: f } = e.state.field(t).open;
      for (let u = h.target, d; u && u != this.dom; u = u.parentNode)
        if (u.nodeName == "LI" && (d = /-(\d+)$/.exec(u.id)) && +d[1] < f.length) {
          this.applyCompletion(e, f[+d[1]]), h.preventDefault();
          return;
        }
    }), this.dom.addEventListener("focusout", (h) => {
      let f = e.state.field(this.stateField, !1);
      f && f.tooltip && e.state.facet(lt).closeOnBlur && h.relatedTarget != e.contentDOM && e.dispatch({ effects: js.of(null) });
    }), this.showOptions(s, r.id);
  }
  mount() {
    this.updateSel();
  }
  showOptions(e, t) {
    this.list && this.list.remove(), this.list = this.dom.appendChild(this.createListBox(e, t, this.range)), this.list.addEventListener("scroll", () => {
      this.info && this.view.requestMeasure(this.placeInfoReq);
    });
  }
  update(e) {
    var t;
    let i = e.state.field(this.stateField), r = e.startState.field(this.stateField);
    if (this.updateTooltipClass(e.state), i != r) {
      let { options: s, selected: l, disabled: O } = i.open;
      (!r.open || r.open.options != s) && (this.range = mh(s.length, l, e.state.facet(lt).maxRenderedOptions), this.showOptions(s, i.id)), this.updateSel(), O != ((t = r.open) === null || t === void 0 ? void 0 : t.disabled) && this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!O);
    }
  }
  updateTooltipClass(e) {
    let t = this.tooltipClass(e);
    if (t != this.currentClass) {
      for (let i of this.currentClass.split(" "))
        i && this.dom.classList.remove(i);
      for (let i of t.split(" "))
        i && this.dom.classList.add(i);
      this.currentClass = t;
    }
  }
  positioned(e) {
    this.space = e, this.info && this.view.requestMeasure(this.placeInfoReq);
  }
  updateSel() {
    let e = this.view.state.field(this.stateField), t = e.open;
    if ((t.selected > -1 && t.selected < this.range.from || t.selected >= this.range.to) && (this.range = mh(t.options.length, t.selected, this.view.state.facet(lt).maxRenderedOptions), this.showOptions(t.options, e.id)), this.updateSelectedOption(t.selected)) {
      this.destroyInfo();
      let { completion: i } = t.options[t.selected], { info: r } = i;
      if (!r)
        return;
      let s = typeof r == "string" ? document.createTextNode(r) : r(i);
      if (!s)
        return;
      "then" in s ? s.then((l) => {
        l && this.view.state.field(this.stateField, !1) == e && this.addInfoPane(l, i);
      }).catch((l) => mt(this.view.state, l, "completion info")) : this.addInfoPane(s, i);
    }
  }
  addInfoPane(e, t) {
    this.destroyInfo();
    let i = this.info = document.createElement("div");
    if (i.className = "cm-tooltip cm-completionInfo", e.nodeType != null)
      i.appendChild(e), this.infoDestroy = null;
    else {
      let { dom: r, destroy: s } = e;
      i.appendChild(r), this.infoDestroy = s || null;
    }
    this.dom.appendChild(i), this.view.requestMeasure(this.placeInfoReq);
  }
  updateSelectedOption(e) {
    let t = null;
    for (let i = this.list.firstChild, r = this.range.from; i; i = i.nextSibling, r++)
      i.nodeName != "LI" || !i.id ? r-- : r == e ? i.hasAttribute("aria-selected") || (i.setAttribute("aria-selected", "true"), t = i) : i.hasAttribute("aria-selected") && i.removeAttribute("aria-selected");
    return t && rq(this.list, t), t;
  }
  measureInfo() {
    let e = this.dom.querySelector("[aria-selected]");
    if (!e || !this.info)
      return null;
    let t = this.dom.getBoundingClientRect(), i = this.info.getBoundingClientRect(), r = e.getBoundingClientRect(), s = this.space;
    if (!s) {
      let l = this.dom.ownerDocument.defaultView || window;
      s = { left: 0, top: 0, right: l.innerWidth, bottom: l.innerHeight };
    }
    return r.top > Math.min(s.bottom, t.bottom) - 10 || r.bottom < Math.max(s.top, t.top) + 10 ? null : this.view.state.facet(lt).positionInfo(this.view, t, r, i, s, this.dom);
  }
  placeInfo(e) {
    this.info && (e ? (e.style && (this.info.style.cssText = e.style), this.info.className = "cm-tooltip cm-completionInfo " + (e.class || "")) : this.info.style.cssText = "top: -1e6px");
  }
  createListBox(e, t, i) {
    const r = document.createElement("ul");
    r.id = t, r.setAttribute("role", "listbox"), r.setAttribute("aria-expanded", "true"), r.setAttribute("aria-label", this.view.state.phrase("Completions"));
    let s = null;
    for (let l = i.from; l < i.to; l++) {
      let { completion: O, match: h } = e[l], { section: f } = O;
      if (f) {
        let g = typeof f == "string" ? f : f.name;
        if (g != s && (l > i.from || i.from == 0))
          if (s = g, typeof f != "string" && f.header)
            r.appendChild(f.header(f));
          else {
            let Q = r.appendChild(document.createElement("completion-section"));
            Q.textContent = g;
          }
      }
      const u = r.appendChild(document.createElement("li"));
      u.id = t + "-" + l, u.setAttribute("role", "option");
      let d = this.optionClass(O);
      d && (u.className = d);
      for (let g of this.optionContent) {
        let Q = g(O, this.view.state, this.view, h);
        Q && u.appendChild(Q);
      }
    }
    return i.from && r.classList.add("cm-completionListIncompleteTop"), i.to < e.length && r.classList.add("cm-completionListIncompleteBottom"), r;
  }
  destroyInfo() {
    this.info && (this.infoDestroy && this.infoDestroy(), this.info.remove(), this.info = null);
  }
  destroy() {
    this.destroyInfo();
  }
}
function nq(n, e) {
  return (t) => new iq(t, n, e);
}
function rq(n, e) {
  let t = n.getBoundingClientRect(), i = e.getBoundingClientRect(), r = t.height / n.offsetHeight;
  i.top < t.top ? n.scrollTop -= (t.top - i.top) / r : i.bottom > t.bottom && (n.scrollTop += (i.bottom - t.bottom) / r);
}
function Tg(n) {
  return (n.boost || 0) * 100 + (n.apply ? 10 : 0) + (n.info ? 5 : 0) + (n.type ? 1 : 0);
}
function sq(n, e) {
  let t = [], i = null, r = (f) => {
    t.push(f);
    let { section: u } = f.completion;
    if (u) {
      i || (i = []);
      let d = typeof u == "string" ? u : u.name;
      i.some((g) => g.name == d) || i.push(typeof u == "string" ? { name: d } : u);
    }
  }, s = e.facet(lt);
  for (let f of n)
    if (f.hasResult()) {
      let u = f.result.getMatch;
      if (f.result.filter === !1)
        for (let d of f.result.options)
          r(new vg(d, f.source, u ? u(d) : [], 1e9 - t.length));
      else {
        let d = e.sliceDoc(f.from, f.to), g, Q = s.filterStrict ? new KX(d) : new JX(d);
        for (let b of f.result.options)
          if (g = Q.match(b.label)) {
            let v = b.displayLabel ? u ? u(b, g.matched) : [] : g.matched;
            r(new vg(b, f.source, v, g.score + (b.boost || 0)));
          }
      }
    }
  if (i) {
    let f = /* @__PURE__ */ Object.create(null), u = 0, d = (g, Q) => {
      var b, v;
      return ((b = g.rank) !== null && b !== void 0 ? b : 1e9) - ((v = Q.rank) !== null && v !== void 0 ? v : 1e9) || (g.name < Q.name ? -1 : 1);
    };
    for (let g of i.sort(d))
      u -= 1e5, f[g.name] = u;
    for (let g of t) {
      let { section: Q } = g.completion;
      Q && (g.score += f[typeof Q == "string" ? Q : Q.name]);
    }
  }
  let l = [], O = null, h = s.compareCompletions;
  for (let f of t.sort((u, d) => d.score - u.score || h(u.completion, d.completion))) {
    let u = f.completion;
    !O || O.label != u.label || O.detail != u.detail || O.type != null && u.type != null && O.type != u.type || O.apply != u.apply || O.boost != u.boost ? l.push(f) : Tg(f.completion) > Tg(O) && (l[l.length - 1] = f), O = f.completion;
  }
  return l;
}
class xr {
  constructor(e, t, i, r, s, l) {
    this.options = e, this.attrs = t, this.tooltip = i, this.timestamp = r, this.selected = s, this.disabled = l;
  }
  setSelected(e, t) {
    return e == this.selected || e >= this.options.length ? this : new xr(this.options, Zg(t, e), this.tooltip, this.timestamp, e, this.disabled);
  }
  static build(e, t, i, r, s) {
    let l = sq(e, t);
    if (!l.length)
      return r && e.some(
        (h) => h.state == 1
        /* State.Pending */
      ) ? new xr(r.options, r.attrs, r.tooltip, r.timestamp, r.selected, !0) : null;
    let O = t.facet(lt).selectOnOpen ? 0 : -1;
    if (r && r.selected != O && r.selected != -1) {
      let h = r.options[r.selected].completion;
      for (let f = 0; f < l.length; f++)
        if (l[f].completion == h) {
          O = f;
          break;
        }
    }
    return new xr(l, Zg(i, O), {
      pos: e.reduce((h, f) => f.hasResult() ? Math.min(h, f.from) : h, 1e8),
      create: cq,
      above: s.aboveCursor
    }, r ? r.timestamp : Date.now(), O, !1);
  }
  map(e) {
    return new xr(this.options, this.attrs, Object.assign(Object.assign({}, this.tooltip), { pos: e.mapPos(this.tooltip.pos) }), this.timestamp, this.selected, this.disabled);
  }
}
class aa {
  constructor(e, t, i) {
    this.active = e, this.id = t, this.open = i;
  }
  static start() {
    return new aa(Oq, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
  }
  update(e) {
    let { state: t } = e, i = t.facet(lt), s = (i.override || t.languageDataAt("autocomplete", Qn(t)).map(HX)).map((O) => (this.active.find((f) => f.source == O) || new zt(
      O,
      this.active.some(
        (f) => f.state != 0
        /* State.Inactive */
      ) ? 1 : 0
      /* State.Inactive */
    )).update(e, i));
    s.length == this.active.length && s.every((O, h) => O == this.active[h]) && (s = this.active);
    let l = this.open;
    l && e.docChanged && (l = l.map(e.changes)), e.selection || s.some((O) => O.hasResult() && e.changes.touchesRange(O.from, O.to)) || !oq(s, this.active) ? l = xr.build(s, t, this.id, l, i) : l && l.disabled && !s.some(
      (O) => O.state == 1
      /* State.Pending */
    ) && (l = null), !l && s.every(
      (O) => O.state != 1
      /* State.Pending */
    ) && s.some((O) => O.hasResult()) && (s = s.map((O) => O.hasResult() ? new zt(
      O.source,
      0
      /* State.Inactive */
    ) : O));
    for (let O of e.effects)
      O.is(S1) && (l = l && l.setSelected(O.value, this.id));
    return s == this.active && l == this.open ? this : new aa(s, this.id, l);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : this.active.length ? lq : aq;
  }
}
function oq(n, e) {
  if (n == e)
    return !0;
  for (let t = 0, i = 0; ; ) {
    for (; t < n.length && !n[t].hasResult; )
      t++;
    for (; i < e.length && !e[i].hasResult; )
      i++;
    let r = t == n.length, s = i == e.length;
    if (r || s)
      return r == s;
    if (n[t++].result != e[i++].result)
      return !1;
  }
}
const lq = {
  "aria-autocomplete": "list"
}, aq = {};
function Zg(n, e) {
  let t = {
    "aria-autocomplete": "list",
    "aria-haspopup": "listbox",
    "aria-controls": n
  };
  return e > -1 && (t["aria-activedescendant"] = n + "-" + e), t;
}
const Oq = [];
function Q1(n, e) {
  if (n.isUserEvent("input.complete")) {
    let i = n.annotation(of);
    if (i && e.activateOnCompletion(i))
      return 12;
  }
  let t = n.isUserEvent("input.type");
  return t && e.activateOnTyping ? 5 : t ? 1 : n.isUserEvent("delete.backward") ? 2 : n.selection ? 8 : n.docChanged ? 16 : 0;
}
class zt {
  constructor(e, t, i = -1) {
    this.source = e, this.state = t, this.explicitPos = i;
  }
  hasResult() {
    return !1;
  }
  update(e, t) {
    let i = Q1(e, t), r = this;
    (i & 8 || i & 16 && this.touches(e)) && (r = new zt(
      r.source,
      0
      /* State.Inactive */
    )), i & 4 && r.state == 0 && (r = new zt(
      this.source,
      1
      /* State.Pending */
    )), r = r.updateFor(e, i);
    for (let s of e.effects)
      if (s.is(la))
        r = new zt(r.source, 1, s.value ? Qn(e.state) : -1);
      else if (s.is(js))
        r = new zt(
          r.source,
          0
          /* State.Inactive */
        );
      else if (s.is(P1))
        for (let l of s.value)
          l.source == r.source && (r = l);
    return r;
  }
  updateFor(e, t) {
    return this.map(e.changes);
  }
  map(e) {
    return e.empty || this.explicitPos < 0 ? this : new zt(this.source, this.state, e.mapPos(this.explicitPos));
  }
  touches(e) {
    return e.changes.touchesRange(Qn(e.state));
  }
}
class Rr extends zt {
  constructor(e, t, i, r, s) {
    super(e, 2, t), this.result = i, this.from = r, this.to = s;
  }
  hasResult() {
    return !0;
  }
  updateFor(e, t) {
    var i;
    if (!(t & 3))
      return this.map(e.changes);
    let r = this.result;
    r.map && !e.changes.empty && (r = r.map(r, e.changes));
    let s = e.changes.mapPos(this.from), l = e.changes.mapPos(this.to, 1), O = Qn(e.state);
    if ((this.explicitPos < 0 ? O <= s : O < this.from) || O > l || !r || t & 2 && Qn(e.startState) == this.from)
      return new zt(
        this.source,
        t & 4 ? 1 : 0
        /* State.Inactive */
      );
    let h = this.explicitPos < 0 ? -1 : e.changes.mapPos(this.explicitPos);
    return hq(r.validFor, e.state, s, l) ? new Rr(this.source, h, r, s, l) : r.update && (r = r.update(r, s, l, new g1(e.state, O, h >= 0))) ? new Rr(this.source, h, r, r.from, (i = r.to) !== null && i !== void 0 ? i : Qn(e.state)) : new zt(this.source, 1, h);
  }
  map(e) {
    return e.empty ? this : (this.result.map ? this.result.map(this.result, e) : this.result) ? new Rr(this.source, this.explicitPos < 0 ? -1 : e.mapPos(this.explicitPos), this.result, e.mapPos(this.from), e.mapPos(this.to, 1)) : new zt(
      this.source,
      0
      /* State.Inactive */
    );
  }
  touches(e) {
    return e.changes.touchesRange(this.from, this.to);
  }
}
function hq(n, e, t, i) {
  if (!n)
    return !1;
  let r = e.sliceDoc(t, i);
  return typeof n == "function" ? n(r, t, i, e) : m1(n, !0).test(r);
}
const P1 = /* @__PURE__ */ ie.define({
  map(n, e) {
    return n.map((t) => t.map(e));
  }
}), S1 = /* @__PURE__ */ ie.define(), wt = /* @__PURE__ */ Ne.define({
  create() {
    return aa.start();
  },
  update(n, e) {
    return n.update(e);
  },
  provide: (n) => [
    pa.from(n, (e) => e.tooltip),
    I.contentAttributes.from(n, (e) => e.attrs)
  ]
});
function lf(n, e) {
  const t = e.completion.apply || e.completion.label;
  let i = n.state.field(wt).active.find((r) => r.source == e.source);
  return i instanceof Rr ? (typeof t == "string" ? n.dispatch(Object.assign(Object.assign({}, FX(n.state, t, i.from, i.to)), { annotations: of.of(e.completion) })) : t(n, e.completion, i.from, i.to), !0) : !1;
}
const cq = /* @__PURE__ */ nq(wt, lf);
function yl(n, e = "option") {
  return (t) => {
    let i = t.state.field(wt, !1);
    if (!i || !i.open || i.open.disabled || Date.now() - i.open.timestamp < t.state.facet(lt).interactionDelay)
      return !1;
    let r = 1, s;
    e == "page" && (s = VQ(t, i.open.tooltip)) && (r = Math.max(2, Math.floor(s.dom.offsetHeight / s.dom.querySelector("li").offsetHeight) - 1));
    let { length: l } = i.open.options, O = i.open.selected > -1 ? i.open.selected + r * (n ? 1 : -1) : n ? 0 : l - 1;
    return O < 0 ? O = e == "page" ? 0 : l - 1 : O >= l && (O = e == "page" ? l - 1 : 0), t.dispatch({ effects: S1.of(O) }), !0;
  };
}
const fq = (n) => {
  let e = n.state.field(wt, !1);
  return n.state.readOnly || !e || !e.open || e.open.selected < 0 || e.open.disabled || Date.now() - e.open.timestamp < n.state.facet(lt).interactionDelay ? !1 : lf(n, e.open.options[e.open.selected]);
}, uq = (n) => n.state.field(wt, !1) ? (n.dispatch({ effects: la.of(!0) }), !0) : !1, dq = (n) => {
  let e = n.state.field(wt, !1);
  return !e || !e.active.some(
    (t) => t.state != 0
    /* State.Inactive */
  ) ? !1 : (n.dispatch({ effects: js.of(null) }), !0);
};
class pq {
  constructor(e, t) {
    this.active = e, this.context = t, this.time = Date.now(), this.updates = [], this.done = void 0;
  }
}
const gq = 50, mq = 1e3, Qq = /* @__PURE__ */ ze.fromClass(class {
  constructor(n) {
    this.view = n, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.pendingStart = !1, this.composing = 0;
    for (let e of n.state.field(wt).active)
      e.state == 1 && this.startQuery(e);
  }
  update(n) {
    let e = n.state.field(wt), t = n.state.facet(lt);
    if (!n.selectionSet && !n.docChanged && n.startState.field(wt) == e)
      return;
    let i = n.transactions.some((s) => {
      let l = Q1(s, t);
      return l & 8 || (s.selection || s.docChanged) && !(l & 3);
    });
    for (let s = 0; s < this.running.length; s++) {
      let l = this.running[s];
      if (i || l.updates.length + n.transactions.length > gq && Date.now() - l.time > mq) {
        for (let O of l.context.abortListeners)
          try {
            O();
          } catch (h) {
            mt(this.view.state, h);
          }
        l.context.abortListeners = null, this.running.splice(s--, 1);
      } else
        l.updates.push(...n.transactions);
    }
    this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), n.transactions.some((s) => s.effects.some((l) => l.is(la))) && (this.pendingStart = !0);
    let r = this.pendingStart ? 50 : t.activateOnTypingDelay;
    if (this.debounceUpdate = e.active.some((s) => s.state == 1 && !this.running.some((l) => l.active.source == s.source)) ? setTimeout(() => this.startUpdate(), r) : -1, this.composing != 0)
      for (let s of n.transactions)
        s.isUserEvent("input.type") ? this.composing = 2 : this.composing == 2 && s.selection && (this.composing = 3);
  }
  startUpdate() {
    this.debounceUpdate = -1, this.pendingStart = !1;
    let { state: n } = this.view, e = n.field(wt);
    for (let t of e.active)
      t.state == 1 && !this.running.some((i) => i.active.source == t.source) && this.startQuery(t);
  }
  startQuery(n) {
    let { state: e } = this.view, t = Qn(e), i = new g1(e, t, n.explicitPos == t, this.view), r = new pq(n, i);
    this.running.push(r), Promise.resolve(n.source(i)).then((s) => {
      r.context.aborted || (r.done = s || null, this.scheduleAccept());
    }, (s) => {
      this.view.dispatch({ effects: js.of(null) }), mt(this.view.state, s);
    });
  }
  scheduleAccept() {
    this.running.every((n) => n.done !== void 0) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(lt).updateSyncTime));
  }
  // For each finished query in this.running, try to create a result
  // or, if appropriate, restart the query.
  accept() {
    var n;
    this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
    let e = [], t = this.view.state.facet(lt);
    for (let i = 0; i < this.running.length; i++) {
      let r = this.running[i];
      if (r.done === void 0)
        continue;
      if (this.running.splice(i--, 1), r.done) {
        let l = new Rr(r.active.source, r.active.explicitPos, r.done, r.done.from, (n = r.done.to) !== null && n !== void 0 ? n : Qn(r.updates.length ? r.updates[0].startState : this.view.state));
        for (let O of r.updates)
          l = l.update(O, t);
        if (l.hasResult()) {
          e.push(l);
          continue;
        }
      }
      let s = this.view.state.field(wt).active.find((l) => l.source == r.active.source);
      if (s && s.state == 1)
        if (r.done == null) {
          let l = new zt(
            r.active.source,
            0
            /* State.Inactive */
          );
          for (let O of r.updates)
            l = l.update(O, t);
          l.state != 1 && e.push(l);
        } else
          this.startQuery(s);
    }
    e.length && this.view.dispatch({ effects: P1.of(e) });
  }
}, {
  eventHandlers: {
    blur(n) {
      let e = this.view.state.field(wt, !1);
      if (e && e.tooltip && this.view.state.facet(lt).closeOnBlur) {
        let t = e.open && VQ(this.view, e.open.tooltip);
        (!t || !t.dom.contains(n.relatedTarget)) && setTimeout(() => this.view.dispatch({ effects: js.of(null) }), 10);
      }
    },
    compositionstart() {
      this.composing = 1;
    },
    compositionend() {
      this.composing == 3 && setTimeout(() => this.view.dispatch({ effects: la.of(!1) }), 20), this.composing = 0;
    }
  }
}), Pq = typeof navigator == "object" && /* @__PURE__ */ /Win/.test(navigator.platform), Sq = /* @__PURE__ */ Tn.highest(/* @__PURE__ */ I.domEventHandlers({
  keydown(n, e) {
    let t = e.state.field(wt, !1);
    if (!t || !t.open || t.open.disabled || t.open.selected < 0 || n.key.length > 1 || n.ctrlKey && !(Pq && n.altKey) || n.metaKey)
      return !1;
    let i = t.open.options[t.open.selected], r = t.active.find((l) => l.source == i.source), s = i.completion.commitCharacters || r.result.commitCharacters;
    return s && s.indexOf(n.key) > -1 && lf(e, i), !1;
  }
})), $1 = /* @__PURE__ */ I.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
});
class $q {
  constructor(e, t, i, r) {
    this.field = e, this.line = t, this.from = i, this.to = r;
  }
}
class af {
  constructor(e, t, i) {
    this.field = e, this.from = t, this.to = i;
  }
  map(e) {
    let t = e.mapPos(this.from, -1, ot.TrackDel), i = e.mapPos(this.to, 1, ot.TrackDel);
    return t == null || i == null ? null : new af(this.field, t, i);
  }
}
class Of {
  constructor(e, t) {
    this.lines = e, this.fieldPositions = t;
  }
  instantiate(e, t) {
    let i = [], r = [t], s = e.doc.lineAt(t), l = /^\s*/.exec(s.text)[0];
    for (let h of this.lines) {
      if (i.length) {
        let f = l, u = /^\t*/.exec(h)[0].length;
        for (let d = 0; d < u; d++)
          f += e.facet(no);
        r.push(t + f.length - u), h = f + h.slice(u);
      }
      i.push(h), t += h.length + 1;
    }
    let O = this.fieldPositions.map((h) => new af(h.field, r[h.line] + h.from, r[h.line] + h.to));
    return { text: i, ranges: O };
  }
  static parse(e) {
    let t = [], i = [], r = [], s;
    for (let l of e.split(/\r\n?|\n/)) {
      for (; s = /[#$]\{(?:(\d+)(?::([^}]*))?|((?:\\[{}]|[^}])*))\}/.exec(l); ) {
        let O = s[1] ? +s[1] : null, h = s[2] || s[3] || "", f = -1, u = h.replace(/\\[{}]/g, (d) => d[1]);
        for (let d = 0; d < t.length; d++)
          (O != null ? t[d].seq == O : u && t[d].name == u) && (f = d);
        if (f < 0) {
          let d = 0;
          for (; d < t.length && (O == null || t[d].seq != null && t[d].seq < O); )
            d++;
          t.splice(d, 0, { seq: O, name: u }), f = d;
          for (let g of r)
            g.field >= f && g.field++;
        }
        r.push(new $q(f, i.length, s.index, s.index + u.length)), l = l.slice(0, s.index) + h + l.slice(s.index + s[0].length);
      }
      l = l.replace(/\\([{}])/g, (O, h, f) => {
        for (let u of r)
          u.line == i.length && u.from > f && (u.from--, u.to--);
        return h;
      }), i.push(l);
    }
    return new Of(i, r);
  }
}
let bq = /* @__PURE__ */ H.widget({ widget: /* @__PURE__ */ new class extends Zi {
  toDOM() {
    let n = document.createElement("span");
    return n.className = "cm-snippetFieldPosition", n;
  }
  ignoreEvent() {
    return !1;
  }
}() }), yq = /* @__PURE__ */ H.mark({ class: "cm-snippetField" });
class Br {
  constructor(e, t) {
    this.ranges = e, this.active = t, this.deco = H.set(e.map((i) => (i.from == i.to ? bq : yq).range(i.from, i.to)));
  }
  map(e) {
    let t = [];
    for (let i of this.ranges) {
      let r = i.map(e);
      if (!r)
        return null;
      t.push(r);
    }
    return new Br(t, this.active);
  }
  selectionInsideField(e) {
    return e.ranges.every((t) => this.ranges.some((i) => i.field == this.active && i.from <= t.from && i.to >= t.to));
  }
}
const Oo = /* @__PURE__ */ ie.define({
  map(n, e) {
    return n && n.map(e);
  }
}), xq = /* @__PURE__ */ ie.define(), Ns = /* @__PURE__ */ Ne.define({
  create() {
    return null;
  },
  update(n, e) {
    for (let t of e.effects) {
      if (t.is(Oo))
        return t.value;
      if (t.is(xq) && n)
        return new Br(n.ranges, t.value);
    }
    return n && e.docChanged && (n = n.map(e.changes)), n && e.selection && !n.selectionInsideField(e.selection) && (n = null), n;
  },
  provide: (n) => I.decorations.from(n, (e) => e ? e.deco : H.none)
});
function hf(n, e) {
  return X.create(n.filter((t) => t.field == e).map((t) => X.range(t.from, t.to)));
}
function vq(n) {
  let e = Of.parse(n);
  return (t, i, r, s) => {
    let { text: l, ranges: O } = e.instantiate(t.state, r), h = {
      changes: { from: r, to: s, insert: Pe.of(l) },
      scrollIntoView: !0,
      annotations: i ? [of.of(i), Be.userEvent.of("input.complete")] : void 0
    };
    if (O.length && (h.selection = hf(O, 0)), O.some((f) => f.field > 0)) {
      let f = new Br(O, 0), u = h.effects = [Oo.of(f)];
      t.state.field(Ns, !1) === void 0 && u.push(ie.appendConfig.of([Ns, Rq, _q, $1]));
    }
    t.dispatch(t.state.update(h));
  };
}
function b1(n) {
  return ({ state: e, dispatch: t }) => {
    let i = e.field(Ns, !1);
    if (!i || n < 0 && i.active == 0)
      return !1;
    let r = i.active + n, s = n > 0 && !i.ranges.some((l) => l.field == r + n);
    return t(e.update({
      selection: hf(i.ranges, r),
      effects: Oo.of(s ? null : new Br(i.ranges, r)),
      scrollIntoView: !0
    })), !0;
  };
}
const wq = ({ state: n, dispatch: e }) => n.field(Ns, !1) ? (e(n.update({ effects: Oo.of(null) })), !0) : !1, kq = /* @__PURE__ */ b1(1), Tq = /* @__PURE__ */ b1(-1), Zq = [
  { key: "Tab", run: kq, shift: Tq },
  { key: "Escape", run: wq }
], Rg = /* @__PURE__ */ j.define({
  combine(n) {
    return n.length ? n[0] : Zq;
  }
}), Rq = /* @__PURE__ */ Tn.highest(/* @__PURE__ */ Er.compute([Rg], (n) => n.facet(Rg)));
function Ye(n, e) {
  return Object.assign(Object.assign({}, e), { apply: vq(n) });
}
const _q = /* @__PURE__ */ I.domEventHandlers({
  mousedown(n, e) {
    let t = e.state.field(Ns, !1), i;
    if (!t || (i = e.posAtCoords({ x: n.clientX, y: n.clientY })) == null)
      return !1;
    let r = t.ranges.find((s) => s.from <= i && s.to >= i);
    return !r || r.field == t.active ? !1 : (e.dispatch({
      selection: hf(t.ranges, r.field),
      effects: Oo.of(t.ranges.some((s) => s.field > r.field) ? new Br(t.ranges, r.field) : null),
      scrollIntoView: !0
    }), !0);
  }
}), Fs = {
  brackets: ["(", "[", "{", "'", '"'],
  before: ")]}:;>",
  stringPrefixes: []
}, jn = /* @__PURE__ */ ie.define({
  map(n, e) {
    let t = e.mapPos(n, -1, ot.TrackAfter);
    return t ?? void 0;
  }
}), cf = /* @__PURE__ */ new class extends Hn {
}();
cf.startSide = 1;
cf.endSide = -1;
const y1 = /* @__PURE__ */ Ne.define({
  create() {
    return Qe.empty;
  },
  update(n, e) {
    if (n = n.map(e.changes), e.selection) {
      let t = e.state.doc.lineAt(e.selection.main.head);
      n = n.update({ filter: (i) => i >= t.from && i <= t.to });
    }
    for (let t of e.effects)
      t.is(jn) && (n = n.update({ add: [cf.range(t.value, t.value + 1)] }));
    return n;
  }
});
function Xq() {
  return [Cq, y1];
}
const Qh = "()[]{}<>";
function x1(n) {
  for (let e = 0; e < Qh.length; e += 2)
    if (Qh.charCodeAt(e) == n)
      return Qh.charAt(e + 1);
  return Rc(n < 128 ? n : n + 1);
}
function v1(n, e) {
  return n.languageDataAt("closeBrackets", e)[0] || Fs;
}
const qq = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), Cq = /* @__PURE__ */ I.inputHandler.of((n, e, t, i) => {
  if ((qq ? n.composing : n.compositionStarted) || n.state.readOnly)
    return !1;
  let r = n.state.selection.main;
  if (i.length > 2 || i.length == 2 && Ft(rt(i, 0)) == 1 || e != r.from || t != r.to)
    return !1;
  let s = Aq(n.state, i);
  return s ? (n.dispatch(s), !0) : !1;
}), Wq = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let i = v1(n, n.selection.main.head).brackets || Fs.brackets, r = null, s = n.changeByRange((l) => {
    if (l.empty) {
      let O = Uq(n.doc, l.head);
      for (let h of i)
        if (h == O && wa(n.doc, l.head) == x1(rt(h, 0)))
          return {
            changes: { from: l.head - h.length, to: l.head + h.length },
            range: X.cursor(l.head - h.length)
          };
    }
    return { range: r = l };
  });
  return r || e(n.update(s, { scrollIntoView: !0, userEvent: "delete.backward" })), !r;
}, Yq = [
  { key: "Backspace", run: Wq }
];
function Aq(n, e) {
  let t = v1(n, n.selection.main.head), i = t.brackets || Fs.brackets;
  for (let r of i) {
    let s = x1(rt(r, 0));
    if (e == r)
      return s == r ? Eq(n, r, i.indexOf(r + r + r) > -1, t) : Vq(n, r, s, t.before || Fs.before);
    if (e == s && w1(n, n.selection.main.from))
      return zq(n, r, s);
  }
  return null;
}
function w1(n, e) {
  let t = !1;
  return n.field(y1).between(0, n.doc.length, (i) => {
    i == e && (t = !0);
  }), t;
}
function wa(n, e) {
  let t = n.sliceString(e, e + 2);
  return t.slice(0, Ft(rt(t, 0)));
}
function Uq(n, e) {
  let t = n.sliceString(e - 2, e);
  return Ft(rt(t, 0)) == t.length ? t : t.slice(1);
}
function Vq(n, e, t, i) {
  let r = null, s = n.changeByRange((l) => {
    if (!l.empty)
      return {
        changes: [{ insert: e, from: l.from }, { insert: t, from: l.to }],
        effects: jn.of(l.to + e.length),
        range: X.range(l.anchor + e.length, l.head + e.length)
      };
    let O = wa(n.doc, l.head);
    return !O || /\s/.test(O) || i.indexOf(O) > -1 ? {
      changes: { insert: e + t, from: l.head },
      effects: jn.of(l.head + e.length),
      range: X.cursor(l.head + e.length)
    } : { range: r = l };
  });
  return r ? null : n.update(s, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function zq(n, e, t) {
  let i = null, r = n.changeByRange((s) => s.empty && wa(n.doc, s.head) == t ? {
    changes: { from: s.head, to: s.head + t.length, insert: t },
    range: X.cursor(s.head + t.length)
  } : i = { range: s });
  return i ? null : n.update(r, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Eq(n, e, t, i) {
  let r = i.stringPrefixes || Fs.stringPrefixes, s = null, l = n.changeByRange((O) => {
    if (!O.empty)
      return {
        changes: [{ insert: e, from: O.from }, { insert: e, from: O.to }],
        effects: jn.of(O.to + e.length),
        range: X.range(O.anchor + e.length, O.head + e.length)
      };
    let h = O.head, f = wa(n.doc, h), u;
    if (f == e) {
      if (_g(n, h))
        return {
          changes: { insert: e + e, from: h },
          effects: jn.of(h + e.length),
          range: X.cursor(h + e.length)
        };
      if (w1(n, h)) {
        let g = t && n.sliceDoc(h, h + e.length * 3) == e + e + e ? e + e + e : e;
        return {
          changes: { from: h, to: h + g.length, insert: g },
          range: X.cursor(h + g.length)
        };
      }
    } else {
      if (t && n.sliceDoc(h - 2 * e.length, h) == e + e && (u = Xg(n, h - 2 * e.length, r)) > -1 && _g(n, u))
        return {
          changes: { insert: e + e + e + e, from: h },
          effects: jn.of(h + e.length),
          range: X.cursor(h + e.length)
        };
      if (n.charCategorizer(h)(f) != qe.Word && Xg(n, h, r) > -1 && !Mq(n, h, e, r))
        return {
          changes: { insert: e + e, from: h },
          effects: jn.of(h + e.length),
          range: X.cursor(h + e.length)
        };
    }
    return { range: s = O };
  });
  return s ? null : n.update(l, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function _g(n, e) {
  let t = De(n).resolveInner(e + 1);
  return t.parent && t.from == e;
}
function Mq(n, e, t, i) {
  let r = De(n).resolveInner(e, -1), s = i.reduce((l, O) => Math.max(l, O.length), 0);
  for (let l = 0; l < 5; l++) {
    let O = n.sliceDoc(r.from, Math.min(r.to, r.from + t.length + s)), h = O.indexOf(t);
    if (!h || h > -1 && i.indexOf(O.slice(0, h)) > -1) {
      let u = r.firstChild;
      for (; u && u.from == r.from && u.to - u.from > t.length + h; ) {
        if (n.sliceDoc(u.to - t.length, u.to) == t)
          return !1;
        u = u.firstChild;
      }
      return !0;
    }
    let f = r.to == e && r.parent;
    if (!f)
      break;
    r = f;
  }
  return !1;
}
function Xg(n, e, t) {
  let i = n.charCategorizer(e);
  if (i(n.sliceDoc(e - 1, e)) != qe.Word)
    return e;
  for (let r of t) {
    let s = e - r.length;
    if (n.sliceDoc(s, e) == r && i(n.sliceDoc(s - 1, s)) != qe.Word)
      return s;
  }
  return -1;
}
function k1(n = {}) {
  return [
    Sq,
    wt,
    lt.of(n),
    Qq,
    Gq,
    $1
  ];
}
const T1 = [
  { key: "Ctrl-Space", run: uq },
  { key: "Escape", run: dq },
  { key: "ArrowDown", run: /* @__PURE__ */ yl(!0) },
  { key: "ArrowUp", run: /* @__PURE__ */ yl(!1) },
  { key: "PageDown", run: /* @__PURE__ */ yl(!0, "page") },
  { key: "PageUp", run: /* @__PURE__ */ yl(!1, "page") },
  { key: "Enter", run: fq }
], Gq = /* @__PURE__ */ Tn.highest(/* @__PURE__ */ Er.computeN([lt], (n) => n.facet(lt).defaultKeymap ? [T1] : [])), Z1 = [
  GZ(),
  LZ(),
  AQ(),
  Q0(),
  _R(),
  CQ(),
  sZ(),
  ce.allowMultipleSelections.of(!0),
  QR(),
  jc(c0, { fallback: !0 }),
  ER(),
  Xq(),
  k1(),
  xZ(),
  kZ(),
  gZ(),
  wX(),
  Er.of([
    ...Yq,
    ...N0,
    ...IX,
    ...b0,
    ...kR,
    ...T1,
    ...hX
  ])
], Dq = [
  AQ(),
  Q0(),
  CQ(),
  jc(c0, { fallback: !0 }),
  Er.of([
    ...N0,
    ...b0
  ])
];
/**
 * vue-codemirror6
 *
 * @description CodeMirror6 Component for vue2 and vue3.
 * @author Logue <logue@hotmail.co.jp>
 * @copyright 2022-2024 By Masashi Yoshikawa All rights reserved.
 * @license MIT
 * @version 1.3.4
 * @see {@link https://github.com/logue/vue-codemirror6}
 */
const Iq = (n) => n ? Object.entries(n).reduce((e, [t, i]) => (t = t.charAt(0).toUpperCase() + t.slice(1), t = `on${t}`, { ...e, [t]: i }), {}) : {};
function qg(n, e = {}, t) {
  const { props: i, domProps: r, on: s, ...l } = e, O = s ? Iq(s) : {};
  return Nw(
    n,
    { ...l, ...i, ...r, ...O },
    t
  );
}
const Lq = (n) => typeof n == "function" ? n() : n;
var Bq = fm({
  /** Component Name */
  name: "CodeMirror",
  /** Model Definition */
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  /** Props Definition */
  props: {
    /** Model value */
    modelValue: {
      type: String,
      default: ""
    },
    /**
     * Theme
     *
     * @see {@link https://codemirror.net/docs/ref/#view.EditorView^theme}
     */
    theme: {
      type: Object,
      default: () => ({})
    },
    /** Dark Mode */
    dark: {
      type: Boolean,
      default: !1
    },
    /**
     * Use Basic Setup
     *
     * @see {@link https://codemirror.net/docs/ref/#codemirror.basicSetup}
     */
    basic: {
      type: Boolean,
      default: !1
    },
    /**
     * Use Minimal Setup (The basic setting has priority.)
     *
     * @see {@link https://codemirror.net/docs/ref/#codemirror.minimalSetup}
     */
    minimal: {
      type: Boolean,
      default: !1
    },
    /**
     * Placeholder
     *
     * @see {@link https://codemirror.net/docs/ref/#view.placeholder}
     */
    placeholder: {
      type: String,
      default: void 0
    },
    /**
     * Line wrapping
     *
     * An extension that enables line wrapping in the editor (by setting CSS white-space to pre-wrap in the content).
     *
     * @see {@link https://codemirror.net/docs/ref/#view.EditorView%5ElineWrapping}
     */
    wrap: {
      type: Boolean,
      default: !1
    },
    /**
     * Allow tab key indent.
     *
     * @see {@link https://codemirror.net/examples/tab/}
     */
    tab: {
      type: Boolean,
      default: !1
    },
    /**
     * Tab character
     */
    indentUnit: {
      type: String,
      default: void 0
    },
    /**
     * Allow Multiple Selection.
     *
     * @see {@link https://codemirror.net/docs/ref/#state.EditorState^allowMultipleSelections}
     */
    allowMultipleSelections: {
      type: Boolean,
      default: !1
    },
    /**
     * Tab size
     *
     * @see {@link https://codemirror.net/docs/ref/#state.EditorState^tabSize}
     */
    tabSize: {
      type: Number,
      default: void 0
    },
    /**
     * Set line break (separetor) char.
     *
     * @see {@link https://codemirror.net/docs/ref/#state.EditorState^lineSeparator}
     */
    lineSeparator: {
      type: String,
      default: void 0
    },
    /**
     * Readonly
     *
     * @see {@link https://codemirror.net/docs/ref/#state.EditorState^readOnly}
     */
    readonly: {
      type: Boolean,
      default: !1
    },
    /**
     * Disable input.
     *
     * This is the reversed value of the CodeMirror editable.
     * Similar to `readonly`, but setting this value to true disables dragging.
     *
     * @see {@link https://codemirror.net/docs/ref/#view.EditorView^editable}
     */
    disabled: {
      type: Boolean,
      default: !1
    },
    /**
     * Additional Extension
     *
     * @see {@link https://codemirror.net/docs/ref/#state.Extension}
     */
    extensions: {
      type: Array,
      default: () => []
    },
    /**
     * Language Phreses
     *
     * @see {@link https://codemirror.net/examples/translate/}
     */
    phrases: {
      type: Object,
      default: () => {
      }
    },
    /**
     * CodeMirror Language
     *
     * @see {@link https://codemirror.net/docs/ref/#language}
     */
    lang: {
      type: Object,
      default: () => {
      }
    },
    /**
     * CodeMirror Linter
     *
     * @see {@link https://codemirror.net/docs/ref/#lint.linter}
     */
    linter: {
      type: Function,
      default: void 0
    },
    /**
     * Linter Config
     *
     * @see {@link https://codemirror.net/docs/ref/#lint.linter^config}
     */
    linterConfig: {
      type: Object,
      default: () => ({})
    },
    /**
     * Forces any linters configured to run when the editor is idle to run right away.
     *
     * @see {@link https://codemirror.net/docs/ref/#lint.forceLinting}
     */
    forceLinting: {
      type: Boolean,
      default: !1
    },
    /**
     * Show Linter Gutter
     *
     * An area to 🔴 the lines with errors will be displayed.
     * This feature is not enabled if `linter` is not specified.
     *
     * @see {@link https://codemirror.net/docs/ref/#lint.lintGutter}
     */
    gutter: {
      type: Boolean,
      default: !1
    },
    /**
     * Gutter Config
     *
     * @see {@link https://codemirror.net/docs/ref/#lint.lintGutter^config}
     */
    gutterConfig: {
      type: Object,
      default: () => {
      }
    },
    /**
     * Using tag
     */
    tag: {
      type: String,
      default: "div"
    }
  },
  /** Emits */
  emits: {
    /** Model Update */
    "update:modelValue": (n = "") => !0,
    /** CodeMirror ViewUpdate */
    update: (n) => !0,
    /** CodeMirror onReady */
    ready: (n) => !0,
    /** CodeMirror onFocus */
    focus: (n) => !0,
    /** State Changed */
    change: (n) => !0,
    /** CodeMirror onDestroy */
    destroy: () => !0
  },
  /**
   * Setup
   *
   * @param props  - Props
   * @param context - Context
   */
  setup(n, e) {
    const t = Ln(), i = Ln(n.modelValue), r = Iw(new I()), s = Gn({
      get: () => r.value.hasFocus,
      set: (E) => {
        E && r.value.focus();
      }
    }), l = Gn({
      get: () => r.value.state.selection,
      set: (E) => r.value.dispatch({ selection: E })
    }), O = Gn({
      get: () => r.value.state.selection.main.head,
      set: (E) => r.value.dispatch({ selection: { anchor: E } })
    }), h = Gn(
      {
        get: () => r.value.state.toJSON(),
        set: (E) => r.value.setState(ce.fromJSON(E))
      }
    ), f = Ln(0), u = Ln(0), d = Gn(() => {
      const E = new qr(), N = new qr();
      if (n.basic && n.minimal)
        throw "[Vue CodeMirror] Both basic and minimal cannot be specified.";
      return [
        // Toggle basic setup
        n.basic && !n.minimal ? Z1 : void 0,
        // Toggle minimal setup
        n.minimal && !n.basic ? Dq : void 0,
        // ViewUpdate event listener
        I.updateListener.of((pe) => {
          var Fe;
          e.emit("focus", r.value.hasFocus), f.value = (Fe = r.value.state.doc) == null ? void 0 : Fe.length, !(pe.changes.empty || !pe.docChanged) && (n.linter && (n.forceLinting && mg(r.value), u.value = n.linter(r.value).length), e.emit("update", pe));
        }),
        // Toggle light/dark mode.
        I.theme(n.theme, { dark: n.dark }),
        // Toggle line wrapping
        n.wrap ? I.lineWrapping : void 0,
        // Indent with tab
        n.tab ? Er.of([iX]) : void 0,
        // Tab character
        n.indentUnit ? no.of(n.indentUnit) : void 0,
        // Allow Multiple Selections
        ce.allowMultipleSelections.of(n.allowMultipleSelections),
        // Indent tab size
        n.tabSize ? N.of(ce.tabSize.of(n.tabSize)) : void 0,
        // locale settings
        n.phrases ? ce.phrases.of(n.phrases) : void 0,
        // Readonly option
        ce.readOnly.of(n.readonly),
        // Editable option
        I.editable.of(!n.disabled),
        // Set Line break char
        n.lineSeparator ? ce.lineSeparator.of(n.lineSeparator) : void 0,
        // Lang
        n.lang ? E.of(n.lang) : void 0,
        // Append Linter settings
        n.linter ? cX(n.linter, n.linterConfig) : void 0,
        // Show 🔴 to error line when linter enabled.
        n.linter && n.gutter ? SX(n.gutterConfig) : void 0,
        // Placeholder
        n.placeholder ? SZ(n.placeholder) : void 0,
        // Append Extensions
        ...n.extensions
      ].filter((pe) => !!pe);
    });
    jd(
      d,
      (E) => {
        var N;
        (N = r.value) == null || N.dispatch({
          effects: ie.reconfigure.of(E)
        });
      },
      { immediate: !0 }
    ), jd(
      () => n.modelValue,
      async (E) => {
        if (r.value.composing || // IME fix
        r.value.state.doc.toJSON().join(n.lineSeparator ?? `
`) === E)
          return;
        const N = !r.value.state.selection.ranges.every(
          (pe) => pe.anchor < E.length && pe.head < E.length
        );
        r.value.dispatch({
          changes: { from: 0, to: r.value.state.doc.length, insert: E },
          selection: N ? { anchor: 0, head: 0 } : r.value.state.selection,
          scrollIntoView: !0
        });
      },
      { immediate: !0 }
    ), Lw(async () => {
      let E = i.value;
      t.value && (t.value.childNodes[0] && (i.value !== "" && console.warn(
        "[CodeMirror.vue] The <code-mirror> tag contains child elements that overwrite the `v-model` values."
      ), E = t.value.childNodes[0].innerText.trim()), r.value = new I({
        parent: t.value,
        state: ce.create({ doc: E, extensions: d.value }),
        dispatch: (N) => {
          r.value.update([N]), !(N.changes.empty || !N.docChanged) && (e.emit("update:modelValue", N.state.doc.toString() ?? ""), e.emit("change", N.state));
        }
      }), await Bw(), e.emit("ready", {
        view: r.value,
        state: r.value.state,
        container: t.value
      }));
    }), jw(() => {
      r.value.destroy(), e.emit("destroy");
    });
    const g = () => {
      !n.linter || !r.value || (n.forceLinting && mg(r.value), u.value = sX(r.value.state));
    }, Q = () => {
      var E, N;
      (E = r.value) == null || E.dispatch({
        effects: ie.reconfigure.of([])
      }), (N = r.value) == null || N.dispatch({
        effects: ie.appendConfig.of(d.value)
      });
    }, b = (E, N) => r.value.state.sliceDoc(E, N), v = (E) => r.value.state.doc.line(E + 1).text, w = () => r.value.state.doc.lines, Z = () => r.value.state.selection.main.head, Y = () => {
      let E;
      return (E = r.value.state.selection.ranges) !== null && E !== void 0 ? E : [];
    }, U = () => {
      let E;
      return (E = r.value.state.sliceDoc(
        r.value.state.selection.main.from,
        r.value.state.selection.main.to
      )) !== null && E !== void 0 ? E : "";
    }, V = () => {
      const E = r.value.state;
      return E ? E.selection.ranges.map(
        (N) => E.sliceDoc(N.from, N.to)
      ) : [];
    }, W = () => r.value.state.selection.ranges.some(
      (E) => !E.empty
    ), M = (E, N, pe) => r.value.dispatch({
      changes: { from: N, to: pe, insert: E }
    }), z = (E) => r.value.dispatch(r.value.state.replaceSelection(E)), te = (E) => r.value.dispatch({ selection: { anchor: E } }), oe = (E, N) => r.value.dispatch({ selection: { anchor: E, head: N } }), fe = (E, N) => r.value.dispatch({
      selection: X.create(E, N)
    }), le = (E) => r.value.dispatch({
      selection: X.create(
        l.value.ranges.map((N) => N.extend(E(N)))
      )
    }), ne = {
      editor: t,
      view: r,
      cursor: O,
      selection: l,
      focus: s,
      length: f,
      json: h,
      diagnosticCount: u,
      dom: r.value.contentDOM,
      lint: g,
      forceReconfigure: Q,
      // Bellow is CodeMirror5's function
      getRange: b,
      getLine: v,
      lineCount: w,
      getCursor: Z,
      listSelections: Y,
      getSelection: U,
      getSelections: V,
      somethingSelected: W,
      replaceRange: M,
      replaceSelection: z,
      setCursor: te,
      setSelection: oe,
      setSelections: fe,
      extendSelectionsBy: le
    };
    return e.expose(ne), ne;
  },
  render() {
    return qg(
      this.$props.tag,
      {
        ref: "editor",
        class: "vue-codemirror"
      },
      this.$slots.default ? (
        // Hide original content
        qg(
          "aside",
          { style: "display: none;", "aria-hidden": "true" },
          Lq(this.$slots.default)
        )
      ) : void 0
    );
  }
});
const jq = "#e5c07b", Cg = "#e06c75", Nq = "#56b6c2", Fq = "#ffffff", Wl = "#abb2bf", $c = "#7d8799", Hq = "#61afef", Jq = "#98c379", Wg = "#d19a66", Kq = "#c678dd", e5 = "#21252b", Yg = "#2c313a", Ag = "#282c34", Ph = "#353a42", t5 = "#3E4451", Ug = "#528bff", i5 = /* @__PURE__ */ I.theme({
  "&": {
    color: Wl,
    backgroundColor: Ag
  },
  ".cm-content": {
    caretColor: Ug
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: Ug },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: t5 },
  ".cm-panels": { backgroundColor: e5, color: Wl },
  ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
  ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },
  ".cm-activeLine": { backgroundColor: "#6699ff0b" },
  ".cm-selectionMatch": { backgroundColor: "#aafe661a" },
  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847"
  },
  ".cm-gutters": {
    backgroundColor: Ag,
    color: $c,
    border: "none"
  },
  ".cm-activeLineGutter": {
    backgroundColor: Yg
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },
  ".cm-tooltip": {
    border: "none",
    backgroundColor: Ph
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: Ph,
    borderBottomColor: Ph
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: Yg,
      color: Wl
    }
  }
}, { dark: !0 }), n5 = /* @__PURE__ */ so.define([
  {
    tag: $.keyword,
    color: Kq
  },
  {
    tag: [$.name, $.deleted, $.character, $.propertyName, $.macroName],
    color: Cg
  },
  {
    tag: [/* @__PURE__ */ $.function($.variableName), $.labelName],
    color: Hq
  },
  {
    tag: [$.color, /* @__PURE__ */ $.constant($.name), /* @__PURE__ */ $.standard($.name)],
    color: Wg
  },
  {
    tag: [/* @__PURE__ */ $.definition($.name), $.separator],
    color: Wl
  },
  {
    tag: [$.typeName, $.className, $.number, $.changed, $.annotation, $.modifier, $.self, $.namespace],
    color: jq
  },
  {
    tag: [$.operator, $.operatorKeyword, $.url, $.escape, $.regexp, $.link, /* @__PURE__ */ $.special($.string)],
    color: Nq
  },
  {
    tag: [$.meta, $.comment],
    color: $c
  },
  {
    tag: $.strong,
    fontWeight: "bold"
  },
  {
    tag: $.emphasis,
    fontStyle: "italic"
  },
  {
    tag: $.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: $.link,
    color: $c,
    textDecoration: "underline"
  },
  {
    tag: $.heading,
    fontWeight: "bold",
    color: Cg
  },
  {
    tag: [$.atom, $.bool, /* @__PURE__ */ $.special($.variableName)],
    color: Wg
  },
  {
    tag: [$.processingInstruction, $.string, $.inserted],
    color: Jq
  },
  {
    tag: $.invalid,
    color: Fq
  }
]), r5 = [i5, /* @__PURE__ */ jc(n5)];
class Oa {
  /**
  @internal
  */
  constructor(e, t, i, r, s, l, O, h, f, u = 0, d) {
    this.p = e, this.stack = t, this.state = i, this.reducePos = r, this.pos = s, this.score = l, this.buffer = O, this.bufferBase = h, this.curContext = f, this.lookAhead = u, this.parent = d;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(e, t, i = 0) {
    let r = e.parser.context;
    return new Oa(e, [], t, i, i, 0, [], 0, r ? new Vg(r, r.start) : null, 0, null);
  }
  /**
  The stack's current [context](#lr.ContextTracker) value, if
  any. Its type will depend on the context tracker's type
  parameter, or it will be `null` if there is no context
  tracker.
  */
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  // Push a state onto the stack, tracking its start position as well
  // as the buffer base at that point.
  /**
  @internal
  */
  pushState(e, t) {
    this.stack.push(this.state, t, this.bufferBase + this.buffer.length), this.state = e;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(e) {
    var t;
    let i = e >> 19, r = e & 65535, { parser: s } = this.p;
    this.reducePos < this.pos - 25 && this.setLookAhead(this.pos);
    let l = s.dynamicPrecedence(r);
    if (l && (this.score += l), i == 0) {
      this.pushState(s.getGoto(this.state, r, !0), this.reducePos), r < s.minRepeatTerm && this.storeNode(r, this.reducePos, this.reducePos, 4, !0), this.reduceContext(r, this.reducePos);
      return;
    }
    let O = this.stack.length - (i - 1) * 3 - (e & 262144 ? 6 : 0), h = O ? this.stack[O - 2] : this.p.ranges[0].from, f = this.reducePos - h;
    f >= 2e3 && !(!((t = this.p.parser.nodeSet.types[r]) === null || t === void 0) && t.isAnonymous) && (h == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = f) : this.p.lastBigReductionSize < f && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = h, this.p.lastBigReductionSize = f));
    let u = O ? this.stack[O - 1] : 0, d = this.bufferBase + this.buffer.length - u;
    if (r < s.minRepeatTerm || e & 131072) {
      let g = s.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(r, h, g, d + 4, !0);
    }
    if (e & 262144)
      this.state = this.stack[O];
    else {
      let g = this.stack[O - 3];
      this.state = s.getGoto(g, r, !0);
    }
    for (; this.stack.length > O; )
      this.stack.pop();
    this.reduceContext(r, h);
  }
  // Shift a value into the buffer
  /**
  @internal
  */
  storeNode(e, t, i, r = 4, s = !1) {
    if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let l = this, O = this.buffer.length;
      if (O == 0 && l.parent && (O = l.bufferBase - l.parent.bufferBase, l = l.parent), O > 0 && l.buffer[O - 4] == 0 && l.buffer[O - 1] > -1) {
        if (t == i)
          return;
        if (l.buffer[O - 2] >= t) {
          l.buffer[O - 2] = i;
          return;
        }
      }
    }
    if (!s || this.pos == i)
      this.buffer.push(e, t, i, r);
    else {
      let l = this.buffer.length;
      if (l > 0 && this.buffer[l - 4] != 0)
        for (; l > 0 && this.buffer[l - 2] > i; )
          this.buffer[l] = this.buffer[l - 4], this.buffer[l + 1] = this.buffer[l - 3], this.buffer[l + 2] = this.buffer[l - 2], this.buffer[l + 3] = this.buffer[l - 1], l -= 4, r > 4 && (r -= 4);
      this.buffer[l] = e, this.buffer[l + 1] = t, this.buffer[l + 2] = i, this.buffer[l + 3] = r;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(e, t, i, r) {
    if (e & 131072)
      this.pushState(e & 65535, this.pos);
    else if (e & 262144)
      this.pos = r, this.shiftContext(t, i), t <= this.p.parser.maxNode && this.buffer.push(t, i, r, 4);
    else {
      let s = e, { parser: l } = this.p;
      (r > this.pos || t <= l.maxNode) && (this.pos = r, l.stateFlag(
        s,
        1
        /* StateFlag.Skipped */
      ) || (this.reducePos = r)), this.pushState(s, i), this.shiftContext(t, i), t <= l.maxNode && this.buffer.push(t, i, r, 4);
    }
  }
  // Apply an action
  /**
  @internal
  */
  apply(e, t, i, r) {
    e & 65536 ? this.reduce(e) : this.shift(e, t, i, r);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(e, t) {
    let i = this.p.reused.length - 1;
    (i < 0 || this.p.reused[i] != e) && (this.p.reused.push(e), i++);
    let r = this.pos;
    this.reducePos = this.pos = r + e.length, this.pushState(t, r), this.buffer.push(
      i,
      r,
      this.reducePos,
      -1
      /* size == -1 means this is a reused value */
    ), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
  }
  // Split the stack. Due to the buffer sharing and the fact
  // that `this.stack` tends to stay quite shallow, this isn't very
  // expensive.
  /**
  @internal
  */
  split() {
    let e = this, t = e.buffer.length;
    for (; t > 0 && e.buffer[t - 2] > e.reducePos; )
      t -= 4;
    let i = e.buffer.slice(t), r = e.bufferBase + t;
    for (; e && r == e.bufferBase; )
      e = e.parent;
    return new Oa(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, i, r, this.curContext, this.lookAhead, e);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(e, t) {
    let i = e <= this.p.parser.maxNode;
    i && this.storeNode(e, this.pos, t, 4), this.storeNode(0, this.pos, t, i ? 8 : 4), this.pos = this.reducePos = t, this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(e) {
    for (let t = new s5(this); ; ) {
      let i = this.p.parser.stateSlot(
        t.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(t.state, e);
      if (i == 0)
        return !1;
      if (!(i & 65536))
        return !0;
      t.reduce(i);
    }
  }
  // Apply up to Recover.MaxNext recovery actions that conceptually
  // inserts some missing token or rule.
  /**
  @internal
  */
  recoverByInsert(e) {
    if (this.stack.length >= 300)
      return [];
    let t = this.p.parser.nextStates(this.state);
    if (t.length > 8 || this.stack.length >= 120) {
      let r = [];
      for (let s = 0, l; s < t.length; s += 2)
        (l = t[s + 1]) != this.state && this.p.parser.hasAction(l, e) && r.push(t[s], l);
      if (this.stack.length < 120)
        for (let s = 0; r.length < 8 && s < t.length; s += 2) {
          let l = t[s + 1];
          r.some((O, h) => h & 1 && O == l) || r.push(t[s], l);
        }
      t = r;
    }
    let i = [];
    for (let r = 0; r < t.length && i.length < 4; r += 2) {
      let s = t[r + 1];
      if (s == this.state)
        continue;
      let l = this.split();
      l.pushState(s, this.pos), l.storeNode(0, l.pos, l.pos, 4, !0), l.shiftContext(t[r], this.pos), l.reducePos = this.pos, l.score -= 200, i.push(l);
    }
    return i;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: e } = this.p, t = e.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if (!(t & 65536))
      return !1;
    if (!e.validAction(this.state, t)) {
      let i = t >> 19, r = t & 65535, s = this.stack.length - i * 3;
      if (s < 0 || e.getGoto(this.stack[s], r, !1) < 0) {
        let l = this.findForcedReduction();
        if (l == null)
          return !1;
        t = l;
      }
      this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
    }
    return this.reducePos = this.pos, this.reduce(t), !0;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: e } = this.p, t = [], i = (r, s) => {
      if (!t.includes(r))
        return t.push(r), e.allActions(r, (l) => {
          if (!(l & 393216)) if (l & 65536) {
            let O = (l >> 19) - s;
            if (O > 1) {
              let h = l & 65535, f = this.stack.length - O * 3;
              if (f >= 0 && e.getGoto(this.stack[f], h, !1) >= 0)
                return O << 19 | 65536 | h;
            }
          } else {
            let O = i(l, s + 1);
            if (O != null)
              return O;
          }
        });
    };
    return i(this.state, 0);
  }
  /**
  @internal
  */
  forceAll() {
    for (; !this.p.parser.stateFlag(
      this.state,
      2
      /* StateFlag.Accepting */
    ); )
      if (!this.forceReduce()) {
        this.storeNode(0, this.pos, this.pos, 4, !0);
        break;
      }
    return this;
  }
  /**
  Check whether this state has no further actions (assumed to be a direct descendant of the
  top state, since any other states must be able to continue
  somehow). @internal
  */
  get deadEnd() {
    if (this.stack.length != 3)
      return !1;
    let { parser: e } = this.p;
    return e.data[e.stateSlot(
      this.state,
      1
      /* ParseState.Actions */
    )] == 65535 && !e.stateSlot(
      this.state,
      4
      /* ParseState.DefaultReduce */
    );
  }
  /**
  Restart the stack (put it back in its start state). Only safe
  when this.stack.length == 3 (state is directly below the top
  state). @internal
  */
  restart() {
    this.storeNode(0, this.pos, this.pos, 4, !0), this.state = this.stack[0], this.stack.length = 0;
  }
  /**
  @internal
  */
  sameState(e) {
    if (this.state != e.state || this.stack.length != e.stack.length)
      return !1;
    for (let t = 0; t < this.stack.length; t += 3)
      if (this.stack[t] != e.stack[t])
        return !1;
    return !0;
  }
  /**
  Get the parser used by this stack.
  */
  get parser() {
    return this.p.parser;
  }
  /**
  Test whether a given dialect (by numeric ID, as exported from
  the terms file) is enabled.
  */
  dialectEnabled(e) {
    return this.p.parser.dialect.flags[e];
  }
  shiftContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  reduceContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  /**
  @internal
  */
  emitContext() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -3) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
  }
  /**
  @internal
  */
  emitLookAhead() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
  }
  updateContext(e) {
    if (e != this.curContext.context) {
      let t = new Vg(this.curContext.tracker, e);
      t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
    }
  }
  /**
  @internal
  */
  setLookAhead(e) {
    e > this.lookAhead && (this.emitLookAhead(), this.lookAhead = e);
  }
  /**
  @internal
  */
  close() {
    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
  }
}
class Vg {
  constructor(e, t) {
    this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
  }
}
class s5 {
  constructor(e) {
    this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
  }
  reduce(e) {
    let t = e & 65535, i = e >> 19;
    i == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (i - 1) * 3;
    let r = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
    this.state = r;
  }
}
class ha {
  constructor(e, t, i) {
    this.stack = e, this.pos = t, this.index = i, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
  }
  static create(e, t = e.bufferBase + e.buffer.length) {
    return new ha(e, t, t - e.bufferBase);
  }
  maybeNext() {
    let e = this.stack.parent;
    e != null && (this.index = this.stack.bufferBase - e.bufferBase, this.stack = e, this.buffer = e.buffer);
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    this.index -= 4, this.pos -= 4, this.index == 0 && this.maybeNext();
  }
  fork() {
    return new ha(this.stack, this.pos, this.index);
  }
}
function Zs(n, e = Uint16Array) {
  if (typeof n != "string")
    return n;
  let t = null;
  for (let i = 0, r = 0; i < n.length; ) {
    let s = 0;
    for (; ; ) {
      let l = n.charCodeAt(i++), O = !1;
      if (l == 126) {
        s = 65535;
        break;
      }
      l >= 92 && l--, l >= 34 && l--;
      let h = l - 32;
      if (h >= 46 && (h -= 46, O = !0), s += h, O)
        break;
      s *= 46;
    }
    t ? t[r++] = s : t = new e(s);
  }
  return t;
}
class Yl {
  constructor() {
    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
  }
}
const zg = new Yl();
class o5 {
  /**
  @internal
  */
  constructor(e, t) {
    this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = zg, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(e, t) {
    let i = this.range, r = this.rangeIndex, s = this.pos + e;
    for (; s < i.from; ) {
      if (!r)
        return null;
      let l = this.ranges[--r];
      s -= i.from - l.to, i = l;
    }
    for (; t < 0 ? s > i.to : s >= i.to; ) {
      if (r == this.ranges.length - 1)
        return null;
      let l = this.ranges[++r];
      s += l.from - i.to, i = l;
    }
    return s;
  }
  /**
  @internal
  */
  clipPos(e) {
    if (e >= this.range.from && e < this.range.to)
      return e;
    for (let t of this.ranges)
      if (t.to > e)
        return Math.max(e, t.from);
    return this.end;
  }
  /**
  Look at a code unit near the stream position. `.peek(0)` equals
  `.next`, `.peek(-1)` gives you the previous character, and so
  on.
  
  Note that looking around during tokenizing creates dependencies
  on potentially far-away content, which may reduce the
  effectiveness incremental parsing—when looking forward—or even
  cause invalid reparses when looking backward more than 25 code
  units, since the library does not track lookbehind.
  */
  peek(e) {
    let t = this.chunkOff + e, i, r;
    if (t >= 0 && t < this.chunk.length)
      i = this.pos + e, r = this.chunk.charCodeAt(t);
    else {
      let s = this.resolveOffset(e, 1);
      if (s == null)
        return -1;
      if (i = s, i >= this.chunk2Pos && i < this.chunk2Pos + this.chunk2.length)
        r = this.chunk2.charCodeAt(i - this.chunk2Pos);
      else {
        let l = this.rangeIndex, O = this.range;
        for (; O.to <= i; )
          O = this.ranges[++l];
        this.chunk2 = this.input.chunk(this.chunk2Pos = i), i + this.chunk2.length > O.to && (this.chunk2 = this.chunk2.slice(0, O.to - i)), r = this.chunk2.charCodeAt(0);
      }
    }
    return i >= this.token.lookAhead && (this.token.lookAhead = i + 1), r;
  }
  /**
  Accept a token. By default, the end of the token is set to the
  current stream position, but you can pass an offset (relative to
  the stream position) to change that.
  */
  acceptToken(e, t = 0) {
    let i = t ? this.resolveOffset(t, -1) : this.pos;
    if (i == null || i < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = e, this.token.end = i;
  }
  /**
  Accept a token ending at a specific given position.
  */
  acceptTokenTo(e, t) {
    this.token.value = e, this.token.end = t;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: e, chunkPos: t } = this;
      this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = e, this.chunk2Pos = t, this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
      let e = this.input.chunk(this.pos), t = this.pos + e.length;
      this.chunk = t > this.range.to ? e.slice(0, this.range.to - this.pos) : e, this.chunkPos = this.pos, this.chunkOff = 0;
    }
  }
  readNext() {
    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  /**
  Move the stream forward N (defaults to 1) code units. Returns
  the new value of [`next`](#lr.InputStream.next).
  */
  advance(e = 1) {
    for (this.chunkOff += e; this.pos + e >= this.range.to; ) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      e -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
    }
    return this.pos += e, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
  }
  setDone() {
    return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
  }
  /**
  @internal
  */
  reset(e, t) {
    if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = zg, this.pos != e) {
      if (this.pos = e, e == this.end)
        return this.setDone(), this;
      for (; e < this.range.from; )
        this.range = this.ranges[--this.rangeIndex];
      for (; e >= this.range.to; )
        this.range = this.ranges[++this.rangeIndex];
      e >= this.chunkPos && e < this.chunkPos + this.chunk.length ? this.chunkOff = e - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
    }
    return this;
  }
  /**
  @internal
  */
  read(e, t) {
    if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
    if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
    if (e >= this.range.from && t <= this.range.to)
      return this.input.read(e, t);
    let i = "";
    for (let r of this.ranges) {
      if (r.from >= t)
        break;
      r.to > e && (i += this.input.read(Math.max(r.from, e), Math.min(r.to, t)));
    }
    return i;
  }
}
class _r {
  constructor(e, t) {
    this.data = e, this.id = t;
  }
  token(e, t) {
    let { parser: i } = t.p;
    R1(this.data, e, t, this.id, i.data, i.tokenPrecTable);
  }
}
_r.prototype.contextual = _r.prototype.fallback = _r.prototype.extend = !1;
class bc {
  constructor(e, t, i) {
    this.precTable = t, this.elseToken = i, this.data = typeof e == "string" ? Zs(e) : e;
  }
  token(e, t) {
    let i = e.pos, r = 0;
    for (; ; ) {
      let s = e.next < 0, l = e.resolveOffset(1, 1);
      if (R1(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1)
        break;
      if (this.elseToken == null)
        return;
      if (s || r++, l == null)
        break;
      e.reset(l, e.token);
    }
    r && (e.reset(i, e.token), e.acceptToken(this.elseToken, r));
  }
}
bc.prototype.contextual = _r.prototype.fallback = _r.prototype.extend = !1;
class Ji {
  /**
  Create a tokenizer. The first argument is the function that,
  given an input stream, scans for the types of tokens it
  recognizes at the stream's position, and calls
  [`acceptToken`](#lr.InputStream.acceptToken) when it finds
  one.
  */
  constructor(e, t = {}) {
    this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
  }
}
function R1(n, e, t, i, r, s) {
  let l = 0, O = 1 << i, { dialect: h } = t.p.parser;
  e: for (; O & n[l]; ) {
    let f = n[l + 1];
    for (let Q = l + 3; Q < f; Q += 2)
      if ((n[Q + 1] & O) > 0) {
        let b = n[Q];
        if (h.allows(b) && (e.token.value == -1 || e.token.value == b || l5(b, e.token.value, r, s))) {
          e.acceptToken(b);
          break;
        }
      }
    let u = e.next, d = 0, g = n[l + 2];
    if (e.next < 0 && g > d && n[f + g * 3 - 3] == 65535) {
      l = n[f + g * 3 - 1];
      continue e;
    }
    for (; d < g; ) {
      let Q = d + g >> 1, b = f + Q + (Q << 1), v = n[b], w = n[b + 1] || 65536;
      if (u < v)
        g = Q;
      else if (u >= w)
        d = Q + 1;
      else {
        l = n[b + 2], e.advance();
        continue e;
      }
    }
    break;
  }
}
function Eg(n, e, t) {
  for (let i = e, r; (r = n[i]) != 65535; i++)
    if (r == t)
      return i - e;
  return -1;
}
function l5(n, e, t, i) {
  let r = Eg(t, i, e);
  return r < 0 || Eg(t, i, n) < r;
}
const Ut = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG);
let Sh = null;
function Mg(n, e, t) {
  let i = n.cursor(Le.IncludeAnonymous);
  for (i.moveTo(e); ; )
    if (!(t < 0 ? i.childBefore(e) : i.childAfter(e)))
      for (; ; ) {
        if ((t < 0 ? i.to < e : i.from > e) && !i.type.isError)
          return t < 0 ? Math.max(0, Math.min(
            i.to - 1,
            e - 25
            /* Lookahead.Margin */
          )) : Math.min(n.length, Math.max(
            i.from + 1,
            e + 25
            /* Lookahead.Margin */
          ));
        if (t < 0 ? i.prevSibling() : i.nextSibling())
          break;
        if (!i.parent())
          return t < 0 ? 0 : n.length;
      }
}
class a5 {
  constructor(e, t) {
    this.fragments = e, this.nodeSet = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
  }
  nextFragment() {
    let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (e) {
      for (this.safeFrom = e.openStart ? Mg(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? Mg(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length; )
        this.trees.pop(), this.start.pop(), this.index.pop();
      this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
    } else
      this.nextStart = 1e9;
  }
  // `pos` must be >= any previously given `pos` for this cursor
  nodeAt(e) {
    if (e < this.nextStart)
      return null;
    for (; this.fragment && this.safeTo <= e; )
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let t = this.trees.length - 1;
      if (t < 0)
        return this.nextFragment(), null;
      let i = this.trees[t], r = this.index[t];
      if (r == i.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let s = i.children[r], l = this.start[t] + i.positions[r];
      if (l > e)
        return this.nextStart = l, null;
      if (s instanceof je) {
        if (l == e) {
          if (l < this.safeFrom)
            return null;
          let O = l + s.length;
          if (O <= this.safeTo) {
            let h = s.prop(ue.lookAhead);
            if (!h || O + h < this.fragment.to)
              return s;
          }
        }
        this.index[t]++, l + s.length >= Math.max(this.safeFrom, e) && (this.trees.push(s), this.start.push(l), this.index.push(0));
      } else
        this.index[t]++, this.nextStart = l + s.length;
    }
  }
}
class O5 {
  constructor(e, t) {
    this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((i) => new Yl());
  }
  getActions(e) {
    let t = 0, i = null, { parser: r } = e.p, { tokenizers: s } = r, l = r.stateSlot(
      e.state,
      3
      /* ParseState.TokenizerMask */
    ), O = e.curContext ? e.curContext.hash : 0, h = 0;
    for (let f = 0; f < s.length; f++) {
      if (!(1 << f & l))
        continue;
      let u = s[f], d = this.tokens[f];
      if (!(i && !u.fallback) && ((u.contextual || d.start != e.pos || d.mask != l || d.context != O) && (this.updateCachedToken(d, u, e), d.mask = l, d.context = O), d.lookAhead > d.end + 25 && (h = Math.max(d.lookAhead, h)), d.value != 0)) {
        let g = t;
        if (d.extended > -1 && (t = this.addActions(e, d.extended, d.end, t)), t = this.addActions(e, d.value, d.end, t), !u.extend && (i = d, t > g))
          break;
      }
    }
    for (; this.actions.length > t; )
      this.actions.pop();
    return h && e.setLookAhead(h), !i && e.pos == this.stream.end && (i = new Yl(), i.value = e.p.parser.eofTerm, i.start = i.end = e.pos, t = this.addActions(e, i.value, i.end, t)), this.mainToken = i, this.actions;
  }
  getMainToken(e) {
    if (this.mainToken)
      return this.mainToken;
    let t = new Yl(), { pos: i, p: r } = e;
    return t.start = i, t.end = Math.min(i + 1, r.stream.end), t.value = i == r.stream.end ? r.parser.eofTerm : 0, t;
  }
  updateCachedToken(e, t, i) {
    let r = this.stream.clipPos(i.pos);
    if (t.token(this.stream.reset(r, e), i), e.value > -1) {
      let { parser: s } = i.p;
      for (let l = 0; l < s.specialized.length; l++)
        if (s.specialized[l] == e.value) {
          let O = s.specializers[l](this.stream.read(e.start, e.end), i);
          if (O >= 0 && i.p.parser.dialect.allows(O >> 1)) {
            O & 1 ? e.extended = O >> 1 : e.value = O >> 1;
            break;
          }
        }
    } else
      e.value = 0, e.end = this.stream.clipPos(r + 1);
  }
  putAction(e, t, i, r) {
    for (let s = 0; s < r; s += 3)
      if (this.actions[s] == e)
        return r;
    return this.actions[r++] = e, this.actions[r++] = t, this.actions[r++] = i, r;
  }
  addActions(e, t, i, r) {
    let { state: s } = e, { parser: l } = e.p, { data: O } = l;
    for (let h = 0; h < 2; h++)
      for (let f = l.stateSlot(
        s,
        h ? 2 : 1
        /* ParseState.Actions */
      ); ; f += 3) {
        if (O[f] == 65535)
          if (O[f + 1] == 1)
            f = Li(O, f + 2);
          else {
            r == 0 && O[f + 1] == 2 && (r = this.putAction(Li(O, f + 2), t, i, r));
            break;
          }
        O[f] == t && (r = this.putAction(Li(O, f + 1), t, i, r));
      }
    return r;
  }
}
class h5 {
  constructor(e, t, i, r) {
    this.parser = e, this.input = t, this.ranges = r, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new o5(t, r), this.tokens = new O5(e, this.stream), this.topTerm = e.top[1];
    let { from: s } = r[0];
    this.stacks = [Oa.start(this, e.top[0], s)], this.fragments = i.length && this.stream.end - s > e.bufferLength * 4 ? new a5(i, e.nodeSet) : null;
  }
  get parsedPos() {
    return this.minStackPos;
  }
  // Move the parser forward. This will process all parse stacks at
  // `this.pos` and try to advance them to a further position. If no
  // stack for such a position is found, it'll start error-recovery.
  //
  // When the parse is finished, this will return a syntax tree. When
  // not, it returns `null`.
  advance() {
    let e = this.stacks, t = this.minStackPos, i = this.stacks = [], r, s;
    if (this.bigReductionCount > 300 && e.length == 1) {
      let [l] = e;
      for (; l.forceReduce() && l.stack.length && l.stack[l.stack.length - 2] >= this.lastBigReductionStart; )
        ;
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let l = 0; l < e.length; l++) {
      let O = e[l];
      for (; ; ) {
        if (this.tokens.mainToken = null, O.pos > t)
          i.push(O);
        else {
          if (this.advanceStack(O, i, e))
            continue;
          {
            r || (r = [], s = []), r.push(O);
            let h = this.tokens.getMainToken(O);
            s.push(h.value, h.end);
          }
        }
        break;
      }
    }
    if (!i.length) {
      let l = r && f5(r);
      if (l)
        return Ut && console.log("Finish with " + this.stackID(l)), this.stackToTree(l);
      if (this.parser.strict)
        throw Ut && r && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + t);
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && r) {
      let l = this.stoppedAt != null && r[0].pos > this.stoppedAt ? r[0] : this.runRecovery(r, s, i);
      if (l)
        return Ut && console.log("Force-finish " + this.stackID(l)), this.stackToTree(l.forceAll());
    }
    if (this.recovering) {
      let l = this.recovering == 1 ? 1 : this.recovering * 3;
      if (i.length > l)
        for (i.sort((O, h) => h.score - O.score); i.length > l; )
          i.pop();
      i.some((O) => O.reducePos > t) && this.recovering--;
    } else if (i.length > 1) {
      e: for (let l = 0; l < i.length - 1; l++) {
        let O = i[l];
        for (let h = l + 1; h < i.length; h++) {
          let f = i[h];
          if (O.sameState(f) || O.buffer.length > 500 && f.buffer.length > 500)
            if ((O.score - f.score || O.buffer.length - f.buffer.length) > 0)
              i.splice(h--, 1);
            else {
              i.splice(l--, 1);
              continue e;
            }
        }
      }
      i.length > 12 && i.splice(
        12,
        i.length - 12
        /* Rec.MaxStackCount */
      );
    }
    this.minStackPos = i[0].pos;
    for (let l = 1; l < i.length; l++)
      i[l].pos < this.minStackPos && (this.minStackPos = i[l].pos);
    return null;
  }
  stopAt(e) {
    if (this.stoppedAt != null && this.stoppedAt < e)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = e;
  }
  // Returns an updated version of the given stack, or null if the
  // stack can't advance normally. When `split` and `stacks` are
  // given, stacks split off by ambiguous operations will be pushed to
  // `split`, or added to `stacks` if they move `pos` forward.
  advanceStack(e, t, i) {
    let r = e.pos, { parser: s } = this, l = Ut ? this.stackID(e) + " -> " : "";
    if (this.stoppedAt != null && r > this.stoppedAt)
      return e.forceReduce() ? e : null;
    if (this.fragments) {
      let f = e.curContext && e.curContext.tracker.strict, u = f ? e.curContext.hash : 0;
      for (let d = this.fragments.nodeAt(r); d; ) {
        let g = this.parser.nodeSet.types[d.type.id] == d.type ? s.getGoto(e.state, d.type.id) : -1;
        if (g > -1 && d.length && (!f || (d.prop(ue.contextHash) || 0) == u))
          return e.useNode(d, g), Ut && console.log(l + this.stackID(e) + ` (via reuse of ${s.getName(d.type.id)})`), !0;
        if (!(d instanceof je) || d.children.length == 0 || d.positions[0] > 0)
          break;
        let Q = d.children[0];
        if (Q instanceof je && d.positions[0] == 0)
          d = Q;
        else
          break;
      }
    }
    let O = s.stateSlot(
      e.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (O > 0)
      return e.reduce(O), Ut && console.log(l + this.stackID(e) + ` (via always-reduce ${s.getName(
        O & 65535
        /* Action.ValueMask */
      )})`), !0;
    if (e.stack.length >= 8400)
      for (; e.stack.length > 6e3 && e.forceReduce(); )
        ;
    let h = this.tokens.getActions(e);
    for (let f = 0; f < h.length; ) {
      let u = h[f++], d = h[f++], g = h[f++], Q = f == h.length || !i, b = Q ? e : e.split(), v = this.tokens.mainToken;
      if (b.apply(u, d, v ? v.start : b.pos, g), Ut && console.log(l + this.stackID(b) + ` (via ${u & 65536 ? `reduce of ${s.getName(
        u & 65535
        /* Action.ValueMask */
      )}` : "shift"} for ${s.getName(d)} @ ${r}${b == e ? "" : ", split"})`), Q)
        return !0;
      b.pos > r ? t.push(b) : i.push(b);
    }
    return !1;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(e, t) {
    let i = e.pos;
    for (; ; ) {
      if (!this.advanceStack(e, null, null))
        return !1;
      if (e.pos > i)
        return Gg(e, t), !0;
    }
  }
  runRecovery(e, t, i) {
    let r = null, s = !1;
    for (let l = 0; l < e.length; l++) {
      let O = e[l], h = t[l << 1], f = t[(l << 1) + 1], u = Ut ? this.stackID(O) + " -> " : "";
      if (O.deadEnd && (s || (s = !0, O.restart(), Ut && console.log(u + this.stackID(O) + " (restarted)"), this.advanceFully(O, i))))
        continue;
      let d = O.split(), g = u;
      for (let Q = 0; d.forceReduce() && Q < 10 && (Ut && console.log(g + this.stackID(d) + " (via force-reduce)"), !this.advanceFully(d, i)); Q++)
        Ut && (g = this.stackID(d) + " -> ");
      for (let Q of O.recoverByInsert(h))
        Ut && console.log(u + this.stackID(Q) + " (via recover-insert)"), this.advanceFully(Q, i);
      this.stream.end > O.pos ? (f == O.pos && (f++, h = 0), O.recoverByDelete(h, f), Ut && console.log(u + this.stackID(O) + ` (via recover-delete ${this.parser.getName(h)})`), Gg(O, i)) : (!r || r.score < O.score) && (r = O);
    }
    return r;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(e) {
    return e.close(), je.build({
      buffer: ha.create(e),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: e.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(e) {
    let t = (Sh || (Sh = /* @__PURE__ */ new WeakMap())).get(e);
    return t || Sh.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
  }
}
function Gg(n, e) {
  for (let t = 0; t < e.length; t++) {
    let i = e[t];
    if (i.pos == n.pos && i.sameState(n)) {
      e[t].score < n.score && (e[t] = n);
      return;
    }
  }
  e.push(n);
}
class c5 {
  constructor(e, t, i) {
    this.source = e, this.flags = t, this.disabled = i;
  }
  allows(e) {
    return !this.disabled || this.disabled[e] == 0;
  }
}
const $h = (n) => n;
class _1 {
  /**
  Define a context tracker.
  */
  constructor(e) {
    this.start = e.start, this.shift = e.shift || $h, this.reduce = e.reduce || $h, this.reuse = e.reuse || $h, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
  }
}
class kn extends NQ {
  /**
  @internal
  */
  constructor(e) {
    if (super(), this.wrappers = [], e.version != 14)
      throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
    let t = e.nodeNames.split(" ");
    this.minRepeatTerm = t.length;
    for (let O = 0; O < e.repeatNodeCount; O++)
      t.push("");
    let i = Object.keys(e.topRules).map((O) => e.topRules[O][1]), r = [];
    for (let O = 0; O < t.length; O++)
      r.push([]);
    function s(O, h, f) {
      r[O].push([h, h.deserialize(String(f))]);
    }
    if (e.nodeProps)
      for (let O of e.nodeProps) {
        let h = O[0];
        typeof h == "string" && (h = ue[h]);
        for (let f = 1; f < O.length; ) {
          let u = O[f++];
          if (u >= 0)
            s(u, h, O[f++]);
          else {
            let d = O[f + -u];
            for (let g = -u; g > 0; g--)
              s(O[f++], h, d);
            f++;
          }
        }
      }
    this.nodeSet = new Ec(t.map((O, h) => Rt.define({
      name: h >= this.minRepeatTerm ? void 0 : O,
      id: h,
      props: r[h],
      top: i.indexOf(h) > -1,
      error: h == 0,
      skipped: e.skippedNodes && e.skippedNodes.indexOf(h) > -1
    }))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = DQ;
    let l = Zs(e.tokenData);
    this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let O = 0; O < this.specializerSpecs.length; O++)
      this.specialized[O] = this.specializerSpecs[O].term;
    this.specializers = this.specializerSpecs.map(Dg), this.states = Zs(e.states, Uint32Array), this.data = Zs(e.stateData), this.goto = Zs(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((O) => typeof O == "number" ? new _r(l, O) : O), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(e, t, i) {
    let r = new h5(this, e, t, i);
    for (let s of this.wrappers)
      r = s(r, e, t, i);
    return r;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(e, t, i = !1) {
    let r = this.goto;
    if (t >= r[0])
      return -1;
    for (let s = r[t + 1]; ; ) {
      let l = r[s++], O = l & 1, h = r[s++];
      if (O && i)
        return h;
      for (let f = s + (l >> 1); s < f; s++)
        if (r[s] == e)
          return h;
      if (O)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(e, t) {
    let i = this.data;
    for (let r = 0; r < 2; r++)
      for (let s = this.stateSlot(
        e,
        r ? 2 : 1
        /* ParseState.Actions */
      ), l; ; s += 3) {
        if ((l = i[s]) == 65535)
          if (i[s + 1] == 1)
            l = i[s = Li(i, s + 2)];
          else {
            if (i[s + 1] == 2)
              return Li(i, s + 2);
            break;
          }
        if (l == t || l == 0)
          return Li(i, s + 1);
      }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(e, t) {
    return this.states[e * 6 + t];
  }
  /**
  @internal
  */
  stateFlag(e, t) {
    return (this.stateSlot(
      e,
      0
      /* ParseState.Flags */
    ) & t) > 0;
  }
  /**
  @internal
  */
  validAction(e, t) {
    return !!this.allActions(e, (i) => i == t ? !0 : null);
  }
  /**
  @internal
  */
  allActions(e, t) {
    let i = this.stateSlot(
      e,
      4
      /* ParseState.DefaultReduce */
    ), r = i ? t(i) : void 0;
    for (let s = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); r == null; s += 3) {
      if (this.data[s] == 65535)
        if (this.data[s + 1] == 1)
          s = Li(this.data, s + 2);
        else
          break;
      r = t(Li(this.data, s + 1));
    }
    return r;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(e) {
    let t = [];
    for (let i = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); ; i += 3) {
      if (this.data[i] == 65535)
        if (this.data[i + 1] == 1)
          i = Li(this.data, i + 2);
        else
          break;
      if (!(this.data[i + 2] & 1)) {
        let r = this.data[i + 1];
        t.some((s, l) => l & 1 && s == r) || t.push(this.data[i], r);
      }
    }
    return t;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(e) {
    let t = Object.assign(Object.create(kn.prototype), this);
    if (e.props && (t.nodeSet = this.nodeSet.extend(...e.props)), e.top) {
      let i = this.topRules[e.top];
      if (!i)
        throw new RangeError(`Invalid top rule name ${e.top}`);
      t.top = i;
    }
    return e.tokenizers && (t.tokenizers = this.tokenizers.map((i) => {
      let r = e.tokenizers.find((s) => s.from == i);
      return r ? r.to : i;
    })), e.specializers && (t.specializers = this.specializers.slice(), t.specializerSpecs = this.specializerSpecs.map((i, r) => {
      let s = e.specializers.find((O) => O.from == i.external);
      if (!s)
        return i;
      let l = Object.assign(Object.assign({}, i), { external: s.to });
      return t.specializers[r] = Dg(l), l;
    })), e.contextTracker && (t.context = e.contextTracker), e.dialect && (t.dialect = this.parseDialect(e.dialect)), e.strict != null && (t.strict = e.strict), e.wrap && (t.wrappers = t.wrappers.concat(e.wrap)), e.bufferLength != null && (t.bufferLength = e.bufferLength), t;
  }
  /**
  Tells you whether any [parse wrappers](#lr.ParserConfig.wrap)
  are registered for this parser.
  */
  hasWrappers() {
    return this.wrappers.length > 0;
  }
  /**
  Returns the name associated with a given term. This will only
  work for all terms when the parser was generated with the
  `--names` option. By default, only the names of tagged terms are
  stored.
  */
  getName(e) {
    return this.termNames ? this.termNames[e] : String(e <= this.maxNode && this.nodeSet.types[e].name || e);
  }
  /**
  The eof term id is always allocated directly after the node
  types. @internal
  */
  get eofTerm() {
    return this.maxNode + 1;
  }
  /**
  The type of top node produced by the parser.
  */
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  /**
  @internal
  */
  dynamicPrecedence(e) {
    let t = this.dynamicPrecedences;
    return t == null ? 0 : t[e] || 0;
  }
  /**
  @internal
  */
  parseDialect(e) {
    let t = Object.keys(this.dialects), i = t.map(() => !1);
    if (e)
      for (let s of e.split(" ")) {
        let l = t.indexOf(s);
        l >= 0 && (i[l] = !0);
      }
    let r = null;
    for (let s = 0; s < t.length; s++)
      if (!i[s])
        for (let l = this.dialects[t[s]], O; (O = this.data[l++]) != 65535; )
          (r || (r = new Uint8Array(this.maxTerm + 1)))[O] = 1;
    return new c5(e, i, r);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(e) {
    return new kn(e);
  }
}
function Li(n, e) {
  return n[e] | n[e + 1] << 16;
}
function f5(n) {
  let e = null;
  for (let t of n) {
    let i = t.p.stoppedAt;
    (t.pos == t.p.stream.end || i != null && t.pos > i) && t.p.parser.stateFlag(
      t.state,
      2
      /* StateFlag.Accepting */
    ) && (!e || e.score < t.score) && (e = t);
  }
  return e;
}
function Dg(n) {
  if (n.external) {
    let e = n.extend ? 1 : 0;
    return (t, i) => n.external(t, i) << 1 | e;
  }
  return n.get;
}
const u5 = Mr({
  null: $.null,
  instanceof: $.operatorKeyword,
  this: $.self,
  "new super assert open to with void": $.keyword,
  "class interface extends implements enum var": $.definitionKeyword,
  "module package import": $.moduleKeyword,
  "switch while for if else case default do break continue return try catch finally throw": $.controlKeyword,
  "requires exports opens uses provides public private protected static transitive abstract final strictfp synchronized native transient volatile throws": $.modifier,
  IntegerLiteral: $.integer,
  FloatingPointLiteral: $.float,
  "StringLiteral TextBlock": $.string,
  CharacterLiteral: $.character,
  LineComment: $.lineComment,
  BlockComment: $.blockComment,
  BooleanLiteral: $.bool,
  PrimitiveType: $.standard($.typeName),
  TypeName: $.typeName,
  Identifier: $.variableName,
  "MethodName/Identifier": $.function($.variableName),
  Definition: $.definition($.variableName),
  ArithOp: $.arithmeticOperator,
  LogicOp: $.logicOperator,
  BitOp: $.bitwiseOperator,
  CompareOp: $.compareOperator,
  AssignOp: $.definitionOperator,
  UpdateOp: $.updateOperator,
  Asterisk: $.punctuation,
  Label: $.labelName,
  "( )": $.paren,
  "[ ]": $.squareBracket,
  "{ }": $.brace,
  ".": $.derefOperator,
  ", ;": $.separator
}), d5 = { __proto__: null, true: 34, false: 34, null: 42, void: 46, byte: 48, short: 48, int: 48, long: 48, char: 48, float: 48, double: 48, boolean: 48, extends: 62, super: 64, class: 76, this: 78, new: 84, public: 100, protected: 102, private: 104, abstract: 106, static: 108, final: 110, strictfp: 112, default: 114, synchronized: 116, native: 118, transient: 120, volatile: 122, throws: 150, implements: 160, interface: 166, enum: 176, instanceof: 238, open: 267, module: 269, requires: 274, transitive: 276, exports: 278, to: 280, opens: 282, uses: 284, provides: 286, with: 288, package: 292, import: 296, if: 308, else: 310, while: 314, for: 318, var: 325, assert: 332, switch: 336, case: 342, do: 346, break: 350, continue: 354, return: 358, throw: 364, try: 368, catch: 372, finally: 380 }, p5 = kn.deserialize({
  version: 14,
  states: "##jQ]QPOOQ$wQPOOO(bQQO'#H^O*iQQO'#CbOOQO'#Cb'#CbO*pQPO'#CaO*xOSO'#CpOOQO'#Hc'#HcOOQO'#Cu'#CuO,eQPO'#D_O-OQQO'#HmOOQO'#Hm'#HmO/gQQO'#HhO/nQQO'#HhOOQO'#Hh'#HhOOQO'#Hg'#HgO1rQPO'#DUO2PQPO'#GnO4wQPO'#D_O5OQPO'#DzO*pQPO'#E[O5qQPO'#E[OOQO'#DV'#DVO7SQQO'#HaO9^QQO'#EeO9eQPO'#EdO9jQPO'#EfOOQO'#Hb'#HbO7jQQO'#HbO:pQQO'#FhO:wQPO'#ExO:|QPO'#E}O:|QPO'#FPOOQO'#Ha'#HaOOQO'#HY'#HYOOQO'#Gh'#GhOOQO'#HX'#HXO<^QPO'#FiOOQO'#HW'#HWOOQO'#Gg'#GgQ]QPOOOOQO'#Hs'#HsO<cQPO'#HsO<hQPO'#D{O<hQPO'#EVO<hQPO'#EQO<pQPO'#HpO=RQQO'#EfO*pQPO'#C`O=ZQPO'#C`O*pQPO'#FcO=`QPO'#FeO=kQPO'#FkO=kQPO'#FnO<hQPO'#FsO=pQPO'#FpO:|QPO'#FwO=kQPO'#FyO]QPO'#GOO=uQPO'#GQO>QQPO'#GSO>]QPO'#GUO=kQPO'#GWO:|QPO'#GXO>dQPO'#GZO?QQQO'#HiO?mQQO'#CuO?tQPO'#HxO@SQPO'#D_O@rQPO'#DpO?wQPO'#DqO@|QPO'#HxOA_QPO'#DpOAgQPO'#IROAlQPO'#E`OOQO'#Hr'#HrOOQO'#Gm'#GmQ$wQPOOOAtQPO'#HsOOQO'#H^'#H^OCsQQO,58{OOQO'#H['#H[OOOO'#Gi'#GiOEfOSO,59[OOQO,59[,59[OOQO'#Hi'#HiOFVQPO,59eOGXQPO,59yOOQO-E:f-E:fO*pQPO,58zOG{QPO,58zO*pQPO,5;}OHQQPO'#DQOHVQPO'#DQOOQO'#Gk'#GkOIVQQO,59jOOQO'#Dm'#DmOJqQPO'#HuOJ{QPO'#DlOKZQPO'#HtOKcQPO,5<_OKhQPO,59^OLRQPO'#CxOOQO,59c,59cOLYQPO,59bOLeQQO'#H^ONgQQO'#CbO!!iQPO'#D_O!#nQQO'#HmO!$OQQO,59pO!$VQPO'#DvO!$eQPO'#H|O!$mQPO,5:`O!$rQPO,5:`O!%YQPO,5;nO!%eQPO'#ITO!%pQPO,5;eO!%uQPO,5=YOOQO-E:l-E:lOOQO,5:f,5:fO!']QPO,5:fO!'dQPO,5:vO?tQPO,5<_O*pQPO,5:vO<hQPO,5:gO<hQPO,5:qO<hQPO,5:lO<hQPO,5<_O!'zQPO,59qO:|QPO,5:}O!(RQPO,5;QO:|QPO,59TO!(aQPO'#DXOOQO,5;O,5;OOOQO'#El'#ElOOQO'#Eo'#EoO:|QPO,5;UO:|QPO,5;UO:|QPO,5;UO:|QPO,5;UO:|QPO,5;UO:|QPO,5;UO:|QPO,5;UO:|QPO,5;UO:|QPO,5;UO:|QPO,5;fOOQO,5;i,5;iOOQO,5<S,5<SO!(hQPO,5;bO!(yQPO,5;dO!(hQPO'#CyO!)QQQO'#HmO!)`QQO,5;kO]QPO,5<TOOQO-E:e-E:eOOQO,5>_,5>_O!*sQPO,5:gO!+RQPO,5:qO!+ZQPO,5:lO!+fQPO,5>[O!$VQPO,5>[O!'iQPO,59UO!+qQQO,58zO!+yQQO,5;}O!,RQQO,5<PO*pQPO,5<PO:|QPO'#DUO]QPO,5<VO]QPO,5<YO!,ZQPO'#FrO]QPO,5<[O]QPO,5<aO!,kQQO,5<cO!,uQPO,5<eO!,zQPO,5<jOOQO'#Fj'#FjOOQO,5<l,5<lO!-PQPO,5<lOOQO,5<n,5<nO!-UQPO,5<nO!-ZQQO,5<pOOQO,5<p,5<pO>gQPO,5<rO!-bQQO,5<sO!-iQPO'#GdO!.oQPO,5<uO>gQPO,5<}O!2mQPO,59jO!2zQPO'#HuO!3RQPO,59xO!3WQPO,5>dO?tQPO,59xO!3cQPO,5:[OAlQPO,5:zO!3kQPO'#DrO?wQPO'#DrO!3vQPO'#HyO!4OQPO,5:]O?tQPO,5>dO!(hQPO,5>dOAgQPO,5>mOOQO,5:[,5:[O!$rQPO'#DtOOQO,5>m,5>mO!4TQPO'#EaOOQO,5:z,5:zO!7UQPO,5:zO!(hQPO'#DxOOQO-E:k-E:kOOQO,5:y,5:yO*pQPO,58}O!7ZQPO'#ChOOQO1G.k1G.kOOOO-E:g-E:gOOQO1G.v1G.vO!+qQQO1G.fO*pQPO1G.fO!7eQQO1G1iOOQO,59l,59lO!7mQPO,59lOOQO-E:i-E:iO!7rQPO,5>aO!8ZQPO,5:WO<hQPO'#GpO!8bQPO,5>`OOQO1G1y1G1yOOQO1G.x1G.xO!8{QPO'#CyO!9kQPO'#HmO!9uQPO'#CzO!:TQPO'#HlO!:]QPO,59dOOQO1G.|1G.|OLYQPO1G.|O!:sQPO,59eO!;QQQO'#H^O!;cQQO'#CbOOQO,5:b,5:bO<hQPO,5:cOOQO,5:a,5:aO!;tQQO,5:aOOQO1G/[1G/[O!;yQPO,5:bO!<[QPO'#GsO!<oQPO,5>hOOQO1G/z1G/zO!<wQPO'#DvO!=YQPO1G/zO!(hQPO'#GqO!=_QPO1G1YO:|QPO1G1YO<hQPO'#GyO!=gQPO,5>oOOQO1G1P1G1POOQO1G0Q1G0QO!=oQPO'#E]OOQO1G0b1G0bO!>`QPO1G1yO!'dQPO1G0bO!*sQPO1G0RO!+RQPO1G0]O!+ZQPO1G0WOOQO1G/]1G/]O!>eQQO1G.pO9eQPO1G0jO*pQPO1G0jO<pQPO'#HpO!@[QQO1G.pOOQO1G.p1G.pO!@aQQO1G0iOOQO1G0l1G0lO!@hQPO1G0lO!@sQQO1G.oO!AZQQO'#HqO!AhQPO,59sO!BzQQO1G0pO!DfQQO1G0pO!DmQQO1G0pO!FUQQO1G0pO!F]QQO1G0pO!GbQQO1G0pO!I]QQO1G0pO!IdQQO1G0pO!IkQQO1G0pO!IuQQO1G1QO!I|QQO'#HmOOQO1G0|1G0|O!KSQQO1G1OOOQO1G1O1G1OOOQO1G1o1G1oO!KjQPO'#D[O!(hQPO'#D|O!(hQPO'#D}OOQO1G0R1G0RO!KqQPO1G0RO!KvQPO1G0RO!LOQPO1G0RO!LZQPO'#EXOOQO1G0]1G0]O!LnQPO1G0]O!LsQPO'#ETO!(hQPO'#ESOOQO1G0W1G0WO!MmQPO1G0WO!MrQPO1G0WO!MzQPO'#EhO!NRQPO'#EhOOQO'#Gx'#GxO!NZQQO1G0mO# }QQO1G3vO9eQPO1G3vO#$PQPO'#FXOOQO1G.f1G.fOOQO1G1i1G1iO#$WQPO1G1kOOQO1G1k1G1kO#$cQQO1G1kO#$kQPO1G1qOOQO1G1t1G1tO+QQPO'#D_O-OQQO,5<bO#(cQPO,5<bO#(tQPO,5<^O#({QPO,5<^OOQO1G1v1G1vOOQO1G1{1G1{OOQO1G1}1G1}O:|QPO1G1}O#,oQPO'#F{OOQO1G2P1G2PO=kQPO1G2UOOQO1G2W1G2WOOQO1G2Y1G2YOOQO1G2[1G2[OOQO1G2^1G2^OOQO1G2_1G2_O#,vQQO'#H^O#-aQQO'#CbO-OQQO'#HmO#-zQQOOO#.hQQO'#EeO#.VQQO'#HbO!$VQPO'#GeO#.oQPO,5=OOOQO'#HQ'#HQO#.wQPO1G2aO#2uQPO'#G]O>gQPO'#GaOOQO1G2a1G2aO#2zQPO1G2iO#6xQPO,5>gOOQO1G/d1G/dOOQO1G4O1G4OO#7ZQPO1G/dOOQO1G/v1G/vOOQO1G0f1G0fO!7UQPO1G0fOOQO,5:^,5:^O!(hQPO'#DsO#7`QPO,5:^O?wQPO'#GrO#7kQPO,5>eOOQO1G/w1G/wOAgQPO'#H{O#7sQPO1G4OO?tQPO1G4OOOQO1G4X1G4XO!#YQPO'#DvO!!iQPO'#D_OOQO,5:{,5:{O#8OQPO,5:{O#8OQPO,5:{O#8VQQO'#HaO#9hQQO'#HbO#9rQQO'#EbO#9}QPO'#EbO#:VQPO'#IOOOQO,5:d,5:dOOQO1G.i1G.iO#:bQQO'#EeO#:rQQO'#H`O#;SQPO'#FTOOQO'#H`'#H`O#;^QPO'#H`O#;{QPO'#IWO#<TQPO,59SOOQO7+$Q7+$QO!+qQQO7+$QOOQO7+'T7+'TOOQO1G/W1G/WO#<YQPO'#DoO#<dQQO'#HvOOQO'#Hv'#HvOOQO1G/r1G/rOOQO,5=[,5=[OOQO-E:n-E:nO#<tQWO,58{O#<{QPO,59fOOQO,59f,59fO!(hQPO'#HoOKmQPO'#GjO#=ZQPO,5>WOOQO1G/O1G/OOOQO7+$h7+$hOOQO1G/{1G/{O#=cQQO1G/{OOQO1G/}1G/}O#=hQPO1G/{OOQO1G/|1G/|O<hQPO1G/}OOQO,5=_,5=_OOQO-E:q-E:qOOQO7+%f7+%fOOQO,5=],5=]OOQO-E:o-E:oO:|QPO7+&tOOQO7+&t7+&tOOQO,5=e,5=eOOQO-E:w-E:wO#=mQPO'#EUO#={QPO'#EUOOQO'#Gw'#GwO#>dQPO,5:wOOQO,5:w,5:wOOQO7+'e7+'eOOQO7+%|7+%|OOQO7+%m7+%mO!KqQPO7+%mO!KvQPO7+%mO!LOQPO7+%mOOQO7+%w7+%wO!LnQPO7+%wOOQO7+%r7+%rO!MmQPO7+%rO!MrQPO7+%rOOQO7+&U7+&UOOQO'#Ee'#EeO9eQPO7+&UO9eQPO,5>[O#?TQPO7+$[OOQO7+&T7+&TOOQO7+&W7+&WO:|QPO'#GlO#?cQPO,5>]OOQO1G/_1G/_O:|QPO7+&lO#?nQQO,59eO#@tQPO,59vOOQO,59v,59vOOQO,5:h,5:hOOQO'#EP'#EPOOQO,5:i,5:iO#@{QPO'#EYO<hQPO'#EYO#A^QPO'#IPO#AiQPO,5:sO?tQPO'#HxO!(hQPO'#HxO#AqQPO'#DpOOQO'#Gu'#GuO#AxQPO,5:oOOQO,5:o,5:oOOQO,5:n,5:nOOQO,5;S,5;SO#BrQQO,5;SO#ByQPO,5;SOOQO-E:v-E:vOOQO7+&X7+&XOOQO7+)b7+)bO#CQQQO7+)bOOQO'#G|'#G|O#DqQPO,5;sOOQO,5;s,5;sO#DxQPO'#FYO*pQPO'#FYO*pQPO'#FYO*pQPO'#FYO#EWQPO7+'VO#E]QPO7+'VOOQO7+'V7+'VO]QPO7+']O#EhQPO1G1|O?tQPO1G1|O#EvQQO1G1xO!(aQPO1G1xO#E}QPO1G1xO#FUQQO7+'iOOQO'#HP'#HPO#F]QPO,5<gOOQO,5<g,5<gO#FdQPO'#HsO:|QPO'#F|O#FlQPO7+'pO#FqQPO,5=PO?tQPO,5=PO#FvQPO1G2jO#HPQPO1G2jOOQO1G2j1G2jOOQO-E;O-E;OOOQO7+'{7+'{O!<[QPO'#G_O>gQPO,5<wOOQO,5<{,5<{O#HXQPO7+(TOOQO7+(T7+(TO#LVQPO1G4ROOQO7+%O7+%OOOQO7+&Q7+&QO#LhQPO,5:_OOQO1G/x1G/xOOQO,5=^,5=^OOQO-E:p-E:pOOQO7+)j7+)jO#LsQPO7+)jO!:bQPO,5:aOOQO1G0g1G0gO#MOQPO1G0gO#MVQPO,59qO#MkQPO,5:|O9eQPO,5:|O!(hQPO'#GtO#MpQPO,5>jO#M{QPO,59TO#NSQPO'#IVO#N[QPO,5;oO*pQPO'#G{O#NaQPO,5>rOOQO1G.n1G.nOOQO<<Gl<<GlO#NiQPO'#HwO#NqQPO,5:ZOOQO1G/Q1G/QOOQO,5>Z,5>ZOOQO,5=U,5=UOOQO-E:h-E:hO#NvQPO7+%gOOQO7+%g7+%gOOQO7+%i7+%iOOQO<<J`<<J`O$ ^QPO'#H^O$ eQPO'#CbO$ lQPO,5:pO$ qQPO,5:xO#=mQPO,5:pOOQO-E:u-E:uOOQO1G0c1G0cOOQO<<IX<<IXO!KqQPO<<IXO!KvQPO<<IXOOQO<<Ic<<IcOOQO<<I^<<I^O!MmQPO<<I^OOQO<<Ip<<IpO$ vQQO<<GvO9eQPO<<IpO*pQPO<<IpOOQO<<Gv<<GvO$#mQQO,5=WOOQO-E:j-E:jO$#zQQO<<JWOOQO1G/b1G/bOOQO,5:t,5:tO$$bQPO,5:tO$$pQPO,5:tO$%RQPO'#GvO$%iQPO,5>kO$%tQPO'#EZOOQO1G0_1G0_O$%{QPO1G0_O?tQPO,5:pOOQO-E:s-E:sOOQO1G0Z1G0ZOOQO1G0n1G0nO$&QQQO1G0nOOQO<<L|<<L|OOQO-E:z-E:zOOQO1G1_1G1_O$&XQQO,5;tOOQO'#G}'#G}O#DxQPO,5;tOOQO'#IX'#IXO$&aQQO,5;tO$&rQQO,5;tOOQO<<Jq<<JqO$&zQPO<<JqOOQO<<Jw<<JwO:|QPO7+'hO$'PQPO7+'hO!(aQPO7+'dO$'_QPO7+'dO$'dQQO7+'dOOQO<<KT<<KTOOQO-E:}-E:}OOQO1G2R1G2ROOQO,5<h,5<hO$'kQQO,5<hOOQO<<K[<<K[O:|QPO1G2kO$'rQPO1G2kOOQO,5=n,5=nOOQO7+(U7+(UO$'wQPO7+(UOOQO-E;Q-E;QO$)fQWO'#HhO$)QQWO'#HhO$)mQPO'#G`O<hQPO,5<yO!$VQPO,5<yOOQO1G2c1G2cOOQO<<Ko<<KoO$*OQPO1G/yOOQO<<MU<<MUOOQO7+&R7+&RO$*ZQPO1G0jO$*fQQO1G0hOOQO1G0h1G0hO$*nQPO1G0hOOQO,5=`,5=`OOQO-E:r-E:rO$*sQQO1G.oOOQO1G1[1G1[O$*}QPO'#GzO$+[QPO,5>qOOQO1G1Z1G1ZO$+dQPO'#FUOOQO,5=g,5=gOOQO-E:y-E:yO$+iQPO'#GoO$+vQPO,5>cOOQO1G/u1G/uOOQO<<IR<<IROOQO1G0[1G0[O$,OQPO1G0dO$,TQPO1G0[O$,YQPO1G0dOOQOAN>sAN>sO!KqQPOAN>sOOQOAN>xAN>xOOQOAN?[AN?[O9eQPOAN?[OOQO1G0`1G0`O$,_QPO1G0`OOQO,5=b,5=bOOQO-E:t-E:tO$,mQPO,5:uOOQO7+%y7+%yOOQO7+&Y7+&YOOQO1G1`1G1`O$,tQQO1G1`OOQO-E:{-E:{O$,|QQO'#IYO$,wQPO1G1`O$&gQPO1G1`O*pQPO1G1`OOQOAN@]AN@]O$-XQQO<<KSO:|QPO<<KSO$-`QPO<<KOOOQO<<KO<<KOO!(aQPO<<KOOOQO1G2S1G2SO$-eQQO7+(VO:|QPO7+(VOOQO<<Kp<<KpP!-iQPO'#HSO!$VQPO'#HRO$-oQPO,5<zO$-zQPO1G2eO<hQPO1G2eO9eQPO7+&SO$.PQPO7+&SOOQO7+&S7+&SOOQO,5=f,5=fOOQO-E:x-E:xO#M{QPO,5;pOOQO,5=Z,5=ZOOQO-E:m-E:mO$.UQPO7+&OOOQO7+%v7+%vO$.dQPO7+&OOOQOG24_G24_OOQOG24vG24vOOQO7+%z7+%zOOQO7+&z7+&zO*pQPO'#HOO$.iQPO,5>tO$.qQPO7+&zO$.vQQO'#IZOOQOAN@nAN@nO$/RQQOAN@nOOQOAN@jAN@jO$/YQPOAN@jO$/_QQO<<KqO$/iQPO,5=mOOQO-E;P-E;POOQO7+(P7+(PO$/zQPO7+(PO$0PQPO<<InOOQO<<In<<InO$0UQPO<<IjOOQO<<Ij<<IjO#M{QPO<<IjO$0UQPO<<IjO$0dQQO,5=jOOQO-E:|-E:|OOQO<<Jf<<JfO$0oQPO,5>uOOQOG26YG26YOOQOG26UG26UOOQO<<Kk<<KkOOQOAN?YAN?YOOQOAN?UAN?UO#M{QPOAN?UO$0wQPOAN?UO$0|QPOAN?UO$1[QPOG24pOOQOG24pG24pO#M{QPOG24pOOQOLD*[LD*[O$1aQPOLD*[OOQO!$'Mv!$'MvO*pQPO'#CaO$1fQQO'#H^O$1yQQO'#CbO!(hQPO'#Cy",
  stateData: "$2f~OPOSQOS%yOS~OZ`O_VO`VOaVObVOcVOeVOg^Oh^Op!POv{OwkOz!OO}cO!PvO!SyO!TyO!UyO!VyO!WyO!XyO!YyO!ZzO![!`O!]yO!^yO!_yO!u}O!z|O#fpO#roO#tpO#upO#y!RO#z!QO$W!SO$Y!TO$`!UO$c!VO$e!XO$h!WO$l!YO$n!ZO$s![O$u!]O$w!^O$y!_O$|!aO%O!bO%}TO&PRO&RQO&XUO&tdO~Og^Oh^Ov{O}cO!P!mO!SyO!TyO!UyO!VyO!W!pO!XyO!YyO!ZzO!]yO!^yO!_yO!u}O!z|O%}TO&P!cO&R!dO&_!hO&tdO~OWiXW&QXZ&QXuiXu&QX!P&QX!b&QX#]&QX#_&QX#a&QX#b&QX#d&QX#e&QX#f&QX#g&QX#h&QX#i&QX#k&QX#o&QX#r&QX%}iX&PiX&RiX&^&QX&_iX&_&QX&n&QX&viX&v&QX&x!aX~O#p$^X~P&bOWUXW&]XZUXuUXu&]X!PUX!bUX#]UX#_UX#aUX#bUX#dUX#eUX#fUX#gUX#hUX#iUX#kUX#oUX#rUX%}&]X&P&]X&R&]X&^UX&_UX&_&]X&nUX&vUX&v&]X&x!aX~O#p$^X~P(iO&PSO&R!qO~O&W!vO&Y!tO~Og^Oh^O!SyO!TyO!UyO!VyO!WyO!XyO!YyO!ZzO!]yO!^yO!_yO%}TO&P!wO&RWOg!RXh!RX$h!RX&P!RX&R!RX~O#y!|O#z!{O$W!}Ov!RX!u!RX!z!RX&t!RX~P+QOW#XOu#OO%}TO&P#SO&R#SO&v&aX~OW#[Ou&[X%}&[X&P&[X&R&[X&v&[XY&[Xw&[X&n&[X&q&[XZ&[Xq&[X&^&[X!P&[X#_&[X#a&[X#b&[X#d&[X#e&[X#f&[X#g&[X#h&[X#i&[X#k&[X#o&[X#r&[X}&[X!r&[X#p&[Xs&[X|&[X~O&_#YO~P-dO&_&[X~P-dOZ`O_VO`VOaVObVOcVOeVOg^Oh^Op!POwkOz!OO!SyO!TyO!UyO!VyO!WyO!XyO!YyO!ZzO!]yO!^yO!_yO#fpO#roO#tpO#upO%}TO&XUO~O&P#^O&R#]OY&pP~P/uO%}TOg%bXh%bXv%bX!S%bX!T%bX!U%bX!V%bX!W%bX!X%bX!Y%bX!Z%bX!]%bX!^%bX!_%bX!u%bX!z%bX$h%bX&P%bX&R%bX&t%bX&_%bX~O!SyO!TyO!UyO!VyO!WyO!XyO!YyO!ZzO!]yO!^yO!_yOg!RXh!RXv!RX!u!RX!z!RX&P!RX&R!RX&t!RX&_!RX~O$h!RX~P3gO|#kO~P]Og^Oh^Ov#pO!u#rO!z#qO&P!wO&RWO&t#oO~O$h#sO~P5VOu#uO&v#vO!P&TX#_&TX#a&TX#b&TX#d&TX#e&TX#f&TX#g&TX#h&TX#i&TX#k&TX#o&TX#r&TX&^&TX&_&TX&n&TX~OW#tOY&TX#p&TXs&TXq&TX|&TX~P5xO!b#wO#]#wOW&UXu&UX!P&UX#_&UX#a&UX#b&UX#d&UX#e&UX#f&UX#g&UX#h&UX#i&UX#k&UX#o&UX#r&UX&^&UX&_&UX&n&UX&v&UXY&UX#p&UXs&UXq&UX|&UX~OZ#XX~P7jOZ#xO~O&v#vO~O#_#|O#a#}O#b$OO#d$QO#e$RO#f$SO#g$TO#h$UO#i$UO#k$YO#o$VO#r$WO&^#zO&_#zO&n#{O~O!P$XO~P9oO&x$ZO~OZ`O_VO`VOaVObVOcVOeVOg^Oh^Op!POwkOz!OO#fpO#roO#tpO#upO%}TO&P0qO&R0pO&XUO~O#p$_O~O![$aO~O&P#SO&R#SO~Og^Oh^O&P!wO&RWO&_#YO~OW$gO&v#vO~O#z!{O~O!W$kO&PSO&R!qO~OZ$lO~OZ$oO~O!P$vO&P$uO&R$uO~O!P$xO&P$uO&R$uO~O!P${O~P:|OZ%OO}cO~OW&]Xu&]X%}&]X&P&]X&R&]X&_&]X~OZ!aX~P>lOWiXuiX%}iX&PiX&RiX&_iX~OZ!aX~P?XOu#OO%}TO&P#SO&R#SO~O%}TO~P3gOg^Oh^Ov#pO!u#rO!z#qO&_!hO&t#oO~O&P!cO&R!dO~P@ZOg^Oh^O%}TO&P!cO&R!dO~O}cO!P%aO~OZ%bO~O}%dO!m%gO~O}cOg&gXh&gXv&gX!S&gX!T&gX!U&gX!V&gX!W&gX!X&gX!Y&gX!Z&gX!]&gX!^&gX!_&gX!u&gX!z&gX%}&gX&P&gX&R&gX&_&gX&t&gX~OW%jOZ%kOgTahTa%}Ta&PTa&RTa~OvTa!STa!TTa!UTa!VTa!WTa!XTa!YTa!ZTa!]Ta!^Ta!_Ta!uTa!zTa#yTa#zTa$WTa$hTa&tTa&_TauTaYTaqTa|Ta!PTa~PC[O&W%nO&Y!tO~Ou#OO%}TOqma&^maYma&nma!Pma~O&vma}ma!rma~PEnO!SyO!TyO!UyO!VyO!WyO!XyO!YyO!ZzO!]yO!^yO!_yO~Og!Rah!Rav!Ra!u!Ra!z!Ra$h!Ra&P!Ra&R!Ra&t!Ra&_!Ra~PFdO#z%pO~Os%rO~Ou%sO%}TO~Ou#OO%}ra&Pra&Rra&vraYrawra&nra&qra!Pra&^raqra~OWra#_ra#ara#bra#dra#era#fra#gra#hra#ira#kra#ora#rra&_ra#prasra|ra~PH_Ou#OO%}TOq&iX!P&iX!b&iX~OY&iX#p&iX~PJ`O!b%vOq!`X!P!`XY!`X~Oq%wO!P&hX~O!P%yO~Ov%zO~Og^Oh^O%}0oO&P!wO&RWO&b%}O~O&^&`P~PKmO%}TO&P!wO&RWO~OW&QXYiXY!aXY&QXZ&QXq!aXu&QXwiX!b&QX#]&QX#_&QX#a&QX#b&QX#d&QX#e&QX#f&QX#g&QX#h&QX#i&QX#k&QX#o&QX#r&QX&^&QX&_&QX&niX&n&QX&qiX&viX&v&QX&x!aX~P?XOWUXYUXY!aXY&]XZUXq!aXuUXw&]X!bUX#]UX#_UX#aUX#bUX#dUX#eUX#fUX#gUX#hUX#iUX#kUX#oUX#rUX&^UX&_UX&nUX&n&]X&q&]X&vUX&v&]X&x!aX~P>lOg^Oh^O%}TO&P!wO&RWOg!RXh!RX&P!RX&R!RX~PFdOu#OOw&XO%}TO&P&UO&R&TO&q&WO~OW#XOY&aX&n&aX&v&aX~P!#YOY&ZO~P9oOg^Oh^O&P!wO&RWO~Oq&]OY&pX~OY&_O~Og^Oh^O%}TO&P!wO&RWOY&pP~PFdOY&dO&n&bO&v#vO~Oq&eO&x$ZOY&wX~OY&gO~O%}TOg%bah%bav%ba!S%ba!T%ba!U%ba!V%ba!W%ba!X%ba!Y%ba!Z%ba!]%ba!^%ba!_%ba!u%ba!z%ba$h%ba&P%ba&R%ba&t%ba&_%ba~O|&hO~P]O}&iO~Op&uOw&vO&PSO&R!qO&_#YO~Oz&tO~P!'iOz&xO&PSO&R!qO&_#YO~OY&eP~P:|Og^Oh^O%}TO&P!wO&RWO~O}cO~P:|OW#XOu#OO%}TO&v&aX~O#r$WO!P#sa#_#sa#a#sa#b#sa#d#sa#e#sa#f#sa#g#sa#h#sa#i#sa#k#sa#o#sa&^#sa&_#sa&n#saY#sa#p#sas#saq#sa|#sa~Oo'_O}'^O!r'`O&_!hO~O}'eO!r'`O~Oo'iO}'hO&_!hO~OZ#xOu'mO%}TO~OW%jO}'sO~OW%jO!P'uO~OW'vO!P'wO~O$h!WO&P0qO&R0pO!P&eP~P/uO!P(SO#p(TO~P9oO}(UO~O$c(WO~O!P(XO~O!P(YO~O!P(ZO~P9oO!P(]O~P9oOZ$lO_VO`VOaVObVOcVOeVOg^Oh^Op!POwkOz!OO%}TO&P(_O&R(^O&XUO~PFdO%Q(hO%U(iOZ$}a_$}a`$}aa$}ab$}ac$}ae$}ag$}ah$}ap$}av$}aw$}az$}a}$}a!P$}a!S$}a!T$}a!U$}a!V$}a!W$}a!X$}a!Y$}a!Z$}a![$}a!]$}a!^$}a!_$}a!u$}a!z$}a#f$}a#r$}a#t$}a#u$}a#y$}a#z$}a$W$}a$Y$}a$`$}a$c$}a$e$}a$h$}a$l$}a$n$}a$s$}a$u$}a$w$}a$y$}a$|$}a%O$}a%w$}a%}$}a&P$}a&R$}a&X$}a&t$}a|$}a$a$}a$q$}a~O}ra!rra'Ora~PH_OZ%bO~PJ`O!P(mO~O!m%gO}&la!P&la~O}cO!P(pO~Oo(tOq!fX&^!fX~Oq(vO&^&mX~O&^(xO~OZ`O_VO`VOaVObVOcVOeVOg^Oh^Op)UOv{Ow)TOz!OO|)PO}cO!PvO![!`O!u}O!z|O#fpO#roO#tpO#upO#y!RO#z!QO$W!SO$Y!TO$`!UO$c!VO$e!XO$h!WO$l!YO$n!ZO$s![O$u!]O$w!^O$y!_O$|!aO%O!bO%}TO&PRO&RQO&XUO&_#YO&tdO~PFdO}%dO~O})]OY&zP~P:|OW%jO!P)dO~Os)eO~Ou#OO%}TOq&ia!P&ia!b&iaY&ia#p&ia~O})fO~P:|Oq%wO!P&ha~Og^Oh^O%}0oO&P!wO&RWO~O&b)mO~P!8jOu#OO%}TOq&aX&^&aXY&aX&n&aX!P&aX~O}&aX!r&aX~P!9SOo)oOp)oOqnX&^nX~Oq)pO&^&`X~O&^)rO~Ou#OOw)tO%}TO&PSO&R!qO~OYma&nma&vma~P!:bOW&QXY!aXq!aXu!aX%}!aX~OWUXY!aXq!aXu!aX%}!aX~OW)wO~Ou#OO%}TO&P#SO&R#SO&q)yO~Og^Oh^O%}TO&P!wO&RWO~PFdOq&]OY&pa~Ou#OO%}TO&P#SO&R#SO&q&WO~OY)|O~OY*PO&n&bO~Oq&eOY&wa~Og^Oh^Ov{O|*XO!u}O%}TO&P!wO&RWO&tdO~PFdO!P*YO~OW^iZ#XXu^i!P^i!b^i#]^i#_^i#a^i#b^i#d^i#e^i#f^i#g^i#h^i#i^i#k^i#o^i#r^i&^^i&_^i&n^i&v^iY^i#p^is^iq^i|^i~OW*iO~Os*jO~P9oOz*kO&PSO&R!qO~O!P]iY]i#p]is]iq]i|]i~P9oOq*lOY&eX!P&eX~P9oOY*nO~O#f$SO#g$TO#k$YO#r$WO!P#^i#_#^i#a#^i#b#^i#d#^i#e#^i#o#^i&^#^i&_#^i&n#^iY#^i#p#^is#^iq#^i|#^i~O#h$UO#i$UO~P!AmO#_#|O#d$QO#e$RO#f$SO#g$TO#h$UO#i$UO#k$YO#r$WO&^#zO&_#zO&n#{O!P#^i#b#^i#o#^iY#^i#p#^is#^iq#^i|#^i~O#a#^i~P!CUO#a#}O~P!CUO#_#|O#f$SO#g$TO#h$UO#i$UO#k$YO#r$WO&^#zO&_#zO!P#^i#a#^i#b#^i#d#^i#e#^i#o#^iY#^i#p#^is#^iq#^i|#^i~O&n#^i~P!DtO&n#{O~P!DtO#f$SO#g$TO#k$YO#r$WO!P#^i#a#^i#b#^i#e#^i#o#^iY#^i#p#^is#^iq#^i|#^i~O#_#|O#d$QO#h$UO#i$UO&^#zO&_#zO&n#{O~P!FdO#k$YO#r$WO!P#^i#_#^i#a#^i#b#^i#d#^i#e#^i#f#^i#h#^i#i#^i#o#^i&^#^i&_#^i&n#^iY#^i#p#^is#^iq#^i|#^i~O#g$TO~P!G{O#g#^i~P!G{O#h#^i#i#^i~P!AmO#p*oO~P9oO#_&aX#a&aX#b&aX#d&aX#e&aX#f&aX#g&aX#h&aX#i&aX#k&aX#o&aX#r&aX&_&aX#p&aXs&aX|&aX~P!9SO!P#liY#li#p#lis#liq#li|#li~P9oO|*rO~P$wO}'^O~O}'^O!r'`O~Oo'_O}'^O!r'`O~O%}TO&P#SO&R#SO|&sP!P&sP~PFdO}'eO~Og^Oh^Ov{O|+PO!P*}O!u}O!z|O%}TO&P!wO&RWO&_!hO&tdO~PFdO}'hO~Oo'iO}'hO~Os+RO~P:|Ou+TO%}TO~Ou'mO})fO%}TOW#Zi!P#Zi#_#Zi#a#Zi#b#Zi#d#Zi#e#Zi#f#Zi#g#Zi#h#Zi#i#Zi#k#Zi#o#Zi#r#Zi&^#Zi&_#Zi&n#Zi&v#ZiY#Zi#p#Zis#Ziq#Zi|#Zi~O}'^OW&diu&di!P&di#_&di#a&di#b&di#d&di#e&di#f&di#g&di#h&di#i&di#k&di#o&di#r&di&^&di&_&di&n&di&v&diY&di#p&dis&diq&di|&di~O#}+]O$P+^O$R+^O$S+_O$T+`O~O|+[O~P##nO$Z+aO&PSO&R!qO~OW+bO!P+cO~O$a+dOZ$_i_$_i`$_ia$_ib$_ic$_ie$_ig$_ih$_ip$_iv$_iw$_iz$_i}$_i!P$_i!S$_i!T$_i!U$_i!V$_i!W$_i!X$_i!Y$_i!Z$_i![$_i!]$_i!^$_i!_$_i!u$_i!z$_i#f$_i#r$_i#t$_i#u$_i#y$_i#z$_i$W$_i$Y$_i$`$_i$c$_i$e$_i$h$_i$l$_i$n$_i$s$_i$u$_i$w$_i$y$_i$|$_i%O$_i%w$_i%}$_i&P$_i&R$_i&X$_i&t$_i|$_i$q$_i~Og^Oh^O$h#sO&P!wO&RWO~O!P+hO~P:|O!P+iO~OZ`O_VO`VOaVObVOcVOeVOg^Oh^Op!POv{OwkOz!OO}cO!PvO!SyO!TyO!UyO!VyO!WyO!XyO!YyO!Z+nO![!`O!]yO!^yO!_yO!u}O!z|O#fpO#roO#tpO#upO#y!RO#z!QO$W!SO$Y!TO$`!UO$c!VO$e!XO$h!WO$l!YO$n!ZO$q+oO$s![O$u!]O$w!^O$y!_O$|!aO%O!bO%}TO&PRO&RQO&XUO&tdO~O|+mO~P#)QOW&QXY&QXZ&QXu&QX!P&QX&viX&v&QX~P?XOWUXYUXZUXuUX!PUX&vUX&v&]X~P>lOW#tOu#uO&v#vO~OW&UXY%XXu&UX!P%XX&v&UX~OZ#XX~P#.VOY+uO!P+sO~O%Q(hO%U(iOZ$}i_$}i`$}ia$}ib$}ic$}ie$}ig$}ih$}ip$}iv$}iw$}iz$}i}$}i!P$}i!S$}i!T$}i!U$}i!V$}i!W$}i!X$}i!Y$}i!Z$}i![$}i!]$}i!^$}i!_$}i!u$}i!z$}i#f$}i#r$}i#t$}i#u$}i#y$}i#z$}i$W$}i$Y$}i$`$}i$c$}i$e$}i$h$}i$l$}i$n$}i$s$}i$u$}i$w$}i$y$}i$|$}i%O$}i%w$}i%}$}i&P$}i&R$}i&X$}i&t$}i|$}i$a$}i$q$}i~OZ+xO~O%Q(hO%U(iOZ%Vi_%Vi`%Via%Vib%Vic%Vie%Vig%Vih%Vip%Viv%Viw%Viz%Vi}%Vi!P%Vi!S%Vi!T%Vi!U%Vi!V%Vi!W%Vi!X%Vi!Y%Vi!Z%Vi![%Vi!]%Vi!^%Vi!_%Vi!u%Vi!z%Vi#f%Vi#r%Vi#t%Vi#u%Vi#y%Vi#z%Vi$W%Vi$Y%Vi$`%Vi$c%Vi$e%Vi$h%Vi$l%Vi$n%Vi$s%Vi$u%Vi$w%Vi$y%Vi$|%Vi%O%Vi%w%Vi%}%Vi&P%Vi&R%Vi&X%Vi&t%Vi|%Vi$a%Vi$q%Vi~Ou#OO%}TO}&oa!P&oa!m&oa~O!P,OO~Oo(tOq!fa&^!fa~Oq(vO&^&ma~O!m%gO}&li!P&li~O|,XO~P]OW,ZO~P5xOW&UXu&UX#_&UX#a&UX#b&UX#d&UX#e&UX#f&UX#g&UX#h&UX#i&UX#k&UX#o&UX#r&UX&^&UX&_&UX&n&UX&v&UX~OZ#xO!P&UX~P#8^OW$gOZ#xO&v#vO~Op,]Ow,]O~Oq,^O}&rX!P&rX~O!b,`O#]#wOY&UXZ#XX~P#8^OY&SXq&SX|&SX!P&SX~P9oO})]O|&yP~P:|OY&SXg%[Xh%[X%}%[X&P%[X&R%[Xq&SX|&SX!P&SX~Oq,cOY&zX~OY,eO~O})fO|&kP~P:|Oq&jX!P&jX|&jXY&jX~P9oO&bTa~PC[Oo)oOp)oOqna&^na~Oq)pO&^&`a~OW,mO~Ow,nO~Ou#OO%}TO&P,rO&R,qO~Og^Oh^Ov#pO!u#rO&P!wO&RWO&t#oO~Og^Oh^Ov{O|,wO!u}O%}TO&P!wO&RWO&tdO~PFdOw-SO&PSO&R!qO&_#YO~Oq*lOY&ea!P&ea~O#_ma#ama#bma#dma#ema#fma#gma#hma#ima#kma#oma#rma&_ma#pmasma|ma~PEnO|-WO~P$wOZ#xO}'^Oq!|X|!|X!P!|X~Oq-[O|&sX!P&sX~O|-_O!P-^O~O&_!hO~P5VOg^Oh^Ov{O|-cO!P*}O!u}O!z|O%}TO&P!wO&RWO&_!hO&tdO~PFdOs-dO~P9oOs-dO~P:|O}'^OW&dqu&dq!P&dq#_&dq#a&dq#b&dq#d&dq#e&dq#f&dq#g&dq#h&dq#i&dq#k&dq#o&dq#r&dq&^&dq&_&dq&n&dq&v&dqY&dq#p&dqs&dqq&dq|&dq~O|-hO~P##nO!W-lO$O-lO&PSO&R!qO~O!P-oO~O$Z-pO&PSO&R!qO~O!b%vO#p-rOq!`X!P!`X~O!P-tO~P9oO!P-tO~P:|O!P-wO~P9oO|-yO~P#)QO![$aO#p-zO~O!P-|O~O!b-}O~OY.QOZ$lO_VO`VOaVObVOcVOeVOg^Oh^Op!POwkOz!OO%}TO&P(_O&R(^O&XUO~PFdOY.QO!P.RO~O%Q(hO%U(iOZ%Vq_%Vq`%Vqa%Vqb%Vqc%Vqe%Vqg%Vqh%Vqp%Vqv%Vqw%Vqz%Vq}%Vq!P%Vq!S%Vq!T%Vq!U%Vq!V%Vq!W%Vq!X%Vq!Y%Vq!Z%Vq![%Vq!]%Vq!^%Vq!_%Vq!u%Vq!z%Vq#f%Vq#r%Vq#t%Vq#u%Vq#y%Vq#z%Vq$W%Vq$Y%Vq$`%Vq$c%Vq$e%Vq$h%Vq$l%Vq$n%Vq$s%Vq$u%Vq$w%Vq$y%Vq$|%Vq%O%Vq%w%Vq%}%Vq&P%Vq&R%Vq&X%Vq&t%Vq|%Vq$a%Vq$q%Vq~Ou#OO%}TO}&oi!P&oi!m&oi~O&n&bOq!ga&^!ga~O!m%gO}&lq!P&lq~O|.^O~P]Op.`Ow&vOz&tO&PSO&R!qO&_#YO~O!P.aO~Oq,^O}&ra!P&ra~O})]O~P:|Oq.gO|&yX~O|.iO~Oq,cOY&za~Oq.mO|&kX~O|.oO~Ow.pO~Oq!aXu!aX!P!aX!b!aX%}!aX~OZ&QX~P#N{OZUX~P#N{O!P.qO~OZ.rO~OW^yZ#XXu^y!P^y!b^y#]^y#_^y#a^y#b^y#d^y#e^y#f^y#g^y#h^y#i^y#k^y#o^y#r^y&^^y&_^y&n^y&v^yY^y#p^ys^yq^y|^y~OY%`aq%`a!P%`a~P9oO!P#nyY#ny#p#nys#nyq#ny|#ny~P9oO}'^Oq!|a|!|a!P!|a~OZ#xO}'^Oq!|a|!|a!P!|a~O%}TO&P#SO&R#SOq%jX|%jX!P%jX~PFdOq-[O|&sa!P&sa~O|!}X~P$wO|/PO~Os/QO~P9oOW%jO!P/RO~OW%jO$Q/WO&PSO&R!qO!P&|P~OW%jO$U/XO~O!P/YO~O!b%vO#p/[Oq!`X!P!`X~OY/^O~O!P/_O~P9oO#p/`O~P9oO!b/bO~OY/cOZ$lO_VO`VOaVObVOcVOeVOg^Oh^Op!POwkOz!OO%}TO&P(_O&R(^O&XUO~PFdOW#[Ou&[X%}&[X&P&[X&R&[X'O&[X~O&_#YO~P$)QOu#OO%}TO'O/eO&P%SX&R%SX~O&n&bOq!gi&^!gi~Op/iO&PSO&R!qO~OW*iOZ#xO~O!P/kO~OY&SXq&SX~P9oO})]Oq%nX|%nX~P:|Oq.gO|&ya~O!b/nO~O})fOq%cX|%cX~P:|Oq.mO|&ka~OY/qO~O!P/rO~OZ/sO~O}'^Oq!|i|!|i!P!|i~O|!}a~P$wOW%jO!P/wO~OW%jOq/xO!P&|X~OY/|O~P9oOY0OO~OY%Xq!P%Xq~P9oO'O/eO&P%Sa&R%Sa~OY0TO~O!P0WO~Ou#OO!P0YO!Z0ZO%}TO~OY0[O~Oq/xO!P&|a~O!P0_O~OW%jOq/xO!P&}X~OY0aO~P9oOY0bO~OY%Xy!P%Xy~P9oOu#OO%}TO&P%ua&R%ua'O%ua~OY0cO~O!P0dO~Ou#OO!P0eO!Z0fO%}TO~OW%jOq%ra!P%ra~Oq/xO!P&}a~O!P0jO~Ou#OO!P0jO!Z0kO%}TO~O!P0lO~O!P0nO~O#p&QXY&QXs&QXq&QX|&QX~P&bO#pUXYUXsUXqUX|UX~P(iO`Q_P#g&Xc~",
  goto: "#+S'OPPPP'P'd*x.OP'dPP.d.h0PPPPPP1nP3ZPP4v7l:[<z=d?[PPP?bPA{PPPBu3ZPDqPPElPFcFkPPPPPPPPPPPPGvH_PKjKrLOLjLpLvNiNmNmNuP! U!!^!#R!#]P!#r!!^P!#x!$S!!y!$cP!%S!%^!%d!!^!%g!%mFcFc!%q!%{!&O3Z!'m3Z3Z!)iP.hP!)mPP!*_PPPPPP.hP.h!+O.hPP.hP.hPP.h!,g!,qPP!,w!-QPPPPPPPP'PP'PPP!-U!-U!-i!-UPP!-UP!-UP!.S!.VP!-U!.m!-UP!-UP!.p!.sP!-UP!-UP!-UP!-UP!-U!-UP!-UP!.wP!.}!/Q!/WP!-U!/d!/gP!/o!0R!4T!4Z!4a!5g!5m!5{!7R!7X!7_!7i!7o!7u!7{!8R!8X!8_!8e!8k!8q!8w!8}!9T!9_!9e!9o!9uPPP!9{!-U!:pP!>WP!?[P!Ap!BW!E]3ZPPP!F|!Jm!MaPP#!P#!SP#$`#$f#&V#&f#&n#'p#(Y#)T#)^#)a#)oP#)r#*OP#*V#*^P#*aP#*lP#*o#*r#*u#*y#+PstOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,Y'urOPXY`acopx!Y![!_!a!e!f!h!i!o!x#P#T#Y#[#_#`#e#i#l#n#u#w#x#|#}$O$P$Q$R$S$T$U$V$Y$Z$[$]$_$e$l$m$n$o$p$q%O%S%V%Z%^%_%b%d%g%k%u%v%{%|&R&S&[&]&`&b&d&i'X'^'_'`'e'h'i'm'n'p'{'|(O(T(U(`(l(t(v({(})O)Q)R)])f)o)p*P*T*W*l*o*p*q*z*{+O+T+d+f+h+i+l+o+r+s+x+},W,Y,^,`,u-[-^-a-r-t-}.R.V.g.m/O/[/_/b/d/n/q0R0X0Z0[0f0h0k0r#xhO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%d%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o,Y,`-r-t-}.g.m/[/_/b/n0Z0f0kt!sT!Q!S!T!{!}$k%p+]+^+_+`-k-m/W/X/x0oQ#mdS&Y#`(}Q&l#oU&q#t$g,ZQ&x#vW(b%O+s.R/dU)Y%j'v+bQ)Z%kS)u&S,WU*f&s-R._Q*k&yQ,t*TQ-P*iQ.j,cR.t,uu!sT!Q!S!T!{!}$k%p+]+^+_+`-k-m/W/X/x0oT%l!r)l#{qO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o,Y,`-r-t-}.g.m/[/_/b/n0Z0f0k#zlO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o,Y,`-r-t-}.g.m/[/_/b/n0Z0f0kX(c%O+s.R/d$TVO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%O%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o+s,Y,`-r-t-}.R.g.m/[/_/b/d/n0Z0f0k$TkO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%O%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o+s,Y,`-r-t-}.R.g.m/[/_/b/d/n0Z0f0k&O[OPX`ceopx!O!Y![!_!a!g!i!o#Y#_#b#e#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Y$Z$[$_$f$l$m$n$o$p$q%O%_%b%d%g%k%v%{&]&b&d&i&t'^'_'`'h'i'm'{'}(O(T(U(d(t)O)Q)R)])f)o)p*P*U*W*l*o*q*{*|+O+T+d+h+i+l+o+s,Y,^,`-^-r-t-}.R.g.m/O/[/_/b/d/n0Z0f0k0rQ&Q#[Q)s&RV.T+x.X/e&O[OPX`ceopx!O!Y![!_!a!g!i!o#Y#_#b#e#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Y$Z$[$_$f$l$m$n$o$p$q%O%_%b%d%g%k%v%{&]&b&d&i&t'^'_'`'h'i'm'{'}(O(T(U(d(t)O)Q)R)])f)o)p*P*U*W*l*o*q*{*|+O+T+d+h+i+l+o+s,Y,^,`-^-r-t-}.R.g.m/O/[/_/b/d/n0Z0f0k0rV.T+x.X/e&O]OPX`ceopx!O!Y![!_!a!g!i!o#Y#_#b#e#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Y$Z$[$_$f$l$m$n$o$p$q%O%_%b%d%g%k%v%{&]&b&d&i&t'^'_'`'h'i'm'{'}(O(T(U(d(t)O)Q)R)])f)o)p*P*U*W*l*o*q*{*|+O+T+d+h+i+l+o+s,Y,^,`-^-r-t-}.R.g.m/O/[/_/b/d/n0Z0f0k0rV.U+x.X/eS#Z[.TS$f!O&tS&s#t$gQ&y#vQ)V%dQ-R*iR._,Z$kZO`copx!Y![!_!a#Y#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Y$Z$_$l$m$n$o$p$q%O%d%g%k%v&b&d'_'`'i'm(O(T(U(t)Q)R)])f)o)p*P*l*o+T+d+h+i+l+o+s,Y,^,`-r-t-}.R.g.m/[/_/b/d/n0Z0f0kQ&O#YR,k)p&P_OPX`ceopx!Y![!_!a!g!i!o#Y#_#b#e#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Y$Z$[$_$l$m$n$o$p$q%O%_%b%d%g%k%v%{&]&b&d&i'^'_'`'h'i'm'{'}(O(T(U(d(t)O)Q)R)])f)o)p*P*U*W*l*o*q*{*|+O+T+d+h+i+l+o+s+x,Y,^,`-^-r-t-}.R.X.g.m/O/[/_/b/d/e/n0Z0f0k0r!o#QY!e!x#R#T#`#n$]%R%S%V%^%u%|&S&[&`'X'|(`(l({(}*T*p*z+f+r+},W,u-a.V/q0R0X0[0h$SkO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%O%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o+s,Y,`-r-t-}.R.g.m/[/_/b/d/n0Z0f0kQ$m!UQ$n!VQ$s!ZQ$|!`R+p(WQ#yiS'q$e*hQ*e&rQ+X'rS,[)T)UQ-O*gQ-Y*vQ.b,]Q.x-QQ.{-ZQ/j.`Q/u.yR0V/iQ'a$bW*[&m'b'c'dQ+W'qU,x*]*^*_Q-X*vQ-f+XS.u,y,zS.z-Y-ZQ/t.vR/v.{]!mP!o'^*q-^/OreOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,Y[!gP!o'^*q-^/OW#b`#e%b&]Q'}$oW(d%O+s.R/dS*U&i*WS*w'e-[S*|'h+OR.X+xh#VY!W!e#n#s%V'|*T*z+f,u-aQ)j%wQ)v&WR,o)y#xnOcopx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o,Y,`-r-t-}.g.m/[/_/b/n0Z0f0k^!kP!g!o'^*q-^/Ov#TY!W#`#n#s%w&W&[&`'|(`(})y*T+f+r,u.W/hQ#g`Q$b{Q$c|Q$d}W%S!e%V*z-aS%Y!h(vQ%`!iQ&m#pQ&n#qQ&o#rQ(u%ZS(y%^({Q*R&eS*v'e-[R-Z*wU)h%v)f.mR+V'p[!mP!o'^*q-^/OT*}'h+O^!iP!g!o'^*q-^/OQ'd$bQ'l$dQ*_&mQ*d&oV*{'h*|+OQ%[!hR,S(vQ(s%YR,R(u#znO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o,Y,`-r-t-}.g.m/[/_/b/n0Z0f0kQ%c!kS(l%S(yR(|%`T#e`%bU#c`#e%bR)z&]Q%f!lQ(n%UQ(r%XQ,U(zR.],VrvOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,Y[!mP!o'^*q-^/OQ%P!bQ%a!jQ%i!pQ'[$ZQ([$|Q(k%QQ(p%WQ+z(iR.Y+yrtOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,Y[!mP!o'^*q-^/OS*V&i*WT*}'h+OQ'c$bS*^&m'dR,z*_Q'b$bQ'g$cU*]&m'c'dQ*a&nS,y*^*_R.v,zQ*u'`R+Q'iQ'k$dS*c&o'lR,}*dQ'j$dU*b&o'k'lS,|*c*dR.w,}rtOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,Y[!mP!o'^*q-^/OT*}'h+OQ'f$cS*`&n'gR,{*aQ*x'eR.|-[R-`*yQ&j#mR*Z&lT*V&i*WQ%e!lS(q%X%fR,P(rR)R%dWk%O+s.R/d#{lO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o,Y,`-r-t-}.g.m/[/_/b/n0Z0f0k$SiO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%O%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o+s,Y,`-r-t-}.R.g.m/[/_/b/d/n0Z0f0kU&r#t$g,ZS*g&s._Q-Q*iR.y-RT'o$e'p!_#|m#a$r$z$}&w&z&{'O'P'Q'R'S'W'Z)[)g+S+g+j-T-V-e-v-{.e/Z/a/}0Q!]$Pm#a$r$z$}&w&z&{'O'P'R'S'W'Z)[)g+S+g+j-T-V-e-v-{.e/Z/a/}0Q#{nO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o,Y,`-r-t-}.g.m/[/_/b/n0Z0f0ka)^%k)],`.g/n0Z0f0kQ)`%kR.k,cQ't$hQ)b%oR,f)cT+Y's+ZsvOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,YruOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,YQ$w!]R$y!^R$p!XrvOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,YR(O$oR$q!XR(V$sT+k(U+lX(f%P(g(k+{R+y(hQ.W+xR/h.XQ(j%PQ+w(gQ+|(kR.Z+{R%Q!bQ(e%OV.P+s.R/dQxOQ#lcW$`x#l)Q,YQ)Q%dR,Y)RrXOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,Yn!fP!o#e&]&i'^'e'h*W*q+O+x-[-^/Ol!zX!f#P#_#i$[%Z%_%{&R'n'{)O0r!j#PY!e!x#T#`#n$]%S%V%^%u%|&S&[&`'X'|(`(l({(}*T*p*z+f+r+},W,u-a.V/q0R0X0[0hQ#_`Q#ia#d$[op!Y!_!a#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$l%g%k%v&b&d'_'`'i'm(O(T(t)])f)o*P*l*o+T+h+i+o,^,`-r-t-}.g.m/[/_/b/n0Z0f0kS%Z!h(vS%_!i*{S%{#Y)pQ&R#[S'n$e'pY'{$o%O+s.R/dQ)O%bR0r$YQ!uUR%m!uQ)q&OR,l)q^#RY#`$]'X'|(`*px%R!e!x#n%V%^%|&S&[&`({(}*T*z+f+r,W,u-a.V0R[%t#R%R%u+}0X0hS%u#T%SQ+}(lQ0X/qR0h0[Q*m&{R-U*mQ!oPU%h!o*q/OQ*q'^R/O-^!pbOP`cx![!o#e#l$_$m$n$o$p$q%O%b%d&]&i'^'e'h(U)Q)R*W*q+O+d+l+s+x,Y-[-^.R/O/dY!yX!f#_'{)OT#jb!yQ.n,gR/p.nQ%x#VR)k%xQ&c#fS*O&c.[R.[,QQ(w%[R,T(wQ&^#cR){&^Q,_)WR.d,_Q+O'hR-b+OQ-]*xR.}-]Q*W&iR,v*WQ'p$eR+U'pQ&f#gR*S&fQ.h,aR/m.hQ,d)`R.l,dQ+Z'sR-g+ZQ-k+]R/T-kQ/y/US0^/y0`R0`/{Q+l(UR-x+lQ(g%PS+v(g+{R+{(kQ/f.VR0S/fQ+t(eR.S+t`wOcx#l%d)Q)R,YQ$t![Q']$_Q'y$mQ'z$nQ(Q$pQ(R$qS+k(U+lR-q+d'dsOPXY`acopx!Y![!_!a!e!f!h!i!o!x#P#T#Y#[#_#`#e#i#l#n#u#w#x#|#}$O$P$Q$R$S$T$U$V$Y$Z$[$]$_$e$l$m$n$o$p$q%O%S%V%Z%^%_%b%d%g%u%v%{%|&R&S&[&]&`&b&d&i'X'^'_'`'e'h'i'm'n'p'{'|(O(T(U(`(l(t(v({(})O)Q)R)f)o)p*P*T*W*l*o*p*q*z*{+O+T+d+f+h+i+l+o+r+s+x+},W,Y,^,u-[-^-a-r-t-}.R.V.m/O/[/_/b/d/q0R0X0[0h0ra)_%k)],`.g/n0Z0f0kQ!rTQ$h!QQ$i!SQ$j!TQ%o!{Q%q!}Q'x$kQ)c%pQ)l0oS-i+]+_Q-m+^Q-n+`Q/S-kS/U-m/WQ/{/XR0]/x%uSOT`cdopx!Q!S!T!Y![!_!a!{!}#`#l#o#t#u#v#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$g$k$l$m$n$o$p$q%O%d%j%k%p%v&S&d&s&y'm'v(O(T(U(})Q)R)])f*P*T*i*l*o+T+]+^+_+`+b+d+h+i+l+o+s,W,Y,Z,`,c,u-R-k-m-r-t-}.R._.g.m/W/X/[/_/b/d/n/x0Z0f0k0oQ)a%kQ,a)]S.f,`/nQ/l.gQ0g0ZQ0i0fR0m0krmOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,YS#a`$lQ$WoQ$^pQ$r!YQ$z!_Q$}!aQ&w#uQ&z#wY&{#x$o+h-t/_Q&}#|Q'O#}Q'P$OQ'Q$PQ'R$QQ'S$RQ'T$SQ'U$TQ'V$UQ'W$VQ'Z$Z^)[%k)].g/n0Z0f0kU)g%v)f.mQ*Q&dQ+S'mQ+g(OQ+j(TQ,p*PQ-T*lQ-V*oQ-e+TQ-v+iQ-{+oQ.e,`Q/Z-rQ/a-}Q/}/[R0Q/b#xgO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o,Y,`-r-t-}.g.m/[/_/b/n0Z0f0kW(a%O+s.R/dR)S%drYOcx![#l$_$m$n$p$q%d(U)Q)R+d+l,Y[!eP!o'^*q-^/OW!xX$[%{'{Q#``Q#ne#S$]op!Y!_!a#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$l%k%v&d'm(O(T)])f*P*l*o+T+h+i+o,`-r-t-}.g.m/[/_/b/n0Z0f0kQ%V!gS%^!i*{d%|#Y%g&b'_'`'i(t)o)p,^Q&S#_Q&[#bS&`#e&]Q'X$YQ'|$oW(`%O+s.R/dQ({%_Q(}%bS*T&i*WQ*p0rS*z'h+OQ+f'}Q+r(dQ,W)OQ,u*UQ-a*|S.V+x.XR0R/e&O_OPX`ceopx!Y![!_!a!g!i!o#Y#_#b#e#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Y$Z$[$_$l$m$n$o$p$q%O%_%b%d%g%k%v%{&]&b&d&i'^'_'`'h'i'm'{'}(O(T(U(d(t)O)Q)R)])f)o)p*P*U*W*l*o*q*{*|+O+T+d+h+i+l+o+s+x,Y,^,`-^-r-t-}.R.X.g.m/O/[/_/b/d/e/n0Z0f0k0rQ$e!OQ'r$fR*h&t&ZWOPX`ceopx!O!Y![!_!a!g!i!o#Y#[#_#b#e#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Y$Z$[$_$f$l$m$n$o$p$q%O%_%b%d%g%k%v%{&R&]&b&d&i&t'^'_'`'h'i'm'{'}(O(T(U(d(t)O)Q)R)])f)o)p*P*U*W*l*o*q*{*|+O+T+d+h+i+l+o+s+x,Y,^,`-^-r-t-}.R.X.g.m/O/[/_/b/d/e/n0Z0f0k0rR&P#Y$QjOcopx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%O%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o+s,Y,`-r-t-}.R.g.m/[/_/b/d/n0Z0f0kQ#f`Q&O#YQ'Y$YU)W%g'`'iQ)}&bQ*s'_Q,Q(tQ,j)oQ,k)pR.c,^Q)n%}R,i)m$SfO`copx!Y![!_!a#l#u#w#x#|#}$O$P$Q$R$S$T$U$V$Z$_$l$m$n$o$p$q%O%d%k%v&d'm(O(T(U)Q)R)])f*P*l*o+T+d+h+i+l+o+s,Y,`-r-t-}.R.g.m/[/_/b/d/n0Z0f0kT&p#t,ZQ&|#xQ(P$oQ-u+hQ/]-tR0P/_]!nP!o'^*q-^/O#PaOPX`bcx![!f!o!y#_#e#l$_$m$n$o$p$q%O%b%d&]&i'^'e'h'{(U)O)Q)R*W*q+O+d+l+s+x,Y-[-^.R/O/dU#WY!W'|Q%T!eU&k#n#s+fQ(o%VS,s*T*zT.s,u-aj#UY!W!e#n#s%V%w&W)y*T*z,u-aU&V#`&`(}Q)x&[Q+e'|Q+q(`Q-s+fQ.O+rQ/g.WR0U/hQ)i%vQ,g)fR/o.mR,h)f`!jP!o'^'h*q+O-^/OT%W!g*|R%]!hW%U!e%V*z-aQ(z%^R,V({S#d`%bR&a#eQ)X%gT*t'`'iR*y'e[!lP!o'^*q-^/OR%X!gR#h`R,b)]R)a%kT-j+]-kQ/V-mR/z/WR/z/X",
  nodeNames: "⚠ LineComment BlockComment Program ModuleDeclaration MarkerAnnotation Identifier ScopedIdentifier . Annotation ) ( AnnotationArgumentList AssignmentExpression FieldAccess IntegerLiteral FloatingPointLiteral BooleanLiteral CharacterLiteral StringLiteral TextBlock null ClassLiteral void PrimitiveType TypeName ScopedTypeName GenericType TypeArguments AnnotatedType Wildcard extends super , ArrayType ] Dimension [ class this ParenthesizedExpression ObjectCreationExpression new ArgumentList } { ClassBody ; FieldDeclaration Modifiers public protected private abstract static final strictfp default synchronized native transient volatile VariableDeclarator Definition AssignOp ArrayInitializer MethodDeclaration TypeParameters TypeParameter TypeBound FormalParameters ReceiverParameter FormalParameter SpreadParameter Throws throws Block ClassDeclaration Superclass SuperInterfaces implements InterfaceTypeList InterfaceDeclaration interface ExtendsInterfaces InterfaceBody ConstantDeclaration EnumDeclaration enum EnumBody EnumConstant EnumBodyDeclarations AnnotationTypeDeclaration AnnotationTypeBody AnnotationTypeElementDeclaration StaticInitializer ConstructorDeclaration ConstructorBody ExplicitConstructorInvocation ArrayAccess MethodInvocation MethodName MethodReference ArrayCreationExpression Dimension AssignOp BinaryExpression CompareOp CompareOp LogicOp LogicOp BitOp BitOp BitOp ArithOp ArithOp ArithOp BitOp InstanceofExpression instanceof LambdaExpression InferredParameters TernaryExpression LogicOp : UpdateExpression UpdateOp UnaryExpression LogicOp BitOp CastExpression ElementValueArrayInitializer ElementValuePair open module ModuleBody ModuleDirective requires transitive exports to opens uses provides with PackageDeclaration package ImportDeclaration import Asterisk ExpressionStatement LabeledStatement Label IfStatement if else WhileStatement while ForStatement for ForSpec LocalVariableDeclaration var EnhancedForStatement ForSpec AssertStatement assert SwitchStatement switch SwitchBlock SwitchLabel case DoStatement do BreakStatement break ContinueStatement continue ReturnStatement return SynchronizedStatement ThrowStatement throw TryStatement try CatchClause catch CatchFormalParameter CatchType FinallyClause finally TryWithResourcesStatement ResourceSpecification Resource ClassContent",
  maxTerm: 276,
  nodeProps: [
    ["isolate", -4, 1, 2, 18, 19, ""],
    ["group", -26, 4, 47, 76, 77, 82, 87, 92, 145, 147, 150, 151, 153, 156, 158, 161, 163, 165, 167, 172, 174, 176, 178, 180, 181, 183, 191, "Statement", -25, 6, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 39, 40, 41, 99, 100, 102, 103, 106, 118, 120, 122, 125, 127, 130, "Expression", -7, 23, 24, 25, 26, 27, 29, 34, "Type"],
    ["openedBy", 10, "(", 44, "{"],
    ["closedBy", 11, ")", 45, "}"]
  ],
  propSources: [u5],
  skippedNodes: [0, 1, 2],
  repeatNodeCount: 28,
  tokenData: "#$f_R!_OX%QXY'fYZ)bZ^'f^p%Qpq'fqr*|rs,^st%Qtu4euv5qvw7Rwx8ixyAQyzAnz{B[{|CQ|}Dh}!OEU!O!PFo!P!Q! i!Q!R!,_!R![!0V![!]!>g!]!^!?w!^!_!@e!_!`!BO!`!a!Br!a!b!D`!b!c!EO!c!}!Kz!}#O!MW#O#P%Q#P#Q!Mt#Q#R!Nb#R#S4e#S#T%Q#T#o4e#o#p# U#p#q# r#q#r##[#r#s##x#s#y%Q#y#z'f#z$f%Q$f$g'f$g#BY%Q#BY#BZ'f#BZ$IS%Q$IS$I_'f$I_$I|%Q$I|$JO'f$JO$JT%Q$JT$JU'f$JU$KV%Q$KV$KW'f$KW&FU%Q&FU&FV'f&FV;'S%Q;'S;=`&s<%lO%QS%VV&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QS%qO&YSS%tVOY&ZYZ%lZr&Zrs&ys;'S&Z;'S;=`'`<%lO&ZS&^VOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QS&vP;=`<%l%QS&|UOY&ZYZ%lZr&Zs;'S&Z;'S;=`'`<%lO&ZS'cP;=`<%l&Z_'mk&YS%yZOX%QXY'fYZ)bZ^'f^p%Qpq'fqr%Qrs%qs#y%Q#y#z'f#z$f%Q$f$g'f$g#BY%Q#BY#BZ'f#BZ$IS%Q$IS$I_'f$I_$I|%Q$I|$JO'f$JO$JT%Q$JT$JU'f$JU$KV%Q$KV$KW'f$KW&FU%Q&FU&FV'f&FV;'S%Q;'S;=`&s<%lO%Q_)iY&YS%yZX^*Xpq*X#y#z*X$f$g*X#BY#BZ*X$IS$I_*X$I|$JO*X$JT$JU*X$KV$KW*X&FU&FV*XZ*^Y%yZX^*Xpq*X#y#z*X$f$g*X#BY#BZ*X$IS$I_*X$I|$JO*X$JT$JU*X$KV$KW*X&FU&FV*XV+TX#tP&YSOY%QYZ%lZr%Qrs%qs!_%Q!_!`+p!`;'S%Q;'S;=`&s<%lO%QU+wV#_Q&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QT,aXOY,|YZ%lZr,|rs3Ys#O,|#O#P2d#P;'S,|;'S;=`3S<%lO,|T-PXOY-lYZ%lZr-lrs.^s#O-l#O#P.x#P;'S-l;'S;=`2|<%lO-lT-qX&YSOY-lYZ%lZr-lrs.^s#O-l#O#P.x#P;'S-l;'S;=`2|<%lO-lT.cVcPOY&ZYZ%lZr&Zrs&ys;'S&Z;'S;=`'`<%lO&ZT.}V&YSOY-lYZ/dZr-lrs1]s;'S-l;'S;=`2|<%lO-lT/iW&YSOY0RZr0Rrs0ns#O0R#O#P0s#P;'S0R;'S;=`1V<%lO0RP0UWOY0RZr0Rrs0ns#O0R#O#P0s#P;'S0R;'S;=`1V<%lO0RP0sOcPP0vTOY0RYZ0RZ;'S0R;'S;=`1V<%lO0RP1YP;=`<%l0RT1`XOY,|YZ%lZr,|rs1{s#O,|#O#P2d#P;'S,|;'S;=`3S<%lO,|T2QUcPOY&ZYZ%lZr&Zs;'S&Z;'S;=`'`<%lO&ZT2gVOY-lYZ/dZr-lrs1]s;'S-l;'S;=`2|<%lO-lT3PP;=`<%l-lT3VP;=`<%l,|T3_VcPOY&ZYZ%lZr&Zrs3ts;'S&Z;'S;=`'`<%lO&ZT3yR&WSXY4SYZ4`pq4SP4VRXY4SYZ4`pq4SP4eO&XP_4la&PZ&YSOY%QYZ%lZr%Qrs%qst%Qtu4eu!Q%Q!Q![4e![!c%Q!c!}4e!}#R%Q#R#S4e#S#T%Q#T#o4e#o;'S%Q;'S;=`&s<%lO%QU5xX#hQ&YSOY%QYZ%lZr%Qrs%qs!_%Q!_!`6e!`;'S%Q;'S;=`&s<%lO%QU6lV#]Q&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QV7YZ&nR&YSOY%QYZ%lZr%Qrs%qsv%Qvw7{w!_%Q!_!`6e!`;'S%Q;'S;=`&s<%lO%QU8SV#aQ&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QT8nZ&YSOY9aYZ%lZr9ars:osw9awx%Qx#O9a#O#P;y#P;'S9a;'S;=`@z<%lO9aT9fX&YSOY%QYZ%lZr%Qrs%qsw%Qwx:Rx;'S%Q;'S;=`&s<%lO%QT:YVbP&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QT:rXOY&ZYZ%lZr&Zrs&ysw&Zwx;_x;'S&Z;'S;=`'`<%lO&ZT;dVbPOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QT<OZ&YSOY<qYZ%lZr<qrs=isw<qwx9ax#O<q#O#P9a#P;'S<q;'S;=`?T<%lO<qT<vZ&YSOY<qYZ%lZr<qrs=isw<qwx:Rx#O<q#O#P%Q#P;'S<q;'S;=`?T<%lO<qT=lZOY>_YZ%lZr>_rs?Zsw>_wx;_x#O>_#O#P&Z#P;'S>_;'S;=`@t<%lO>_T>bZOY<qYZ%lZr<qrs=isw<qwx:Rx#O<q#O#P%Q#P;'S<q;'S;=`?T<%lO<qT?WP;=`<%l<qT?^ZOY>_YZ%lZr>_rs@Psw>_wx;_x#O>_#O#P&Z#P;'S>_;'S;=`@t<%lO>_P@SVOY@PZw@Pwx@ix#O@P#P;'S@P;'S;=`@n<%lO@PP@nObPP@qP;=`<%l@PT@wP;=`<%l>_T@}P;=`<%l9a_AXVZZ&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QVAuVYR&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QVBeX$ZP&YS#gQOY%QYZ%lZr%Qrs%qs!_%Q!_!`6e!`;'S%Q;'S;=`&s<%lO%QVCXZ#fR&YSOY%QYZ%lZr%Qrs%qs{%Q{|Cz|!_%Q!_!`6e!`;'S%Q;'S;=`&s<%lO%QVDRV#rR&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QVDoVqR&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QVE][#fR&YSOY%QYZ%lZr%Qrs%qs}%Q}!OCz!O!_%Q!_!`6e!`!aFR!a;'S%Q;'S;=`&s<%lO%QVFYV&xR&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%Q_FvZWY&YSOY%QYZ%lZr%Qrs%qs!O%Q!O!PGi!P!Q%Q!Q![Hw![;'S%Q;'S;=`&s<%lO%QVGnX&YSOY%QYZ%lZr%Qrs%qs!O%Q!O!PHZ!P;'S%Q;'S;=`&s<%lO%QVHbV&qR&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QTIOc&YS`POY%QYZ%lZr%Qrs%qs!Q%Q!Q![Hw![!f%Q!f!gJZ!g!hJw!h!iJZ!i#R%Q#R#SNq#S#W%Q#W#XJZ#X#YJw#Y#ZJZ#Z;'S%Q;'S;=`&s<%lO%QTJbV&YS`POY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QTJ|]&YSOY%QYZ%lZr%Qrs%qs{%Q{|Ku|}%Q}!OKu!O!Q%Q!Q![Lg![;'S%Q;'S;=`&s<%lO%QTKzX&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q![Lg![;'S%Q;'S;=`&s<%lO%QTLnc&YS`POY%QYZ%lZr%Qrs%qs!Q%Q!Q![Lg![!f%Q!f!gJZ!g!h%Q!h!iJZ!i#R%Q#R#SMy#S#W%Q#W#XJZ#X#Y%Q#Y#ZJZ#Z;'S%Q;'S;=`&s<%lO%QTNOZ&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q![Lg![#R%Q#R#SMy#S;'S%Q;'S;=`&s<%lO%QTNvZ&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q![Hw![#R%Q#R#SNq#S;'S%Q;'S;=`&s<%lO%Q_! p]&YS#gQOY%QYZ%lZr%Qrs%qsz%Qz{!!i{!P%Q!P!Q!)[!Q!_%Q!_!`6e!`;'S%Q;'S;=`&s<%lO%Q_!!nX&YSOY!!iYZ!#ZZr!!irs!$vsz!!iz{!&U{;'S!!i;'S;=`!'j<%lO!!i_!#`T&YSOz!#oz{!$R{;'S!#o;'S;=`!$p<%lO!#oZ!#rTOz!#oz{!$R{;'S!#o;'S;=`!$p<%lO!#oZ!$UVOz!#oz{!$R{!P!#o!P!Q!$k!Q;'S!#o;'S;=`!$p<%lO!#oZ!$pOQZZ!$sP;=`<%l!#o_!$yXOY!%fYZ!#ZZr!%frs!'psz!%fz{!(`{;'S!%f;'S;=`!)U<%lO!%f_!%iXOY!!iYZ!#ZZr!!irs!$vsz!!iz{!&U{;'S!!i;'S;=`!'j<%lO!!i_!&ZZ&YSOY!!iYZ!#ZZr!!irs!$vsz!!iz{!&U{!P!!i!P!Q!&|!Q;'S!!i;'S;=`!'j<%lO!!i_!'TV&YSQZOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%Q_!'mP;=`<%l!!i_!'sXOY!%fYZ!#ZZr!%frs!#osz!%fz{!(`{;'S!%f;'S;=`!)U<%lO!%f_!(cZOY!!iYZ!#ZZr!!irs!$vsz!!iz{!&U{!P!!i!P!Q!&|!Q;'S!!i;'S;=`!'j<%lO!!i_!)XP;=`<%l!%f_!)cV&YSPZOY!)[YZ%lZr!)[rs!)xs;'S!)[;'S;=`!+O<%lO!)[_!)}VPZOY!*dYZ%lZr!*drs!+Us;'S!*d;'S;=`!,X<%lO!*d_!*iVPZOY!)[YZ%lZr!)[rs!)xs;'S!)[;'S;=`!+O<%lO!)[_!+RP;=`<%l!)[_!+ZVPZOY!*dYZ%lZr!*drs!+ps;'S!*d;'S;=`!,X<%lO!*dZ!+uSPZOY!+pZ;'S!+p;'S;=`!,R<%lO!+pZ!,UP;=`<%l!+p_!,[P;=`<%l!*dT!,fu&YS_POY%QYZ%lZr%Qrs%qs!O%Q!O!P!.y!P!Q%Q!Q![!0V![!d%Q!d!e!3a!e!f%Q!f!gJZ!g!hJw!h!iJZ!i!n%Q!n!o!1{!o!q%Q!q!r!5_!r!z%Q!z!{!7V!{#R%Q#R#S!2i#S#U%Q#U#V!3a#V#W%Q#W#XJZ#X#YJw#Y#ZJZ#Z#`%Q#`#a!1{#a#c%Q#c#d!5_#d#l%Q#l#m!7V#m;'S%Q;'S;=`&s<%lO%QT!/Qa&YS`POY%QYZ%lZr%Qrs%qs!Q%Q!Q![Hw![!f%Q!f!gJZ!g!hJw!h!iJZ!i#W%Q#W#XJZ#X#YJw#Y#ZJZ#Z;'S%Q;'S;=`&s<%lO%QT!0^i&YS_POY%QYZ%lZr%Qrs%qs!O%Q!O!P!.y!P!Q%Q!Q![!0V![!f%Q!f!gJZ!g!hJw!h!iJZ!i!n%Q!n!o!1{!o#R%Q#R#S!2i#S#W%Q#W#XJZ#X#YJw#Y#ZJZ#Z#`%Q#`#a!1{#a;'S%Q;'S;=`&s<%lO%QT!2SV&YS_POY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QT!2nZ&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q![!0V![#R%Q#R#S!2i#S;'S%Q;'S;=`&s<%lO%QT!3fY&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q!R!4U!R!S!4U!S;'S%Q;'S;=`&s<%lO%QT!4]`&YS_POY%QYZ%lZr%Qrs%qs!Q%Q!Q!R!4U!R!S!4U!S!n%Q!n!o!1{!o#R%Q#R#S!3a#S#`%Q#`#a!1{#a;'S%Q;'S;=`&s<%lO%QT!5dX&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q!Y!6P!Y;'S%Q;'S;=`&s<%lO%QT!6W_&YS_POY%QYZ%lZr%Qrs%qs!Q%Q!Q!Y!6P!Y!n%Q!n!o!1{!o#R%Q#R#S!5_#S#`%Q#`#a!1{#a;'S%Q;'S;=`&s<%lO%QT!7[_&YSOY%QYZ%lZr%Qrs%qs!O%Q!O!P!8Z!P!Q%Q!Q![!:i![!c%Q!c!i!:i!i#T%Q#T#Z!:i#Z;'S%Q;'S;=`&s<%lO%QT!8`]&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q![!9X![!c%Q!c!i!9X!i#T%Q#T#Z!9X#Z;'S%Q;'S;=`&s<%lO%QT!9^c&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q![!9X![!c%Q!c!i!9X!i!r%Q!r!sJw!s#R%Q#R#S!8Z#S#T%Q#T#Z!9X#Z#d%Q#d#eJw#e;'S%Q;'S;=`&s<%lO%QT!:pi&YS_POY%QYZ%lZr%Qrs%qs!O%Q!O!P!<_!P!Q%Q!Q![!:i![!c%Q!c!i!:i!i!n%Q!n!o!1{!o!r%Q!r!sJw!s#R%Q#R#S!=i#S#T%Q#T#Z!:i#Z#`%Q#`#a!1{#a#d%Q#d#eJw#e;'S%Q;'S;=`&s<%lO%QT!<da&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q![!9X![!c%Q!c!i!9X!i!r%Q!r!sJw!s#T%Q#T#Z!9X#Z#d%Q#d#eJw#e;'S%Q;'S;=`&s<%lO%QT!=n]&YSOY%QYZ%lZr%Qrs%qs!Q%Q!Q![!:i![!c%Q!c!i!:i!i#T%Q#T#Z!:i#Z;'S%Q;'S;=`&s<%lO%QV!>nX#pR&YSOY%QYZ%lZr%Qrs%qs![%Q![!]!?Z!];'S%Q;'S;=`&s<%lO%QV!?bV&vR&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QV!@OV!PR&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%Q_!@lY&_Z&YSOY%QYZ%lZr%Qrs%qs!^%Q!^!_!A[!_!`+p!`;'S%Q;'S;=`&s<%lO%QU!AcX#iQ&YSOY%QYZ%lZr%Qrs%qs!_%Q!_!`6e!`;'S%Q;'S;=`&s<%lO%QV!BVX!bR&YSOY%QYZ%lZr%Qrs%qs!_%Q!_!`+p!`;'S%Q;'S;=`&s<%lO%QV!ByY&^R&YSOY%QYZ%lZr%Qrs%qs!_%Q!_!`+p!`!a!Ci!a;'S%Q;'S;=`&s<%lO%QU!CpY#iQ&YSOY%QYZ%lZr%Qrs%qs!_%Q!_!`6e!`!a!A[!a;'S%Q;'S;=`&s<%lO%Q_!DiV&bX#oQ&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%Q_!EVX%}Z&YSOY%QYZ%lZr%Qrs%qs#]%Q#]#^!Er#^;'S%Q;'S;=`&s<%lO%QV!EwX&YSOY%QYZ%lZr%Qrs%qs#b%Q#b#c!Fd#c;'S%Q;'S;=`&s<%lO%QV!FiX&YSOY%QYZ%lZr%Qrs%qs#h%Q#h#i!GU#i;'S%Q;'S;=`&s<%lO%QV!GZX&YSOY%QYZ%lZr%Qrs%qs#X%Q#X#Y!Gv#Y;'S%Q;'S;=`&s<%lO%QV!G{X&YSOY%QYZ%lZr%Qrs%qs#f%Q#f#g!Hh#g;'S%Q;'S;=`&s<%lO%QV!HmX&YSOY%QYZ%lZr%Qrs%qs#Y%Q#Y#Z!IY#Z;'S%Q;'S;=`&s<%lO%QV!I_X&YSOY%QYZ%lZr%Qrs%qs#T%Q#T#U!Iz#U;'S%Q;'S;=`&s<%lO%QV!JPX&YSOY%QYZ%lZr%Qrs%qs#V%Q#V#W!Jl#W;'S%Q;'S;=`&s<%lO%QV!JqX&YSOY%QYZ%lZr%Qrs%qs#X%Q#X#Y!K^#Y;'S%Q;'S;=`&s<%lO%QV!KeV&tR&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%Q_!LRa&RZ&YSOY%QYZ%lZr%Qrs%qst%Qtu!Kzu!Q%Q!Q![!Kz![!c%Q!c!}!Kz!}#R%Q#R#S!Kz#S#T%Q#T#o!Kz#o;'S%Q;'S;=`&s<%lO%Q_!M_VuZ&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QV!M{VsR&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QU!NiX#eQ&YSOY%QYZ%lZr%Qrs%qs!_%Q!_!`6e!`;'S%Q;'S;=`&s<%lO%QV# ]V}R&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%Q_# {Z'OX#dQ&YSOY%QYZ%lZr%Qrs%qs!_%Q!_!`6e!`#p%Q#p#q#!n#q;'S%Q;'S;=`&s<%lO%QU#!uV#bQ&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QV##cV|R&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%QT#$PV#uP&YSOY%QYZ%lZr%Qrs%qs;'S%Q;'S;=`&s<%lO%Q",
  tokenizers: [0, 1, 2, 3],
  topRules: { Program: [0, 3], ClassContent: [1, 194] },
  dynamicPrecedences: { 27: 1, 232: -1, 243: -1 },
  specialized: [{ term: 231, get: (n) => d5[n] || -1 }],
  tokenPrec: 7144
}), X1 = /* @__PURE__ */ vn.define({
  name: "java",
  parser: /* @__PURE__ */ p5.configure({
    props: [
      /* @__PURE__ */ Gr.add({
        IfStatement: /* @__PURE__ */ ji({ except: /^\s*({|else\b)/ }),
        TryStatement: /* @__PURE__ */ ji({ except: /^\s*({|catch|finally)\b/ }),
        LabeledStatement: i0,
        SwitchBlock: (n) => {
          let e = n.textAfter, t = /^\s*\}/.test(e), i = /^\s*(case|default)\b/.test(e);
          return n.baseIndent + (t ? 0 : i ? 1 : 2) * n.unit;
        },
        Block: /* @__PURE__ */ Ws({ closing: "}" }),
        BlockComment: () => null,
        Statement: /* @__PURE__ */ ji({ except: /^{/ })
      }),
      /* @__PURE__ */ Dr.add({
        "Block SwitchBlock ClassBody ElementValueArrayInitializer ModuleBody EnumBody ConstructorBody InterfaceBody ArrayInitializer": Qa,
        BlockComment(n) {
          return { from: n.from + 2, to: n.to - 2 };
        }
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case |default:|\{|\})$/
  }
});
function g5() {
  return new io(X1);
}
const Nn = (n) => (e) => {
  let t = e.matchBefore(/\w*/) || {};
  return t.from == t.to && !e.explicit ? null : {
    from: t.from,
    options: n
  };
};
var bs = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ca = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
ca.exports;
(function(n, e) {
  (function() {
    var t, i = "4.17.21", r = 200, s = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", O = "Invalid `variable` option passed into `_.template`", h = "__lodash_hash_undefined__", f = 500, u = "__lodash_placeholder__", d = 1, g = 2, Q = 4, b = 1, v = 2, w = 1, Z = 2, Y = 4, U = 8, V = 16, W = 32, M = 64, z = 128, te = 256, oe = 512, fe = 30, le = "...", ne = 800, E = 16, N = 1, pe = 2, Fe = 3, Ae = 1 / 0, Ue = 9007199254740991, St = 17976931348623157e292, _e = NaN, Ce = 4294967295, Et = Ce - 1, _i = Ce >>> 1, Ki = [
      ["ary", z],
      ["bind", w],
      ["bindKey", Z],
      ["curry", U],
      ["curryRight", V],
      ["flip", oe],
      ["partial", W],
      ["partialRight", M],
      ["rearg", te]
    ], ti = "[object Arguments]", Rn = "[object Array]", oP = "[object AsyncFunction]", jr = "[object Boolean]", Nr = "[object Date]", lP = "[object DOMException]", ho = "[object Error]", co = "[object Function]", mf = "[object GeneratorFunction]", ii = "[object Map]", Fr = "[object Number]", aP = "[object Null]", Xi = "[object Object]", Qf = "[object Promise]", OP = "[object Proxy]", Hr = "[object RegExp]", ni = "[object Set]", Jr = "[object String]", fo = "[object Symbol]", hP = "[object Undefined]", Kr = "[object WeakMap]", cP = "[object WeakSet]", es = "[object ArrayBuffer]", nr = "[object DataView]", Ta = "[object Float32Array]", Za = "[object Float64Array]", Ra = "[object Int8Array]", _a = "[object Int16Array]", Xa = "[object Int32Array]", qa = "[object Uint8Array]", Ca = "[object Uint8ClampedArray]", Wa = "[object Uint16Array]", Ya = "[object Uint32Array]", fP = /\b__p \+= '';/g, uP = /\b(__p \+=) '' \+/g, dP = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Pf = /&(?:amp|lt|gt|quot|#39);/g, Sf = /[&<>"']/g, pP = RegExp(Pf.source), gP = RegExp(Sf.source), mP = /<%-([\s\S]+?)%>/g, QP = /<%([\s\S]+?)%>/g, $f = /<%=([\s\S]+?)%>/g, PP = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, SP = /^\w*$/, $P = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Aa = /[\\^$.*+?()[\]{}|]/g, bP = RegExp(Aa.source), Ua = /^\s+/, yP = /\s/, xP = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, vP = /\{\n\/\* \[wrapped with (.+)\] \*/, wP = /,? & /, kP = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, TP = /[()=,{}\[\]\/\s]/, ZP = /\\(\\)?/g, RP = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, bf = /\w*$/, _P = /^[-+]0x[0-9a-f]+$/i, XP = /^0b[01]+$/i, qP = /^\[object .+?Constructor\]$/, CP = /^0o[0-7]+$/i, WP = /^(?:0|[1-9]\d*)$/, YP = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, uo = /($^)/, AP = /['\n\r\u2028\u2029\\]/g, po = "\\ud800-\\udfff", UP = "\\u0300-\\u036f", VP = "\\ufe20-\\ufe2f", zP = "\\u20d0-\\u20ff", yf = UP + VP + zP, xf = "\\u2700-\\u27bf", vf = "a-z\\xdf-\\xf6\\xf8-\\xff", EP = "\\xac\\xb1\\xd7\\xf7", MP = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", GP = "\\u2000-\\u206f", DP = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", wf = "A-Z\\xc0-\\xd6\\xd8-\\xde", kf = "\\ufe0e\\ufe0f", Tf = EP + MP + GP + DP, Va = "['’]", IP = "[" + po + "]", Zf = "[" + Tf + "]", go = "[" + yf + "]", Rf = "\\d+", LP = "[" + xf + "]", _f = "[" + vf + "]", Xf = "[^" + po + Tf + Rf + xf + vf + wf + "]", za = "\\ud83c[\\udffb-\\udfff]", BP = "(?:" + go + "|" + za + ")", qf = "[^" + po + "]", Ea = "(?:\\ud83c[\\udde6-\\uddff]){2}", Ma = "[\\ud800-\\udbff][\\udc00-\\udfff]", rr = "[" + wf + "]", Cf = "\\u200d", Wf = "(?:" + _f + "|" + Xf + ")", jP = "(?:" + rr + "|" + Xf + ")", Yf = "(?:" + Va + "(?:d|ll|m|re|s|t|ve))?", Af = "(?:" + Va + "(?:D|LL|M|RE|S|T|VE))?", Uf = BP + "?", Vf = "[" + kf + "]?", NP = "(?:" + Cf + "(?:" + [qf, Ea, Ma].join("|") + ")" + Vf + Uf + ")*", FP = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", HP = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", zf = Vf + Uf + NP, JP = "(?:" + [LP, Ea, Ma].join("|") + ")" + zf, KP = "(?:" + [qf + go + "?", go, Ea, Ma, IP].join("|") + ")", eS = RegExp(Va, "g"), tS = RegExp(go, "g"), Ga = RegExp(za + "(?=" + za + ")|" + KP + zf, "g"), iS = RegExp([
      rr + "?" + _f + "+" + Yf + "(?=" + [Zf, rr, "$"].join("|") + ")",
      jP + "+" + Af + "(?=" + [Zf, rr + Wf, "$"].join("|") + ")",
      rr + "?" + Wf + "+" + Yf,
      rr + "+" + Af,
      HP,
      FP,
      Rf,
      JP
    ].join("|"), "g"), nS = RegExp("[" + Cf + po + yf + kf + "]"), rS = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, sS = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ], oS = -1, Te = {};
    Te[Ta] = Te[Za] = Te[Ra] = Te[_a] = Te[Xa] = Te[qa] = Te[Ca] = Te[Wa] = Te[Ya] = !0, Te[ti] = Te[Rn] = Te[es] = Te[jr] = Te[nr] = Te[Nr] = Te[ho] = Te[co] = Te[ii] = Te[Fr] = Te[Xi] = Te[Hr] = Te[ni] = Te[Jr] = Te[Kr] = !1;
    var we = {};
    we[ti] = we[Rn] = we[es] = we[nr] = we[jr] = we[Nr] = we[Ta] = we[Za] = we[Ra] = we[_a] = we[Xa] = we[ii] = we[Fr] = we[Xi] = we[Hr] = we[ni] = we[Jr] = we[fo] = we[qa] = we[Ca] = we[Wa] = we[Ya] = !0, we[ho] = we[co] = we[Kr] = !1;
    var lS = {
      // Latin-1 Supplement block.
      À: "A",
      Á: "A",
      Â: "A",
      Ã: "A",
      Ä: "A",
      Å: "A",
      à: "a",
      á: "a",
      â: "a",
      ã: "a",
      ä: "a",
      å: "a",
      Ç: "C",
      ç: "c",
      Ð: "D",
      ð: "d",
      È: "E",
      É: "E",
      Ê: "E",
      Ë: "E",
      è: "e",
      é: "e",
      ê: "e",
      ë: "e",
      Ì: "I",
      Í: "I",
      Î: "I",
      Ï: "I",
      ì: "i",
      í: "i",
      î: "i",
      ï: "i",
      Ñ: "N",
      ñ: "n",
      Ò: "O",
      Ó: "O",
      Ô: "O",
      Õ: "O",
      Ö: "O",
      Ø: "O",
      ò: "o",
      ó: "o",
      ô: "o",
      õ: "o",
      ö: "o",
      ø: "o",
      Ù: "U",
      Ú: "U",
      Û: "U",
      Ü: "U",
      ù: "u",
      ú: "u",
      û: "u",
      ü: "u",
      Ý: "Y",
      ý: "y",
      ÿ: "y",
      Æ: "Ae",
      æ: "ae",
      Þ: "Th",
      þ: "th",
      ß: "ss",
      // Latin Extended-A block.
      Ā: "A",
      Ă: "A",
      Ą: "A",
      ā: "a",
      ă: "a",
      ą: "a",
      Ć: "C",
      Ĉ: "C",
      Ċ: "C",
      Č: "C",
      ć: "c",
      ĉ: "c",
      ċ: "c",
      č: "c",
      Ď: "D",
      Đ: "D",
      ď: "d",
      đ: "d",
      Ē: "E",
      Ĕ: "E",
      Ė: "E",
      Ę: "E",
      Ě: "E",
      ē: "e",
      ĕ: "e",
      ė: "e",
      ę: "e",
      ě: "e",
      Ĝ: "G",
      Ğ: "G",
      Ġ: "G",
      Ģ: "G",
      ĝ: "g",
      ğ: "g",
      ġ: "g",
      ģ: "g",
      Ĥ: "H",
      Ħ: "H",
      ĥ: "h",
      ħ: "h",
      Ĩ: "I",
      Ī: "I",
      Ĭ: "I",
      Į: "I",
      İ: "I",
      ĩ: "i",
      ī: "i",
      ĭ: "i",
      į: "i",
      ı: "i",
      Ĵ: "J",
      ĵ: "j",
      Ķ: "K",
      ķ: "k",
      ĸ: "k",
      Ĺ: "L",
      Ļ: "L",
      Ľ: "L",
      Ŀ: "L",
      Ł: "L",
      ĺ: "l",
      ļ: "l",
      ľ: "l",
      ŀ: "l",
      ł: "l",
      Ń: "N",
      Ņ: "N",
      Ň: "N",
      Ŋ: "N",
      ń: "n",
      ņ: "n",
      ň: "n",
      ŋ: "n",
      Ō: "O",
      Ŏ: "O",
      Ő: "O",
      ō: "o",
      ŏ: "o",
      ő: "o",
      Ŕ: "R",
      Ŗ: "R",
      Ř: "R",
      ŕ: "r",
      ŗ: "r",
      ř: "r",
      Ś: "S",
      Ŝ: "S",
      Ş: "S",
      Š: "S",
      ś: "s",
      ŝ: "s",
      ş: "s",
      š: "s",
      Ţ: "T",
      Ť: "T",
      Ŧ: "T",
      ţ: "t",
      ť: "t",
      ŧ: "t",
      Ũ: "U",
      Ū: "U",
      Ŭ: "U",
      Ů: "U",
      Ű: "U",
      Ų: "U",
      ũ: "u",
      ū: "u",
      ŭ: "u",
      ů: "u",
      ű: "u",
      ų: "u",
      Ŵ: "W",
      ŵ: "w",
      Ŷ: "Y",
      ŷ: "y",
      Ÿ: "Y",
      Ź: "Z",
      Ż: "Z",
      Ž: "Z",
      ź: "z",
      ż: "z",
      ž: "z",
      Ĳ: "IJ",
      ĳ: "ij",
      Œ: "Oe",
      œ: "oe",
      ŉ: "'n",
      ſ: "s"
    }, aS = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, OS = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, hS = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, cS = parseFloat, fS = parseInt, Ef = typeof bs == "object" && bs && bs.Object === Object && bs, uS = typeof self == "object" && self && self.Object === Object && self, tt = Ef || uS || Function("return this")(), Da = e && !e.nodeType && e, _n = Da && !0 && n && !n.nodeType && n, Mf = _n && _n.exports === Da, Ia = Mf && Ef.process, Mt = function() {
      try {
        var k = _n && _n.require && _n.require("util").types;
        return k || Ia && Ia.binding && Ia.binding("util");
      } catch {
      }
    }(), Gf = Mt && Mt.isArrayBuffer, Df = Mt && Mt.isDate, If = Mt && Mt.isMap, Lf = Mt && Mt.isRegExp, Bf = Mt && Mt.isSet, jf = Mt && Mt.isTypedArray;
    function _t(k, _, R) {
      switch (R.length) {
        case 0:
          return k.call(_);
        case 1:
          return k.call(_, R[0]);
        case 2:
          return k.call(_, R[0], R[1]);
        case 3:
          return k.call(_, R[0], R[1], R[2]);
      }
      return k.apply(_, R);
    }
    function dS(k, _, R, L) {
      for (var re = -1, Se = k == null ? 0 : k.length; ++re < Se; ) {
        var He = k[re];
        _(L, He, R(He), k);
      }
      return L;
    }
    function Gt(k, _) {
      for (var R = -1, L = k == null ? 0 : k.length; ++R < L && _(k[R], R, k) !== !1; )
        ;
      return k;
    }
    function pS(k, _) {
      for (var R = k == null ? 0 : k.length; R-- && _(k[R], R, k) !== !1; )
        ;
      return k;
    }
    function Nf(k, _) {
      for (var R = -1, L = k == null ? 0 : k.length; ++R < L; )
        if (!_(k[R], R, k))
          return !1;
      return !0;
    }
    function en(k, _) {
      for (var R = -1, L = k == null ? 0 : k.length, re = 0, Se = []; ++R < L; ) {
        var He = k[R];
        _(He, R, k) && (Se[re++] = He);
      }
      return Se;
    }
    function mo(k, _) {
      var R = k == null ? 0 : k.length;
      return !!R && sr(k, _, 0) > -1;
    }
    function La(k, _, R) {
      for (var L = -1, re = k == null ? 0 : k.length; ++L < re; )
        if (R(_, k[L]))
          return !0;
      return !1;
    }
    function Xe(k, _) {
      for (var R = -1, L = k == null ? 0 : k.length, re = Array(L); ++R < L; )
        re[R] = _(k[R], R, k);
      return re;
    }
    function tn(k, _) {
      for (var R = -1, L = _.length, re = k.length; ++R < L; )
        k[re + R] = _[R];
      return k;
    }
    function Ba(k, _, R, L) {
      var re = -1, Se = k == null ? 0 : k.length;
      for (L && Se && (R = k[++re]); ++re < Se; )
        R = _(R, k[re], re, k);
      return R;
    }
    function gS(k, _, R, L) {
      var re = k == null ? 0 : k.length;
      for (L && re && (R = k[--re]); re--; )
        R = _(R, k[re], re, k);
      return R;
    }
    function ja(k, _) {
      for (var R = -1, L = k == null ? 0 : k.length; ++R < L; )
        if (_(k[R], R, k))
          return !0;
      return !1;
    }
    var mS = Na("length");
    function QS(k) {
      return k.split("");
    }
    function PS(k) {
      return k.match(kP) || [];
    }
    function Ff(k, _, R) {
      var L;
      return R(k, function(re, Se, He) {
        if (_(re, Se, He))
          return L = Se, !1;
      }), L;
    }
    function Qo(k, _, R, L) {
      for (var re = k.length, Se = R + (L ? 1 : -1); L ? Se-- : ++Se < re; )
        if (_(k[Se], Se, k))
          return Se;
      return -1;
    }
    function sr(k, _, R) {
      return _ === _ ? _S(k, _, R) : Qo(k, Hf, R);
    }
    function SS(k, _, R, L) {
      for (var re = R - 1, Se = k.length; ++re < Se; )
        if (L(k[re], _))
          return re;
      return -1;
    }
    function Hf(k) {
      return k !== k;
    }
    function Jf(k, _) {
      var R = k == null ? 0 : k.length;
      return R ? Ha(k, _) / R : _e;
    }
    function Na(k) {
      return function(_) {
        return _ == null ? t : _[k];
      };
    }
    function Fa(k) {
      return function(_) {
        return k == null ? t : k[_];
      };
    }
    function Kf(k, _, R, L, re) {
      return re(k, function(Se, He, ye) {
        R = L ? (L = !1, Se) : _(R, Se, He, ye);
      }), R;
    }
    function $S(k, _) {
      var R = k.length;
      for (k.sort(_); R--; )
        k[R] = k[R].value;
      return k;
    }
    function Ha(k, _) {
      for (var R, L = -1, re = k.length; ++L < re; ) {
        var Se = _(k[L]);
        Se !== t && (R = R === t ? Se : R + Se);
      }
      return R;
    }
    function Ja(k, _) {
      for (var R = -1, L = Array(k); ++R < k; )
        L[R] = _(R);
      return L;
    }
    function bS(k, _) {
      return Xe(_, function(R) {
        return [R, k[R]];
      });
    }
    function eu(k) {
      return k && k.slice(0, ru(k) + 1).replace(Ua, "");
    }
    function Xt(k) {
      return function(_) {
        return k(_);
      };
    }
    function Ka(k, _) {
      return Xe(_, function(R) {
        return k[R];
      });
    }
    function ts(k, _) {
      return k.has(_);
    }
    function tu(k, _) {
      for (var R = -1, L = k.length; ++R < L && sr(_, k[R], 0) > -1; )
        ;
      return R;
    }
    function iu(k, _) {
      for (var R = k.length; R-- && sr(_, k[R], 0) > -1; )
        ;
      return R;
    }
    function yS(k, _) {
      for (var R = k.length, L = 0; R--; )
        k[R] === _ && ++L;
      return L;
    }
    var xS = Fa(lS), vS = Fa(aS);
    function wS(k) {
      return "\\" + hS[k];
    }
    function kS(k, _) {
      return k == null ? t : k[_];
    }
    function or(k) {
      return nS.test(k);
    }
    function TS(k) {
      return rS.test(k);
    }
    function ZS(k) {
      for (var _, R = []; !(_ = k.next()).done; )
        R.push(_.value);
      return R;
    }
    function eO(k) {
      var _ = -1, R = Array(k.size);
      return k.forEach(function(L, re) {
        R[++_] = [re, L];
      }), R;
    }
    function nu(k, _) {
      return function(R) {
        return k(_(R));
      };
    }
    function nn(k, _) {
      for (var R = -1, L = k.length, re = 0, Se = []; ++R < L; ) {
        var He = k[R];
        (He === _ || He === u) && (k[R] = u, Se[re++] = R);
      }
      return Se;
    }
    function Po(k) {
      var _ = -1, R = Array(k.size);
      return k.forEach(function(L) {
        R[++_] = L;
      }), R;
    }
    function RS(k) {
      var _ = -1, R = Array(k.size);
      return k.forEach(function(L) {
        R[++_] = [L, L];
      }), R;
    }
    function _S(k, _, R) {
      for (var L = R - 1, re = k.length; ++L < re; )
        if (k[L] === _)
          return L;
      return -1;
    }
    function XS(k, _, R) {
      for (var L = R + 1; L--; )
        if (k[L] === _)
          return L;
      return L;
    }
    function lr(k) {
      return or(k) ? CS(k) : mS(k);
    }
    function ri(k) {
      return or(k) ? WS(k) : QS(k);
    }
    function ru(k) {
      for (var _ = k.length; _-- && yP.test(k.charAt(_)); )
        ;
      return _;
    }
    var qS = Fa(OS);
    function CS(k) {
      for (var _ = Ga.lastIndex = 0; Ga.test(k); )
        ++_;
      return _;
    }
    function WS(k) {
      return k.match(Ga) || [];
    }
    function YS(k) {
      return k.match(iS) || [];
    }
    var AS = function k(_) {
      _ = _ == null ? tt : ar.defaults(tt.Object(), _, ar.pick(tt, sS));
      var R = _.Array, L = _.Date, re = _.Error, Se = _.Function, He = _.Math, ye = _.Object, tO = _.RegExp, US = _.String, Dt = _.TypeError, So = R.prototype, VS = Se.prototype, Or = ye.prototype, $o = _["__core-js_shared__"], bo = VS.toString, be = Or.hasOwnProperty, zS = 0, su = function() {
        var o = /[^.]+$/.exec($o && $o.keys && $o.keys.IE_PROTO || "");
        return o ? "Symbol(src)_1." + o : "";
      }(), yo = Or.toString, ES = bo.call(ye), MS = tt._, GS = tO(
        "^" + bo.call(be).replace(Aa, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), xo = Mf ? _.Buffer : t, rn = _.Symbol, vo = _.Uint8Array, ou = xo ? xo.allocUnsafe : t, wo = nu(ye.getPrototypeOf, ye), lu = ye.create, au = Or.propertyIsEnumerable, ko = So.splice, Ou = rn ? rn.isConcatSpreadable : t, is = rn ? rn.iterator : t, Xn = rn ? rn.toStringTag : t, To = function() {
        try {
          var o = An(ye, "defineProperty");
          return o({}, "", {}), o;
        } catch {
        }
      }(), DS = _.clearTimeout !== tt.clearTimeout && _.clearTimeout, IS = L && L.now !== tt.Date.now && L.now, LS = _.setTimeout !== tt.setTimeout && _.setTimeout, Zo = He.ceil, Ro = He.floor, iO = ye.getOwnPropertySymbols, BS = xo ? xo.isBuffer : t, hu = _.isFinite, jS = So.join, NS = nu(ye.keys, ye), Je = He.max, Ot = He.min, FS = L.now, HS = _.parseInt, cu = He.random, JS = So.reverse, nO = An(_, "DataView"), ns = An(_, "Map"), rO = An(_, "Promise"), hr = An(_, "Set"), rs = An(_, "WeakMap"), ss = An(ye, "create"), _o = rs && new rs(), cr = {}, KS = Un(nO), e$ = Un(ns), t$ = Un(rO), i$ = Un(hr), n$ = Un(rs), Xo = rn ? rn.prototype : t, os = Xo ? Xo.valueOf : t, fu = Xo ? Xo.toString : t;
      function P(o) {
        if (Ve(o) && !se(o) && !(o instanceof ge)) {
          if (o instanceof It)
            return o;
          if (be.call(o, "__wrapped__"))
            return ud(o);
        }
        return new It(o);
      }
      var fr = /* @__PURE__ */ function() {
        function o() {
        }
        return function(a) {
          if (!We(a))
            return {};
          if (lu)
            return lu(a);
          o.prototype = a;
          var c = new o();
          return o.prototype = t, c;
        };
      }();
      function qo() {
      }
      function It(o, a) {
        this.__wrapped__ = o, this.__actions__ = [], this.__chain__ = !!a, this.__index__ = 0, this.__values__ = t;
      }
      P.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: mP,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: QP,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: $f,
        /**
         * Used to reference the data object in the template text.
         *
         * @memberOf _.templateSettings
         * @type {string}
         */
        variable: "",
        /**
         * Used to import variables into the compiled template.
         *
         * @memberOf _.templateSettings
         * @type {Object}
         */
        imports: {
          /**
           * A reference to the `lodash` function.
           *
           * @memberOf _.templateSettings.imports
           * @type {Function}
           */
          _: P
        }
      }, P.prototype = qo.prototype, P.prototype.constructor = P, It.prototype = fr(qo.prototype), It.prototype.constructor = It;
      function ge(o) {
        this.__wrapped__ = o, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = Ce, this.__views__ = [];
      }
      function r$() {
        var o = new ge(this.__wrapped__);
        return o.__actions__ = $t(this.__actions__), o.__dir__ = this.__dir__, o.__filtered__ = this.__filtered__, o.__iteratees__ = $t(this.__iteratees__), o.__takeCount__ = this.__takeCount__, o.__views__ = $t(this.__views__), o;
      }
      function s$() {
        if (this.__filtered__) {
          var o = new ge(this);
          o.__dir__ = -1, o.__filtered__ = !0;
        } else
          o = this.clone(), o.__dir__ *= -1;
        return o;
      }
      function o$() {
        var o = this.__wrapped__.value(), a = this.__dir__, c = se(o), p = a < 0, m = c ? o.length : 0, S = Qb(0, m, this.__views__), y = S.start, x = S.end, T = x - y, q = p ? x : y - 1, C = this.__iteratees__, A = C.length, D = 0, F = Ot(T, this.__takeCount__);
        if (!c || !p && m == T && F == T)
          return Yu(o, this.__actions__);
        var K = [];
        e:
          for (; T-- && D < F; ) {
            q += a;
            for (var Oe = -1, ee = o[q]; ++Oe < A; ) {
              var de = C[Oe], me = de.iteratee, Wt = de.type, gt = me(ee);
              if (Wt == pe)
                ee = gt;
              else if (!gt) {
                if (Wt == N)
                  continue e;
                break e;
              }
            }
            K[D++] = ee;
          }
        return K;
      }
      ge.prototype = fr(qo.prototype), ge.prototype.constructor = ge;
      function qn(o) {
        var a = -1, c = o == null ? 0 : o.length;
        for (this.clear(); ++a < c; ) {
          var p = o[a];
          this.set(p[0], p[1]);
        }
      }
      function l$() {
        this.__data__ = ss ? ss(null) : {}, this.size = 0;
      }
      function a$(o) {
        var a = this.has(o) && delete this.__data__[o];
        return this.size -= a ? 1 : 0, a;
      }
      function O$(o) {
        var a = this.__data__;
        if (ss) {
          var c = a[o];
          return c === h ? t : c;
        }
        return be.call(a, o) ? a[o] : t;
      }
      function h$(o) {
        var a = this.__data__;
        return ss ? a[o] !== t : be.call(a, o);
      }
      function c$(o, a) {
        var c = this.__data__;
        return this.size += this.has(o) ? 0 : 1, c[o] = ss && a === t ? h : a, this;
      }
      qn.prototype.clear = l$, qn.prototype.delete = a$, qn.prototype.get = O$, qn.prototype.has = h$, qn.prototype.set = c$;
      function qi(o) {
        var a = -1, c = o == null ? 0 : o.length;
        for (this.clear(); ++a < c; ) {
          var p = o[a];
          this.set(p[0], p[1]);
        }
      }
      function f$() {
        this.__data__ = [], this.size = 0;
      }
      function u$(o) {
        var a = this.__data__, c = Co(a, o);
        if (c < 0)
          return !1;
        var p = a.length - 1;
        return c == p ? a.pop() : ko.call(a, c, 1), --this.size, !0;
      }
      function d$(o) {
        var a = this.__data__, c = Co(a, o);
        return c < 0 ? t : a[c][1];
      }
      function p$(o) {
        return Co(this.__data__, o) > -1;
      }
      function g$(o, a) {
        var c = this.__data__, p = Co(c, o);
        return p < 0 ? (++this.size, c.push([o, a])) : c[p][1] = a, this;
      }
      qi.prototype.clear = f$, qi.prototype.delete = u$, qi.prototype.get = d$, qi.prototype.has = p$, qi.prototype.set = g$;
      function Ci(o) {
        var a = -1, c = o == null ? 0 : o.length;
        for (this.clear(); ++a < c; ) {
          var p = o[a];
          this.set(p[0], p[1]);
        }
      }
      function m$() {
        this.size = 0, this.__data__ = {
          hash: new qn(),
          map: new (ns || qi)(),
          string: new qn()
        };
      }
      function Q$(o) {
        var a = Lo(this, o).delete(o);
        return this.size -= a ? 1 : 0, a;
      }
      function P$(o) {
        return Lo(this, o).get(o);
      }
      function S$(o) {
        return Lo(this, o).has(o);
      }
      function $$(o, a) {
        var c = Lo(this, o), p = c.size;
        return c.set(o, a), this.size += c.size == p ? 0 : 1, this;
      }
      Ci.prototype.clear = m$, Ci.prototype.delete = Q$, Ci.prototype.get = P$, Ci.prototype.has = S$, Ci.prototype.set = $$;
      function Cn(o) {
        var a = -1, c = o == null ? 0 : o.length;
        for (this.__data__ = new Ci(); ++a < c; )
          this.add(o[a]);
      }
      function b$(o) {
        return this.__data__.set(o, h), this;
      }
      function y$(o) {
        return this.__data__.has(o);
      }
      Cn.prototype.add = Cn.prototype.push = b$, Cn.prototype.has = y$;
      function si(o) {
        var a = this.__data__ = new qi(o);
        this.size = a.size;
      }
      function x$() {
        this.__data__ = new qi(), this.size = 0;
      }
      function v$(o) {
        var a = this.__data__, c = a.delete(o);
        return this.size = a.size, c;
      }
      function w$(o) {
        return this.__data__.get(o);
      }
      function k$(o) {
        return this.__data__.has(o);
      }
      function T$(o, a) {
        var c = this.__data__;
        if (c instanceof qi) {
          var p = c.__data__;
          if (!ns || p.length < r - 1)
            return p.push([o, a]), this.size = ++c.size, this;
          c = this.__data__ = new Ci(p);
        }
        return c.set(o, a), this.size = c.size, this;
      }
      si.prototype.clear = x$, si.prototype.delete = v$, si.prototype.get = w$, si.prototype.has = k$, si.prototype.set = T$;
      function uu(o, a) {
        var c = se(o), p = !c && Vn(o), m = !c && !p && On(o), S = !c && !p && !m && gr(o), y = c || p || m || S, x = y ? Ja(o.length, US) : [], T = x.length;
        for (var q in o)
          (a || be.call(o, q)) && !(y && // Safari 9 has enumerable `arguments.length` in strict mode.
          (q == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          m && (q == "offset" || q == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          S && (q == "buffer" || q == "byteLength" || q == "byteOffset") || // Skip index properties.
          Ui(q, T))) && x.push(q);
        return x;
      }
      function du(o) {
        var a = o.length;
        return a ? o[pO(0, a - 1)] : t;
      }
      function Z$(o, a) {
        return Bo($t(o), Wn(a, 0, o.length));
      }
      function R$(o) {
        return Bo($t(o));
      }
      function sO(o, a, c) {
        (c !== t && !oi(o[a], c) || c === t && !(a in o)) && Wi(o, a, c);
      }
      function ls(o, a, c) {
        var p = o[a];
        (!(be.call(o, a) && oi(p, c)) || c === t && !(a in o)) && Wi(o, a, c);
      }
      function Co(o, a) {
        for (var c = o.length; c--; )
          if (oi(o[c][0], a))
            return c;
        return -1;
      }
      function _$(o, a, c, p) {
        return sn(o, function(m, S, y) {
          a(p, m, c(m), y);
        }), p;
      }
      function pu(o, a) {
        return o && di(a, et(a), o);
      }
      function X$(o, a) {
        return o && di(a, yt(a), o);
      }
      function Wi(o, a, c) {
        a == "__proto__" && To ? To(o, a, {
          configurable: !0,
          enumerable: !0,
          value: c,
          writable: !0
        }) : o[a] = c;
      }
      function oO(o, a) {
        for (var c = -1, p = a.length, m = R(p), S = o == null; ++c < p; )
          m[c] = S ? t : zO(o, a[c]);
        return m;
      }
      function Wn(o, a, c) {
        return o === o && (c !== t && (o = o <= c ? o : c), a !== t && (o = o >= a ? o : a)), o;
      }
      function Lt(o, a, c, p, m, S) {
        var y, x = a & d, T = a & g, q = a & Q;
        if (c && (y = m ? c(o, p, m, S) : c(o)), y !== t)
          return y;
        if (!We(o))
          return o;
        var C = se(o);
        if (C) {
          if (y = Sb(o), !x)
            return $t(o, y);
        } else {
          var A = ht(o), D = A == co || A == mf;
          if (On(o))
            return Vu(o, x);
          if (A == Xi || A == ti || D && !m) {
            if (y = T || D ? {} : rd(o), !x)
              return T ? Ob(o, X$(y, o)) : ab(o, pu(y, o));
          } else {
            if (!we[A])
              return m ? o : {};
            y = $b(o, A, x);
          }
        }
        S || (S = new si());
        var F = S.get(o);
        if (F)
          return F;
        S.set(o, y), qd(o) ? o.forEach(function(ee) {
          y.add(Lt(ee, a, c, ee, o, S));
        }) : _d(o) && o.forEach(function(ee, de) {
          y.set(de, Lt(ee, a, c, de, o, S));
        });
        var K = q ? T ? wO : vO : T ? yt : et, Oe = C ? t : K(o);
        return Gt(Oe || o, function(ee, de) {
          Oe && (de = ee, ee = o[de]), ls(y, de, Lt(ee, a, c, de, o, S));
        }), y;
      }
      function q$(o) {
        var a = et(o);
        return function(c) {
          return gu(c, o, a);
        };
      }
      function gu(o, a, c) {
        var p = c.length;
        if (o == null)
          return !p;
        for (o = ye(o); p--; ) {
          var m = c[p], S = a[m], y = o[m];
          if (y === t && !(m in o) || !S(y))
            return !1;
        }
        return !0;
      }
      function mu(o, a, c) {
        if (typeof o != "function")
          throw new Dt(l);
        return ds(function() {
          o.apply(t, c);
        }, a);
      }
      function as(o, a, c, p) {
        var m = -1, S = mo, y = !0, x = o.length, T = [], q = a.length;
        if (!x)
          return T;
        c && (a = Xe(a, Xt(c))), p ? (S = La, y = !1) : a.length >= r && (S = ts, y = !1, a = new Cn(a));
        e:
          for (; ++m < x; ) {
            var C = o[m], A = c == null ? C : c(C);
            if (C = p || C !== 0 ? C : 0, y && A === A) {
              for (var D = q; D--; )
                if (a[D] === A)
                  continue e;
              T.push(C);
            } else S(a, A, p) || T.push(C);
          }
        return T;
      }
      var sn = Du(ui), Qu = Du(aO, !0);
      function C$(o, a) {
        var c = !0;
        return sn(o, function(p, m, S) {
          return c = !!a(p, m, S), c;
        }), c;
      }
      function Wo(o, a, c) {
        for (var p = -1, m = o.length; ++p < m; ) {
          var S = o[p], y = a(S);
          if (y != null && (x === t ? y === y && !Ct(y) : c(y, x)))
            var x = y, T = S;
        }
        return T;
      }
      function W$(o, a, c, p) {
        var m = o.length;
        for (c = ae(c), c < 0 && (c = -c > m ? 0 : m + c), p = p === t || p > m ? m : ae(p), p < 0 && (p += m), p = c > p ? 0 : Wd(p); c < p; )
          o[c++] = a;
        return o;
      }
      function Pu(o, a) {
        var c = [];
        return sn(o, function(p, m, S) {
          a(p, m, S) && c.push(p);
        }), c;
      }
      function it(o, a, c, p, m) {
        var S = -1, y = o.length;
        for (c || (c = yb), m || (m = []); ++S < y; ) {
          var x = o[S];
          a > 0 && c(x) ? a > 1 ? it(x, a - 1, c, p, m) : tn(m, x) : p || (m[m.length] = x);
        }
        return m;
      }
      var lO = Iu(), Su = Iu(!0);
      function ui(o, a) {
        return o && lO(o, a, et);
      }
      function aO(o, a) {
        return o && Su(o, a, et);
      }
      function Yo(o, a) {
        return en(a, function(c) {
          return Vi(o[c]);
        });
      }
      function Yn(o, a) {
        a = ln(a, o);
        for (var c = 0, p = a.length; o != null && c < p; )
          o = o[pi(a[c++])];
        return c && c == p ? o : t;
      }
      function $u(o, a, c) {
        var p = a(o);
        return se(o) ? p : tn(p, c(o));
      }
      function dt(o) {
        return o == null ? o === t ? hP : aP : Xn && Xn in ye(o) ? mb(o) : Rb(o);
      }
      function OO(o, a) {
        return o > a;
      }
      function Y$(o, a) {
        return o != null && be.call(o, a);
      }
      function A$(o, a) {
        return o != null && a in ye(o);
      }
      function U$(o, a, c) {
        return o >= Ot(a, c) && o < Je(a, c);
      }
      function hO(o, a, c) {
        for (var p = c ? La : mo, m = o[0].length, S = o.length, y = S, x = R(S), T = 1 / 0, q = []; y--; ) {
          var C = o[y];
          y && a && (C = Xe(C, Xt(a))), T = Ot(C.length, T), x[y] = !c && (a || m >= 120 && C.length >= 120) ? new Cn(y && C) : t;
        }
        C = o[0];
        var A = -1, D = x[0];
        e:
          for (; ++A < m && q.length < T; ) {
            var F = C[A], K = a ? a(F) : F;
            if (F = c || F !== 0 ? F : 0, !(D ? ts(D, K) : p(q, K, c))) {
              for (y = S; --y; ) {
                var Oe = x[y];
                if (!(Oe ? ts(Oe, K) : p(o[y], K, c)))
                  continue e;
              }
              D && D.push(K), q.push(F);
            }
          }
        return q;
      }
      function V$(o, a, c, p) {
        return ui(o, function(m, S, y) {
          a(p, c(m), S, y);
        }), p;
      }
      function Os(o, a, c) {
        a = ln(a, o), o = ad(o, a);
        var p = o == null ? o : o[pi(jt(a))];
        return p == null ? t : _t(p, o, c);
      }
      function bu(o) {
        return Ve(o) && dt(o) == ti;
      }
      function z$(o) {
        return Ve(o) && dt(o) == es;
      }
      function E$(o) {
        return Ve(o) && dt(o) == Nr;
      }
      function hs(o, a, c, p, m) {
        return o === a ? !0 : o == null || a == null || !Ve(o) && !Ve(a) ? o !== o && a !== a : M$(o, a, c, p, hs, m);
      }
      function M$(o, a, c, p, m, S) {
        var y = se(o), x = se(a), T = y ? Rn : ht(o), q = x ? Rn : ht(a);
        T = T == ti ? Xi : T, q = q == ti ? Xi : q;
        var C = T == Xi, A = q == Xi, D = T == q;
        if (D && On(o)) {
          if (!On(a))
            return !1;
          y = !0, C = !1;
        }
        if (D && !C)
          return S || (S = new si()), y || gr(o) ? td(o, a, c, p, m, S) : pb(o, a, T, c, p, m, S);
        if (!(c & b)) {
          var F = C && be.call(o, "__wrapped__"), K = A && be.call(a, "__wrapped__");
          if (F || K) {
            var Oe = F ? o.value() : o, ee = K ? a.value() : a;
            return S || (S = new si()), m(Oe, ee, c, p, S);
          }
        }
        return D ? (S || (S = new si()), gb(o, a, c, p, m, S)) : !1;
      }
      function G$(o) {
        return Ve(o) && ht(o) == ii;
      }
      function cO(o, a, c, p) {
        var m = c.length, S = m, y = !p;
        if (o == null)
          return !S;
        for (o = ye(o); m--; ) {
          var x = c[m];
          if (y && x[2] ? x[1] !== o[x[0]] : !(x[0] in o))
            return !1;
        }
        for (; ++m < S; ) {
          x = c[m];
          var T = x[0], q = o[T], C = x[1];
          if (y && x[2]) {
            if (q === t && !(T in o))
              return !1;
          } else {
            var A = new si();
            if (p)
              var D = p(q, C, T, o, a, A);
            if (!(D === t ? hs(C, q, b | v, p, A) : D))
              return !1;
          }
        }
        return !0;
      }
      function yu(o) {
        if (!We(o) || vb(o))
          return !1;
        var a = Vi(o) ? GS : qP;
        return a.test(Un(o));
      }
      function D$(o) {
        return Ve(o) && dt(o) == Hr;
      }
      function I$(o) {
        return Ve(o) && ht(o) == ni;
      }
      function L$(o) {
        return Ve(o) && Ko(o.length) && !!Te[dt(o)];
      }
      function xu(o) {
        return typeof o == "function" ? o : o == null ? xt : typeof o == "object" ? se(o) ? ku(o[0], o[1]) : wu(o) : Ld(o);
      }
      function fO(o) {
        if (!us(o))
          return NS(o);
        var a = [];
        for (var c in ye(o))
          be.call(o, c) && c != "constructor" && a.push(c);
        return a;
      }
      function B$(o) {
        if (!We(o))
          return Zb(o);
        var a = us(o), c = [];
        for (var p in o)
          p == "constructor" && (a || !be.call(o, p)) || c.push(p);
        return c;
      }
      function uO(o, a) {
        return o < a;
      }
      function vu(o, a) {
        var c = -1, p = bt(o) ? R(o.length) : [];
        return sn(o, function(m, S, y) {
          p[++c] = a(m, S, y);
        }), p;
      }
      function wu(o) {
        var a = TO(o);
        return a.length == 1 && a[0][2] ? od(a[0][0], a[0][1]) : function(c) {
          return c === o || cO(c, o, a);
        };
      }
      function ku(o, a) {
        return RO(o) && sd(a) ? od(pi(o), a) : function(c) {
          var p = zO(c, o);
          return p === t && p === a ? EO(c, o) : hs(a, p, b | v);
        };
      }
      function Ao(o, a, c, p, m) {
        o !== a && lO(a, function(S, y) {
          if (m || (m = new si()), We(S))
            j$(o, a, y, c, Ao, p, m);
          else {
            var x = p ? p(XO(o, y), S, y + "", o, a, m) : t;
            x === t && (x = S), sO(o, y, x);
          }
        }, yt);
      }
      function j$(o, a, c, p, m, S, y) {
        var x = XO(o, c), T = XO(a, c), q = y.get(T);
        if (q) {
          sO(o, c, q);
          return;
        }
        var C = S ? S(x, T, c + "", o, a, y) : t, A = C === t;
        if (A) {
          var D = se(T), F = !D && On(T), K = !D && !F && gr(T);
          C = T, D || F || K ? se(x) ? C = x : Ee(x) ? C = $t(x) : F ? (A = !1, C = Vu(T, !0)) : K ? (A = !1, C = zu(T, !0)) : C = [] : ps(T) || Vn(T) ? (C = x, Vn(x) ? C = Yd(x) : (!We(x) || Vi(x)) && (C = rd(T))) : A = !1;
        }
        A && (y.set(T, C), m(C, T, p, S, y), y.delete(T)), sO(o, c, C);
      }
      function Tu(o, a) {
        var c = o.length;
        if (c)
          return a += a < 0 ? c : 0, Ui(a, c) ? o[a] : t;
      }
      function Zu(o, a, c) {
        a.length ? a = Xe(a, function(S) {
          return se(S) ? function(y) {
            return Yn(y, S.length === 1 ? S[0] : S);
          } : S;
        }) : a = [xt];
        var p = -1;
        a = Xe(a, Xt(J()));
        var m = vu(o, function(S, y, x) {
          var T = Xe(a, function(q) {
            return q(S);
          });
          return { criteria: T, index: ++p, value: S };
        });
        return $S(m, function(S, y) {
          return lb(S, y, c);
        });
      }
      function N$(o, a) {
        return Ru(o, a, function(c, p) {
          return EO(o, p);
        });
      }
      function Ru(o, a, c) {
        for (var p = -1, m = a.length, S = {}; ++p < m; ) {
          var y = a[p], x = Yn(o, y);
          c(x, y) && cs(S, ln(y, o), x);
        }
        return S;
      }
      function F$(o) {
        return function(a) {
          return Yn(a, o);
        };
      }
      function dO(o, a, c, p) {
        var m = p ? SS : sr, S = -1, y = a.length, x = o;
        for (o === a && (a = $t(a)), c && (x = Xe(o, Xt(c))); ++S < y; )
          for (var T = 0, q = a[S], C = c ? c(q) : q; (T = m(x, C, T, p)) > -1; )
            x !== o && ko.call(x, T, 1), ko.call(o, T, 1);
        return o;
      }
      function _u(o, a) {
        for (var c = o ? a.length : 0, p = c - 1; c--; ) {
          var m = a[c];
          if (c == p || m !== S) {
            var S = m;
            Ui(m) ? ko.call(o, m, 1) : QO(o, m);
          }
        }
        return o;
      }
      function pO(o, a) {
        return o + Ro(cu() * (a - o + 1));
      }
      function H$(o, a, c, p) {
        for (var m = -1, S = Je(Zo((a - o) / (c || 1)), 0), y = R(S); S--; )
          y[p ? S : ++m] = o, o += c;
        return y;
      }
      function gO(o, a) {
        var c = "";
        if (!o || a < 1 || a > Ue)
          return c;
        do
          a % 2 && (c += o), a = Ro(a / 2), a && (o += o);
        while (a);
        return c;
      }
      function he(o, a) {
        return qO(ld(o, a, xt), o + "");
      }
      function J$(o) {
        return du(mr(o));
      }
      function K$(o, a) {
        var c = mr(o);
        return Bo(c, Wn(a, 0, c.length));
      }
      function cs(o, a, c, p) {
        if (!We(o))
          return o;
        a = ln(a, o);
        for (var m = -1, S = a.length, y = S - 1, x = o; x != null && ++m < S; ) {
          var T = pi(a[m]), q = c;
          if (T === "__proto__" || T === "constructor" || T === "prototype")
            return o;
          if (m != y) {
            var C = x[T];
            q = p ? p(C, T, x) : t, q === t && (q = We(C) ? C : Ui(a[m + 1]) ? [] : {});
          }
          ls(x, T, q), x = x[T];
        }
        return o;
      }
      var Xu = _o ? function(o, a) {
        return _o.set(o, a), o;
      } : xt, eb = To ? function(o, a) {
        return To(o, "toString", {
          configurable: !0,
          enumerable: !1,
          value: GO(a),
          writable: !0
        });
      } : xt;
      function tb(o) {
        return Bo(mr(o));
      }
      function Bt(o, a, c) {
        var p = -1, m = o.length;
        a < 0 && (a = -a > m ? 0 : m + a), c = c > m ? m : c, c < 0 && (c += m), m = a > c ? 0 : c - a >>> 0, a >>>= 0;
        for (var S = R(m); ++p < m; )
          S[p] = o[p + a];
        return S;
      }
      function ib(o, a) {
        var c;
        return sn(o, function(p, m, S) {
          return c = a(p, m, S), !c;
        }), !!c;
      }
      function Uo(o, a, c) {
        var p = 0, m = o == null ? p : o.length;
        if (typeof a == "number" && a === a && m <= _i) {
          for (; p < m; ) {
            var S = p + m >>> 1, y = o[S];
            y !== null && !Ct(y) && (c ? y <= a : y < a) ? p = S + 1 : m = S;
          }
          return m;
        }
        return mO(o, a, xt, c);
      }
      function mO(o, a, c, p) {
        var m = 0, S = o == null ? 0 : o.length;
        if (S === 0)
          return 0;
        a = c(a);
        for (var y = a !== a, x = a === null, T = Ct(a), q = a === t; m < S; ) {
          var C = Ro((m + S) / 2), A = c(o[C]), D = A !== t, F = A === null, K = A === A, Oe = Ct(A);
          if (y)
            var ee = p || K;
          else q ? ee = K && (p || D) : x ? ee = K && D && (p || !F) : T ? ee = K && D && !F && (p || !Oe) : F || Oe ? ee = !1 : ee = p ? A <= a : A < a;
          ee ? m = C + 1 : S = C;
        }
        return Ot(S, Et);
      }
      function qu(o, a) {
        for (var c = -1, p = o.length, m = 0, S = []; ++c < p; ) {
          var y = o[c], x = a ? a(y) : y;
          if (!c || !oi(x, T)) {
            var T = x;
            S[m++] = y === 0 ? 0 : y;
          }
        }
        return S;
      }
      function Cu(o) {
        return typeof o == "number" ? o : Ct(o) ? _e : +o;
      }
      function qt(o) {
        if (typeof o == "string")
          return o;
        if (se(o))
          return Xe(o, qt) + "";
        if (Ct(o))
          return fu ? fu.call(o) : "";
        var a = o + "";
        return a == "0" && 1 / o == -Ae ? "-0" : a;
      }
      function on(o, a, c) {
        var p = -1, m = mo, S = o.length, y = !0, x = [], T = x;
        if (c)
          y = !1, m = La;
        else if (S >= r) {
          var q = a ? null : ub(o);
          if (q)
            return Po(q);
          y = !1, m = ts, T = new Cn();
        } else
          T = a ? [] : x;
        e:
          for (; ++p < S; ) {
            var C = o[p], A = a ? a(C) : C;
            if (C = c || C !== 0 ? C : 0, y && A === A) {
              for (var D = T.length; D--; )
                if (T[D] === A)
                  continue e;
              a && T.push(A), x.push(C);
            } else m(T, A, c) || (T !== x && T.push(A), x.push(C));
          }
        return x;
      }
      function QO(o, a) {
        return a = ln(a, o), o = ad(o, a), o == null || delete o[pi(jt(a))];
      }
      function Wu(o, a, c, p) {
        return cs(o, a, c(Yn(o, a)), p);
      }
      function Vo(o, a, c, p) {
        for (var m = o.length, S = p ? m : -1; (p ? S-- : ++S < m) && a(o[S], S, o); )
          ;
        return c ? Bt(o, p ? 0 : S, p ? S + 1 : m) : Bt(o, p ? S + 1 : 0, p ? m : S);
      }
      function Yu(o, a) {
        var c = o;
        return c instanceof ge && (c = c.value()), Ba(a, function(p, m) {
          return m.func.apply(m.thisArg, tn([p], m.args));
        }, c);
      }
      function PO(o, a, c) {
        var p = o.length;
        if (p < 2)
          return p ? on(o[0]) : [];
        for (var m = -1, S = R(p); ++m < p; )
          for (var y = o[m], x = -1; ++x < p; )
            x != m && (S[m] = as(S[m] || y, o[x], a, c));
        return on(it(S, 1), a, c);
      }
      function Au(o, a, c) {
        for (var p = -1, m = o.length, S = a.length, y = {}; ++p < m; ) {
          var x = p < S ? a[p] : t;
          c(y, o[p], x);
        }
        return y;
      }
      function SO(o) {
        return Ee(o) ? o : [];
      }
      function $O(o) {
        return typeof o == "function" ? o : xt;
      }
      function ln(o, a) {
        return se(o) ? o : RO(o, a) ? [o] : fd($e(o));
      }
      var nb = he;
      function an(o, a, c) {
        var p = o.length;
        return c = c === t ? p : c, !a && c >= p ? o : Bt(o, a, c);
      }
      var Uu = DS || function(o) {
        return tt.clearTimeout(o);
      };
      function Vu(o, a) {
        if (a)
          return o.slice();
        var c = o.length, p = ou ? ou(c) : new o.constructor(c);
        return o.copy(p), p;
      }
      function bO(o) {
        var a = new o.constructor(o.byteLength);
        return new vo(a).set(new vo(o)), a;
      }
      function rb(o, a) {
        var c = a ? bO(o.buffer) : o.buffer;
        return new o.constructor(c, o.byteOffset, o.byteLength);
      }
      function sb(o) {
        var a = new o.constructor(o.source, bf.exec(o));
        return a.lastIndex = o.lastIndex, a;
      }
      function ob(o) {
        return os ? ye(os.call(o)) : {};
      }
      function zu(o, a) {
        var c = a ? bO(o.buffer) : o.buffer;
        return new o.constructor(c, o.byteOffset, o.length);
      }
      function Eu(o, a) {
        if (o !== a) {
          var c = o !== t, p = o === null, m = o === o, S = Ct(o), y = a !== t, x = a === null, T = a === a, q = Ct(a);
          if (!x && !q && !S && o > a || S && y && T && !x && !q || p && y && T || !c && T || !m)
            return 1;
          if (!p && !S && !q && o < a || q && c && m && !p && !S || x && c && m || !y && m || !T)
            return -1;
        }
        return 0;
      }
      function lb(o, a, c) {
        for (var p = -1, m = o.criteria, S = a.criteria, y = m.length, x = c.length; ++p < y; ) {
          var T = Eu(m[p], S[p]);
          if (T) {
            if (p >= x)
              return T;
            var q = c[p];
            return T * (q == "desc" ? -1 : 1);
          }
        }
        return o.index - a.index;
      }
      function Mu(o, a, c, p) {
        for (var m = -1, S = o.length, y = c.length, x = -1, T = a.length, q = Je(S - y, 0), C = R(T + q), A = !p; ++x < T; )
          C[x] = a[x];
        for (; ++m < y; )
          (A || m < S) && (C[c[m]] = o[m]);
        for (; q--; )
          C[x++] = o[m++];
        return C;
      }
      function Gu(o, a, c, p) {
        for (var m = -1, S = o.length, y = -1, x = c.length, T = -1, q = a.length, C = Je(S - x, 0), A = R(C + q), D = !p; ++m < C; )
          A[m] = o[m];
        for (var F = m; ++T < q; )
          A[F + T] = a[T];
        for (; ++y < x; )
          (D || m < S) && (A[F + c[y]] = o[m++]);
        return A;
      }
      function $t(o, a) {
        var c = -1, p = o.length;
        for (a || (a = R(p)); ++c < p; )
          a[c] = o[c];
        return a;
      }
      function di(o, a, c, p) {
        var m = !c;
        c || (c = {});
        for (var S = -1, y = a.length; ++S < y; ) {
          var x = a[S], T = p ? p(c[x], o[x], x, c, o) : t;
          T === t && (T = o[x]), m ? Wi(c, x, T) : ls(c, x, T);
        }
        return c;
      }
      function ab(o, a) {
        return di(o, ZO(o), a);
      }
      function Ob(o, a) {
        return di(o, id(o), a);
      }
      function zo(o, a) {
        return function(c, p) {
          var m = se(c) ? dS : _$, S = a ? a() : {};
          return m(c, o, J(p, 2), S);
        };
      }
      function ur(o) {
        return he(function(a, c) {
          var p = -1, m = c.length, S = m > 1 ? c[m - 1] : t, y = m > 2 ? c[2] : t;
          for (S = o.length > 3 && typeof S == "function" ? (m--, S) : t, y && pt(c[0], c[1], y) && (S = m < 3 ? t : S, m = 1), a = ye(a); ++p < m; ) {
            var x = c[p];
            x && o(a, x, p, S);
          }
          return a;
        });
      }
      function Du(o, a) {
        return function(c, p) {
          if (c == null)
            return c;
          if (!bt(c))
            return o(c, p);
          for (var m = c.length, S = a ? m : -1, y = ye(c); (a ? S-- : ++S < m) && p(y[S], S, y) !== !1; )
            ;
          return c;
        };
      }
      function Iu(o) {
        return function(a, c, p) {
          for (var m = -1, S = ye(a), y = p(a), x = y.length; x--; ) {
            var T = y[o ? x : ++m];
            if (c(S[T], T, S) === !1)
              break;
          }
          return a;
        };
      }
      function hb(o, a, c) {
        var p = a & w, m = fs(o);
        function S() {
          var y = this && this !== tt && this instanceof S ? m : o;
          return y.apply(p ? c : this, arguments);
        }
        return S;
      }
      function Lu(o) {
        return function(a) {
          a = $e(a);
          var c = or(a) ? ri(a) : t, p = c ? c[0] : a.charAt(0), m = c ? an(c, 1).join("") : a.slice(1);
          return p[o]() + m;
        };
      }
      function dr(o) {
        return function(a) {
          return Ba(Dd(Gd(a).replace(eS, "")), o, "");
        };
      }
      function fs(o) {
        return function() {
          var a = arguments;
          switch (a.length) {
            case 0:
              return new o();
            case 1:
              return new o(a[0]);
            case 2:
              return new o(a[0], a[1]);
            case 3:
              return new o(a[0], a[1], a[2]);
            case 4:
              return new o(a[0], a[1], a[2], a[3]);
            case 5:
              return new o(a[0], a[1], a[2], a[3], a[4]);
            case 6:
              return new o(a[0], a[1], a[2], a[3], a[4], a[5]);
            case 7:
              return new o(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
          }
          var c = fr(o.prototype), p = o.apply(c, a);
          return We(p) ? p : c;
        };
      }
      function cb(o, a, c) {
        var p = fs(o);
        function m() {
          for (var S = arguments.length, y = R(S), x = S, T = pr(m); x--; )
            y[x] = arguments[x];
          var q = S < 3 && y[0] !== T && y[S - 1] !== T ? [] : nn(y, T);
          if (S -= q.length, S < c)
            return Hu(
              o,
              a,
              Eo,
              m.placeholder,
              t,
              y,
              q,
              t,
              t,
              c - S
            );
          var C = this && this !== tt && this instanceof m ? p : o;
          return _t(C, this, y);
        }
        return m;
      }
      function Bu(o) {
        return function(a, c, p) {
          var m = ye(a);
          if (!bt(a)) {
            var S = J(c, 3);
            a = et(a), c = function(x) {
              return S(m[x], x, m);
            };
          }
          var y = o(a, c, p);
          return y > -1 ? m[S ? a[y] : y] : t;
        };
      }
      function ju(o) {
        return Ai(function(a) {
          var c = a.length, p = c, m = It.prototype.thru;
          for (o && a.reverse(); p--; ) {
            var S = a[p];
            if (typeof S != "function")
              throw new Dt(l);
            if (m && !y && Io(S) == "wrapper")
              var y = new It([], !0);
          }
          for (p = y ? p : c; ++p < c; ) {
            S = a[p];
            var x = Io(S), T = x == "wrapper" ? kO(S) : t;
            T && _O(T[0]) && T[1] == (z | U | W | te) && !T[4].length && T[9] == 1 ? y = y[Io(T[0])].apply(y, T[3]) : y = S.length == 1 && _O(S) ? y[x]() : y.thru(S);
          }
          return function() {
            var q = arguments, C = q[0];
            if (y && q.length == 1 && se(C))
              return y.plant(C).value();
            for (var A = 0, D = c ? a[A].apply(this, q) : C; ++A < c; )
              D = a[A].call(this, D);
            return D;
          };
        });
      }
      function Eo(o, a, c, p, m, S, y, x, T, q) {
        var C = a & z, A = a & w, D = a & Z, F = a & (U | V), K = a & oe, Oe = D ? t : fs(o);
        function ee() {
          for (var de = arguments.length, me = R(de), Wt = de; Wt--; )
            me[Wt] = arguments[Wt];
          if (F)
            var gt = pr(ee), Yt = yS(me, gt);
          if (p && (me = Mu(me, p, m, F)), S && (me = Gu(me, S, y, F)), de -= Yt, F && de < q) {
            var Me = nn(me, gt);
            return Hu(
              o,
              a,
              Eo,
              ee.placeholder,
              c,
              me,
              Me,
              x,
              T,
              q - de
            );
          }
          var li = A ? c : this, Ei = D ? li[o] : o;
          return de = me.length, x ? me = _b(me, x) : K && de > 1 && me.reverse(), C && T < de && (me.length = T), this && this !== tt && this instanceof ee && (Ei = Oe || fs(Ei)), Ei.apply(li, me);
        }
        return ee;
      }
      function Nu(o, a) {
        return function(c, p) {
          return V$(c, o, a(p), {});
        };
      }
      function Mo(o, a) {
        return function(c, p) {
          var m;
          if (c === t && p === t)
            return a;
          if (c !== t && (m = c), p !== t) {
            if (m === t)
              return p;
            typeof c == "string" || typeof p == "string" ? (c = qt(c), p = qt(p)) : (c = Cu(c), p = Cu(p)), m = o(c, p);
          }
          return m;
        };
      }
      function yO(o) {
        return Ai(function(a) {
          return a = Xe(a, Xt(J())), he(function(c) {
            var p = this;
            return o(a, function(m) {
              return _t(m, p, c);
            });
          });
        });
      }
      function Go(o, a) {
        a = a === t ? " " : qt(a);
        var c = a.length;
        if (c < 2)
          return c ? gO(a, o) : a;
        var p = gO(a, Zo(o / lr(a)));
        return or(a) ? an(ri(p), 0, o).join("") : p.slice(0, o);
      }
      function fb(o, a, c, p) {
        var m = a & w, S = fs(o);
        function y() {
          for (var x = -1, T = arguments.length, q = -1, C = p.length, A = R(C + T), D = this && this !== tt && this instanceof y ? S : o; ++q < C; )
            A[q] = p[q];
          for (; T--; )
            A[q++] = arguments[++x];
          return _t(D, m ? c : this, A);
        }
        return y;
      }
      function Fu(o) {
        return function(a, c, p) {
          return p && typeof p != "number" && pt(a, c, p) && (c = p = t), a = zi(a), c === t ? (c = a, a = 0) : c = zi(c), p = p === t ? a < c ? 1 : -1 : zi(p), H$(a, c, p, o);
        };
      }
      function Do(o) {
        return function(a, c) {
          return typeof a == "string" && typeof c == "string" || (a = Nt(a), c = Nt(c)), o(a, c);
        };
      }
      function Hu(o, a, c, p, m, S, y, x, T, q) {
        var C = a & U, A = C ? y : t, D = C ? t : y, F = C ? S : t, K = C ? t : S;
        a |= C ? W : M, a &= ~(C ? M : W), a & Y || (a &= ~(w | Z));
        var Oe = [
          o,
          a,
          m,
          F,
          A,
          K,
          D,
          x,
          T,
          q
        ], ee = c.apply(t, Oe);
        return _O(o) && Od(ee, Oe), ee.placeholder = p, hd(ee, o, a);
      }
      function xO(o) {
        var a = He[o];
        return function(c, p) {
          if (c = Nt(c), p = p == null ? 0 : Ot(ae(p), 292), p && hu(c)) {
            var m = ($e(c) + "e").split("e"), S = a(m[0] + "e" + (+m[1] + p));
            return m = ($e(S) + "e").split("e"), +(m[0] + "e" + (+m[1] - p));
          }
          return a(c);
        };
      }
      var ub = hr && 1 / Po(new hr([, -0]))[1] == Ae ? function(o) {
        return new hr(o);
      } : LO;
      function Ju(o) {
        return function(a) {
          var c = ht(a);
          return c == ii ? eO(a) : c == ni ? RS(a) : bS(a, o(a));
        };
      }
      function Yi(o, a, c, p, m, S, y, x) {
        var T = a & Z;
        if (!T && typeof o != "function")
          throw new Dt(l);
        var q = p ? p.length : 0;
        if (q || (a &= ~(W | M), p = m = t), y = y === t ? y : Je(ae(y), 0), x = x === t ? x : ae(x), q -= m ? m.length : 0, a & M) {
          var C = p, A = m;
          p = m = t;
        }
        var D = T ? t : kO(o), F = [
          o,
          a,
          c,
          p,
          m,
          C,
          A,
          S,
          y,
          x
        ];
        if (D && Tb(F, D), o = F[0], a = F[1], c = F[2], p = F[3], m = F[4], x = F[9] = F[9] === t ? T ? 0 : o.length : Je(F[9] - q, 0), !x && a & (U | V) && (a &= ~(U | V)), !a || a == w)
          var K = hb(o, a, c);
        else a == U || a == V ? K = cb(o, a, x) : (a == W || a == (w | W)) && !m.length ? K = fb(o, a, c, p) : K = Eo.apply(t, F);
        var Oe = D ? Xu : Od;
        return hd(Oe(K, F), o, a);
      }
      function Ku(o, a, c, p) {
        return o === t || oi(o, Or[c]) && !be.call(p, c) ? a : o;
      }
      function ed(o, a, c, p, m, S) {
        return We(o) && We(a) && (S.set(a, o), Ao(o, a, t, ed, S), S.delete(a)), o;
      }
      function db(o) {
        return ps(o) ? t : o;
      }
      function td(o, a, c, p, m, S) {
        var y = c & b, x = o.length, T = a.length;
        if (x != T && !(y && T > x))
          return !1;
        var q = S.get(o), C = S.get(a);
        if (q && C)
          return q == a && C == o;
        var A = -1, D = !0, F = c & v ? new Cn() : t;
        for (S.set(o, a), S.set(a, o); ++A < x; ) {
          var K = o[A], Oe = a[A];
          if (p)
            var ee = y ? p(Oe, K, A, a, o, S) : p(K, Oe, A, o, a, S);
          if (ee !== t) {
            if (ee)
              continue;
            D = !1;
            break;
          }
          if (F) {
            if (!ja(a, function(de, me) {
              if (!ts(F, me) && (K === de || m(K, de, c, p, S)))
                return F.push(me);
            })) {
              D = !1;
              break;
            }
          } else if (!(K === Oe || m(K, Oe, c, p, S))) {
            D = !1;
            break;
          }
        }
        return S.delete(o), S.delete(a), D;
      }
      function pb(o, a, c, p, m, S, y) {
        switch (c) {
          case nr:
            if (o.byteLength != a.byteLength || o.byteOffset != a.byteOffset)
              return !1;
            o = o.buffer, a = a.buffer;
          case es:
            return !(o.byteLength != a.byteLength || !S(new vo(o), new vo(a)));
          case jr:
          case Nr:
          case Fr:
            return oi(+o, +a);
          case ho:
            return o.name == a.name && o.message == a.message;
          case Hr:
          case Jr:
            return o == a + "";
          case ii:
            var x = eO;
          case ni:
            var T = p & b;
            if (x || (x = Po), o.size != a.size && !T)
              return !1;
            var q = y.get(o);
            if (q)
              return q == a;
            p |= v, y.set(o, a);
            var C = td(x(o), x(a), p, m, S, y);
            return y.delete(o), C;
          case fo:
            if (os)
              return os.call(o) == os.call(a);
        }
        return !1;
      }
      function gb(o, a, c, p, m, S) {
        var y = c & b, x = vO(o), T = x.length, q = vO(a), C = q.length;
        if (T != C && !y)
          return !1;
        for (var A = T; A--; ) {
          var D = x[A];
          if (!(y ? D in a : be.call(a, D)))
            return !1;
        }
        var F = S.get(o), K = S.get(a);
        if (F && K)
          return F == a && K == o;
        var Oe = !0;
        S.set(o, a), S.set(a, o);
        for (var ee = y; ++A < T; ) {
          D = x[A];
          var de = o[D], me = a[D];
          if (p)
            var Wt = y ? p(me, de, D, a, o, S) : p(de, me, D, o, a, S);
          if (!(Wt === t ? de === me || m(de, me, c, p, S) : Wt)) {
            Oe = !1;
            break;
          }
          ee || (ee = D == "constructor");
        }
        if (Oe && !ee) {
          var gt = o.constructor, Yt = a.constructor;
          gt != Yt && "constructor" in o && "constructor" in a && !(typeof gt == "function" && gt instanceof gt && typeof Yt == "function" && Yt instanceof Yt) && (Oe = !1);
        }
        return S.delete(o), S.delete(a), Oe;
      }
      function Ai(o) {
        return qO(ld(o, t, gd), o + "");
      }
      function vO(o) {
        return $u(o, et, ZO);
      }
      function wO(o) {
        return $u(o, yt, id);
      }
      var kO = _o ? function(o) {
        return _o.get(o);
      } : LO;
      function Io(o) {
        for (var a = o.name + "", c = cr[a], p = be.call(cr, a) ? c.length : 0; p--; ) {
          var m = c[p], S = m.func;
          if (S == null || S == o)
            return m.name;
        }
        return a;
      }
      function pr(o) {
        var a = be.call(P, "placeholder") ? P : o;
        return a.placeholder;
      }
      function J() {
        var o = P.iteratee || DO;
        return o = o === DO ? xu : o, arguments.length ? o(arguments[0], arguments[1]) : o;
      }
      function Lo(o, a) {
        var c = o.__data__;
        return xb(a) ? c[typeof a == "string" ? "string" : "hash"] : c.map;
      }
      function TO(o) {
        for (var a = et(o), c = a.length; c--; ) {
          var p = a[c], m = o[p];
          a[c] = [p, m, sd(m)];
        }
        return a;
      }
      function An(o, a) {
        var c = kS(o, a);
        return yu(c) ? c : t;
      }
      function mb(o) {
        var a = be.call(o, Xn), c = o[Xn];
        try {
          o[Xn] = t;
          var p = !0;
        } catch {
        }
        var m = yo.call(o);
        return p && (a ? o[Xn] = c : delete o[Xn]), m;
      }
      var ZO = iO ? function(o) {
        return o == null ? [] : (o = ye(o), en(iO(o), function(a) {
          return au.call(o, a);
        }));
      } : BO, id = iO ? function(o) {
        for (var a = []; o; )
          tn(a, ZO(o)), o = wo(o);
        return a;
      } : BO, ht = dt;
      (nO && ht(new nO(new ArrayBuffer(1))) != nr || ns && ht(new ns()) != ii || rO && ht(rO.resolve()) != Qf || hr && ht(new hr()) != ni || rs && ht(new rs()) != Kr) && (ht = function(o) {
        var a = dt(o), c = a == Xi ? o.constructor : t, p = c ? Un(c) : "";
        if (p)
          switch (p) {
            case KS:
              return nr;
            case e$:
              return ii;
            case t$:
              return Qf;
            case i$:
              return ni;
            case n$:
              return Kr;
          }
        return a;
      });
      function Qb(o, a, c) {
        for (var p = -1, m = c.length; ++p < m; ) {
          var S = c[p], y = S.size;
          switch (S.type) {
            case "drop":
              o += y;
              break;
            case "dropRight":
              a -= y;
              break;
            case "take":
              a = Ot(a, o + y);
              break;
            case "takeRight":
              o = Je(o, a - y);
              break;
          }
        }
        return { start: o, end: a };
      }
      function Pb(o) {
        var a = o.match(vP);
        return a ? a[1].split(wP) : [];
      }
      function nd(o, a, c) {
        a = ln(a, o);
        for (var p = -1, m = a.length, S = !1; ++p < m; ) {
          var y = pi(a[p]);
          if (!(S = o != null && c(o, y)))
            break;
          o = o[y];
        }
        return S || ++p != m ? S : (m = o == null ? 0 : o.length, !!m && Ko(m) && Ui(y, m) && (se(o) || Vn(o)));
      }
      function Sb(o) {
        var a = o.length, c = new o.constructor(a);
        return a && typeof o[0] == "string" && be.call(o, "index") && (c.index = o.index, c.input = o.input), c;
      }
      function rd(o) {
        return typeof o.constructor == "function" && !us(o) ? fr(wo(o)) : {};
      }
      function $b(o, a, c) {
        var p = o.constructor;
        switch (a) {
          case es:
            return bO(o);
          case jr:
          case Nr:
            return new p(+o);
          case nr:
            return rb(o, c);
          case Ta:
          case Za:
          case Ra:
          case _a:
          case Xa:
          case qa:
          case Ca:
          case Wa:
          case Ya:
            return zu(o, c);
          case ii:
            return new p();
          case Fr:
          case Jr:
            return new p(o);
          case Hr:
            return sb(o);
          case ni:
            return new p();
          case fo:
            return ob(o);
        }
      }
      function bb(o, a) {
        var c = a.length;
        if (!c)
          return o;
        var p = c - 1;
        return a[p] = (c > 1 ? "& " : "") + a[p], a = a.join(c > 2 ? ", " : " "), o.replace(xP, `{
/* [wrapped with ` + a + `] */
`);
      }
      function yb(o) {
        return se(o) || Vn(o) || !!(Ou && o && o[Ou]);
      }
      function Ui(o, a) {
        var c = typeof o;
        return a = a ?? Ue, !!a && (c == "number" || c != "symbol" && WP.test(o)) && o > -1 && o % 1 == 0 && o < a;
      }
      function pt(o, a, c) {
        if (!We(c))
          return !1;
        var p = typeof a;
        return (p == "number" ? bt(c) && Ui(a, c.length) : p == "string" && a in c) ? oi(c[a], o) : !1;
      }
      function RO(o, a) {
        if (se(o))
          return !1;
        var c = typeof o;
        return c == "number" || c == "symbol" || c == "boolean" || o == null || Ct(o) ? !0 : SP.test(o) || !PP.test(o) || a != null && o in ye(a);
      }
      function xb(o) {
        var a = typeof o;
        return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? o !== "__proto__" : o === null;
      }
      function _O(o) {
        var a = Io(o), c = P[a];
        if (typeof c != "function" || !(a in ge.prototype))
          return !1;
        if (o === c)
          return !0;
        var p = kO(c);
        return !!p && o === p[0];
      }
      function vb(o) {
        return !!su && su in o;
      }
      var wb = $o ? Vi : jO;
      function us(o) {
        var a = o && o.constructor, c = typeof a == "function" && a.prototype || Or;
        return o === c;
      }
      function sd(o) {
        return o === o && !We(o);
      }
      function od(o, a) {
        return function(c) {
          return c == null ? !1 : c[o] === a && (a !== t || o in ye(c));
        };
      }
      function kb(o) {
        var a = Ho(o, function(p) {
          return c.size === f && c.clear(), p;
        }), c = a.cache;
        return a;
      }
      function Tb(o, a) {
        var c = o[1], p = a[1], m = c | p, S = m < (w | Z | z), y = p == z && c == U || p == z && c == te && o[7].length <= a[8] || p == (z | te) && a[7].length <= a[8] && c == U;
        if (!(S || y))
          return o;
        p & w && (o[2] = a[2], m |= c & w ? 0 : Y);
        var x = a[3];
        if (x) {
          var T = o[3];
          o[3] = T ? Mu(T, x, a[4]) : x, o[4] = T ? nn(o[3], u) : a[4];
        }
        return x = a[5], x && (T = o[5], o[5] = T ? Gu(T, x, a[6]) : x, o[6] = T ? nn(o[5], u) : a[6]), x = a[7], x && (o[7] = x), p & z && (o[8] = o[8] == null ? a[8] : Ot(o[8], a[8])), o[9] == null && (o[9] = a[9]), o[0] = a[0], o[1] = m, o;
      }
      function Zb(o) {
        var a = [];
        if (o != null)
          for (var c in ye(o))
            a.push(c);
        return a;
      }
      function Rb(o) {
        return yo.call(o);
      }
      function ld(o, a, c) {
        return a = Je(a === t ? o.length - 1 : a, 0), function() {
          for (var p = arguments, m = -1, S = Je(p.length - a, 0), y = R(S); ++m < S; )
            y[m] = p[a + m];
          m = -1;
          for (var x = R(a + 1); ++m < a; )
            x[m] = p[m];
          return x[a] = c(y), _t(o, this, x);
        };
      }
      function ad(o, a) {
        return a.length < 2 ? o : Yn(o, Bt(a, 0, -1));
      }
      function _b(o, a) {
        for (var c = o.length, p = Ot(a.length, c), m = $t(o); p--; ) {
          var S = a[p];
          o[p] = Ui(S, c) ? m[S] : t;
        }
        return o;
      }
      function XO(o, a) {
        if (!(a === "constructor" && typeof o[a] == "function") && a != "__proto__")
          return o[a];
      }
      var Od = cd(Xu), ds = LS || function(o, a) {
        return tt.setTimeout(o, a);
      }, qO = cd(eb);
      function hd(o, a, c) {
        var p = a + "";
        return qO(o, bb(p, Xb(Pb(p), c)));
      }
      function cd(o) {
        var a = 0, c = 0;
        return function() {
          var p = FS(), m = E - (p - c);
          if (c = p, m > 0) {
            if (++a >= ne)
              return arguments[0];
          } else
            a = 0;
          return o.apply(t, arguments);
        };
      }
      function Bo(o, a) {
        var c = -1, p = o.length, m = p - 1;
        for (a = a === t ? p : a; ++c < a; ) {
          var S = pO(c, m), y = o[S];
          o[S] = o[c], o[c] = y;
        }
        return o.length = a, o;
      }
      var fd = kb(function(o) {
        var a = [];
        return o.charCodeAt(0) === 46 && a.push(""), o.replace($P, function(c, p, m, S) {
          a.push(m ? S.replace(ZP, "$1") : p || c);
        }), a;
      });
      function pi(o) {
        if (typeof o == "string" || Ct(o))
          return o;
        var a = o + "";
        return a == "0" && 1 / o == -Ae ? "-0" : a;
      }
      function Un(o) {
        if (o != null) {
          try {
            return bo.call(o);
          } catch {
          }
          try {
            return o + "";
          } catch {
          }
        }
        return "";
      }
      function Xb(o, a) {
        return Gt(Ki, function(c) {
          var p = "_." + c[0];
          a & c[1] && !mo(o, p) && o.push(p);
        }), o.sort();
      }
      function ud(o) {
        if (o instanceof ge)
          return o.clone();
        var a = new It(o.__wrapped__, o.__chain__);
        return a.__actions__ = $t(o.__actions__), a.__index__ = o.__index__, a.__values__ = o.__values__, a;
      }
      function qb(o, a, c) {
        (c ? pt(o, a, c) : a === t) ? a = 1 : a = Je(ae(a), 0);
        var p = o == null ? 0 : o.length;
        if (!p || a < 1)
          return [];
        for (var m = 0, S = 0, y = R(Zo(p / a)); m < p; )
          y[S++] = Bt(o, m, m += a);
        return y;
      }
      function Cb(o) {
        for (var a = -1, c = o == null ? 0 : o.length, p = 0, m = []; ++a < c; ) {
          var S = o[a];
          S && (m[p++] = S);
        }
        return m;
      }
      function Wb() {
        var o = arguments.length;
        if (!o)
          return [];
        for (var a = R(o - 1), c = arguments[0], p = o; p--; )
          a[p - 1] = arguments[p];
        return tn(se(c) ? $t(c) : [c], it(a, 1));
      }
      var Yb = he(function(o, a) {
        return Ee(o) ? as(o, it(a, 1, Ee, !0)) : [];
      }), Ab = he(function(o, a) {
        var c = jt(a);
        return Ee(c) && (c = t), Ee(o) ? as(o, it(a, 1, Ee, !0), J(c, 2)) : [];
      }), Ub = he(function(o, a) {
        var c = jt(a);
        return Ee(c) && (c = t), Ee(o) ? as(o, it(a, 1, Ee, !0), t, c) : [];
      });
      function Vb(o, a, c) {
        var p = o == null ? 0 : o.length;
        return p ? (a = c || a === t ? 1 : ae(a), Bt(o, a < 0 ? 0 : a, p)) : [];
      }
      function zb(o, a, c) {
        var p = o == null ? 0 : o.length;
        return p ? (a = c || a === t ? 1 : ae(a), a = p - a, Bt(o, 0, a < 0 ? 0 : a)) : [];
      }
      function Eb(o, a) {
        return o && o.length ? Vo(o, J(a, 3), !0, !0) : [];
      }
      function Mb(o, a) {
        return o && o.length ? Vo(o, J(a, 3), !0) : [];
      }
      function Gb(o, a, c, p) {
        var m = o == null ? 0 : o.length;
        return m ? (c && typeof c != "number" && pt(o, a, c) && (c = 0, p = m), W$(o, a, c, p)) : [];
      }
      function dd(o, a, c) {
        var p = o == null ? 0 : o.length;
        if (!p)
          return -1;
        var m = c == null ? 0 : ae(c);
        return m < 0 && (m = Je(p + m, 0)), Qo(o, J(a, 3), m);
      }
      function pd(o, a, c) {
        var p = o == null ? 0 : o.length;
        if (!p)
          return -1;
        var m = p - 1;
        return c !== t && (m = ae(c), m = c < 0 ? Je(p + m, 0) : Ot(m, p - 1)), Qo(o, J(a, 3), m, !0);
      }
      function gd(o) {
        var a = o == null ? 0 : o.length;
        return a ? it(o, 1) : [];
      }
      function Db(o) {
        var a = o == null ? 0 : o.length;
        return a ? it(o, Ae) : [];
      }
      function Ib(o, a) {
        var c = o == null ? 0 : o.length;
        return c ? (a = a === t ? 1 : ae(a), it(o, a)) : [];
      }
      function Lb(o) {
        for (var a = -1, c = o == null ? 0 : o.length, p = {}; ++a < c; ) {
          var m = o[a];
          p[m[0]] = m[1];
        }
        return p;
      }
      function md(o) {
        return o && o.length ? o[0] : t;
      }
      function Bb(o, a, c) {
        var p = o == null ? 0 : o.length;
        if (!p)
          return -1;
        var m = c == null ? 0 : ae(c);
        return m < 0 && (m = Je(p + m, 0)), sr(o, a, m);
      }
      function jb(o) {
        var a = o == null ? 0 : o.length;
        return a ? Bt(o, 0, -1) : [];
      }
      var Nb = he(function(o) {
        var a = Xe(o, SO);
        return a.length && a[0] === o[0] ? hO(a) : [];
      }), Fb = he(function(o) {
        var a = jt(o), c = Xe(o, SO);
        return a === jt(c) ? a = t : c.pop(), c.length && c[0] === o[0] ? hO(c, J(a, 2)) : [];
      }), Hb = he(function(o) {
        var a = jt(o), c = Xe(o, SO);
        return a = typeof a == "function" ? a : t, a && c.pop(), c.length && c[0] === o[0] ? hO(c, t, a) : [];
      });
      function Jb(o, a) {
        return o == null ? "" : jS.call(o, a);
      }
      function jt(o) {
        var a = o == null ? 0 : o.length;
        return a ? o[a - 1] : t;
      }
      function Kb(o, a, c) {
        var p = o == null ? 0 : o.length;
        if (!p)
          return -1;
        var m = p;
        return c !== t && (m = ae(c), m = m < 0 ? Je(p + m, 0) : Ot(m, p - 1)), a === a ? XS(o, a, m) : Qo(o, Hf, m, !0);
      }
      function ey(o, a) {
        return o && o.length ? Tu(o, ae(a)) : t;
      }
      var ty = he(Qd);
      function Qd(o, a) {
        return o && o.length && a && a.length ? dO(o, a) : o;
      }
      function iy(o, a, c) {
        return o && o.length && a && a.length ? dO(o, a, J(c, 2)) : o;
      }
      function ny(o, a, c) {
        return o && o.length && a && a.length ? dO(o, a, t, c) : o;
      }
      var ry = Ai(function(o, a) {
        var c = o == null ? 0 : o.length, p = oO(o, a);
        return _u(o, Xe(a, function(m) {
          return Ui(m, c) ? +m : m;
        }).sort(Eu)), p;
      });
      function sy(o, a) {
        var c = [];
        if (!(o && o.length))
          return c;
        var p = -1, m = [], S = o.length;
        for (a = J(a, 3); ++p < S; ) {
          var y = o[p];
          a(y, p, o) && (c.push(y), m.push(p));
        }
        return _u(o, m), c;
      }
      function CO(o) {
        return o == null ? o : JS.call(o);
      }
      function oy(o, a, c) {
        var p = o == null ? 0 : o.length;
        return p ? (c && typeof c != "number" && pt(o, a, c) ? (a = 0, c = p) : (a = a == null ? 0 : ae(a), c = c === t ? p : ae(c)), Bt(o, a, c)) : [];
      }
      function ly(o, a) {
        return Uo(o, a);
      }
      function ay(o, a, c) {
        return mO(o, a, J(c, 2));
      }
      function Oy(o, a) {
        var c = o == null ? 0 : o.length;
        if (c) {
          var p = Uo(o, a);
          if (p < c && oi(o[p], a))
            return p;
        }
        return -1;
      }
      function hy(o, a) {
        return Uo(o, a, !0);
      }
      function cy(o, a, c) {
        return mO(o, a, J(c, 2), !0);
      }
      function fy(o, a) {
        var c = o == null ? 0 : o.length;
        if (c) {
          var p = Uo(o, a, !0) - 1;
          if (oi(o[p], a))
            return p;
        }
        return -1;
      }
      function uy(o) {
        return o && o.length ? qu(o) : [];
      }
      function dy(o, a) {
        return o && o.length ? qu(o, J(a, 2)) : [];
      }
      function py(o) {
        var a = o == null ? 0 : o.length;
        return a ? Bt(o, 1, a) : [];
      }
      function gy(o, a, c) {
        return o && o.length ? (a = c || a === t ? 1 : ae(a), Bt(o, 0, a < 0 ? 0 : a)) : [];
      }
      function my(o, a, c) {
        var p = o == null ? 0 : o.length;
        return p ? (a = c || a === t ? 1 : ae(a), a = p - a, Bt(o, a < 0 ? 0 : a, p)) : [];
      }
      function Qy(o, a) {
        return o && o.length ? Vo(o, J(a, 3), !1, !0) : [];
      }
      function Py(o, a) {
        return o && o.length ? Vo(o, J(a, 3)) : [];
      }
      var Sy = he(function(o) {
        return on(it(o, 1, Ee, !0));
      }), $y = he(function(o) {
        var a = jt(o);
        return Ee(a) && (a = t), on(it(o, 1, Ee, !0), J(a, 2));
      }), by = he(function(o) {
        var a = jt(o);
        return a = typeof a == "function" ? a : t, on(it(o, 1, Ee, !0), t, a);
      });
      function yy(o) {
        return o && o.length ? on(o) : [];
      }
      function xy(o, a) {
        return o && o.length ? on(o, J(a, 2)) : [];
      }
      function vy(o, a) {
        return a = typeof a == "function" ? a : t, o && o.length ? on(o, t, a) : [];
      }
      function WO(o) {
        if (!(o && o.length))
          return [];
        var a = 0;
        return o = en(o, function(c) {
          if (Ee(c))
            return a = Je(c.length, a), !0;
        }), Ja(a, function(c) {
          return Xe(o, Na(c));
        });
      }
      function Pd(o, a) {
        if (!(o && o.length))
          return [];
        var c = WO(o);
        return a == null ? c : Xe(c, function(p) {
          return _t(a, t, p);
        });
      }
      var wy = he(function(o, a) {
        return Ee(o) ? as(o, a) : [];
      }), ky = he(function(o) {
        return PO(en(o, Ee));
      }), Ty = he(function(o) {
        var a = jt(o);
        return Ee(a) && (a = t), PO(en(o, Ee), J(a, 2));
      }), Zy = he(function(o) {
        var a = jt(o);
        return a = typeof a == "function" ? a : t, PO(en(o, Ee), t, a);
      }), Ry = he(WO);
      function _y(o, a) {
        return Au(o || [], a || [], ls);
      }
      function Xy(o, a) {
        return Au(o || [], a || [], cs);
      }
      var qy = he(function(o) {
        var a = o.length, c = a > 1 ? o[a - 1] : t;
        return c = typeof c == "function" ? (o.pop(), c) : t, Pd(o, c);
      });
      function Sd(o) {
        var a = P(o);
        return a.__chain__ = !0, a;
      }
      function Cy(o, a) {
        return a(o), o;
      }
      function jo(o, a) {
        return a(o);
      }
      var Wy = Ai(function(o) {
        var a = o.length, c = a ? o[0] : 0, p = this.__wrapped__, m = function(S) {
          return oO(S, o);
        };
        return a > 1 || this.__actions__.length || !(p instanceof ge) || !Ui(c) ? this.thru(m) : (p = p.slice(c, +c + (a ? 1 : 0)), p.__actions__.push({
          func: jo,
          args: [m],
          thisArg: t
        }), new It(p, this.__chain__).thru(function(S) {
          return a && !S.length && S.push(t), S;
        }));
      });
      function Yy() {
        return Sd(this);
      }
      function Ay() {
        return new It(this.value(), this.__chain__);
      }
      function Uy() {
        this.__values__ === t && (this.__values__ = Cd(this.value()));
        var o = this.__index__ >= this.__values__.length, a = o ? t : this.__values__[this.__index__++];
        return { done: o, value: a };
      }
      function Vy() {
        return this;
      }
      function zy(o) {
        for (var a, c = this; c instanceof qo; ) {
          var p = ud(c);
          p.__index__ = 0, p.__values__ = t, a ? m.__wrapped__ = p : a = p;
          var m = p;
          c = c.__wrapped__;
        }
        return m.__wrapped__ = o, a;
      }
      function Ey() {
        var o = this.__wrapped__;
        if (o instanceof ge) {
          var a = o;
          return this.__actions__.length && (a = new ge(this)), a = a.reverse(), a.__actions__.push({
            func: jo,
            args: [CO],
            thisArg: t
          }), new It(a, this.__chain__);
        }
        return this.thru(CO);
      }
      function My() {
        return Yu(this.__wrapped__, this.__actions__);
      }
      var Gy = zo(function(o, a, c) {
        be.call(o, c) ? ++o[c] : Wi(o, c, 1);
      });
      function Dy(o, a, c) {
        var p = se(o) ? Nf : C$;
        return c && pt(o, a, c) && (a = t), p(o, J(a, 3));
      }
      function Iy(o, a) {
        var c = se(o) ? en : Pu;
        return c(o, J(a, 3));
      }
      var Ly = Bu(dd), By = Bu(pd);
      function jy(o, a) {
        return it(No(o, a), 1);
      }
      function Ny(o, a) {
        return it(No(o, a), Ae);
      }
      function Fy(o, a, c) {
        return c = c === t ? 1 : ae(c), it(No(o, a), c);
      }
      function $d(o, a) {
        var c = se(o) ? Gt : sn;
        return c(o, J(a, 3));
      }
      function bd(o, a) {
        var c = se(o) ? pS : Qu;
        return c(o, J(a, 3));
      }
      var Hy = zo(function(o, a, c) {
        be.call(o, c) ? o[c].push(a) : Wi(o, c, [a]);
      });
      function Jy(o, a, c, p) {
        o = bt(o) ? o : mr(o), c = c && !p ? ae(c) : 0;
        var m = o.length;
        return c < 0 && (c = Je(m + c, 0)), el(o) ? c <= m && o.indexOf(a, c) > -1 : !!m && sr(o, a, c) > -1;
      }
      var Ky = he(function(o, a, c) {
        var p = -1, m = typeof a == "function", S = bt(o) ? R(o.length) : [];
        return sn(o, function(y) {
          S[++p] = m ? _t(a, y, c) : Os(y, a, c);
        }), S;
      }), ex = zo(function(o, a, c) {
        Wi(o, c, a);
      });
      function No(o, a) {
        var c = se(o) ? Xe : vu;
        return c(o, J(a, 3));
      }
      function tx(o, a, c, p) {
        return o == null ? [] : (se(a) || (a = a == null ? [] : [a]), c = p ? t : c, se(c) || (c = c == null ? [] : [c]), Zu(o, a, c));
      }
      var ix = zo(function(o, a, c) {
        o[c ? 0 : 1].push(a);
      }, function() {
        return [[], []];
      });
      function nx(o, a, c) {
        var p = se(o) ? Ba : Kf, m = arguments.length < 3;
        return p(o, J(a, 4), c, m, sn);
      }
      function rx(o, a, c) {
        var p = se(o) ? gS : Kf, m = arguments.length < 3;
        return p(o, J(a, 4), c, m, Qu);
      }
      function sx(o, a) {
        var c = se(o) ? en : Pu;
        return c(o, Jo(J(a, 3)));
      }
      function ox(o) {
        var a = se(o) ? du : J$;
        return a(o);
      }
      function lx(o, a, c) {
        (c ? pt(o, a, c) : a === t) ? a = 1 : a = ae(a);
        var p = se(o) ? Z$ : K$;
        return p(o, a);
      }
      function ax(o) {
        var a = se(o) ? R$ : tb;
        return a(o);
      }
      function Ox(o) {
        if (o == null)
          return 0;
        if (bt(o))
          return el(o) ? lr(o) : o.length;
        var a = ht(o);
        return a == ii || a == ni ? o.size : fO(o).length;
      }
      function hx(o, a, c) {
        var p = se(o) ? ja : ib;
        return c && pt(o, a, c) && (a = t), p(o, J(a, 3));
      }
      var cx = he(function(o, a) {
        if (o == null)
          return [];
        var c = a.length;
        return c > 1 && pt(o, a[0], a[1]) ? a = [] : c > 2 && pt(a[0], a[1], a[2]) && (a = [a[0]]), Zu(o, it(a, 1), []);
      }), Fo = IS || function() {
        return tt.Date.now();
      };
      function fx(o, a) {
        if (typeof a != "function")
          throw new Dt(l);
        return o = ae(o), function() {
          if (--o < 1)
            return a.apply(this, arguments);
        };
      }
      function yd(o, a, c) {
        return a = c ? t : a, a = o && a == null ? o.length : a, Yi(o, z, t, t, t, t, a);
      }
      function xd(o, a) {
        var c;
        if (typeof a != "function")
          throw new Dt(l);
        return o = ae(o), function() {
          return --o > 0 && (c = a.apply(this, arguments)), o <= 1 && (a = t), c;
        };
      }
      var YO = he(function(o, a, c) {
        var p = w;
        if (c.length) {
          var m = nn(c, pr(YO));
          p |= W;
        }
        return Yi(o, p, a, c, m);
      }), vd = he(function(o, a, c) {
        var p = w | Z;
        if (c.length) {
          var m = nn(c, pr(vd));
          p |= W;
        }
        return Yi(a, p, o, c, m);
      });
      function wd(o, a, c) {
        a = c ? t : a;
        var p = Yi(o, U, t, t, t, t, t, a);
        return p.placeholder = wd.placeholder, p;
      }
      function kd(o, a, c) {
        a = c ? t : a;
        var p = Yi(o, V, t, t, t, t, t, a);
        return p.placeholder = kd.placeholder, p;
      }
      function Td(o, a, c) {
        var p, m, S, y, x, T, q = 0, C = !1, A = !1, D = !0;
        if (typeof o != "function")
          throw new Dt(l);
        a = Nt(a) || 0, We(c) && (C = !!c.leading, A = "maxWait" in c, S = A ? Je(Nt(c.maxWait) || 0, a) : S, D = "trailing" in c ? !!c.trailing : D);
        function F(Me) {
          var li = p, Ei = m;
          return p = m = t, q = Me, y = o.apply(Ei, li), y;
        }
        function K(Me) {
          return q = Me, x = ds(de, a), C ? F(Me) : y;
        }
        function Oe(Me) {
          var li = Me - T, Ei = Me - q, Bd = a - li;
          return A ? Ot(Bd, S - Ei) : Bd;
        }
        function ee(Me) {
          var li = Me - T, Ei = Me - q;
          return T === t || li >= a || li < 0 || A && Ei >= S;
        }
        function de() {
          var Me = Fo();
          if (ee(Me))
            return me(Me);
          x = ds(de, Oe(Me));
        }
        function me(Me) {
          return x = t, D && p ? F(Me) : (p = m = t, y);
        }
        function Wt() {
          x !== t && Uu(x), q = 0, p = T = m = x = t;
        }
        function gt() {
          return x === t ? y : me(Fo());
        }
        function Yt() {
          var Me = Fo(), li = ee(Me);
          if (p = arguments, m = this, T = Me, li) {
            if (x === t)
              return K(T);
            if (A)
              return Uu(x), x = ds(de, a), F(T);
          }
          return x === t && (x = ds(de, a)), y;
        }
        return Yt.cancel = Wt, Yt.flush = gt, Yt;
      }
      var ux = he(function(o, a) {
        return mu(o, 1, a);
      }), dx = he(function(o, a, c) {
        return mu(o, Nt(a) || 0, c);
      });
      function px(o) {
        return Yi(o, oe);
      }
      function Ho(o, a) {
        if (typeof o != "function" || a != null && typeof a != "function")
          throw new Dt(l);
        var c = function() {
          var p = arguments, m = a ? a.apply(this, p) : p[0], S = c.cache;
          if (S.has(m))
            return S.get(m);
          var y = o.apply(this, p);
          return c.cache = S.set(m, y) || S, y;
        };
        return c.cache = new (Ho.Cache || Ci)(), c;
      }
      Ho.Cache = Ci;
      function Jo(o) {
        if (typeof o != "function")
          throw new Dt(l);
        return function() {
          var a = arguments;
          switch (a.length) {
            case 0:
              return !o.call(this);
            case 1:
              return !o.call(this, a[0]);
            case 2:
              return !o.call(this, a[0], a[1]);
            case 3:
              return !o.call(this, a[0], a[1], a[2]);
          }
          return !o.apply(this, a);
        };
      }
      function gx(o) {
        return xd(2, o);
      }
      var mx = nb(function(o, a) {
        a = a.length == 1 && se(a[0]) ? Xe(a[0], Xt(J())) : Xe(it(a, 1), Xt(J()));
        var c = a.length;
        return he(function(p) {
          for (var m = -1, S = Ot(p.length, c); ++m < S; )
            p[m] = a[m].call(this, p[m]);
          return _t(o, this, p);
        });
      }), AO = he(function(o, a) {
        var c = nn(a, pr(AO));
        return Yi(o, W, t, a, c);
      }), Zd = he(function(o, a) {
        var c = nn(a, pr(Zd));
        return Yi(o, M, t, a, c);
      }), Qx = Ai(function(o, a) {
        return Yi(o, te, t, t, t, a);
      });
      function Px(o, a) {
        if (typeof o != "function")
          throw new Dt(l);
        return a = a === t ? a : ae(a), he(o, a);
      }
      function Sx(o, a) {
        if (typeof o != "function")
          throw new Dt(l);
        return a = a == null ? 0 : Je(ae(a), 0), he(function(c) {
          var p = c[a], m = an(c, 0, a);
          return p && tn(m, p), _t(o, this, m);
        });
      }
      function $x(o, a, c) {
        var p = !0, m = !0;
        if (typeof o != "function")
          throw new Dt(l);
        return We(c) && (p = "leading" in c ? !!c.leading : p, m = "trailing" in c ? !!c.trailing : m), Td(o, a, {
          leading: p,
          maxWait: a,
          trailing: m
        });
      }
      function bx(o) {
        return yd(o, 1);
      }
      function yx(o, a) {
        return AO($O(a), o);
      }
      function xx() {
        if (!arguments.length)
          return [];
        var o = arguments[0];
        return se(o) ? o : [o];
      }
      function vx(o) {
        return Lt(o, Q);
      }
      function wx(o, a) {
        return a = typeof a == "function" ? a : t, Lt(o, Q, a);
      }
      function kx(o) {
        return Lt(o, d | Q);
      }
      function Tx(o, a) {
        return a = typeof a == "function" ? a : t, Lt(o, d | Q, a);
      }
      function Zx(o, a) {
        return a == null || gu(o, a, et(a));
      }
      function oi(o, a) {
        return o === a || o !== o && a !== a;
      }
      var Rx = Do(OO), _x = Do(function(o, a) {
        return o >= a;
      }), Vn = bu(/* @__PURE__ */ function() {
        return arguments;
      }()) ? bu : function(o) {
        return Ve(o) && be.call(o, "callee") && !au.call(o, "callee");
      }, se = R.isArray, Xx = Gf ? Xt(Gf) : z$;
      function bt(o) {
        return o != null && Ko(o.length) && !Vi(o);
      }
      function Ee(o) {
        return Ve(o) && bt(o);
      }
      function qx(o) {
        return o === !0 || o === !1 || Ve(o) && dt(o) == jr;
      }
      var On = BS || jO, Cx = Df ? Xt(Df) : E$;
      function Wx(o) {
        return Ve(o) && o.nodeType === 1 && !ps(o);
      }
      function Yx(o) {
        if (o == null)
          return !0;
        if (bt(o) && (se(o) || typeof o == "string" || typeof o.splice == "function" || On(o) || gr(o) || Vn(o)))
          return !o.length;
        var a = ht(o);
        if (a == ii || a == ni)
          return !o.size;
        if (us(o))
          return !fO(o).length;
        for (var c in o)
          if (be.call(o, c))
            return !1;
        return !0;
      }
      function Ax(o, a) {
        return hs(o, a);
      }
      function Ux(o, a, c) {
        c = typeof c == "function" ? c : t;
        var p = c ? c(o, a) : t;
        return p === t ? hs(o, a, t, c) : !!p;
      }
      function UO(o) {
        if (!Ve(o))
          return !1;
        var a = dt(o);
        return a == ho || a == lP || typeof o.message == "string" && typeof o.name == "string" && !ps(o);
      }
      function Vx(o) {
        return typeof o == "number" && hu(o);
      }
      function Vi(o) {
        if (!We(o))
          return !1;
        var a = dt(o);
        return a == co || a == mf || a == oP || a == OP;
      }
      function Rd(o) {
        return typeof o == "number" && o == ae(o);
      }
      function Ko(o) {
        return typeof o == "number" && o > -1 && o % 1 == 0 && o <= Ue;
      }
      function We(o) {
        var a = typeof o;
        return o != null && (a == "object" || a == "function");
      }
      function Ve(o) {
        return o != null && typeof o == "object";
      }
      var _d = If ? Xt(If) : G$;
      function zx(o, a) {
        return o === a || cO(o, a, TO(a));
      }
      function Ex(o, a, c) {
        return c = typeof c == "function" ? c : t, cO(o, a, TO(a), c);
      }
      function Mx(o) {
        return Xd(o) && o != +o;
      }
      function Gx(o) {
        if (wb(o))
          throw new re(s);
        return yu(o);
      }
      function Dx(o) {
        return o === null;
      }
      function Ix(o) {
        return o == null;
      }
      function Xd(o) {
        return typeof o == "number" || Ve(o) && dt(o) == Fr;
      }
      function ps(o) {
        if (!Ve(o) || dt(o) != Xi)
          return !1;
        var a = wo(o);
        if (a === null)
          return !0;
        var c = be.call(a, "constructor") && a.constructor;
        return typeof c == "function" && c instanceof c && bo.call(c) == ES;
      }
      var VO = Lf ? Xt(Lf) : D$;
      function Lx(o) {
        return Rd(o) && o >= -Ue && o <= Ue;
      }
      var qd = Bf ? Xt(Bf) : I$;
      function el(o) {
        return typeof o == "string" || !se(o) && Ve(o) && dt(o) == Jr;
      }
      function Ct(o) {
        return typeof o == "symbol" || Ve(o) && dt(o) == fo;
      }
      var gr = jf ? Xt(jf) : L$;
      function Bx(o) {
        return o === t;
      }
      function jx(o) {
        return Ve(o) && ht(o) == Kr;
      }
      function Nx(o) {
        return Ve(o) && dt(o) == cP;
      }
      var Fx = Do(uO), Hx = Do(function(o, a) {
        return o <= a;
      });
      function Cd(o) {
        if (!o)
          return [];
        if (bt(o))
          return el(o) ? ri(o) : $t(o);
        if (is && o[is])
          return ZS(o[is]());
        var a = ht(o), c = a == ii ? eO : a == ni ? Po : mr;
        return c(o);
      }
      function zi(o) {
        if (!o)
          return o === 0 ? o : 0;
        if (o = Nt(o), o === Ae || o === -Ae) {
          var a = o < 0 ? -1 : 1;
          return a * St;
        }
        return o === o ? o : 0;
      }
      function ae(o) {
        var a = zi(o), c = a % 1;
        return a === a ? c ? a - c : a : 0;
      }
      function Wd(o) {
        return o ? Wn(ae(o), 0, Ce) : 0;
      }
      function Nt(o) {
        if (typeof o == "number")
          return o;
        if (Ct(o))
          return _e;
        if (We(o)) {
          var a = typeof o.valueOf == "function" ? o.valueOf() : o;
          o = We(a) ? a + "" : a;
        }
        if (typeof o != "string")
          return o === 0 ? o : +o;
        o = eu(o);
        var c = XP.test(o);
        return c || CP.test(o) ? fS(o.slice(2), c ? 2 : 8) : _P.test(o) ? _e : +o;
      }
      function Yd(o) {
        return di(o, yt(o));
      }
      function Jx(o) {
        return o ? Wn(ae(o), -Ue, Ue) : o === 0 ? o : 0;
      }
      function $e(o) {
        return o == null ? "" : qt(o);
      }
      var Kx = ur(function(o, a) {
        if (us(a) || bt(a)) {
          di(a, et(a), o);
          return;
        }
        for (var c in a)
          be.call(a, c) && ls(o, c, a[c]);
      }), Ad = ur(function(o, a) {
        di(a, yt(a), o);
      }), tl = ur(function(o, a, c, p) {
        di(a, yt(a), o, p);
      }), ev = ur(function(o, a, c, p) {
        di(a, et(a), o, p);
      }), tv = Ai(oO);
      function iv(o, a) {
        var c = fr(o);
        return a == null ? c : pu(c, a);
      }
      var nv = he(function(o, a) {
        o = ye(o);
        var c = -1, p = a.length, m = p > 2 ? a[2] : t;
        for (m && pt(a[0], a[1], m) && (p = 1); ++c < p; )
          for (var S = a[c], y = yt(S), x = -1, T = y.length; ++x < T; ) {
            var q = y[x], C = o[q];
            (C === t || oi(C, Or[q]) && !be.call(o, q)) && (o[q] = S[q]);
          }
        return o;
      }), rv = he(function(o) {
        return o.push(t, ed), _t(Ud, t, o);
      });
      function sv(o, a) {
        return Ff(o, J(a, 3), ui);
      }
      function ov(o, a) {
        return Ff(o, J(a, 3), aO);
      }
      function lv(o, a) {
        return o == null ? o : lO(o, J(a, 3), yt);
      }
      function av(o, a) {
        return o == null ? o : Su(o, J(a, 3), yt);
      }
      function Ov(o, a) {
        return o && ui(o, J(a, 3));
      }
      function hv(o, a) {
        return o && aO(o, J(a, 3));
      }
      function cv(o) {
        return o == null ? [] : Yo(o, et(o));
      }
      function fv(o) {
        return o == null ? [] : Yo(o, yt(o));
      }
      function zO(o, a, c) {
        var p = o == null ? t : Yn(o, a);
        return p === t ? c : p;
      }
      function uv(o, a) {
        return o != null && nd(o, a, Y$);
      }
      function EO(o, a) {
        return o != null && nd(o, a, A$);
      }
      var dv = Nu(function(o, a, c) {
        a != null && typeof a.toString != "function" && (a = yo.call(a)), o[a] = c;
      }, GO(xt)), pv = Nu(function(o, a, c) {
        a != null && typeof a.toString != "function" && (a = yo.call(a)), be.call(o, a) ? o[a].push(c) : o[a] = [c];
      }, J), gv = he(Os);
      function et(o) {
        return bt(o) ? uu(o) : fO(o);
      }
      function yt(o) {
        return bt(o) ? uu(o, !0) : B$(o);
      }
      function mv(o, a) {
        var c = {};
        return a = J(a, 3), ui(o, function(p, m, S) {
          Wi(c, a(p, m, S), p);
        }), c;
      }
      function Qv(o, a) {
        var c = {};
        return a = J(a, 3), ui(o, function(p, m, S) {
          Wi(c, m, a(p, m, S));
        }), c;
      }
      var Pv = ur(function(o, a, c) {
        Ao(o, a, c);
      }), Ud = ur(function(o, a, c, p) {
        Ao(o, a, c, p);
      }), Sv = Ai(function(o, a) {
        var c = {};
        if (o == null)
          return c;
        var p = !1;
        a = Xe(a, function(S) {
          return S = ln(S, o), p || (p = S.length > 1), S;
        }), di(o, wO(o), c), p && (c = Lt(c, d | g | Q, db));
        for (var m = a.length; m--; )
          QO(c, a[m]);
        return c;
      });
      function $v(o, a) {
        return Vd(o, Jo(J(a)));
      }
      var bv = Ai(function(o, a) {
        return o == null ? {} : N$(o, a);
      });
      function Vd(o, a) {
        if (o == null)
          return {};
        var c = Xe(wO(o), function(p) {
          return [p];
        });
        return a = J(a), Ru(o, c, function(p, m) {
          return a(p, m[0]);
        });
      }
      function yv(o, a, c) {
        a = ln(a, o);
        var p = -1, m = a.length;
        for (m || (m = 1, o = t); ++p < m; ) {
          var S = o == null ? t : o[pi(a[p])];
          S === t && (p = m, S = c), o = Vi(S) ? S.call(o) : S;
        }
        return o;
      }
      function xv(o, a, c) {
        return o == null ? o : cs(o, a, c);
      }
      function vv(o, a, c, p) {
        return p = typeof p == "function" ? p : t, o == null ? o : cs(o, a, c, p);
      }
      var zd = Ju(et), Ed = Ju(yt);
      function wv(o, a, c) {
        var p = se(o), m = p || On(o) || gr(o);
        if (a = J(a, 4), c == null) {
          var S = o && o.constructor;
          m ? c = p ? new S() : [] : We(o) ? c = Vi(S) ? fr(wo(o)) : {} : c = {};
        }
        return (m ? Gt : ui)(o, function(y, x, T) {
          return a(c, y, x, T);
        }), c;
      }
      function kv(o, a) {
        return o == null ? !0 : QO(o, a);
      }
      function Tv(o, a, c) {
        return o == null ? o : Wu(o, a, $O(c));
      }
      function Zv(o, a, c, p) {
        return p = typeof p == "function" ? p : t, o == null ? o : Wu(o, a, $O(c), p);
      }
      function mr(o) {
        return o == null ? [] : Ka(o, et(o));
      }
      function Rv(o) {
        return o == null ? [] : Ka(o, yt(o));
      }
      function _v(o, a, c) {
        return c === t && (c = a, a = t), c !== t && (c = Nt(c), c = c === c ? c : 0), a !== t && (a = Nt(a), a = a === a ? a : 0), Wn(Nt(o), a, c);
      }
      function Xv(o, a, c) {
        return a = zi(a), c === t ? (c = a, a = 0) : c = zi(c), o = Nt(o), U$(o, a, c);
      }
      function qv(o, a, c) {
        if (c && typeof c != "boolean" && pt(o, a, c) && (a = c = t), c === t && (typeof a == "boolean" ? (c = a, a = t) : typeof o == "boolean" && (c = o, o = t)), o === t && a === t ? (o = 0, a = 1) : (o = zi(o), a === t ? (a = o, o = 0) : a = zi(a)), o > a) {
          var p = o;
          o = a, a = p;
        }
        if (c || o % 1 || a % 1) {
          var m = cu();
          return Ot(o + m * (a - o + cS("1e-" + ((m + "").length - 1))), a);
        }
        return pO(o, a);
      }
      var Cv = dr(function(o, a, c) {
        return a = a.toLowerCase(), o + (c ? Md(a) : a);
      });
      function Md(o) {
        return MO($e(o).toLowerCase());
      }
      function Gd(o) {
        return o = $e(o), o && o.replace(YP, xS).replace(tS, "");
      }
      function Wv(o, a, c) {
        o = $e(o), a = qt(a);
        var p = o.length;
        c = c === t ? p : Wn(ae(c), 0, p);
        var m = c;
        return c -= a.length, c >= 0 && o.slice(c, m) == a;
      }
      function Yv(o) {
        return o = $e(o), o && gP.test(o) ? o.replace(Sf, vS) : o;
      }
      function Av(o) {
        return o = $e(o), o && bP.test(o) ? o.replace(Aa, "\\$&") : o;
      }
      var Uv = dr(function(o, a, c) {
        return o + (c ? "-" : "") + a.toLowerCase();
      }), Vv = dr(function(o, a, c) {
        return o + (c ? " " : "") + a.toLowerCase();
      }), zv = Lu("toLowerCase");
      function Ev(o, a, c) {
        o = $e(o), a = ae(a);
        var p = a ? lr(o) : 0;
        if (!a || p >= a)
          return o;
        var m = (a - p) / 2;
        return Go(Ro(m), c) + o + Go(Zo(m), c);
      }
      function Mv(o, a, c) {
        o = $e(o), a = ae(a);
        var p = a ? lr(o) : 0;
        return a && p < a ? o + Go(a - p, c) : o;
      }
      function Gv(o, a, c) {
        o = $e(o), a = ae(a);
        var p = a ? lr(o) : 0;
        return a && p < a ? Go(a - p, c) + o : o;
      }
      function Dv(o, a, c) {
        return c || a == null ? a = 0 : a && (a = +a), HS($e(o).replace(Ua, ""), a || 0);
      }
      function Iv(o, a, c) {
        return (c ? pt(o, a, c) : a === t) ? a = 1 : a = ae(a), gO($e(o), a);
      }
      function Lv() {
        var o = arguments, a = $e(o[0]);
        return o.length < 3 ? a : a.replace(o[1], o[2]);
      }
      var Bv = dr(function(o, a, c) {
        return o + (c ? "_" : "") + a.toLowerCase();
      });
      function jv(o, a, c) {
        return c && typeof c != "number" && pt(o, a, c) && (a = c = t), c = c === t ? Ce : c >>> 0, c ? (o = $e(o), o && (typeof a == "string" || a != null && !VO(a)) && (a = qt(a), !a && or(o)) ? an(ri(o), 0, c) : o.split(a, c)) : [];
      }
      var Nv = dr(function(o, a, c) {
        return o + (c ? " " : "") + MO(a);
      });
      function Fv(o, a, c) {
        return o = $e(o), c = c == null ? 0 : Wn(ae(c), 0, o.length), a = qt(a), o.slice(c, c + a.length) == a;
      }
      function Hv(o, a, c) {
        var p = P.templateSettings;
        c && pt(o, a, c) && (a = t), o = $e(o), a = tl({}, a, p, Ku);
        var m = tl({}, a.imports, p.imports, Ku), S = et(m), y = Ka(m, S), x, T, q = 0, C = a.interpolate || uo, A = "__p += '", D = tO(
          (a.escape || uo).source + "|" + C.source + "|" + (C === $f ? RP : uo).source + "|" + (a.evaluate || uo).source + "|$",
          "g"
        ), F = "//# sourceURL=" + (be.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++oS + "]") + `
`;
        o.replace(D, function(ee, de, me, Wt, gt, Yt) {
          return me || (me = Wt), A += o.slice(q, Yt).replace(AP, wS), de && (x = !0, A += `' +
__e(` + de + `) +
'`), gt && (T = !0, A += `';
` + gt + `;
__p += '`), me && (A += `' +
((__t = (` + me + `)) == null ? '' : __t) +
'`), q = Yt + ee.length, ee;
        }), A += `';
`;
        var K = be.call(a, "variable") && a.variable;
        if (!K)
          A = `with (obj) {
` + A + `
}
`;
        else if (TP.test(K))
          throw new re(O);
        A = (T ? A.replace(fP, "") : A).replace(uP, "$1").replace(dP, "$1;"), A = "function(" + (K || "obj") + `) {
` + (K ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (x ? ", __e = _.escape" : "") + (T ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + A + `return __p
}`;
        var Oe = Id(function() {
          return Se(S, F + "return " + A).apply(t, y);
        });
        if (Oe.source = A, UO(Oe))
          throw Oe;
        return Oe;
      }
      function Jv(o) {
        return $e(o).toLowerCase();
      }
      function Kv(o) {
        return $e(o).toUpperCase();
      }
      function ew(o, a, c) {
        if (o = $e(o), o && (c || a === t))
          return eu(o);
        if (!o || !(a = qt(a)))
          return o;
        var p = ri(o), m = ri(a), S = tu(p, m), y = iu(p, m) + 1;
        return an(p, S, y).join("");
      }
      function tw(o, a, c) {
        if (o = $e(o), o && (c || a === t))
          return o.slice(0, ru(o) + 1);
        if (!o || !(a = qt(a)))
          return o;
        var p = ri(o), m = iu(p, ri(a)) + 1;
        return an(p, 0, m).join("");
      }
      function iw(o, a, c) {
        if (o = $e(o), o && (c || a === t))
          return o.replace(Ua, "");
        if (!o || !(a = qt(a)))
          return o;
        var p = ri(o), m = tu(p, ri(a));
        return an(p, m).join("");
      }
      function nw(o, a) {
        var c = fe, p = le;
        if (We(a)) {
          var m = "separator" in a ? a.separator : m;
          c = "length" in a ? ae(a.length) : c, p = "omission" in a ? qt(a.omission) : p;
        }
        o = $e(o);
        var S = o.length;
        if (or(o)) {
          var y = ri(o);
          S = y.length;
        }
        if (c >= S)
          return o;
        var x = c - lr(p);
        if (x < 1)
          return p;
        var T = y ? an(y, 0, x).join("") : o.slice(0, x);
        if (m === t)
          return T + p;
        if (y && (x += T.length - x), VO(m)) {
          if (o.slice(x).search(m)) {
            var q, C = T;
            for (m.global || (m = tO(m.source, $e(bf.exec(m)) + "g")), m.lastIndex = 0; q = m.exec(C); )
              var A = q.index;
            T = T.slice(0, A === t ? x : A);
          }
        } else if (o.indexOf(qt(m), x) != x) {
          var D = T.lastIndexOf(m);
          D > -1 && (T = T.slice(0, D));
        }
        return T + p;
      }
      function rw(o) {
        return o = $e(o), o && pP.test(o) ? o.replace(Pf, qS) : o;
      }
      var sw = dr(function(o, a, c) {
        return o + (c ? " " : "") + a.toUpperCase();
      }), MO = Lu("toUpperCase");
      function Dd(o, a, c) {
        return o = $e(o), a = c ? t : a, a === t ? TS(o) ? YS(o) : PS(o) : o.match(a) || [];
      }
      var Id = he(function(o, a) {
        try {
          return _t(o, t, a);
        } catch (c) {
          return UO(c) ? c : new re(c);
        }
      }), ow = Ai(function(o, a) {
        return Gt(a, function(c) {
          c = pi(c), Wi(o, c, YO(o[c], o));
        }), o;
      });
      function lw(o) {
        var a = o == null ? 0 : o.length, c = J();
        return o = a ? Xe(o, function(p) {
          if (typeof p[1] != "function")
            throw new Dt(l);
          return [c(p[0]), p[1]];
        }) : [], he(function(p) {
          for (var m = -1; ++m < a; ) {
            var S = o[m];
            if (_t(S[0], this, p))
              return _t(S[1], this, p);
          }
        });
      }
      function aw(o) {
        return q$(Lt(o, d));
      }
      function GO(o) {
        return function() {
          return o;
        };
      }
      function Ow(o, a) {
        return o == null || o !== o ? a : o;
      }
      var hw = ju(), cw = ju(!0);
      function xt(o) {
        return o;
      }
      function DO(o) {
        return xu(typeof o == "function" ? o : Lt(o, d));
      }
      function fw(o) {
        return wu(Lt(o, d));
      }
      function uw(o, a) {
        return ku(o, Lt(a, d));
      }
      var dw = he(function(o, a) {
        return function(c) {
          return Os(c, o, a);
        };
      }), pw = he(function(o, a) {
        return function(c) {
          return Os(o, c, a);
        };
      });
      function IO(o, a, c) {
        var p = et(a), m = Yo(a, p);
        c == null && !(We(a) && (m.length || !p.length)) && (c = a, a = o, o = this, m = Yo(a, et(a)));
        var S = !(We(c) && "chain" in c) || !!c.chain, y = Vi(o);
        return Gt(m, function(x) {
          var T = a[x];
          o[x] = T, y && (o.prototype[x] = function() {
            var q = this.__chain__;
            if (S || q) {
              var C = o(this.__wrapped__), A = C.__actions__ = $t(this.__actions__);
              return A.push({ func: T, args: arguments, thisArg: o }), C.__chain__ = q, C;
            }
            return T.apply(o, tn([this.value()], arguments));
          });
        }), o;
      }
      function gw() {
        return tt._ === this && (tt._ = MS), this;
      }
      function LO() {
      }
      function mw(o) {
        return o = ae(o), he(function(a) {
          return Tu(a, o);
        });
      }
      var Qw = yO(Xe), Pw = yO(Nf), Sw = yO(ja);
      function Ld(o) {
        return RO(o) ? Na(pi(o)) : F$(o);
      }
      function $w(o) {
        return function(a) {
          return o == null ? t : Yn(o, a);
        };
      }
      var bw = Fu(), yw = Fu(!0);
      function BO() {
        return [];
      }
      function jO() {
        return !1;
      }
      function xw() {
        return {};
      }
      function vw() {
        return "";
      }
      function ww() {
        return !0;
      }
      function kw(o, a) {
        if (o = ae(o), o < 1 || o > Ue)
          return [];
        var c = Ce, p = Ot(o, Ce);
        a = J(a), o -= Ce;
        for (var m = Ja(p, a); ++c < o; )
          a(c);
        return m;
      }
      function Tw(o) {
        return se(o) ? Xe(o, pi) : Ct(o) ? [o] : $t(fd($e(o)));
      }
      function Zw(o) {
        var a = ++zS;
        return $e(o) + a;
      }
      var Rw = Mo(function(o, a) {
        return o + a;
      }, 0), _w = xO("ceil"), Xw = Mo(function(o, a) {
        return o / a;
      }, 1), qw = xO("floor");
      function Cw(o) {
        return o && o.length ? Wo(o, xt, OO) : t;
      }
      function Ww(o, a) {
        return o && o.length ? Wo(o, J(a, 2), OO) : t;
      }
      function Yw(o) {
        return Jf(o, xt);
      }
      function Aw(o, a) {
        return Jf(o, J(a, 2));
      }
      function Uw(o) {
        return o && o.length ? Wo(o, xt, uO) : t;
      }
      function Vw(o, a) {
        return o && o.length ? Wo(o, J(a, 2), uO) : t;
      }
      var zw = Mo(function(o, a) {
        return o * a;
      }, 1), Ew = xO("round"), Mw = Mo(function(o, a) {
        return o - a;
      }, 0);
      function Gw(o) {
        return o && o.length ? Ha(o, xt) : 0;
      }
      function Dw(o, a) {
        return o && o.length ? Ha(o, J(a, 2)) : 0;
      }
      return P.after = fx, P.ary = yd, P.assign = Kx, P.assignIn = Ad, P.assignInWith = tl, P.assignWith = ev, P.at = tv, P.before = xd, P.bind = YO, P.bindAll = ow, P.bindKey = vd, P.castArray = xx, P.chain = Sd, P.chunk = qb, P.compact = Cb, P.concat = Wb, P.cond = lw, P.conforms = aw, P.constant = GO, P.countBy = Gy, P.create = iv, P.curry = wd, P.curryRight = kd, P.debounce = Td, P.defaults = nv, P.defaultsDeep = rv, P.defer = ux, P.delay = dx, P.difference = Yb, P.differenceBy = Ab, P.differenceWith = Ub, P.drop = Vb, P.dropRight = zb, P.dropRightWhile = Eb, P.dropWhile = Mb, P.fill = Gb, P.filter = Iy, P.flatMap = jy, P.flatMapDeep = Ny, P.flatMapDepth = Fy, P.flatten = gd, P.flattenDeep = Db, P.flattenDepth = Ib, P.flip = px, P.flow = hw, P.flowRight = cw, P.fromPairs = Lb, P.functions = cv, P.functionsIn = fv, P.groupBy = Hy, P.initial = jb, P.intersection = Nb, P.intersectionBy = Fb, P.intersectionWith = Hb, P.invert = dv, P.invertBy = pv, P.invokeMap = Ky, P.iteratee = DO, P.keyBy = ex, P.keys = et, P.keysIn = yt, P.map = No, P.mapKeys = mv, P.mapValues = Qv, P.matches = fw, P.matchesProperty = uw, P.memoize = Ho, P.merge = Pv, P.mergeWith = Ud, P.method = dw, P.methodOf = pw, P.mixin = IO, P.negate = Jo, P.nthArg = mw, P.omit = Sv, P.omitBy = $v, P.once = gx, P.orderBy = tx, P.over = Qw, P.overArgs = mx, P.overEvery = Pw, P.overSome = Sw, P.partial = AO, P.partialRight = Zd, P.partition = ix, P.pick = bv, P.pickBy = Vd, P.property = Ld, P.propertyOf = $w, P.pull = ty, P.pullAll = Qd, P.pullAllBy = iy, P.pullAllWith = ny, P.pullAt = ry, P.range = bw, P.rangeRight = yw, P.rearg = Qx, P.reject = sx, P.remove = sy, P.rest = Px, P.reverse = CO, P.sampleSize = lx, P.set = xv, P.setWith = vv, P.shuffle = ax, P.slice = oy, P.sortBy = cx, P.sortedUniq = uy, P.sortedUniqBy = dy, P.split = jv, P.spread = Sx, P.tail = py, P.take = gy, P.takeRight = my, P.takeRightWhile = Qy, P.takeWhile = Py, P.tap = Cy, P.throttle = $x, P.thru = jo, P.toArray = Cd, P.toPairs = zd, P.toPairsIn = Ed, P.toPath = Tw, P.toPlainObject = Yd, P.transform = wv, P.unary = bx, P.union = Sy, P.unionBy = $y, P.unionWith = by, P.uniq = yy, P.uniqBy = xy, P.uniqWith = vy, P.unset = kv, P.unzip = WO, P.unzipWith = Pd, P.update = Tv, P.updateWith = Zv, P.values = mr, P.valuesIn = Rv, P.without = wy, P.words = Dd, P.wrap = yx, P.xor = ky, P.xorBy = Ty, P.xorWith = Zy, P.zip = Ry, P.zipObject = _y, P.zipObjectDeep = Xy, P.zipWith = qy, P.entries = zd, P.entriesIn = Ed, P.extend = Ad, P.extendWith = tl, IO(P, P), P.add = Rw, P.attempt = Id, P.camelCase = Cv, P.capitalize = Md, P.ceil = _w, P.clamp = _v, P.clone = vx, P.cloneDeep = kx, P.cloneDeepWith = Tx, P.cloneWith = wx, P.conformsTo = Zx, P.deburr = Gd, P.defaultTo = Ow, P.divide = Xw, P.endsWith = Wv, P.eq = oi, P.escape = Yv, P.escapeRegExp = Av, P.every = Dy, P.find = Ly, P.findIndex = dd, P.findKey = sv, P.findLast = By, P.findLastIndex = pd, P.findLastKey = ov, P.floor = qw, P.forEach = $d, P.forEachRight = bd, P.forIn = lv, P.forInRight = av, P.forOwn = Ov, P.forOwnRight = hv, P.get = zO, P.gt = Rx, P.gte = _x, P.has = uv, P.hasIn = EO, P.head = md, P.identity = xt, P.includes = Jy, P.indexOf = Bb, P.inRange = Xv, P.invoke = gv, P.isArguments = Vn, P.isArray = se, P.isArrayBuffer = Xx, P.isArrayLike = bt, P.isArrayLikeObject = Ee, P.isBoolean = qx, P.isBuffer = On, P.isDate = Cx, P.isElement = Wx, P.isEmpty = Yx, P.isEqual = Ax, P.isEqualWith = Ux, P.isError = UO, P.isFinite = Vx, P.isFunction = Vi, P.isInteger = Rd, P.isLength = Ko, P.isMap = _d, P.isMatch = zx, P.isMatchWith = Ex, P.isNaN = Mx, P.isNative = Gx, P.isNil = Ix, P.isNull = Dx, P.isNumber = Xd, P.isObject = We, P.isObjectLike = Ve, P.isPlainObject = ps, P.isRegExp = VO, P.isSafeInteger = Lx, P.isSet = qd, P.isString = el, P.isSymbol = Ct, P.isTypedArray = gr, P.isUndefined = Bx, P.isWeakMap = jx, P.isWeakSet = Nx, P.join = Jb, P.kebabCase = Uv, P.last = jt, P.lastIndexOf = Kb, P.lowerCase = Vv, P.lowerFirst = zv, P.lt = Fx, P.lte = Hx, P.max = Cw, P.maxBy = Ww, P.mean = Yw, P.meanBy = Aw, P.min = Uw, P.minBy = Vw, P.stubArray = BO, P.stubFalse = jO, P.stubObject = xw, P.stubString = vw, P.stubTrue = ww, P.multiply = zw, P.nth = ey, P.noConflict = gw, P.noop = LO, P.now = Fo, P.pad = Ev, P.padEnd = Mv, P.padStart = Gv, P.parseInt = Dv, P.random = qv, P.reduce = nx, P.reduceRight = rx, P.repeat = Iv, P.replace = Lv, P.result = yv, P.round = Ew, P.runInContext = k, P.sample = ox, P.size = Ox, P.snakeCase = Bv, P.some = hx, P.sortedIndex = ly, P.sortedIndexBy = ay, P.sortedIndexOf = Oy, P.sortedLastIndex = hy, P.sortedLastIndexBy = cy, P.sortedLastIndexOf = fy, P.startCase = Nv, P.startsWith = Fv, P.subtract = Mw, P.sum = Gw, P.sumBy = Dw, P.template = Hv, P.times = kw, P.toFinite = zi, P.toInteger = ae, P.toLength = Wd, P.toLower = Jv, P.toNumber = Nt, P.toSafeInteger = Jx, P.toString = $e, P.toUpper = Kv, P.trim = ew, P.trimEnd = tw, P.trimStart = iw, P.truncate = nw, P.unescape = rw, P.uniqueId = Zw, P.upperCase = sw, P.upperFirst = MO, P.each = $d, P.eachRight = bd, P.first = md, IO(P, function() {
        var o = {};
        return ui(P, function(a, c) {
          be.call(P.prototype, c) || (o[c] = a);
        }), o;
      }(), { chain: !1 }), P.VERSION = i, Gt(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(o) {
        P[o].placeholder = P;
      }), Gt(["drop", "take"], function(o, a) {
        ge.prototype[o] = function(c) {
          c = c === t ? 1 : Je(ae(c), 0);
          var p = this.__filtered__ && !a ? new ge(this) : this.clone();
          return p.__filtered__ ? p.__takeCount__ = Ot(c, p.__takeCount__) : p.__views__.push({
            size: Ot(c, Ce),
            type: o + (p.__dir__ < 0 ? "Right" : "")
          }), p;
        }, ge.prototype[o + "Right"] = function(c) {
          return this.reverse()[o](c).reverse();
        };
      }), Gt(["filter", "map", "takeWhile"], function(o, a) {
        var c = a + 1, p = c == N || c == Fe;
        ge.prototype[o] = function(m) {
          var S = this.clone();
          return S.__iteratees__.push({
            iteratee: J(m, 3),
            type: c
          }), S.__filtered__ = S.__filtered__ || p, S;
        };
      }), Gt(["head", "last"], function(o, a) {
        var c = "take" + (a ? "Right" : "");
        ge.prototype[o] = function() {
          return this[c](1).value()[0];
        };
      }), Gt(["initial", "tail"], function(o, a) {
        var c = "drop" + (a ? "" : "Right");
        ge.prototype[o] = function() {
          return this.__filtered__ ? new ge(this) : this[c](1);
        };
      }), ge.prototype.compact = function() {
        return this.filter(xt);
      }, ge.prototype.find = function(o) {
        return this.filter(o).head();
      }, ge.prototype.findLast = function(o) {
        return this.reverse().find(o);
      }, ge.prototype.invokeMap = he(function(o, a) {
        return typeof o == "function" ? new ge(this) : this.map(function(c) {
          return Os(c, o, a);
        });
      }), ge.prototype.reject = function(o) {
        return this.filter(Jo(J(o)));
      }, ge.prototype.slice = function(o, a) {
        o = ae(o);
        var c = this;
        return c.__filtered__ && (o > 0 || a < 0) ? new ge(c) : (o < 0 ? c = c.takeRight(-o) : o && (c = c.drop(o)), a !== t && (a = ae(a), c = a < 0 ? c.dropRight(-a) : c.take(a - o)), c);
      }, ge.prototype.takeRightWhile = function(o) {
        return this.reverse().takeWhile(o).reverse();
      }, ge.prototype.toArray = function() {
        return this.take(Ce);
      }, ui(ge.prototype, function(o, a) {
        var c = /^(?:filter|find|map|reject)|While$/.test(a), p = /^(?:head|last)$/.test(a), m = P[p ? "take" + (a == "last" ? "Right" : "") : a], S = p || /^find/.test(a);
        m && (P.prototype[a] = function() {
          var y = this.__wrapped__, x = p ? [1] : arguments, T = y instanceof ge, q = x[0], C = T || se(y), A = function(de) {
            var me = m.apply(P, tn([de], x));
            return p && D ? me[0] : me;
          };
          C && c && typeof q == "function" && q.length != 1 && (T = C = !1);
          var D = this.__chain__, F = !!this.__actions__.length, K = S && !D, Oe = T && !F;
          if (!S && C) {
            y = Oe ? y : new ge(this);
            var ee = o.apply(y, x);
            return ee.__actions__.push({ func: jo, args: [A], thisArg: t }), new It(ee, D);
          }
          return K && Oe ? o.apply(this, x) : (ee = this.thru(A), K ? p ? ee.value()[0] : ee.value() : ee);
        });
      }), Gt(["pop", "push", "shift", "sort", "splice", "unshift"], function(o) {
        var a = So[o], c = /^(?:push|sort|unshift)$/.test(o) ? "tap" : "thru", p = /^(?:pop|shift)$/.test(o);
        P.prototype[o] = function() {
          var m = arguments;
          if (p && !this.__chain__) {
            var S = this.value();
            return a.apply(se(S) ? S : [], m);
          }
          return this[c](function(y) {
            return a.apply(se(y) ? y : [], m);
          });
        };
      }), ui(ge.prototype, function(o, a) {
        var c = P[a];
        if (c) {
          var p = c.name + "";
          be.call(cr, p) || (cr[p] = []), cr[p].push({ name: a, func: c });
        }
      }), cr[Eo(t, Z).name] = [{
        name: "wrapper",
        func: t
      }], ge.prototype.clone = r$, ge.prototype.reverse = s$, ge.prototype.value = o$, P.prototype.at = Wy, P.prototype.chain = Yy, P.prototype.commit = Ay, P.prototype.next = Uy, P.prototype.plant = zy, P.prototype.reverse = Ey, P.prototype.toJSON = P.prototype.valueOf = P.prototype.value = My, P.prototype.first = P.prototype.head, is && (P.prototype[is] = Vy), P;
    }, ar = AS();
    _n ? ((_n.exports = ar)._ = ar, Da._ = ar) : tt._ = ar;
  }).call(bs);
})(ca, ca.exports);
var m5 = ca.exports;
const Q5 = (n) => {
  const e = [g5()];
  return n && m5.isArray(n) && e.push(
    X1.data.of({ autocomplete: Nn(n) })
  ), e;
}, P5 = {
  getOptions: Q5
}, S5 = Mr({
  String: $.string,
  Number: $.number,
  "True False": $.bool,
  PropertyName: $.propertyName,
  Null: $.null,
  ",": $.separator,
  "[ ]": $.squareBracket,
  "{ }": $.brace
}), $5 = kn.deserialize({
  version: 14,
  states: "$bOVQPOOOOQO'#Cb'#CbOnQPO'#CeOvQPO'#CjOOQO'#Cp'#CpQOQPOOOOQO'#Cg'#CgO}QPO'#CfO!SQPO'#CrOOQO,59P,59PO![QPO,59PO!aQPO'#CuOOQO,59U,59UO!iQPO,59UOVQPO,59QOqQPO'#CkO!nQPO,59^OOQO1G.k1G.kOVQPO'#ClO!vQPO,59aOOQO1G.p1G.pOOQO1G.l1G.lOOQO,59V,59VOOQO-E6i-E6iOOQO,59W,59WOOQO-E6j-E6j",
  stateData: "#O~OcOS~OQSORSOSSOTSOWQO]ROePO~OVXOeUO~O[[O~PVOg^O~Oh_OVfX~OVaO~OhbO[iX~O[dO~Oh_OVfa~OhbO[ia~O",
  goto: "!kjPPPPPPkPPkqwPPk{!RPPP!XP!ePP!hXSOR^bQWQRf_TVQ_Q`WRg`QcZRicQTOQZRQe^RhbRYQR]R",
  nodeNames: "⚠ JsonText True False Null Number String } { Object Property PropertyName ] [ Array",
  maxTerm: 25,
  nodeProps: [
    ["isolate", -2, 6, 11, ""],
    ["openedBy", 7, "{", 12, "["],
    ["closedBy", 8, "}", 13, "]"]
  ],
  propSources: [S5],
  skippedNodes: [0],
  repeatNodeCount: 2,
  tokenData: "(|~RaXY!WYZ!W]^!Wpq!Wrs!]|}$u}!O$z!Q!R%T!R![&c![!]&t!}#O&y#P#Q'O#Y#Z'T#b#c'r#h#i(Z#o#p(r#q#r(w~!]Oc~~!`Wpq!]qr!]rs!xs#O!]#O#P!}#P;'S!];'S;=`$o<%lO!]~!}Oe~~#QXrs!]!P!Q!]#O#P!]#U#V!]#Y#Z!]#b#c!]#f#g!]#h#i!]#i#j#m~#pR!Q![#y!c!i#y#T#Z#y~#|R!Q![$V!c!i$V#T#Z$V~$YR!Q![$c!c!i$c#T#Z$c~$fR!Q![!]!c!i!]#T#Z!]~$rP;=`<%l!]~$zOh~~$}Q!Q!R%T!R![&c~%YRT~!O!P%c!g!h%w#X#Y%w~%fP!Q![%i~%nRT~!Q![%i!g!h%w#X#Y%w~%zR{|&T}!O&T!Q![&Z~&WP!Q![&Z~&`PT~!Q![&Z~&hST~!O!P%c!Q![&c!g!h%w#X#Y%w~&yOg~~'OO]~~'TO[~~'WP#T#U'Z~'^P#`#a'a~'dP#g#h'g~'jP#X#Y'm~'rOR~~'uP#i#j'x~'{P#`#a(O~(RP#`#a(U~(ZOS~~(^P#f#g(a~(dP#i#j(g~(jP#X#Y(m~(rOQ~~(wOW~~(|OV~",
  tokenizers: [0],
  topRules: { JsonText: [0, 1] },
  tokenPrec: 0
}), q1 = /* @__PURE__ */ vn.define({
  name: "json",
  parser: /* @__PURE__ */ $5.configure({
    props: [
      /* @__PURE__ */ Gr.add({
        Object: /* @__PURE__ */ ji({ except: /^\s*\}/ }),
        Array: /* @__PURE__ */ ji({ except: /^\s*\]/ })
      }),
      /* @__PURE__ */ Dr.add({
        "Object Array": Qa
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["[", "{", '"'] },
    indentOnInput: /^\s*[\}\]]$/
  }
});
function b5() {
  return new io(q1);
}
const y5 = (n) => {
  const e = [b5()];
  return n && e.push(
    q1.data.of({ autocomplete: Nn(n) })
  ), e;
}, x5 = {
  getOptions: y5
}, v5 = 1, C1 = 194, W1 = 195, w5 = 196, Ig = 197, k5 = 198, T5 = 199, Z5 = 200, R5 = 2, Y1 = 3, Lg = 201, _5 = 24, X5 = 25, q5 = 49, C5 = 50, W5 = 55, Y5 = 56, A5 = 57, U5 = 59, V5 = 60, z5 = 61, E5 = 62, M5 = 63, G5 = 65, D5 = 238, I5 = 71, L5 = 241, B5 = 242, j5 = 243, N5 = 244, F5 = 245, H5 = 246, J5 = 247, K5 = 248, A1 = 72, e2 = 249, t2 = 250, i2 = 251, n2 = 252, r2 = 253, s2 = 254, o2 = 255, l2 = 256, a2 = 73, O2 = 77, h2 = 263, c2 = 112, f2 = 130, u2 = 151, d2 = 152, p2 = 155, ir = 10, Hs = 13, ff = 32, ka = 9, uf = 35, g2 = 40, m2 = 46, yc = 123, Bg = 125, U1 = 39, V1 = 34, Q2 = 92, P2 = 111, S2 = 120, $2 = 78, b2 = 117, y2 = 85, x2 = /* @__PURE__ */ new Set([
  X5,
  q5,
  C5,
  h2,
  G5,
  f2,
  Y5,
  A5,
  D5,
  E5,
  M5,
  A1,
  a2,
  O2,
  V5,
  z5,
  u2,
  d2,
  p2,
  c2
]);
function bh(n) {
  return n == ir || n == Hs;
}
function yh(n) {
  return n >= 48 && n <= 57 || n >= 65 && n <= 70 || n >= 97 && n <= 102;
}
const v2 = new Ji((n, e) => {
  let t;
  if (n.next < 0)
    n.acceptToken(T5);
  else if (e.context.flags & Al)
    bh(n.next) && n.acceptToken(k5, 1);
  else if (((t = n.peek(-1)) < 0 || bh(t)) && e.canShift(Ig)) {
    let i = 0;
    for (; n.next == ff || n.next == ka; )
      n.advance(), i++;
    (n.next == ir || n.next == Hs || n.next == uf) && n.acceptToken(Ig, -i);
  } else bh(n.next) && n.acceptToken(w5, 1);
}, { contextual: !0 }), w2 = new Ji((n, e) => {
  let t = e.context;
  if (t.flags) return;
  let i = n.peek(-1);
  if (i == ir || i == Hs) {
    let r = 0, s = 0;
    for (; ; ) {
      if (n.next == ff) r++;
      else if (n.next == ka) r += 8 - r % 8;
      else break;
      n.advance(), s++;
    }
    r != t.indent && n.next != ir && n.next != Hs && n.next != uf && (r < t.indent ? n.acceptToken(W1, -s) : n.acceptToken(C1));
  }
}), Al = 1, z1 = 2, Mi = 4, Gi = 8, Di = 16, Ii = 32;
function Ul(n, e, t) {
  this.parent = n, this.indent = e, this.flags = t, this.hash = (n ? n.hash + n.hash << 8 : 0) + e + (e << 4) + t + (t << 6);
}
const k2 = new Ul(null, 0, 0);
function T2(n) {
  let e = 0;
  for (let t = 0; t < n.length; t++)
    e += n.charCodeAt(t) == ka ? 8 - e % 8 : 1;
  return e;
}
const jg = new Map([
  [L5, 0],
  [B5, Mi],
  [j5, Gi],
  [N5, Gi | Mi],
  [F5, Di],
  [H5, Di | Mi],
  [J5, Di | Gi],
  [K5, Di | Gi | Mi],
  [e2, Ii],
  [t2, Ii | Mi],
  [i2, Ii | Gi],
  [n2, Ii | Gi | Mi],
  [r2, Ii | Di],
  [s2, Ii | Di | Mi],
  [o2, Ii | Di | Gi],
  [l2, Ii | Di | Gi | Mi]
].map(([n, e]) => [n, e | z1])), Z2 = new _1({
  start: k2,
  reduce(n, e, t, i) {
    return n.flags & Al && x2.has(e) || (e == I5 || e == A1) && n.flags & z1 ? n.parent : n;
  },
  shift(n, e, t, i) {
    return e == C1 ? new Ul(n, T2(i.read(i.pos, t.pos)), 0) : e == W1 ? n.parent : e == _5 || e == W5 || e == U5 || e == Y1 ? new Ul(n, 0, Al) : jg.has(e) ? new Ul(n, 0, jg.get(e) | n.flags & Al) : n;
  },
  hash(n) {
    return n.hash;
  }
}), R2 = new Ji((n) => {
  for (let e = 0; e < 5; e++) {
    if (n.next != "print".charCodeAt(e)) return;
    n.advance();
  }
  if (!/\w/.test(String.fromCharCode(n.next)))
    for (let e = 0; ; e++) {
      let t = n.peek(e);
      if (!(t == ff || t == ka)) {
        t != g2 && t != m2 && t != ir && t != Hs && t != uf && n.acceptToken(v5);
        return;
      }
    }
}), _2 = new Ji((n, e) => {
  let { flags: t } = e.context, i = t & Mi ? V1 : U1, r = (t & Gi) > 0, s = !(t & Di), l = (t & Ii) > 0, O = n.pos;
  for (; !(n.next < 0); )
    if (l && n.next == yc)
      if (n.peek(1) == yc)
        n.advance(2);
      else {
        if (n.pos == O) {
          n.acceptToken(Y1, 1);
          return;
        }
        break;
      }
    else if (s && n.next == Q2) {
      if (n.pos == O) {
        n.advance();
        let h = n.next;
        h >= 0 && (n.advance(), X2(n, h)), n.acceptToken(R5);
        return;
      }
      break;
    } else if (n.next == i && (!r || n.peek(1) == i && n.peek(2) == i)) {
      if (n.pos == O) {
        n.acceptToken(Lg, r ? 3 : 1);
        return;
      }
      break;
    } else if (n.next == ir) {
      if (r)
        n.advance();
      else if (n.pos == O) {
        n.acceptToken(Lg);
        return;
      }
      break;
    } else
      n.advance();
  n.pos > O && n.acceptToken(Z5);
});
function X2(n, e) {
  if (e == P2)
    for (let t = 0; t < 2 && n.next >= 48 && n.next <= 55; t++) n.advance();
  else if (e == S2)
    for (let t = 0; t < 2 && yh(n.next); t++) n.advance();
  else if (e == b2)
    for (let t = 0; t < 4 && yh(n.next); t++) n.advance();
  else if (e == y2)
    for (let t = 0; t < 8 && yh(n.next); t++) n.advance();
  else if (e == $2 && n.next == yc) {
    for (n.advance(); n.next >= 0 && n.next != Bg && n.next != U1 && n.next != V1 && n.next != ir; ) n.advance();
    n.next == Bg && n.advance();
  }
}
const q2 = Mr({
  'async "*" "**" FormatConversion FormatSpec': $.modifier,
  "for while if elif else try except finally return raise break continue with pass assert await yield match case": $.controlKeyword,
  "in not and or is del": $.operatorKeyword,
  "from def class global nonlocal lambda": $.definitionKeyword,
  import: $.moduleKeyword,
  "with as print": $.keyword,
  Boolean: $.bool,
  None: $.null,
  VariableName: $.variableName,
  "CallExpression/VariableName": $.function($.variableName),
  "FunctionDefinition/VariableName": $.function($.definition($.variableName)),
  "ClassDefinition/VariableName": $.definition($.className),
  PropertyName: $.propertyName,
  "CallExpression/MemberExpression/PropertyName": $.function($.propertyName),
  Comment: $.lineComment,
  Number: $.number,
  String: $.string,
  FormatString: $.special($.string),
  Escape: $.escape,
  UpdateOp: $.updateOperator,
  "ArithOp!": $.arithmeticOperator,
  BitOp: $.bitwiseOperator,
  CompareOp: $.compareOperator,
  AssignOp: $.definitionOperator,
  Ellipsis: $.punctuation,
  At: $.meta,
  "( )": $.paren,
  "[ ]": $.squareBracket,
  "{ }": $.brace,
  ".": $.derefOperator,
  ", ;": $.separator
}), C2 = { __proto__: null, await: 44, or: 54, and: 56, in: 60, not: 62, is: 64, if: 70, else: 72, lambda: 76, yield: 94, from: 96, async: 102, for: 104, None: 162, True: 164, False: 164, del: 178, pass: 182, break: 186, continue: 190, return: 194, raise: 202, import: 206, as: 208, global: 212, nonlocal: 214, assert: 218, type: 223, elif: 236, while: 240, try: 246, except: 248, finally: 250, with: 254, def: 258, class: 268, match: 279, case: 285 }, W2 = kn.deserialize({
  version: 14,
  states: "##jO`QeOOP$}OSOOO&WQtO'#HUOOQS'#Co'#CoOOQS'#Cp'#CpO'vQdO'#CnO*UQtO'#HTOOQS'#HU'#HUOOQS'#DU'#DUOOQS'#HT'#HTO*rQdO'#D_O+VQdO'#DfO+gQdO'#DjO+zOWO'#DuO,VOWO'#DvO.[QtO'#GuOOQS'#Gu'#GuO'vQdO'#GtO0ZQtO'#GtOOQS'#Eb'#EbO0rQdO'#EcOOQS'#Gs'#GsO0|QdO'#GrOOQV'#Gr'#GrO1XQdO'#FYOOQS'#G^'#G^O1^QdO'#FXOOQV'#IS'#ISOOQV'#Gq'#GqOOQV'#Fq'#FqQ`QeOOO'vQdO'#CqO1lQdO'#C}O1sQdO'#DRO2RQdO'#HYO2cQtO'#EVO'vQdO'#EWOOQS'#EY'#EYOOQS'#E['#E[OOQS'#E^'#E^O2wQdO'#E`O3_QdO'#EdO3rQdO'#EfO3zQtO'#EfO1XQdO'#EiO0rQdO'#ElO1XQdO'#EnO0rQdO'#EtO0rQdO'#EwO4VQdO'#EyO4^QdO'#FOO4iQdO'#EzO0rQdO'#FOO1XQdO'#FQO1XQdO'#FVO4nQdO'#F[P4uOdO'#GpPOOO)CBd)CBdOOQS'#Ce'#CeOOQS'#Cf'#CfOOQS'#Cg'#CgOOQS'#Ch'#ChOOQS'#Ci'#CiOOQS'#Cj'#CjOOQS'#Cl'#ClO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO5QQdO'#DoOOQS,5:Y,5:YO5eQdO'#HdOOQS,5:],5:]O5rQ!fO,5:]O5wQtO,59YO1lQdO,59bO1lQdO,59bO1lQdO,59bO8gQdO,59bO8lQdO,59bO8sQdO,59jO8zQdO'#HTO:QQdO'#HSOOQS'#HS'#HSOOQS'#D['#D[O:iQdO,59aO'vQdO,59aO:wQdO,59aOOQS,59y,59yO:|QdO,5:RO'vQdO,5:ROOQS,5:Q,5:QO;[QdO,5:QO;aQdO,5:XO'vQdO,5:XO'vQdO,5:VOOQS,5:U,5:UO;rQdO,5:UO;wQdO,5:WOOOW'#Fy'#FyO;|OWO,5:aOOQS,5:a,5:aO<XQdO'#HwOOOW'#Dw'#DwOOOW'#Fz'#FzO<iOWO,5:bOOQS,5:b,5:bOOQS'#F}'#F}O<wQtO,5:iO?iQtO,5=`O@SQ#xO,5=`O@sQtO,5=`OOQS,5:},5:}OA[QeO'#GWOBnQdO,5;^OOQV,5=^,5=^OByQtO'#IPOChQdO,5;tOOQS-E:[-E:[OOQV,5;s,5;sO4dQdO'#FQOOQV-E9o-E9oOCpQtO,59]OEwQtO,59iOFbQdO'#HVOFmQdO'#HVO1XQdO'#HVOFxQdO'#DTOGQQdO,59mOGVQdO'#HZO'vQdO'#HZO0rQdO,5=tOOQS,5=t,5=tO0rQdO'#EROOQS'#ES'#ESOGtQdO'#GPOHUQdO,58|OHUQdO,58|O*xQdO,5:oOHdQtO'#H]OOQS,5:r,5:rOOQS,5:z,5:zOHwQdO,5;OOIYQdO'#IOO1XQdO'#H}OOQS,5;Q,5;QOOQS'#GT'#GTOInQtO,5;QOI|QdO,5;QOJRQdO'#IQOOQS,5;T,5;TOJaQdO'#H|OOQS,5;W,5;WOJrQdO,5;YO4iQdO,5;`O4iQdO,5;cOJzQtO'#ITO'vQdO'#ITOKUQdO,5;eO4VQdO,5;eO0rQdO,5;jO1XQdO,5;lOKZQeO'#EuOLgQgO,5;fO!!hQdO'#IUO4iQdO,5;jO!!sQdO,5;lO!!{QdO,5;qO!#WQtO,5;vO'vQdO,5;vPOOO,5=[,5=[P!#_OSO,5=[P!#dOdO,5=[O!&XQtO1G.jO!&`QtO1G.jO!)PQtO1G.jO!)ZQtO1G.jO!+tQtO1G.jO!,XQtO1G.jO!,lQdO'#HcO!,zQtO'#GuO0rQdO'#HcO!-UQdO'#HbOOQS,5:Z,5:ZO!-^QdO,5:ZO!-cQdO'#HeO!-nQdO'#HeO!.RQdO,5>OOOQS'#Ds'#DsOOQS1G/w1G/wOOQS1G.|1G.|O!/RQtO1G.|O!/YQtO1G.|O1lQdO1G.|O!/uQdO1G/UOOQS'#DZ'#DZO0rQdO,59tOOQS1G.{1G.{O!/|QdO1G/eO!0^QdO1G/eO!0fQdO1G/fO'vQdO'#H[O!0kQdO'#H[O!0pQtO1G.{O!1QQdO,59iO!2WQdO,5=zO!2hQdO,5=zO!2pQdO1G/mO!2uQtO1G/mOOQS1G/l1G/lO!3VQdO,5=uO!3|QdO,5=uO0rQdO1G/qO!4kQdO1G/sO!4pQtO1G/sO!5QQtO1G/qOOQS1G/p1G/pOOQS1G/r1G/rOOOW-E9w-E9wOOQS1G/{1G/{O!5bQdO'#HxO0rQdO'#HxO!5sQdO,5>cOOOW-E9x-E9xOOQS1G/|1G/|OOQS-E9{-E9{O!6RQ#xO1G2zO!6rQtO1G2zO'vQdO,5<jOOQS,5<j,5<jOOQS-E9|-E9|OOQS,5<r,5<rOOQS-E:U-E:UOOQV1G0x1G0xO1XQdO'#GRO!7ZQtO,5>kOOQS1G1`1G1`O!7xQdO1G1`OOQS'#DV'#DVO0rQdO,5=qOOQS,5=q,5=qO!7}QdO'#FrO!8YQdO,59oO!8bQdO1G/XO!8lQtO,5=uOOQS1G3`1G3`OOQS,5:m,5:mO!9]QdO'#GtOOQS,5<k,5<kOOQS-E9}-E9}O!9nQdO1G.hOOQS1G0Z1G0ZO!9|QdO,5=wO!:^QdO,5=wO0rQdO1G0jO0rQdO1G0jO!:oQdO,5>jO!;QQdO,5>jO1XQdO,5>jO!;cQdO,5>iOOQS-E:R-E:RO!;hQdO1G0lO!;sQdO1G0lO!;xQdO,5>lO!<WQdO,5>lO!<fQdO,5>hO!<|QdO,5>hO!=_QdO'#EpO0rQdO1G0tO!=jQdO1G0tO!=oQgO1G0zO!AmQgO1G0}O!EhQdO,5>oO!ErQdO,5>oO!EzQtO,5>oO0rQdO1G1PO!FUQdO1G1PO4iQdO1G1UO!!sQdO1G1WOOQV,5;a,5;aO!FZQfO,5;aO!F`QgO1G1QO!JaQdO'#GZO4iQdO1G1QO4iQdO1G1QO!JqQdO,5>pO!KOQdO,5>pO1XQdO,5>pOOQV1G1U1G1UO!KWQdO'#FSO!KiQ!fO1G1WO!KqQdO1G1WOOQV1G1]1G1]O4iQdO1G1]O!KvQdO1G1]O!LOQdO'#F^OOQV1G1b1G1bO!#WQtO1G1bPOOO1G2v1G2vP!LTOSO1G2vOOQS,5=},5=}OOQS'#Dp'#DpO0rQdO,5=}O!LYQdO,5=|O!LmQdO,5=|OOQS1G/u1G/uO!LuQdO,5>PO!MVQdO,5>PO!M_QdO,5>PO!MrQdO,5>PO!NSQdO,5>POOQS1G3j1G3jOOQS7+$h7+$hO!8bQdO7+$pO# uQdO1G.|O# |QdO1G.|OOQS1G/`1G/`OOQS,5<`,5<`O'vQdO,5<`OOQS7+%P7+%PO#!TQdO7+%POOQS-E9r-E9rOOQS7+%Q7+%QO#!eQdO,5=vO'vQdO,5=vOOQS7+$g7+$gO#!jQdO7+%PO#!rQdO7+%QO#!wQdO1G3fOOQS7+%X7+%XO##XQdO1G3fO##aQdO7+%XOOQS,5<_,5<_O'vQdO,5<_O##fQdO1G3aOOQS-E9q-E9qO#$]QdO7+%]OOQS7+%_7+%_O#$kQdO1G3aO#%YQdO7+%_O#%_QdO1G3gO#%oQdO1G3gO#%wQdO7+%]O#%|QdO,5>dO#&gQdO,5>dO#&gQdO,5>dOOQS'#Dx'#DxO#&xO&jO'#DzO#'TO`O'#HyOOOW1G3}1G3}O#'YQdO1G3}O#'bQdO1G3}O#'mQ#xO7+(fO#(^QtO1G2UP#(wQdO'#GOOOQS,5<m,5<mOOQS-E:P-E:POOQS7+&z7+&zOOQS1G3]1G3]OOQS,5<^,5<^OOQS-E9p-E9pOOQS7+$s7+$sO#)UQdO,5=`O#)oQdO,5=`O#*QQtO,5<aO#*eQdO1G3cOOQS-E9s-E9sOOQS7+&U7+&UO#*uQdO7+&UO#+TQdO,5<nO#+iQdO1G4UOOQS-E:Q-E:QO#+zQdO1G4UOOQS1G4T1G4TOOQS7+&W7+&WO#,]QdO7+&WOOQS,5<p,5<pO#,hQdO1G4WOOQS-E:S-E:SOOQS,5<l,5<lO#,vQdO1G4SOOQS-E:O-E:OO1XQdO'#EqO#-^QdO'#EqO#-iQdO'#IRO#-qQdO,5;[OOQS7+&`7+&`O0rQdO7+&`O#-vQgO7+&fO!JdQdO'#GXO4iQdO7+&fO4iQdO7+&iO#1tQtO,5<tO'vQdO,5<tO#2OQdO1G4ZOOQS-E:W-E:WO#2YQdO1G4ZO4iQdO7+&kO0rQdO7+&kOOQV7+&p7+&pO!KiQ!fO7+&rO!KqQdO7+&rO`QeO1G0{OOQV-E:X-E:XO4iQdO7+&lO4iQdO7+&lOOQV,5<u,5<uO#2bQdO,5<uO!JdQdO,5<uOOQV7+&l7+&lO#2mQgO7+&lO#6hQdO,5<vO#6sQdO1G4[OOQS-E:Y-E:YO#7QQdO1G4[O#7YQdO'#IWO#7hQdO'#IWO1XQdO'#IWOOQS'#IW'#IWO#7sQdO'#IVOOQS,5;n,5;nO#7{QdO,5;nO0rQdO'#FUOOQV7+&r7+&rO4iQdO7+&rOOQV7+&w7+&wO4iQdO7+&wO#8QQfO,5;xOOQV7+&|7+&|POOO7+(b7+(bO#8VQdO1G3iOOQS,5<c,5<cO#8eQdO1G3hOOQS-E9u-E9uO#8xQdO,5<dO#9TQdO,5<dO#9hQdO1G3kOOQS-E9v-E9vO#9xQdO1G3kO#:QQdO1G3kO#:bQdO1G3kO#9xQdO1G3kOOQS<<H[<<H[O#:mQtO1G1zOOQS<<Hk<<HkP#:zQdO'#FtO8sQdO1G3bO#;XQdO1G3bO#;^QdO<<HkOOQS<<Hl<<HlO#;nQdO7+)QOOQS<<Hs<<HsO#<OQtO1G1yP#<oQdO'#FsO#<|QdO7+)RO#=^QdO7+)RO#=fQdO<<HwO#=kQdO7+({OOQS<<Hy<<HyO#>bQdO,5<bO'vQdO,5<bOOQS-E9t-E9tOOQS<<Hw<<HwOOQS,5<g,5<gO0rQdO,5<gO#>gQdO1G4OOOQS-E9y-E9yO#?QQdO1G4OO<XQdO'#H{OOOO'#D{'#D{OOOO'#F|'#F|O#?cO&jO,5:fOOOW,5>e,5>eOOOW7+)i7+)iO#?nQdO7+)iO#?vQdO1G2zO#@aQdO1G2zP'vQdO'#FuO0rQdO<<IpO1XQdO1G2YP1XQdO'#GSO#@rQdO7+)pO#ATQdO7+)pOOQS<<Ir<<IrP1XQdO'#GUP0rQdO'#GQOOQS,5;],5;]O#AfQdO,5>mO#AtQdO,5>mOOQS1G0v1G0vOOQS<<Iz<<IzOOQV-E:V-E:VO4iQdO<<JQOOQV,5<s,5<sO4iQdO,5<sOOQV<<JQ<<JQOOQV<<JT<<JTO#A|QtO1G2`P#BWQdO'#GYO#B_QdO7+)uO#BiQgO<<JVO4iQdO<<JVOOQV<<J^<<J^O4iQdO<<J^O!KiQ!fO<<J^O#FdQgO7+&gOOQV<<JW<<JWO#FnQgO<<JWOOQV1G2a1G2aO1XQdO1G2aO#JiQdO1G2aO4iQdO<<JWO1XQdO1G2bP0rQdO'#G[O#JtQdO7+)vO#KRQdO7+)vOOQS'#FT'#FTO0rQdO,5>rO#KZQdO,5>rOOQS,5>r,5>rO#KfQdO,5>qO#KwQdO,5>qOOQS1G1Y1G1YOOQS,5;p,5;pOOQV<<Jc<<JcO#LPQdO1G1dOOQS7+)T7+)TP#LUQdO'#FwO#LfQdO1G2OO#LyQdO1G2OO#MZQdO1G2OP#MfQdO'#FxO#MsQdO7+)VO#NTQdO7+)VO#NTQdO7+)VO#N]QdO7+)VO#NmQdO7+(|O8sQdO7+(|OOQSAN>VAN>VO$ WQdO<<LmOOQSAN>cAN>cO0rQdO1G1|O$ hQtO1G1|P$ rQdO'#FvOOQS1G2R1G2RP$!PQdO'#F{O$!^QdO7+)jO$!wQdO,5>gOOOO-E9z-E9zOOOW<<MT<<MTO$#VQdO7+(fOOQSAN?[AN?[OOQS7+'t7+'tO$#pQdO<<M[OOQS,5<q,5<qO$$RQdO1G4XOOQS-E:T-E:TOOQVAN?lAN?lOOQV1G2_1G2_O4iQdOAN?qO$$aQgOAN?qOOQVAN?xAN?xO4iQdOAN?xOOQV<<JR<<JRO4iQdOAN?rO4iQdO7+'{OOQV7+'{7+'{O1XQdO7+'{OOQVAN?rAN?rOOQS7+'|7+'|O$([QdO<<MbOOQS1G4^1G4^O0rQdO1G4^OOQS,5<w,5<wO$(iQdO1G4]OOQS-E:Z-E:ZOOQU'#G_'#G_O$(zQfO7+'OO$)VQdO'#F_O$*^QdO7+'jO$*nQdO7+'jOOQS7+'j7+'jO$*yQdO<<LqO$+ZQdO<<LqO$+ZQdO<<LqO$+cQdO'#H^OOQS<<Lh<<LhO$+mQdO<<LhOOQS7+'h7+'hOOQS'#D|'#D|OOOO1G4R1G4RO$,WQdO1G4RO$,`QdO1G4RP!=_QdO'#GVOOQVG25]G25]O4iQdOG25]OOQVG25dG25dOOQVG25^G25^OOQV<<Kg<<KgO4iQdO<<KgOOQS7+)x7+)xP$,kQdO'#G]OOQU-E:]-E:]OOQV<<Jj<<JjO$-_QtO'#FaOOQS'#Fc'#FcO$-oQdO'#FbO$.aQdO'#FbOOQS'#Fb'#FbO$.fQdO'#IYO$)VQdO'#FiO$)VQdO'#FiO$.}QdO'#FjO$)VQdO'#FkO$/UQdO'#IZOOQS'#IZ'#IZO$/sQdO,5;yOOQS<<KU<<KUO$/{QdO<<KUO$0]QdOANB]O$0mQdOANB]O$0uQdO'#H_OOQS'#H_'#H_O1sQdO'#DcO$1`QdO,5=xOOQSANBSANBSOOOO7+)m7+)mO$1wQdO7+)mOOQVLD*wLD*wOOQVANARANARO5rQ!fO'#GaO$2PQtO,5<SO$)VQdO'#FmOOQS,5<W,5<WOOQS'#Fd'#FdO$2qQdO,5;|O$2vQdO,5;|OOQS'#Fg'#FgO$)VQdO'#G`O$3hQdO,5<QO$4SQdO,5>tO$4dQdO,5>tO1XQdO,5<PO$4uQdO,5<TO$4zQdO,5<TO$)VQdO'#I[O$5PQdO'#I[O$5UQdO,5<UOOQS,5<V,5<VO'vQdO'#FpOOQU1G1e1G1eO4iQdO1G1eOOQSAN@pAN@pO$5ZQdOG27wO$5kQdO,59}OOQS1G3d1G3dOOOO<<MX<<MXOOQS,5<{,5<{OOQS-E:_-E:_O$5pQtO'#FaO$5wQdO'#I]O$6VQdO'#I]O$6_QdO,5<XOOQS1G1h1G1hO$6dQdO1G1hO$6iQdO,5<zOOQS-E:^-E:^O$7TQdO,5=OO$7lQdO1G4`OOQS-E:b-E:bOOQS1G1k1G1kOOQS1G1o1G1oO$7|QdO,5>vO$)VQdO,5>vOOQS1G1p1G1pO$8[QtO,5<[OOQU7+'P7+'PO$+cQdO1G/iO$)VQdO,5<YO$8cQdO,5>wO$8jQdO,5>wOOQS1G1s1G1sOOQS7+'S7+'SP$)VQdO'#GdO$8rQdO1G4bO$8|QdO1G4bO$9UQdO1G4bOOQS7+%T7+%TO$9dQdO1G1tO$9rQtO'#FaO$9yQdO,5<}OOQS,5<},5<}O$:XQdO1G4cOOQS-E:a-E:aO$)VQdO,5<|O$:`QdO,5<|O$:eQdO7+)|OOQS-E:`-E:`O$:oQdO7+)|O$)VQdO,5<ZP$)VQdO'#GcO$:wQdO1G2hO$)VQdO1G2hP$;VQdO'#GbO$;^QdO<<MhO$;hQdO1G1uO$;vQdO7+(SO8sQdO'#C}O8sQdO,59bO8sQdO,59bO8sQdO,59bO$<UQtO,5=`O8sQdO1G.|O0rQdO1G/XO0rQdO7+$pP$<iQdO'#GOO'vQdO'#GtO$<vQdO,59bO$<{QdO,59bO$=SQdO,59mO$=XQdO1G/UO1sQdO'#DRO8sQdO,59j",
  stateData: "$=r~O%cOS%^OSSOS%]PQ~OPdOVaOfoOhYOopOs!POvqO!PrO!Q{O!T!SO!U!RO!XZO!][O!h`O!r`O!s`O!t`O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#l!QO#o!TO#s!UO#u!VO#z!WO#}hO$P!XO%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~O%]!YO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%j![O%k!]O%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aO~Ok%xXl%xXm%xXn%xXo%xXp%xXs%xXz%xX{%xX!x%xX#g%xX%[%xX%_%xX%z%xXg%xX!T%xX!U%xX%{%xX!W%xX![%xX!Q%xX#[%xXt%xX!m%xX~P%SOfoOhYO!XZO!][O!h`O!r`O!s`O!t`O%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~Oz%wX{%wX#g%wX%[%wX%_%wX%z%wX~Ok!pOl!qOm!oOn!oOo!rOp!sOs!tO!x%wX~P)pOV!zOg!|Oo0cOv0qO!PrO~P'vOV#OOo0cOv0qO!W#PO~P'vOV#SOa#TOo0cOv0qO![#UO~P'vOQ#XO%`#XO%a#ZO~OQ#^OR#[O%`#^O%a#`O~OV%iX_%iXa%iXh%iXk%iXl%iXm%iXn%iXo%iXp%iXs%iXz%iX!X%iX!f%iX%j%iX%k%iX%l%iX%m%iX%n%iX%o%iX%p%iX%q%iX%r%iX%s%iXg%iX!T%iX!U%iX~O&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O{%iX!x%iX#g%iX%[%iX%_%iX%z%iX%{%iX!W%iX![%iX!Q%iX#[%iXt%iX!m%iX~P,eOz#dO{%hX!x%hX#g%hX%[%hX%_%hX%z%hX~Oo0cOv0qO~P'vO#g#gO%[#iO%_#iO~O%uWO~O!T#nO#u!VO#z!WO#}hO~OopO~P'vOV#sOa#tO%uWO{wP~OV#xOo0cOv0qO!Q#yO~P'vO{#{O!x$QO%z#|O#g!yX%[!yX%_!yX~OV#xOo0cOv0qO#g#SX%[#SX%_#SX~P'vOo0cOv0qO#g#WX%[#WX%_#WX~P'vOh$WO%uWO~O!f$YO!r$YO%uWO~OV$eO~P'vO!U$gO#s$hO#u$iO~O{$jO~OV$qO~P'vOS$sO%[$rO%c$tO~OV$}Oa$}Og%POo0cOv0qO~P'vOo0cOv0qO{%SO~P'vO&Y%UO~Oa!bOh!iO!X!kO!f!mOVba_bakbalbambanbaobapbasbazba{ba!xba#gba%[ba%_ba%jba%kba%lba%mba%nba%oba%pba%qba%rba%sba%zbagba!Tba!Uba%{ba!Wba![ba!Qba#[batba!mba~On%ZO~Oo%ZO~P'vOo0cO~P'vOk0eOl0fOm0dOn0dOo0mOp0nOs0rOg%wX!T%wX!U%wX%{%wX!W%wX![%wX!Q%wX#[%wX!m%wX~P)pO%{%]Og%vXz%vX!T%vX!U%vX!W%vX{%vX~Og%_Oz%`O!T%dO!U%cO~Og%_O~Oz%gO!T%dO!U%cO!W&SX~O!W%kO~Oz%lO{%nO!T%dO!U%cO![%}X~O![%rO~O![%sO~OQ#XO%`#XO%a%uO~OV%wOo0cOv0qO!PrO~P'vOQ#^OR#[O%`#^O%a%zO~OV!qa_!qaa!qah!qak!qal!qam!qan!qao!qap!qas!qaz!qa{!qa!X!qa!f!qa!x!qa#g!qa%[!qa%_!qa%j!qa%k!qa%l!qa%m!qa%n!qa%o!qa%p!qa%q!qa%r!qa%s!qa%z!qag!qa!T!qa!U!qa%{!qa!W!qa![!qa!Q!qa#[!qat!qa!m!qa~P#yOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P%SOV&OOopOvqO{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P'vOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#g$zX%[$zX%_$zX~P'vO#g#gO%[&TO%_&TO~O!f&UOh&sX%[&sXz&sX#[&sX#g&sX%_&sX#Z&sXg&sX~Oh!iO%[&WO~Okealeameaneaoeapeaseazea{ea!xea#gea%[ea%_ea%zeagea!Tea!Uea%{ea!Wea![ea!Qea#[eatea!mea~P%SOsqazqa{qa#gqa%[qa%_qa%zqa~Ok!pOl!qOm!oOn!oOo!rOp!sO!xqa~PE`O%z&YOz%yX{%yX~O%uWOz%yX{%yX~Oz&]O{wX~O{&_O~Oz%lO#g%}X%[%}X%_%}Xg%}X{%}X![%}X!m%}X%z%}X~OV0lOo0cOv0qO!PrO~P'vO%z#|O#gUa%[Ua%_Ua~Oz&hO#g&PX%[&PX%_&PXn&PX~P%SOz&kO!Q&jO#g#Wa%[#Wa%_#Wa~Oz&lO#[&nO#g&rX%[&rX%_&rXg&rX~O!f$YO!r$YO#Z&qO%uWO~O#Z&qO~Oz&sO#g&tX%[&tX%_&tX~Oz&uO#g&pX%[&pX%_&pX{&pX~O!X&wO%z&xO~Oz&|On&wX~P%SOn'PO~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO%['UO~P'vOt'YO#p'WO#q'XOP#naV#naf#nah#nao#nas#nav#na!P#na!Q#na!T#na!U#na!X#na!]#na!h#na!r#na!s#na!t#na!{#na!}#na#P#na#R#na#T#na#X#na#Z#na#^#na#_#na#a#na#c#na#l#na#o#na#s#na#u#na#z#na#}#na$P#na%X#na%o#na%p#na%t#na%u#na&Z#na&[#na&]#na&^#na&_#na&`#na&a#na&b#na&c#na&d#na&e#na&f#na&g#na&h#na&i#na&j#na%Z#na%_#na~Oz'ZO#[']O{&xX~Oh'_O!X&wO~Oh!iO{$jO!X&wO~O{'eO~P%SO%['hO~OS'iO%['hO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%k!]O~P!#lO%kWi~P!#lOV!aO_!aOa!bOh!iO!X!kO!f!mO%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%m!_O%n!_O~P!&gO%mWi%nWi~P!&gOa!bOh!iO!X!kO!f!mOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%mWi%nWi%oWi%pWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~OV!aO_!aO%q!aO%r!aO%s!aO~P!)eOVWi_Wi%qWi%rWi%sWi~P!)eO!T%dO!U%cOg&VXz&VX~O%z'kO%{'kO~P,eOz'mOg&UX~Og'oO~Oz'pO{'rO!W&XX~Oo0cOv0qOz'pO{'sO!W&XX~P'vO!W'uO~Om!oOn!oOo!rOp!sOkjisjizji{ji!xji#gji%[ji%_ji%zji~Ol!qO~P!.WOlji~P!.WOk0eOl0fOm0dOn0dOo0mOp0nO~Ot'wO~P!/aOV'|Og'}Oo0cOv0qO~P'vOg'}Oz(OO~Og(QO~O!U(SO~Og(TOz(OO!T%dO!U%cO~P%SOk0eOl0fOm0dOn0dOo0mOp0nOgqa!Tqa!Uqa%{qa!Wqa![qa!Qqa#[qatqa!mqa~PE`OV'|Oo0cOv0qO!W&Sa~P'vOz(WO!W&Sa~O!W(XO~Oz(WO!T%dO!U%cO!W&Sa~P%SOV(]Oo0cOv0qO![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~P'vOz(^O![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~O![(aO~Oz(^O!T%dO!U%cO![%}a~P%SOz(dO!T%dO!U%cO![&Ta~P%SOz(gO{&lX![&lX!m&lX%z&lX~O{(kO![(mO!m(nO%z(jO~OV&OOopOvqO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~P'vOz(pO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~O!f&UOh&sa%[&saz&sa#[&sa#g&sa%_&sa#Z&sag&sa~O%[(uO~OV#sOa#tO%uWO~Oz&]O{wa~OopOvqO~P'vOz(^O#g%}a%[%}a%_%}ag%}a{%}a![%}a!m%}a%z%}a~P%SOz(zO#g%hX%[%hX%_%hX%z%hX~O%z#|O#gUi%[Ui%_Ui~O#g&Pa%[&Pa%_&Pan&Pa~P'vOz(}O#g&Pa%[&Pa%_&Pan&Pa~O%uWO#g&ra%[&ra%_&rag&ra~Oz)SO#g&ra%[&ra%_&rag&ra~Og)VO~OV)WOh$WO%uWO~O#Z)XO~O%uWO#g&ta%[&ta%_&ta~Oz)ZO#g&ta%[&ta%_&ta~Oo0cOv0qO#g&pa%[&pa%_&pa{&pa~P'vOz)^O#g&pa%[&pa%_&pa{&pa~OV)`Oa)`O%uWO~O%z)eO~Ot)hO#j)gOP#hiV#hif#hih#hio#his#hiv#hi!P#hi!Q#hi!T#hi!U#hi!X#hi!]#hi!h#hi!r#hi!s#hi!t#hi!{#hi!}#hi#P#hi#R#hi#T#hi#X#hi#Z#hi#^#hi#_#hi#a#hi#c#hi#l#hi#o#hi#s#hi#u#hi#z#hi#}#hi$P#hi%X#hi%o#hi%p#hi%t#hi%u#hi&Z#hi&[#hi&]#hi&^#hi&_#hi&`#hi&a#hi&b#hi&c#hi&d#hi&e#hi&f#hi&g#hi&h#hi&i#hi&j#hi%Z#hi%_#hi~Ot)iOP#kiV#kif#kih#kio#kis#kiv#ki!P#ki!Q#ki!T#ki!U#ki!X#ki!]#ki!h#ki!r#ki!s#ki!t#ki!{#ki!}#ki#P#ki#R#ki#T#ki#X#ki#Z#ki#^#ki#_#ki#a#ki#c#ki#l#ki#o#ki#s#ki#u#ki#z#ki#}#ki$P#ki%X#ki%o#ki%p#ki%t#ki%u#ki&Z#ki&[#ki&]#ki&^#ki&_#ki&`#ki&a#ki&b#ki&c#ki&d#ki&e#ki&f#ki&g#ki&h#ki&i#ki&j#ki%Z#ki%_#ki~OV)kOn&wa~P'vOz)lOn&wa~Oz)lOn&wa~P%SOn)pO~O%Y)tO~Ot)wO#p'WO#q)vOP#niV#nif#nih#nio#nis#niv#ni!P#ni!Q#ni!T#ni!U#ni!X#ni!]#ni!h#ni!r#ni!s#ni!t#ni!{#ni!}#ni#P#ni#R#ni#T#ni#X#ni#Z#ni#^#ni#_#ni#a#ni#c#ni#l#ni#o#ni#s#ni#u#ni#z#ni#}#ni$P#ni%X#ni%o#ni%p#ni%t#ni%u#ni&Z#ni&[#ni&]#ni&^#ni&_#ni&`#ni&a#ni&b#ni&c#ni&d#ni&e#ni&f#ni&g#ni&h#ni&i#ni&j#ni%Z#ni%_#ni~OV)zOo0cOv0qO{$jO~P'vOo0cOv0qO{&xa~P'vOz*OO{&xa~OV*SOa*TOg*WO%q*UO%uWO~O{$jO&{*YO~Oh'_O~Oh!iO{$jO~O%[*_O~O%[*aO~OV$}Oa$}Oo0cOv0qOg&Ua~P'vOz*dOg&Ua~Oo0cOv0qO{*gO!W&Xa~P'vOz*hO!W&Xa~Oo0cOv0qOz*hO{*kO!W&Xa~P'vOo0cOv0qOz*hO!W&Xa~P'vOz*hO{*kO!W&Xa~Om0dOn0dOo0mOp0nOgjikjisjizji!Tji!Uji%{ji!Wji{ji![ji#gji%[ji%_ji!Qji#[jitji!mji%zji~Ol0fO~P!N_Olji~P!N_OV'|Og*pOo0cOv0qO~P'vOn*rO~Og*pOz*tO~Og*uO~OV'|Oo0cOv0qO!W&Si~P'vOz*vO!W&Si~O!W*wO~OV(]Oo0cOv0qO![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~P'vOz*zO!T%dO!U%cO![&Ti~Oz*}O![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~O![+OO~Oa+QOo0cOv0qO![&Ti~P'vOz*zO![&Ti~O![+SO~OV+UOo0cOv0qO{&la![&la!m&la%z&la~P'vOz+VO{&la![&la!m&la%z&la~O!]+YO&n+[O![!nX~O![+^O~O{(kO![+_O~O{(kO![+_O!m+`O~OV&OOopOvqO{%hq!x%hq#g%hq%[%hq%_%hq%z%hq~P'vOz$ri{$ri!x$ri#g$ri%[$ri%_$ri%z$ri~P%SOV&OOopOvqO~P'vOV&OOo0cOv0qO#g%ha%[%ha%_%ha%z%ha~P'vOz+aO#g%ha%[%ha%_%ha%z%ha~Oz$ia#g$ia%[$ia%_$ian$ia~P%SO#g&Pi%[&Pi%_&Pin&Pi~P'vOz+dO#g#Wq%[#Wq%_#Wq~O#[+eOz$va#g$va%[$va%_$vag$va~O%uWO#g&ri%[&ri%_&rig&ri~Oz+gO#g&ri%[&ri%_&rig&ri~OV+iOh$WO%uWO~O%uWO#g&ti%[&ti%_&ti~Oo0cOv0qO#g&pi%[&pi%_&pi{&pi~P'vO{#{Oz#eX!W#eX~Oz+mO!W&uX~O!W+oO~Ot+rO#j)gOP#hqV#hqf#hqh#hqo#hqs#hqv#hq!P#hq!Q#hq!T#hq!U#hq!X#hq!]#hq!h#hq!r#hq!s#hq!t#hq!{#hq!}#hq#P#hq#R#hq#T#hq#X#hq#Z#hq#^#hq#_#hq#a#hq#c#hq#l#hq#o#hq#s#hq#u#hq#z#hq#}#hq$P#hq%X#hq%o#hq%p#hq%t#hq%u#hq&Z#hq&[#hq&]#hq&^#hq&_#hq&`#hq&a#hq&b#hq&c#hq&d#hq&e#hq&f#hq&g#hq&h#hq&i#hq&j#hq%Z#hq%_#hq~On$|az$|a~P%SOV)kOn&wi~P'vOz+yOn&wi~Oz,TO{$jO#[,TO~O#q,VOP#nqV#nqf#nqh#nqo#nqs#nqv#nq!P#nq!Q#nq!T#nq!U#nq!X#nq!]#nq!h#nq!r#nq!s#nq!t#nq!{#nq!}#nq#P#nq#R#nq#T#nq#X#nq#Z#nq#^#nq#_#nq#a#nq#c#nq#l#nq#o#nq#s#nq#u#nq#z#nq#}#nq$P#nq%X#nq%o#nq%p#nq%t#nq%u#nq&Z#nq&[#nq&]#nq&^#nq&_#nq&`#nq&a#nq&b#nq&c#nq&d#nq&e#nq&f#nq&g#nq&h#nq&i#nq&j#nq%Z#nq%_#nq~O#[,WOz%Oa{%Oa~Oo0cOv0qO{&xi~P'vOz,YO{&xi~O{#{O%z,[Og&zXz&zX~O%uWOg&zXz&zX~Oz,`Og&yX~Og,bO~O%Y,eO~O!T%dO!U%cOg&Viz&Vi~OV$}Oa$}Oo0cOv0qOg&Ui~P'vO{,hOz$la!W$la~Oo0cOv0qO{,iOz$la!W$la~P'vOo0cOv0qO{*gO!W&Xi~P'vOz,lO!W&Xi~Oo0cOv0qOz,lO!W&Xi~P'vOz,lO{,oO!W&Xi~Og$hiz$hi!W$hi~P%SOV'|Oo0cOv0qO~P'vOn,qO~OV'|Og,rOo0cOv0qO~P'vOV'|Oo0cOv0qO!W&Sq~P'vOz$gi![$gi#g$gi%[$gi%_$gig$gi{$gi!m$gi%z$gi~P%SOV(]Oo0cOv0qO~P'vOa+QOo0cOv0qO![&Tq~P'vOz,sO![&Tq~O![,tO~OV(]Oo0cOv0qO![%}q#g%}q%[%}q%_%}qg%}q{%}q!m%}q%z%}q~P'vO{,uO~OV+UOo0cOv0qO{&li![&li!m&li%z&li~P'vOz,zO{&li![&li!m&li%z&li~O!]+YO&n+[O![!na~O{(kO![,}O~OV&OOo0cOv0qO#g%hi%[%hi%_%hi%z%hi~P'vOz-OO#g%hi%[%hi%_%hi%z%hi~O%uWO#g&rq%[&rq%_&rqg&rq~Oz-RO#g&rq%[&rq%_&rqg&rq~OV)`Oa)`O%uWO!W&ua~Oz-TO!W&ua~On$|iz$|i~P%SOV)kO~P'vOV)kOn&wq~P'vOt-XOP#myV#myf#myh#myo#mys#myv#my!P#my!Q#my!T#my!U#my!X#my!]#my!h#my!r#my!s#my!t#my!{#my!}#my#P#my#R#my#T#my#X#my#Z#my#^#my#_#my#a#my#c#my#l#my#o#my#s#my#u#my#z#my#}#my$P#my%X#my%o#my%p#my%t#my%u#my&Z#my&[#my&]#my&^#my&_#my&`#my&a#my&b#my&c#my&d#my&e#my&f#my&g#my&h#my&i#my&j#my%Z#my%_#my~O%Z-]O%_-]O~P`O#q-^OP#nyV#nyf#nyh#nyo#nys#nyv#ny!P#ny!Q#ny!T#ny!U#ny!X#ny!]#ny!h#ny!r#ny!s#ny!t#ny!{#ny!}#ny#P#ny#R#ny#T#ny#X#ny#Z#ny#^#ny#_#ny#a#ny#c#ny#l#ny#o#ny#s#ny#u#ny#z#ny#}#ny$P#ny%X#ny%o#ny%p#ny%t#ny%u#ny&Z#ny&[#ny&]#ny&^#ny&_#ny&`#ny&a#ny&b#ny&c#ny&d#ny&e#ny&f#ny&g#ny&h#ny&i#ny&j#ny%Z#ny%_#ny~Oz-aO{$jO#[-aO~Oo0cOv0qO{&xq~P'vOz-dO{&xq~O%z,[Og&zaz&za~OV*SOa*TO%q*UO%uWOg&ya~Oz-hOg&ya~O$S-lO~OV$}Oa$}Oo0cOv0qO~P'vOo0cOv0qO{-mOz$li!W$li~P'vOo0cOv0qOz$li!W$li~P'vO{-mOz$li!W$li~Oo0cOv0qO{*gO~P'vOo0cOv0qO{*gO!W&Xq~P'vOz-pO!W&Xq~Oo0cOv0qOz-pO!W&Xq~P'vOs-sO!T%dO!U%cOg&Oq!W&Oq![&Oqz&Oq~P!/aOa+QOo0cOv0qO![&Ty~P'vOz$ji![$ji~P%SOa+QOo0cOv0qO~P'vOV+UOo0cOv0qO~P'vOV+UOo0cOv0qO{&lq![&lq!m&lq%z&lq~P'vO{(kO![-xO!m-yO%z-wO~OV&OOo0cOv0qO#g%hq%[%hq%_%hq%z%hq~P'vO%uWO#g&ry%[&ry%_&ryg&ry~OV)`Oa)`O%uWO!W&ui~Ot-}OP#m!RV#m!Rf#m!Rh#m!Ro#m!Rs#m!Rv#m!R!P#m!R!Q#m!R!T#m!R!U#m!R!X#m!R!]#m!R!h#m!R!r#m!R!s#m!R!t#m!R!{#m!R!}#m!R#P#m!R#R#m!R#T#m!R#X#m!R#Z#m!R#^#m!R#_#m!R#a#m!R#c#m!R#l#m!R#o#m!R#s#m!R#u#m!R#z#m!R#}#m!R$P#m!R%X#m!R%o#m!R%p#m!R%t#m!R%u#m!R&Z#m!R&[#m!R&]#m!R&^#m!R&_#m!R&`#m!R&a#m!R&b#m!R&c#m!R&d#m!R&e#m!R&f#m!R&g#m!R&h#m!R&i#m!R&j#m!R%Z#m!R%_#m!R~Oo0cOv0qO{&xy~P'vOV*SOa*TO%q*UO%uWOg&yi~O$S-lO%Z.VO%_.VO~OV.aOh._O!X.^O!].`O!h.YO!s.[O!t.[O%p.XO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O~Oo0cOv0qOz$lq!W$lq~P'vO{.fOz$lq!W$lq~Oo0cOv0qO{*gO!W&Xy~P'vOz.gO!W&Xy~Oo0cOv.kO~P'vOs-sO!T%dO!U%cOg&Oy!W&Oy![&Oyz&Oy~P!/aO{(kO![.nO~O{(kO![.nO!m.oO~OV*SOa*TO%q*UO%uWO~Oh.tO!f.rOz$TX#[$TX%j$TXg$TX~Os$TX{$TX!W$TX![$TX~P$,yO%o.vO%p.vOs$UXz$UX{$UX#[$UX%j$UX!W$UXg$UX![$UX~O!h.xO~Oz.|O#[/OO%j.yOs&|X{&|X!W&|Xg&|X~Oa/RO~P$)cOh.tOs&}Xz&}X{&}X#[&}X%j&}X!W&}Xg&}X![&}X~Os/VO{$jO~Oo0cOv0qOz$ly!W$ly~P'vOo0cOv0qO{*gO!W&X!R~P'vOz/ZO!W&X!R~Og&RXs&RX!T&RX!U&RX!W&RX![&RXz&RX~P!/aOs-sO!T%dO!U%cOg&Qa!W&Qa![&Qaz&Qa~O{(kO![/^O~O!f.rOh$[as$[az$[a{$[a#[$[a%j$[a!W$[ag$[a![$[a~O!h/eO~O%o.vO%p.vOs$Uaz$Ua{$Ua#[$Ua%j$Ua!W$Uag$Ua![$Ua~O%j.yOs$Yaz$Ya{$Ya#[$Ya!W$Yag$Ya![$Ya~Os&|a{&|a!W&|ag&|a~P$)VOz/jOs&|a{&|a!W&|ag&|a~O!W/mO~Og/mO~O{/oO~O![/pO~Oo0cOv0qO{*gO!W&X!Z~P'vO{/sO~O%z/tO~P$,yOz/uO#[/OO%j.yOg'PX~Oz/uOg'PX~Og/wO~O!h/xO~O#[/OOs%Saz%Sa{%Sa%j%Sa!W%Sag%Sa![%Sa~O#[/OO%j.yOs%Waz%Wa{%Wa!W%Wag%Wa~Os&|i{&|i!W&|ig&|i~P$)VOz/zO#[/OO%j.yO!['Oa~O{$da~P%SOg'Pa~P$)VOz0SOg'Pa~Oa0UO!['Oi~P$)cOz0WO!['Oi~Oz0WO#[/OO%j.yO!['Oi~O#[/OO%j.yOg$biz$bi~O%z0ZO~P$,yO#[/OO%j.yOg%Vaz%Va~Og'Pi~P$)VO{0^O~Oa0UO!['Oq~P$)cOz0`O!['Oq~O#[/OO%j.yOz%Ui![%Ui~Oa0UO~P$)cOa0UO!['Oy~P$)cO#[/OO%j.yOg$ciz$ci~O#[/OO%j.yOz%Uq![%Uq~Oz+aO#g%ha%[%ha%_%ha%z%ha~P%SOV&OOo0cOv0qO~P'vOn0hO~Oo0hO~P'vO{0iO~Ot0jO~P!/aO&]&Z&j&h&i&g&f&d&e&c&b&`&a&_&^&[%u~",
  goto: "!=l'QPPPPPP'RP'Z*s+]+v,b,}-kP.YP'Z.y.y'ZPPP'Z2cPPPPPP2c5VPP5VP7g7p=xPP={>m>pPP'Z'ZPP?PPP'Z'ZPP'Z'Z'Z'Z'Z?T?}'ZP@QP@WD_G{HPPHSH^Hb'ZPPPHeHn'RP'R'RP'RP'RP'RP'RP'R'R'RP'RPP'RPP'RP'RPHtIQIYPIaIgPIaPIaIaPPPIaPKuPLOLYL`KuPIaLiPIaPLpLvPLzM`M}NhLzLzNnN{LzLzLzLz! a! g! j! o! r! |!!S!!`!!r!!x!#S!#Y!#v!#|!$S!$^!$d!$j!$|!%W!%^!%d!%n!%t!%z!&Q!&W!&^!&h!&n!&x!'O!'X!'_!'n!'v!(Q!(XPPPPPPPPPPP!(_!(b!(h!(q!({!)WPPPPPPPPPPPP!-z!/`!3`!6pPP!6x!7X!7b!8Z!8Q!8d!8j!8m!8p!8s!8{!9lPPPPPPPPPPPPPPPPP!9o!9s!9yP!:_!:c!:o!:x!;U!;l!;o!;r!;x!<O!<U!<XP!<a!<j!=f!=i]eOn#g$j)t,P'}`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r}!cQ#c#p$R$d$p%e%j%p%q&`'O'g(q(|)j*o*x+w,v/q0g!P!dQ#c#p$R$d$p$u%e%j%p%q&`'O'g(q(|)j*o*x+w,v/q0g!R!eQ#c#p$R$d$p$u$v%e%j%p%q&`'O'g(q(|)j*o*x+w,v/q0g!T!fQ#c#p$R$d$p$u$v$w%e%j%p%q&`'O'g(q(|)j*o*x+w,v/q0g!V!gQ#c#p$R$d$p$u$v$w$x%e%j%p%q&`'O'g(q(|)j*o*x+w,v/q0g!X!hQ#c#p$R$d$p$u$v$w$x$y%e%j%p%q&`'O'g(q(|)j*o*x+w,v/q0g!]!hQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v/q0g'}TOTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r&cVOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/Z/s0c0d0e0f0h0i0j0k0n0r%mXOYZ[dnrxy}!P!Q!U!i!k#[#d#g#y#{#}$Q$h$j$}%S%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/Z0i0j0kQ#vqQ/[.kR0o0q't`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rh#jhz{$W$Z&l&q)S)X+f+g-RW#rq&].k0qQ$]|Q$a!OQ$n!VQ$o!WW$|!i'm*d,gS&[#s#tQ'S$iQ(s&UQ)U&nU)Y&s)Z+jW)a&w+m-T-{Q*Q']W*R'_,`-h.TQ+l)`S,_*S*TQ-Q+eQ-_,TQ-c,WQ.R-al.W-l.^._.a.z.|/R/j/o/t/y0U0Z0^Q/S.`Q/a.tQ/l/OU0P/u0S0[X0V/z0W0_0`R&Z#r!_!wYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZR%^!vQ!{YQ%x#[Q&d#}Q&g$QR,{+YT.j-s/s![!jQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v/q0gQ&X#kQ'c$oR*^'dR'l$|Q%V!mR/_.r'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rS#a_#b!P.[-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rT#a_#bT#^^#_R(o%xa(l%x(n(o+`,{-y-z.oT+[(k+]R-z,{Q$PsQ+l)aR,^*RX#}s$O$P&fQ&y$aQ'a$nQ'd$oR)s'SQ)b&wV-S+m-T-{ZgOn$j)t,PXkOn)t,PQ$k!TQ&z$bQ&{$cQ'^$mQ'b$oQ)q'RQ)x'WQ){'XQ)|'YQ*Z'`S*]'c'dQ+s)gQ+u)hQ+v)iQ+z)oS+|)r*[Q,Q)vQ,R)wS,S)y)zQ,d*^Q-V+rQ-W+tQ-Y+{S-Z+},OQ-`,UQ-b,VQ-|-XQ.O-[Q.P-^Q.Q-_Q.p-}Q.q.RQ/W.dR/r/XWkOn)t,PR#mjQ'`$nS)r'S'aR,O)sQ,]*RR-f,^Q*['`Q+})rR-[,OZiOjn)t,PQ'f$pR*`'gT-j,e-ku.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^t.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^Q/S.`X0V/z0W0_0`!P.Z-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`Q.w.YR/f.xg.z.].{/b/i/n/|0O0Q0]0a0bu.b-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^X.u.W.b/a0PR/c.tV0R/u0S0[R/X.dQnOS#on,PR,P)tQ&^#uR(x&^S%m#R#wS(_%m(bT(b%p&`Q%a!yQ%h!}W(P%a%h(U(YQ(U%eR(Y%jQ&i$RR)O&iQ(e%qQ*{(`T+R(e*{Q'n%OR*e'nS'q%R%SY*i'q*j,m-q.hU*j'r's'tU,m*k*l*mS-q,n,oR.h-rQ#Y]R%t#YQ#_^R%y#_Q(h%vS+W(h+XR+X(iQ+](kR,|+]Q#b_R%{#bQ#ebQ%}#cW&Q#e%}({+bQ({&cR+b0gQ$OsS&e$O&fR&f$PQ&v$_R)_&vQ&V#jR(t&VQ&m$VS)T&m+hR+h)UQ$Z{R&p$ZQ&t$]R)[&tQ+n)bR-U+nQ#hfR&S#hQ)f&zR+q)fQ&}$dS)m&})nR)n'OQ'V$kR)u'VQ'[$lS*P'[,ZR,Z*QQ,a*VR-i,aWjOn)t,PR#ljQ-k,eR.U-kd.{.]/b/i/n/|0O0Q0]0a0bR/h.{U.s.W/a0PR/`.sQ/{/nS0X/{0YR0Y/|S/v/b/cR0T/vQ.}.]R/k.}R!ZPXmOn)t,PWlOn)t,PR'T$jYfOn$j)t,PR&R#g[sOn#g$j)t,PR&d#}&bQOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/Z/s0c0d0e0f0h0i0j0k0n0rQ!nTQ#caQ#poU$Rt%c(SS$d!R$gQ$p!XQ$u!cQ$v!dQ$w!eQ$x!fQ$y!gQ$z!hQ%e!zQ%j#OQ%p#SQ%q#TQ&`#xQ'O$eQ'g$qQ(q&OU(|&h(}+cW)j&|)l+x+yQ*o'|Q*x(]Q+w)kQ,v+QQ/q/VR0g0lQ!yYQ!}ZQ$b!PQ$c!QQ%R!kQ't%S^'{%`%g(O(W*q*t*v^*f'p*h,k,l-p.g/ZQ*l'rQ*m'sQ+t)gQ,j*gQ,n*kQ-n,hQ-o,iQ-r,oQ.e-mR/Y.f[bOn#g$j)t,P!^!vYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZQ#R[Q#fdS#wrxQ$UyW$_}$Q'P)pS$l!U$hW${!i'm*d,gS%v#[+Y`&P#d%|(p(r(z+a-O0kQ&a#yQ&b#{Q&c#}Q'j$}Q'z%^W([%l(^*y*}Q(`%nQ(i%wQ(v&ZS(y&_0iQ)P&jQ)Q&kU)]&u)^+kQ)d&xQ)y'WY)}'Z*O,X,Y-dQ*b'lS*n'w0jW+P(d*z,s,wW+T(g+V,y,zQ+p)eQ,U)zQ,c*YQ,x+UQ-P+dQ-e,]Q-v,uR.S-fhUOn#d#g$j%|&_'w(p(r)t,P%S!uYZ[drxy}!P!Q!U!i!k#[#y#{#}$Q$h$}%S%^%`%g%l%n%w&Z&j&k&u&x'P'W'Z'l'm'p'r's(O(W(^(d(g(z)^)e)g)p)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/Z0i0j0kQ#qpW%W!o!s0d0nQ%X!pQ%Y!qQ%[!tQ%f0cS'v%Z0hQ'x0eQ'y0fQ,p*rQ-u,qS.i-s/sR0p0rU#uq.k0qR(w&][cOn#g$j)t,PZ!xY#[#}$Q+YQ#W[Q#zrR$TxQ%b!yQ%i!}Q%o#RQ'j${Q(V%eQ(Z%jQ(c%pQ(f%qQ*|(`Q,f*bQ-t,pQ.m-uR/].lQ$StQ(R%cR*s(SQ.l-sR/}/sR#QZR#V[R%Q!iQ%O!iV*c'm*d,g!]!lQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v/q0gR%T!kT#]^#_Q%x#[R,{+YQ(m%xS+_(n(oQ,}+`Q-x,{S.n-y-zR/^.oT+Z(k+]Q$`}Q&g$QQ)o'PR+{)pQ$XzQ)W&qR+i)XQ$XzQ&o$WQ)W&qR+i)XQ#khW$Vz$W&q)XQ$[{Q&r$ZZ)R&l)S+f+g-RR$^|R)c&wXlOn)t,PQ$f!RR'Q$gQ$m!UR'R$hR*X'_Q*V'_V-g,`-h.TQ.d-lQ/P.^R/Q._U.]-l.^._Q/U.aQ/b.tQ/g.zU/i.|/j/yQ/n/RQ/|/oQ0O/tU0Q/u0S0[Q0]0UQ0a0ZR0b0^R/T.`R/d.t",
  nodeNames: "⚠ print Escape { Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ) ( ParenthesizedExpression BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from TupleExpression ComprehensionExpression async for LambdaExpression ] [ ArrayExpression ArrayComprehensionExpression } { DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatSelfDoc FormatConversion FormatSpec FormatReplacement FormatSelfDoc ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert TypeDefinition type TypeParamList TypeParam StatementGroup ; IfStatement Body elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At MatchStatement match MatchBody MatchClause case CapturePattern LiteralPattern ArithOp ArithOp AsPattern OrPattern LogicOp AttributePattern SequencePattern MappingPattern StarPattern ClassPattern PatternArgList KeywordPattern KeywordPattern Guard",
  maxTerm: 277,
  context: Z2,
  nodeProps: [
    ["isolate", -5, 4, 71, 72, 73, 77, ""],
    ["group", -15, 6, 85, 87, 88, 90, 92, 94, 96, 98, 99, 100, 102, 105, 108, 110, "Statement Statement", -22, 8, 18, 21, 25, 40, 49, 50, 56, 57, 60, 61, 62, 63, 64, 67, 70, 71, 72, 79, 80, 81, 82, "Expression", -10, 114, 116, 119, 121, 122, 126, 128, 133, 135, 138, "Statement", -9, 143, 144, 147, 148, 150, 151, 152, 153, 154, "Pattern"],
    ["openedBy", 23, "(", 54, "[", 58, "{"],
    ["closedBy", 24, ")", 55, "]", 59, "}"]
  ],
  propSources: [q2],
  skippedNodes: [0, 4],
  repeatNodeCount: 34,
  tokenData: "!2|~R!`OX%TXY%oY[%T[]%o]p%Tpq%oqr'ars)Yst*xtu%Tuv,dvw-hwx.Uxy/tyz0[z{0r{|2S|}2p}!O3W!O!P4_!P!Q:Z!Q!R;k!R![>_![!]Do!]!^Es!^!_FZ!_!`Gk!`!aHX!a!b%T!b!cIf!c!dJU!d!eK^!e!hJU!h!i!#f!i!tJU!t!u!,|!u!wJU!w!x!.t!x!}JU!}#O!0S#O#P&o#P#Q!0j#Q#R!1Q#R#SJU#S#T%T#T#UJU#U#VK^#V#YJU#Y#Z!#f#Z#fJU#f#g!,|#g#iJU#i#j!.t#j#oJU#o#p!1n#p#q!1s#q#r!2a#r#s!2f#s$g%T$g;'SJU;'S;=`KW<%lOJU`%YT&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T`%lP;=`<%l%To%v]&n`%c_OX%TXY%oY[%T[]%o]p%Tpq%oq#O%T#O#P&o#P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To&tX&n`OY%TYZ%oZ]%T]^%o^#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc'f[&n`O!_%T!_!`([!`#T%T#T#U(r#U#f%T#f#g(r#g#h(r#h#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(cTmR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(yT!mR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk)aV&n`&[ZOr%Trs)vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk){V&n`Or%Trs*bs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk*iT&n`&^ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To+PZS_&n`OY*xYZ%TZ]*x]^%T^#o*x#o#p+r#p#q*x#q#r+r#r;'S*x;'S;=`,^<%lO*x_+wTS_OY+rZ]+r^;'S+r;'S;=`,W<%lO+r_,ZP;=`<%l+ro,aP;=`<%l*xj,kV%rQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-XT!xY&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-oV%lQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.]V&n`&ZZOw%Twx.rx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.wV&n`Ow%Twx/^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/eT&n`&]ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/{ThZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc0cTgR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk0yXVZ&n`Oz%Tz{1f{!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk1mVaR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk2ZV%oZ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc2wTzR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To3_W%pZ&n`O!_%T!_!`-Q!`!a3w!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Td4OT&{S&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk4fX!fQ&n`O!O%T!O!P5R!P!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5WV&n`O!O%T!O!P5m!P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5tT!rZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti6[a!hX&n`O!Q%T!Q![6T![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S6T#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti7fZ&n`O{%T{|8X|}%T}!O8X!O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8^V&n`O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8z]!hX&n`O!Q%T!Q![8s![!l%T!l!m9s!m#R%T#R#S8s#S#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti9zT!hX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk:bX%qR&n`O!P%T!P!Q:}!Q!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj;UV%sQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti;ro!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!d%T!d!e?q!e!g%T!g!h7a!h!l%T!l!m9s!m!q%T!q!rA]!r!z%T!z!{Bq!{#R%T#R#S>_#S#U%T#U#V?q#V#X%T#X#Y7a#Y#^%T#^#_9s#_#c%T#c#dA]#d#l%T#l#mBq#m#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti=xV&n`O!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti>fc!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S>_#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti?vY&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti@mY!hX&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiAbX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBUX!hX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBv]&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiCv]!hX&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToDvV{_&n`O!_%T!_!`E]!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TcEdT%{R&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkEzT#gZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkFbXmR&n`O!^%T!^!_F}!_!`([!`!a([!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjGUV%mQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkGrV%zZ&n`O!_%T!_!`([!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkH`WmR&n`O!_%T!_!`([!`!aHx!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjIPV%nQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkIoV_Q#}P&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToJ_]&n`&YS%uZO!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoKZP;=`<%lJUoKge&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!tJU!t!uLx!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#gLx#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoMRa&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUkN_V&n`&`ZOr%TrsNts#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkNyV&n`Or%Trs! `s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! gT&n`&bZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! }V&n`&_ZOw%Twx!!dx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!!iV&n`Ow%Twx!#Ox#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!#VT&n`&aZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!#oe&n`&YS%uZOr%Trs!%Qsw%Twx!&px!Q%T!Q![JU![!c%T!c!tJU!t!u!(`!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#g!(`#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!%XV&n`&dZOr%Trs!%ns#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!%sV&n`Or%Trs!&Ys#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&aT&n`&fZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&wV&n`&cZOw%Twx!'^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!'cV&n`Ow%Twx!'xx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!(PT&n`&eZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!(ia&n`&YS%uZOr%Trs!)nsw%Twx!+^x!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!)uV&n`&hZOr%Trs!*[s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*aV&n`Or%Trs!*vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*}T&n`&jZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!+eV&n`&gZOw%Twx!+zx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,PV&n`Ow%Twx!,fx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,mT&n`&iZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!-Vi&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!dJU!d!eLx!e!hJU!h!i!(`!i!}JU!}#R%T#R#SJU#S#T%T#T#UJU#U#VLx#V#YJU#Y#Z!(`#Z#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUo!.}a&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!0ZT!XZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc!0qT!WR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj!1XV%kQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!1sO!]~k!1zV%jR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!2fO![~i!2mT%tX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T",
  tokenizers: [R2, w2, v2, _2, 0, 1, 2, 3, 4],
  topRules: { Script: [0, 5] },
  specialized: [{ term: 221, get: (n) => C2[n] || -1 }],
  tokenPrec: 7652
}), Ng = /* @__PURE__ */ new jQ(), E1 = /* @__PURE__ */ new Set([
  "Script",
  "Body",
  "FunctionDefinition",
  "ClassDefinition",
  "LambdaExpression",
  "ForStatement",
  "MatchClause"
]);
function xl(n) {
  return (e, t, i) => {
    if (i)
      return !1;
    let r = e.node.getChild("VariableName");
    return r && t(r, n), !0;
  };
}
const Y2 = {
  FunctionDefinition: /* @__PURE__ */ xl("function"),
  ClassDefinition: /* @__PURE__ */ xl("class"),
  ForStatement(n, e, t) {
    if (t) {
      for (let i = n.node.firstChild; i; i = i.nextSibling)
        if (i.name == "VariableName")
          e(i, "variable");
        else if (i.name == "in")
          break;
    }
  },
  ImportStatement(n, e) {
    var t, i;
    let { node: r } = n, s = ((t = r.firstChild) === null || t === void 0 ? void 0 : t.name) == "from";
    for (let l = r.getChild("import"); l; l = l.nextSibling)
      l.name == "VariableName" && ((i = l.nextSibling) === null || i === void 0 ? void 0 : i.name) != "as" && e(l, s ? "variable" : "namespace");
  },
  AssignStatement(n, e) {
    for (let t = n.node.firstChild; t; t = t.nextSibling)
      if (t.name == "VariableName")
        e(t, "variable");
      else if (t.name == ":" || t.name == "AssignOp")
        break;
  },
  ParamList(n, e) {
    for (let t = null, i = n.node.firstChild; i; i = i.nextSibling)
      i.name == "VariableName" && (!t || !/\*|AssignOp/.test(t.name)) && e(i, "variable"), t = i;
  },
  CapturePattern: /* @__PURE__ */ xl("variable"),
  AsPattern: /* @__PURE__ */ xl("variable"),
  __proto__: null
};
function M1(n, e) {
  let t = Ng.get(e);
  if (t)
    return t;
  let i = [], r = !0;
  function s(l, O) {
    let h = n.sliceString(l.from, l.to);
    i.push({ label: h, type: O });
  }
  return e.cursor(Le.IncludeAnonymous).iterate((l) => {
    if (l.name) {
      let O = Y2[l.name];
      if (O && O(l, s, r) || !r && E1.has(l.name))
        return !1;
      r = !1;
    } else if (l.to - l.from > 8192) {
      for (let O of M1(n, l.node))
        i.push(O);
      return !1;
    }
  }), Ng.set(e, i), i;
}
const Fg = /^[\w\xa1-\uffff][\w\d\xa1-\uffff]*$/, G1 = ["String", "FormatString", "Comment", "PropertyName"];
function A2(n) {
  let e = De(n.state).resolveInner(n.pos, -1);
  if (G1.indexOf(e.name) > -1)
    return null;
  let t = e.name == "VariableName" || e.to - e.from < 20 && Fg.test(n.state.sliceDoc(e.from, e.to));
  if (!t && !n.explicit)
    return null;
  let i = [];
  for (let r = e; r; r = r.parent)
    E1.has(r.name) && (i = i.concat(M1(n.state.doc, r)));
  return {
    options: i,
    from: t ? e.from : n.pos,
    validFor: Fg
  };
}
const U2 = /* @__PURE__ */ [
  "__annotations__",
  "__builtins__",
  "__debug__",
  "__doc__",
  "__import__",
  "__name__",
  "__loader__",
  "__package__",
  "__spec__",
  "False",
  "None",
  "True"
].map((n) => ({ label: n, type: "constant" })).concat(/* @__PURE__ */ [
  "ArithmeticError",
  "AssertionError",
  "AttributeError",
  "BaseException",
  "BlockingIOError",
  "BrokenPipeError",
  "BufferError",
  "BytesWarning",
  "ChildProcessError",
  "ConnectionAbortedError",
  "ConnectionError",
  "ConnectionRefusedError",
  "ConnectionResetError",
  "DeprecationWarning",
  "EOFError",
  "Ellipsis",
  "EncodingWarning",
  "EnvironmentError",
  "Exception",
  "FileExistsError",
  "FileNotFoundError",
  "FloatingPointError",
  "FutureWarning",
  "GeneratorExit",
  "IOError",
  "ImportError",
  "ImportWarning",
  "IndentationError",
  "IndexError",
  "InterruptedError",
  "IsADirectoryError",
  "KeyError",
  "KeyboardInterrupt",
  "LookupError",
  "MemoryError",
  "ModuleNotFoundError",
  "NameError",
  "NotADirectoryError",
  "NotImplemented",
  "NotImplementedError",
  "OSError",
  "OverflowError",
  "PendingDeprecationWarning",
  "PermissionError",
  "ProcessLookupError",
  "RecursionError",
  "ReferenceError",
  "ResourceWarning",
  "RuntimeError",
  "RuntimeWarning",
  "StopAsyncIteration",
  "StopIteration",
  "SyntaxError",
  "SyntaxWarning",
  "SystemError",
  "SystemExit",
  "TabError",
  "TimeoutError",
  "TypeError",
  "UnboundLocalError",
  "UnicodeDecodeError",
  "UnicodeEncodeError",
  "UnicodeError",
  "UnicodeTranslateError",
  "UnicodeWarning",
  "UserWarning",
  "ValueError",
  "Warning",
  "ZeroDivisionError"
].map((n) => ({ label: n, type: "type" }))).concat(/* @__PURE__ */ [
  "bool",
  "bytearray",
  "bytes",
  "classmethod",
  "complex",
  "float",
  "frozenset",
  "int",
  "list",
  "map",
  "memoryview",
  "object",
  "range",
  "set",
  "staticmethod",
  "str",
  "super",
  "tuple",
  "type"
].map((n) => ({ label: n, type: "class" }))).concat(/* @__PURE__ */ [
  "abs",
  "aiter",
  "all",
  "anext",
  "any",
  "ascii",
  "bin",
  "breakpoint",
  "callable",
  "chr",
  "compile",
  "delattr",
  "dict",
  "dir",
  "divmod",
  "enumerate",
  "eval",
  "exec",
  "exit",
  "filter",
  "format",
  "getattr",
  "globals",
  "hasattr",
  "hash",
  "help",
  "hex",
  "id",
  "input",
  "isinstance",
  "issubclass",
  "iter",
  "len",
  "license",
  "locals",
  "max",
  "min",
  "next",
  "oct",
  "open",
  "ord",
  "pow",
  "print",
  "property",
  "quit",
  "repr",
  "reversed",
  "round",
  "setattr",
  "slice",
  "sorted",
  "sum",
  "vars",
  "zip"
].map((n) => ({ label: n, type: "function" }))), V2 = [
  /* @__PURE__ */ Ye("def ${name}(${params}):\n	${}", {
    label: "def",
    detail: "function",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("for ${name} in ${collection}:\n	${}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("while ${}:\n	${}", {
    label: "while",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("try:\n	${}\nexcept ${error}:\n	${}", {
    label: "try",
    detail: "/ except block",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye(`if \${}:
	
`, {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("if ${}:\n	${}\nelse:\n	${}", {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("class ${name}:\n	def __init__(self, ${params}):\n			${}", {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("import ${module}", {
    label: "import",
    detail: "statement",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("from ${module} import ${names}", {
    label: "from",
    detail: "import",
    type: "keyword"
  })
], z2 = /* @__PURE__ */ sf(G1, /* @__PURE__ */ ao(/* @__PURE__ */ U2.concat(V2)));
function Hg(n) {
  let { node: e, pos: t } = n, i = n.lineIndent(t, -1), r = null;
  for (; ; ) {
    let s = e.childBefore(t);
    if (s)
      if (s.name == "Comment")
        t = s.from;
      else if (s.name == "Body")
        n.baseIndentFor(s) + n.unit <= i && (r = s), e = s;
      else if (s.type.is("Statement"))
        e = s;
      else
        break;
    else break;
  }
  return r;
}
function Jg(n, e) {
  let t = n.baseIndentFor(e), i = n.lineAt(n.pos, -1), r = i.from + i.text.length;
  return /^\s*($|#)/.test(i.text) && n.node.to < r + 100 && !/\S/.test(n.state.sliceDoc(r, n.node.to)) && n.lineIndent(n.pos, -1) <= t || /^\s*(else:|elif |except |finally:)/.test(n.textAfter) && n.lineIndent(n.pos, -1) > t ? null : t + n.unit;
}
const Vl = /* @__PURE__ */ vn.define({
  name: "python",
  parser: /* @__PURE__ */ W2.configure({
    props: [
      /* @__PURE__ */ Gr.add({
        Body: (n) => {
          var e;
          let t = Hg(n);
          return (e = Jg(n, t || n.node)) !== null && e !== void 0 ? e : n.continue();
        },
        IfStatement: (n) => /^\s*(else:|elif )/.test(n.textAfter) ? n.baseIndent : n.continue(),
        "ForStatement WhileStatement": (n) => /^\s*else:/.test(n.textAfter) ? n.baseIndent : n.continue(),
        TryStatement: (n) => /^\s*(except |finally:|else:)/.test(n.textAfter) ? n.baseIndent : n.continue(),
        "TupleExpression ComprehensionExpression ParamList ArgList ParenthesizedExpression": /* @__PURE__ */ Ws({ closing: ")" }),
        "DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression": /* @__PURE__ */ Ws({ closing: "}" }),
        "ArrayExpression ArrayComprehensionExpression": /* @__PURE__ */ Ws({ closing: "]" }),
        "String FormatString": () => null,
        Script: (n) => {
          var e;
          let t = Hg(n);
          return (e = t && Jg(n, t)) !== null && e !== void 0 ? e : n.continue();
        }
      }),
      /* @__PURE__ */ Dr.add({
        "ArrayExpression DictionaryExpression SetExpression TupleExpression": Qa,
        Body: (n, e) => ({ from: n.from + 1, to: n.to - (n.to == e.doc.length ? 0 : 1) })
      })
    ]
  }),
  languageData: {
    closeBrackets: {
      brackets: ["(", "[", "{", "'", '"', "'''", '"""'],
      stringPrefixes: [
        "f",
        "fr",
        "rf",
        "r",
        "u",
        "b",
        "br",
        "rb",
        "F",
        "FR",
        "RF",
        "R",
        "U",
        "B",
        "BR",
        "RB"
      ]
    },
    commentTokens: { line: "#" },
    indentOnInput: /^\s*([\}\]\)]|else:|elif |except |finally:)$/
  }
});
function E2() {
  return new io(Vl, [
    Vl.data.of({ autocomplete: A2 }),
    Vl.data.of({ autocomplete: z2 })
  ]);
}
const M2 = (n) => {
  const e = [E2()];
  return n && e.push(
    Vl.data.of({ autocomplete: Nn(n) })
  ), e;
}, G2 = {
  getOptions: M2
}, D2 = 36, Kg = 1, I2 = 2, Pr = 3, xh = 4, L2 = 5, B2 = 6, j2 = 7, N2 = 8, F2 = 9, H2 = 10, J2 = 11, K2 = 12, eC = 13, tC = 14, iC = 15, nC = 16, rC = 17, em = 18, sC = 19, D1 = 20, I1 = 21, tm = 22, oC = 23, lC = 24;
function xc(n) {
  return n >= 65 && n <= 90 || n >= 97 && n <= 122 || n >= 48 && n <= 57;
}
function aC(n) {
  return n >= 48 && n <= 57 || n >= 97 && n <= 102 || n >= 65 && n <= 70;
}
function Mn(n, e, t) {
  for (let i = !1; ; ) {
    if (n.next < 0)
      return;
    if (n.next == e && !i) {
      n.advance();
      return;
    }
    i = t && !i && n.next == 92, n.advance();
  }
}
function OC(n, e) {
  e: for (; ; ) {
    if (n.next < 0)
      return console.log("exit at end", n.pos);
    if (n.next == 36) {
      n.advance();
      for (let t = 0; t < e.length; t++) {
        if (n.next != e.charCodeAt(t))
          continue e;
        n.advance();
      }
      if (n.next == 36) {
        n.advance();
        return;
      }
    } else
      n.advance();
  }
}
function hC(n, e) {
  let t = "[{<(".indexOf(String.fromCharCode(e)), i = t < 0 ? e : "]}>)".charCodeAt(t);
  for (; ; ) {
    if (n.next < 0)
      return;
    if (n.next == i && n.peek(1) == 39) {
      n.advance(2);
      return;
    }
    n.advance();
  }
}
function vc(n, e) {
  for (; !(n.next != 95 && !xc(n.next)); )
    e != null && (e += String.fromCharCode(n.next)), n.advance();
  return e;
}
function cC(n) {
  if (n.next == 39 || n.next == 34 || n.next == 96) {
    let e = n.next;
    n.advance(), Mn(n, e, !1);
  } else
    vc(n);
}
function im(n, e) {
  for (; n.next == 48 || n.next == 49; )
    n.advance();
  e && n.next == e && n.advance();
}
function nm(n, e) {
  for (; ; ) {
    if (n.next == 46) {
      if (e)
        break;
      e = !0;
    } else if (n.next < 48 || n.next > 57)
      break;
    n.advance();
  }
  if (n.next == 69 || n.next == 101)
    for (n.advance(), (n.next == 43 || n.next == 45) && n.advance(); n.next >= 48 && n.next <= 57; )
      n.advance();
}
function rm(n) {
  for (; !(n.next < 0 || n.next == 10); )
    n.advance();
}
function En(n, e) {
  for (let t = 0; t < e.length; t++)
    if (e.charCodeAt(t) == n)
      return !0;
  return !1;
}
const vh = ` 	\r
`;
function L1(n, e, t) {
  let i = /* @__PURE__ */ Object.create(null);
  i.true = i.false = L2, i.null = i.unknown = B2;
  for (let r of n.split(" "))
    r && (i[r] = D1);
  for (let r of e.split(" "))
    r && (i[r] = I1);
  for (let r of (t || "").split(" "))
    r && (i[r] = lC);
  return i;
}
const fC = "array binary bit boolean char character clob date decimal double float int integer interval large national nchar nclob numeric object precision real smallint time timestamp varchar varying ", uC = "absolute action add after all allocate alter and any are as asc assertion at authorization before begin between both breadth by call cascade cascaded case cast catalog check close collate collation column commit condition connect connection constraint constraints constructor continue corresponding count create cross cube current current_date current_default_transform_group current_transform_group_for_type current_path current_role current_time current_timestamp current_user cursor cycle data day deallocate declare default deferrable deferred delete depth deref desc describe descriptor deterministic diagnostics disconnect distinct do domain drop dynamic each else elseif end end-exec equals escape except exception exec execute exists exit external fetch first for foreign found from free full function general get global go goto grant group grouping handle having hold hour identity if immediate in indicator initially inner inout input insert intersect into is isolation join key language last lateral leading leave left level like limit local localtime localtimestamp locator loop map match method minute modifies module month names natural nesting new next no none not of old on only open option or order ordinality out outer output overlaps pad parameter partial path prepare preserve primary prior privileges procedure public read reads recursive redo ref references referencing relative release repeat resignal restrict result return returns revoke right role rollback rollup routine row rows savepoint schema scroll search second section select session session_user set sets signal similar size some space specific specifictype sql sqlexception sqlstate sqlwarning start state static system_user table temporary then timezone_hour timezone_minute to trailing transaction translation treat trigger under undo union unique unnest until update usage user using value values view when whenever where while with without work write year zone ", wc = {
  backslashEscapes: !1,
  hashComments: !1,
  spaceAfterDashes: !1,
  slashComments: !1,
  doubleQuotedStrings: !1,
  doubleDollarQuotedStrings: !1,
  unquotedBitLiterals: !1,
  treatBitsAsBytes: !1,
  charSetCasts: !1,
  plsqlQuotingMechanism: !1,
  operatorChars: "*+-%<>!=&|~^/",
  specialVar: "?",
  identifierQuotes: '"',
  caseInsensitiveIdentifiers: !1,
  words: /* @__PURE__ */ L1(uC, fC)
};
function dC(n, e, t, i) {
  let r = {};
  for (let s in wc)
    r[s] = (n.hasOwnProperty(s) ? n : wc)[s];
  return e && (r.words = L1(e, t || "", i)), r;
}
function B1(n) {
  return new Ji((e) => {
    var t;
    let { next: i } = e;
    if (e.advance(), En(i, vh)) {
      for (; En(e.next, vh); )
        e.advance();
      e.acceptToken(D2);
    } else if (i == 36 && n.doubleDollarQuotedStrings) {
      let r = vc(e, "");
      e.next == 36 && (e.advance(), OC(e, r), e.acceptToken(Pr));
    } else if (i == 39 || i == 34 && n.doubleQuotedStrings)
      Mn(e, i, n.backslashEscapes), e.acceptToken(Pr);
    else if (i == 35 && n.hashComments || i == 47 && e.next == 47 && n.slashComments)
      rm(e), e.acceptToken(Kg);
    else if (i == 45 && e.next == 45 && (!n.spaceAfterDashes || e.peek(1) == 32))
      rm(e), e.acceptToken(Kg);
    else if (i == 47 && e.next == 42) {
      e.advance();
      for (let r = 1; ; ) {
        let s = e.next;
        if (e.next < 0)
          break;
        if (e.advance(), s == 42 && e.next == 47) {
          if (r--, e.advance(), !r)
            break;
        } else s == 47 && e.next == 42 && (r++, e.advance());
      }
      e.acceptToken(I2);
    } else if ((i == 101 || i == 69) && e.next == 39)
      e.advance(), Mn(e, 39, !0), e.acceptToken(Pr);
    else if ((i == 110 || i == 78) && e.next == 39 && n.charSetCasts)
      e.advance(), Mn(e, 39, n.backslashEscapes), e.acceptToken(Pr);
    else if (i == 95 && n.charSetCasts)
      for (let r = 0; ; r++) {
        if (e.next == 39 && r > 1) {
          e.advance(), Mn(e, 39, n.backslashEscapes), e.acceptToken(Pr);
          break;
        }
        if (!xc(e.next))
          break;
        e.advance();
      }
    else if (n.plsqlQuotingMechanism && (i == 113 || i == 81) && e.next == 39 && e.peek(1) > 0 && !En(e.peek(1), vh)) {
      let r = e.peek(1);
      e.advance(2), hC(e, r), e.acceptToken(Pr);
    } else if (i == 40)
      e.acceptToken(j2);
    else if (i == 41)
      e.acceptToken(N2);
    else if (i == 123)
      e.acceptToken(F2);
    else if (i == 125)
      e.acceptToken(H2);
    else if (i == 91)
      e.acceptToken(J2);
    else if (i == 93)
      e.acceptToken(K2);
    else if (i == 59)
      e.acceptToken(eC);
    else if (n.unquotedBitLiterals && i == 48 && e.next == 98)
      e.advance(), im(e), e.acceptToken(tm);
    else if ((i == 98 || i == 66) && (e.next == 39 || e.next == 34)) {
      const r = e.next;
      e.advance(), n.treatBitsAsBytes ? (Mn(e, r, n.backslashEscapes), e.acceptToken(oC)) : (im(e, r), e.acceptToken(tm));
    } else if (i == 48 && (e.next == 120 || e.next == 88) || (i == 120 || i == 88) && e.next == 39) {
      let r = e.next == 39;
      for (e.advance(); aC(e.next); )
        e.advance();
      r && e.next == 39 && e.advance(), e.acceptToken(xh);
    } else if (i == 46 && e.next >= 48 && e.next <= 57)
      nm(e, !0), e.acceptToken(xh);
    else if (i == 46)
      e.acceptToken(tC);
    else if (i >= 48 && i <= 57)
      nm(e, !1), e.acceptToken(xh);
    else if (En(i, n.operatorChars)) {
      for (; En(e.next, n.operatorChars); )
        e.advance();
      e.acceptToken(iC);
    } else if (En(i, n.specialVar))
      e.next == i && e.advance(), cC(e), e.acceptToken(rC);
    else if (En(i, n.identifierQuotes))
      Mn(e, i, !1), e.acceptToken(sC);
    else if (i == 58 || i == 44)
      e.acceptToken(nC);
    else if (xc(i)) {
      let r = vc(e, String.fromCharCode(i));
      e.acceptToken(e.next == 46 || e.peek(-r.length - 1) == 46 ? em : (t = n.words[r.toLowerCase()]) !== null && t !== void 0 ? t : em);
    }
  });
}
const j1 = /* @__PURE__ */ B1(wc), pC = /* @__PURE__ */ kn.deserialize({
  version: 14,
  states: "%vQ]QQOOO#wQRO'#DSO$OQQO'#CwO%eQQO'#CxO%lQQO'#CyO%sQQO'#CzOOQQ'#DS'#DSOOQQ'#C}'#C}O'UQRO'#C{OOQQ'#Cv'#CvOOQQ'#C|'#C|Q]QQOOQOQQOOO'`QQO'#DOO(xQRO,59cO)PQQO,59cO)UQQO'#DSOOQQ,59d,59dO)cQQO,59dOOQQ,59e,59eO)jQQO,59eOOQQ,59f,59fO)qQQO,59fOOQQ-E6{-E6{OOQQ,59b,59bOOQQ-E6z-E6zOOQQ,59j,59jOOQQ-E6|-E6|O+VQRO1G.}O+^QQO,59cOOQQ1G/O1G/OOOQQ1G/P1G/POOQQ1G/Q1G/QP+kQQO'#C}O+rQQO1G.}O)PQQO,59cO,PQQO'#Cw",
  stateData: ",[~OtOSPOSQOS~ORUOSUOTUOUUOVROXSOZTO]XO^QO_UO`UOaPObPOcPOdUOeUOfUOgUOhUO~O^]ORvXSvXTvXUvXVvXXvXZvX]vX_vX`vXavXbvXcvXdvXevXfvXgvXhvX~OsvX~P!jOa_Ob_Oc_O~ORUOSUOTUOUUOVROXSOZTO^tO_UO`UOa`Ob`Oc`OdUOeUOfUOgUOhUO~OWaO~P$ZOYcO~P$ZO[eO~P$ZORUOSUOTUOUUOVROXSOZTO^QO_UO`UOaPObPOcPOdUOeUOfUOgUOhUO~O]hOsoX~P%zOajObjOcjO~O^]ORkaSkaTkaUkaVkaXkaZka]ka_ka`kaakabkackadkaekafkagkahka~Oska~P'kO^]O~OWvXYvX[vX~P!jOWnO~P$ZOYoO~P$ZO[pO~P$ZO^]ORkiSkiTkiUkiVkiXkiZki]ki_ki`kiakibkickidkiekifkigkihki~Oski~P)xOWkaYka[ka~P'kO]hO~P$ZOWkiYki[ki~P)xOasObsOcsO~O",
  goto: "#hwPPPPPPPPPPPPPPPPPPPPPPPPPPx||||!Y!^!d!xPPP#[TYOZeUORSTWZbdfqT[OZQZORiZSWOZQbRQdSQfTZgWbdfqQ^PWk^lmrQl_Qm`RrseVORSTWZbdfq",
  nodeNames: "⚠ LineComment BlockComment String Number Bool Null ( ) { } [ ] ; . Operator Punctuation SpecialVar Identifier QuotedIdentifier Keyword Type Bits Bytes Builtin Script Statement CompositeIdentifier Parens Braces Brackets Statement",
  maxTerm: 38,
  nodeProps: [
    ["isolate", -4, 1, 2, 3, 19, ""]
  ],
  skippedNodes: [0, 1, 2],
  repeatNodeCount: 3,
  tokenData: "RORO",
  tokenizers: [0, j1],
  topRules: { Script: [0, 25] },
  tokenPrec: 0
});
function kc(n) {
  let e = n.cursor().moveTo(n.from, -1);
  for (; /Comment/.test(e.name); )
    e.moveTo(e.from, -1);
  return e.node;
}
function Js(n, e) {
  let t = n.sliceString(e.from, e.to), i = /^([`'"])(.*)\1$/.exec(t);
  return i ? i[2] : t;
}
function fa(n) {
  return n && (n.name == "Identifier" || n.name == "QuotedIdentifier");
}
function gC(n, e) {
  if (e.name == "CompositeIdentifier") {
    let t = [];
    for (let i = e.firstChild; i; i = i.nextSibling)
      fa(i) && t.push(Js(n, i));
    return t;
  }
  return [Js(n, e)];
}
function sm(n, e) {
  for (let t = []; ; ) {
    if (!e || e.name != ".")
      return t;
    let i = kc(e);
    if (!fa(i))
      return t;
    t.unshift(Js(n, i)), e = kc(i);
  }
}
function mC(n, e) {
  let t = De(n).resolveInner(e, -1), i = PC(n.doc, t);
  return t.name == "Identifier" || t.name == "QuotedIdentifier" || t.name == "Keyword" ? {
    from: t.from,
    quoted: t.name == "QuotedIdentifier" ? n.doc.sliceString(t.from, t.from + 1) : null,
    parents: sm(n.doc, kc(t)),
    aliases: i
  } : t.name == "." ? { from: e, quoted: null, parents: sm(n.doc, t), aliases: i } : { from: e, quoted: null, parents: [], empty: !0, aliases: i };
}
const QC = /* @__PURE__ */ new Set(/* @__PURE__ */ "where group having order union intersect except all distinct limit offset fetch for".split(" "));
function PC(n, e) {
  let t;
  for (let r = e; !t; r = r.parent) {
    if (!r)
      return null;
    r.name == "Statement" && (t = r);
  }
  let i = null;
  for (let r = t.firstChild, s = !1, l = null; r; r = r.nextSibling) {
    let O = r.name == "Keyword" ? n.sliceString(r.from, r.to).toLowerCase() : null, h = null;
    if (!s)
      s = O == "from";
    else if (O == "as" && l && fa(r.nextSibling))
      h = Js(n, r.nextSibling);
    else {
      if (O && QC.has(O))
        break;
      l && fa(r) && (h = Js(n, r));
    }
    h && (i || (i = /* @__PURE__ */ Object.create(null)), i[h] = gC(n, l)), l = /Identifier$/.test(r.name) ? r : null;
  }
  return i;
}
function SC(n, e) {
  return n ? e.map((t) => Object.assign(Object.assign({}, t), { label: t.label[0] == n ? t.label : n + t.label + n, apply: void 0 })) : e;
}
const $C = /^\w*$/, bC = /^[`'"]?\w*[`'"]?$/;
function om(n) {
  return n.self && typeof n.self.label == "string";
}
class df {
  constructor(e, t) {
    this.idQuote = e, this.idCaseInsensitive = t, this.list = [], this.children = void 0;
  }
  child(e) {
    let t = this.children || (this.children = /* @__PURE__ */ Object.create(null)), i = t[e];
    return i || (e && !this.list.some((r) => r.label == e) && this.list.push(lm(e, "type", this.idQuote, this.idCaseInsensitive)), t[e] = new df(this.idQuote, this.idCaseInsensitive));
  }
  maybeChild(e) {
    return this.children ? this.children[e] : null;
  }
  addCompletion(e) {
    let t = this.list.findIndex((i) => i.label == e.label);
    t > -1 ? this.list[t] = e : this.list.push(e);
  }
  addCompletions(e) {
    for (let t of e)
      this.addCompletion(typeof t == "string" ? lm(t, "property", this.idQuote, this.idCaseInsensitive) : t);
  }
  addNamespace(e) {
    Array.isArray(e) ? this.addCompletions(e) : om(e) ? this.addNamespace(e.children) : this.addNamespaceObject(e);
  }
  addNamespaceObject(e) {
    for (let t of Object.keys(e)) {
      let i = e[t], r = null, s = t.replace(/\\?\./g, (O) => O == "." ? "\0" : O).split("\0"), l = this;
      om(i) && (r = i.self, i = i.children);
      for (let O = 0; O < s.length; O++)
        r && O == s.length - 1 && l.addCompletion(r), l = l.child(s[O].replace(/\\\./g, "."));
      l.addNamespace(i);
    }
  }
}
function lm(n, e, t, i) {
  return new RegExp("^[a-z_][a-z_\\d]*$", i ? "i" : "").test(n) ? { label: n, type: e } : { label: n, type: e, apply: t + n + t };
}
function yC(n, e, t, i, r, s) {
  var l;
  let O = ((l = s == null ? void 0 : s.spec.identifierQuotes) === null || l === void 0 ? void 0 : l[0]) || '"', h = new df(O, !!(s != null && s.spec.caseInsensitiveIdentifiers)), f = r ? h.child(r) : null;
  return h.addNamespace(n), e && (f || h).addCompletions(e), t && h.addCompletions(t), f && h.addCompletions(f.list), i && h.addCompletions((f || h).child(i).list), (u) => {
    let { parents: d, from: g, quoted: Q, empty: b, aliases: v } = mC(u.state, u.pos);
    if (b && !u.explicit)
      return null;
    v && d.length == 1 && (d = v[d[0]] || d);
    let w = h;
    for (let U of d) {
      for (; !w.children || !w.children[U]; )
        if (w == h && f)
          w = f;
        else if (w == f && i)
          w = w.child(i);
        else
          return null;
      let V = w.maybeChild(U);
      if (!V)
        return null;
      w = V;
    }
    let Z = Q && u.state.sliceDoc(u.pos, u.pos + 1) == Q, Y = w.list;
    return w == h && v && (Y = Y.concat(Object.keys(v).map((U) => ({ label: U, type: "constant" })))), {
      from: g,
      to: Z ? u.pos + 1 : void 0,
      options: SC(Q, Y),
      validFor: Q ? bC : $C
    };
  };
}
function xC(n, e) {
  let t = Object.keys(n).map((i) => ({
    label: e ? i.toUpperCase() : i,
    type: n[i] == I1 ? "type" : n[i] == D1 ? "keyword" : "variable",
    boost: -1
  }));
  return sf(["QuotedIdentifier", "SpecialVar", "String", "LineComment", "BlockComment", "."], ao(t));
}
let vC = /* @__PURE__ */ pC.configure({
  props: [
    /* @__PURE__ */ Gr.add({
      Statement: /* @__PURE__ */ ji()
    }),
    /* @__PURE__ */ Dr.add({
      Statement(n, e) {
        return { from: Math.min(n.from + 100, e.doc.lineAt(n.from).to), to: n.to };
      },
      BlockComment(n) {
        return { from: n.from + 2, to: n.to - 2 };
      }
    }),
    /* @__PURE__ */ Mr({
      Keyword: $.keyword,
      Type: $.typeName,
      Builtin: /* @__PURE__ */ $.standard($.name),
      Bits: $.number,
      Bytes: $.string,
      Bool: $.bool,
      Null: $.null,
      Number: $.number,
      String: $.string,
      Identifier: $.name,
      QuotedIdentifier: /* @__PURE__ */ $.special($.string),
      SpecialVar: /* @__PURE__ */ $.special($.name),
      LineComment: $.lineComment,
      BlockComment: $.blockComment,
      Operator: $.operator,
      "Semi Punctuation": $.punctuation,
      "( )": $.paren,
      "{ }": $.brace,
      "[ ]": $.squareBracket
    })
  ]
});
class pf {
  constructor(e, t, i) {
    this.dialect = e, this.language = t, this.spec = i;
  }
  /**
  Returns the language for this dialect as an extension.
  */
  get extension() {
    return this.language.extension;
  }
  /**
  Define a new dialect.
  */
  static define(e) {
    let t = dC(e, e.keywords, e.types, e.builtin), i = vn.define({
      name: "sql",
      parser: vC.configure({
        tokenizers: [{ from: j1, to: B1(t) }]
      }),
      languageData: {
        commentTokens: { line: "--", block: { open: "/*", close: "*/" } },
        closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] }
      }
    });
    return new pf(t, i, e);
  }
}
function wC(n, e = !1) {
  return xC(n.dialect.words, e);
}
function kC(n, e = !1) {
  return n.language.data.of({
    autocomplete: wC(n, e)
  });
}
function TC(n) {
  return n.schema ? yC(n.schema, n.tables, n.schemas, n.defaultTable, n.defaultSchema, n.dialect || gf) : () => null;
}
function ZC(n) {
  return n.schema ? (n.dialect || gf).language.data.of({
    autocomplete: TC(n)
  }) : [];
}
function RC(n = {}) {
  let e = n.dialect || gf;
  return new io(e.language, [ZC(n), kC(e, !!n.upperCaseKeywords)]);
}
const gf = /* @__PURE__ */ pf.define({}), _C = (n) => [
  RC({
    upperCaseKeywords: !1
  })
], XC = {
  getOptions: _C
}, qC = 312, am = 1, CC = 2, WC = 3, YC = 4, AC = 313, UC = 315, VC = 316, zC = 5, EC = 6, MC = 0, Tc = [
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
], N1 = 125, GC = 59, Zc = 47, DC = 42, IC = 43, LC = 45, BC = 60, jC = 44, NC = 63, FC = 46, HC = new _1({
  start: !1,
  shift(n, e) {
    return e == zC || e == EC || e == UC ? n : e == VC;
  },
  strict: !1
}), JC = new Ji((n, e) => {
  let { next: t } = n;
  (t == N1 || t == -1 || e.context) && n.acceptToken(AC);
}, { contextual: !0, fallback: !0 }), KC = new Ji((n, e) => {
  let { next: t } = n, i;
  Tc.indexOf(t) > -1 || t == Zc && ((i = n.peek(1)) == Zc || i == DC) || t != N1 && t != GC && t != -1 && !e.context && n.acceptToken(qC);
}, { contextual: !0 }), eW = new Ji((n, e) => {
  let { next: t } = n;
  if (t == IC || t == LC) {
    if (n.advance(), t == n.next) {
      n.advance();
      let i = !e.context && e.canShift(am);
      n.acceptToken(i ? am : CC);
    }
  } else t == NC && n.peek(1) == FC && (n.advance(), n.advance(), (n.next < 48 || n.next > 57) && n.acceptToken(WC));
}, { contextual: !0 });
function wh(n, e) {
  return n >= 65 && n <= 90 || n >= 97 && n <= 122 || n == 95 || n >= 192 || !e && n >= 48 && n <= 57;
}
const tW = new Ji((n, e) => {
  if (n.next != BC || !e.dialectEnabled(MC) || (n.advance(), n.next == Zc)) return;
  let t = 0;
  for (; Tc.indexOf(n.next) > -1; )
    n.advance(), t++;
  if (wh(n.next, !0)) {
    for (n.advance(), t++; wh(n.next, !1); )
      n.advance(), t++;
    for (; Tc.indexOf(n.next) > -1; )
      n.advance(), t++;
    if (n.next == jC) return;
    for (let i = 0; ; i++) {
      if (i == 7) {
        if (!wh(n.next, !0)) return;
        break;
      }
      if (n.next != "extends".charCodeAt(i)) break;
      n.advance(), t++;
    }
  }
  n.acceptToken(YC, -t);
}), iW = Mr({
  "get set async static": $.modifier,
  "for while do if else switch try catch finally return throw break continue default case": $.controlKeyword,
  "in of await yield void typeof delete instanceof": $.operatorKeyword,
  "let var const using function class extends": $.definitionKeyword,
  "import export from": $.moduleKeyword,
  "with debugger as new": $.keyword,
  TemplateString: $.special($.string),
  super: $.atom,
  BooleanLiteral: $.bool,
  this: $.self,
  null: $.null,
  Star: $.modifier,
  VariableName: $.variableName,
  "CallExpression/VariableName TaggedTemplateExpression/VariableName": $.function($.variableName),
  VariableDefinition: $.definition($.variableName),
  Label: $.labelName,
  PropertyName: $.propertyName,
  PrivatePropertyName: $.special($.propertyName),
  "CallExpression/MemberExpression/PropertyName": $.function($.propertyName),
  "FunctionDeclaration/VariableDefinition": $.function($.definition($.variableName)),
  "ClassDeclaration/VariableDefinition": $.definition($.className),
  PropertyDefinition: $.definition($.propertyName),
  PrivatePropertyDefinition: $.definition($.special($.propertyName)),
  UpdateOp: $.updateOperator,
  "LineComment Hashbang": $.lineComment,
  BlockComment: $.blockComment,
  Number: $.number,
  String: $.string,
  Escape: $.escape,
  ArithOp: $.arithmeticOperator,
  LogicOp: $.logicOperator,
  BitOp: $.bitwiseOperator,
  CompareOp: $.compareOperator,
  RegExp: $.regexp,
  Equals: $.definitionOperator,
  Arrow: $.function($.punctuation),
  ": Spread": $.punctuation,
  "( )": $.paren,
  "[ ]": $.squareBracket,
  "{ }": $.brace,
  "InterpolationStart InterpolationEnd": $.special($.brace),
  ".": $.derefOperator,
  ", ;": $.separator,
  "@": $.meta,
  TypeName: $.typeName,
  TypeDefinition: $.definition($.typeName),
  "type enum interface implements namespace module declare": $.definitionKeyword,
  "abstract global Privacy readonly override": $.modifier,
  "is keyof unique infer": $.operatorKeyword,
  JSXAttributeValue: $.attributeValue,
  JSXText: $.content,
  "JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": $.angleBracket,
  "JSXIdentifier JSXNameSpacedName": $.tagName,
  "JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": $.attributeName,
  "JSXBuiltin/JSXIdentifier": $.standard($.tagName)
}), nW = { __proto__: null, export: 20, as: 25, from: 33, default: 36, async: 41, function: 42, extends: 54, this: 58, true: 66, false: 66, null: 78, void: 82, typeof: 86, super: 102, new: 136, delete: 148, yield: 157, await: 161, class: 166, public: 229, private: 229, protected: 229, readonly: 231, instanceof: 250, satisfies: 253, in: 254, const: 256, import: 290, keyof: 345, unique: 349, infer: 355, is: 391, abstract: 411, implements: 413, type: 415, let: 418, var: 420, using: 423, interface: 429, enum: 433, namespace: 439, module: 441, declare: 445, global: 449, for: 468, of: 477, while: 480, with: 484, do: 488, if: 492, else: 494, switch: 498, case: 504, try: 510, catch: 514, finally: 518, return: 522, throw: 526, break: 530, continue: 534, debugger: 538 }, rW = { __proto__: null, async: 123, get: 125, set: 127, declare: 189, public: 191, private: 191, protected: 191, static: 193, abstract: 195, override: 197, readonly: 203, accessor: 205, new: 395 }, sW = { __proto__: null, "<": 187 }, oW = kn.deserialize({
  version: 14,
  states: "$@QO%TQ^OOO%[Q^OOO'_Q`OOP(lOWOOO*zQ?NdO'#CiO+RO!bO'#CjO+aO#tO'#CjO+oO!0LbO'#D^O.QQ^O'#DdO.bQ^O'#DoO%[Q^O'#DwO0fQ^O'#EPOOQ?Mr'#EX'#EXO1PQWO'#EUOOQO'#Em'#EmOOQO'#Ih'#IhO1XQWO'#GpO1dQWO'#ElO1iQWO'#ElO3hQ?NdO'#JmO6[Q?NdO'#JnO6uQWO'#F[O6zQ&jO'#FsOOQ?Mr'#Fe'#FeO7VO,YO'#FeO7eQ7[O'#FzO9RQWO'#FyOOQ?Mr'#Jn'#JnOOQ?Mp'#Jm'#JmO9WQWO'#GtOOQU'#KZ'#KZO9cQWO'#IUO9hQ?MxO'#IVOOQU'#JZ'#JZOOQU'#IZ'#IZQ`Q^OOO`Q^OOO9pQMnO'#DsO9wQ^O'#D{O:OQ^O'#D}O9^QWO'#GpO:VQ7[O'#CoO:eQWO'#EkO:pQWO'#EvO:uQ7[O'#FdO;dQWO'#GpOOQO'#K['#K[O;iQWO'#K[O;wQWO'#GxO;wQWO'#GyO;wQWO'#G{O9^QWO'#HOO<nQWO'#HRO>VQWO'#CeO>gQWO'#H_O>oQWO'#HeO>oQWO'#HgO`Q^O'#HiO>oQWO'#HkO>oQWO'#HnO>tQWO'#HtO>yQ?MyO'#HzO%[Q^O'#H|O?UQ?MyO'#IOO?aQ?MyO'#IQO9hQ?MxO'#ISO?lQ?NdO'#CiO@nQ`O'#DiQOQWOOO%[Q^O'#D}OAUQWO'#EQO:VQ7[O'#EkOAaQWO'#EkOAlQpO'#FdOOQU'#Cg'#CgOOQ?Mp'#Dn'#DnOOQ?Mp'#Jq'#JqO%[Q^O'#JqOOQO'#Jt'#JtOOQO'#Id'#IdOBlQ`O'#EdOOQ?Mp'#Ec'#EcOOQ?Mp'#Jx'#JxOChQ?NQO'#EdOCrQ`O'#ETOOQO'#Js'#JsODWQ`O'#JtOEeQ`O'#ETOCrQ`O'#EdPErO#@ItO'#CbPOOO)CDx)CDxOOOO'#I['#I[OE}O!bO,59UOOQ?Mr,59U,59UOOOO'#I]'#I]OF]O#tO,59UO%[Q^O'#D`OOOO'#I_'#I_OFkO!0LbO,59xOOQ?Mr,59x,59xOFyQ^O'#I`OG^QWO'#JoOI]QrO'#JoO+}Q^O'#JoOIdQWO,5:OOIzQWO'#EmOJXQWO'#KOOJdQWO'#J}OJdQWO'#J}OJlQWO,5;ZOJqQWO'#J|OOQ?Mv,5:Z,5:ZOJxQ^O,5:ZOLvQ?NdO,5:cOMgQWO,5:kONQQ?MxO'#J{ONXQWO'#JzO9WQWO'#JzONmQWO'#JzONuQWO,5;YONzQWO'#JzO!#PQrO'#JnOOQ?Mr'#Ci'#CiO%[Q^O'#EPO!#oQrO,5:pOOQQ'#Ju'#JuOOQO-E<f-E<fO9^QWO,5=[O!$VQWO,5=[O!$[Q^O,5;WO!&_Q7[O'#EhO!'xQWO,5;WO!'}Q^O'#DvO!(XQ`O,5;aO!(aQ`O,5;aO%[Q^O,5;aOOQU'#FS'#FSOOQU'#FU'#FUO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bO%[Q^O,5;bOOQU'#FY'#FYO!(oQ^O,5;sOOQ?Mr,5;x,5;xOOQ?Mr,5;y,5;yOOQ?Mr,5;{,5;{O%[Q^O'#IlO!*rQ?MxO,5<gO%[Q^O,5;bO!&_Q7[O,5;bO!+aQ7[O,5;bO!-RQ7[O'#EZO%[Q^O,5;vOOQ?Mr,5;z,5;zO!-YQ&jO'#FiO!.VQ&jO'#KSO!-qQ&jO'#KSO!.^Q&jO'#KSOOQO'#KS'#KSO!.rQ&jO,5<ROOOS,5<_,5<_O!/TQ^O'#FuOOOS'#Ik'#IkO7VO,YO,5<PO!/[Q&jO'#FwOOQ?Mr,5<P,5<PO!/{Q!LQO'#CvOOQ?Mr'#Cz'#CzO!0`O!0LbO'#DOO!0|Q7[O,5<dO!1TQWO,5<fO!2pQ$ISO'#GVO!2}QWO'#GWO!3SQWO'#GWO!4rQ$ISO'#G[O!5nQ`O'#G`OOQO'#Gk'#GkO!+hQ7[O'#GjOOQO'#Gm'#GmO!+hQ7[O'#GlO!6aQ!LQO'#JgOOQ?Mr'#Jg'#JgO!6kQWO'#JfO!6yQWO'#JeO!7RQWO'#CuOOQ?Mr'#Cx'#CxO!7ZQWO'#CzOOQ?Mr'#DS'#DSOOQ?Mr'#DU'#DUO1SQWO'#DWO!+hQ7[O'#F}O!+hQ7[O'#GPO!7`QWO'#GRO!7eQWO'#GSO!3SQWO'#GYO!+hQ7[O'#G_O!7jQWO'#EnO!8XQWO,5<eOOQ?Mp'#Cr'#CrO!8aQWO'#EoO!9ZQ`O'#EpOOQ?Mp'#J|'#J|O!9bQ?MxO'#K]O9hQ?MxO,5=`O`Q^O,5>pOOQU'#Jc'#JcOOQU,5>q,5>qOOQU-E<X-E<XO!;aQ?NdO,5:_O!9UQ`O,5:]O!=zQ?NdO,5:gO%[Q^O,5:gO!@bQ?NdO,5:iOOQO,5@v,5@vO!ARQ7[O,5=[O!AaQ?MxO'#JdO9RQWO'#JdO!ArQ?MxO,59ZO!A}Q`O,59ZO!BVQ7[O,59ZO:VQ7[O,59ZO!BbQWO,5;WO!BjQWO'#H^O!COQWO'#K`O%[Q^O,5;|O!9UQ`O,5<OO!CWQWO,5=wO!C]QWO,5=wO!CbQWO,5=wO9hQ?MxO,5=wO;wQWO,5=gOOQO'#Cv'#CvO!CpQ`O,5=dO!CxQ7[O,5=eO!DTQWO,5=gO!DYQpO,5=jO!DbQWO'#K[O>tQWO'#HTO9^QWO'#HVO!DgQWO'#HVO:VQ7[O'#HXO!DlQWO'#HXOOQU,5=m,5=mO!DqQWO'#HYO!ESQWO'#CoO!EXQWO,59PO!EcQWO,59PO!GhQ^O,59POOQU,59P,59PO!GxQ?MxO,59PO%[Q^O,59PO!JTQ^O'#HaOOQU'#Hb'#HbOOQU'#Hc'#HcO`Q^O,5=yO!JkQWO,5=yO`Q^O,5>PO`Q^O,5>RO!JpQWO,5>TO`Q^O,5>VO!JuQWO,5>YO!JzQ^O,5>`OOQU,5>f,5>fO%[Q^O,5>fO9hQ?MxO,5>hOOQU,5>j,5>jO# UQWO,5>jOOQU,5>l,5>lO# UQWO,5>lOOQU,5>n,5>nO# rQ`O'#D[O%[Q^O'#JqO# |Q`O'#JqO#!kQ`O'#DjO#!|Q`O'#DjO#%_Q^O'#DjO#%fQWO'#JpO#%nQWO,5:TO#%sQWO'#EqO#&RQWO'#KPO#&ZQWO,5;[O#&`Q`O'#DjO#&mQ`O'#ESOOQ?Mr,5:l,5:lO%[Q^O,5:lO#&tQWO,5:lO>tQWO,5;VO!A}Q`O,5;VO!BVQ7[O,5;VO:VQ7[O,5;VO#&|QWO,5@]O#'RQ(CYO,5:pOOQO-E<b-E<bO#(XQ?NQO,5;OOCrQ`O,5:oO#(cQ`O,5:oOCrQ`O,5;OO!ArQ?MxO,5:oOOQ?Mp'#Eg'#EgOOQO,5;O,5;OO%[Q^O,5;OO#(pQ?MxO,5;OO#({Q?MxO,5;OO!A}Q`O,5:oOOQO,5;U,5;UO#)ZQ?MxO,5;OPOOO'#IY'#IYP#)oO#@ItO,58|POOO,58|,58|OOOO-E<Y-E<YOOQ?Mr1G.p1G.pOOOO-E<Z-E<ZO#)zQpO,59zOOOO-E<]-E<]OOQ?Mr1G/d1G/dO#*PQrO,5>zO+}Q^O,5>zOOQO,5?Q,5?QO#*ZQ^O'#I`OOQO-E<^-E<^O#*hQWO,5@ZO#*pQrO,5@ZO#*wQWO,5@iOOQ?Mr1G/j1G/jO%[Q^O,5@jO#+PQWO'#IfOOQO-E<d-E<dO#*wQWO,5@iOOQ?Mp1G0u1G0uOOQ?Mv1G/u1G/uOOQ?Mv1G0V1G0VO%[Q^O,5@gO#+eQ?MxO,5@gO#+vQ?MxO,5@gO#+}QWO,5@fO9WQWO,5@fO#,VQWO,5@fO#,eQWO'#IiO#+}QWO,5@fOOQ?Mp1G0t1G0tO!(XQ`O,5:rO!(dQ`O,5:rOOQQ,5:t,5:tO#-VQYO,5:tO#-_Q7[O1G2vO9^QWO1G2vOOQ?Mr1G0r1G0rO#-mQ?NdO1G0rO#.rQ?NbO,5;SOOQ?Mr'#GU'#GUO#/`Q?NdO'#JgO!$[Q^O1G0rO#1hQrO'#JrO%[Q^O'#JrO#1rQWO,5:bOOQ?Mr'#D['#D[OOQ?Mr1G0{1G0{O%[Q^O1G0{OOQ?Mr1G1e1G1eO#1wQWO1G0{O#4]Q?NdO1G0|O#4dQ?NdO1G0|O#6zQ?NdO1G0|O#7RQ?NdO1G0|O#9iQ?NdO1G0|O#<PQ?NdO1G0|O#<WQ?NdO1G0|O#<_Q?NdO1G0|O#>uQ?NdO1G0|O#>|Q?NdO1G0|O#AZQ07bO'#CiO#CUQ07bO1G1_O#C]Q07bO'#JnO#CpQ?NdO,5?WOOQ?Mp-E<j-E<jO#E}Q?NdO1G0|O#FzQ?NdO1G0|OOQ?Mr1G0|1G0|O#GzQ7[O'#JwO#HUQWO,5:uO#HZQ?NdO1G1bO#H}Q&jO,5<VO#IVQ&jO,5<WO#I_Q&jO'#FnO#IvQWO'#FmOOQO'#KT'#KTOOQO'#Ij'#IjO#I{Q&jO1G1mOOQ?Mr1G1m1G1mOOOS1G1x1G1xO#J^Q07bO'#JmO#JhQWO,5<aO!(oQ^O,5<aOOOS-E<i-E<iOOQ?Mr1G1k1G1kO#JmQ`O'#KSOOQ?Mr,5<c,5<cO#JuQ`O,5<cO!&_Q7[O'#DQOOOO'#I^'#I^O#JzO!0LbO,59jOOQ?Mr,59j,59jO%[Q^O1G2OO!7eQWO'#InO#KVQ7[O,5<xOOQ?Mr,5<u,5<uO!+hQ7[O'#IqO#KuQ7[O,5=UO!+hQ7[O'#IsO#LhQ7[O,5=WO!&_Q7[O,5=YOOQO1G2Q1G2QO#LrQpO'#CrO#MVQ$ISO'#EoO#NUQ`O'#G`O#NrQpO,5<qO#NyQWO'#KWO9WQWO'#KWO$ XQWO,5<sO!+hQ7[O,5<rO$ ^QWO'#GXO$ oQWO,5<rO$ tQpO'#GUO$!RQpO'#KXO$!]QWO'#KXO!&_Q7[O'#KXO$!bQWO,5<vO$!gQ`O'#GaO!5iQ`O'#GaO$!xQWO'#GcO$!}QWO'#GeO!3SQWO'#GhO$#SQ?MxO'#IpO$#_Q`O,5<zOOQ?Mv,5<z,5<zO$#fQ`O'#GaO$#tQ`O'#GbO$#|Q`O'#GbO$$RQ7[O,5=UO$$cQ7[O,5=WOOQ?Mr,5=Z,5=ZO!+hQ7[O,5@QO!+hQ7[O,5@QO$$sQWO'#IuO$%OQWO,5@PO$%WQWO,59aOOQ?Mr,59f,59fO$%zQ!LSO,59rOOQ?Mr'#Jk'#JkO$&mQ7[O,5<iO$'`Q7[O,5<kO@fQWO,5<mOOQ?Mr,5<n,5<nO$'jQWO,5<tO$'oQ7[O,5<yO$(PQWO'#JzO!$[Q^O1G2PO$(UQWO1G2PO9WQWO'#J}O9WQWO'#EqO%[Q^O'#EqO9WQWO'#IwO$(ZQ?MxO,5@wOOQU1G2z1G2zOOQU1G4[1G4[OOQ?Mr1G/y1G/yOOQ?Mr1G/w1G/wO$*]Q?NdO1G0ROOQU1G2v1G2vO!&_Q7[O1G2vO%[Q^O1G2vO#-bQWO1G2vO$,aQ7[O'#EhOOQ?Mp,5@O,5@OO$,kQ?MxO,5@OOOQU1G.u1G.uO!ArQ?MxO1G.uO!A}Q`O1G.uO!BVQ7[O1G.uO$,|QWO1G0rO$-RQWO'#CiO$-^QWO'#KaO$-fQWO,5=xO$-kQWO'#KaO$-pQWO'#KaO$.OQWO'#I}O$.^QWO,5@zO$.fQrO1G1hOOQ?Mr1G1j1G1jO9^QWO1G3cO@fQWO1G3cO$.mQWO1G3cO$.rQWO1G3cOOQU1G3c1G3cO!DTQWO1G3RO!&_Q7[O1G3OO$.wQWO1G3OOOQU1G3P1G3PO!&_Q7[O1G3PO$.|QWO1G3PO$/UQ`O'#G}OOQU1G3R1G3RO!5iQ`O'#IyO!DYQpO1G3UOOQU1G3U1G3UOOQU,5=o,5=oO$/^Q7[O,5=qO9^QWO,5=qO$!}QWO,5=sO9RQWO,5=sO!A}Q`O,5=sO!BVQ7[O,5=sO:VQ7[O,5=sO$/lQWO'#K_O$/wQWO,5=tOOQU1G.k1G.kO$/|Q?MxO1G.kO@fQWO1G.kO$0XQWO1G.kO9hQ?MxO1G.kO$2aQrO,5@|O$2nQWO,5@|O9WQWO,5@|O$2yQ^O,5={O$3QQWO,5={OOQU1G3e1G3eO`Q^O1G3eOOQU1G3k1G3kOOQU1G3m1G3mO>oQWO1G3oO$3VQ^O1G3qO$7ZQ^O'#HpOOQU1G3t1G3tO$7hQWO'#HvO>tQWO'#HxOOQU1G3z1G3zO$7pQ^O1G3zO9hQ?MxO1G4QOOQU1G4S1G4SOOQ?Mp'#G]'#G]O9hQ?MxO1G4UO9hQ?MxO1G4WO$;wQWO,5@]O!(oQ^O,5;]O9WQWO,5;]O>tQWO,5:UO!(oQ^O,5:UO!A}Q`O,5:UO$;|Q07bO,5:UOOQO,5;],5;]O$<WQ`O'#IaO$<nQWO,5@[OOQ?Mr1G/o1G/oO$<vQ`O'#IgO$=QQWO,5@kOOQ?Mp1G0v1G0vO#!|Q`O,5:UOOQO'#Ic'#IcO$=YQ`O,5:nOOQ?Mv,5:n,5:nO#&wQWO1G0WOOQ?Mr1G0W1G0WO%[Q^O1G0WOOQ?Mr1G0q1G0qO>tQWO1G0qO!A}Q`O1G0qO!BVQ7[O1G0qOOQ?Mp1G5w1G5wO!ArQ?MxO1G0ZOOQO1G0j1G0jO%[Q^O1G0jO$=aQ?MxO1G0jO$=lQ?MxO1G0jO!A}Q`O1G0ZOCrQ`O1G0ZO$=zQ?MxO1G0jOOQO1G0Z1G0ZO$>`Q?NdO1G0jPOOO-E<W-E<WPOOO1G.h1G.hOOOO1G/f1G/fO$>jQpO,5<gO$>rQrO1G4fOOQO1G4l1G4lO%[Q^O,5>zO$>|QWO1G5uO$?UQWO1G6TO$?^QrO1G6UO9WQWO,5?QO$?hQ?NdO1G6RO%[Q^O1G6RO$?xQ?MxO1G6RO$@ZQWO1G6QO$@ZQWO1G6QO9WQWO1G6QO$@cQWO,5?TO9WQWO,5?TOOQO,5?T,5?TO$@wQWO,5?TO$(PQWO,5?TOOQO-E<g-E<gOOQQ1G0^1G0^OOQQ1G0`1G0`O#-YQWO1G0`OOQU7+(b7+(bO!&_Q7[O7+(bO%[Q^O7+(bO$AVQWO7+(bO$AbQ7[O7+(bO$ApQ?NdO,5=UO$CxQ?NdO,5=WO$FQQ?NdO,5=UO$H`Q?NdO,5=WO$JnQ?NdO,59rO$LsQ?NdO,5<iO$N{Q?NdO,5<kO%#TQ?NdO,5<yOOQ?Mr7+&^7+&^O%%cQ?NdO7+&^O%&VQ^O'#IbO%&dQWO,5@^O%&lQrO,5@^OOQ?Mr1G/|1G/|O%&vQWO7+&gOOQ?Mr7+&g7+&gO%&{Q07bO,5:cO%[Q^O7+&yO%'VQ07bO,5:_O%'dQ07bO,5:gO%'nQ07bO,5:iO%'xQ7[O'#IeO%(SQWO,5@cOOQ?Mr1G0a1G0aOOQO1G1q1G1qOOQO1G1r1G1rO%([QtO,5<YO!(oQ^O,5<XOOQO-E<h-E<hOOQ?Mr7+'X7+'XOOOS7+'d7+'dOOOS1G1{1G1{O%(gQWO1G1{OOQ?Mr1G1}1G1}O%(lQpO,59lOOOO-E<[-E<[OOQ?Mr1G/U1G/UO%(sQ?NdO7+'jOOQ?Mr,5?Y,5?YO%)gQpO,5?YOOQ?Mr1G2d1G2dP!&_Q7[O'#InPOQ?Mr-E<l-E<lO%*VQ7[O,5?]OOQ?Mr-E<o-E<oO%*xQ7[O,5?_OOQ?Mr-E<q-E<qO%+SQpO1G2tO%+ZQpO'#CrO%+qQ7[O'#J}O%+xQ^O'#EqOOQ?Mr1G2]1G2]O%,SQWO'#ImO%,hQWO,5@rO%,hQWO,5@rO%,pQWO,5@rO%,{QWO,5@rOOQO1G2_1G2_O%-ZQ7[O1G2^O!+hQ7[O1G2^O%-kQ$ISO'#IoO%-xQWO,5@sO!&_Q7[O,5@sO%.QQpO,5@sOOQ?Mr1G2b1G2bOOQ?Mp,5<{,5<{OOQ?Mp,5<|,5<|O$(PQWO,5<|OCcQWO,5<|O!A}Q`O,5<{OOQO'#Gd'#GdO%.[QWO,5<}OOQ?Mp,5=P,5=PO$(PQWO,5=SOOQO,5?[,5?[OOQO-E<n-E<nOOQ?Mv1G2f1G2fO!5iQ`O,5<{O%.dQWO,5<|O$!xQWO,5<}O%.oQ`O,5<|O!+hQ7[O'#IqO%/`Q7[O1G2pO!+hQ7[O'#IsO%0RQ7[O1G2rO%0]Q7[O1G5lO%0gQ7[O1G5lOOQO,5?a,5?aOOQO-E<s-E<sOOQO1G.{1G.{O!9UQ`O,59tO%[Q^O,59tOOQ?Mr,5<h,5<hO%0tQWO1G2XO!+hQ7[O1G2`O%0yQ?NdO7+'kOOQ?Mr7+'k7+'kO!$[Q^O7+'kO%1mQWO,5;]OOQ?Mp,5?c,5?cOOQ?Mp-E<u-E<uO%1rQpO'#KYO#&wQWO7+(bO4UQrO7+(bO$AYQWO7+(bO%1|Q?NbO'#CiO%2aQ?NbO,5=QO%3RQWO,5=QOOQ?Mp1G5j1G5jOOQU7+$a7+$aO!ArQ?MxO7+$aO!A}Q`O7+$aO!$[Q^O7+&^O%3WQWO'#I|O%3oQWO,5@{OOQO1G3d1G3dO9^QWO,5@{O%3oQWO,5@{O%3wQWO,5@{OOQO,5?i,5?iOOQO-E<{-E<{OOQ?Mr7+'S7+'SO%3|QWO7+(}O9hQ?MxO7+(}O9^QWO7+(}O@fQWO7+(}OOQU7+(m7+(mO%4RQ?NbO7+(jO!&_Q7[O7+(jO%4]QpO7+(kOOQU7+(k7+(kO!&_Q7[O7+(kO%4dQWO'#K^O%4oQWO,5=iOOQO,5?e,5?eOOQO-E<w-E<wOOQU7+(p7+(pO%6RQ`O'#HWOOQU1G3]1G3]O!&_Q7[O1G3]O%[Q^O1G3]O%6YQWO1G3]O%6eQ7[O1G3]O9hQ?MxO1G3_O$!}QWO1G3_O9RQWO1G3_O!A}Q`O1G3_O!BVQ7[O1G3_O%6sQWO'#I{O%7XQWO,5@yO%7aQ`O,5@yOOQ?Mp1G3`1G3`OOQU7+$V7+$VO@fQWO7+$VO9hQ?MxO7+$VO%7lQWO7+$VO%[Q^O1G6hO%[Q^O1G6iO%7qQ?MxO1G6hO%7{Q^O1G3gO%8SQWO1G3gO%8XQ^O1G3gOOQU7+)P7+)PO9hQ?MxO7+)ZO`Q^O7+)]OOQU'#Kd'#KdOOQU'#JO'#JOO%8`Q^O,5>[OOQU,5>[,5>[O%[Q^O'#HqO%8mQWO'#HsOOQU,5>b,5>bO9WQWO,5>bOOQU,5>d,5>dOOQU7+)f7+)fOOQU7+)l7+)lOOQU7+)p7+)pOOQU7+)r7+)rO%8rQ`O1G5wO%9WQ07bO1G0wO%9bQWO1G0wOOQO1G/p1G/pO%9mQ07bO1G/pO>tQWO1G/pO!(oQ^O'#DjOOQO,5>{,5>{OOQO-E<_-E<_OOQO,5?R,5?ROOQO-E<e-E<eO!A}Q`O1G/pOOQO-E<a-E<aOOQ?Mv1G0Y1G0YOOQ?Mr7+%r7+%rO#&wQWO7+%rOOQ?Mr7+&]7+&]O>tQWO7+&]O!A}Q`O7+&]OOQO7+%u7+%uO$>`Q?NdO7+&UOOQO7+&U7+&UO%[Q^O7+&UO%9wQ?MxO7+&UO!ArQ?MxO7+%uO!A}Q`O7+%uO%:SQ?MxO7+&UO%:bQ?NdO7++mO%[Q^O7++mO%:rQWO7++lO%:rQWO7++lOOQO1G4o1G4oO9WQWO1G4oO%:zQWO1G4oOOQQ7+%z7+%zO#&wQWO<<K|O4UQrO<<K|O%;YQWO<<K|OOQU<<K|<<K|O!&_Q7[O<<K|O%[Q^O<<K|O%;bQWO<<K|O%;mQ?NdO,5?]O%=uQ?NdO,5?_O%?}Q?NdO1G2^O%B]Q?NdO1G2pO%DeQ?NdO1G2rO%FmQrO,5>|O%[Q^O,5>|OOQO-E<`-E<`O%FwQWO1G5xOOQ?Mr<<JR<<JRO%GPQ07bO1G0rO%IWQ07bO1G0|O%I_Q07bO1G0|O%K`Q07bO1G0|O%KgQ07bO1G0|O%MhQ07bO1G0|O& iQ07bO1G0|O& pQ07bO1G0|O& wQ07bO1G0|O&#xQ07bO1G0|O&$PQ07bO1G0|O&$WQ?NdO<<JeO&&OQ07bO1G0|O&&{Q07bO1G0|O&'{Q07bO'#JgO&*OQ07bO1G1bO&*]Q07bO1G0RO&*gQ7[O,5?POOQO-E<c-E<cO!(oQ^O'#FpOOQO'#KU'#KUOOQO1G1t1G1tO&*qQWO1G1sO&*vQ07bO,5?WOOOS7+'g7+'gOOOO1G/W1G/WOOQ?Mr1G4t1G4tO!+hQ7[O7+(`O&-WQrO'#CiO&-bQWO,5?XO9WQWO,5?XOOQO-E<k-E<kO&-pQWO1G6^O&-pQWO1G6^O&-xQWO1G6^O&.TQ7[O7+'xO&.eQpO,5?ZO&.oQWO,5?ZO!&_Q7[O,5?ZOOQO-E<m-E<mO&.tQpO1G6_O&/OQWO1G6_OOQ?Mp1G2h1G2hO$(PQWO1G2hOOQ?Mp1G2g1G2gO&/WQWO1G2iO!&_Q7[O1G2iOOQ?Mp1G2n1G2nO!A}Q`O1G2gOCcQWO1G2hO&/]QWO1G2iO&/eQWO1G2hO$!xQWO1G2iO&0XQ7[O,5?]OOQ?Mr-E<p-E<pO&0zQ7[O,5?_OOQ?Mr-E<r-E<rO!+hQ7[O7++WOOQ?Mr1G/`1G/`O&1UQWO1G/`OOQ?Mr7+'s7+'sO&1ZQ7[O7+'zO&1kQ?NdO<<KVOOQ?Mr<<KV<<KVO&2_QWO1G0wO!&_Q7[O'#IvO&2dQWO,5@tO&4fQrO<<K|O!&_Q7[O1G2lOOQU<<G{<<G{O!ArQ?MxO<<G{O&4mQ?NdO<<IxOOQ?Mr<<Ix<<IxOOQO,5?h,5?hO&5aQWO,5?hO&5fQWO,5?hOOQO-E<z-E<zO&5tQWO1G6gO&5tQWO1G6gO9^QWO1G6gO@fQWO<<LiOOQU<<Li<<LiO&5|QWO<<LiO9hQ?MxO<<LiOOQU<<LU<<LUO%4RQ?NbO<<LUOOQU<<LV<<LVO%4]QpO<<LVO&6RQ`O'#IxO&6^QWO,5@xO!(oQ^O,5@xOOQU1G3T1G3TO%+xQ^O'#JqOOQO'#Iz'#IzO9hQ?MxO'#IzO&6fQ`O,5=rOOQU,5=r,5=rO&6mQ`O'#EdO&7RQ`O'#GcO&7WQWO7+(wO&7]QWO7+(wOOQU7+(w7+(wO!&_Q7[O7+(wO%[Q^O7+(wO&7eQWO7+(wOOQU7+(y7+(yO9hQ?MxO7+(yO$!}QWO7+(yO9RQWO7+(yO!A}Q`O7+(yO&7pQWO,5?gOOQO-E<y-E<yOOQO'#HZ'#HZO&7{QWO1G6eO9hQ?MxO<<GqOOQU<<Gq<<GqO@fQWO<<GqO&8TQWO7+,SO&8YQWO7+,TO%[Q^O7+,SO%[Q^O7+,TOOQU7+)R7+)RO&8_QWO7+)RO&8dQ^O7+)RO&8kQWO7+)ROOQU<<Lu<<LuOOQU<<Lw<<LwOOQU-E<|-E<|OOQU1G3v1G3vO&8pQWO,5>]OOQU,5>_,5>_O&8uQWO1G3|O9WQWO7+&cO!(oQ^O7+&cOOQO7+%[7+%[O&8zQ07bO1G6UO>tQWO7+%[OOQ?Mr<<I^<<I^OOQ?Mr<<Iw<<IwO>tQWO<<IwOOQO<<Ip<<IpO$>`Q?NdO<<IpO%[Q^O<<IpOOQO<<Ia<<IaO!ArQ?MxO<<IaO&9UQ?MxO<<IpO&9aQ?NdO<= XO&9qQWO<= WOOQO7+*Z7+*ZO9WQWO7+*ZOOQUANAhANAhO&9yQrOANAhO!&_Q7[OANAhO#&wQWOANAhO4UQrOANAhO&:QQWOANAhO%[Q^OANAhO&:YQ?NdO7+'xO&<hQ?NdO,5?]O&>pQ?NdO,5?_O&@xQ?NdO7+'zO&CWQrO1G4hO&CbQ07bO7+&^O&EcQ07bO,5=UO&GgQ07bO,5=WO&GwQ07bO,5=UO&HXQ07bO,5=WO&HiQ07bO,59rO&JlQ07bO,5<iO&LlQ07bO,5<kO&N}Q07bO,5<yO'!pQ07bO7+'jO'!}Q07bO7+'kO'#[QWO,5<[OOQO7+'_7+'_O'#aQ7[O<<KzOOQO1G4s1G4sO'#hQWO1G4sO'#sQWO1G4sO'$RQWO7++xO'$RQWO7++xO!&_Q7[O1G4uO'$ZQpO1G4uO'$eQWO7++yOOQ?Mp7+(S7+(SO'$mQWO7+(TO'$xQpO7+(TOOQ?Mp7+(R7+(RO$(PQWO7+(SO'%PQWO7+(TO!&_Q7[O7+(TOCcQWO7+(SO'%UQWO7+(TO'%^Q7[O<<NrOOQ?Mr7+$z7+$zO'%hQpO,5?bOOQO-E<t-E<tO'%rQ?NbO7+(WOOQUAN=gAN=gO9^QWO1G5SOOQO1G5S1G5SO'&SQWO1G5SO'&XQWO7+,RO'&XQWO7+,RO9hQ?MxOANBTO@fQWOANBTOOQUANBTANBTOOQUANApANApOOQUANAqANAqO'&aQWO,5?dOOQO-E<v-E<vO'&lQ07bO1G6dOOQO,5?f,5?fOOQO-E<x-E<xOOQU1G3^1G3^O%+xQ^O,5<}O'&vQWO,5<}OOQU<<Lc<<LcO!&_Q7[O<<LcO&7WQWO<<LcO'&{QWO<<LcO%[Q^O<<LcOOQU<<Le<<LeO9hQ?MxO<<LeO$!}QWO<<LeO9RQWO<<LeO''TQ`O1G5RO''`QWO7+,POOQUAN=]AN=]O9hQ?MxOAN=]OOQU<= n<= nOOQU<= o<= oO''hQWO<= nO''mQWO<= oOOQU<<Lm<<LmO''rQWO<<LmO''wQ^O<<LmOOQU1G3w1G3wO>tQWO7+)hO'(OQWO<<I}O'(ZQ07bO<<I}OOQO<<Hv<<HvOOQ?MrAN?cAN?cOOQOAN?[AN?[O$>`Q?NdOAN?[OOQOAN>{AN>{O%[Q^OAN?[OOQO<<Mu<<MuOOQUG27SG27SO!&_Q7[OG27SO#&wQWOG27SO'(eQrOG27SO4UQrOG27SO'(lQWOG27SO'(tQ07bO<<JeO')RQ07bO1G2^O'*tQ07bO,5?]O',tQ07bO,5?_O'.tQ07bO1G2pO'0tQ07bO1G2rO'2tQ07bO<<KVO'3RQ07bO<<IxOOQO1G1v1G1vO!+hQ7[OANAfOOQO7+*_7+*_O'3`QWO7+*_O'3kQWO<= dO'3sQpO7+*aOOQ?Mp<<Ko<<KoO$(PQWO<<KoOCcQWO<<KoO'3}QWO<<KoOOQ?Mp<<Kn<<KnO'4YQpO<<KoO$(PQWO<<KnO'4aQWO<<KoO!&_Q7[O<<KoOOQO7+*n7+*nO9^QWO7+*nO'4fQWO<= mOOQUG27oG27oO9hQ?MxOG27oO!(oQ^O1G5OO'4nQWO7+,OO&7WQWOANA}OOQUANA}ANA}O!&_Q7[OANA}O'4vQWOANA}OOQUANBPANBPO9hQ?MxOANBPO$!}QWOANBPOOQO'#H['#H[OOQO7+*m7+*mOOQUG22wG22wOOQUANEYANEYOOQUANEZANEZOOQUANBXANBXO'5OQWOANBXOOQU<<MS<<MSO!(oQ^OAN?iOOQOG24vG24vO$>`Q?NdOG24vO#&wQWOLD,nOOQULD,nLD,nO!&_Q7[OLD,nO'5TQrOLD,nO'5[Q07bO7+'xO'6}Q07bO,5?]O'8}Q07bO,5?_O':}Q07bO7+'zO'<pQ7[OG27QOOQO<<My<<MyOOQ?MpANAZANAZO$(PQWOANAZOCcQWOANAZO'=QQWOANAZOOQ?MpANAYANAYO'=]QpOANAZOOQO<<NY<<NYOOQULD-ZLD-ZO'=dQ07bO7+*jOOQUG27iG27iO&7WQWOG27iO!&_Q7[OG27iOOQUG27kG27kO9hQ?MxOG27kOOQUG27sG27sO'=nQ07bOG25TOOQOLD*bLD*bOOQU!$(!Y!$(!YO#&wQWO!$(!YO!&_Q7[O!$(!YO'=xQ?NdOG27QOOQ?MpG26uG26uO$(PQWOG26uOCcQWOG26uO'@WQWOG26uOOQULD-TLD-TO&7WQWOLD-TOOQULD-VLD-VOOQU!)9Et!)9EtO#&wQWO!)9EtOOQ?MpLD,aLD,aO$(PQWOLD,aOCcQWOLD,aOOQU!$(!o!$(!oOOQU!.K;`!.K;`O'@cQ07bOG27QOOQ?Mp!$( {!$( {O$(PQWO!$( {OOQ?Mp!)9Eg!)9EgO!(oQ^O'#DwO1PQWO'#EUO'BUQrO'#JmO'B]QMnO'#DsO'BdQ^O'#D{O'BkQrO'#CiO'ERQrO'#CiO!(oQ^O'#D}O'EcQ^O,5;WO!(oQ^O,5;bO!(oQ^O,5;bO!(oQ^O,5;bO!(oQ^O,5;bO!(oQ^O,5;bO!(oQ^O,5;bO!(oQ^O,5;bO!(oQ^O,5;bO!(oQ^O,5;bO!(oQ^O,5;bO!(oQ^O'#IlO'GfQWO,5<gO!(oQ^O,5;bO'GnQ7[O,5;bO'IXQ7[O,5;bO!(oQ^O,5;vO!&_Q7[O'#GjO'GnQ7[O'#GjO!&_Q7[O'#GlO'GnQ7[O'#GlO1SQWO'#DWO1SQWO'#DWO!&_Q7[O'#F}O'GnQ7[O'#F}O!&_Q7[O'#GPO'GnQ7[O'#GPO!&_Q7[O'#G_O'GnQ7[O'#G_O!(oQ^O,5:gO'I`Q`O'#D[O!(oQ^O,5@jO'EcQ^O1G0rO'IjQ07bO'#CiO!(oQ^O1G2OO!&_Q7[O'#IqO'GnQ7[O'#IqO!&_Q7[O'#IsO'GnQ7[O'#IsO'ItQpO'#CrO!&_Q7[O,5<rO'GnQ7[O,5<rO'EcQ^O1G2PO!(oQ^O7+&yO!&_Q7[O1G2^O'GnQ7[O1G2^O!&_Q7[O'#IqO'GnQ7[O'#IqO!&_Q7[O'#IsO'GnQ7[O'#IsO!&_Q7[O1G2`O'GnQ7[O1G2`O'EcQ^O7+'kO'EcQ^O7+&^O!&_Q7[OANAfO'GnQ7[OANAfO'JXQWO'#ElO'J^QWO'#ElO'JfQWO'#F[O'JkQWO'#EvO'JpQWO'#KOO'J{QWO'#J|O'KWQWO,5;WO'K]Q7[O,5<dO'KdQWO'#GWO'KiQWO'#GWO'KnQWO,5<eO'KvQWO,5;WO'LOQ07bO1G1_O'LVQWO,5<rO'L[QWO,5<rO'LaQWO,5<tO'LfQWO,5<tO'LkQWO1G2PO'LpQWO1G0rO'LuQ7[O<<KzO'L|Q7[O<<KzO7eQ7[O'#FzO9RQWO'#FyOAaQWO'#EkO!(oQ^O,5;sO!3SQWO'#GWO!3SQWO'#GWO!3SQWO'#GYO!3SQWO'#GYO!+hQ7[O7+(`O!+hQ7[O7+(`O%+SQpO1G2tO%+SQpO1G2tO!&_Q7[O,5=YO!&_Q7[O,5=Y",
  stateData: "'NQ~O'wOS'xOSTOS'yRQ~OPYOQYOSfOY!VOaqOdzOeyOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![XO!fuO!iZO!lYO!mYO!nYO!pvO!rwO!uxO!y]O#t!PO$V|O%e}O%g!QO%i!OO%j!OO%k!OO%n!RO%p!SO%s!TO%t!TO%v!UO&S!WO&Y!XO&[!YO&^!ZO&`![O&c!]O&i!^O&o!_O&q!`O&s!aO&u!bO&w!cO(OSO(QTO(TUO([VO(j[O(yiO~OWtO~P`OPYOQYOSfOd!jOe!iOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![!eO!fuO!iZO!lYO!mYO!nYO!pvO!r!gO!u!hO$V!kO(O!dO(QTO(TUO([VO(j[O(yiO~Oa!wOp!nO!P!oO!_!yO!`!vO!a!vO!y;QO#Q!pO#R!pO#S!xO#T!pO#U!pO#X!zO#Y!zO(P!lO(QTO(TUO(`!mO(j!sO~O'y!{O~OP]XR]X[]Xa]Xo]X}]X!P]X!Y]X!i]X!m]X#O]X#P]X#]]X#hfX#k]X#l]X#m]X#n]X#o]X#p]X#q]X#r]X#s]X#u]X#w]X#y]X#z]X$P]X'u]X([]X(m]X(t]X(u]X~O!d%PX~P(qO_!}O(Q#PO(R!}O(S#PO~O_#QO(S#PO(T#PO(U#QO~Ou#SO!R#TO(]#TO(^#VO~OPYOQYOSfOd!jOe!iOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![!eO!fuO!iZO!lYO!mYO!nYO!pvO!r!gO!u!hO$V!kO(O;UO(QTO(TUO([VO(j[O(yiO~O!X#ZO!Y#WO!V(cP!V(qP~P+}O!Z#cO~P`OPYOQYOSfOd!jOe!iOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![!eO!fuO!iZO!lYO!mYO!nYO!pvO!r!gO!u!hO$V!kO(QTO(TUO([VO(j[O(yiO~Om#mO!X#iO!y]O#f#lO#g#iO(O;VO!h(nP~P.iO!i#oO(O#nO~O!u#sO!y]O%e#tO~O#h#uO~O!d#vO#h#uO~OP$[OR#zO[$cOo$aO}#yO!P#{O!Y$_O!i#xO!m$[O#O$RO#k$OO#l$PO#m$PO#n$PO#o$QO#p$RO#q$RO#r$bO#s$RO#u$SO#w$UO#y$WO#z$XO([VO(m$YO(t#|O(u#}O~Oa(aX'u(aX's(aX!h(aX!V(aX![(aX%f(aX!d(aX~P1qO#P$dO#]$eO$P$eOP(bXR(bX[(bXo(bX}(bX!P(bX!Y(bX!i(bX!m(bX#O(bX#k(bX#l(bX#m(bX#n(bX#o(bX#p(bX#q(bX#r(bX#s(bX#u(bX#w(bX#y(bX#z(bX([(bX(m(bX(t(bX(u(bX![(bX%f(bX~Oa(bX'u(bX's(bX!V(bX!h(bXs(bX!d(bX~P4UO#]$eO~O$[$hO$^$gO$e$mO~OSfO![$nO$h$oO$j$qO~Oh%VOm%WOo%XOp$tOq$tOw%YOy%ZO{%[O!P${O![$|O!f%aO!i$xO#g%bO$V%_O$r%]O$t%^O$w%`O(O$sO(QTO(TUO([$uO(t$}O(u%POg(XP~O!i%cO~O!P%fO![%gO(O%eO~O!d%kO~Oa%lO'u%lO~O}%pO~P%[O(P!lO~P%[O%k%tO~P%[Oh%VO!i%cO(O%eO(P!lO~Oe%{O!i%cO(O%eO~O#s$RO~O}&QO![%}O!i&PO%g&TO(O%eO(P!lO(QTO(TUO`)SP~O!u#sO~O%p&VO!P)OX![)OX(O)OX~O(O&WO~O!r&]O#t!PO%g!QO%i!OO%j!OO%k!OO%n!RO%p!SO%s!TO%t!TO~Od&bOe&aO!u&_O%e&`O%x&^O~P;|Od&eOeyO![&dO!r&]O!uxO!y]O#t!PO%e}O%i!OO%j!OO%k!OO%n!RO%p!SO%s!TO%t!TO%v!UO~Ob&hO#]&kO%g&fO(P!lO~P=RO!i&lO!r&pO~O!i#oO~O![XO~Oa%lO't&xO'u%lO~Oa%lO't&{O'u%lO~Oa%lO't&}O'u%lO~O's]X!V]Xs]X!h]X&W]X![]X%f]X!d]X~P(qO!_'[O!`'TO!a'TO(P!lO(QTO(TUO~Op'RO!P'QO!X'UO(`'PO!Z(dP!Z(sP~P@YOk'_O![']O(O%eO~Oe'dO!i%cO(O%eO~O}&QO!i&PO~Op!nO!P!oO!y;QO#Q!pO#R!pO#T!pO#U!pO(P!lO(QTO(TUO(`!mO(j!sO~O!_'jO!`'iO!a'iO#S!pO#X'kO#Y'kO~PAtOa%lOh%VO!d#vO!i%cO'u%lO(m'mO~O!m'qO#]'oO~PCSOp!nO!P!oO(QTO(TUO(`!mO(j!sO~O![XOp(hX!P(hX!_(hX!`(hX!a(hX!y(hX#Q(hX#R(hX#S(hX#T(hX#U(hX#X(hX#Y(hX(P(hX(Q(hX(T(hX(`(hX(j(hX~O!`'iO!a'iO(P!lO~PCrO'z'uO'{'uO'|'wO~O_!}O(Q'yO(R!}O(S'yO~O_#QO(S'yO(T'yO(U#QO~Ou#SO!R#TO(]#TO(^'}O~O!X(PO!V'SX!V'YX!Y'SX!Y'YX~P+}O!Y(RO!V(cX~OP$[OR#zO[$cOo$aO}#yO!P#{O!Y(RO!i#xO!m$[O#O$RO#k$OO#l$PO#m$PO#n$PO#o$QO#p$RO#q$RO#r$bO#s$RO#u$SO#w$UO#y$WO#z$XO([VO(m$YO(t#|O(u#}O~O!V(cX~PGfO!V(WO~O!V(pX!Y(pX!d(pX!h(pX(m(pX~O#](pX#h#aX!Z(pX~PIiO#](XO!V(rX!Y(rX~O!Y(YO!V(qX~O!V(]O~O#]$eO~PIiO!Z(^O~P`OR#zO}#yO!P#{O!i#xO([VOP!ka[!kao!ka!Y!ka!m!ka#O!ka#k!ka#l!ka#m!ka#n!ka#o!ka#p!ka#q!ka#r!ka#s!ka#u!ka#w!ka#y!ka#z!ka(m!ka(t!ka(u!ka~Oa!ka'u!ka's!ka!V!ka!h!kas!ka![!ka%f!ka!d!ka~PKPO!h(_O~O!d#vO#](`O(m'mO!Y(oXa(oX'u(oX~O!h(oX~PMlO!P%fO![%gO!y]O#f(eO#g(dO(O%eO~O!Y(fO!h(nX~O!h(hO~O!P%fO![%gO#g(dO(O%eO~OP(bXR(bX[(bXo(bX}(bX!P(bX!Y(bX!i(bX!m(bX#O(bX#k(bX#l(bX#m(bX#n(bX#o(bX#p(bX#q(bX#r(bX#s(bX#u(bX#w(bX#y(bX#z(bX([(bX(m(bX(t(bX(u(bX~O!d#vO!h(bX~P! YOR(jO}(iO!i#xO#P$dO!y!xa!P!xa~O!u!xa%e!xa![!xa#f!xa#g!xa(O!xa~P!#ZO!u(nO~OPYOQYOSfOd!jOe!iOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![XO!fuO!iZO!lYO!mYO!nYO!pvO!r!gO!u!hO$V!kO(O!dO(QTO(TUO([VO(j[O(yiO~Oh%VOm%WOo%XOp$tOq$tOw%YOy%ZO{;nO!P${O![$|O!f=OO!i$xO#g;tO$V%_O$r;pO$t;rO$w%`O(O(rO(QTO(TUO([$uO(t$}O(u%PO~O#h(tO~O!X(vO!h(fP~P%[O(`(xO(j[O~O!P(zO!i#xO(`(xO(j[O~OP;POQ;POSfOd<zOe!iOmkOo;POpkOqkOwkOy;PO{;PO!PWO!TkO!UkO![!eO!f;SO!iZO!l;PO!m;PO!n;PO!p;TO!r;WO!u!hO$V!kO(O)XO(QTO(TUO([VO(j[O(y<xO~O!Y$_Oa$oa'u$oa's$oa!h$oa!V$oa![$oa%f$oa!d$oa~O#t)`O~P!&_Oh%VOm%WOo%XOp$tOq$tOw%YOy%ZO{%[O!P${O![$|O!f%aO!i$xO#g%bO$V%_O$r%]O$t%^O$w%`O(O(rO(QTO(TUO([$uO(t$}O(u%PO~Og(kP~P!+hO})eO!d)dO![$]X$Y$]X$[$]X$^$]X$e$]X~O!d)dO![(vX$Y(vX$[(vX$^(vX$e(vX~O})eO~P!-qO})eO![(vX$Y(vX$[(vX$^(vX$e(vX~O![)gO$Y)kO$[)fO$^)fO$e)lO~O!X)oO~P!(oO$[$hO$^$gO$e)sO~Ok$xX}$xX!P$xX#P$xX(t$xX(u$xX~OgjXg$xXkjX!YjX#]jX~P!/gOu)uO(])vO(^)xO~Ok*RO})zO!P){O(t$}O(u%PO~Og)yO~P!0kOg*SO~Oh%VOm%WOo%XOp$tOq$tOw%YOy%ZO{;nO!P*UO![*VO!f=OO!i$xO#g;tO$V%_O$r;pO$t;rO$w%`O(QTO(TUO([$uO(t$}O(u%PO~O!X*YO(O*TO!h(zP~P!1YO#h*[O~O!i*]O~Oh%VOm%WOo%XOp$tOq$tOw%YOy%ZO{;nO!P${O![$|O!f=OO!i$xO#g;tO$V%_O$r;pO$t;rO$w%`O(O*_O(QTO(TUO([$uO(t$}O(u%PO~O!X*bO!V({P~P!3XOo*nO!P*fO!_*lO!`*eO!a*eO!i*]O#X*mO%]*hO(P!lO(`!mO~O!Z*kO~P!4|O#P$dOk(ZX}(ZX!P(ZX(t(ZX(u(ZX!Y(ZX#](ZX~Og(ZX#}(ZX~P!5uOk*sO#]*rOg(YX!Y(YX~O!Y*tOg(XX~O(O&WOg(XP~Op*wO~O!i*|O~O(O(rO~Om+QO!P%fO!X#iO![%gO!y]O#f#lO#g#iO(O%eO!h(nP~O!d#vO#h+RO~O!P%fO!X+TO!Y(YO![%gO(O%eO!V(qP~Op'XO!P+VO!X+UO(QTO(TUO(`(xO~O!Z(sP~P!8uO!Y+WOa)PX'u)PX~OP$[OR#zO[$cOo$aO}#yO!P#{O!i#xO!m$[O#O$RO#k$OO#l$PO#m$PO#n$PO#o$QO#p$RO#q$RO#r$bO#s$RO#u$SO#w$UO#y$WO#z$XO([VO(m$YO(t#|O(u#}O~Oa!ga!Y!ga'u!ga's!ga!V!ga!h!gas!ga![!ga%f!ga!d!ga~P!9mOR#zO}#yO!P#{O!i#xO([VOP!oa[!oao!oa!Y!oa!m!oa#O!oa#k!oa#l!oa#m!oa#n!oa#o!oa#p!oa#q!oa#r!oa#s!oa#u!oa#w!oa#y!oa#z!oa(m!oa(t!oa(u!oa~Oa!oa'u!oa's!oa!V!oa!h!oas!oa![!oa%f!oa!d!oa~P!<TOR#zO}#yO!P#{O!i#xO([VOP!qa[!qao!qa!Y!qa!m!qa#O!qa#k!qa#l!qa#m!qa#n!qa#o!qa#p!qa#q!qa#r!qa#s!qa#u!qa#w!qa#y!qa#z!qa(m!qa(t!qa(u!qa~Oa!qa'u!qa's!qa!V!qa!h!qas!qa![!qa%f!qa!d!qa~P!>kOh%VOk+aO![']O%f+`O~O!d+cOa(WX![(WX'u(WX!Y(WX~Oa%lO![XO'u%lO~Oh%VO!i%cO~Oh%VO!i%cO(O%eO~O!d#vO#h(tO~Ob+nO%g+oO(O+kO(QTO(TUO!Z)TP~O!Y+pO`)SX~O[+tO~O`+uO~O![%}O(O%eO(P!lO`)SP~Oh%VO#]+zO~Oh%VOk+}O![$|O~O![,PO~O},RO![XO~O%k%tO~O!u,WO~Oe,]O~Ob,^O(O#nO(QTO(TUO!Z)RP~Oe%{O~O%g!QO(O&WO~P=RO[,cO`,bO~OPYOQYOSfOdzOeyOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO!fuO!iZO!lYO!mYO!nYO!pvO!uxO!y]O%e}O(QTO(TUO([VO(j[O(yiO~O![!eO!r!gO$V!kO(O!dO~P!EkO`,bOa%lO'u%lO~OPYOQYOSfOd!jOe!iOmkOoYOpkOqkOwkOyYO{YO!PWO!TkO!UkO![!eO!fuO!iZO!lYO!mYO!nYO!pvO!u!hO$V!kO(O!dO(QTO(TUO([VO(j[O(yiO~Oa,hO!rwO#t!OO%i!OO%j!OO%k!OO~P!HTO!i&lO~O&Y,nO~O![,pO~O&k,rO&m,sOP&haQ&haS&haY&haa&had&hae&ham&hao&hap&haq&haw&hay&ha{&ha!P&ha!T&ha!U&ha![&ha!f&ha!i&ha!l&ha!m&ha!n&ha!p&ha!r&ha!u&ha!y&ha#t&ha$V&ha%e&ha%g&ha%i&ha%j&ha%k&ha%n&ha%p&ha%s&ha%t&ha%v&ha&S&ha&Y&ha&[&ha&^&ha&`&ha&c&ha&i&ha&o&ha&q&ha&s&ha&u&ha&w&ha's&ha(O&ha(Q&ha(T&ha([&ha(j&ha(y&ha!Z&ha&a&hab&ha&f&ha~O(O,xO~Oh!bX!Y!OX!Z!OX!d!OX!d!bX!i!bX#]!OX~O!Y!bX!Z!bX~P# ZO!d,}O#],|Oh(eX!Y#eX!Y(eX!Z#eX!Z(eX!d(eX!i(eX~Oh%VO!d-PO!i%cO!Y!^X!Z!^X~Op!nO!P!oO(QTO(TUO(`!mO~OP;POQ;POSfOd<zOe!iOmkOo;POpkOqkOwkOy;PO{;PO!PWO!TkO!UkO![!eO!f;SO!iZO!l;PO!m;PO!n;PO!p;TO!r;WO!u!hO$V!kO(QTO(TUO([VO(j[O(y<xO~O(O;zO~P##_O!Y-TO!Z(dX~O!Z-VO~O!d,}O#],|O!Y#eX!Z#eX~O!Y-WO!Z(sX~O!Z-YO~O!`-ZO!a-ZO(P!lO~P#!|O!Z-^O~P'_Ok-aO![']O~O!V-fO~Op!xa!_!xa!`!xa!a!xa#Q!xa#R!xa#S!xa#T!xa#U!xa#X!xa#Y!xa(P!xa(Q!xa(T!xa(`!xa(j!xa~P!#ZO!m-kO#]-iO~PCSO!`-mO!a-mO(P!lO~PCrOa%lO#]-iO'u%lO~Oa%lO!d#vO#]-iO'u%lO~Oa%lO!d#vO!m-kO#]-iO'u%lO(m'mO~O'z'uO'{'uO'|-rO~Os-sO~O!V'Sa!Y'Sa~P!9mO!X-wO!V'SX!Y'SX~P%[O!Y(RO!V(ca~O!V(ca~PGfO!Y(YO!V(qa~O!P%fO!X-{O![%gO(O%eO!V'YX!Y'YX~O#]-}O!Y(oa!h(oaa(oa'u(oa~O!d#vO~P#+eO!Y(fO!h(na~O!P%fO![%gO#g.RO(O%eO~Om.WO!P%fO!X.TO![%gO!y]O#f.VO#g.TO(O%eO!Y']X!h']X~OR.[O!i#xO~Oh%VOk._O![']O%f.^O~Oa#`i!Y#`i'u#`i's#`i!V#`i!h#`is#`i![#`i%f#`i!d#`i~P!9mOk=UO})zO!P){O(t$}O(u%PO~O#h#[aa#[a#]#[a'u#[a!Y#[a!h#[a![#[a!V#[a~P#.aO#h(ZXP(ZXR(ZX[(ZXa(ZXo(ZX!i(ZX!m(ZX#O(ZX#k(ZX#l(ZX#m(ZX#n(ZX#o(ZX#p(ZX#q(ZX#r(ZX#s(ZX#u(ZX#w(ZX#y(ZX#z(ZX'u(ZX([(ZX(m(ZX!h(ZX!V(ZX's(ZXs(ZX![(ZX%f(ZX!d(ZX~P!5uO!Y.lO!h(fX~P!9mO!h.oO~O!V.qO~OP$[OR#zO}#yO!P#{O!i#xO!m$[O([VO[#jia#jio#ji!Y#ji#O#ji#l#ji#m#ji#n#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji'u#ji(m#ji(t#ji(u#ji's#ji!V#ji!h#jis#ji![#ji%f#ji!d#ji~O#k#ji~P#1|O#k$OO~P#1|OP$[OR#zOo$aO}#yO!P#{O!i#xO!m$[O#k$OO#l$PO#m$PO#n$PO([VO[#jia#ji!Y#ji#O#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji'u#ji(m#ji(t#ji(u#ji's#ji!V#ji!h#jis#ji![#ji%f#ji!d#ji~O#o#ji~P#4kO#o$QO~P#4kOP$[OR#zO[$cOo$aO}#yO!P#{O!i#xO!m$[O#O$RO#k$OO#l$PO#m$PO#n$PO#o$QO#p$RO#q$RO#r$bO#s$RO([VOa#ji!Y#ji#w#ji#y#ji#z#ji'u#ji(m#ji(t#ji(u#ji's#ji!V#ji!h#jis#ji![#ji%f#ji!d#ji~O#u#ji~P#7YOP$[OR#zO[$cOo$aO}#yO!P#{O!i#xO!m$[O#O$RO#k$OO#l$PO#m$PO#n$PO#o$QO#p$RO#q$RO#r$bO#s$RO#u$SO([VO(u#}Oa#ji!Y#ji#y#ji#z#ji'u#ji(m#ji(t#ji's#ji!V#ji!h#jis#ji![#ji%f#ji!d#ji~O#w$UO~P#9pO#w#ji~P#9pO#u$SO~P#7YOP$[OR#zO[$cOo$aO}#yO!P#{O!i#xO!m$[O#O$RO#k$OO#l$PO#m$PO#n$PO#o$QO#p$RO#q$RO#r$bO#s$RO#u$SO#w$UO([VO(t#|O(u#}Oa#ji!Y#ji#z#ji'u#ji(m#ji's#ji!V#ji!h#jis#ji![#ji%f#ji!d#ji~O#y#ji~P#<fO#y$WO~P#<fOP]XR]X[]Xo]X}]X!P]X!i]X!m]X#O]X#P]X#]]X#hfX#k]X#l]X#m]X#n]X#o]X#p]X#q]X#r]X#s]X#u]X#w]X#y]X#z]X$P]X([]X(m]X(t]X(u]X!Y]X!Z]X~O#}]X~P#?TOP$[OR#zO[;hOo;fO}#yO!P#{O!i#xO!m$[O#O;]O#k;YO#l;ZO#m;ZO#n;ZO#o;[O#p;]O#q;]O#r;gO#s;]O#u;^O#w;`O#y;bO#z;cO([VO(m$YO(t#|O(u#}O~O#}.sO~P#AbO#P$dO#];iO$P;iO#}(bX!Z(bX~P! YOa'`a!Y'`a'u'`a's'`a!h'`a!V'`as'`a!['`a%f'`a!d'`a~P!9mO[#jia#jio#ji!Y#ji#O#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji'u#ji(m#ji's#ji!V#ji!h#jis#ji![#ji%f#ji!d#ji~OP$[OR#zO}#yO!P#{O!i#xO!m$[O#k$OO#l$PO#m$PO#n$PO([VO(t#ji(u#ji~P#DdOk=UO})zO!P){O(t$}O(u%POP#jiR#ji!i#ji!m#ji#k#ji#l#ji#m#ji#n#ji([#ji~P#DdO!Y.wOg(kX~P!0kOg.yO~Oa$Oi!Y$Oi'u$Oi's$Oi!V$Oi!h$Ois$Oi![$Oi%f$Oi!d$Oi~P!9mO$[.zO$^.zO~O$[.{O$^.{O~O!d)dO#].|O![$bX$Y$bX$[$bX$^$bX$e$bX~O!X.}O~O![)gO$Y/PO$[)fO$^)fO$e/QO~O!Y;dO!Z(aX~P#AbO!Z/RO~O!d)dO$e(vX~O$e/TO~Ou)uO(])vO(^/WO~O!V/[O~P!&_O(t$}Ok%^a}%^a!P%^a(u%^a!Y%^a#]%^a~Og%^a#}%^a~P#K^O(u%POk%`a}%`a!P%`a(t%`a!Y%`a#]%`a~Og%`a#}%`a~P#LPO!YfX!dfX!hfX!h$xX(mfX~P!/gO!X/eO!Y(YO(O/dO!V(qP!V({P~P!1YOo*nO!_*lO!`*eO!a*eO!i*]O#X*mO%]*hO(P!lO~Op'XO!P/fO!X+UO!Z*kO(QTO(TUO(`;wO!Z(sP~P#MjO!h/gO~P#.aO!Y/hO!d#vO(m'mO!h(zX~O!h/mO~O!P%fO!X*YO![%gO(O%eO!h(zP~O#h/oO~O!V$xX!Y$xX!d%PX~P!/gO!Y/pO!V({X~P#.aO!d/rO~O!V/tO~Oh%VOo/xO!d#vO!i%cO(m'mO~O(O/zO~O!d+cO~Oa%lO!Y0OO'u%lO~O!Z0QO~P!4|O!`0RO!a0RO(P!lO(`!mO~O!P0TO(`!mO~O#X0UO~Og%^a!Y%^a#]%^a#}%^a~P!0kOg%`a!Y%`a#]%`a#}%`a~P!0kO(O&WOg'iX!Y'iX~O!Y*tOg(Xa~Og0_O~OR0`O}0`O!P0aO#P$dOkza(tza(uza!Yza#]za~Ogza#}za~P$%]O})zO!P){Ok$qa(t$qa(u$qa!Y$qa#]$qa~Og$qa#}$qa~P$&UO})zO!P){Ok$sa(t$sa(u$sa!Y$sa#]$sa~Og$sa#}$sa~P$&wO#h0dO~Og%Ra!Y%Ra#]%Ra#}%Ra~P!0kO!d#vO~O#h0gO~O!Y+WOa)Pa'u)Pa~OR#zO}#yO!P#{O!i#xO([VOP!oi[!oio!oi!Y!oi!m!oi#O!oi#k!oi#l!oi#m!oi#n!oi#o!oi#p!oi#q!oi#r!oi#s!oi#u!oi#w!oi#y!oi#z!oi(m!oi(t!oi(u!oi~Oa!oi'u!oi's!oi!V!oi!h!ois!oi![!oi%f!oi!d!oi~P$(fOh%VOo%XOp$tOq$tOw%YOy%ZO{;nO!P${O![$|O!f=OO!i$xO#g;tO$V%_O$r;pO$t;rO$w%`O(QTO(TUO([$uO(t$}O(u%PO~Om0pO(O0oO~P$*|O!d+cOa(Wa![(Wa'u(Wa!Y(Wa~O#h0vO~O[]X!YfX!ZfX~O!Y0wO!Z)TX~O!Z0yO~O[0zO~Ob0|O(O+kO(QTO(TUO~O![%}O(O%eO`'qX!Y'qX~O!Y+pO`)Sa~O!h1PO~P!9mO[1SO~O`1TO~O#]1WO~Ok1ZO![$|O~O(`(xO!Z)QP~Oh%VOk1dO![1aO%f1cO~O[1nO!Y1lO!Z)RX~O!Z1oO~O`1qOa%lO'u%lO~O(O#nO(QTO(TUO~O#P$dO#]$eO$P$eOP(bXR(bX[(bXo(bX}(bX!P(bX!Y(bX!i(bX!m(bX#O(bX#k(bX#l(bX#m(bX#n(bX#o(bX#p(bX#q(bX#r(bX#u(bX#w(bX#y(bX#z(bX([(bX(m(bX(t(bX(u(bX~O#s1tO&W1uOa(bX~P$0dO#]$eO#s1tO&W1uO~Oa1wO~P%[Oa1yO~O&a1|OP&_iQ&_iS&_iY&_ia&_id&_ie&_im&_io&_ip&_iq&_iw&_iy&_i{&_i!P&_i!T&_i!U&_i![&_i!f&_i!i&_i!l&_i!m&_i!n&_i!p&_i!r&_i!u&_i!y&_i#t&_i$V&_i%e&_i%g&_i%i&_i%j&_i%k&_i%n&_i%p&_i%s&_i%t&_i%v&_i&S&_i&Y&_i&[&_i&^&_i&`&_i&c&_i&i&_i&o&_i&q&_i&s&_i&u&_i&w&_i's&_i(O&_i(Q&_i(T&_i([&_i(j&_i(y&_i!Z&_ib&_i&f&_i~Ob2SO!Z2QO&f2RO~P`O![XO!i2UO~O&m,sOP&hiQ&hiS&hiY&hia&hid&hie&him&hio&hip&hiq&hiw&hiy&hi{&hi!P&hi!T&hi!U&hi![&hi!f&hi!i&hi!l&hi!m&hi!n&hi!p&hi!r&hi!u&hi!y&hi#t&hi$V&hi%e&hi%g&hi%i&hi%j&hi%k&hi%n&hi%p&hi%s&hi%t&hi%v&hi&S&hi&Y&hi&[&hi&^&hi&`&hi&c&hi&i&hi&o&hi&q&hi&s&hi&u&hi&w&hi's&hi(O&hi(Q&hi(T&hi([&hi(j&hi(y&hi!Z&hi&a&hib&hi&f&hi~O!V2[O~O!Y!^a!Z!^a~P#AbOp!nO!P!oO!X2bO(`!mO!Y'TX!Z'TX~P@YO!Y-TO!Z(da~O!Y'ZX!Z'ZX~P!8uO!Y-WO!Z(sa~O!Z2iO~P'_Oa%lO#]2rO'u%lO~Oa%lO!d#vO#]2rO'u%lO~Oa%lO!d#vO!m2vO#]2rO'u%lO(m'mO~Oa%lO'u%lO~P!9mO!Y$_Os$oa~O!V'Si!Y'Si~P!9mO!Y(RO!V(ci~O!Y(YO!V(qi~O!V(ri!Y(ri~P!9mO!Y(oi!h(oia(oi'u(oi~P!9mO#]2xO!Y(oi!h(oia(oi'u(oi~O!Y(fO!h(ni~O!P%fO![%gO!y]O#f2}O#g2|O(O%eO~O!P%fO![%gO#g2|O(O%eO~Ok3UO![']O%f3TO~Oh%VOk3UO![']O%f3TO~O#h%^aP%^aR%^a[%^aa%^ao%^a!i%^a!m%^a#O%^a#k%^a#l%^a#m%^a#n%^a#o%^a#p%^a#q%^a#r%^a#s%^a#u%^a#w%^a#y%^a#z%^a'u%^a([%^a(m%^a!h%^a!V%^a's%^as%^a![%^a%f%^a!d%^a~P#K^O#h%`aP%`aR%`a[%`aa%`ao%`a!i%`a!m%`a#O%`a#k%`a#l%`a#m%`a#n%`a#o%`a#p%`a#q%`a#r%`a#s%`a#u%`a#w%`a#y%`a#z%`a'u%`a([%`a(m%`a!h%`a!V%`a's%`as%`a![%`a%f%`a!d%`a~P#LPO#h%^aP%^aR%^a[%^aa%^ao%^a!Y%^a!i%^a!m%^a#O%^a#k%^a#l%^a#m%^a#n%^a#o%^a#p%^a#q%^a#r%^a#s%^a#u%^a#w%^a#y%^a#z%^a'u%^a([%^a(m%^a!h%^a!V%^a's%^a#]%^as%^a![%^a%f%^a!d%^a~P#.aO#h%`aP%`aR%`a[%`aa%`ao%`a!Y%`a!i%`a!m%`a#O%`a#k%`a#l%`a#m%`a#n%`a#o%`a#p%`a#q%`a#r%`a#s%`a#u%`a#w%`a#y%`a#z%`a'u%`a([%`a(m%`a!h%`a!V%`a's%`a#]%`as%`a![%`a%f%`a!d%`a~P#.aO#hzaPza[zaazaoza!iza!mza#Oza#kza#lza#mza#nza#oza#pza#qza#rza#sza#uza#wza#yza#zza'uza([za(mza!hza!Vza'szasza![za%fza!dza~P$%]O#h$qaP$qaR$qa[$qaa$qao$qa!i$qa!m$qa#O$qa#k$qa#l$qa#m$qa#n$qa#o$qa#p$qa#q$qa#r$qa#s$qa#u$qa#w$qa#y$qa#z$qa'u$qa([$qa(m$qa!h$qa!V$qa's$qas$qa![$qa%f$qa!d$qa~P$&UO#h$saP$saR$sa[$saa$sao$sa!i$sa!m$sa#O$sa#k$sa#l$sa#m$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#u$sa#w$sa#y$sa#z$sa'u$sa([$sa(m$sa!h$sa!V$sa's$sas$sa![$sa%f$sa!d$sa~P$&wO#h%RaP%RaR%Ra[%Raa%Rao%Ra!Y%Ra!i%Ra!m%Ra#O%Ra#k%Ra#l%Ra#m%Ra#n%Ra#o%Ra#p%Ra#q%Ra#r%Ra#s%Ra#u%Ra#w%Ra#y%Ra#z%Ra'u%Ra([%Ra(m%Ra!h%Ra!V%Ra's%Ra#]%Ras%Ra![%Ra%f%Ra!d%Ra~P#.aOa#`q!Y#`q'u#`q's#`q!V#`q!h#`qs#`q![#`q%f#`q!d#`q~P!9mO!X3^O!Y'UX!h'UX~P%[O!Y.lO!h(fa~O!Y.lO!h(fa~P!9mO!V3aO~O#}!ka!Z!ka~PKPO#}!ga!Y!ga!Z!ga~P#AbO#}!oa!Z!oa~P!<TO#}!qa!Z!qa~P!>kOg'XX!Y'XX~P!+hO!Y.wOg(ka~OSfO![3uO$c3vO~O!Z3zO~Os3{O~P#.aOa$lq!Y$lq'u$lq's$lq!V$lq!h$lqs$lq![$lq%f$lq!d$lq~P!9mO!V3|O~P#.aO})zO!P){O(u%POk'ea(t'ea!Y'ea#]'ea~Og'ea#}'ea~P%)nO})zO!P){Ok'ga(t'ga(u'ga!Y'ga#]'ga~Og'ga#}'ga~P%*aO(m$YO~P#.aO!VfX!V$xX!YfX!Y$xX!d%PX#]fX~P!/gO(O<QO~P!1YOmkO(O4OO~P.iO!P%fO!X4QO![%gO(O%eO!Y'aX!h'aX~O!Y/hO!h(za~O!Y/hO!d#vO!h(za~O!Y/hO!d#vO(m'mO!h(za~Og$zi!Y$zi#]$zi#}$zi~P!0kO!X4YO!V'cX!Y'cX~P!3XO!Y/pO!V({a~O!Y/pO!V({a~P#.aO!d#vO#s4bO~Oo4eO!d#vO(m'mO~O!P4hO(`!mO~O(t$}Ok%^i}%^i!P%^i(u%^i!Y%^i#]%^i~Og%^i#}%^i~P%.wO(u%POk%`i}%`i!P%`i(t%`i!Y%`i#]%`i~Og%`i#}%`i~P%/jOg(Yi!Y(Yi~P!0kO#]4mOg(Yi!Y(Yi~P!0kO!h4pO~Oa$mq!Y$mq'u$mq's$mq!V$mq!h$mqs$mq![$mq%f$mq!d$mq~P!9mO!V4tO~O!Y4uO![(|X~P#.aOa$xX![$xX%Z]X'u$xX!Y$xX~P!/gO%Z4xOalXklX}lX!PlX![lX'ulX(tlX(ulX!YlX~O%Z4xO~Ob5OO%g5PO(O+kO(QTO(TUO!Y'pX!Z'pX~O!Y0wO!Z)Ta~O[5TO~O`5UO~Oa%lO'u%lO~P#.aO![$|O~P#.aO!Y5^O#]5`O!Z)QX~O!Z5aO~Oo5hOp!nO!P5bO!_!yO!`!vO!a!vO!y;QO#Q!pO#R!pO#S!pO#T!pO#U!pO#X5gO#Y!zO(P!lO(QTO(TUO(`!mO(j!sO~O!Z5fO~P%4tOk5mO![1aO%f5lO~Oh%VOk5mO![1aO%f5lO~Ob5tO(O#nO(QTO(TUO!Y'oX!Z'oX~O!Y1lO!Z)Ra~O(QTO(TUO(`5vO~O`5zO~O#s5}O&W6OO~PMlO!h6PO~P%[Oa6RO~Oa6RO~P%[Ob2SO!Z6WO&f2RO~P`O!d6YO~O!d6[Oh(ei!Y(ei!Z(ei!d(ei!i(ei~O!Y#ei!Z#ei~P#AbO#]6]O!Y#ei!Z#ei~O!Y!^i!Z!^i~P#AbOa%lO#]6fO'u%lO~Oa%lO!d#vO#]6fO'u%lO~O!Y(oq!h(oqa(oq'u(oq~P!9mO!Y(fO!h(nq~O!P%fO![%gO#g6mO(O%eO~O![']O%f6pO~Ok6tO![']O%f6pO~O#h'eaP'eaR'ea['eaa'eao'ea!i'ea!m'ea#O'ea#k'ea#l'ea#m'ea#n'ea#o'ea#p'ea#q'ea#r'ea#s'ea#u'ea#w'ea#y'ea#z'ea'u'ea(['ea(m'ea!h'ea!V'ea's'eas'ea!['ea%f'ea!d'ea~P%)nO#h'gaP'gaR'ga['gaa'gao'ga!i'ga!m'ga#O'ga#k'ga#l'ga#m'ga#n'ga#o'ga#p'ga#q'ga#r'ga#s'ga#u'ga#w'ga#y'ga#z'ga'u'ga(['ga(m'ga!h'ga!V'ga's'gas'ga!['ga%f'ga!d'ga~P%*aO#h$ziP$ziR$zi[$zia$zio$zi!Y$zi!i$zi!m$zi#O$zi#k$zi#l$zi#m$zi#n$zi#o$zi#p$zi#q$zi#r$zi#s$zi#u$zi#w$zi#y$zi#z$zi'u$zi([$zi(m$zi!h$zi!V$zi's$zi#]$zis$zi![$zi%f$zi!d$zi~P#.aO#h%^iP%^iR%^i[%^ia%^io%^i!i%^i!m%^i#O%^i#k%^i#l%^i#m%^i#n%^i#o%^i#p%^i#q%^i#r%^i#s%^i#u%^i#w%^i#y%^i#z%^i'u%^i([%^i(m%^i!h%^i!V%^i's%^is%^i![%^i%f%^i!d%^i~P%.wO#h%`iP%`iR%`i[%`ia%`io%`i!i%`i!m%`i#O%`i#k%`i#l%`i#m%`i#n%`i#o%`i#p%`i#q%`i#r%`i#s%`i#u%`i#w%`i#y%`i#z%`i'u%`i([%`i(m%`i!h%`i!V%`i's%`is%`i![%`i%f%`i!d%`i~P%/jO!Y'Ua!h'Ua~P!9mO!Y.lO!h(fi~O#}#`i!Y#`i!Z#`i~P#AbOP$[OR#zO}#yO!P#{O!i#xO!m$[O([VO[#jio#ji#O#ji#l#ji#m#ji#n#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji#}#ji(m#ji(t#ji(u#ji!Y#ji!Z#ji~O#k#ji~P%G^O#k;YO~P%G^OP$[OR#zOo;fO}#yO!P#{O!i#xO!m$[O#k;YO#l;ZO#m;ZO#n;ZO([VO[#ji#O#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji#}#ji(m#ji(t#ji(u#ji!Y#ji!Z#ji~O#o#ji~P%IfO#o;[O~P%IfOP$[OR#zO[;hOo;fO}#yO!P#{O!i#xO!m$[O#O;]O#k;YO#l;ZO#m;ZO#n;ZO#o;[O#p;]O#q;]O#r;gO#s;]O([VO#w#ji#y#ji#z#ji#}#ji(m#ji(t#ji(u#ji!Y#ji!Z#ji~O#u#ji~P%KnOP$[OR#zO[;hOo;fO}#yO!P#{O!i#xO!m$[O#O;]O#k;YO#l;ZO#m;ZO#n;ZO#o;[O#p;]O#q;]O#r;gO#s;]O#u;^O([VO(u#}O#y#ji#z#ji#}#ji(m#ji(t#ji!Y#ji!Z#ji~O#w;`O~P%MoO#w#ji~P%MoO#u;^O~P%KnOP$[OR#zO[;hOo;fO}#yO!P#{O!i#xO!m$[O#O;]O#k;YO#l;ZO#m;ZO#n;ZO#o;[O#p;]O#q;]O#r;gO#s;]O#u;^O#w;`O([VO(t#|O(u#}O#z#ji#}#ji(m#ji!Y#ji!Z#ji~O#y#ji~P&!OO#y;bO~P&!OOa#{y!Y#{y'u#{y's#{y!V#{y!h#{ys#{y![#{y%f#{y!d#{y~P!9mO[#jio#ji#O#ji#o#ji#p#ji#q#ji#r#ji#s#ji#u#ji#w#ji#y#ji#z#ji#}#ji(m#ji!Y#ji!Z#ji~OP$[OR#zO}#yO!P#{O!i#xO!m$[O#k;YO#l;ZO#m;ZO#n;ZO([VO(t#ji(u#ji~P&$zOk=VO})zO!P){O(t$}O(u%POP#jiR#ji!i#ji!m#ji#k#ji#l#ji#m#ji#n#ji([#ji~P&$zO#P$dOP(ZXR(ZX[(ZXk(ZXo(ZX}(ZX!P(ZX!i(ZX!m(ZX#O(ZX#k(ZX#l(ZX#m(ZX#n(ZX#o(ZX#p(ZX#q(ZX#r(ZX#s(ZX#u(ZX#w(ZX#y(ZX#z(ZX#}(ZX([(ZX(m(ZX(t(ZX(u(ZX!Y(ZX!Z(ZX~O#}$Oi!Y$Oi!Z$Oi~P#AbO#}!oi!Z!oi~P$(fOg'Xa!Y'Xa~P!0kO!Z7WO~O!Y'`a!Z'`a~P#AbOP]XR]X[]Xo]X}]X!P]X!V]X!Y]X!i]X!m]X#O]X#P]X#]]X#hfX#k]X#l]X#m]X#n]X#o]X#p]X#q]X#r]X#s]X#u]X#w]X#y]X#z]X$P]X([]X(m]X(t]X(u]X~O!d%WX#s%WX~P&+QO!d#vO(m'mO!Y'aa!h'aa~O!Y/hO!h(zi~O!Y/hO!d#vO!h(zi~Og$zq!Y$zq#]$zq#}$zq~P!0kO!V'ca!Y'ca~P#.aO!d7_O~O!Y/pO!V({i~P#.aO!Y/pO!V({i~O!V7cO~O!d#vO#s7hO~Oo7iO!d#vO(m'mO~O})zO!P){O(u%POk'fa(t'fa!Y'fa#]'fa~Og'fa#}'fa~P&/pO})zO!P){Ok'ha(t'ha(u'ha!Y'ha#]'ha~Og'ha#}'ha~P&0cO!V7lO~Og$|q!Y$|q#]$|q#}$|q~P!0kOa$my!Y$my'u$my's$my!V$my!h$mys$my![$my%f$my!d$my~P!9mO!d6[O~O!Y4uO![(|a~O![']OP$SaR$Sa[$Sao$Sa}$Sa!P$Sa!Y$Sa!i$Sa!m$Sa#O$Sa#k$Sa#l$Sa#m$Sa#n$Sa#o$Sa#p$Sa#q$Sa#r$Sa#s$Sa#u$Sa#w$Sa#y$Sa#z$Sa([$Sa(m$Sa(t$Sa(u$Sa~O%f6pO~P&2lOa#`y!Y#`y'u#`y's#`y!V#`y!h#`ys#`y![#`y%f#`y!d#`y~P!9mO[7qO~Ob7sO(O+kO(QTO(TUO~O!Y0wO!Z)Ti~O`7wO~O(`(xO!Y'lX!Z'lX~O!Y5^O!Z)Qa~O!Z8QO~P%4tOp!nO!P8RO(QTO(TUO(`!mO(j!sO~O#X8SO~O![1aO~O![1aO%f8UO~Ok8XO![1aO%f8UO~O[8^O!Y'oa!Z'oa~O!Y1lO!Z)Ri~O!h8bO~O!h8cO~O!h8fO~O!h8fO~P%[Oa8hO~O!d8iO~O!h8jO~O!Y(ri!Z(ri~P#AbOa%lO#]8rO'u%lO~O!Y(oy!h(oya(oy'u(oy~P!9mO!Y(fO!h(ny~O%f8uO~P&2lO![']O%f8uO~O#h$zqP$zqR$zq[$zqa$zqo$zq!Y$zq!i$zq!m$zq#O$zq#k$zq#l$zq#m$zq#n$zq#o$zq#p$zq#q$zq#r$zq#s$zq#u$zq#w$zq#y$zq#z$zq'u$zq([$zq(m$zq!h$zq!V$zq's$zq#]$zqs$zq![$zq%f$zq!d$zq~P#.aO#h'faP'faR'fa['faa'fao'fa!i'fa!m'fa#O'fa#k'fa#l'fa#m'fa#n'fa#o'fa#p'fa#q'fa#r'fa#s'fa#u'fa#w'fa#y'fa#z'fa'u'fa(['fa(m'fa!h'fa!V'fa's'fas'fa!['fa%f'fa!d'fa~P&/pO#h'haP'haR'ha['haa'hao'ha!i'ha!m'ha#O'ha#k'ha#l'ha#m'ha#n'ha#o'ha#p'ha#q'ha#r'ha#s'ha#u'ha#w'ha#y'ha#z'ha'u'ha(['ha(m'ha!h'ha!V'ha's'has'ha!['ha%f'ha!d'ha~P&0cO#h$|qP$|qR$|q[$|qa$|qo$|q!Y$|q!i$|q!m$|q#O$|q#k$|q#l$|q#m$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#u$|q#w$|q#y$|q#z$|q'u$|q([$|q(m$|q!h$|q!V$|q's$|q#]$|qs$|q![$|q%f$|q!d$|q~P#.aO!Y'Ui!h'Ui~P!9mO#}#`q!Y#`q!Z#`q~P#AbO(t$}OP%^aR%^a[%^ao%^a!i%^a!m%^a#O%^a#k%^a#l%^a#m%^a#n%^a#o%^a#p%^a#q%^a#r%^a#s%^a#u%^a#w%^a#y%^a#z%^a#}%^a([%^a(m%^a!Y%^a!Z%^a~Ok%^a}%^a!P%^a(u%^a~P&CoO(u%POP%`aR%`a[%`ao%`a!i%`a!m%`a#O%`a#k%`a#l%`a#m%`a#n%`a#o%`a#p%`a#q%`a#r%`a#s%`a#u%`a#w%`a#y%`a#z%`a#}%`a([%`a(m%`a!Y%`a!Z%`a~Ok%`a}%`a!P%`a(t%`a~P&EsOk=VO})zO!P){O(u%PO~P&CoOk=VO})zO!P){O(t$}O~P&EsOR0`O}0`O!P0aO#P$dOPza[zakzaoza!iza!mza#Oza#kza#lza#mza#nza#oza#pza#qza#rza#sza#uza#wza#yza#zza#}za([za(mza(tza(uza!Yza!Zza~O})zO!P){OP$qaR$qa[$qak$qao$qa!i$qa!m$qa#O$qa#k$qa#l$qa#m$qa#n$qa#o$qa#p$qa#q$qa#r$qa#s$qa#u$qa#w$qa#y$qa#z$qa#}$qa([$qa(m$qa(t$qa(u$qa!Y$qa!Z$qa~O})zO!P){OP$saR$sa[$sak$sao$sa!i$sa!m$sa#O$sa#k$sa#l$sa#m$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#u$sa#w$sa#y$sa#z$sa#}$sa([$sa(m$sa(t$sa(u$sa!Y$sa!Z$sa~Ok=VO})zO!P){O(t$}O(u%PO~OP%RaR%Ra[%Rao%Ra!i%Ra!m%Ra#O%Ra#k%Ra#l%Ra#m%Ra#n%Ra#o%Ra#p%Ra#q%Ra#r%Ra#s%Ra#u%Ra#w%Ra#y%Ra#z%Ra#}%Ra([%Ra(m%Ra!Y%Ra!Z%Ra~P&NlO#}$lq!Y$lq!Z$lq~P#AbO#}$mq!Y$mq!Z$mq~P#AbO!Z9SO~O#}9TO~P!0kO!d#vO!Y'ai!h'ai~O!d#vO(m'mO!Y'ai!h'ai~O!Y/hO!h(zq~O!V'ci!Y'ci~P#.aO!Y/pO!V({q~Oo9[O!d#vO(m'mO~O!V9]O~P#.aO!V9]O~O!d#vO#s9bO~Og(Yy!Y(Yy~P!0kO!Y'ja!['ja~P#.aOa%Yq![%Yq'u%Yq!Y%Yq~P#.aO[9dO~O!Y0wO!Z)Tq~O#]9hO!Y'la!Z'la~O!Y5^O!Z)Qi~P#AbO!P4hO~O![1aO%f9lO~O(QTO(TUO(`9qO~O!Y1lO!Z)Rq~O!h9tO~O!h9uO~O!h9vO~O!h9vO~P%[O#]9yO!Y#ey!Z#ey~O!Y#ey!Z#ey~P#AbO%f:OO~P&2lO![']O%f:OO~O#}#{y!Y#{y!Z#{y~P#AbOP$ziR$zi[$zio$zi!i$zi!m$zi#O$zi#k$zi#l$zi#m$zi#n$zi#o$zi#p$zi#q$zi#r$zi#s$zi#u$zi#w$zi#y$zi#z$zi#}$zi([$zi(m$zi!Y$zi!Z$zi~P&NlO})zO!P){O(u%POP'eaR'ea['eak'eao'ea!i'ea!m'ea#O'ea#k'ea#l'ea#m'ea#n'ea#o'ea#p'ea#q'ea#r'ea#s'ea#u'ea#w'ea#y'ea#z'ea#}'ea(['ea(m'ea(t'ea!Y'ea!Z'ea~O})zO!P){OP'gaR'ga['gak'gao'ga!i'ga!m'ga#O'ga#k'ga#l'ga#m'ga#n'ga#o'ga#p'ga#q'ga#r'ga#s'ga#u'ga#w'ga#y'ga#z'ga#}'ga(['ga(m'ga(t'ga(u'ga!Y'ga!Z'ga~O(t$}OP%^iR%^i[%^ik%^io%^i}%^i!P%^i!i%^i!m%^i#O%^i#k%^i#l%^i#m%^i#n%^i#o%^i#p%^i#q%^i#r%^i#s%^i#u%^i#w%^i#y%^i#z%^i#}%^i([%^i(m%^i(u%^i!Y%^i!Z%^i~O(u%POP%`iR%`i[%`ik%`io%`i}%`i!P%`i!i%`i!m%`i#O%`i#k%`i#l%`i#m%`i#n%`i#o%`i#p%`i#q%`i#r%`i#s%`i#u%`i#w%`i#y%`i#z%`i#}%`i([%`i(m%`i(t%`i!Y%`i!Z%`i~O#}$my!Y$my!Z$my~P#AbO#}#`y!Y#`y!Z#`y~P#AbO!d#vO!Y'aq!h'aq~O!Y/hO!h(zy~O!V'cq!Y'cq~P#.aOo:YO!d#vO(m'mO~O!V:ZO~P#.aO!V:ZO~O!Y0wO!Z)Ty~O!Y5^O!Z)Qq~O![1aO%f:cO~O!h:fO~O%f:kO~P&2lOP$zqR$zq[$zqo$zq!i$zq!m$zq#O$zq#k$zq#l$zq#m$zq#n$zq#o$zq#p$zq#q$zq#r$zq#s$zq#u$zq#w$zq#y$zq#z$zq#}$zq([$zq(m$zq!Y$zq!Z$zq~P&NlO})zO!P){O(u%POP'faR'fa['fak'fao'fa!i'fa!m'fa#O'fa#k'fa#l'fa#m'fa#n'fa#o'fa#p'fa#q'fa#r'fa#s'fa#u'fa#w'fa#y'fa#z'fa#}'fa(['fa(m'fa(t'fa!Y'fa!Z'fa~O})zO!P){OP'haR'ha['hak'hao'ha!i'ha!m'ha#O'ha#k'ha#l'ha#m'ha#n'ha#o'ha#p'ha#q'ha#r'ha#s'ha#u'ha#w'ha#y'ha#z'ha#}'ha(['ha(m'ha(t'ha(u'ha!Y'ha!Z'ha~OP$|qR$|q[$|qo$|q!i$|q!m$|q#O$|q#k$|q#l$|q#m$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#u$|q#w$|q#y$|q#z$|q#}$|q([$|q(m$|q!Y$|q!Z$|q~P&NlOg%b!Z!Y%b!Z#]%b!Z#}%b!Z~P!0kOo:oO!d#vO(m'mO~O!V:pO~P#.aO!Y'lq!Z'lq~P#AbO!Y#e!Z!Z#e!Z~P#AbO#h%b!ZP%b!ZR%b!Z[%b!Za%b!Zo%b!Z!Y%b!Z!i%b!Z!m%b!Z#O%b!Z#k%b!Z#l%b!Z#m%b!Z#n%b!Z#o%b!Z#p%b!Z#q%b!Z#r%b!Z#s%b!Z#u%b!Z#w%b!Z#y%b!Z#z%b!Z'u%b!Z([%b!Z(m%b!Z!h%b!Z!V%b!Z's%b!Z#]%b!Zs%b!Z![%b!Z%f%b!Z!d%b!Z~P#.aOo:xO!d#vO(m'mO~OP%b!ZR%b!Z[%b!Zo%b!Z!i%b!Z!m%b!Z#O%b!Z#k%b!Z#l%b!Z#m%b!Z#n%b!Z#o%b!Z#p%b!Z#q%b!Z#r%b!Z#s%b!Z#u%b!Z#w%b!Z#y%b!Z#z%b!Z#}%b!Z([%b!Z(m%b!Z!Y%b!Z!Z%b!Z~P&NlOs(aX~P1qO}%pO~P!(oO(P!lO~P!(oO!VfX!YfX#]fX~P&+QOP]XR]X[]Xo]X}]X!P]X!Y]X!YfX!i]X!m]X#O]X#P]X#]]X#]fX#hfX#k]X#l]X#m]X#n]X#o]X#p]X#q]X#r]X#s]X#u]X#w]X#y]X#z]X$P]X([]X(m]X(t]X(u]X~O!dfX!h]X!hfX(mfX~P'BxOP;POQ;POSfOd<zOe!iOmkOo;POpkOqkOwkOy;PO{;PO!PWO!TkO!UkO![XO!f;SO!iZO!l;PO!m;PO!n;PO!p;TO!r;WO!u!hO$V!kO(O)XO(QTO(TUO([VO(j[O(y<xO~O!Y;dO!Z$oa~Oh%VOm%WOo%XOp$tOq$tOw%YOy%ZO{;oO!P${O![$|O!f=PO!i$xO#g;uO$V%_O$r;qO$t;sO$w%`O(O(rO(QTO(TUO([$uO(t$}O(u%PO~O#t)`O~P'GnOo!bX(m!bX~P# ZO!Z]X!ZfX~P'BxO!VfX!V$xX!YfX!Y$xX#]fX~P!/gO#h;XO~O!d#vO#h;XO~O#];iO~O#s;]O~O#];xO!Y(rX!Z(rX~O#];iO!Y(pX!Z(pX~O#h;yO~Og;{O~P!0kO#h<RO~O#h<SO~O!d#vO#h<TO~O!d#vO#h;yO~O#}<UO~P#AbO#h<VO~O#h<WO~O#h<]O~O#h<^O~O#h<_O~O#h<`O~O#}<aO~P!0kO#}<bO~P!0kO#P#Q#R#T#U#X#f#g#r(y$r$t$w%Z%e%f%g%n%p%s%t%v%x~'yT#l!U'w(P#mp#k#no}'x$['x(O$^(`~",
  goto: "$4Q)XPPPPPP)YPP)]P)nP+O/PPPPP5xPP6`PP<V?mP@QP@QPPP@QPBRP@QP@QP@QPBVPB[PByPGrPPPGvPPPPGvJxPPPKOKzPGvPGvPPNYGvPPPGvPGvP!!aGvP!%v!&{!'UP!'x!'|!'x!+YPPPPPPP!+y!&{PP!,Z!-gP!0jGvGv!0o!3z!8b!8b!<`PPP!<hGvPPPPPPPPPPP!?vP!ATPPGv!BfPGvPGvGvGvGvGvPGv!CxP!GRP!JWP!J[!Jf!Jj!JjP!GOP!Jn!JnP!MsP!MwGvGv!M}##RBV@QP@QP@Q@QP#$_@Q@Q#&j@Q#)Z@Q#+`@Q@Q#,O#.]#.]#.b#.k#.]#.wP#.]P@Q#/a@Q#3S@Q@Q5xPPP#6{PPP#7f#7fP#7fP#7|#7fPP#8SP#7yP#7y#8g#7y#9R#9X5u)]#9[)]P#9c#9c#9cP)]P)]P)]P)]PP)]P#9i#9lP#9l)]P#9pP#9sP)]P)]P)]P)]P)]P)])]PP#9y#:P#:[#:b#:h#:n#:t#;S#;Y#;d#;j#;t#;z#<[#<b#=S#=f#=l#=r#>Q#>g#@V#@e#@l#BR#Ba#C|#D[#Db#Dh#Dn#Dx#EO#EU#E`#Er#ExPPPPPPPPPP#FOPPPPPPP#Fs#Iz#KZ#Kb#KjPPP$!sP$!|$%t$,^$,a$,d$-P$-S$-Z$-cP$-i$-lP$.Y$.^$/U$0d$0i$1PPP$1U$1[$1`P$1c$1g$1k$2a$2x$3a$3e$3h$3k$3q$3t$3x$3|R!|RoqOXst!Z#d%k&o&q&r&t,k,p1|2PY!vQ']-]1a5eQ%rvQ%zyQ&R|Q&g!VS'T!e-TQ'c!iS'i!r!yU*e$|*V*jQ+i%{Q+v&TQ,[&aQ-Z'[Q-e'dQ-m'jQ0R*lQ1k,]R;v;T%QdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%k%r&P&h&k&o&q&r&t&x'Q'_'o(P(R(X(`(t(v(z)y+R+V,h,k,p-a-i-w-}.l.s/f0a0g0v1d1t1u1w1y1|2P2R2r2x3^5b5m5}6O6R6f8R8X8h8rS#q];Q!r)Z$Z$n'U)o,|-P.}2b3u5`6]9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{U*y%[;n;oQ+n%}Q,^&dQ,e&lQ0m+aQ0q+cQ0|+oQ1s,cQ3Q._Q5O0wQ5t1lQ6r3UQ7s5PR8x6t'OkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(v(z)o)y+R+V+a,h,k,p,|-P-a-i-w-}._.l.s.}/f0a0g0v1d1t1u1w1y1|2P2R2b2r2x3U3^3u5`5b5m5}6O6R6]6f6t8R8X8h8r9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{t!nQ!r!v!y!z'T'[']'i'j'k-T-Z-]-m1a5e5g$|$ti#v$b$c$d$x${%O%Q%]%^%b)u){)}*P*R*U*[*b*r*s+`+c+z+}.^.w/]/e/o/p/r0V0X0d1W1Z1c3T3}4Y4b4m4u4x5l6p7_7h8U8u9T9b9l:O:c:k;g;h;j;k;l;m;p;q;r;s;t;u;|;}<O<P<R<S<V<W<X<Y<Z<[<]<^<a<b<x=Q=R=U=VQ&U|Q'R!eU'X%g*V-WQ+n%}Q,^&dQ0c*|Q0|+oQ1R+uQ1r,bQ1s,cQ5O0wQ5X1TQ5t1lQ5w1nQ5x1qQ7s5PQ7v5UQ8a5zQ9g7wR9r8^rnOXst!V!Z#d%k&f&o&q&r&t,k,p1|2PR,`&h&x^OPXYstuvwz!Z!`!g!j!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(R(X(`(t(v(z)o)y+R+V+a,h,k,p,|-P-a-i-w-}._.l.s.}/f0a0g0v1d1t1u1w1y1|2P2R2b2r2x3U3^3u5`5b5m5}6O6R6]6f6t8R8X8h8r9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<z<{[#]WZ#W#Z'U(P!b%hm#h#i#l$x%c%f(Y(d(e(f*U*Y*]+T+U+W,g,}-{.R.S.T.V/e/h2U2|2}4Q6[6mQ%uxQ%yyS&O|&TQ&[!TQ'`!hQ'b!iQ(m#sS+h%z%{Q+l%}Q,V&_Q,Z&aS-d'c'dQ.a(nQ0u+iQ0{+oQ0}+pQ1Q+tQ1f,WS1j,[,]Q2n-eQ4}0wQ5R0zQ5W1SQ5s1kQ7r5PQ7u5TQ9c7qR:^9d!O$zi$d%O%Q%]%^%b)}*P*[*r*s.w/o0V0X0d3}4m9T<x=Q=R!S%wy!i!u%y%z%{'S'b'c'd'h'r*d+h+i-Q-d-e-l/y0u2g2n2u4dQ+b%uQ+{&XQ,O&YQ,Y&aQ.`(mQ1e,VU1i,Z,[,]Q3V.aQ5n1fS5r1j1kQ8]5s#^<|#v$b$c$x${)u){*R*U*b+`+c+z+}.^/]/e/p/r1W1Z1c3T4Y4b4u4x5l6p7_7h8U8u9b9l:O:c:k;j;l;p;r;t;|<O<R<V<X<Z<]<a=U=Vo<};g;h;k;m;q;s;u;}<P<S<W<Y<[<^<bW%Ti%V*t<xS&X!Q&fQ&Y!RQ&Z!SR+y&V$}%Si#v$b$c$d$x${%O%Q%]%^%b)u){)}*P*R*U*[*b*r*s+`+c+z+}.^.w/]/e/o/p/r0V0X0d1W1Z1c3T3}4Y4b4m4u4x5l6p7_7h8U8u9T9b9l:O:c:k;g;h;j;k;l;m;p;q;r;s;t;u;|;}<O<P<R<S<V<W<X<Y<Z<[<]<^<a<b<x=Q=R=U=VT)v$u)wV*y%[;n;oW'X!e%g*V-WS(y#y#zQ+]%pQ+s&QS.Y(i(jQ1[,PQ4n0`R7{5^'OkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(v(z)o)y+R+V+a,h,k,p,|-P-a-i-w-}._.l.s.}/f0a0g0v1d1t1u1w1y1|2P2R2b2r2x3U3^3u5`5b5m5}6O6R6]6f6t8R8X8h8r9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{$i$^c#Y#e%o%q%s(O(U(p(u(})O)P)Q)R)S)T)U)V)W)Y)[)^)c)m+^+r-R-p-u-z-|.k.n.r.t.u.v/X0e2]2`2p2w3]3b3c3d3e3f3g3h3i3j3k3l3m3n3q3r3y4r4{6_6e6j6y6z7T7U7}8l8p8z9Q9R9{:`:g;R<oT#TV#U'PkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(v(z)o)y+R+V+a,h,k,p,|-P-a-i-w-}._.l.s.}/f0a0g0v1d1t1u1w1y1|2P2R2b2r2x3U3^3u5`5b5m5}6O6R6]6f6t8R8X8h8r9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{Q'V!eR2c-Tv!nQ!e!r!v!y!z'T'[']'i'j'k-T-Z-]-m1a5e5gU*d$|*V*jS/y*e*lQ0S*mQ1^,RQ4d0RR4g0UnqOXst!Z#d%k&o&q&r&t,k,p1|2PQ&v!^Q's!xS(o#u;XQ+f%xQ,T&[Q,U&^Q-b'aQ-o'lS.j(t;yS0f+R<TQ0s+gQ1`,SQ2T,rQ2V,sQ2_-OQ2l-cQ2o-gS4s0g<_Q4y0tS4|0v<`Q6^2aQ6b2mQ6g2tQ7p4zQ8m6`Q8n6cQ8q6hR9x8j$d$]c#Y#e%q%s(O(U(p(u(})O)P)Q)R)S)T)U)V)W)Y)[)^)c)m+^+r-R-p-u-z-|.k.n.r.u.v/X0e2]2`2p2w3]3b3c3d3e3f3g3h3i3j3k3l3m3n3q3r3y4r4{6_6e6j6y6z7T7U7}8l8p8z9Q9R9{:`:g;R<oS(k#p'fQ({#zS+[%o.tS.Z(j(lR3O.['OkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(v(z)o)y+R+V+a,h,k,p,|-P-a-i-w-}._.l.s.}/f0a0g0v1d1t1u1w1y1|2P2R2b2r2x3U3^3u5`5b5m5}6O6R6]6f6t8R8X8h8r9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{S#q];QQ&q!XQ&r!YQ&t![Q&u!]R1{,nQ'^!hQ+_%uQ-`'`S.](m+bQ2j-_W3S.`.a0l0nQ6a2kW6n3P3R3V4wU8t6o6q6sU9}8v8w8yS:i9|:PQ:t:jR:z:uU!wQ']-]T5c1a5e!Q_OXZ`st!V!Z#d#h%c%k&f&h&o&q&r&t(f,k,p.S1|2P]!pQ!r']-]1a5eT#q];Q%[{OPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(P(R(X(`(t(v(z)y+R+V+a,h,k,p-a-i-w-}._.l.s/f0a0g0v1d1t1u1w1y1|2P2R2r2x3U3^5b5m5}6O6R6f6t8R8X8h8rS(y#y#zS.Y(i(j!s<f$Z$n'U)o,|-P.}2b3u5`6]9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{U$fd)Z,eS(l#p'fU*q%R(s3pU0b*x.f7PQ4w0mQ6o3QQ8w6rR:P8xm!tQ!r!v!y!z']'i'j'k-]-m1a5e5gQ'q!uS(b#g1vS-k'h'tQ/k*XQ/w*dQ2v-nQ4U/lS4_/x0SQ7Z4PS7f4e4gQ9V7[Q9Z7cQ9`7iS:X9[9]S:n:Y:ZS:w:o:pR:}:xQ#wbQ'p!uS(a#g1vS(c#m+QQ+S%dQ+d%vQ+j%|U-j'h'q'tQ.O(bQ/j*XQ/v*dQ/|*gQ0r+eQ1g,XS2s-k-nQ2{.WS4T/k/lS4^/w0SQ4a/{Q4c/}Q5p1hQ6i2vQ7Y4PQ7^4US7b4_4gQ7g4fQ8Z5qS9U7Z7[Q9Y7cQ9^7fQ9a7jQ9o8[Q:V9VS:W9Z9]Q:[9`Q:e9pS:m:X:ZS:v:n:pQ:|:wQ;O:}Q<i<dQ<t<mR<u<nV!wQ']-]%[aOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(P(R(X(`(t(v(z)y+R+V+a,h,k,p-a-i-w-}._.l.s/f0a0g0v1d1t1u1w1y1|2P2R2r2x3U3^5b5m5}6O6R6f6t8R8X8h8rS#wz!j!r<c$Z$n'U)o,|-P.}2b3u5`6]9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{R<i<z%[bOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(P(R(X(`(t(v(z)y+R+V+a,h,k,p-a-i-w-}._.l.s/f0a0g0v1d1t1u1w1y1|2P2R2r2x3U3^5b5m5}6O6R6f6t8R8X8h8rQ%dj!S%vy!i!u%y%z%{'S'b'c'd'h'r*d+h+i-Q-d-e-l/y0u2g2n2u4dS%|z!jQ+e%wQ,X&aW1h,Y,Z,[,]U5q1i1j1kS8[5r5sQ9p8]!r<d$Z$n'U)o,|-P.}2b3u5`6]9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{Q<m<yR<n<z%OeOPXYstuvw!Z!`!g!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%k%r&P&h&k&o&q&r&t&x'Q'_'o(R(X(`(t(v(z)y+R+V+a,h,k,p-a-i-w-}._.l.s/f0a0g0v1d1t1u1w1y1|2P2R2r2x3U3^5b5m5}6O6R6f6t8R8X8h8rY#bWZ#W#Z(P!b%hm#h#i#l$x%c%f(Y(d(e(f*U*Y*]+T+U+W,g,}-{.R.S.T.V/e/h2U2|2}4Q6[6mQ,f&l!p<e$Z$n)o,|-P.}2b3u5`6]9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{R<h'UU'Y!e%g*VR2e-W%QdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%k%r&P&h&k&o&q&r&t&x'Q'_'o(P(R(X(`(t(v(z)y+R+V,h,k,p-a-i-w-}.l.s/f0a0g0v1d1t1u1w1y1|2P2R2r2x3^5b5m5}6O6R6f8R8X8h8r!r)Z$Z$n'U)o,|-P.}2b3u5`6]9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{Q,e&lQ0m+aQ3Q._Q6r3UR8x6t!b$Tc#Y%o(O(U(p(u)V)W)[)c+r-p-u-z-|.k.n/X0e2p2w3]3m4r4{6e6j6y8p9{;R!P;_)Y)m-R.t2]2`3b3k3l3q3y6_6z7T7U7}8l8z9Q9R:`:g<o!f$Vc#Y%o(O(U(p(u)S)T)V)W)[)c+r-p-u-z-|.k.n/X0e2p2w3]3m4r4{6e6j6y8p9{;R!T;a)Y)m-R.t2]2`3b3h3i3k3l3q3y6_6z7T7U7}8l8z9Q9R:`:g<o!^$Zc#Y%o(O(U(p(u)[)c+r-p-u-z-|.k.n/X0e2p2w3]3m4r4{6e6j6y8p9{;RQ3}/cz<{)Y)m-R.t2]2`3b3q3y6_6z7T7U7}8l8z9Q9R:`:g<oQ=Q=SR=R=T'OkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(v(z)o)y+R+V+a,h,k,p,|-P-a-i-w-}._.l.s.}/f0a0g0v1d1t1u1w1y1|2P2R2b2r2x3U3^3u5`5b5m5}6O6R6]6f6t8R8X8h8r9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{S$oh$pR3v.|'VgOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(v(z)o)y+R+V+a,h,k,p,|-P-a-i-w-}._.l.s.|.}/f0a0g0v1d1t1u1w1y1|2P2R2b2r2x3U3^3u5`5b5m5}6O6R6]6f6t8R8X8h8r9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{T$kf$qQ$ifS)f$l)jR)r$qT$jf$qT)h$l)j'VhOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%k%r&P&h&k&l&o&q&r&t&x'Q'U'_'o(P(R(X(`(t(v(z)o)y+R+V+a,h,k,p,|-P-a-i-w-}._.l.s.|.}/f0a0g0v1d1t1u1w1y1|2P2R2b2r2x3U3^3u5`5b5m5}6O6R6]6f6t8R8X8h8r9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{T$oh$pQ$rhR)q$p%[jOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%k%r&P&h&k&l&o&q&r&t&x'Q'_'o(P(R(X(`(t(v(z)y+R+V+a,h,k,p-a-i-w-}._.l.s/f0a0g0v1d1t1u1w1y1|2P2R2r2x3U3^5b5m5}6O6R6f6t8R8X8h8r!s<y$Z$n'U)o,|-P.}2b3u5`6]9h9y;P;S;T;W;X;Y;Z;[;];^;_;`;a;b;c;d;f;i;v;x;y;{<T<U<_<`<{#elOPXZst!Z!`!o#S#d#o#{$n%k&h&k&l&o&q&r&t&x'Q'_(z)o+V+a,h,k,p-a._.}/f0a1d1t1u1w1y1|2P2R3U3u5b5m5}6O6R6t8R8X8h!O%Ri$d%O%Q%]%^%b)}*P*[*r*s.w/o0V0X0d3}4m9T<x=Q=R#^(s#v$b$c$x${)u){*R*U*b+`+c+z+}.^/]/e/p/r1W1Z1c3T4Y4b4u4x5l6p7_7h8U8u9b9l:O:c:k;j;l;p;r;t;|<O<R<V<X<Z<]<a=U=VQ*}%`Q/Y)zo3p;g;h;k;m;q;s;u;}<P<S<W<Y<[<^<b!O$yi$d%O%Q%]%^%b)}*P*[*r*s.w/o0V0X0d3}4m9T<x=Q=RQ*^$zU*g$|*V*jQ+O%aQ/}*h#^<k#v$b$c$x${)u){*R*U*b+`+c+z+}.^/]/e/p/r1W1Z1c3T4Y4b4u4x5l6p7_7h8U8u9b9l:O:c:k;j;l;p;r;t;|<O<R<V<X<Z<]<a=U=Vn<l;g;h;k;m;q;s;u;}<P<S<W<Y<[<^<bQ<p<|Q<q<}Q<r=OR<s=P!O%Ri$d%O%Q%]%^%b)}*P*[*r*s.w/o0V0X0d3}4m9T<x=Q=R#^(s#v$b$c$x${)u){*R*U*b+`+c+z+}.^/]/e/p/r1W1Z1c3T4Y4b4u4x5l6p7_7h8U8u9b9l:O:c:k;j;l;p;r;t;|<O<R<V<X<Z<]<a=U=Vo3p;g;h;k;m;q;s;u;}<P<S<W<Y<[<^<bnoOXst!Z#d%k&o&q&r&t,k,p1|2PS*a${*UQ,y&{Q,z&}R4X/p$|%Si#v$b$c$d$x${%O%Q%]%^%b)u){)}*P*R*U*[*b*r*s+`+c+z+}.^.w/]/e/o/p/r0V0X0d1W1Z1c3T3}4Y4b4m4u4x5l6p7_7h8U8u9T9b9l:O:c:k;g;h;j;k;l;m;p;q;r;s;t;u;|;}<O<P<R<S<V<W<X<Y<Z<[<]<^<a<b<x=Q=R=U=VQ+|&YQ1Y,OQ5[1XR7z5]V*i$|*V*jU*i$|*V*jT5d1a5eU/{*f/f5bS4f0T8RR7j4hQ+d%vQ/|*gQ0r+eQ1g,XQ5p1hQ8Z5qQ9o8[R:e9p!O%Oi$d%O%Q%]%^%b)}*P*[*r*s.w/o0V0X0d3}4m9T<x=Q=Rr)}$v)a*O*p+P/n0Z0[3s4V4q7X7k:U<j<v<wS0V*o0W#^;j#v$b$c$x${)u){*R*U*b+`+c+z+}.^/]/e/p/r1W1Z1c3T4Y4b4u4x5l6p7_7h8U8u9b9l:O:c:k;j;l;p;r;t;|<O<R<V<X<Z<]<a=U=Vn;k;g;h;k;m;q;s;u;}<P<S<W<Y<[<^<b!`;|(q)_*W*`.b.e.i/U/Z/c/s0k1V1X3Y4W4[5Z5]6u6x7`7d7m7o9X9_:]:l=S=T`;}3o6{7O7S8{:Q:T:{S<X.d3ZT<Y6}9O!O%Qi$d%O%Q%]%^%b)}*P*[*r*s.w/o0V0X0d3}4m9T<x=Q=Rv*P$v)a*Q*o+P/_/n0Z0[3s4V4i4q7X7k:U<j<v<wS0X*p0Y#^;l#v$b$c$x${)u){*R*U*b+`+c+z+}.^/]/e/p/r1W1Z1c3T4Y4b4u4x5l6p7_7h8U8u9b9l:O:c:k;j;l;p;r;t;|<O<R<V<X<Z<]<a=U=Vn;m;g;h;k;m;q;s;u;}<P<S<W<Y<[<^<b!d<O(q)_*W*`.c.d.i/U/Z/c/s0k1V1X3W3Y4W4[5Z5]6u6v6x7`7d7m7o9X9_:]:l=S=Td<P3o6|6}7S8{8|:Q:R:T:{S<Z.e3[T<[7O9PrnOXst!V!Z#d%k&f&o&q&r&t,k,p1|2PQ&c!UR,h&lrnOXst!V!Z#d%k&f&o&q&r&t,k,p1|2PR&c!UQ,Q&ZR1U+ysnOXst!V!Z#d%k&f&o&q&r&t,k,p1|2PQ1b,VS5k1e1fU8T5i5j5nS9k8V8WS:a9j9mQ:q:bR:y:rQ&j!VR,a&fR5w1nS&O|&TR0}+pQ&o!WR,k&pR,q&uT1},p2PR,u&vQ,t&vR2W,uQ'v!{R-q'vSsOtQ#dXT%ns#dQ#OTR'x#OQ#RUR'z#RQ)w$uR/V)wQ#UVR'|#UQ#XWU(S#X(T-xQ(T#YR-x(UQ-U'VR2d-UQ.m(uS3_.m3`R3`.nQ-]']R2h-]Y!rQ']-]1a5eR'g!rQ.x)aR3t.xU#_W%f*UU(Z#_([-yQ([#`R-y(VQ-X'YR2f-Xt`OXst!V!Z#d%k&f&h&o&q&r&t,k,p1|2PS#hZ%cU#r`#h.SR.S(fQ(g#jQ.P(cW.X(g.P2y6kQ2y.QR6k2zQ)j$lR/O)jQ$phR)p$pQ$`cU)]$`-t;eQ-t;RR;e)mQ/i*XW4R/i4S7]9WU4S/j/k/lS7]4T4UR9W7^$Z)|$v(q)_)a*W*`*o*p*z*{+P.d.e.g.h.i/U/Z/_/a/c/n/s0Z0[0k1V1X3W3X3Y3o3s4V4W4[4i4k4q5Z5]6u6v6w6x6}7O7Q7R7S7X7`7d7k7m7o8{8|8}9X9_:Q:R:S:T:U:]:l:{<j<v<w=S=TQ/q*`U4Z/q4]7aQ4]/sR7a4[S*j$|*VR0P*jr*O$v)a*o*p+P/n0Z0[3s4V4q7X7k:U<j<v<w!`.b(q)_*W*`.d.e.i/U/Z/c/s0k1V1X3Y4W4[5Z5]6u6x7`7d7m7o9X9_:]:l=S=TU/`*O.b6{a6{3o6}7O7S8{:Q:T:{Q0W*oQ3Z.dU4j0W3Z9OR9O6}v*Q$v)a*o*p+P/_/n0Z0[3s4V4i4q7X7k:U<j<v<w!d.c(q)_*W*`.d.e.i/U/Z/c/s0k1V1X3W3Y4W4[5Z5]6u6v6x7`7d7m7o9X9_:]:l=S=TU/b*Q.c6|e6|3o6}7O7S8{8|:Q:R:T:{Q0Y*pQ3[.eU4l0Y3[9PR9P7OQ*u%UR0^*uQ4v0kR7n4vQ+X%iR0j+XQ5_1[S7|5_9iR9i7}Q,S&[R1_,SQ5e1aR8P5eQ1m,^S5u1m8_R8_5wQ0x+lW5Q0x5S7t9eQ5S0{Q7t5RR9e7uQ+q&OR1O+qQ2P,pR6V2PYrOXst#dQ&s!ZQ+Z%kQ,j&oQ,l&qQ,m&rQ,o&tQ1z,kS1},p2PR6U1|Q%mpQ&w!_Q&z!aQ&|!bQ'O!cQ'n!uQ+Y%jQ+f%xQ+x&UQ,`&jQ,w&yW-h'h'p'q'tQ-o'lQ0O*iQ0s+gS1p,a,dQ2X,vQ2Y,yQ2Z,zQ2o-gW2q-j-k-n-pQ4y0tQ5V1RQ5Y1VQ5o1gQ5y1rQ6T1{U6d2p2s2vQ6g2tQ7p4zQ7x5XQ7y5ZQ8O5dQ8Y5pQ8`5xS8o6e6iQ8q6hQ9f7vQ9n8ZQ9s8aQ9z8pQ:_9gQ:d9oQ:h9{R:s:eQ%xyQ'a!iQ'l!uU+g%y%z%{Q-O'SU-c'b'c'dS-g'h'rQ/u*dS0t+h+iQ2a-QS2m-d-eQ2t-lQ4`/yQ4z0uQ6`2gQ6c2nQ6h2uR7e4dS$wi<xR*v%VU%Ui%V<xR0]*tQ$viS(q#v+cS)_$b$cQ)a$dQ*W$xS*`${*UQ*o%OQ*p%QQ*z%]Q*{%^Q+P%bQ.d;jQ.e;lQ.g;pQ.h;rQ.i;tQ/U)uS/Z){/]Q/_)}Q/a*PQ/c*RQ/n*[S/s*b/eQ0Z*rQ0[*sh0k+`.^1c3T5l6p8U8u9l:O:c:kQ1V+zQ1X+}Q3W;|Q3X<OQ3Y<RS3o;g;hQ3s.wQ4V/oQ4W/pQ4[/rQ4i0VQ4k0XQ4q0dQ5Z1WQ5]1ZQ6u<VQ6v<XQ6w<ZQ6x<]Q6};kQ7O;mQ7Q;qQ7R;sQ7S;uQ7X3}Q7`4YQ7d4bQ7k4mQ7m4uQ7o4xQ8{<SQ8|;}Q8}<PQ9X7_Q9_7hQ:Q<WQ:R<YQ:S<[Q:T<^Q:U9TQ:]9bQ:l<aQ:{<bQ<j<xQ<v=QQ<w=RQ=S=UR=T=VQ*x%[Q.f;nR7P;onpOXst!Z#d%k&o&q&r&t,k,p1|2PQ!fPS#fZ#oQ&y!`U'e!o5b8RQ'{#SQ(|#{Q)n$nS,d&h&kQ,i&lQ,v&xQ,{'QQ-_'_Q.p(zQ/S)oS0h+V/fQ0n+aQ1x,hQ2k-aQ3R._Q3x.}Q4o0aQ5j1dQ5{1tQ5|1uQ6Q1wQ6S1yQ6X2RQ6s3UQ7V3uQ8W5mQ8d5}Q8e6OQ8g6RQ8y6tQ9m8XR9w8h#YcOPXZst!Z!`!o#d#o#{%k&h&k&l&o&q&r&t&x'Q'_(z+V+a,h,k,p-a._/f0a1d1t1u1w1y1|2P2R3U5b5m5}6O6R6t8R8X8hQ#YWQ#eYQ%ouQ%qvS%sw!gS(O#W(RQ(U#ZQ(p#uQ(u#xQ(}$OQ)O$PQ)P$QQ)Q$RQ)R$SQ)S$TQ)T$UQ)U$VQ)V$WQ)W$XQ)Y$ZQ)[$_Q)^$aQ)c$eW)m$n)o.}3uQ+^%rQ+r&PS-R'U2bQ-p'oS-u(P-wQ-z(XQ-|(`Q.k(tQ.n(vQ.r;PQ.t;SQ.u;TQ.v;WQ/X)yQ0e+RQ2],|Q2`-PQ2p-iQ2w-}Q3].lQ3b;XQ3c;YQ3d;ZQ3e;[Q3f;]Q3g;^Q3h;_Q3i;`Q3j;aQ3k;bQ3l;cQ3m.sQ3n;fQ3q;iQ3r;vQ3y;dQ4r0gQ4{0vQ6_;xQ6e2rQ6j2xQ6y3^Q6z;yQ7T;{Q7U<TQ7}5`Q8l6]Q8p6fQ8z<UQ9Q<_Q9R<`Q9{8rQ:`9hQ:g9yQ;R#SR<o<{R#[WR'W!el!tQ!r!v!y!z']'i'j'k-]-m1a5e5gS'S!e-TS-Q'T'[R2g-ZR(w#xQ!fQT-[']-]]!qQ!r']-]1a5eQ#p]R'f;QR)b$dY!uQ']-]1a5eQ'h!rS'r!v!yS't!z5gS-l'i'jQ-n'kR2u-mT#kZ%cS#jZ%cS%im,gU(c#h#i#lS.Q(d(eQ.U(fQ0i+WQ2z.RU2{.S.T.VS6l2|2}R8s6md#^W#W#Z%f(P(Y*U+T-{/er#gZm#h#i#l%c(d(e(f+W.R.S.T.V2|2}6mS*X$x*]Q/l*YQ1v,gQ2^,}Q4P/hQ6Z2UQ7[4QQ8k6[T<g'U+UV#aW%f*UU#`W%f*US(Q#W(YU(V#Z+T/eS-S'U+UT-v(P-{V'Z!e%g*VQ$lfR)t$qT)i$l)jR3w.|T*Z$x*]T*c${*UQ0l+`Q3P.^Q5i1cQ6q3TQ8V5lQ8v6pQ9j8UQ9|8uQ:b9lQ:j:OQ:r:cR:u:knqOXst!Z#d%k&o&q&r&t,k,p1|2PQ&i!VR,`&ftmOXst!U!V!Z#d%k&f&o&q&r&t,k,p1|2PR,g&lT%jm,gR1],PR,_&dQ&S|R+w&TR+m%}T&m!W&pT&n!W&pT2O,p2P",
  nodeNames: "⚠ ArithOp ArithOp ?. JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewTarget new NewExpression ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression TypeArgList CompareOp < declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies in const CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression InstantiationExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast ArrowFunction TypeParamList SequenceExpression InstantiationExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
  maxTerm: 376,
  context: HC,
  nodeProps: [
    ["isolate", -8, 5, 6, 14, 34, 36, 48, 50, 52, ""],
    ["group", -26, 9, 17, 19, 65, 204, 208, 212, 213, 215, 218, 221, 231, 233, 239, 241, 243, 245, 248, 254, 260, 262, 264, 266, 268, 270, 271, "Statement", -34, 13, 14, 29, 32, 33, 39, 48, 51, 52, 54, 59, 67, 69, 73, 77, 79, 81, 82, 107, 108, 117, 118, 135, 138, 140, 141, 142, 143, 144, 146, 147, 166, 167, 169, "Expression", -23, 28, 30, 34, 38, 40, 42, 171, 173, 175, 176, 178, 179, 180, 182, 183, 184, 186, 187, 188, 198, 200, 202, 203, "Type", -3, 85, 100, 106, "ClassItem"],
    ["openedBy", 23, "<", 35, "InterpolationStart", 53, "[", 57, "{", 70, "(", 159, "JSXStartCloseTag"],
    ["closedBy", 24, ">", 37, "InterpolationEnd", 47, "]", 58, "}", 71, ")", 164, "JSXEndTag"]
  ],
  propSources: [iW],
  skippedNodes: [0, 5, 6, 274],
  repeatNodeCount: 37,
  tokenData: "$Fq07[R!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#:O!R![#<_![!]#I_!]!^#Jk!^!_#Ku!_!`$![!`!a$$v!a!b$*T!b!c$,r!c!}Er!}#O$-|#O#P$/W#P#Q$4o#Q#R$5y#R#SEr#S#T$7W#T#o$8b#o#p$<r#p#q$=h#q#r$>x#r#s$@U#s$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$I|Er$I|$I}$Dk$I}$JO$Dk$JO$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr(n%d_$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$h&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$h&j(U!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU(U!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$h&j(RpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(RpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Rp(U!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z07[+rq$h&j(Rp(U!b'w0/lOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z07[.ST(S#S$h&j'x0/lO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c07[.n_$h&j(Rp(U!b'x0/lOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)3p/x`$h&j!m),Q(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW1V`#u(Ch$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW2d_#u(Ch$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At3l_(Q':f$h&j(U!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$h&j(U!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$h&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$c`$h&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$c``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$c`$h&j(U!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ(U!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$c`(U!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k%9[:hh$h&j(Rp(U!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__WS$h&j(Rp(U!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]WS$h&j(U!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXWS$h&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSWSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWWS(U!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]WS$h&j(RpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWWS(RpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYWS(Rp(U!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S%9[C}i$h&j(j%1l(Rp(U!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr%9[EoP;=`<%lCr07[FRk$h&j(Rp(U!b$[#t(O,2j(`$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$h&j(Rp(U!b$[#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv07[JPP;=`<%lEr(KWJ_`$h&j(Rp(U!b#m(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWKl_$h&j$P(Ch(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,#xLva(u+JY$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWNW`$h&j#y(Ch(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At! c_(T';W$h&j(RpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$h&j(RpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$h&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$c`$h&j(RpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(RpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$c`(RpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b/5|!'t_!i/.^$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&U!)O_!h!Lf$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z-!n!*[b$h&j(Rp(U!b(P%&f#n(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW!+o`$h&j(Rp(U!b#k(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;x!,|`$h&j(Rp(U!bo+4YOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,$U!.Z_!Y+Jf$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!/ec$h&j(Rp(U!b}.2^OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!0ya$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!2Z_!X!L^$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!3eg$h&j(Rp(U!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!5Vg$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!6wc$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!8_c$h&j(Rp(U!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!9uf$h&j(Rp(U!b#l(ChOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcxz!;Zz{#-}{!P!;Z!P!Q#/d!Q!^!;Z!^!_#(i!_!`#7S!`!a#8i!a!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z?O!;fb$h&j(Rp(U!b!U7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z>^!<w`$h&j(U!b!U7`OY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eq!Q!^!<n!^!_!Gr!_!}!<n!}#O!KS#O#P!Dy#P#o!<n#o#p!Gr#p;'S!<n;'S;=`!L]<%lO!<n<z!>Q^$h&j!U7`OY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@c!_!}!=y!}#O!CW#O#P!Dy#P#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!?Td$h&j!U7`O!^&c!_#W&c#W#X!>|#X#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#k!>|#k#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&c7`!@hX!U7`OY!@cZ!P!@c!P!Q!AT!Q!}!@c!}#O!Ar#O#P!Bq#P;'S!@c;'S;=`!CQ<%lO!@c7`!AYW!U7`#W#X!AT#Z#[!AT#]#^!AT#a#b!AT#g#h!AT#i#j!AT#j#k!AT#m#n!AT7`!AuVOY!ArZ#O!Ar#O#P!B[#P#Q!@c#Q;'S!Ar;'S;=`!Bk<%lO!Ar7`!B_SOY!ArZ;'S!Ar;'S;=`!Bk<%lO!Ar7`!BnP;=`<%l!Ar7`!BtSOY!@cZ;'S!@c;'S;=`!CQ<%lO!@c7`!CTP;=`<%l!@c<z!C][$h&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#O!CW#O#P!DR#P#Q!=y#Q#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DWX$h&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DvP;=`<%l!CW<z!EOX$h&jOY!=yYZ&cZ!^!=y!^!_!@c!_#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!EnP;=`<%l!=y>^!Ezl$h&j(U!b!U7`OY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#W&}#W#X!Eq#X#Z&}#Z#[!Eq#[#]&}#]#^!Eq#^#a&}#a#b!Eq#b#g&}#g#h!Eq#h#i&}#i#j!Eq#j#k!Eq#k#m&}#m#n!Eq#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}8r!GyZ(U!b!U7`OY!GrZw!Grwx!@cx!P!Gr!P!Q!Hl!Q!}!Gr!}#O!JU#O#P!Bq#P;'S!Gr;'S;=`!J|<%lO!Gr8r!Hse(U!b!U7`OY'}Zw'}x#O'}#P#W'}#W#X!Hl#X#Z'}#Z#[!Hl#[#]'}#]#^!Hl#^#a'}#a#b!Hl#b#g'}#g#h!Hl#h#i'}#i#j!Hl#j#k!Hl#k#m'}#m#n!Hl#n;'S'};'S;=`(f<%lO'}8r!JZX(U!bOY!JUZw!JUwx!Arx#O!JU#O#P!B[#P#Q!Gr#Q;'S!JU;'S;=`!Jv<%lO!JU8r!JyP;=`<%l!JU8r!KPP;=`<%l!Gr>^!KZ^$h&j(U!bOY!KSYZ&cZw!KSwx!CWx!^!KS!^!_!JU!_#O!KS#O#P!DR#P#Q!<n#Q#o!KS#o#p!JU#p;'S!KS;'S;=`!LV<%lO!KS>^!LYP;=`<%l!KS>^!L`P;=`<%l!<n=l!Ll`$h&j(Rp!U7`OY!LcYZ&cZr!Lcrs!=ys!P!Lc!P!Q!Mn!Q!^!Lc!^!_# o!_!}!Lc!}#O#%P#O#P!Dy#P#o!Lc#o#p# o#p;'S!Lc;'S;=`#&Y<%lO!Lc=l!Mwl$h&j(Rp!U7`OY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#W(r#W#X!Mn#X#Z(r#Z#[!Mn#[#](r#]#^!Mn#^#a(r#a#b!Mn#b#g(r#g#h!Mn#h#i(r#i#j!Mn#j#k!Mn#k#m(r#m#n!Mn#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r8Q# vZ(Rp!U7`OY# oZr# ors!@cs!P# o!P!Q#!i!Q!}# o!}#O#$R#O#P!Bq#P;'S# o;'S;=`#$y<%lO# o8Q#!pe(Rp!U7`OY)rZr)rs#O)r#P#W)r#W#X#!i#X#Z)r#Z#[#!i#[#])r#]#^#!i#^#a)r#a#b#!i#b#g)r#g#h#!i#h#i)r#i#j#!i#j#k#!i#k#m)r#m#n#!i#n;'S)r;'S;=`*Z<%lO)r8Q#$WX(RpOY#$RZr#$Rrs!Ars#O#$R#O#P!B[#P#Q# o#Q;'S#$R;'S;=`#$s<%lO#$R8Q#$vP;=`<%l#$R8Q#$|P;=`<%l# o=l#%W^$h&j(RpOY#%PYZ&cZr#%Prs!CWs!^#%P!^!_#$R!_#O#%P#O#P!DR#P#Q!Lc#Q#o#%P#o#p#$R#p;'S#%P;'S;=`#&S<%lO#%P=l#&VP;=`<%l#%P=l#&]P;=`<%l!Lc?O#&kn$h&j(Rp(U!b!U7`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#W%Z#W#X#&`#X#Z%Z#Z#[#&`#[#]%Z#]#^#&`#^#a%Z#a#b#&`#b#g%Z#g#h#&`#h#i%Z#i#j#&`#j#k#&`#k#m%Z#m#n#&`#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z9d#(r](Rp(U!b!U7`OY#(iZr#(irs!Grsw#(iwx# ox!P#(i!P!Q#)k!Q!}#(i!}#O#+`#O#P!Bq#P;'S#(i;'S;=`#,`<%lO#(i9d#)th(Rp(U!b!U7`OY*gZr*grs'}sw*gwx)rx#O*g#P#W*g#W#X#)k#X#Z*g#Z#[#)k#[#]*g#]#^#)k#^#a*g#a#b#)k#b#g*g#g#h#)k#h#i*g#i#j#)k#j#k#)k#k#m*g#m#n#)k#n;'S*g;'S;=`+Z<%lO*g9d#+gZ(Rp(U!bOY#+`Zr#+`rs!JUsw#+`wx#$Rx#O#+`#O#P!B[#P#Q#(i#Q;'S#+`;'S;=`#,Y<%lO#+`9d#,]P;=`<%l#+`9d#,cP;=`<%l#(i?O#,o`$h&j(Rp(U!bOY#,fYZ&cZr#,frs!KSsw#,fwx#%Px!^#,f!^!_#+`!_#O#,f#O#P!DR#P#Q!;Z#Q#o#,f#o#p#+`#p;'S#,f;'S;=`#-q<%lO#,f?O#-tP;=`<%l#,f?O#-zP;=`<%l!;Z07[#.[b$h&j(Rp(U!b'y0/l!U7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z07[#/o_$h&j(Rp(U!bT0/lOY#/dYZ&cZr#/drs#0nsw#/dwx#4Ox!^#/d!^!_#5}!_#O#/d#O#P#1p#P#o#/d#o#p#5}#p;'S#/d;'S;=`#6|<%lO#/d06j#0w]$h&j(U!bT0/lOY#0nYZ&cZw#0nwx#1px!^#0n!^!_#3R!_#O#0n#O#P#1p#P#o#0n#o#p#3R#p;'S#0n;'S;=`#3x<%lO#0n05W#1wX$h&jT0/lOY#1pYZ&cZ!^#1p!^!_#2d!_#o#1p#o#p#2d#p;'S#1p;'S;=`#2{<%lO#1p0/l#2iST0/lOY#2dZ;'S#2d;'S;=`#2u<%lO#2d0/l#2xP;=`<%l#2d05W#3OP;=`<%l#1p01O#3YW(U!bT0/lOY#3RZw#3Rwx#2dx#O#3R#O#P#2d#P;'S#3R;'S;=`#3r<%lO#3R01O#3uP;=`<%l#3R06j#3{P;=`<%l#0n05x#4X]$h&j(RpT0/lOY#4OYZ&cZr#4Ors#1ps!^#4O!^!_#5Q!_#O#4O#O#P#1p#P#o#4O#o#p#5Q#p;'S#4O;'S;=`#5w<%lO#4O00^#5XW(RpT0/lOY#5QZr#5Qrs#2ds#O#5Q#O#P#2d#P;'S#5Q;'S;=`#5q<%lO#5Q00^#5tP;=`<%l#5Q05x#5zP;=`<%l#4O01p#6WY(Rp(U!bT0/lOY#5}Zr#5}rs#3Rsw#5}wx#5Qx#O#5}#O#P#2d#P;'S#5};'S;=`#6v<%lO#5}01p#6yP;=`<%l#5}07[#7PP;=`<%l#/d)3h#7ab$h&j$P(Ch(Rp(U!b!U7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;ZAt#8vb$Y#t$h&j(Rp(U!b!U7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z'Ad#:Zp$h&j(Rp(U!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#U%Z#U#V#?i#V#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#d#Bq#d#l%Z#l#m#Es#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#<jk$h&j(Rp(U!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#>j_$h&j(Rp(U!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#?rd$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#A]f$h&j(Rp(U!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Bzc$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Dbe$h&j(Rp(U!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#E|g$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Gpi$h&j(Rp(U!bp'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x#Il_!d$b$h&j#})Lv(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#Jv_al$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f#LS^h#)`#O-<U(Rp(U!b(y7`OY*gZr*grs'}sw*gwx)rx!P*g!P!Q#MO!Q!^*g!^!_#Mt!_!`$ f!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#MXX$j&j(Rp(U!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El#M}Z#o(Ch(Rp(U!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#Np!`#O*g#P;'S*g;'S;=`+Z<%lO*g(El#NyX$P(Ch(Rp(U!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El$ oX#p(Ch(Rp(U!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g*)x$!ga#]*!Y$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$#l!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(K[$#w_#h(Cl$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x$%Vag!*r#p(Ch$e#|$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$&[!`!a$'f!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$&g_#p(Ch$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$'qa#o(Ch$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$(v!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$)R`#o(Ch$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(Kd$*`a(m(Ct$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!a%Z!a!b$+e!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$+p`$h&j#z(Ch(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`$,}_!y$Ip$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f$.X_!P0,v$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/]Z$h&jO!^$0O!^!_$0f!_#i$0O#i#j$0k#j#l$0O#l#m$2^#m#o$0O#o#p$0f#p;'S$0O;'S;=`$4i<%lO$0O(n$0VT_#S$h&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0kO_#S(n$0p[$h&jO!Q&c!Q![$1f![!^&c!_!c&c!c!i$1f!i#T&c#T#Z$1f#Z#o&c#o#p$3|#p;'S&c;'S;=`&w<%lO&c(n$1kZ$h&jO!Q&c!Q![$2^![!^&c!_!c&c!c!i$2^!i#T&c#T#Z$2^#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2cZ$h&jO!Q&c!Q![$3U![!^&c!_!c&c!c!i$3U!i#T&c#T#Z$3U#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3ZZ$h&jO!Q&c!Q![$0O![!^&c!_!c&c!c!i$0O!i#T&c#T#Z$0O#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$4PR!Q![$4Y!c!i$4Y#T#Z$4Y#S$4]S!Q![$4Y!c!i$4Y#T#Z$4Y#q#r$0f(n$4lP;=`<%l$0O#1[$4z_!V#)l$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$6U`#w(Ch$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;p$7c_$h&j(Rp(U!b([+4QOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$8qk$h&j(Rp(U!b(O,2j$^#t(`$I[OY%ZYZ&cZr%Zrs&}st%Ztu$8buw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$8b![!^%Z!^!_*g!_!c%Z!c!}$8b!}#O%Z#O#P&c#P#R%Z#R#S$8b#S#T%Z#T#o$8b#o#p*g#p$g%Z$g;'S$8b;'S;=`$<l<%lO$8b+d$:qk$h&j(Rp(U!b$^#tOY%ZYZ&cZr%Zrs&}st%Ztu$:fuw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$:f![!^%Z!^!_*g!_!c%Z!c!}$:f!}#O%Z#O#P&c#P#R%Z#R#S$:f#S#T%Z#T#o$:f#o#p*g#p$g%Z$g;'S$:f;'S;=`$<f<%lO$:f+d$<iP;=`<%l$:f07[$<oP;=`<%l$8b#Jf$<{X![#Hb(Rp(U!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g,#x$=sa(t+JY$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+e#q;'S%Z;'S;=`+a<%lO%Z(Kd$?V_!Z(Cds`$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z?O$@a_!n7`$h&j(Rp(U!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$Aq|$h&j(Rp(U!b'w0/l$[#t(O,2j(`$I[OX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr07[$D|k$h&j(Rp(U!b'x0/l$[#t(O,2j(`$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
  tokenizers: [KC, eW, tW, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, JC, new bc("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOu~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!R~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(^~~", 141, 335), new bc("j~RQYZXz{^~^O'{~~aP!P!Qd~iO'|~~", 25, 318)],
  topRules: { Script: [0, 7], SingleExpression: [1, 272], SingleClassItem: [2, 273] },
  dialects: { jsx: 0, ts: 14725 },
  dynamicPrecedences: { 77: 1, 79: 1, 91: 1, 167: 1, 196: 1 },
  specialized: [{ term: 322, get: (n) => nW[n] || -1 }, { term: 338, get: (n) => rW[n] || -1 }, { term: 92, get: (n) => sW[n] || -1 }],
  tokenPrec: 14749
}), F1 = [
  /* @__PURE__ */ Ye("function ${name}(${params}) {\n	${}\n}", {
    label: "function",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("for (let ${name} of ${collection}) {\n	${}\n}", {
    label: "for",
    detail: "of loop",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("do {\n	${}\n} while (${})", {
    label: "do",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("while (${}) {\n	${}\n}", {
    label: "while",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye(`try {
	\${}
} catch (\${error}) {
	\${}
}`, {
    label: "try",
    detail: "/ catch block",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("if (${}) {\n	${}\n}", {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye(`if (\${}) {
	\${}
} else {
	\${}
}`, {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye(`class \${name} {
	constructor(\${params}) {
		\${}
	}
}`, {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye('import {${names}} from "${module}"\n${}', {
    label: "import",
    detail: "named",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye('import ${name} from "${module}"\n${}', {
    label: "import",
    detail: "default",
    type: "keyword"
  })
], lW = /* @__PURE__ */ F1.concat([
  /* @__PURE__ */ Ye("interface ${name} {\n	${}\n}", {
    label: "interface",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("type ${name} = ${type}", {
    label: "type",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ Ye("enum ${name} {\n	${}\n}", {
    label: "enum",
    detail: "definition",
    type: "keyword"
  })
]), Om = /* @__PURE__ */ new jQ(), H1 = /* @__PURE__ */ new Set([
  "Script",
  "Block",
  "FunctionExpression",
  "FunctionDeclaration",
  "ArrowFunction",
  "MethodDeclaration",
  "ForStatement"
]);
function ys(n) {
  return (e, t) => {
    let i = e.node.getChild("VariableDefinition");
    return i && t(i, n), !0;
  };
}
const aW = ["FunctionDeclaration"], OW = {
  FunctionDeclaration: /* @__PURE__ */ ys("function"),
  ClassDeclaration: /* @__PURE__ */ ys("class"),
  ClassExpression: () => !0,
  EnumDeclaration: /* @__PURE__ */ ys("constant"),
  TypeAliasDeclaration: /* @__PURE__ */ ys("type"),
  NamespaceDeclaration: /* @__PURE__ */ ys("namespace"),
  VariableDefinition(n, e) {
    n.matchContext(aW) || e(n, "variable");
  },
  TypeDefinition(n, e) {
    e(n, "type");
  },
  __proto__: null
};
function J1(n, e) {
  let t = Om.get(e);
  if (t)
    return t;
  let i = [], r = !0;
  function s(l, O) {
    let h = n.sliceString(l.from, l.to);
    i.push({ label: h, type: O });
  }
  return e.cursor(Le.IncludeAnonymous).iterate((l) => {
    if (r)
      r = !1;
    else if (l.name) {
      let O = OW[l.name];
      if (O && O(l, s) || H1.has(l.name))
        return !1;
    } else if (l.to - l.from > 8192) {
      for (let O of J1(n, l.node))
        i.push(O);
      return !1;
    }
  }), Om.set(e, i), i;
}
const hm = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/, K1 = [
  "TemplateString",
  "String",
  "RegExp",
  "LineComment",
  "BlockComment",
  "VariableDefinition",
  "TypeDefinition",
  "Label",
  "PropertyDefinition",
  "PropertyName",
  "PrivatePropertyDefinition",
  "PrivatePropertyName",
  ".",
  "?."
];
function hW(n) {
  let e = De(n.state).resolveInner(n.pos, -1);
  if (K1.indexOf(e.name) > -1)
    return null;
  let t = e.name == "VariableName" || e.to - e.from < 20 && hm.test(n.state.sliceDoc(e.from, e.to));
  if (!t && !n.explicit)
    return null;
  let i = [];
  for (let r = e; r; r = r.parent)
    H1.has(r.name) && (i = i.concat(J1(n.state.doc, r)));
  return {
    options: i,
    from: t ? e.from : n.pos,
    validFor: hm
  };
}
const Pn = /* @__PURE__ */ vn.define({
  name: "javascript",
  parser: /* @__PURE__ */ oW.configure({
    props: [
      /* @__PURE__ */ Gr.add({
        IfStatement: /* @__PURE__ */ ji({ except: /^\s*({|else\b)/ }),
        TryStatement: /* @__PURE__ */ ji({ except: /^\s*({|catch\b|finally\b)/ }),
        LabeledStatement: i0,
        SwitchBody: (n) => {
          let e = n.textAfter, t = /^\s*\}/.test(e), i = /^\s*(case|default)\b/.test(e);
          return n.baseIndent + (t ? 0 : i ? 1 : 2) * n.unit;
        },
        Block: /* @__PURE__ */ Ws({ closing: "}" }),
        ArrowFunction: (n) => n.baseIndent + n.unit,
        "TemplateString BlockComment": () => null,
        "Statement Property": /* @__PURE__ */ ji({ except: /^{/ }),
        JSXElement(n) {
          let e = /^\s*<\//.test(n.textAfter);
          return n.lineIndent(n.node.from) + (e ? 0 : n.unit);
        },
        JSXEscape(n) {
          let e = /\s*\}/.test(n.textAfter);
          return n.lineIndent(n.node.from) + (e ? 0 : n.unit);
        },
        "JSXOpenTag JSXSelfClosingTag"(n) {
          return n.column(n.node.from) + n.unit;
        }
      }),
      /* @__PURE__ */ Dr.add({
        "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": Qa,
        BlockComment(n) {
          return { from: n.from + 2, to: n.to - 2 };
        }
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
    wordChars: "$"
  }
}), eP = {
  test: (n) => /^JSX/.test(n.name),
  facet: /* @__PURE__ */ JQ({ commentTokens: { block: { open: "{/*", close: "*/}" } } })
}, tP = /* @__PURE__ */ Pn.configure({ dialect: "ts" }, "typescript"), iP = /* @__PURE__ */ Pn.configure({
  dialect: "jsx",
  props: [/* @__PURE__ */ Ic.add((n) => n.isTop ? [eP] : void 0)]
}), nP = /* @__PURE__ */ Pn.configure({
  dialect: "jsx ts",
  props: [/* @__PURE__ */ Ic.add((n) => n.isTop ? [eP] : void 0)]
}, "typescript");
let rP = (n) => ({ label: n, type: "keyword" });
const sP = /* @__PURE__ */ "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(rP), cW = /* @__PURE__ */ sP.concat(/* @__PURE__ */ ["declare", "implements", "private", "protected", "public"].map(rP));
function fW(n = {}) {
  let e = n.jsx ? n.typescript ? nP : iP : n.typescript ? tP : Pn, t = n.typescript ? lW.concat(cW) : F1.concat(sP);
  return new io(e, [
    Pn.data.of({
      autocomplete: sf(K1, ao(t))
    }),
    Pn.data.of({
      autocomplete: hW
    }),
    n.jsx ? pW : []
  ]);
}
function uW(n) {
  for (; ; ) {
    if (n.name == "JSXOpenTag" || n.name == "JSXSelfClosingTag" || n.name == "JSXFragmentTag")
      return n;
    if (n.name == "JSXEscape" || !n.parent)
      return null;
    n = n.parent;
  }
}
function cm(n, e, t = n.length) {
  for (let i = e == null ? void 0 : e.firstChild; i; i = i.nextSibling)
    if (i.name == "JSXIdentifier" || i.name == "JSXBuiltin" || i.name == "JSXNamespacedName" || i.name == "JSXMemberExpression")
      return n.sliceString(i.from, Math.min(i.to, t));
  return "";
}
const dW = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), pW = /* @__PURE__ */ I.inputHandler.of((n, e, t, i, r) => {
  if ((dW ? n.composing : n.compositionStarted) || n.state.readOnly || e != t || i != ">" && i != "/" || !Pn.isActiveAt(n.state, e, -1))
    return !1;
  let s = r(), { state: l } = s, O = l.changeByRange((h) => {
    var f;
    let { head: u } = h, d = De(l).resolveInner(u - 1, -1), g;
    if (d.name == "JSXStartTag" && (d = d.parent), !(l.doc.sliceString(u - 1, u) != i || d.name == "JSXAttributeValue" && d.to > u)) {
      if (i == ">" && d.name == "JSXFragmentTag")
        return { range: h, changes: { from: u, insert: "</>" } };
      if (i == "/" && d.name == "JSXStartCloseTag") {
        let Q = d.parent, b = Q.parent;
        if (b && Q.from == u - 2 && ((g = cm(l.doc, b.firstChild, u)) || ((f = b.firstChild) === null || f === void 0 ? void 0 : f.name) == "JSXFragmentTag")) {
          let v = `${g}>`;
          return { range: X.cursor(u + v.length, -1), changes: { from: u, insert: v } };
        }
      } else if (i == ">") {
        let Q = uW(d);
        if (Q && Q.name == "JSXOpenTag" && !/^\/?>|^<\//.test(l.doc.sliceString(u, u + 2)) && (g = cm(l.doc, Q, u)))
          return { range: h, changes: { from: u, insert: `</${g}>` } };
      }
    }
    return { range: h };
  });
  return O.changes.empty ? !1 : (n.dispatch([
    s,
    l.update(O, { userEvent: "input.complete", scrollIntoView: !0 })
  ]), !0);
}), gW = (n) => {
  const e = [fW({ jsx: !0, typescript: !0 })];
  return n && e.push(
    Pn.data.of({ autocomplete: Nn(n) }),
    iP.data.of({ autocomplete: Nn(n) }),
    nP.data.of({ autocomplete: Nn(n) }),
    tP.data.of({ autocomplete: Nn(n) })
  ), e;
}, mW = {
  getOptions: gW
}, QW = (n, e) => {
  const t = [];
  switch (n) {
    case "java":
      t.push(P5.getOptions(e));
      break;
    case "json":
      t.push(x5.getOptions(e));
      break;
    case "python":
      t.push(G2.getOptions(e));
      break;
    case "sql":
      t.push(XC.getOptions(e));
      break;
    case "javascript":
      t.push(mW.getOptions(e));
      break;
    default:
      t.push(k1({ override: [ao(e || [])] }));
      break;
  }
  return t;
}, PW = /* @__PURE__ */ fm({
  __name: "index",
  props: {
    lang: {},
    dark: { type: Boolean },
    options: {},
    modelValue: {},
    wrap: { type: Boolean },
    extensions: {}
  },
  emits: ["update:modelValue", "ready", "change"],
  setup(n, { expose: e, emit: t }) {
    const i = n, r = Gn(
      () => i.wrap !== void 0 ? i.wrap : !1
    ), s = t, l = Ln(""), O = Ln(null), h = Ln(!1);
    Fw(() => {
      h.value && typeof i.modelValue == "string" && i.modelValue !== l.value && O.value.replaceRange(i.modelValue, 0, l.value.length);
    });
    const f = () => {
      h.value = !0, s("ready");
    }, u = (Q) => {
      s("update:modelValue", Q.toJSON().doc), s("change", Q);
    }, d = Gn(() => {
      const Q = [Z1, ...QW(i.lang, i.options)];
      return i.dark && Q.push(r5), Q;
    });
    return e({
      insertText: (Q) => {
        if (!O.value || !Q || typeof Q != "string") return;
        const b = O.value.getCursor() || 0;
        O.value.replaceRange(Q, b, b), O.value.focus = !0, O.value.setCursor(b + Q.length);
      },
      codeMirror: Hw(O)
    }), (Q, b) => (Jw(), Kw(ek(Bq), tk({
      modelValue: l.value,
      "onUpdate:modelValue": b[0] || (b[0] = (v) => l.value = v),
      ref_key: "codeMirrorRef",
      ref: O,
      class: "my-code-mirror my-scrollbar",
      wrap: r.value,
      extensions: d.value,
      onChange: u,
      onReady: f
    }, Q.$attrs), null, 16, ["modelValue", "wrap", "extensions"]));
  }
}), SW = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [i, r] of e)
    t[i] = r;
  return t;
}, xW = /* @__PURE__ */ SW(PW, [["__scopeId", "data-v-3f68d614"]]);
export {
  xW as AmoAYunCodemirror
};
