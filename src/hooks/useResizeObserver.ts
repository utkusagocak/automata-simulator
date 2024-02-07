import { Ref, onMounted, ref, watch } from 'vue';

interface ResizeObserverCallbackParams {
  width: number;
  height: number;
}

type ResizeObserverCallback = (cb: ResizeObserverCallbackParams) => void;

export function useResizeObserver<T extends HTMLElement>(
  cb: ResizeObserverCallback,
  element: Ref<T | undefined>,
) {
  const observer = ref<ResizeObserver | null>(null);

  watch(element, (current, old) => {
    if (observer && observer.value && element && old) {
      observer.value.unobserve(old);
    }

    if (current) {
      if (observer && observer.value && current) {
        observer.value.unobserve(current);
      }

      observer.value = new ResizeObserver((entries) => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        cb({ width, height } as ResizeObserverCallbackParams);
      });

      observe();
    }
  });

  const observe = () => {
    if (element && element.value && observer.value) {
      observer.value.observe(element.value);
    }
  };
}
