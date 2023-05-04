import { keyframes } from './keyframes.mjs';
import { spring } from './spring.mjs';
import { decay } from './decay.mjs';
import { sync, cancelSync } from '../../frameloop/index.mjs';
import { interpolate } from '../../utils/interpolate.mjs';

const types = {
    decay,
    keyframes: keyframes,
    tween: keyframes,
    spring,
};
function loopElapsed(elapsed, duration, delay = 0) {
    return elapsed - duration - delay;
}
function reverseElapsed(elapsed, duration = 0, delay = 0, isForwardPlayback = true) {
    return isForwardPlayback
        ? loopElapsed(duration + -elapsed, duration, delay)
        : duration - (elapsed - duration) + delay;
}
function hasRepeatDelayElapsed(elapsed, duration, delay, isForwardPlayback) {
    return isForwardPlayback ? elapsed >= duration + delay : elapsed <= -delay;
}
const framesync = (update) => {
    const passTimestamp = ({ delta }) => update(delta);
    return {
        start: () => sync.update(passTimestamp, true),
        stop: () => cancelSync.update(passTimestamp),
    };
};
function animate({ duration, driver = framesync, elapsed = 0, repeat: repeatMax = 0, repeatType = "loop", repeatDelay = 0, keyframes, autoplay = true, onPlay, onStop, onComplete, onRepeat, onUpdate, type = "keyframes", ...options }) {
    var _a, _b;
    let driverControls;
    let repeatCount = 0;
    let computedDuration = duration;
    let latest;
    let isComplete = false;
    let isForwardPlayback = true;
    let interpolateFromNumber;
    const animator = types[keyframes.length > 2 ? "keyframes" : type];
    const origin = keyframes[0];
    const target = keyframes[keyframes.length - 1];
    if ((_b = (_a = animator).needsInterpolation) === null || _b === void 0 ? void 0 : _b.call(_a, origin, target)) {
        interpolateFromNumber = interpolate([0, 100], [origin, target], {
            clamp: false,
        });
        keyframes = [0, 100];
    }
    const animation = animator({
        ...options,
        duration,
        keyframes,
    });
    function repeat() {
        repeatCount++;
        if (repeatType === "reverse") {
            isForwardPlayback = repeatCount % 2 === 0;
            elapsed = reverseElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback);
        }
        else {
            elapsed = loopElapsed(elapsed, computedDuration, repeatDelay);
            if (repeatType === "mirror")
                animation.flipTarget();
        }
        isComplete = false;
        onRepeat && onRepeat();
    }
    function complete() {
        driverControls.stop();
        onComplete && onComplete();
    }
    function update(delta) {
        if (!isForwardPlayback)
            delta = -delta;
        elapsed += delta;
        if (!isComplete) {
            const state = animation.next(Math.max(0, elapsed));
            latest = state.value;
            if (interpolateFromNumber)
                latest = interpolateFromNumber(latest);
            isComplete = isForwardPlayback ? state.done : elapsed <= 0;
        }
        onUpdate && onUpdate(latest);
        if (isComplete) {
            if (repeatCount === 0) {
                computedDuration =
                    computedDuration !== undefined ? computedDuration : elapsed;
            }
            if (repeatCount < repeatMax) {
                hasRepeatDelayElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback) && repeat();
            }
            else {
                complete();
            }
        }
    }
    function play() {
        onPlay && onPlay();
        driverControls = driver(update);
        driverControls.start();
    }
    autoplay && play();
    return {
        stop: () => {
            onStop && onStop();
            driverControls.stop();
        },
        sample: (t) => {
            return animation.next(Math.max(0, t));
        },
    };
}

export { animate, hasRepeatDelayElapsed, loopElapsed, reverseElapsed };
