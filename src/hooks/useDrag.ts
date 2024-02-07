import { Ref, onMounted, onUnmounted, ref, watch } from 'vue';

type UseDragOptions = {
  onDrag?: (event: PointerEvent) => void;
  onStartDrag?: (event: PointerEvent) => void | false;
  onDrop?: (event: PointerEvent) => void;
};

export function useDrag(element: Ref<HTMLElement | undefined>, options: UseDragOptions = {}) {
  const isDragging = ref(false);

  const handlePointerDown = (event: PointerEvent) => {
    if (isDragging.value === true) return;

    isDragging.value = true;

    const handlePointerMove = (event: PointerEvent) => {
      if (isDragging.value) {
        options.onDrag?.(event);
        event.preventDefault();
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      options.onDrop?.(event);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointermove', handlePointerMove);

      isDragging.value = false;
    };

    const result = options.onStartDrag?.(event);
    if (result !== false) {
      document.addEventListener('pointerup', handlePointerUp);
      document.addEventListener('pointermove', handlePointerMove);
    }
    event.preventDefault();
  };

  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
  };

  watch(element, (element, oldElement) => {
    if (oldElement) {
      oldElement.removeEventListener('pointerdown', handlePointerDown);
      oldElement.removeEventListener('touchstart', handleTouchStart);
    }

    if (element) {
      element?.setAttribute('draggable', 'false');
      element.addEventListener('pointerdown', handlePointerDown);
      element.addEventListener('touchstart', handleTouchStart);
    }
  });

  onUnmounted(() => {
    if (element.value) {
      element.value.removeEventListener('pointerdown', handlePointerDown);
      element.value.removeEventListener('touchstart', handleTouchStart);
    }
  });

  return { isDragging: isDragging.value };
}
