import { onBeforeUnmount } from 'vue';

export function useDocumentEvent<K extends keyof DocumentEventMap>(type: K, callback: (e: DocumentEventMap[K]) => void) {
  let active = false;

  function activate() {
    if (!active) {
      document.addEventListener(type, callback);
      active = true;
    }
  }

  function deactivate() {
    document.removeEventListener(type, callback);
    active = false;
  }

  function fire() {
    document.documentElement.dispatchEvent(new CustomEvent(type));
  }

  onBeforeUnmount(() => {
    deactivate();
  });

  return {
    activate,
    deactivate,
    fire,
  };
}
