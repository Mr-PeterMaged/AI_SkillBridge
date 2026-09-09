import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only once hydrated on the client. Use instead of the classic
 * `useState(false) + useEffect(() => setState(true))` mount-flag pattern —
 * that pattern trips the `react-hooks/set-state-in-effect` lint rule and
 * causes an extra render; `useSyncExternalStore` is the React-endorsed way
 * to read this without a synchronous setState inside an effect body.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
