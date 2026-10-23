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
