/**
 * One motion scale for the whole site. CSS twin: the --vaw-* variables in app/globals.css and the
 * `duration-micro|std|enter|morph` / default easing in tailwind.config.js. Change a number in all
 * three places or none.
 *
 * micro  hover colour flips, small state changes
 * std    cards, menus, panels, popovers
 * enter  scroll reveals and page-load entrances
 * morph  the navbar and other big shape changes
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  micro: 0.15,
  std: 0.25,
  enter: 0.5,
  morph: 0.75,
} as const;

/** Homepage navbar expand and the social bar. A plain tween so the bar does not spring. */
export const NAV_MORPH = {
  type: 'tween' as const,
  duration: 0.45,
  ease: [0.4, 0, 0.2, 1] as const,
};

/**
 * SVG animateMotion keys that pause briefly at each of `nodeCount` evenly spaced path nodes.
 * Travel:pause unit ratio is 2:1. `calcMode` must be `"linear"`.
 */
export function railBoltKeys(nodeCount: number) {
  if (nodeCount < 2) return null;
  const segs = nodeCount - 1;
  const pause = 1;
  const travel = 2;
  const total = nodeCount * pause + segs * travel;
  const keyPoints: number[] = [];
  const keyTimes: number[] = [];
  let t = 0;
  for (let i = 0; i < nodeCount; i++) {
    const p = i / segs;
    keyPoints.push(p, p);
    keyTimes.push(t / total, (t + pause) / total);
    t += pause;
    if (i < segs) t += travel;
  }
  keyTimes[keyTimes.length - 1] = 1;
  // Keep travel speed close to the old continuous 4.5s loop.
  const dur = `${((4.5 * total) / (segs * travel)).toFixed(2)}s`;
  return {
    keyPoints: keyPoints.join(';'),
    keyTimes: keyTimes.join(';'),
    dur,
  };
}
