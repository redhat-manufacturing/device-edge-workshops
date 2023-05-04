import { isMotionValue } from './utils/is-motion-value.mjs';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-effect.mjs';

function useOnChange(value, callback) {
    useIsomorphicLayoutEffect(() => {
        if (isMotionValue(value)) {
            callback(value.get());
            return value.on("change", callback);
        }
    }, [value, callback]);
}
function useMultiOnChange(values, handler, cleanup) {
    useIsomorphicLayoutEffect(() => {
        const subscriptions = values.map((value) => value.on("change", handler));
        return () => {
            subscriptions.forEach((unsubscribe) => unsubscribe());
            cleanup();
        };
    });
}

export { useMultiOnChange, useOnChange };
