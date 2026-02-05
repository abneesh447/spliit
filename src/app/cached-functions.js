import { getGroup } from '@/lib/api';
import { cache } from 'react';
function logAndCache(fn) {
    const cached = cache((...args) => {
        // console.log(`Not cached: ${fn.name}…`)
        return fn(...args);
    });
    return (...args) => {
        // console.log(`Calling cached ${fn.name}…`)
        return cached(...args);
    };
}
export const cached = {
    getGroup: logAndCache(getGroup),
};
