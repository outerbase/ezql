import Ce, { useRef as re, useEffect as fr, useState as dr, useCallback as _r } from "react";
var f = {}, vr = {
  get exports() {
    return f;
  },
  set exports(p) {
    f = p;
  }
}, L = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Te;
function pr() {
  if (Te)
    return L;
  Te = 1;
  var p = Ce, m = Symbol.for("react.element"), _ = Symbol.for("react.fragment"), h = Object.prototype.hasOwnProperty, S = p.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, y = { key: !0, ref: !0, __self: !0, __source: !0 };
  function j(g, i, c) {
    var l, x = {}, T = null, P = null;
    c !== void 0 && (T = "" + c), i.key !== void 0 && (T = "" + i.key), i.ref !== void 0 && (P = i.ref);
    for (l in i)
      h.call(i, l) && !y.hasOwnProperty(l) && (x[l] = i[l]);
    if (g && g.defaultProps)
      for (l in i = g.defaultProps, i)
        x[l] === void 0 && (x[l] = i[l]);
    return { $$typeof: m, type: g, key: T, ref: P, props: x, _owner: S.current };
  }
  return L.Fragment = _, L.jsx = j, L.jsxs = j, L;
}
var Y = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Oe;
function gr() {
  return Oe || (Oe = 1, process.env.NODE_ENV !== "production" && function() {
    var p = Ce, m = Symbol.for("react.element"), _ = Symbol.for("react.portal"), h = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), y = Symbol.for("react.profiler"), j = Symbol.for("react.provider"), g = Symbol.for("react.context"), i = Symbol.for("react.forward_ref"), c = Symbol.for("react.suspense"), l = Symbol.for("react.suspense_list"), x = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), P = Symbol.for("react.offscreen"), te = Symbol.iterator, ke = "@@iterator";
    function Pe(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = te && e[te] || e[ke];
      return typeof r == "function" ? r : null;
    }
    var I = p.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function b(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
          t[n - 1] = arguments[n];
        De("error", e, t);
      }
    }
    function De(e, r, t) {
      {
        var n = I.ReactDebugCurrentFrame, s = n.getStackAddendum();
        s !== "" && (r += "%s", t = t.concat([s]));
        var u = t.map(function(o) {
          return String(o);
        });
        u.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, u);
      }
    }
    var Ie = !1, Ae = !1, Fe = !1, Ne = !1, $e = !1, ne;
    ne = Symbol.for("react.module.reference");
    function Le(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === h || e === y || $e || e === S || e === c || e === l || Ne || e === P || Ie || Ae || Fe || typeof e == "object" && e !== null && (e.$$typeof === T || e.$$typeof === x || e.$$typeof === j || e.$$typeof === g || e.$$typeof === i || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === ne || e.getModuleId !== void 0));
    }
    function Ye(e, r, t) {
      var n = e.displayName;
      if (n)
        return n;
      var s = r.displayName || r.name || "";
      return s !== "" ? t + "(" + s + ")" : t;
    }
    function ae(e) {
      return e.displayName || "Context";
    }
    function O(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && b("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case h:
          return "Fragment";
        case _:
          return "Portal";
        case y:
          return "Profiler";
        case S:
          return "StrictMode";
        case c:
          return "Suspense";
        case l:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case g:
            var r = e;
            return ae(r) + ".Consumer";
          case j:
            var t = e;
            return ae(t._context) + ".Provider";
          case i:
            return Ye(e, e.render, "ForwardRef");
          case x:
            var n = e.displayName || null;
            return n !== null ? n : O(e.type) || "Memo";
          case T: {
            var s = e, u = s._payload, o = s._init;
            try {
              return O(o(u));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var D = Object.assign, N = 0, ie, oe, se, ce, ue, le, fe;
    function de() {
    }
    de.__reactDisabledLog = !0;
    function We() {
      {
        if (N === 0) {
          ie = console.log, oe = console.info, se = console.warn, ce = console.error, ue = console.group, le = console.groupCollapsed, fe = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: de,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        N++;
      }
    }
    function Ue() {
      {
        if (N--, N === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: D({}, e, {
              value: ie
            }),
            info: D({}, e, {
              value: oe
            }),
            warn: D({}, e, {
              value: se
            }),
            error: D({}, e, {
              value: ce
            }),
            group: D({}, e, {
              value: ue
            }),
            groupCollapsed: D({}, e, {
              value: le
            }),
            groupEnd: D({}, e, {
              value: fe
            })
          });
        }
        N < 0 && b("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var J = I.ReactCurrentDispatcher, G;
    function U(e, r, t) {
      {
        if (G === void 0)
          try {
            throw Error();
          } catch (s) {
            var n = s.stack.trim().match(/\n( *(at )?)/);
            G = n && n[1] || "";
          }
        return `
` + G + e;
      }
    }
    var K = !1, q;
    {
      var qe = typeof WeakMap == "function" ? WeakMap : Map;
      q = new qe();
    }
    function _e(e, r) {
      if (!e || K)
        return "";
      {
        var t = q.get(e);
        if (t !== void 0)
          return t;
      }
      var n;
      K = !0;
      var s = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var u;
      u = J.current, J.current = null, We();
      try {
        if (r) {
          var o = function() {
            throw Error();
          };
          if (Object.defineProperty(o.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(o, []);
            } catch (C) {
              n = C;
            }
            Reflect.construct(e, [], o);
          } else {
            try {
              o.call();
            } catch (C) {
              n = C;
            }
            e.call(o.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (C) {
            n = C;
          }
          e();
        }
      } catch (C) {
        if (C && n && typeof C.stack == "string") {
          for (var a = C.stack.split(`
`), E = n.stack.split(`
`), d = a.length - 1, v = E.length - 1; d >= 1 && v >= 0 && a[d] !== E[v]; )
            v--;
          for (; d >= 1 && v >= 0; d--, v--)
            if (a[d] !== E[v]) {
              if (d !== 1 || v !== 1)
                do
                  if (d--, v--, v < 0 || a[d] !== E[v]) {
                    var w = `
` + a[d].replace(" at new ", " at ");
                    return e.displayName && w.includes("<anonymous>") && (w = w.replace("<anonymous>", e.displayName)), typeof e == "function" && q.set(e, w), w;
                  }
                while (d >= 1 && v >= 0);
              break;
            }
        }
      } finally {
        K = !1, J.current = u, Ue(), Error.prepareStackTrace = s;
      }
      var F = e ? e.displayName || e.name : "", Se = F ? U(F) : "";
      return typeof e == "function" && q.set(e, Se), Se;
    }
    function Me(e, r, t) {
      return _e(e, !1);
    }
    function Be(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function M(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return _e(e, Be(e));
      if (typeof e == "string")
        return U(e);
      switch (e) {
        case c:
          return U("Suspense");
        case l:
          return U("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case i:
            return Me(e.render);
          case x:
            return M(e.type, r, t);
          case T: {
            var n = e, s = n._payload, u = n._init;
            try {
              return M(u(s), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var B = Object.prototype.hasOwnProperty, ve = {}, pe = I.ReactDebugCurrentFrame;
    function V(e) {
      if (e) {
        var r = e._owner, t = M(e.type, e._source, r ? r.type : null);
        pe.setExtraStackFrame(t);
      } else
        pe.setExtraStackFrame(null);
    }
    function Ve(e, r, t, n, s) {
      {
        var u = Function.call.bind(B);
        for (var o in e)
          if (u(e, o)) {
            var a = void 0;
            try {
              if (typeof e[o] != "function") {
                var E = Error((n || "React class") + ": " + t + " type `" + o + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[o] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw E.name = "Invariant Violation", E;
              }
              a = e[o](r, o, n, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (d) {
              a = d;
            }
            a && !(a instanceof Error) && (V(s), b("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", n || "React class", t, o, typeof a), V(null)), a instanceof Error && !(a.message in ve) && (ve[a.message] = !0, V(s), b("Failed %s type: %s", t, a.message), V(null));
          }
      }
    }
    var ze = Array.isArray;
    function Q(e) {
      return ze(e);
    }
    function Je(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function Ge(e) {
      try {
        return ge(e), !1;
      } catch {
        return !0;
      }
    }
    function ge(e) {
      return "" + e;
    }
    function he(e) {
      if (Ge(e))
        return b("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Je(e)), ge(e);
    }
    var $ = I.ReactCurrentOwner, Ke = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, me, ye, H;
    H = {};
    function Qe(e) {
      if (B.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function He(e) {
      if (B.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function Xe(e, r) {
      if (typeof e.ref == "string" && $.current && r && $.current.stateNode !== r) {
        var t = O($.current.type);
        H[t] || (b('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', O($.current.type), e.ref), H[t] = !0);
      }
    }
    function Ze(e, r) {
      {
        var t = function() {
          me || (me = !0, b("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function er(e, r) {
      {
        var t = function() {
          ye || (ye = !0, b("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var rr = function(e, r, t, n, s, u, o) {
      var a = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: m,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: o,
        // Record the component responsible for creating this element.
        _owner: u
      };
      return a._store = {}, Object.defineProperty(a._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(a, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: n
      }), Object.defineProperty(a, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: s
      }), Object.freeze && (Object.freeze(a.props), Object.freeze(a)), a;
    };
    function tr(e, r, t, n, s) {
      {
        var u, o = {}, a = null, E = null;
        t !== void 0 && (he(t), a = "" + t), He(r) && (he(r.key), a = "" + r.key), Qe(r) && (E = r.ref, Xe(r, s));
        for (u in r)
          B.call(r, u) && !Ke.hasOwnProperty(u) && (o[u] = r[u]);
        if (e && e.defaultProps) {
          var d = e.defaultProps;
          for (u in d)
            o[u] === void 0 && (o[u] = d[u]);
        }
        if (a || E) {
          var v = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          a && Ze(o, v), E && er(o, v);
        }
        return rr(e, a, E, s, n, $.current, o);
      }
    }
    var X = I.ReactCurrentOwner, be = I.ReactDebugCurrentFrame;
    function A(e) {
      if (e) {
        var r = e._owner, t = M(e.type, e._source, r ? r.type : null);
        be.setExtraStackFrame(t);
      } else
        be.setExtraStackFrame(null);
    }
    var Z;
    Z = !1;
    function ee(e) {
      return typeof e == "object" && e !== null && e.$$typeof === m;
    }
    function Ee() {
      {
        if (X.current) {
          var e = O(X.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function nr(e) {
      {
        if (e !== void 0) {
          var r = e.fileName.replace(/^.*[\\\/]/, ""), t = e.lineNumber;
          return `

Check your code at ` + r + ":" + t + ".";
        }
        return "";
      }
    }
    var Re = {};
    function ar(e) {
      {
        var r = Ee();
        if (!r) {
          var t = typeof e == "string" ? e : e.displayName || e.name;
          t && (r = `

Check the top-level render call using <` + t + ">.");
        }
        return r;
      }
    }
    function xe(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = ar(r);
        if (Re[t])
          return;
        Re[t] = !0;
        var n = "";
        e && e._owner && e._owner !== X.current && (n = " It was passed a child from " + O(e._owner.type) + "."), A(e), b('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, n), A(null);
      }
    }
    function we(e, r) {
      {
        if (typeof e != "object")
          return;
        if (Q(e))
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            ee(n) && xe(n, r);
          }
        else if (ee(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var s = Pe(e);
          if (typeof s == "function" && s !== e.entries)
            for (var u = s.call(e), o; !(o = u.next()).done; )
              ee(o.value) && xe(o.value, r);
        }
      }
    }
    function ir(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === i || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === x))
          t = r.propTypes;
        else
          return;
        if (t) {
          var n = O(r);
          Ve(t, e.props, "prop", n, e);
        } else if (r.PropTypes !== void 0 && !Z) {
          Z = !0;
          var s = O(r);
          b("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", s || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && b("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function or(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var n = r[t];
          if (n !== "children" && n !== "key") {
            A(e), b("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", n), A(null);
            break;
          }
        }
        e.ref !== null && (A(e), b("Invalid attribute `ref` supplied to `React.Fragment`."), A(null));
      }
    }
    function je(e, r, t, n, s, u) {
      {
        var o = Le(e);
        if (!o) {
          var a = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (a += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var E = nr(s);
          E ? a += E : a += Ee();
          var d;
          e === null ? d = "null" : Q(e) ? d = "array" : e !== void 0 && e.$$typeof === m ? (d = "<" + (O(e.type) || "Unknown") + " />", a = " Did you accidentally export a JSX literal instead of a component?") : d = typeof e, b("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", d, a);
        }
        var v = tr(e, r, t, s, u);
        if (v == null)
          return v;
        if (o) {
          var w = r.children;
          if (w !== void 0)
            if (n)
              if (Q(w)) {
                for (var F = 0; F < w.length; F++)
                  we(w[F], e);
                Object.freeze && Object.freeze(w);
              } else
                b("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              we(w, e);
        }
        return e === h ? or(v) : ir(v), v;
      }
    }
    function sr(e, r, t) {
      return je(e, r, t, !0);
    }
    function cr(e, r, t) {
      return je(e, r, t, !1);
    }
    var ur = cr, lr = sr;
    Y.Fragment = h, Y.jsx = ur, Y.jsxs = lr;
  }()), Y;
}
(function(p) {
  process.env.NODE_ENV === "production" ? p.exports = pr() : p.exports = gr();
})(vr);
function R(...p) {
  return p.filter(Boolean).join(" ");
}
const hr = "_parent_s5iu1_8", mr = "_fadeInOpacity_s5iu1_1", yr = "_backdrop_shadow_s5iu1_31", br = "_fadeInBlur_s5iu1_1", Er = "_backdrop_s5iu1_31", Rr = "_container_s5iu1_59", xr = "_foreground_s5iu1_66", W = {
  parent: hr,
  fadeInOpacity: mr,
  "search-icon": "_search-icon_s5iu1_27",
  backdrop_shadow: yr,
  fadeInBlur: br,
  backdrop: Er,
  container: Rr,
  foreground: xr
};
function wr({ children: p, didDismiss: m, className: _ }) {
  const h = re(null);
  function S(y) {
    y.target === h.current && m();
  }
  return fr(() => {
    function y(j) {
      j.code === "Escape" && (m(), document.removeEventListener("keydown", y));
    }
    return document.addEventListener("keydown", y), () => {
      document.removeEventListener("keydown", y);
    };
  }, []), /* @__PURE__ */ f.jsxs(
    "div",
    {
      className: R(W.parent, _),
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onClick: S,
      children: [
        /* @__PURE__ */ f.jsx("div", { className: W.backdrop_shadow }),
        /* @__PURE__ */ f.jsx("div", { className: W.container, children: /* @__PURE__ */ f.jsx("div", { className: W.backdrop, ref: h, children: /* @__PURE__ */ f.jsx("div", { className: W.foreground, children: /* @__PURE__ */ f.jsx("div", { children: p }) }) }) })
      ]
    }
  );
}
const jr = "_list_item_1f3fj_1", Sr = "_suggested_text_1f3fj_21", Tr = "_search_icon_1f3fj_28", Or = "_arrow_right_icon_1f3fj_29", z = {
  list_item: jr,
  suggested_text: Sr,
  search_icon: Tr,
  arrow_right_icon: Or
};
function Cr({ text: p, didSubmitWithValue: m }) {
  const _ = re(null);
  function h() {
    m && m(p);
  }
  function S() {
    var i, c, l;
    (l = (c = (i = _ == null ? void 0 : _.current) == null ? void 0 : i.parentElement) == null ? void 0 : c.querySelector("li")) == null || l.focus();
  }
  function y() {
    var c, l;
    const i = (l = (c = _ == null ? void 0 : _.current) == null ? void 0 : c.parentElement) == null ? void 0 : l.querySelector("li:last-child");
    i == null || i.focus();
  }
  function j() {
    var c;
    const i = (c = _ == null ? void 0 : _.current) == null ? void 0 : c.nextSibling;
    i ? i.focus() : S();
  }
  function g() {
    var c;
    const i = (c = _ == null ? void 0 : _.current) == null ? void 0 : c.previousSibling;
    i ? i.focus() : y();
  }
  return /* @__PURE__ */ f.jsxs(
    "li",
    {
      tabIndex: 0,
      className: R(z.list_item, "suggestion-search-list-item"),
      onKeyDown: (i) => {
        i.key === "Enter" && h(), i.key === "ArrowDown" && j(), i.key === "ArrowUp" && g();
      },
      onClick: h,
      ref: _,
      children: [
        /* @__PURE__ */ f.jsx("img", { className: R(z.search_icon, "search-icon"), src: "icon_search.svg", alt: "Search icon" }),
        /* @__PURE__ */ f.jsx("span", { className: R(z.suggested_text, "suggested-text"), children: p }),
        /* @__PURE__ */ f.jsx(
          "img",
          {
            className: R(z.arrow_right_icon, "arrow-right-icon"),
            src: "icon_arrow-right.svg",
            alt: "Arrow right icon"
          }
        )
      ]
    }
  );
}
const kr = "_suggestions_list_1ef85_8", Pr = "_container_1ef85_14", Dr = "_input_container_1ef85_20", Ir = "_input_icon_container_1ef85_29", Ar = "_input_icon_1ef85_29", Fr = "_input_1ef85_20", Nr = "_suggestions_container_1ef85_52", $r = "_suggestions_hint_1ef85_60", k = {
  suggestions_list: kr,
  container: Pr,
  input_container: Dr,
  input_icon_container: Ir,
  input_icon: Ar,
  input: Fr,
  suggestions_container: Nr,
  suggestions_hint: $r
};
function Yr({
  setShouldDisplayEzql: p,
  didSubmitWithValue: m,
  onResults: _,
  suggestions: h,
  className: S
}) {
  const [y, j] = dr(""), g = re(null), i = _r((c) => {
    m && m(c);
  }, []);
  return /* @__PURE__ */ f.jsx(wr, { didDismiss: () => p(!1), className: R("ezql-prompt-modal", S), children: /* @__PURE__ */ f.jsxs("div", { className: R(k.container, "container"), children: [
    /* @__PURE__ */ f.jsxs("div", { className: R(k.input_container, "input-container"), children: [
      /* @__PURE__ */ f.jsx("div", { className: R(k.input_icon_container, "input-icon-container"), children: /* @__PURE__ */ f.jsx("img", { src: "ezql_diamond-small.png", alt: "EZQL Icon", className: R(k.input_icon, "input-icon") }) }),
      /* @__PURE__ */ f.jsx(
        "input",
        {
          className: R(k.input, "typography_text_large"),
          type: "text",
          autoFocus: !0,
          placeholder: "Search your database...",
          value: y,
          onChange: (c) => j(c.target.value),
          onKeyDown: (c) => {
            var l, x, T, P;
            c.key === "Enter" ? i(y) : c.key === "ArrowDown" ? (x = (l = g == null ? void 0 : g.current) == null ? void 0 : l.querySelector("li")) == null || x.focus() : c.key === "ArrowUp" && ((P = (T = g == null ? void 0 : g.current) == null ? void 0 : T.querySelector("li:last-child")) == null || P.focus());
          }
        }
      )
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: R(k.suggestions_container, "suggestions-container"), children: [
      /* @__PURE__ */ f.jsx("span", { className: R(k.suggestions_hint, "typography_text_small", "suggestions-hint"), children: "Search via plain text EZQL will automatically convert it to a SQL query, you could also try one of the generated prompts." }),
      /* @__PURE__ */ f.jsx("ul", { className: R(k.suggestions_list, "suggestions-list"), ref: g, children: h == null ? void 0 : h.map((c) => /* @__PURE__ */ f.jsx(Cr, { text: c, didSubmitWithValue: m }, c)) })
    ] })
  ] }) });
}
export {
  Yr as EzqlPrompt
};
