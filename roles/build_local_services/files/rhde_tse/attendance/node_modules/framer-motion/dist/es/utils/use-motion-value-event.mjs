import { useIsomorphicLayoutEffect } from './use-isomorphic-effect.mjs';

function useMotionValueEvent(value, event, callback) {
    useIsomorphicLayoutEffect(() => value.on(event, callback), [value, event, callback]);
}

export { useMotionValueEvent };
