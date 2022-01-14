import { Directive, DirectiveBinding } from 'vue';
import debounce from 'lodash.debounce'

const defaultDelay = 150;

interface ResizeOptions {
  delay: number;
  initial: boolean;
}

type ResizeCallback = (el: HTMLElement) => void;

function getOptions(modifiers: Record<string, boolean>): ResizeOptions {
  if (!modifiers) {
    return { delay: defaultDelay, initial: false }
  }
  const { initial = false } = modifiers;
  let delay = Object.keys(modifiers).map(k => parseInt(k)).find(v => !isNaN(v));
  delay = delay || defaultDelay;
  return { delay, initial }
}

function listenToVisible(element: HTMLElement, callback: () => void) {
  const options = {
    root: document.documentElement
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    });
  }, options);

  observer.observe(element);
  return observer;
}

function createResizeCallback(el: HTMLElement, value: ResizeCallback, arg: string | undefined, options: ResizeOptions): ResizeObserverCallback {
  if (arg === 'debounce') return debounce(() => value(el), options.delay);
  if (arg === 'throttle') return debounce(() => value(el), options.delay, { leading: true, trailing: true, maxWait: options.delay });
  return () => value(el);
}

function createResizeObserver(el: HTMLElement, value: ResizeCallback, arg: string | undefined, options: ResizeOptions) {
  const callBack = createResizeCallback(el, value, arg, options);
  if (options.initial) {
    value(el);
  }
  return new ResizeObserver(callBack);
}

function inserted(el: HTMLElement, { value, arg, modifiers }: DirectiveBinding<ResizeCallback>) {
  if (!value || typeof value !== 'function') {
    console.warn('v-resize should received a function as value');
    return;
  }
  const options = getOptions(modifiers);
  // if (instance && instance.$el === el) {
  //   instance..$once("hook:deactivated", () => {
  //     unbind(el);
  //     instance.$once("hook:activated", () => {
  //       inserted(el, { value, arg, modifiers }, { context: instance });
  //     })
  //   })
  // }
  if (el.offsetParent) {
    createResizeObserver(el, value, arg, options);
    return;
  }
  options.initial = true;
};

export default {
  inserted,
  unbind(el: HTMLElement) {
    // if (el.__visibility__listener__) {
    //   el.__visibility__listener__.disconnect();
    // }
    // if (!el.resizeSensor) {
    //   return;
    // }
    // ResizeSensor.detach(el);
  },
};
