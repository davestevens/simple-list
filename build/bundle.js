
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to seperate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        SvelteComponentTyped: SvelteComponentTyped,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getContext: getContext,
        hasContext: hasContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules\svelte-simple-modal\src\Modal.svelte generated by Svelte v3.31.2 */

    const { Object: Object_1, window: window_1 } = globals;
    const file = "node_modules\\svelte-simple-modal\\src\\Modal.svelte";

    // (423:0) {#if Component}
    function create_if_block(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div0_class_value;
    	let div1_class_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let div2_class_value;
    	let div3_class_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[1].closeButton && create_if_block_1(ctx);
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"));
    			attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			add_location(div0, file, 467, 8, 11882);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"));
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null);
    			attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			add_location(div1, file, 438, 6, 10907);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"));
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			add_location(div2, file, 432, 4, 10774);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"));
    			attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			add_location(div3, file, 423, 2, 10528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[49](div1);
    			/*div2_binding*/ ctx[50](div2);
    			/*div3_binding*/ ctx[51](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[13])) /*onOpen*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[14])) /*onClose*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[15])) /*onOpened*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[16])) /*onClosed*/ ctx[16].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[1].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 512) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_label_value !== (div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null)) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 256) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 128) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 64) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[49](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[50](null);
    			/*div3_binding*/ ctx[51](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(423:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (454:8) {#if state.closeButton}
    function create_if_block_1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 2) show_if = !!/*isFunction*/ ctx[17](/*state*/ ctx[1].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(454:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (457:10) {:else}
    function create_else_block(ctx) {
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"));
    			attr_dev(button, "aria-label", "Close modal");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			attr_dev(button, "type", "button");
    			toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			add_location(button, file, 457, 12, 11603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*cssCloseButton*/ 1024) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(457:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (455:10) {#if isFunction(state.closeButton)}
    function create_if_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[1].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[18] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[1].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(455:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[2] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[48].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[47], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[1] & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[47], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bind(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Modal", slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;

    	/**
     * A basic function that checks if a node is tabbale
     */
    	const baseIsTabbable = node => node.tabIndex >= 0 && !node.hidden && !node.disabled && node.style.display !== "none" && node.type !== "hidden" && Boolean(node.offsetWidth || node.offsetHeight || node.getClientRects().length);

    	let { isTabbable = baseIsTabbable } = $$props;
    	let { show = null } = $$props;
    	let { key = "simple-modal" } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { ariaLabelledBy = null } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { classBg = null } = $$props;
    	let { classWindowWrap = null } = $$props;
    	let { classWindow = null } = $$props;
    	let { classContent = null } = $$props;
    	let { classCloseButton = null } = $$props;
    	let { unstyled = false } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;
    	let { disableFocusTrap = false } = $$props;

    	const defaultState = {
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isTabbable,
    		unstyled
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, "")
    	: "";

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(6, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(7, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(8, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(9, cssContent = toCssString(state.styleContent));
    		$$invalidate(10, cssCloseButton = toCssString(state.styleCloseButton));
    		$$invalidate(11, currentTransitionBg = state.transitionBg);
    		$$invalidate(12, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(2, Component = bind(NewComponent, newProps));
    		$$invalidate(1, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		$$invalidate(13, onOpen = event => {
    			if (callback.onOpen) callback.onOpen(event);

    			/**
     * The open event is fired right before the modal opens
     * @event {void} open
     */
    			dispatch("open");

    			/**
     * The opening event is fired right before the modal opens
     * @event {void} opening
     * @deprecated Listen to the `open` event instead
     */
    			dispatch("opening"); // Deprecated. Do not use!
    		});

    		$$invalidate(14, onClose = event => {
    			if (callback.onClose) callback.onClose(event);

    			/**
     * The close event is fired right before the modal closes
     * @event {void} close
     */
    			dispatch("close");

    			/**
     * The closing event is fired right before the modal closes
     * @event {void} closing
     * @deprecated Listen to the `close` event instead
     */
    			dispatch("closing"); // Deprecated. Do not use!
    		});

    		$$invalidate(15, onOpened = event => {
    			if (callback.onOpened) callback.onOpened(event);

    			/**
     * The opened event is fired after the modal's opening transition
     * @event {void} opened
     */
    			dispatch("opened");
    		});

    		$$invalidate(16, onClosed = event => {
    			if (callback.onClosed) callback.onClosed(event);

    			/**
     * The closed event is fired after the modal's closing transition
     * @event {void} closed
     */
    			dispatch("closed");
    		});
    	};

    	const close = (callback = {}) => {
    		if (!Component) return;
    		$$invalidate(14, onClose = callback.onClose || onClose);
    		$$invalidate(16, onClosed = callback.onClosed || onClosed);
    		$$invalidate(2, Component = null);
    		enableScroll();
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === "Escape") {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === "Tab" && !state.disableFocusTrap) {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll("*");

    			const tabbable = Array.from(nodes).filter(state.isTabbable).sort((a, b) => a.tabIndex - b.tabIndex);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = "fixed";
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = "hidden";
    		document.body.style.width = "100%";
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || "";
    		document.body.style.top = "";
    		document.body.style.overflow = prevBodyOverflow || "";
    		document.body.style.width = prevBodyWidth || "";
    		window.scrollTo(0, scrollY);
    	};

    	setContext$1(key, { open, close });
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(46, isMounted = true);
    	});

    	const writable_props = [
    		"isTabbable",
    		"show",
    		"key",
    		"ariaLabel",
    		"ariaLabelledBy",
    		"closeButton",
    		"closeOnEsc",
    		"closeOnOuterClick",
    		"styleBg",
    		"styleWindowWrap",
    		"styleWindow",
    		"styleContent",
    		"styleCloseButton",
    		"classBg",
    		"classWindowWrap",
    		"classWindow",
    		"classContent",
    		"classCloseButton",
    		"unstyled",
    		"setContext",
    		"transitionBg",
    		"transitionBgProps",
    		"transitionWindow",
    		"transitionWindowProps",
    		"disableFocusTrap"
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("isTabbable" in $$props) $$invalidate(22, isTabbable = $$props.isTabbable);
    		if ("show" in $$props) $$invalidate(23, show = $$props.show);
    		if ("key" in $$props) $$invalidate(24, key = $$props.key);
    		if ("ariaLabel" in $$props) $$invalidate(25, ariaLabel = $$props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(26, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ("closeButton" in $$props) $$invalidate(27, closeButton = $$props.closeButton);
    		if ("closeOnEsc" in $$props) $$invalidate(28, closeOnEsc = $$props.closeOnEsc);
    		if ("closeOnOuterClick" in $$props) $$invalidate(29, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ("styleBg" in $$props) $$invalidate(30, styleBg = $$props.styleBg);
    		if ("styleWindowWrap" in $$props) $$invalidate(31, styleWindowWrap = $$props.styleWindowWrap);
    		if ("styleWindow" in $$props) $$invalidate(32, styleWindow = $$props.styleWindow);
    		if ("styleContent" in $$props) $$invalidate(33, styleContent = $$props.styleContent);
    		if ("styleCloseButton" in $$props) $$invalidate(34, styleCloseButton = $$props.styleCloseButton);
    		if ("classBg" in $$props) $$invalidate(35, classBg = $$props.classBg);
    		if ("classWindowWrap" in $$props) $$invalidate(36, classWindowWrap = $$props.classWindowWrap);
    		if ("classWindow" in $$props) $$invalidate(37, classWindow = $$props.classWindow);
    		if ("classContent" in $$props) $$invalidate(38, classContent = $$props.classContent);
    		if ("classCloseButton" in $$props) $$invalidate(39, classCloseButton = $$props.classCloseButton);
    		if ("unstyled" in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ("setContext" in $$props) $$invalidate(40, setContext$1 = $$props.setContext);
    		if ("transitionBg" in $$props) $$invalidate(41, transitionBg = $$props.transitionBg);
    		if ("transitionBgProps" in $$props) $$invalidate(42, transitionBgProps = $$props.transitionBgProps);
    		if ("transitionWindow" in $$props) $$invalidate(43, transitionWindow = $$props.transitionWindow);
    		if ("transitionWindowProps" in $$props) $$invalidate(44, transitionWindowProps = $$props.transitionWindowProps);
    		if ("disableFocusTrap" in $$props) $$invalidate(45, disableFocusTrap = $$props.disableFocusTrap);
    		if ("$$scope" in $$props) $$invalidate(47, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		bind,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		baseIsTabbable,
    		isTabbable,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		unstyled,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		isMounted
    	});

    	$$self.$inject_state = $$props => {
    		if ("isTabbable" in $$props) $$invalidate(22, isTabbable = $$props.isTabbable);
    		if ("show" in $$props) $$invalidate(23, show = $$props.show);
    		if ("key" in $$props) $$invalidate(24, key = $$props.key);
    		if ("ariaLabel" in $$props) $$invalidate(25, ariaLabel = $$props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(26, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ("closeButton" in $$props) $$invalidate(27, closeButton = $$props.closeButton);
    		if ("closeOnEsc" in $$props) $$invalidate(28, closeOnEsc = $$props.closeOnEsc);
    		if ("closeOnOuterClick" in $$props) $$invalidate(29, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ("styleBg" in $$props) $$invalidate(30, styleBg = $$props.styleBg);
    		if ("styleWindowWrap" in $$props) $$invalidate(31, styleWindowWrap = $$props.styleWindowWrap);
    		if ("styleWindow" in $$props) $$invalidate(32, styleWindow = $$props.styleWindow);
    		if ("styleContent" in $$props) $$invalidate(33, styleContent = $$props.styleContent);
    		if ("styleCloseButton" in $$props) $$invalidate(34, styleCloseButton = $$props.styleCloseButton);
    		if ("classBg" in $$props) $$invalidate(35, classBg = $$props.classBg);
    		if ("classWindowWrap" in $$props) $$invalidate(36, classWindowWrap = $$props.classWindowWrap);
    		if ("classWindow" in $$props) $$invalidate(37, classWindow = $$props.classWindow);
    		if ("classContent" in $$props) $$invalidate(38, classContent = $$props.classContent);
    		if ("classCloseButton" in $$props) $$invalidate(39, classCloseButton = $$props.classCloseButton);
    		if ("unstyled" in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ("setContext" in $$props) $$invalidate(40, setContext$1 = $$props.setContext);
    		if ("transitionBg" in $$props) $$invalidate(41, transitionBg = $$props.transitionBg);
    		if ("transitionBgProps" in $$props) $$invalidate(42, transitionBgProps = $$props.transitionBgProps);
    		if ("transitionWindow" in $$props) $$invalidate(43, transitionWindow = $$props.transitionWindow);
    		if ("transitionWindowProps" in $$props) $$invalidate(44, transitionWindowProps = $$props.transitionWindowProps);
    		if ("disableFocusTrap" in $$props) $$invalidate(45, disableFocusTrap = $$props.disableFocusTrap);
    		if ("state" in $$props) $$invalidate(1, state = $$props.state);
    		if ("Component" in $$props) $$invalidate(2, Component = $$props.Component);
    		if ("background" in $$props) $$invalidate(3, background = $$props.background);
    		if ("wrap" in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ("modalWindow" in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ("scrollY" in $$props) scrollY = $$props.scrollY;
    		if ("cssBg" in $$props) $$invalidate(6, cssBg = $$props.cssBg);
    		if ("cssWindowWrap" in $$props) $$invalidate(7, cssWindowWrap = $$props.cssWindowWrap);
    		if ("cssWindow" in $$props) $$invalidate(8, cssWindow = $$props.cssWindow);
    		if ("cssContent" in $$props) $$invalidate(9, cssContent = $$props.cssContent);
    		if ("cssCloseButton" in $$props) $$invalidate(10, cssCloseButton = $$props.cssCloseButton);
    		if ("currentTransitionBg" in $$props) $$invalidate(11, currentTransitionBg = $$props.currentTransitionBg);
    		if ("currentTransitionWindow" in $$props) $$invalidate(12, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ("prevBodyPosition" in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ("prevBodyOverflow" in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ("prevBodyWidth" in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ("outerClickTarget" in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ("onOpen" in $$props) $$invalidate(13, onOpen = $$props.onOpen);
    		if ("onClose" in $$props) $$invalidate(14, onClose = $$props.onClose);
    		if ("onOpened" in $$props) $$invalidate(15, onOpened = $$props.onOpened);
    		if ("onClosed" in $$props) $$invalidate(16, onClosed = $$props.onClosed);
    		if ("isMounted" in $$props) $$invalidate(46, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 8388608 | $$self.$$.dirty[1] & /*isMounted*/ 32768) {
    			 {
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		unstyled,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		isTabbable,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance,
    			create_fragment,
    			safe_not_equal,
    			{
    				isTabbable: 22,
    				show: 23,
    				key: 24,
    				ariaLabel: 25,
    				ariaLabelledBy: 26,
    				closeButton: 27,
    				closeOnEsc: 28,
    				closeOnOuterClick: 29,
    				styleBg: 30,
    				styleWindowWrap: 31,
    				styleWindow: 32,
    				styleContent: 33,
    				styleCloseButton: 34,
    				classBg: 35,
    				classWindowWrap: 36,
    				classWindow: 37,
    				classContent: 38,
    				classCloseButton: 39,
    				unstyled: 0,
    				setContext: 40,
    				transitionBg: 41,
    				transitionBgProps: 42,
    				transitionWindow: 43,
    				transitionWindowProps: 44,
    				disableFocusTrap: 45
    			},
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get isTabbable() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isTabbable(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unstyled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unstyled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableFocusTrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableFocusTrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const LISTS_KEY = "LISTS";
    const SELECTED_LIST_KEY = "SELECTED_LIST";
    const LIST_KEY = "LIST";

    const range = "ABCDEF0123456789";
    var randomColor = () => {
        let hex = "#";
        for (var i = 0; i < 6; i++) {
            hex += range.charAt(Math.floor(Math.random() * range.length));
        }
        return hex;
    };

    const buildListKey = (key) => `${LIST_KEY}:${key}`;

    const createList = (key = LIST_KEY) => {
        const listKey = buildListKey(key);
        const initialValue = JSON.parse(localStorage.getItem(listKey)) || [];
        const { update, subscribe } = writable(initialValue);
        subscribe((val) => {
            localStorage.setItem(listKey, JSON.stringify(val));
        });
        return {
            subscribe,
            addItem: (label, info) => {
                update((current) => {
                    return [...current, { label: label.trim(), info, color: randomColor() }];
                });
            },
            getItem: (index) => {
                let $current;
                subscribe($ => $current = $)();
                return $current.find((_, i) => i === index);
            },
            updateItem: (index, label, info) => {
                update((current) => {
                    const item = current.find((_, i) => i === index);
                    item.label = label;
                    item.info = info;
                    return [...current];
                });
            },
            removeItem: (index) => {
                update((current) => current.filter((_, i) => i !== index));
            },
        };
    };
    const destroyList = (key) => {
        const listKey = buildListKey(key);
        localStorage.removeItem(listKey);
    };

    let currentlySelectedList;
    const updateCurrentlySelectedList = (key) => {
        if (key) {
            currentlySelectedList = createList(key);
        }
        else {
            currentlySelectedList = null;
        }
    };
    const getCurrentlySelectedList = () => {
        return currentlySelectedList;
    };

    /*!
     * Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     * Copyright 2022 Fonticons, Inc.
     */
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }

      return target;
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;

      var _s, _e;

      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var noop$1 = function noop() {};

    var _WINDOW = {};
    var _DOCUMENT = {};
    var _MUTATION_OBSERVER = null;
    var _PERFORMANCE = {
      mark: noop$1,
      measure: noop$1
    };

    try {
      if (typeof window !== 'undefined') _WINDOW = window;
      if (typeof document !== 'undefined') _DOCUMENT = document;
      if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER = MutationObserver;
      if (typeof performance !== 'undefined') _PERFORMANCE = performance;
    } catch (e) {}

    var _ref = _WINDOW.navigator || {},
        _ref$userAgent = _ref.userAgent,
        userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;
    var WINDOW = _WINDOW;
    var DOCUMENT = _DOCUMENT;
    var MUTATION_OBSERVER = _MUTATION_OBSERVER;
    var PERFORMANCE = _PERFORMANCE;
    var IS_BROWSER = !!WINDOW.document;
    var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
    var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

    var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
    var UNITS_IN_GRID = 16;
    var DEFAULT_FAMILY_PREFIX = 'fa';
    var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
    var DATA_FA_I2SVG = 'data-fa-i2svg';
    var DATA_FA_PSEUDO_ELEMENT = 'data-fa-pseudo-element';
    var DATA_FA_PSEUDO_ELEMENT_PENDING = 'data-fa-pseudo-element-pending';
    var DATA_PREFIX = 'data-prefix';
    var DATA_ICON = 'data-icon';
    var HTML_CLASS_I2SVG_BASE_CLASS = 'fontawesome-i2svg';
    var MUTATION_APPROACH_ASYNC = 'async';
    var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ['HTML', 'HEAD', 'STYLE', 'SCRIPT'];
    var PRODUCTION = function () {
      try {
        return process.env.NODE_ENV === 'production';
      } catch (e) {
        return false;
      }
    }();
    var PREFIX_TO_STYLE = {
      'fas': 'solid',
      'fa-solid': 'solid',
      'far': 'regular',
      'fa-regular': 'regular',
      'fal': 'light',
      'fa-light': 'light',
      'fat': 'thin',
      'fa-thin': 'thin',
      'fad': 'duotone',
      'fa-duotone': 'duotone',
      'fab': 'brands',
      'fa-brands': 'brands',
      'fak': 'kit',
      'fa-kit': 'kit',
      'fa': 'solid'
    };
    var STYLE_TO_PREFIX = {
      'solid': 'fas',
      'regular': 'far',
      'light': 'fal',
      'thin': 'fat',
      'duotone': 'fad',
      'brands': 'fab',
      'kit': 'fak'
    };
    var PREFIX_TO_LONG_STYLE = {
      'fab': 'fa-brands',
      'fad': 'fa-duotone',
      'fak': 'fa-kit',
      'fal': 'fa-light',
      'far': 'fa-regular',
      'fas': 'fa-solid',
      'fat': 'fa-thin'
    };
    var LONG_STYLE_TO_PREFIX = {
      'fa-brands': 'fab',
      'fa-duotone': 'fad',
      'fa-kit': 'fak',
      'fa-light': 'fal',
      'fa-regular': 'far',
      'fa-solid': 'fas',
      'fa-thin': 'fat'
    };
    var ICON_SELECTION_SYNTAX_PATTERN = /fa[srltdbk\-\ ]/; // eslint-disable-line no-useless-escape

    var LAYERS_TEXT_CLASSNAME = 'fa-layers-text';
    var FONT_FAMILY_PATTERN = /Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Kit)?.*/i; // TODO: do we need to handle font-weight for kit SVG pseudo-elements?

    var FONT_WEIGHT_TO_PREFIX = {
      '900': 'fas',
      '400': 'far',
      'normal': 'far',
      '300': 'fal',
      '100': 'fat'
    };
    var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    var ATTRIBUTES_WATCHED_FOR_MUTATION = ['class', 'data-prefix', 'data-icon', 'data-fa-transform', 'data-fa-mask'];
    var DUOTONE_CLASSES = {
      GROUP: 'duotone-group',
      SWAP_OPACITY: 'swap-opacity',
      PRIMARY: 'primary',
      SECONDARY: 'secondary'
    };
    var RESERVED_CLASSES = [].concat(_toConsumableArray(Object.keys(STYLE_TO_PREFIX)), ['2xs', 'xs', 'sm', 'lg', 'xl', '2xl', 'beat', 'border', 'fade', 'beat-fade', 'bounce', 'flip-both', 'flip-horizontal', 'flip-vertical', 'flip', 'fw', 'inverse', 'layers-counter', 'layers-text', 'layers', 'li', 'pull-left', 'pull-right', 'pulse', 'rotate-180', 'rotate-270', 'rotate-90', 'rotate-by', 'shake', 'spin-pulse', 'spin-reverse', 'spin', 'stack-1x', 'stack-2x', 'stack', 'ul', DUOTONE_CLASSES.GROUP, DUOTONE_CLASSES.SWAP_OPACITY, DUOTONE_CLASSES.PRIMARY, DUOTONE_CLASSES.SECONDARY]).concat(oneToTen.map(function (n) {
      return "".concat(n, "x");
    })).concat(oneToTwenty.map(function (n) {
      return "w-".concat(n);
    }));

    var initial = WINDOW.FontAwesomeConfig || {};

    function getAttrConfig(attr) {
      var element = DOCUMENT.querySelector('script[' + attr + ']');

      if (element) {
        return element.getAttribute(attr);
      }
    }

    function coerce(val) {
      // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
      // We'll assume that this is an indication that it should be toggled to true
      if (val === '') return true;
      if (val === 'false') return false;
      if (val === 'true') return true;
      return val;
    }

    if (DOCUMENT && typeof DOCUMENT.querySelector === 'function') {
      var attrs = [['data-family-prefix', 'familyPrefix'], ['data-style-default', 'styleDefault'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-mutate-approach', 'mutateApproach'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']];
      attrs.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            attr = _ref2[0],
            key = _ref2[1];

        var val = coerce(getAttrConfig(attr));

        if (val !== undefined && val !== null) {
          initial[key] = val;
        }
      });
    }

    var _default = {
      familyPrefix: DEFAULT_FAMILY_PREFIX,
      styleDefault: 'solid',
      replacementClass: DEFAULT_REPLACEMENT_CLASS,
      autoReplaceSvg: true,
      autoAddCss: true,
      autoA11y: true,
      searchPseudoElements: false,
      observeMutations: true,
      mutateApproach: 'async',
      keepOriginalSource: true,
      measurePerformance: false,
      showMissingIcons: true
    };

    var _config = _objectSpread2(_objectSpread2({}, _default), initial);

    if (!_config.autoReplaceSvg) _config.observeMutations = false;
    var config = {};
    Object.keys(_config).forEach(function (key) {
      Object.defineProperty(config, key, {
        enumerable: true,
        set: function set(val) {
          _config[key] = val;

          _onChangeCb.forEach(function (cb) {
            return cb(config);
          });
        },
        get: function get() {
          return _config[key];
        }
      });
    });
    WINDOW.FontAwesomeConfig = config;
    var _onChangeCb = [];
    function onChange(cb) {
      _onChangeCb.push(cb);

      return function () {
        _onChangeCb.splice(_onChangeCb.indexOf(cb), 1);
      };
    }

    var d = UNITS_IN_GRID;
    var meaninglessTransform = {
      size: 16,
      x: 0,
      y: 0,
      rotate: 0,
      flipX: false,
      flipY: false
    };
    function insertCss(css) {
      if (!css || !IS_DOM) {
        return;
      }

      var style = DOCUMENT.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = css;
      var headChildren = DOCUMENT.head.childNodes;
      var beforeChild = null;

      for (var i = headChildren.length - 1; i > -1; i--) {
        var child = headChildren[i];
        var tagName = (child.tagName || '').toUpperCase();

        if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
          beforeChild = child;
        }
      }

      DOCUMENT.head.insertBefore(style, beforeChild);
      return css;
    }
    var idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    function nextUniqueId() {
      var size = 12;
      var id = '';

      while (size-- > 0) {
        id += idPool[Math.random() * 62 | 0];
      }

      return id;
    }
    function toArray(obj) {
      var array = [];

      for (var i = (obj || []).length >>> 0; i--;) {
        array[i] = obj[i];
      }

      return array;
    }
    function classArray(node) {
      if (node.classList) {
        return toArray(node.classList);
      } else {
        return (node.getAttribute('class') || '').split(' ').filter(function (i) {
          return i;
        });
      }
    }
    function htmlEscape(str) {
      return "".concat(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function joinAttributes(attributes) {
      return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
        return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
      }, '').trim();
    }
    function joinStyles(styles) {
      return Object.keys(styles || {}).reduce(function (acc, styleName) {
        return acc + "".concat(styleName, ": ").concat(styles[styleName].trim(), ";");
      }, '');
    }
    function transformIsMeaningful(transform) {
      return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
    }
    function transformForSvg(_ref) {
      var transform = _ref.transform,
          containerWidth = _ref.containerWidth,
          iconWidth = _ref.iconWidth;
      var outer = {
        transform: "translate(".concat(containerWidth / 2, " 256)")
      };
      var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
      var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
      var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
      var inner = {
        transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
      };
      var path = {
        transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
      };
      return {
        outer: outer,
        inner: inner,
        path: path
      };
    }
    function transformForCss(_ref2) {
      var transform = _ref2.transform,
          _ref2$width = _ref2.width,
          width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width,
          _ref2$height = _ref2.height,
          height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height,
          _ref2$startCentered = _ref2.startCentered,
          startCentered = _ref2$startCentered === void 0 ? false : _ref2$startCentered;
      var val = '';

      if (startCentered && IS_IE) {
        val += "translate(".concat(transform.x / d - width / 2, "em, ").concat(transform.y / d - height / 2, "em) ");
      } else if (startCentered) {
        val += "translate(calc(-50% + ".concat(transform.x / d, "em), calc(-50% + ").concat(transform.y / d, "em)) ");
      } else {
        val += "translate(".concat(transform.x / d, "em, ").concat(transform.y / d, "em) ");
      }

      val += "scale(".concat(transform.size / d * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d * (transform.flipY ? -1 : 1), ") ");
      val += "rotate(".concat(transform.rotate, "deg) ");
      return val;
    }

    var baseStyles = ":root, :host {\n  --fa-font-solid: normal 900 1em/1 \"Font Awesome 6 Solid\";\n  --fa-font-regular: normal 400 1em/1 \"Font Awesome 6 Regular\";\n  --fa-font-light: normal 300 1em/1 \"Font Awesome 6 Light\";\n  --fa-font-thin: normal 100 1em/1 \"Font Awesome 6 Thin\";\n  --fa-font-duotone: normal 900 1em/1 \"Font Awesome 6 Duotone\";\n  --fa-font-brands: normal 400 1em/1 \"Font Awesome 6 Brands\";\n}\n\nsvg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {\n  overflow: visible;\n  box-sizing: content-box;\n}\n\n.svg-inline--fa {\n  display: var(--fa-display, inline-block);\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-2xs {\n  vertical-align: 0.1em;\n}\n.svg-inline--fa.fa-xs {\n  vertical-align: 0em;\n}\n.svg-inline--fa.fa-sm {\n  vertical-align: -0.0714285705em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.2em;\n}\n.svg-inline--fa.fa-xl {\n  vertical-align: -0.25em;\n}\n.svg-inline--fa.fa-2xl {\n  vertical-align: -0.3125em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-li {\n  width: var(--fa-li-width, 2em);\n  top: 0.25em;\n}\n.svg-inline--fa.fa-fw {\n  width: var(--fa-fw-width, 1.25em);\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: var(--fa-counter-background-color, #ff253a);\n  border-radius: var(--fa-counter-border-radius, 1em);\n  box-sizing: border-box;\n  color: var(--fa-inverse, #fff);\n  line-height: var(--fa-counter-line-height, 1);\n  max-width: var(--fa-counter-max-width, 5em);\n  min-width: var(--fa-counter-min-width, 1.5em);\n  overflow: hidden;\n  padding: var(--fa-counter-padding, 0.25em 0.5em);\n  right: var(--fa-right, 0);\n  text-overflow: ellipsis;\n  top: var(--fa-top, 0);\n  -webkit-transform: scale(var(--fa-counter-scale, 0.25));\n          transform: scale(var(--fa-counter-scale, 0.25));\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: var(--fa-bottom, 0);\n  right: var(--fa-right, 0);\n  top: auto;\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: var(--fa-bottom, 0);\n  left: var(--fa-left, 0);\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  top: var(--fa-top, 0);\n  right: var(--fa-right, 0);\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: var(--fa-left, 0);\n  right: auto;\n  top: var(--fa-top, 0);\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-2xs {\n  font-size: 0.625em;\n  line-height: 0.1em;\n  vertical-align: 0.225em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n  line-height: 0.0833333337em;\n  vertical-align: 0.125em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n  line-height: 0.0714285718em;\n  vertical-align: 0.0535714295em;\n}\n\n.fa-lg {\n  font-size: 1.25em;\n  line-height: 0.05em;\n  vertical-align: -0.075em;\n}\n\n.fa-xl {\n  font-size: 1.5em;\n  line-height: 0.0416666682em;\n  vertical-align: -0.125em;\n}\n\n.fa-2xl {\n  font-size: 2em;\n  line-height: 0.03125em;\n  vertical-align: -0.1875em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: var(--fa-li-margin, 2.5em);\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: calc(var(--fa-li-width, 2em) * -1);\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit;\n}\n\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.08em);\n  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);\n}\n\n.fa-pull-left {\n  float: left;\n  margin-right: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-pull-right {\n  float: right;\n  margin-left: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-beat {\n  -webkit-animation-name: fa-beat;\n          animation-name: fa-beat;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);\n          animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-bounce {\n  -webkit-animation-name: fa-bounce;\n          animation-name: fa-bounce;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n}\n\n.fa-fade {\n  -webkit-animation-name: fa-fade;\n          animation-name: fa-fade;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-beat-fade {\n  -webkit-animation-name: fa-beat-fade;\n          animation-name: fa-beat-fade;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-flip {\n  -webkit-animation-name: fa-flip;\n          animation-name: fa-flip;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);\n          animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-shake {\n  -webkit-animation-name: fa-shake;\n          animation-name: fa-shake;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, linear);\n          animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin {\n  -webkit-animation-name: fa-spin;\n          animation-name: fa-spin;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 2s);\n          animation-duration: var(--fa-animation-duration, 2s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, linear);\n          animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse;\n}\n\n.fa-pulse,\n.fa-spin-pulse {\n  -webkit-animation-name: fa-spin;\n          animation-name: fa-spin;\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));\n          animation-timing-function: var(--fa-animation-timing, steps(8));\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n.fa-bounce,\n.fa-fade,\n.fa-beat-fade,\n.fa-flip,\n.fa-pulse,\n.fa-shake,\n.fa-spin,\n.fa-spin-pulse {\n    -webkit-animation-delay: -1ms;\n            animation-delay: -1ms;\n    -webkit-animation-duration: 1ms;\n            animation-duration: 1ms;\n    -webkit-animation-iteration-count: 1;\n            animation-iteration-count: 1;\n    transition-delay: 0s;\n    transition-duration: 0s;\n  }\n}\n@-webkit-keyframes fa-beat {\n  0%, 90% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  45% {\n    -webkit-transform: scale(var(--fa-beat-scale, 1.25));\n            transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@keyframes fa-beat {\n  0%, 90% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  45% {\n    -webkit-transform: scale(var(--fa-beat-scale, 1.25));\n            transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@-webkit-keyframes fa-bounce {\n  0% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n}\n@keyframes fa-bounce {\n  0% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n}\n@-webkit-keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@-webkit-keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));\n            transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));\n            transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@-webkit-keyframes fa-flip {\n  50% {\n    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@keyframes fa-flip {\n  50% {\n    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@-webkit-keyframes fa-shake {\n  0% {\n    -webkit-transform: rotate(-15deg);\n            transform: rotate(-15deg);\n  }\n  4% {\n    -webkit-transform: rotate(15deg);\n            transform: rotate(15deg);\n  }\n  8%, 24% {\n    -webkit-transform: rotate(-18deg);\n            transform: rotate(-18deg);\n  }\n  12%, 28% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n  }\n  16% {\n    -webkit-transform: rotate(-22deg);\n            transform: rotate(-22deg);\n  }\n  20% {\n    -webkit-transform: rotate(22deg);\n            transform: rotate(22deg);\n  }\n  32% {\n    -webkit-transform: rotate(-12deg);\n            transform: rotate(-12deg);\n  }\n  36% {\n    -webkit-transform: rotate(12deg);\n            transform: rotate(12deg);\n  }\n  40%, 100% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n}\n@keyframes fa-shake {\n  0% {\n    -webkit-transform: rotate(-15deg);\n            transform: rotate(-15deg);\n  }\n  4% {\n    -webkit-transform: rotate(15deg);\n            transform: rotate(15deg);\n  }\n  8%, 24% {\n    -webkit-transform: rotate(-18deg);\n            transform: rotate(-18deg);\n  }\n  12%, 28% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n  }\n  16% {\n    -webkit-transform: rotate(-22deg);\n            transform: rotate(-22deg);\n  }\n  20% {\n    -webkit-transform: rotate(22deg);\n            transform: rotate(22deg);\n  }\n  32% {\n    -webkit-transform: rotate(-12deg);\n            transform: rotate(-12deg);\n  }\n  36% {\n    -webkit-transform: rotate(12deg);\n            transform: rotate(12deg);\n  }\n  40%, 100% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n}\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n.fa-rotate-by {\n  -webkit-transform: rotate(var(--fa-rotate-angle, none));\n          transform: rotate(var(--fa-rotate-angle, none));\n}\n\n.fa-stack {\n  display: inline-block;\n  vertical-align: middle;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: var(--fa-stack-z-index, auto);\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}\n\n.sr-only,\n.fa-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.sr-only-focusable:not(:focus),\n.fa-sr-only-focusable:not(:focus) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse,\n.fa-duotone.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}";

    function css() {
      var dfp = DEFAULT_FAMILY_PREFIX;
      var drc = DEFAULT_REPLACEMENT_CLASS;
      var fp = config.familyPrefix;
      var rc = config.replacementClass;
      var s = baseStyles;

      if (fp !== dfp || rc !== drc) {
        var dPatt = new RegExp("\\.".concat(dfp, "\\-"), 'g');
        var customPropPatt = new RegExp("\\--".concat(dfp, "\\-"), 'g');
        var rPatt = new RegExp("\\.".concat(drc), 'g');
        s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
      }

      return s;
    }

    var _cssInserted = false;

    function ensureCss() {
      if (config.autoAddCss && !_cssInserted) {
        insertCss(css());
        _cssInserted = true;
      }
    }

    var InjectCSS = {
      mixout: function mixout() {
        return {
          dom: {
            css: css,
            insertCss: ensureCss
          }
        };
      },
      hooks: function hooks() {
        return {
          beforeDOMElementCreation: function beforeDOMElementCreation() {
            ensureCss();
          },
          beforeI2svg: function beforeI2svg() {
            ensureCss();
          }
        };
      }
    };

    var w = WINDOW || {};
    if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
    if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
    if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
    if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
    var namespace = w[NAMESPACE_IDENTIFIER];

    var functions = [];

    var listener = function listener() {
      DOCUMENT.removeEventListener('DOMContentLoaded', listener);
      loaded = 1;
      functions.map(function (fn) {
        return fn();
      });
    };

    var loaded = false;

    if (IS_DOM) {
      loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
      if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
    }

    function domready (fn) {
      if (!IS_DOM) return;
      loaded ? setTimeout(fn, 0) : functions.push(fn);
    }

    function toHtml(abstractNodes) {
      var tag = abstractNodes.tag,
          _abstractNodes$attrib = abstractNodes.attributes,
          attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib,
          _abstractNodes$childr = abstractNodes.children,
          children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;

      if (typeof abstractNodes === 'string') {
        return htmlEscape(abstractNodes);
      } else {
        return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(''), "</").concat(tag, ">");
      }
    }

    function iconFromMapping(mapping, prefix, iconName) {
      if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
        return {
          prefix: prefix,
          iconName: iconName,
          icon: mapping[prefix][iconName]
        };
      }
    }

    /**
     * Internal helper to bind a function known to have 4 arguments
     * to a given context.
     */

    var bindInternal4 = function bindInternal4(func, thisContext) {
      return function (a, b, c, d) {
        return func.call(thisContext, a, b, c, d);
      };
    };

    /**
     * # Reduce
     *
     * A fast object `.reduce()` implementation.
     *
     * @param  {Object}   subject      The object to reduce over.
     * @param  {Function} fn           The reducer function.
     * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
     * @param  {Object}   thisContext  The context for the reducer.
     * @return {mixed}                 The final result.
     */


    var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
      var keys = Object.keys(subject),
          length = keys.length,
          iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
          i,
          key,
          result;

      if (initialValue === undefined) {
        i = 1;
        result = subject[keys[0]];
      } else {
        i = 0;
        result = initialValue;
      }

      for (; i < length; i++) {
        key = keys[i];
        result = iterator(result, subject[key], key, subject);
      }

      return result;
    };

    /**
     * ucs2decode() and codePointAt() are both works of Mathias Bynens and licensed under MIT
     *
     * Copyright Mathias Bynens <https://mathiasbynens.be/>

     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:

     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.

     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    function ucs2decode(string) {
      var output = [];
      var counter = 0;
      var length = string.length;

      while (counter < length) {
        var value = string.charCodeAt(counter++);

        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
          var extra = string.charCodeAt(counter++);

          if ((extra & 0xFC00) == 0xDC00) {
            // eslint-disable-line eqeqeq
            output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
          } else {
            output.push(value);
            counter--;
          }
        } else {
          output.push(value);
        }
      }

      return output;
    }

    function toHex(unicode) {
      var decoded = ucs2decode(unicode);
      return decoded.length === 1 ? decoded[0].toString(16) : null;
    }
    function codePointAt(string, index) {
      var size = string.length;
      var first = string.charCodeAt(index);
      var second;

      if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
        second = string.charCodeAt(index + 1);

        if (second >= 0xDC00 && second <= 0xDFFF) {
          return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
        }
      }

      return first;
    }

    function normalizeIcons(icons) {
      return Object.keys(icons).reduce(function (acc, iconName) {
        var icon = icons[iconName];
        var expanded = !!icon.icon;

        if (expanded) {
          acc[icon.iconName] = icon.icon;
        } else {
          acc[iconName] = icon;
        }

        return acc;
      }, {});
    }

    function defineIcons(prefix, icons) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _params$skipHooks = params.skipHooks,
          skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
      var normalized = normalizeIcons(icons);

      if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
        namespace.hooks.addPack(prefix, normalizeIcons(icons));
      } else {
        namespace.styles[prefix] = _objectSpread2(_objectSpread2({}, namespace.styles[prefix] || {}), normalized);
      }
      /**
       * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
       * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
       * for `fas` so we'll ease the upgrade process for our users by automatically defining
       * this as well.
       */


      if (prefix === 'fas') {
        defineIcons('fa', icons);
      }
    }

    var styles = namespace.styles,
        shims = namespace.shims;
    var LONG_STYLE = Object.values(PREFIX_TO_LONG_STYLE);
    var _defaultUsablePrefix = null;
    var _byUnicode = {};
    var _byLigature = {};
    var _byOldName = {};
    var _byOldUnicode = {};
    var _byAlias = {};
    var PREFIXES = Object.keys(PREFIX_TO_STYLE);

    function isReserved(name) {
      return ~RESERVED_CLASSES.indexOf(name);
    }

    function getIconName(familyPrefix, cls) {
      var parts = cls.split('-');
      var prefix = parts[0];
      var iconName = parts.slice(1).join('-');

      if (prefix === familyPrefix && iconName !== '' && !isReserved(iconName)) {
        return iconName;
      } else {
        return null;
      }
    }
    var build = function build() {
      var lookup = function lookup(reducer) {
        return reduce(styles, function (o, style, prefix) {
          o[prefix] = reduce(style, reducer, {});
          return o;
        }, {});
      };

      _byUnicode = lookup(function (acc, icon, iconName) {
        if (icon[3]) {
          acc[icon[3]] = iconName;
        }

        if (icon[2]) {
          var aliases = icon[2].filter(function (a) {
            return typeof a === 'number';
          });
          aliases.forEach(function (alias) {
            acc[alias.toString(16)] = iconName;
          });
        }

        return acc;
      });
      _byLigature = lookup(function (acc, icon, iconName) {
        acc[iconName] = iconName;

        if (icon[2]) {
          var aliases = icon[2].filter(function (a) {
            return typeof a === 'string';
          });
          aliases.forEach(function (alias) {
            acc[alias] = iconName;
          });
        }

        return acc;
      });
      _byAlias = lookup(function (acc, icon, iconName) {
        var aliases = icon[2];
        acc[iconName] = iconName;
        aliases.forEach(function (alias) {
          acc[alias] = iconName;
        });
        return acc;
      }); // If we have a Kit, we can't determine if regular is available since we
      // could be auto-fetching it. We'll have to assume that it is available.

      var hasRegular = 'far' in styles || config.autoFetchSvg;
      var shimLookups = reduce(shims, function (acc, shim) {
        var maybeNameMaybeUnicode = shim[0];
        var prefix = shim[1];
        var iconName = shim[2];

        if (prefix === 'far' && !hasRegular) {
          prefix = 'fas';
        }

        if (typeof maybeNameMaybeUnicode === 'string') {
          acc.names[maybeNameMaybeUnicode] = {
            prefix: prefix,
            iconName: iconName
          };
        }

        if (typeof maybeNameMaybeUnicode === 'number') {
          acc.unicodes[maybeNameMaybeUnicode.toString(16)] = {
            prefix: prefix,
            iconName: iconName
          };
        }

        return acc;
      }, {
        names: {},
        unicodes: {}
      });
      _byOldName = shimLookups.names;
      _byOldUnicode = shimLookups.unicodes;
      _defaultUsablePrefix = getCanonicalPrefix(config.styleDefault);
    };
    onChange(function (c) {
      _defaultUsablePrefix = getCanonicalPrefix(c.styleDefault);
    });
    build();
    function byUnicode(prefix, unicode) {
      return (_byUnicode[prefix] || {})[unicode];
    }
    function byLigature(prefix, ligature) {
      return (_byLigature[prefix] || {})[ligature];
    }
    function byAlias(prefix, alias) {
      return (_byAlias[prefix] || {})[alias];
    }
    function byOldName(name) {
      return _byOldName[name] || {
        prefix: null,
        iconName: null
      };
    }
    function byOldUnicode(unicode) {
      var oldUnicode = _byOldUnicode[unicode];
      var newUnicode = byUnicode('fas', unicode);
      return oldUnicode || (newUnicode ? {
        prefix: 'fas',
        iconName: newUnicode
      } : null) || {
        prefix: null,
        iconName: null
      };
    }
    function getDefaultUsablePrefix() {
      return _defaultUsablePrefix;
    }
    var emptyCanonicalIcon = function emptyCanonicalIcon() {
      return {
        prefix: null,
        iconName: null,
        rest: []
      };
    };
    function getCanonicalPrefix(styleOrPrefix) {
      var style = PREFIX_TO_STYLE[styleOrPrefix];
      var prefix = STYLE_TO_PREFIX[styleOrPrefix] || STYLE_TO_PREFIX[style];
      var defined = styleOrPrefix in namespace.styles ? styleOrPrefix : null;
      return prefix || defined || null;
    }
    function getCanonicalIcon(values) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _params$skipLookups = params.skipLookups,
          skipLookups = _params$skipLookups === void 0 ? false : _params$skipLookups;
      var givenPrefix = null;
      var canonical = values.reduce(function (acc, cls) {
        var iconName = getIconName(config.familyPrefix, cls);

        if (styles[cls]) {
          cls = LONG_STYLE.includes(cls) ? LONG_STYLE_TO_PREFIX[cls] : cls;
          givenPrefix = cls;
          acc.prefix = cls;
        } else if (PREFIXES.indexOf(cls) > -1) {
          givenPrefix = cls;
          acc.prefix = getCanonicalPrefix(cls);
        } else if (iconName) {
          acc.iconName = iconName;
        } else if (cls !== config.replacementClass) {
          acc.rest.push(cls);
        }

        if (!skipLookups && acc.prefix && acc.iconName) {
          var shim = givenPrefix === 'fa' ? byOldName(acc.iconName) : {};
          var aliasIconName = byAlias(acc.prefix, acc.iconName);

          if (shim.prefix) {
            givenPrefix = null;
          }

          acc.iconName = shim.iconName || aliasIconName || acc.iconName;
          acc.prefix = shim.prefix || acc.prefix;

          if (acc.prefix === 'far' && !styles['far'] && styles['fas'] && !config.autoFetchSvg) {
            // Allow a fallback from the regular style to solid if regular is not available
            // but only if we aren't auto-fetching SVGs
            acc.prefix = 'fas';
          }
        }

        return acc;
      }, emptyCanonicalIcon());

      if (canonical.prefix === 'fa' || givenPrefix === 'fa') {
        // The fa prefix is not canonical. So if it has made it through until this point
        // we will shift it to the correct prefix.
        canonical.prefix = getDefaultUsablePrefix() || 'fas';
      }

      return canonical;
    }

    var Library = /*#__PURE__*/function () {
      function Library() {
        _classCallCheck(this, Library);

        this.definitions = {};
      }

      _createClass(Library, [{
        key: "add",
        value: function add() {
          var _this = this;

          for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
            definitions[_key] = arguments[_key];
          }

          var additions = definitions.reduce(this._pullDefinitions, {});
          Object.keys(additions).forEach(function (key) {
            _this.definitions[key] = _objectSpread2(_objectSpread2({}, _this.definitions[key] || {}), additions[key]);
            defineIcons(key, additions[key]);
            var longPrefix = PREFIX_TO_LONG_STYLE[key];
            if (longPrefix) defineIcons(longPrefix, additions[key]);
            build();
          });
        }
      }, {
        key: "reset",
        value: function reset() {
          this.definitions = {};
        }
      }, {
        key: "_pullDefinitions",
        value: function _pullDefinitions(additions, definition) {
          var normalized = definition.prefix && definition.iconName && definition.icon ? {
            0: definition
          } : definition;
          Object.keys(normalized).map(function (key) {
            var _normalized$key = normalized[key],
                prefix = _normalized$key.prefix,
                iconName = _normalized$key.iconName,
                icon = _normalized$key.icon;
            var aliases = icon[2];
            if (!additions[prefix]) additions[prefix] = {};

            if (aliases.length > 0) {
              aliases.forEach(function (alias) {
                if (typeof alias === 'string') {
                  additions[prefix][alias] = icon;
                }
              });
            }

            additions[prefix][iconName] = icon;
          });
          return additions;
        }
      }]);

      return Library;
    }();

    var _plugins = [];
    var _hooks = {};
    var providers = {};
    var defaultProviderKeys = Object.keys(providers);
    function registerPlugins(nextPlugins, _ref) {
      var obj = _ref.mixoutsTo;
      _plugins = nextPlugins;
      _hooks = {};
      Object.keys(providers).forEach(function (k) {
        if (defaultProviderKeys.indexOf(k) === -1) {
          delete providers[k];
        }
      });

      _plugins.forEach(function (plugin) {
        var mixout = plugin.mixout ? plugin.mixout() : {};
        Object.keys(mixout).forEach(function (tk) {
          if (typeof mixout[tk] === 'function') {
            obj[tk] = mixout[tk];
          }

          if (_typeof(mixout[tk]) === 'object') {
            Object.keys(mixout[tk]).forEach(function (sk) {
              if (!obj[tk]) {
                obj[tk] = {};
              }

              obj[tk][sk] = mixout[tk][sk];
            });
          }
        });

        if (plugin.hooks) {
          var hooks = plugin.hooks();
          Object.keys(hooks).forEach(function (hook) {
            if (!_hooks[hook]) {
              _hooks[hook] = [];
            }

            _hooks[hook].push(hooks[hook]);
          });
        }

        if (plugin.provides) {
          plugin.provides(providers);
        }
      });

      return obj;
    }
    function chainHooks(hook, accumulator) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      var hookFns = _hooks[hook] || [];
      hookFns.forEach(function (hookFn) {
        accumulator = hookFn.apply(null, [accumulator].concat(args)); // eslint-disable-line no-useless-call
      });
      return accumulator;
    }
    function callHooks(hook) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var hookFns = _hooks[hook] || [];
      hookFns.forEach(function (hookFn) {
        hookFn.apply(null, args);
      });
      return undefined;
    }
    function callProvided() {
      var hook = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1);
      return providers[hook] ? providers[hook].apply(null, args) : undefined;
    }

    function findIconDefinition(iconLookup) {
      if (iconLookup.prefix === 'fa') {
        iconLookup.prefix = 'fas';
      }

      var iconName = iconLookup.iconName;
      var prefix = iconLookup.prefix || getDefaultUsablePrefix();
      if (!iconName) return;
      iconName = byAlias(prefix, iconName) || iconName;
      return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
    }
    var library = new Library();
    var noAuto = function noAuto() {
      config.autoReplaceSvg = false;
      config.observeMutations = false;
      callHooks('noAuto');
    };
    var dom = {
      i2svg: function i2svg() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (IS_DOM) {
          callHooks('beforeI2svg', params);
          callProvided('pseudoElements2svg', params);
          return callProvided('i2svg', params);
        } else {
          return Promise.reject('Operation requires a DOM of some kind.');
        }
      },
      watch: function watch() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var autoReplaceSvgRoot = params.autoReplaceSvgRoot;

        if (config.autoReplaceSvg === false) {
          config.autoReplaceSvg = true;
        }

        config.observeMutations = true;
        domready(function () {
          autoReplace({
            autoReplaceSvgRoot: autoReplaceSvgRoot
          });
          callHooks('watch', params);
        });
      }
    };
    var parse = {
      icon: function icon(_icon) {
        if (_icon === null) {
          return null;
        }

        if (_typeof(_icon) === 'object' && _icon.prefix && _icon.iconName) {
          return {
            prefix: _icon.prefix,
            iconName: byAlias(_icon.prefix, _icon.iconName) || _icon.iconName
          };
        }

        if (Array.isArray(_icon) && _icon.length === 2) {
          var iconName = _icon[1].indexOf('fa-') === 0 ? _icon[1].slice(3) : _icon[1];
          var prefix = getCanonicalPrefix(_icon[0]);
          return {
            prefix: prefix,
            iconName: byAlias(prefix, iconName) || iconName
          };
        }

        if (typeof _icon === 'string' && (_icon.indexOf("".concat(config.familyPrefix, "-")) > -1 || _icon.match(ICON_SELECTION_SYNTAX_PATTERN))) {
          var canonicalIcon = getCanonicalIcon(_icon.split(' '), {
            skipLookups: true
          });
          return {
            prefix: canonicalIcon.prefix || getDefaultUsablePrefix(),
            iconName: byAlias(canonicalIcon.prefix, canonicalIcon.iconName) || canonicalIcon.iconName
          };
        }

        if (typeof _icon === 'string') {
          var _prefix = getDefaultUsablePrefix();

          return {
            prefix: _prefix,
            iconName: byAlias(_prefix, _icon) || _icon
          };
        }
      }
    };
    var api = {
      noAuto: noAuto,
      config: config,
      dom: dom,
      parse: parse,
      library: library,
      findIconDefinition: findIconDefinition,
      toHtml: toHtml
    };

    var autoReplace = function autoReplace() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _params$autoReplaceSv = params.autoReplaceSvgRoot,
          autoReplaceSvgRoot = _params$autoReplaceSv === void 0 ? DOCUMENT : _params$autoReplaceSv;
      if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg) api.dom.i2svg({
        node: autoReplaceSvgRoot
      });
    };

    function domVariants(val, abstractCreator) {
      Object.defineProperty(val, 'abstract', {
        get: abstractCreator
      });
      Object.defineProperty(val, 'html', {
        get: function get() {
          return val.abstract.map(function (a) {
            return toHtml(a);
          });
        }
      });
      Object.defineProperty(val, 'node', {
        get: function get() {
          if (!IS_DOM) return;
          var container = DOCUMENT.createElement('div');
          container.innerHTML = val.html;
          return container.children;
        }
      });
      return val;
    }

    function asIcon (_ref) {
      var children = _ref.children,
          main = _ref.main,
          mask = _ref.mask,
          attributes = _ref.attributes,
          styles = _ref.styles,
          transform = _ref.transform;

      if (transformIsMeaningful(transform) && main.found && !mask.found) {
        var width = main.width,
            height = main.height;
        var offset = {
          x: width / height / 2,
          y: 0.5
        };
        attributes['style'] = joinStyles(_objectSpread2(_objectSpread2({}, styles), {}, {
          'transform-origin': "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
        }));
      }

      return [{
        tag: 'svg',
        attributes: attributes,
        children: children
      }];
    }

    function asSymbol (_ref) {
      var prefix = _ref.prefix,
          iconName = _ref.iconName,
          children = _ref.children,
          attributes = _ref.attributes,
          symbol = _ref.symbol;
      var id = symbol === true ? "".concat(prefix, "-").concat(config.familyPrefix, "-").concat(iconName) : symbol;
      return [{
        tag: 'svg',
        attributes: {
          style: 'display: none;'
        },
        children: [{
          tag: 'symbol',
          attributes: _objectSpread2(_objectSpread2({}, attributes), {}, {
            id: id
          }),
          children: children
        }]
      }];
    }

    function makeInlineSvgAbstract(params) {
      var _params$icons = params.icons,
          main = _params$icons.main,
          mask = _params$icons.mask,
          prefix = params.prefix,
          iconName = params.iconName,
          transform = params.transform,
          symbol = params.symbol,
          title = params.title,
          maskId = params.maskId,
          titleId = params.titleId,
          extra = params.extra,
          _params$watchable = params.watchable,
          watchable = _params$watchable === void 0 ? false : _params$watchable;

      var _ref = mask.found ? mask : main,
          width = _ref.width,
          height = _ref.height;

      var isUploadedIcon = prefix === 'fak';
      var attrClass = [config.replacementClass, iconName ? "".concat(config.familyPrefix, "-").concat(iconName) : ''].filter(function (c) {
        return extra.classes.indexOf(c) === -1;
      }).filter(function (c) {
        return c !== '' || !!c;
      }).concat(extra.classes).join(' ');
      var content = {
        children: [],
        attributes: _objectSpread2(_objectSpread2({}, extra.attributes), {}, {
          'data-prefix': prefix,
          'data-icon': iconName,
          'class': attrClass,
          'role': extra.attributes.role || 'img',
          'xmlns': 'http://www.w3.org/2000/svg',
          'viewBox': "0 0 ".concat(width, " ").concat(height)
        })
      };
      var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf('fa-fw') ? {
        width: "".concat(width / height * 16 * 0.0625, "em")
      } : {};

      if (watchable) {
        content.attributes[DATA_FA_I2SVG] = '';
      }

      if (title) {
        content.children.push({
          tag: 'title',
          attributes: {
            id: content.attributes['aria-labelledby'] || "title-".concat(titleId || nextUniqueId())
          },
          children: [title]
        });
        delete content.attributes.title;
      }

      var args = _objectSpread2(_objectSpread2({}, content), {}, {
        prefix: prefix,
        iconName: iconName,
        main: main,
        mask: mask,
        maskId: maskId,
        transform: transform,
        symbol: symbol,
        styles: _objectSpread2(_objectSpread2({}, uploadedIconWidthStyle), extra.styles)
      });

      var _ref2 = mask.found && main.found ? callProvided('generateAbstractMask', args) || {
        children: [],
        attributes: {}
      } : callProvided('generateAbstractIcon', args) || {
        children: [],
        attributes: {}
      },
          children = _ref2.children,
          attributes = _ref2.attributes;

      args.children = children;
      args.attributes = attributes;

      if (symbol) {
        return asSymbol(args);
      } else {
        return asIcon(args);
      }
    }
    function makeLayersTextAbstract(params) {
      var content = params.content,
          width = params.width,
          height = params.height,
          transform = params.transform,
          title = params.title,
          extra = params.extra,
          _params$watchable2 = params.watchable,
          watchable = _params$watchable2 === void 0 ? false : _params$watchable2;

      var attributes = _objectSpread2(_objectSpread2(_objectSpread2({}, extra.attributes), title ? {
        'title': title
      } : {}), {}, {
        'class': extra.classes.join(' ')
      });

      if (watchable) {
        attributes[DATA_FA_I2SVG] = '';
      }

      var styles = _objectSpread2({}, extra.styles);

      if (transformIsMeaningful(transform)) {
        styles['transform'] = transformForCss({
          transform: transform,
          startCentered: true,
          width: width,
          height: height
        });
        styles['-webkit-transform'] = styles['transform'];
      }

      var styleString = joinStyles(styles);

      if (styleString.length > 0) {
        attributes['style'] = styleString;
      }

      var val = [];
      val.push({
        tag: 'span',
        attributes: attributes,
        children: [content]
      });

      if (title) {
        val.push({
          tag: 'span',
          attributes: {
            class: 'sr-only'
          },
          children: [title]
        });
      }

      return val;
    }
    function makeLayersCounterAbstract(params) {
      var content = params.content,
          title = params.title,
          extra = params.extra;

      var attributes = _objectSpread2(_objectSpread2(_objectSpread2({}, extra.attributes), title ? {
        'title': title
      } : {}), {}, {
        'class': extra.classes.join(' ')
      });

      var styleString = joinStyles(extra.styles);

      if (styleString.length > 0) {
        attributes['style'] = styleString;
      }

      var val = [];
      val.push({
        tag: 'span',
        attributes: attributes,
        children: [content]
      });

      if (title) {
        val.push({
          tag: 'span',
          attributes: {
            class: 'sr-only'
          },
          children: [title]
        });
      }

      return val;
    }

    var styles$1 = namespace.styles;
    function asFoundIcon(icon) {
      var width = icon[0];
      var height = icon[1];

      var _icon$slice = icon.slice(4),
          _icon$slice2 = _slicedToArray(_icon$slice, 1),
          vectorData = _icon$slice2[0];

      var element = null;

      if (Array.isArray(vectorData)) {
        element = {
          tag: 'g',
          attributes: {
            class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
          },
          children: [{
            tag: 'path',
            attributes: {
              class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
              fill: 'currentColor',
              d: vectorData[0]
            }
          }, {
            tag: 'path',
            attributes: {
              class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
              fill: 'currentColor',
              d: vectorData[1]
            }
          }]
        };
      } else {
        element = {
          tag: 'path',
          attributes: {
            fill: 'currentColor',
            d: vectorData
          }
        };
      }

      return {
        found: true,
        width: width,
        height: height,
        icon: element
      };
    }
    var missingIconResolutionMixin = {
      found: false,
      width: 512,
      height: 512
    };

    function maybeNotifyMissing(iconName, prefix) {
      if (!PRODUCTION && !config.showMissingIcons && iconName) {
        console.error("Icon with name \"".concat(iconName, "\" and prefix \"").concat(prefix, "\" is missing."));
      }
    }

    function findIcon(iconName, prefix) {
      var givenPrefix = prefix;

      if (prefix === 'fa' && config.styleDefault !== null) {
        prefix = getDefaultUsablePrefix();
      }

      return new Promise(function (resolve, reject) {
        var val = {
          found: false,
          width: 512,
          height: 512,
          icon: callProvided('missingIconAbstract') || {}
        };

        if (givenPrefix === 'fa') {
          var shim = byOldName(iconName) || {};
          iconName = shim.iconName || iconName;
          prefix = shim.prefix || prefix;
        }

        if (iconName && prefix && styles$1[prefix] && styles$1[prefix][iconName]) {
          var icon = styles$1[prefix][iconName];
          return resolve(asFoundIcon(icon));
        }

        maybeNotifyMissing(iconName, prefix);
        resolve(_objectSpread2(_objectSpread2({}, missingIconResolutionMixin), {}, {
          icon: config.showMissingIcons && iconName ? callProvided('missingIconAbstract') || {} : {}
        }));
      });
    }

    var noop$1$1 = function noop() {};

    var p = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
      mark: noop$1$1,
      measure: noop$1$1
    };
    var preamble = "FA \"6.1.1\"";

    var begin = function begin(name) {
      p.mark("".concat(preamble, " ").concat(name, " begins"));
      return function () {
        return end(name);
      };
    };

    var end = function end(name) {
      p.mark("".concat(preamble, " ").concat(name, " ends"));
      p.measure("".concat(preamble, " ").concat(name), "".concat(preamble, " ").concat(name, " begins"), "".concat(preamble, " ").concat(name, " ends"));
    };

    var perf = {
      begin: begin,
      end: end
    };

    var noop$2 = function noop() {};

    function isWatched(node) {
      var i2svg = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;
      return typeof i2svg === 'string';
    }

    function hasPrefixAndIcon(node) {
      var prefix = node.getAttribute ? node.getAttribute(DATA_PREFIX) : null;
      var icon = node.getAttribute ? node.getAttribute(DATA_ICON) : null;
      return prefix && icon;
    }

    function hasBeenReplaced(node) {
      return node && node.classList && node.classList.contains && node.classList.contains(config.replacementClass);
    }

    function getMutator() {
      if (config.autoReplaceSvg === true) {
        return mutators.replace;
      }

      var mutator = mutators[config.autoReplaceSvg];
      return mutator || mutators.replace;
    }

    function createElementNS(tag) {
      return DOCUMENT.createElementNS('http://www.w3.org/2000/svg', tag);
    }

    function createElement(tag) {
      return DOCUMENT.createElement(tag);
    }

    function convertSVG(abstractObj) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _params$ceFn = params.ceFn,
          ceFn = _params$ceFn === void 0 ? abstractObj.tag === 'svg' ? createElementNS : createElement : _params$ceFn;

      if (typeof abstractObj === 'string') {
        return DOCUMENT.createTextNode(abstractObj);
      }

      var tag = ceFn(abstractObj.tag);
      Object.keys(abstractObj.attributes || []).forEach(function (key) {
        tag.setAttribute(key, abstractObj.attributes[key]);
      });
      var children = abstractObj.children || [];
      children.forEach(function (child) {
        tag.appendChild(convertSVG(child, {
          ceFn: ceFn
        }));
      });
      return tag;
    }

    function nodeAsComment(node) {
      var comment = " ".concat(node.outerHTML, " ");
      /* BEGIN.ATTRIBUTION */

      comment = "".concat(comment, "Font Awesome fontawesome.com ");
      /* END.ATTRIBUTION */

      return comment;
    }

    var mutators = {
      replace: function replace(mutation) {
        var node = mutation[0];

        if (node.parentNode) {
          mutation[1].forEach(function (abstract) {
            node.parentNode.insertBefore(convertSVG(abstract), node);
          });

          if (node.getAttribute(DATA_FA_I2SVG) === null && config.keepOriginalSource) {
            var comment = DOCUMENT.createComment(nodeAsComment(node));
            node.parentNode.replaceChild(comment, node);
          } else {
            node.remove();
          }
        }
      },
      nest: function nest(mutation) {
        var node = mutation[0];
        var abstract = mutation[1]; // If we already have a replaced node we do not want to continue nesting within it.
        // Short-circuit to the standard replacement

        if (~classArray(node).indexOf(config.replacementClass)) {
          return mutators.replace(mutation);
        }

        var forSvg = new RegExp("".concat(config.familyPrefix, "-.*"));
        delete abstract[0].attributes.id;

        if (abstract[0].attributes.class) {
          var splitClasses = abstract[0].attributes.class.split(' ').reduce(function (acc, cls) {
            if (cls === config.replacementClass || cls.match(forSvg)) {
              acc.toSvg.push(cls);
            } else {
              acc.toNode.push(cls);
            }

            return acc;
          }, {
            toNode: [],
            toSvg: []
          });
          abstract[0].attributes.class = splitClasses.toSvg.join(' ');

          if (splitClasses.toNode.length === 0) {
            node.removeAttribute('class');
          } else {
            node.setAttribute('class', splitClasses.toNode.join(' '));
          }
        }

        var newInnerHTML = abstract.map(function (a) {
          return toHtml(a);
        }).join('\n');
        node.setAttribute(DATA_FA_I2SVG, '');
        node.innerHTML = newInnerHTML;
      }
    };

    function performOperationSync(op) {
      op();
    }

    function perform(mutations, callback) {
      var callbackFunction = typeof callback === 'function' ? callback : noop$2;

      if (mutations.length === 0) {
        callbackFunction();
      } else {
        var frame = performOperationSync;

        if (config.mutateApproach === MUTATION_APPROACH_ASYNC) {
          frame = WINDOW.requestAnimationFrame || performOperationSync;
        }

        frame(function () {
          var mutator = getMutator();
          var mark = perf.begin('mutate');
          mutations.map(mutator);
          mark();
          callbackFunction();
        });
      }
    }
    var disabled = false;
    function disableObservation() {
      disabled = true;
    }
    function enableObservation() {
      disabled = false;
    }
    var mo = null;
    function observe(options) {
      if (!MUTATION_OBSERVER) {
        return;
      }

      if (!config.observeMutations) {
        return;
      }

      var _options$treeCallback = options.treeCallback,
          treeCallback = _options$treeCallback === void 0 ? noop$2 : _options$treeCallback,
          _options$nodeCallback = options.nodeCallback,
          nodeCallback = _options$nodeCallback === void 0 ? noop$2 : _options$nodeCallback,
          _options$pseudoElemen = options.pseudoElementsCallback,
          pseudoElementsCallback = _options$pseudoElemen === void 0 ? noop$2 : _options$pseudoElemen,
          _options$observeMutat = options.observeMutationsRoot,
          observeMutationsRoot = _options$observeMutat === void 0 ? DOCUMENT : _options$observeMutat;
      mo = new MUTATION_OBSERVER(function (objects) {
        if (disabled) return;
        var defaultPrefix = getDefaultUsablePrefix();
        toArray(objects).forEach(function (mutationRecord) {
          if (mutationRecord.type === 'childList' && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
            if (config.searchPseudoElements) {
              pseudoElementsCallback(mutationRecord.target);
            }

            treeCallback(mutationRecord.target);
          }

          if (mutationRecord.type === 'attributes' && mutationRecord.target.parentNode && config.searchPseudoElements) {
            pseudoElementsCallback(mutationRecord.target.parentNode);
          }

          if (mutationRecord.type === 'attributes' && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
            if (mutationRecord.attributeName === 'class' && hasPrefixAndIcon(mutationRecord.target)) {
              var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)),
                  prefix = _getCanonicalIcon.prefix,
                  iconName = _getCanonicalIcon.iconName;

              mutationRecord.target.setAttribute(DATA_PREFIX, prefix || defaultPrefix);
              if (iconName) mutationRecord.target.setAttribute(DATA_ICON, iconName);
            } else if (hasBeenReplaced(mutationRecord.target)) {
              nodeCallback(mutationRecord.target);
            }
          }
        });
      });
      if (!IS_DOM) return;
      mo.observe(observeMutationsRoot, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
      });
    }
    function disconnect() {
      if (!mo) return;
      mo.disconnect();
    }

    function styleParser (node) {
      var style = node.getAttribute('style');
      var val = [];

      if (style) {
        val = style.split(';').reduce(function (acc, style) {
          var styles = style.split(':');
          var prop = styles[0];
          var value = styles.slice(1);

          if (prop && value.length > 0) {
            acc[prop] = value.join(':').trim();
          }

          return acc;
        }, {});
      }

      return val;
    }

    function classParser (node) {
      var existingPrefix = node.getAttribute('data-prefix');
      var existingIconName = node.getAttribute('data-icon');
      var innerText = node.innerText !== undefined ? node.innerText.trim() : '';
      var val = getCanonicalIcon(classArray(node));

      if (!val.prefix) {
        val.prefix = getDefaultUsablePrefix();
      }

      if (existingPrefix && existingIconName) {
        val.prefix = existingPrefix;
        val.iconName = existingIconName;
      }

      if (val.iconName && val.prefix) {
        return val;
      }

      if (val.prefix && innerText.length > 0) {
        val.iconName = byLigature(val.prefix, node.innerText) || byUnicode(val.prefix, toHex(node.innerText));
      }

      return val;
    }

    function attributesParser (node) {
      var extraAttributes = toArray(node.attributes).reduce(function (acc, attr) {
        if (acc.name !== 'class' && acc.name !== 'style') {
          acc[attr.name] = attr.value;
        }

        return acc;
      }, {});
      var title = node.getAttribute('title');
      var titleId = node.getAttribute('data-fa-title-id');

      if (config.autoA11y) {
        if (title) {
          extraAttributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
        } else {
          extraAttributes['aria-hidden'] = 'true';
          extraAttributes['focusable'] = 'false';
        }
      }

      return extraAttributes;
    }

    function blankMeta() {
      return {
        iconName: null,
        title: null,
        titleId: null,
        prefix: null,
        transform: meaninglessTransform,
        symbol: false,
        mask: {
          iconName: null,
          prefix: null,
          rest: []
        },
        maskId: null,
        extra: {
          classes: [],
          styles: {},
          attributes: {}
        }
      };
    }
    function parseMeta(node) {
      var parser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        styleParser: true
      };

      var _classParser = classParser(node),
          iconName = _classParser.iconName,
          prefix = _classParser.prefix,
          extraClasses = _classParser.rest;

      var extraAttributes = attributesParser(node);
      var pluginMeta = chainHooks('parseNodeAttributes', {}, node);
      var extraStyles = parser.styleParser ? styleParser(node) : [];
      return _objectSpread2({
        iconName: iconName,
        title: node.getAttribute('title'),
        titleId: node.getAttribute('data-fa-title-id'),
        prefix: prefix,
        transform: meaninglessTransform,
        mask: {
          iconName: null,
          prefix: null,
          rest: []
        },
        maskId: null,
        symbol: false,
        extra: {
          classes: extraClasses,
          styles: extraStyles,
          attributes: extraAttributes
        }
      }, pluginMeta);
    }

    var styles$2 = namespace.styles;

    function generateMutation(node) {
      var nodeMeta = config.autoReplaceSvg === 'nest' ? parseMeta(node, {
        styleParser: false
      }) : parseMeta(node);

      if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
        return callProvided('generateLayersText', node, nodeMeta);
      } else {
        return callProvided('generateSvgReplacementMutation', node, nodeMeta);
      }
    }

    function onTree(root) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (!IS_DOM) return Promise.resolve();
      var htmlClassList = DOCUMENT.documentElement.classList;

      var hclAdd = function hclAdd(suffix) {
        return htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
      };

      var hclRemove = function hclRemove(suffix) {
        return htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
      };

      var prefixes = config.autoFetchSvg ? Object.keys(PREFIX_TO_STYLE) : Object.keys(styles$2);
      var prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes.map(function (p) {
        return ".".concat(p, ":not([").concat(DATA_FA_I2SVG, "])");
      })).join(', ');

      if (prefixesDomQuery.length === 0) {
        return Promise.resolve();
      }

      var candidates = [];

      try {
        candidates = toArray(root.querySelectorAll(prefixesDomQuery));
      } catch (e) {// noop
      }

      if (candidates.length > 0) {
        hclAdd('pending');
        hclRemove('complete');
      } else {
        return Promise.resolve();
      }

      var mark = perf.begin('onTree');
      var mutations = candidates.reduce(function (acc, node) {
        try {
          var mutation = generateMutation(node);

          if (mutation) {
            acc.push(mutation);
          }
        } catch (e) {
          if (!PRODUCTION) {
            if (e.name === 'MissingIcon') {
              console.error(e);
            }
          }
        }

        return acc;
      }, []);
      return new Promise(function (resolve, reject) {
        Promise.all(mutations).then(function (resolvedMutations) {
          perform(resolvedMutations, function () {
            hclAdd('active');
            hclAdd('complete');
            hclRemove('pending');
            if (typeof callback === 'function') callback();
            mark();
            resolve();
          });
        }).catch(function (e) {
          mark();
          reject(e);
        });
      });
    }

    function onNode(node) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      generateMutation(node).then(function (mutation) {
        if (mutation) {
          perform([mutation], callback);
        }
      });
    }

    function resolveIcons(next) {
      return function (maybeIconDefinition) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
        var mask = params.mask;

        if (mask) {
          mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
        }

        return next(iconDefinition, _objectSpread2(_objectSpread2({}, params), {}, {
          mask: mask
        }));
      };
    }

    var render = function render(iconDefinition) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _params$transform = params.transform,
          transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
          _params$symbol = params.symbol,
          symbol = _params$symbol === void 0 ? false : _params$symbol,
          _params$mask = params.mask,
          mask = _params$mask === void 0 ? null : _params$mask,
          _params$maskId = params.maskId,
          maskId = _params$maskId === void 0 ? null : _params$maskId,
          _params$title = params.title,
          title = _params$title === void 0 ? null : _params$title,
          _params$titleId = params.titleId,
          titleId = _params$titleId === void 0 ? null : _params$titleId,
          _params$classes = params.classes,
          classes = _params$classes === void 0 ? [] : _params$classes,
          _params$attributes = params.attributes,
          attributes = _params$attributes === void 0 ? {} : _params$attributes,
          _params$styles = params.styles,
          styles = _params$styles === void 0 ? {} : _params$styles;
      if (!iconDefinition) return;
      var prefix = iconDefinition.prefix,
          iconName = iconDefinition.iconName,
          icon = iconDefinition.icon;
      return domVariants(_objectSpread2({
        type: 'icon'
      }, iconDefinition), function () {
        callHooks('beforeDOMElementCreation', {
          iconDefinition: iconDefinition,
          params: params
        });

        if (config.autoA11y) {
          if (title) {
            attributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
          } else {
            attributes['aria-hidden'] = 'true';
            attributes['focusable'] = 'false';
          }
        }

        return makeInlineSvgAbstract({
          icons: {
            main: asFoundIcon(icon),
            mask: mask ? asFoundIcon(mask.icon) : {
              found: false,
              width: null,
              height: null,
              icon: {}
            }
          },
          prefix: prefix,
          iconName: iconName,
          transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
          symbol: symbol,
          title: title,
          maskId: maskId,
          titleId: titleId,
          extra: {
            attributes: attributes,
            styles: styles,
            classes: classes
          }
        });
      });
    };
    var ReplaceElements = {
      mixout: function mixout() {
        return {
          icon: resolveIcons(render)
        };
      },
      hooks: function hooks() {
        return {
          mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
            accumulator.treeCallback = onTree;
            accumulator.nodeCallback = onNode;
            return accumulator;
          }
        };
      },
      provides: function provides(providers$$1) {
        providers$$1.i2svg = function (params) {
          var _params$node = params.node,
              node = _params$node === void 0 ? DOCUMENT : _params$node,
              _params$callback = params.callback,
              callback = _params$callback === void 0 ? function () {} : _params$callback;
          return onTree(node, callback);
        };

        providers$$1.generateSvgReplacementMutation = function (node, nodeMeta) {
          var iconName = nodeMeta.iconName,
              title = nodeMeta.title,
              titleId = nodeMeta.titleId,
              prefix = nodeMeta.prefix,
              transform = nodeMeta.transform,
              symbol = nodeMeta.symbol,
              mask = nodeMeta.mask,
              maskId = nodeMeta.maskId,
              extra = nodeMeta.extra;
          return new Promise(function (resolve, reject) {
            Promise.all([findIcon(iconName, prefix), mask.iconName ? findIcon(mask.iconName, mask.prefix) : Promise.resolve({
              found: false,
              width: 512,
              height: 512,
              icon: {}
            })]).then(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  main = _ref2[0],
                  mask = _ref2[1];

              resolve([node, makeInlineSvgAbstract({
                icons: {
                  main: main,
                  mask: mask
                },
                prefix: prefix,
                iconName: iconName,
                transform: transform,
                symbol: symbol,
                maskId: maskId,
                title: title,
                titleId: titleId,
                extra: extra,
                watchable: true
              })]);
            }).catch(reject);
          });
        };

        providers$$1.generateAbstractIcon = function (_ref3) {
          var children = _ref3.children,
              attributes = _ref3.attributes,
              main = _ref3.main,
              transform = _ref3.transform,
              styles = _ref3.styles;
          var styleString = joinStyles(styles);

          if (styleString.length > 0) {
            attributes['style'] = styleString;
          }

          var nextChild;

          if (transformIsMeaningful(transform)) {
            nextChild = callProvided('generateAbstractTransformGrouping', {
              main: main,
              transform: transform,
              containerWidth: main.width,
              iconWidth: main.width
            });
          }

          children.push(nextChild || main.icon);
          return {
            children: children,
            attributes: attributes
          };
        };
      }
    };

    var Layers = {
      mixout: function mixout() {
        return {
          layer: function layer(assembler) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var _params$classes = params.classes,
                classes = _params$classes === void 0 ? [] : _params$classes;
            return domVariants({
              type: 'layer'
            }, function () {
              callHooks('beforeDOMElementCreation', {
                assembler: assembler,
                params: params
              });
              var children = [];
              assembler(function (args) {
                Array.isArray(args) ? args.map(function (a) {
                  children = children.concat(a.abstract);
                }) : children = children.concat(args.abstract);
              });
              return [{
                tag: 'span',
                attributes: {
                  class: ["".concat(config.familyPrefix, "-layers")].concat(_toConsumableArray(classes)).join(' ')
                },
                children: children
              }];
            });
          }
        };
      }
    };

    var LayersCounter = {
      mixout: function mixout() {
        return {
          counter: function counter(content) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var _params$title = params.title,
                title = _params$title === void 0 ? null : _params$title,
                _params$classes = params.classes,
                classes = _params$classes === void 0 ? [] : _params$classes,
                _params$attributes = params.attributes,
                attributes = _params$attributes === void 0 ? {} : _params$attributes,
                _params$styles = params.styles,
                styles = _params$styles === void 0 ? {} : _params$styles;
            return domVariants({
              type: 'counter',
              content: content
            }, function () {
              callHooks('beforeDOMElementCreation', {
                content: content,
                params: params
              });
              return makeLayersCounterAbstract({
                content: content.toString(),
                title: title,
                extra: {
                  attributes: attributes,
                  styles: styles,
                  classes: ["".concat(config.familyPrefix, "-layers-counter")].concat(_toConsumableArray(classes))
                }
              });
            });
          }
        };
      }
    };

    var LayersText = {
      mixout: function mixout() {
        return {
          text: function text(content) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var _params$transform = params.transform,
                transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
                _params$title = params.title,
                title = _params$title === void 0 ? null : _params$title,
                _params$classes = params.classes,
                classes = _params$classes === void 0 ? [] : _params$classes,
                _params$attributes = params.attributes,
                attributes = _params$attributes === void 0 ? {} : _params$attributes,
                _params$styles = params.styles,
                styles = _params$styles === void 0 ? {} : _params$styles;
            return domVariants({
              type: 'text',
              content: content
            }, function () {
              callHooks('beforeDOMElementCreation', {
                content: content,
                params: params
              });
              return makeLayersTextAbstract({
                content: content,
                transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
                title: title,
                extra: {
                  attributes: attributes,
                  styles: styles,
                  classes: ["".concat(config.familyPrefix, "-layers-text")].concat(_toConsumableArray(classes))
                }
              });
            });
          }
        };
      },
      provides: function provides(providers$$1) {
        providers$$1.generateLayersText = function (node, nodeMeta) {
          var title = nodeMeta.title,
              transform = nodeMeta.transform,
              extra = nodeMeta.extra;
          var width = null;
          var height = null;

          if (IS_IE) {
            var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
            var boundingClientRect = node.getBoundingClientRect();
            width = boundingClientRect.width / computedFontSize;
            height = boundingClientRect.height / computedFontSize;
          }

          if (config.autoA11y && !title) {
            extra.attributes['aria-hidden'] = 'true';
          }

          return Promise.resolve([node, makeLayersTextAbstract({
            content: node.innerHTML,
            width: width,
            height: height,
            transform: transform,
            title: title,
            extra: extra,
            watchable: true
          })]);
        };
      }
    };

    var CLEAN_CONTENT_PATTERN = new RegExp("\"", 'ug');
    var SECONDARY_UNICODE_RANGE = [1105920, 1112319];
    function hexValueFromContent(content) {
      var cleaned = content.replace(CLEAN_CONTENT_PATTERN, '');
      var codePoint = codePointAt(cleaned, 0);
      var isPrependTen = codePoint >= SECONDARY_UNICODE_RANGE[0] && codePoint <= SECONDARY_UNICODE_RANGE[1];
      var isDoubled = cleaned.length === 2 ? cleaned[0] === cleaned[1] : false;
      return {
        value: isDoubled ? toHex(cleaned[0]) : toHex(cleaned),
        isSecondary: isPrependTen || isDoubled
      };
    }

    function replaceForPosition(node, position) {
      var pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(':', '-'));
      return new Promise(function (resolve, reject) {
        if (node.getAttribute(pendingAttribute) !== null) {
          // This node is already being processed
          return resolve();
        }

        var children = toArray(node.children);
        var alreadyProcessedPseudoElement = children.filter(function (c) {
          return c.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position;
        })[0];
        var styles = WINDOW.getComputedStyle(node, position);
        var fontFamily = styles.getPropertyValue('font-family').match(FONT_FAMILY_PATTERN);
        var fontWeight = styles.getPropertyValue('font-weight');
        var content = styles.getPropertyValue('content');

        if (alreadyProcessedPseudoElement && !fontFamily) {
          // If we've already processed it but the current computed style does not result in a font-family,
          // that probably means that a class name that was previously present to make the icon has been
          // removed. So we now should delete the icon.
          node.removeChild(alreadyProcessedPseudoElement);
          return resolve();
        } else if (fontFamily && content !== 'none' && content !== '') {
          var _content = styles.getPropertyValue('content');

          var prefix = ~['Solid', 'Regular', 'Light', 'Thin', 'Duotone', 'Brands', 'Kit'].indexOf(fontFamily[2]) ? STYLE_TO_PREFIX[fontFamily[2].toLowerCase()] : FONT_WEIGHT_TO_PREFIX[fontWeight];

          var _hexValueFromContent = hexValueFromContent(_content),
              hexValue = _hexValueFromContent.value,
              isSecondary = _hexValueFromContent.isSecondary;

          var isV4 = fontFamily[0].startsWith('FontAwesome');
          var iconName = byUnicode(prefix, hexValue);
          var iconIdentifier = iconName;

          if (isV4) {
            var iconName4 = byOldUnicode(hexValue);

            if (iconName4.iconName && iconName4.prefix) {
              iconName = iconName4.iconName;
              prefix = iconName4.prefix;
            }
          } // Only convert the pseudo element in this ::before/::after position into an icon if we haven't
          // already done so with the same prefix and iconName


          if (iconName && !isSecondary && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
            node.setAttribute(pendingAttribute, iconIdentifier);

            if (alreadyProcessedPseudoElement) {
              // Delete the old one, since we're replacing it with a new one
              node.removeChild(alreadyProcessedPseudoElement);
            }

            var meta = blankMeta();
            var extra = meta.extra;
            extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
            findIcon(iconName, prefix).then(function (main) {
              var abstract = makeInlineSvgAbstract(_objectSpread2(_objectSpread2({}, meta), {}, {
                icons: {
                  main: main,
                  mask: emptyCanonicalIcon()
                },
                prefix: prefix,
                iconName: iconIdentifier,
                extra: extra,
                watchable: true
              }));
              var element = DOCUMENT.createElement('svg');

              if (position === '::before') {
                node.insertBefore(element, node.firstChild);
              } else {
                node.appendChild(element);
              }

              element.outerHTML = abstract.map(function (a) {
                return toHtml(a);
              }).join('\n');
              node.removeAttribute(pendingAttribute);
              resolve();
            }).catch(reject);
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    }

    function replace(node) {
      return Promise.all([replaceForPosition(node, '::before'), replaceForPosition(node, '::after')]);
    }

    function processable(node) {
      return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== 'svg');
    }

    function searchPseudoElements(root) {
      if (!IS_DOM) return;
      return new Promise(function (resolve, reject) {
        var operations = toArray(root.querySelectorAll('*')).filter(processable).map(replace);
        var end = perf.begin('searchPseudoElements');
        disableObservation();
        Promise.all(operations).then(function () {
          end();
          enableObservation();
          resolve();
        }).catch(function () {
          end();
          enableObservation();
          reject();
        });
      });
    }

    var PseudoElements = {
      hooks: function hooks() {
        return {
          mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
            accumulator.pseudoElementsCallback = searchPseudoElements;
            return accumulator;
          }
        };
      },
      provides: function provides(providers$$1) {
        providers$$1.pseudoElements2svg = function (params) {
          var _params$node = params.node,
              node = _params$node === void 0 ? DOCUMENT : _params$node;

          if (config.searchPseudoElements) {
            searchPseudoElements(node);
          }
        };
      }
    };

    var _unwatched = false;
    var MutationObserver$1 = {
      mixout: function mixout() {
        return {
          dom: {
            unwatch: function unwatch() {
              disableObservation();
              _unwatched = true;
            }
          }
        };
      },
      hooks: function hooks() {
        return {
          bootstrap: function bootstrap() {
            observe(chainHooks('mutationObserverCallbacks', {}));
          },
          noAuto: function noAuto() {
            disconnect();
          },
          watch: function watch(params) {
            var observeMutationsRoot = params.observeMutationsRoot;

            if (_unwatched) {
              enableObservation();
            } else {
              observe(chainHooks('mutationObserverCallbacks', {
                observeMutationsRoot: observeMutationsRoot
              }));
            }
          }
        };
      }
    };

    var parseTransformString = function parseTransformString(transformString) {
      var transform = {
        size: 16,
        x: 0,
        y: 0,
        flipX: false,
        flipY: false,
        rotate: 0
      };
      return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
        var parts = n.toLowerCase().split('-');
        var first = parts[0];
        var rest = parts.slice(1).join('-');

        if (first && rest === 'h') {
          acc.flipX = true;
          return acc;
        }

        if (first && rest === 'v') {
          acc.flipY = true;
          return acc;
        }

        rest = parseFloat(rest);

        if (isNaN(rest)) {
          return acc;
        }

        switch (first) {
          case 'grow':
            acc.size = acc.size + rest;
            break;

          case 'shrink':
            acc.size = acc.size - rest;
            break;

          case 'left':
            acc.x = acc.x - rest;
            break;

          case 'right':
            acc.x = acc.x + rest;
            break;

          case 'up':
            acc.y = acc.y - rest;
            break;

          case 'down':
            acc.y = acc.y + rest;
            break;

          case 'rotate':
            acc.rotate = acc.rotate + rest;
            break;
        }

        return acc;
      }, transform);
    };
    var PowerTransforms = {
      mixout: function mixout() {
        return {
          parse: {
            transform: function transform(transformString) {
              return parseTransformString(transformString);
            }
          }
        };
      },
      hooks: function hooks() {
        return {
          parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
            var transformString = node.getAttribute('data-fa-transform');

            if (transformString) {
              accumulator.transform = parseTransformString(transformString);
            }

            return accumulator;
          }
        };
      },
      provides: function provides(providers) {
        providers.generateAbstractTransformGrouping = function (_ref) {
          var main = _ref.main,
              transform = _ref.transform,
              containerWidth = _ref.containerWidth,
              iconWidth = _ref.iconWidth;
          var outer = {
            transform: "translate(".concat(containerWidth / 2, " 256)")
          };
          var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
          var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
          var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
          var inner = {
            transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
          };
          var path = {
            transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
          };
          var operations = {
            outer: outer,
            inner: inner,
            path: path
          };
          return {
            tag: 'g',
            attributes: _objectSpread2({}, operations.outer),
            children: [{
              tag: 'g',
              attributes: _objectSpread2({}, operations.inner),
              children: [{
                tag: main.icon.tag,
                children: main.icon.children,
                attributes: _objectSpread2(_objectSpread2({}, main.icon.attributes), operations.path)
              }]
            }]
          };
        };
      }
    };

    var ALL_SPACE = {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%'
    };

    function fillBlack(abstract) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (abstract.attributes && (abstract.attributes.fill || force)) {
        abstract.attributes.fill = 'black';
      }

      return abstract;
    }

    function deGroup(abstract) {
      if (abstract.tag === 'g') {
        return abstract.children;
      } else {
        return [abstract];
      }
    }

    var Masks = {
      hooks: function hooks() {
        return {
          parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
            var maskData = node.getAttribute('data-fa-mask');
            var mask = !maskData ? emptyCanonicalIcon() : getCanonicalIcon(maskData.split(' ').map(function (i) {
              return i.trim();
            }));

            if (!mask.prefix) {
              mask.prefix = getDefaultUsablePrefix();
            }

            accumulator.mask = mask;
            accumulator.maskId = node.getAttribute('data-fa-mask-id');
            return accumulator;
          }
        };
      },
      provides: function provides(providers) {
        providers.generateAbstractMask = function (_ref) {
          var children = _ref.children,
              attributes = _ref.attributes,
              main = _ref.main,
              mask = _ref.mask,
              explicitMaskId = _ref.maskId,
              transform = _ref.transform;
          var mainWidth = main.width,
              mainPath = main.icon;
          var maskWidth = mask.width,
              maskPath = mask.icon;
          var trans = transformForSvg({
            transform: transform,
            containerWidth: maskWidth,
            iconWidth: mainWidth
          });
          var maskRect = {
            tag: 'rect',
            attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
              fill: 'white'
            })
          };
          var maskInnerGroupChildrenMixin = mainPath.children ? {
            children: mainPath.children.map(fillBlack)
          } : {};
          var maskInnerGroup = {
            tag: 'g',
            attributes: _objectSpread2({}, trans.inner),
            children: [fillBlack(_objectSpread2({
              tag: mainPath.tag,
              attributes: _objectSpread2(_objectSpread2({}, mainPath.attributes), trans.path)
            }, maskInnerGroupChildrenMixin))]
          };
          var maskOuterGroup = {
            tag: 'g',
            attributes: _objectSpread2({}, trans.outer),
            children: [maskInnerGroup]
          };
          var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
          var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
          var maskTag = {
            tag: 'mask',
            attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
              id: maskId,
              maskUnits: 'userSpaceOnUse',
              maskContentUnits: 'userSpaceOnUse'
            }),
            children: [maskRect, maskOuterGroup]
          };
          var defs = {
            tag: 'defs',
            children: [{
              tag: 'clipPath',
              attributes: {
                id: clipId
              },
              children: deGroup(maskPath)
            }, maskTag]
          };
          children.push(defs, {
            tag: 'rect',
            attributes: _objectSpread2({
              fill: 'currentColor',
              'clip-path': "url(#".concat(clipId, ")"),
              mask: "url(#".concat(maskId, ")")
            }, ALL_SPACE)
          });
          return {
            children: children,
            attributes: attributes
          };
        };
      }
    };

    var MissingIconIndicator = {
      provides: function provides(providers) {
        var reduceMotion = false;

        if (WINDOW.matchMedia) {
          reduceMotion = WINDOW.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }

        providers.missingIconAbstract = function () {
          var gChildren = [];
          var FILL = {
            fill: 'currentColor'
          };
          var ANIMATION_BASE = {
            attributeType: 'XML',
            repeatCount: 'indefinite',
            dur: '2s'
          }; // Ring

          gChildren.push({
            tag: 'path',
            attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
              d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
            })
          });

          var OPACITY_ANIMATE = _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
            attributeName: 'opacity'
          });

          var dot = {
            tag: 'circle',
            attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
              cx: '256',
              cy: '364',
              r: '28'
            }),
            children: []
          };

          if (!reduceMotion) {
            dot.children.push({
              tag: 'animate',
              attributes: _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
                attributeName: 'r',
                values: '28;14;28;28;14;28;'
              })
            }, {
              tag: 'animate',
              attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
                values: '1;0;1;1;0;1;'
              })
            });
          }

          gChildren.push(dot);
          gChildren.push({
            tag: 'path',
            attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
              opacity: '1',
              d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
            }),
            children: reduceMotion ? [] : [{
              tag: 'animate',
              attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
                values: '1;0;0;0;0;1;'
              })
            }]
          });

          if (!reduceMotion) {
            // Exclamation
            gChildren.push({
              tag: 'path',
              attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
                opacity: '0',
                d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
              }),
              children: [{
                tag: 'animate',
                attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
                  values: '0;0;1;1;0;0;'
                })
              }]
            });
          }

          return {
            tag: 'g',
            attributes: {
              'class': 'missing'
            },
            children: gChildren
          };
        };
      }
    };

    var SvgSymbols = {
      hooks: function hooks() {
        return {
          parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
            var symbolData = node.getAttribute('data-fa-symbol');
            var symbol = symbolData === null ? false : symbolData === '' ? true : symbolData;
            accumulator['symbol'] = symbol;
            return accumulator;
          }
        };
      }
    };

    var plugins = [InjectCSS, ReplaceElements, Layers, LayersCounter, LayersText, PseudoElements, MutationObserver$1, PowerTransforms, Masks, MissingIconIndicator, SvgSymbols];

    registerPlugins(plugins, {
      mixoutsTo: api
    });
    var library$1 = api.library;
    var parse$1 = api.parse;
    var findIconDefinition$1 = api.findIconDefinition;
    var icon = api.icon;

    function normalizeIconArgs(icon) {
      if (icon === null) {
        return icon;
      }

      if (typeof icon === 'object' && icon.prefix && icon.iconName) {
        return icon;
      }

      if (Array.isArray(icon) && icon.length === 2) {
        const [prefix, iconName] = icon;
        return {
          prefix,
          iconName,
        };
      }

      if (typeof icon === 'string') {
        return {
          prefix: 'fas',
          iconName: icon,
        };
      }

      return undefined;
    }

    /* node_modules\fontawesome-svelte\src\FontAwesomeIcon.svelte generated by Svelte v3.31.2 */

    function create_fragment$1(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*html*/ ctx[0], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*html*/ 1) html_tag.p(/*html*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let _classList;
    	let _styles;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FontAwesomeIcon", slots, []);
    	let { border = false } = $$props;
    	let { fixedWidth = false } = $$props;
    	let { flip = null } = $$props;
    	let { icon: icon$1 = null } = $$props;
    	let { mask = null } = $$props;
    	let { listItem = false } = $$props;
    	let { pull = null } = $$props;
    	let { pulse = false } = $$props;
    	let { rotation = null } = $$props;
    	let { swapOpacity = false } = $$props;
    	let { size = null } = $$props;
    	let { spin = false } = $$props;
    	let { transform = {} } = $$props;
    	let { symbol = false } = $$props;
    	let { title = null } = $$props;
    	let { inverse = false } = $$props;
    	let html = "";

    	beforeUpdate(() => {
    		const iconArgs = normalizeIconArgs(icon$1);
    		if (!iconArgs) return;
    		const iconDefinition = findIconDefinition$1(iconArgs);

    		const result = icon(iconDefinition || icon$1, {
    			symbol,
    			title,
    			styles: $$props.style ? _styles : {},
    			classes: [
    				...Object.keys(_classList).map(key => _classList[key] ? key : null).filter(key => !!key),
    				($$props.class || "").split(" ")
    			],
    			transform: {
    				...typeof transform === "string"
    				? parse$1.transform(transform)
    				: transform
    			},
    			mask: normalizeIconArgs(mask)
    		});

    		if (!result) {
    			console.warn("Could not find one or more icon(s)", iconDefinition || icon$1, mask);
    			return;
    		}

    		$$invalidate(0, html = result.html);
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(19, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("border" in $$new_props) $$invalidate(1, border = $$new_props.border);
    		if ("fixedWidth" in $$new_props) $$invalidate(2, fixedWidth = $$new_props.fixedWidth);
    		if ("flip" in $$new_props) $$invalidate(3, flip = $$new_props.flip);
    		if ("icon" in $$new_props) $$invalidate(4, icon$1 = $$new_props.icon);
    		if ("mask" in $$new_props) $$invalidate(5, mask = $$new_props.mask);
    		if ("listItem" in $$new_props) $$invalidate(6, listItem = $$new_props.listItem);
    		if ("pull" in $$new_props) $$invalidate(7, pull = $$new_props.pull);
    		if ("pulse" in $$new_props) $$invalidate(8, pulse = $$new_props.pulse);
    		if ("rotation" in $$new_props) $$invalidate(9, rotation = $$new_props.rotation);
    		if ("swapOpacity" in $$new_props) $$invalidate(10, swapOpacity = $$new_props.swapOpacity);
    		if ("size" in $$new_props) $$invalidate(11, size = $$new_props.size);
    		if ("spin" in $$new_props) $$invalidate(12, spin = $$new_props.spin);
    		if ("transform" in $$new_props) $$invalidate(13, transform = $$new_props.transform);
    		if ("symbol" in $$new_props) $$invalidate(14, symbol = $$new_props.symbol);
    		if ("title" in $$new_props) $$invalidate(15, title = $$new_props.title);
    		if ("inverse" in $$new_props) $$invalidate(16, inverse = $$new_props.inverse);
    	};

    	$$self.$capture_state = () => ({
    		faParse: parse$1,
    		faIcon: icon,
    		faFindIconDefinition: findIconDefinition$1,
    		beforeUpdate,
    		normalizeIconArgs,
    		border,
    		fixedWidth,
    		flip,
    		icon: icon$1,
    		mask,
    		listItem,
    		pull,
    		pulse,
    		rotation,
    		swapOpacity,
    		size,
    		spin,
    		transform,
    		symbol,
    		title,
    		inverse,
    		html,
    		_classList,
    		_styles
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(19, $$props = assign(assign({}, $$props), $$new_props));
    		if ("border" in $$props) $$invalidate(1, border = $$new_props.border);
    		if ("fixedWidth" in $$props) $$invalidate(2, fixedWidth = $$new_props.fixedWidth);
    		if ("flip" in $$props) $$invalidate(3, flip = $$new_props.flip);
    		if ("icon" in $$props) $$invalidate(4, icon$1 = $$new_props.icon);
    		if ("mask" in $$props) $$invalidate(5, mask = $$new_props.mask);
    		if ("listItem" in $$props) $$invalidate(6, listItem = $$new_props.listItem);
    		if ("pull" in $$props) $$invalidate(7, pull = $$new_props.pull);
    		if ("pulse" in $$props) $$invalidate(8, pulse = $$new_props.pulse);
    		if ("rotation" in $$props) $$invalidate(9, rotation = $$new_props.rotation);
    		if ("swapOpacity" in $$props) $$invalidate(10, swapOpacity = $$new_props.swapOpacity);
    		if ("size" in $$props) $$invalidate(11, size = $$new_props.size);
    		if ("spin" in $$props) $$invalidate(12, spin = $$new_props.spin);
    		if ("transform" in $$props) $$invalidate(13, transform = $$new_props.transform);
    		if ("symbol" in $$props) $$invalidate(14, symbol = $$new_props.symbol);
    		if ("title" in $$props) $$invalidate(15, title = $$new_props.title);
    		if ("inverse" in $$props) $$invalidate(16, inverse = $$new_props.inverse);
    		if ("html" in $$props) $$invalidate(0, html = $$new_props.html);
    		if ("_classList" in $$props) _classList = $$new_props._classList;
    		if ("_styles" in $$props) _styles = $$new_props._styles;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*spin, pulse, fixedWidth, border, listItem, inverse, flip, size, rotation, pull, swapOpacity*/ 73678) {
    			 _classList = {
    				"fa-spin": spin,
    				"fa-pulse": pulse,
    				"fa-fw": fixedWidth,
    				"fa-border": border,
    				"fa-li": listItem,
    				"fa-inverse": inverse,
    				"fa-flip-horizontal": ["both", "horizontal"].includes(flip),
    				"fa-flip-vertical": ["both", "vertical"].includes(flip),
    				[`fa-${size}`]: size !== null,
    				[`fa-rotate-${rotation}`]: rotation !== null,
    				[`fa-pull-${pull}`]: pull !== null,
    				"fa-swap-opacity": swapOpacity
    			};
    		}

    		 _styles = ($$props.style || "").split(";").filter(item => !!item).map(rule => rule.split(":").map(item => item.trim())).reduce(
    			(accumulator, current) => {
    				const [key, value] = current;
    				accumulator[key] = value;
    				return accumulator;
    			},
    			{}
    		);
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		html,
    		border,
    		fixedWidth,
    		flip,
    		icon$1,
    		mask,
    		listItem,
    		pull,
    		pulse,
    		rotation,
    		swapOpacity,
    		size,
    		spin,
    		transform,
    		symbol,
    		title,
    		inverse
    	];
    }

    class FontAwesomeIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			border: 1,
    			fixedWidth: 2,
    			flip: 3,
    			icon: 4,
    			mask: 5,
    			listItem: 6,
    			pull: 7,
    			pulse: 8,
    			rotation: 9,
    			swapOpacity: 10,
    			size: 11,
    			spin: 12,
    			transform: 13,
    			symbol: 14,
    			title: 15,
    			inverse: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FontAwesomeIcon",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get border() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set border(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixedWidth() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixedWidth(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mask() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mask(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listItem() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listItem(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pull() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pull(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotation() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotation(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get swapOpacity() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set swapOpacity(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transform() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transform(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get symbol() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set symbol(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<FontAwesomeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<FontAwesomeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var oppositeColor = (hex) => {
        const red = parseInt(hex.slice(1, 3), 16);
        const green = parseInt(hex.slice(3, 5), 16);
        const blue = parseInt(hex.slice(5, 7), 16);
        return red * 0.299 + green * 0.587 + blue * 0.114 > 186
            ? "#000000"
            : "#FFFFFF";
    };

    /* src\components\List\EditItemModal.svelte generated by Svelte v3.31.2 */
    const file$1 = "src\\components\\List\\EditItemModal.svelte";

    function create_fragment$2(ctx) {
    	let h1;
    	let t1;
    	let form;
    	let div0;
    	let input;
    	let t2;
    	let div1;
    	let label_1;
    	let t4;
    	let br;
    	let t5;
    	let textarea;
    	let t6;
    	let div2;
    	let button0;
    	let fontawesomeicon0;
    	let t7;
    	let button1;
    	let fontawesomeicon1;
    	let current;
    	let mounted;
    	let dispose;

    	fontawesomeicon0 = new FontAwesomeIcon({
    			props: { icon: "trash-can" },
    			$$inline: true
    		});

    	fontawesomeicon1 = new FontAwesomeIcon({
    			props: { icon: "floppy-disk" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Edit Item";
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			div1 = element("div");
    			label_1 = element("label");
    			label_1.textContent = "Notes";
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			textarea = element("textarea");
    			t6 = space();
    			div2 = element("div");
    			button0 = element("button");
    			create_component(fontawesomeicon0.$$.fragment);
    			t7 = space();
    			button1 = element("button");
    			create_component(fontawesomeicon1.$$.fragment);
    			add_location(h1, file$1, 50, 2, 991);
    			attr_dev(input, "id", "label");
    			attr_dev(input, "type", "text");
    			input.autofocus = true;
    			attr_dev(input, "class", "svelte-g79xub");
    			add_location(input, file$1, 54, 6, 1117);
    			add_location(div0, file$1, 52, 4, 1061);
    			attr_dev(label_1, "for", "info");
    			add_location(label_1, file$1, 57, 6, 1206);
    			add_location(br, file$1, 58, 6, 1244);
    			attr_dev(textarea, "id", "info");
    			attr_dev(textarea, "class", "svelte-g79xub");
    			add_location(textarea, file$1, 59, 6, 1256);
    			add_location(div1, file$1, 56, 4, 1194);
    			attr_dev(button0, "class", "delete svelte-g79xub");
    			add_location(button0, file$1, 62, 6, 1350);
    			attr_dev(button1, "class", "save svelte-g79xub");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file$1, 65, 6, 1485);
    			attr_dev(div2, "class", "controls svelte-g79xub");
    			add_location(div2, file$1, 61, 4, 1321);
    			add_location(form, file$1, 51, 2, 1012);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*label*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, label_1);
    			append_dev(div1, t4);
    			append_dev(div1, br);
    			append_dev(div1, t5);
    			append_dev(div1, textarea);
    			set_input_value(textarea, /*info*/ ctx[1]);
    			append_dev(form, t6);
    			append_dev(form, div2);
    			append_dev(div2, button0);
    			mount_component(fontawesomeicon0, button0, null);
    			append_dev(div2, t7);
    			append_dev(div2, button1);
    			mount_component(fontawesomeicon1, button1, null);
    			current = true;
    			input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[6]),
    					listen_dev(button0, "click", prevent_default(/*handleDeleteClick*/ ctx[3]), false, true, false),
    					listen_dev(form, "submit", prevent_default(/*handleEdit*/ ctx[2]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1 && input.value !== /*label*/ ctx[0]) {
    				set_input_value(input, /*label*/ ctx[0]);
    			}

    			if (dirty & /*info*/ 2) {
    				set_input_value(textarea, /*info*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesomeicon0.$$.fragment, local);
    			transition_in(fontawesomeicon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesomeicon0.$$.fragment, local);
    			transition_out(fontawesomeicon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			destroy_component(fontawesomeicon0);
    			destroy_component(fontawesomeicon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditItemModal", slots, []);
    	let { index } = $$props;
    	const { close } = getContext("simple-modal");
    	const list = getCurrentlySelectedList();
    	const item = list.getItem(index);
    	let label = item.label;
    	let info = item.info;

    	const handleEdit = () => {
    		if (label.trim()) {
    			list.updateItem(index, label, info);
    			close();
    		}
    	};

    	const handleDeleteClick = () => {
    		if (confirm("Are you sure?")) {
    			list.removeItem(index);
    			close();
    		}
    	};

    	const writable_props = ["index"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EditItemModal> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		label = this.value;
    		$$invalidate(0, label);
    	}

    	function textarea_input_handler() {
    		info = this.value;
    		$$invalidate(1, info);
    	}

    	$$self.$$set = $$props => {
    		if ("index" in $$props) $$invalidate(4, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		index,
    		getContext,
    		FontAwesomeIcon,
    		getCurrentlySelectedList,
    		close,
    		list,
    		item,
    		label,
    		info,
    		handleEdit,
    		handleDeleteClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("index" in $$props) $$invalidate(4, index = $$props.index);
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("info" in $$props) $$invalidate(1, info = $$props.info);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		label,
    		info,
    		handleEdit,
    		handleDeleteClick,
    		index,
    		input_input_handler,
    		textarea_input_handler
    	];
    }

    class EditItemModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { index: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditItemModal",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*index*/ ctx[4] === undefined && !("index" in props)) {
    			console.warn("<EditItemModal> was created without expected prop 'index'");
    		}
    	}

    	get index() {
    		throw new Error("<EditItemModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<EditItemModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\List\Item.svelte generated by Svelte v3.31.2 */
    const file$2 = "src\\components\\List\\Item.svelte";

    function create_fragment$3(ctx) {
    	let li;
    	let div0;
    	let t0_value = /*label*/ ctx[0].substring(0, 2) + "";
    	let t0;
    	let t1;
    	let div3;
    	let div1;
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let div4;
    	let button0;
    	let fontawesomeicon0;
    	let t6;
    	let button1;
    	let fontawesomeicon1;
    	let current;
    	let mounted;
    	let dispose;

    	fontawesomeicon0 = new FontAwesomeIcon({
    			props: { icon: "pencil" },
    			$$inline: true
    		});

    	fontawesomeicon1 = new FontAwesomeIcon({
    			props: { icon: "trash-can" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t2 = text(/*label*/ ctx[0]);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(/*info*/ ctx[1]);
    			t5 = space();
    			div4 = element("div");
    			button0 = element("button");
    			create_component(fontawesomeicon0.$$.fragment);
    			t6 = space();
    			button1 = element("button");
    			create_component(fontawesomeicon1.$$.fragment);
    			attr_dev(div0, "class", "icon svelte-1wr4m4v");
    			set_style(div0, "background-color", /*color*/ ctx[2]);
    			set_style(div0, "color", /*foregroundColor*/ ctx[4]);
    			add_location(div0, file$2, 80, 2, 1594);
    			attr_dev(div1, "class", "label svelte-1wr4m4v");
    			add_location(div1, file$2, 87, 4, 1749);
    			attr_dev(div2, "class", "info svelte-1wr4m4v");
    			add_location(div2, file$2, 88, 4, 1786);
    			attr_dev(div3, "class", "content svelte-1wr4m4v");
    			add_location(div3, file$2, 86, 2, 1723);
    			attr_dev(button0, "class", "svelte-1wr4m4v");
    			add_location(button0, file$2, 91, 4, 1855);
    			attr_dev(button1, "class", "svelte-1wr4m4v");
    			add_location(button1, file$2, 94, 4, 1949);
    			attr_dev(div4, "class", "controls svelte-1wr4m4v");
    			add_location(div4, file$2, 90, 2, 1828);
    			attr_dev(li, "class", "svelte-1wr4m4v");
    			add_location(li, file$2, 79, 0, 1565);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div0);
    			append_dev(div0, t0);
    			append_dev(li, t1);
    			append_dev(li, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, t4);
    			append_dev(li, t5);
    			append_dev(li, div4);
    			append_dev(div4, button0);
    			mount_component(fontawesomeicon0, button0, null);
    			append_dev(div4, t6);
    			append_dev(div4, button1);
    			mount_component(fontawesomeicon1, button1, null);
    			/*li_binding*/ ctx[8](li);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handleEditClick*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*handleDeleteClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*label*/ 1) && t0_value !== (t0_value = /*label*/ ctx[0].substring(0, 2) + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*color*/ 4) {
    				set_style(div0, "background-color", /*color*/ ctx[2]);
    			}

    			if (!current || dirty & /*foregroundColor*/ 16) {
    				set_style(div0, "color", /*foregroundColor*/ ctx[4]);
    			}

    			if (!current || dirty & /*label*/ 1) set_data_dev(t2, /*label*/ ctx[0]);
    			if (!current || dirty & /*info*/ 2) set_data_dev(t4, /*info*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesomeicon0.$$.fragment, local);
    			transition_in(fontawesomeicon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesomeicon0.$$.fragment, local);
    			transition_out(fontawesomeicon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(fontawesomeicon0);
    			destroy_component(fontawesomeicon1);
    			/*li_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let foregroundColor;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Item", slots, []);
    	let { label } = $$props;
    	let { info } = $$props;
    	let { color } = $$props;
    	let { index } = $$props;
    	const { isInitialized } = getContext("items");
    	const { open } = getContext("simple-modal");
    	let liElement;

    	const handleDeleteClick = () => {
    		getCurrentlySelectedList().removeItem(index);
    	};

    	const handleEditClick = () => {
    		open(EditItemModal, { index });
    	};

    	onMount(() => {
    		if (isInitialized()) {
    			liElement.scrollIntoView({ behavior: "smooth" });
    		}
    	});

    	const writable_props = ["label", "info", "color", "index"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Item> was created with unknown prop '${key}'`);
    	});

    	function li_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			liElement = $$value;
    			$$invalidate(3, liElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("info" in $$props) $$invalidate(1, info = $$props.info);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("index" in $$props) $$invalidate(7, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		label,
    		info,
    		color,
    		index,
    		onMount,
    		getContext,
    		FontAwesomeIcon,
    		getCurrentlySelectedList,
    		oppositeColor,
    		EditItemModal,
    		isInitialized,
    		open,
    		liElement,
    		handleDeleteClick,
    		handleEditClick,
    		foregroundColor
    	});

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("info" in $$props) $$invalidate(1, info = $$props.info);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("index" in $$props) $$invalidate(7, index = $$props.index);
    		if ("liElement" in $$props) $$invalidate(3, liElement = $$props.liElement);
    		if ("foregroundColor" in $$props) $$invalidate(4, foregroundColor = $$props.foregroundColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*color*/ 4) {
    			 $$invalidate(4, foregroundColor = oppositeColor(color));
    		}
    	};

    	return [
    		label,
    		info,
    		color,
    		liElement,
    		foregroundColor,
    		handleDeleteClick,
    		handleEditClick,
    		index,
    		li_binding
    	];
    }

    class Item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { label: 0, info: 1, color: 2, index: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Item",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !("label" in props)) {
    			console.warn("<Item> was created without expected prop 'label'");
    		}

    		if (/*info*/ ctx[1] === undefined && !("info" in props)) {
    			console.warn("<Item> was created without expected prop 'info'");
    		}

    		if (/*color*/ ctx[2] === undefined && !("color" in props)) {
    			console.warn("<Item> was created without expected prop 'color'");
    		}

    		if (/*index*/ ctx[7] === undefined && !("index" in props)) {
    			console.warn("<Item> was created without expected prop 'index'");
    		}
    	}

    	get label() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\List\Items.svelte generated by Svelte v3.31.2 */
    const file$3 = "src\\components\\List\\Items.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (37:2) {:else}
    function create_else_block$1(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "Nothing here";
    			attr_dev(li, "class", "empty svelte-3hv5b9");
    			add_location(li, file$3, 37, 4, 746);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(37:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:2) {#each items as item, index}
    function create_each_block(ctx) {
    	let item;
    	let current;
    	const item_spread_levels = [/*item*/ ctx[3], { index: /*index*/ ctx[5] }];
    	let item_props = {};

    	for (let i = 0; i < item_spread_levels.length; i += 1) {
    		item_props = assign(item_props, item_spread_levels[i]);
    	}

    	item = new Item({ props: item_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(item.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(item, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const item_changes = (dirty & /*items*/ 1)
    			? get_spread_update(item_spread_levels, [get_spread_object(/*item*/ ctx[3]), item_spread_levels[1]])
    			: {};

    			item.$set(item_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(item, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(35:2) {#each items as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let ul;
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			attr_dev(ul, "class", "svelte-3hv5b9");
    			add_location(ul, file$3, 33, 0, 665);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items*/ 1) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block$1(ctx);
    					each_1_else.c();
    					each_1_else.m(ul, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Items", slots, []);
    	
    	let items;
    	let isInitialized = false;

    	const unsubscribe = getCurrentlySelectedList().subscribe(value => {
    		$$invalidate(0, items = value);
    	});

    	setContext("items", { isInitialized: () => isInitialized });

    	onMount(() => {
    		isInitialized = true;
    	});

    	onDestroy(unsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Items> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		setContext,
    		getCurrentlySelectedList,
    		Item,
    		items,
    		isInitialized,
    		unsubscribe
    	});

    	$$self.$inject_state = $$props => {
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    		if ("isInitialized" in $$props) isInitialized = $$props.isInitialized;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items];
    }

    class Items extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Items",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\List\NewItemModal.svelte generated by Svelte v3.31.2 */
    const file$4 = "src\\components\\List\\NewItemModal.svelte";

    function create_fragment$5(ctx) {
    	let h1;
    	let t1;
    	let form;
    	let div0;
    	let input;
    	let t2;
    	let div1;
    	let label_1;
    	let t4;
    	let br;
    	let t5;
    	let textarea;
    	let t6;
    	let div2;
    	let button;
    	let fontawesomeicon;
    	let current;
    	let mounted;
    	let dispose;

    	fontawesomeicon = new FontAwesomeIcon({
    			props: { icon: "floppy-disk" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Add new item";
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			div1 = element("div");
    			label_1 = element("label");
    			label_1.textContent = "Notes";
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			textarea = element("textarea");
    			t6 = space();
    			div2 = element("div");
    			button = element("button");
    			create_component(fontawesomeicon.$$.fragment);
    			add_location(h1, file$4, 36, 2, 690);
    			attr_dev(input, "id", "label");
    			attr_dev(input, "type", "text");
    			input.autofocus = true;
    			attr_dev(input, "class", "svelte-exuhml");
    			add_location(input, file$4, 40, 6, 819);
    			add_location(div0, file$4, 38, 4, 763);
    			attr_dev(label_1, "for", "info");
    			add_location(label_1, file$4, 43, 6, 908);
    			add_location(br, file$4, 44, 6, 946);
    			attr_dev(textarea, "id", "info");
    			attr_dev(textarea, "class", "svelte-exuhml");
    			add_location(textarea, file$4, 45, 6, 958);
    			add_location(div1, file$4, 42, 4, 896);
    			attr_dev(button, "class", "save svelte-exuhml");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$4, 48, 6, 1052);
    			attr_dev(div2, "class", "controls svelte-exuhml");
    			add_location(div2, file$4, 47, 4, 1023);
    			add_location(form, file$4, 37, 2, 714);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*label*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, label_1);
    			append_dev(div1, t4);
    			append_dev(div1, br);
    			append_dev(div1, t5);
    			append_dev(div1, textarea);
    			set_input_value(textarea, /*info*/ ctx[1]);
    			append_dev(form, t6);
    			append_dev(form, div2);
    			append_dev(div2, button);
    			mount_component(fontawesomeicon, button, null);
    			current = true;
    			input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[4]),
    					listen_dev(form, "submit", prevent_default(/*handleSave*/ ctx[2]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1 && input.value !== /*label*/ ctx[0]) {
    				set_input_value(input, /*label*/ ctx[0]);
    			}

    			if (dirty & /*info*/ 2) {
    				set_input_value(textarea, /*info*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesomeicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesomeicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			destroy_component(fontawesomeicon);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NewItemModal", slots, []);
    	const { close } = getContext("simple-modal");
    	let label = "";
    	let info = "";

    	const handleSave = () => {
    		if (label.trim()) {
    			getCurrentlySelectedList().addItem(label, info);
    			close();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NewItemModal> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		label = this.value;
    		$$invalidate(0, label);
    	}

    	function textarea_input_handler() {
    		info = this.value;
    		$$invalidate(1, info);
    	}

    	$$self.$capture_state = () => ({
    		getContext,
    		FontAwesomeIcon,
    		getCurrentlySelectedList,
    		close,
    		label,
    		info,
    		handleSave
    	});

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("info" in $$props) $$invalidate(1, info = $$props.info);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, info, handleSave, input_input_handler, textarea_input_handler];
    }

    class NewItemModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewItemModal",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\List\AddItemButton.svelte generated by Svelte v3.31.2 */
    const file$5 = "src\\components\\List\\AddItemButton.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let fontawesomeicon;
    	let current;
    	let mounted;
    	let dispose;
    	fontawesomeicon = new FontAwesomeIcon({ props: { icon: "plus" }, $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(fontawesomeicon.$$.fragment);
    			attr_dev(button, "class", "svelte-1o8cy8m");
    			add_location(button, file$5, 20, 0, 464);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(fontawesomeicon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClick*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesomeicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesomeicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(fontawesomeicon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AddItemButton", slots, []);
    	const { open } = getContext("simple-modal");
    	const handleClick = () => open(NewItemModal);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AddItemButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FontAwesomeIcon,
    		getContext,
    		NewItemModal,
    		open,
    		handleClick
    	});

    	return [handleClick];
    }

    class AddItemButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddItemButton",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\BottomBar.svelte generated by Svelte v3.31.2 */

    const file$6 = "src\\components\\BottomBar.svelte";

    function create_fragment$7(ctx) {
    	let nav;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "container svelte-1vmb2xb");
    			add_location(div, file$6, 21, 2, 312);
    			attr_dev(nav, "class", "svelte-1vmb2xb");
    			add_location(nav, file$6, 20, 0, 304);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BottomBar", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BottomBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class BottomBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BottomBar",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const createSelectedListStore = () => {
        const initialValue = JSON.parse(localStorage.getItem(SELECTED_LIST_KEY)) || null;
        const { update, subscribe } = writable(initialValue);
        subscribe((val) => {
            localStorage.setItem(SELECTED_LIST_KEY, JSON.stringify(val));
        });
        return {
            subscribe,
            select: (key) => {
                update(() => key);
            },
            clear: () => {
                update(() => null);
            }
        };
    };
    const selectedListStore = createSelectedListStore();

    /* src\components\List\ClearCurrentlySelectedListButton.svelte generated by Svelte v3.31.2 */
    const file$7 = "src\\components\\List\\ClearCurrentlySelectedListButton.svelte";

    function create_fragment$8(ctx) {
    	let button;
    	let fontawesomeicon;
    	let current;
    	let mounted;
    	let dispose;

    	fontawesomeicon = new FontAwesomeIcon({
    			props: { icon: "chevron-left" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(fontawesomeicon.$$.fragment);
    			attr_dev(button, "class", "svelte-1o8cy8m");
    			add_location(button, file$7, 20, 0, 416);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(fontawesomeicon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClick*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesomeicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesomeicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(fontawesomeicon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ClearCurrentlySelectedListButton", slots, []);

    	const handleClick = () => {
    		selectedListStore.clear();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ClearCurrentlySelectedListButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FontAwesomeIcon,
    		selectedListStore,
    		handleClick
    	});

    	return [handleClick];
    }

    class ClearCurrentlySelectedListButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClearCurrentlySelectedListButton",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    const createListsStore = () => {
        const initialValue = JSON.parse(localStorage.getItem(LISTS_KEY)) || [];
        const { update, subscribe } = writable(initialValue);
        subscribe((val) => {
            localStorage.setItem(LISTS_KEY, JSON.stringify(val));
        });
        return {
            subscribe,
            addItem: (label) => {
                update((current) => {
                    return [...current, { label: label.trim(), key: v4() }];
                });
            },
            getList: (index) => {
                let $current;
                subscribe($ => $current = $)();
                return $current.find((_, i) => i === index);
            },
            getListByKey: (key) => {
                let $current;
                subscribe($ => $current = $)();
                return $current.find((list) => list.key === key);
            },
            updateList: (index, label) => {
                update((current) => {
                    const list = current.find((_, i) => i === index);
                    list.label = label;
                    return [...current];
                });
            },
            removeList: (index) => {
                update((current) => {
                    const toRemove = current.find((_, i) => i === index);
                    destroyList(toRemove.key);
                    return current.filter((_, i) => i !== index);
                });
            },
        };
    };
    const listsStore = createListsStore();

    /* src\views\List.svelte generated by Svelte v3.31.2 */
    const file$8 = "src\\views\\List.svelte";

    // (18:2) <BottomBar>
    function create_default_slot(ctx) {
    	let clearcurrentlyselectedlistbutton;
    	let t0;
    	let h3;
    	let t1;
    	let t2;
    	let additembutton;
    	let current;
    	clearcurrentlyselectedlistbutton = new ClearCurrentlySelectedListButton({ $$inline: true });
    	additembutton = new AddItemButton({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(clearcurrentlyselectedlistbutton.$$.fragment);
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(/*listLabel*/ ctx[0]);
    			t2 = space();
    			create_component(additembutton.$$.fragment);
    			add_location(h3, file$8, 19, 4, 776);
    		},
    		m: function mount(target, anchor) {
    			mount_component(clearcurrentlyselectedlistbutton, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t1);
    			insert_dev(target, t2, anchor);
    			mount_component(additembutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*listLabel*/ 1) set_data_dev(t1, /*listLabel*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clearcurrentlyselectedlistbutton.$$.fragment, local);
    			transition_in(additembutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clearcurrentlyselectedlistbutton.$$.fragment, local);
    			transition_out(additembutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(clearcurrentlyselectedlistbutton, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			destroy_component(additembutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(18:2) <BottomBar>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let items;
    	let t;
    	let bottombar;
    	let current;
    	items = new Items({ $$inline: true });

    	bottombar = new BottomBar({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(items.$$.fragment);
    			t = space();
    			create_component(bottombar.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(items, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(bottombar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const bottombar_changes = {};

    			if (dirty & /*$$scope, listLabel*/ 5) {
    				bottombar_changes.$$scope = { dirty, ctx };
    			}

    			bottombar.$set(bottombar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(items.$$.fragment, local);
    			transition_in(bottombar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(items.$$.fragment, local);
    			transition_out(bottombar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(items, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(bottombar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("List", slots, []);
    	let listLabel;

    	const unsubscribe = selectedListStore.subscribe(value => {
    		const list = listsStore.getListByKey(value);
    		$$invalidate(0, listLabel = list === null || list === void 0 ? void 0 : list.label);
    	});

    	onDestroy(unsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		Items,
    		AddItemButton,
    		BottomBar,
    		ClearCurrentlySelectedListButton,
    		selectedListStore,
    		listsStore,
    		listLabel,
    		unsubscribe
    	});

    	$$self.$inject_state = $$props => {
    		if ("listLabel" in $$props) $$invalidate(0, listLabel = $$props.listLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [listLabel];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\Lists\NewListModal.svelte generated by Svelte v3.31.2 */
    const file$9 = "src\\components\\Lists\\NewListModal.svelte";

    function create_fragment$a(ctx) {
    	let h1;
    	let t1;
    	let form;
    	let div0;
    	let input;
    	let t2;
    	let div1;
    	let button;
    	let fontawesomeicon;
    	let current;
    	let mounted;
    	let dispose;

    	fontawesomeicon = new FontAwesomeIcon({
    			props: { icon: "floppy-disk" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Add new list";
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			div1 = element("div");
    			button = element("button");
    			create_component(fontawesomeicon.$$.fragment);
    			add_location(h1, file$9, 35, 2, 615);
    			attr_dev(input, "id", "label");
    			attr_dev(input, "type", "text");
    			input.autofocus = true;
    			attr_dev(input, "class", "svelte-2yveyv");
    			add_location(input, file$9, 39, 6, 744);
    			add_location(div0, file$9, 37, 4, 688);
    			attr_dev(button, "class", "save svelte-2yveyv");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$9, 42, 6, 850);
    			attr_dev(div1, "class", "controls svelte-2yveyv");
    			add_location(div1, file$9, 41, 4, 821);
    			add_location(form, file$9, 36, 2, 639);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*label*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, button);
    			mount_component(fontawesomeicon, button, null);
    			current = true;
    			input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(form, "submit", prevent_default(/*handleSave*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1 && input.value !== /*label*/ ctx[0]) {
    				set_input_value(input, /*label*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesomeicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesomeicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			destroy_component(fontawesomeicon);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NewListModal", slots, []);
    	const { close } = getContext("simple-modal");
    	let label = "";

    	const handleSave = () => {
    		if (label.trim()) {
    			listsStore.addItem(label);
    			close();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NewListModal> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		label = this.value;
    		$$invalidate(0, label);
    	}

    	$$self.$capture_state = () => ({
    		getContext,
    		FontAwesomeIcon,
    		listsStore,
    		close,
    		label,
    		handleSave
    	});

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, handleSave, input_input_handler];
    }

    class NewListModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewListModal",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\Lists\AddListButton.svelte generated by Svelte v3.31.2 */
    const file$a = "src\\components\\Lists\\AddListButton.svelte";

    function create_fragment$b(ctx) {
    	let button;
    	let fontawesomeicon;
    	let current;
    	let mounted;
    	let dispose;
    	fontawesomeicon = new FontAwesomeIcon({ props: { icon: "plus" }, $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(fontawesomeicon.$$.fragment);
    			attr_dev(button, "class", "svelte-1o8cy8m");
    			add_location(button, file$a, 20, 0, 464);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(fontawesomeicon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClick*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesomeicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesomeicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(fontawesomeicon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AddListButton", slots, []);
    	const { open } = getContext("simple-modal");
    	const handleClick = () => open(NewListModal);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AddListButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FontAwesomeIcon,
    		getContext,
    		NewListModal,
    		open,
    		handleClick
    	});

    	return [handleClick];
    }

    class AddListButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddListButton",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\Lists\EditListModal.svelte generated by Svelte v3.31.2 */
    const file$b = "src\\components\\Lists\\EditListModal.svelte";

    function create_fragment$c(ctx) {
    	let h1;
    	let t1;
    	let form;
    	let div0;
    	let input;
    	let t2;
    	let div1;
    	let button0;
    	let fontawesomeicon0;
    	let t3;
    	let button1;
    	let fontawesomeicon1;
    	let current;
    	let mounted;
    	let dispose;

    	fontawesomeicon0 = new FontAwesomeIcon({
    			props: { icon: "trash-can" },
    			$$inline: true
    		});

    	fontawesomeicon1 = new FontAwesomeIcon({
    			props: { icon: "floppy-disk" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Edit List";
    			t1 = space();
    			form = element("form");
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			div1 = element("div");
    			button0 = element("button");
    			create_component(fontawesomeicon0.$$.fragment);
    			t3 = space();
    			button1 = element("button");
    			create_component(fontawesomeicon1.$$.fragment);
    			add_location(h1, file$b, 48, 2, 901);
    			attr_dev(input, "id", "label");
    			attr_dev(input, "type", "text");
    			input.autofocus = true;
    			attr_dev(input, "class", "svelte-hnothl");
    			add_location(input, file$b, 52, 6, 1027);
    			add_location(div0, file$b, 50, 4, 971);
    			attr_dev(button0, "class", "delete svelte-hnothl");
    			add_location(button0, file$b, 55, 6, 1133);
    			attr_dev(button1, "class", "save svelte-hnothl");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file$b, 58, 6, 1268);
    			attr_dev(div1, "class", "controls svelte-hnothl");
    			add_location(div1, file$b, 54, 4, 1104);
    			add_location(form, file$b, 49, 2, 922);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*label*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, button0);
    			mount_component(fontawesomeicon0, button0, null);
    			append_dev(div1, t3);
    			append_dev(div1, button1);
    			mount_component(fontawesomeicon1, button1, null);
    			current = true;
    			input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(button0, "click", prevent_default(/*handleDeleteClick*/ ctx[2]), false, true, false),
    					listen_dev(form, "submit", prevent_default(/*handleEdit*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1 && input.value !== /*label*/ ctx[0]) {
    				set_input_value(input, /*label*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesomeicon0.$$.fragment, local);
    			transition_in(fontawesomeicon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesomeicon0.$$.fragment, local);
    			transition_out(fontawesomeicon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			destroy_component(fontawesomeicon0);
    			destroy_component(fontawesomeicon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditListModal", slots, []);
    	let { index } = $$props;
    	const { close } = getContext("simple-modal");
    	const item = listsStore.getList(index);
    	let label = item.label;

    	const handleEdit = () => {
    		if (label.trim()) {
    			listsStore.updateList(index, label);
    			close();
    		}
    	};

    	const handleDeleteClick = () => {
    		if (confirm("Are you sure?")) {
    			listsStore.removeList(index);
    			close();
    		}
    	};

    	const writable_props = ["index"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EditListModal> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		label = this.value;
    		$$invalidate(0, label);
    	}

    	$$self.$$set = $$props => {
    		if ("index" in $$props) $$invalidate(3, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		index,
    		getContext,
    		FontAwesomeIcon,
    		listsStore,
    		close,
    		item,
    		label,
    		handleEdit,
    		handleDeleteClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("index" in $$props) $$invalidate(3, index = $$props.index);
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, handleEdit, handleDeleteClick, index, input_input_handler];
    }

    class EditListModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { index: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditListModal",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*index*/ ctx[3] === undefined && !("index" in props)) {
    			console.warn("<EditListModal> was created without expected prop 'index'");
    		}
    	}

    	get index() {
    		throw new Error("<EditListModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<EditListModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Lists\List.svelte generated by Svelte v3.31.2 */
    const file$c = "src\\components\\Lists\\List.svelte";

    function create_fragment$d(ctx) {
    	let li;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let div2;
    	let button0;
    	let fontawesomeicon0;
    	let t2;
    	let button1;
    	let fontawesomeicon1;
    	let current;
    	let mounted;
    	let dispose;

    	fontawesomeicon0 = new FontAwesomeIcon({
    			props: { icon: "pencil" },
    			$$inline: true
    		});

    	fontawesomeicon1 = new FontAwesomeIcon({
    			props: { icon: "trash-can" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = space();
    			div2 = element("div");
    			button0 = element("button");
    			create_component(fontawesomeicon0.$$.fragment);
    			t2 = space();
    			button1 = element("button");
    			create_component(fontawesomeicon1.$$.fragment);
    			attr_dev(div0, "class", "label svelte-lp09q");
    			add_location(div0, file$c, 70, 4, 1449);
    			attr_dev(div1, "class", "content svelte-lp09q");
    			add_location(div1, file$c, 69, 2, 1423);
    			attr_dev(button0, "class", "svelte-lp09q");
    			add_location(button0, file$c, 73, 4, 1520);
    			attr_dev(button1, "class", "svelte-lp09q");
    			add_location(button1, file$c, 76, 4, 1630);
    			attr_dev(div2, "class", "controls svelte-lp09q");
    			add_location(div2, file$c, 72, 2, 1493);
    			attr_dev(li, "class", "svelte-lp09q");
    			add_location(li, file$c, 68, 0, 1371);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(li, t1);
    			append_dev(li, div2);
    			append_dev(div2, button0);
    			mount_component(fontawesomeicon0, button0, null);
    			append_dev(div2, t2);
    			append_dev(div2, button1);
    			mount_component(fontawesomeicon1, button1, null);
    			/*li_binding*/ ctx[7](li);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", stop_propagation(/*handleEditClick*/ ctx[3]), false, false, true),
    					listen_dev(button1, "click", stop_propagation(/*handleDeleteClick*/ ctx[2]), false, false, true),
    					listen_dev(li, "click", /*handleClick*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*label*/ 1) set_data_dev(t0, /*label*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesomeicon0.$$.fragment, local);
    			transition_in(fontawesomeicon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesomeicon0.$$.fragment, local);
    			transition_out(fontawesomeicon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(fontawesomeicon0);
    			destroy_component(fontawesomeicon1);
    			/*li_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("List", slots, []);
    	let { label } = $$props;
    	let { key } = $$props;
    	let { index } = $$props;
    	const { isInitialized } = getContext("items");
    	const { open } = getContext("simple-modal");
    	let liElement;

    	const handleDeleteClick = () => {
    		listsStore.removeList(index);
    	};

    	const handleEditClick = () => {
    		open(EditListModal, { index });
    	};

    	const handleClick = () => {
    		selectedListStore.select(key);
    	};

    	onMount(() => {
    		if (isInitialized()) {
    			liElement.scrollIntoView({ behavior: "smooth" });
    		}
    	});

    	const writable_props = ["label", "key", "index"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	function li_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			liElement = $$value;
    			$$invalidate(1, liElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("key" in $$props) $$invalidate(5, key = $$props.key);
    		if ("index" in $$props) $$invalidate(6, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		label,
    		key,
    		index,
    		onMount,
    		getContext,
    		FontAwesomeIcon,
    		listsStore,
    		selectedListStore,
    		EditListModal,
    		isInitialized,
    		open,
    		liElement,
    		handleDeleteClick,
    		handleEditClick,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("key" in $$props) $$invalidate(5, key = $$props.key);
    		if ("index" in $$props) $$invalidate(6, index = $$props.index);
    		if ("liElement" in $$props) $$invalidate(1, liElement = $$props.liElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		label,
    		liElement,
    		handleDeleteClick,
    		handleEditClick,
    		handleClick,
    		key,
    		index,
    		li_binding
    	];
    }

    class List$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { label: 0, key: 5, index: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !("label" in props)) {
    			console.warn("<List> was created without expected prop 'label'");
    		}

    		if (/*key*/ ctx[5] === undefined && !("key" in props)) {
    			console.warn("<List> was created without expected prop 'key'");
    		}

    		if (/*index*/ ctx[6] === undefined && !("index" in props)) {
    			console.warn("<List> was created without expected prop 'index'");
    		}
    	}

    	get label() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Lists\Lists.svelte generated by Svelte v3.31.2 */
    const file$d = "src\\components\\Lists\\Lists.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (37:2) {:else}
    function create_else_block$2(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "Nothing here";
    			attr_dev(li, "class", "empty svelte-3hv5b9");
    			add_location(li, file$d, 37, 4, 703);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(37:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:2) {#each lists as list, index}
    function create_each_block$1(ctx) {
    	let list;
    	let current;
    	const list_spread_levels = [/*list*/ ctx[3], { index: /*index*/ ctx[5] }];
    	let list_props = {};

    	for (let i = 0; i < list_spread_levels.length; i += 1) {
    		list_props = assign(list_props, list_spread_levels[i]);
    	}

    	list = new List$1({ props: list_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(list.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(list, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const list_changes = (dirty & /*lists*/ 1)
    			? get_spread_update(list_spread_levels, [get_spread_object(/*list*/ ctx[3]), list_spread_levels[1]])
    			: {};

    			list.$set(list_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(list.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(list.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(list, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(35:2) {#each lists as list, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let ul;
    	let current;
    	let each_value = /*lists*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$2(ctx);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			attr_dev(ul, "class", "svelte-3hv5b9");
    			add_location(ul, file$d, 33, 0, 622);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*lists*/ 1) {
    				each_value = /*lists*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block$2(ctx);
    					each_1_else.c();
    					each_1_else.m(ul, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Lists", slots, []);
    	
    	let lists;
    	let isInitialized = false;

    	const unsubscribe = listsStore.subscribe(value => {
    		$$invalidate(0, lists = value);
    	});

    	setContext("items", { isInitialized: () => isInitialized });

    	onMount(() => {
    		isInitialized = true;
    	});

    	onDestroy(unsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Lists> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		setContext,
    		listsStore,
    		List: List$1,
    		lists,
    		isInitialized,
    		unsubscribe
    	});

    	$$self.$inject_state = $$props => {
    		if ("lists" in $$props) $$invalidate(0, lists = $$props.lists);
    		if ("isInitialized" in $$props) isInitialized = $$props.isInitialized;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lists];
    }

    class Lists extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lists",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\views\Lists.svelte generated by Svelte v3.31.2 */

    // (8:2) <BottomBar>
    function create_default_slot$1(ctx) {
    	let addlistbutton;
    	let current;
    	addlistbutton = new AddListButton({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(addlistbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(addlistbutton, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addlistbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addlistbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(addlistbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(8:2) <BottomBar>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let lists;
    	let t;
    	let bottombar;
    	let current;
    	lists = new Lists({ $$inline: true });

    	bottombar = new BottomBar({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(lists.$$.fragment);
    			t = space();
    			create_component(bottombar.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(lists, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(bottombar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const bottombar_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				bottombar_changes.$$scope = { dirty, ctx };
    			}

    			bottombar.$set(bottombar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lists.$$.fragment, local);
    			transition_in(bottombar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lists.$$.fragment, local);
    			transition_out(bottombar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lists, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(bottombar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Lists", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Lists> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ AddListButton, BottomBar, Lists });
    	return [];
    }

    class Lists_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lists_1",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.31.2 */
    const file$e = "src\\App.svelte";

    // (29:4) {:else}
    function create_else_block$3(ctx) {
    	let lists;
    	let current;
    	lists = new Lists_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(lists.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lists, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lists.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lists.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lists, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(29:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#if selectedList}
    function create_if_block$1(ctx) {
    	let list;
    	let current;
    	list = new List({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(list.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(list, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(list.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(list.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(list, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(27:4) {#if selectedList}",
    		ctx
    	});

    	return block;
    }

    // (26:2) <Modal>
    function create_default_slot$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selectedList*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(26:2) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let main;
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(modal.$$.fragment);
    			attr_dev(main, "class", "svelte-1ijiw40");
    			add_location(main, file$e, 24, 0, 668);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(modal, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, selectedList*/ 5) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(modal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let selectedList;

    	const unsubscribe = selectedListStore.subscribe(value => {
    		updateCurrentlySelectedList(value);
    		$$invalidate(0, selectedList = value);
    	});

    	onDestroy(unsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		Modal,
    		List,
    		Lists: Lists_1,
    		selectedListStore,
    		updateCurrentlySelectedList,
    		selectedList,
    		unsubscribe
    	});

    	$$self.$inject_state = $$props => {
    		if ("selectedList" in $$props) $$invalidate(0, selectedList = $$props.selectedList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedList];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /*!
     * Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     * Copyright 2022 Fonticons, Inc.
     */
    var faChevronLeft = {
      prefix: 'fas',
      iconName: 'chevron-left',
      icon: [320, 512, [9001], "f053", "M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"]
    };
    var faFloppyDisk = {
      prefix: 'fas',
      iconName: 'floppy-disk',
      icon: [448, 512, [128426, 128190, "save"], "f0c7", "M433.1 129.1l-83.9-83.9C342.3 38.32 327.1 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 152.9 441.7 137.7 433.1 129.1zM224 416c-35.34 0-64-28.66-64-64s28.66-64 64-64s64 28.66 64 64S259.3 416 224 416zM320 208C320 216.8 312.8 224 304 224h-224C71.16 224 64 216.8 64 208v-96C64 103.2 71.16 96 80 96h224C312.8 96 320 103.2 320 112V208z"]
    };
    var faPencil = {
      prefix: 'fas',
      iconName: 'pencil',
      icon: [512, 512, [61504, 9999, "pencil-alt"], "f303", "M421.7 220.3L188.5 453.4L154.6 419.5L158.1 416H112C103.2 416 96 408.8 96 400V353.9L92.51 357.4C87.78 362.2 84.31 368 82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3zM492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75z"]
    };
    var faPlus = {
      prefix: 'fas',
      iconName: 'plus',
      icon: [448, 512, [10133, 61543, "add"], "2b", "M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"]
    };
    var faTrashCan = {
      prefix: 'fas',
      iconName: 'trash-can',
      icon: [448, 512, [61460, "trash-alt"], "f2ed", "M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"]
    };

    library$1.add(faPlus, faTrashCan, faFloppyDisk, faChevronLeft, faPencil);

    const app = new App({ target: document.body });
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js");
    }

    return app;

}());
//# sourceMappingURL=bundle.js.map
