import { delay } from '../utils/delay.mjs';

function createInstantAnimation({ keyframes, elapsed, onUpdate, onComplete, }) {
    const setValue = () => {
        onUpdate && onUpdate(keyframes[keyframes.length - 1]);
        onComplete && onComplete();
        return () => { };
    };
    return elapsed ? delay(setValue, -elapsed) : setValue();
}

export { createInstantAnimation };
