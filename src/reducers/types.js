import type { PauseState } from "./pause";
import type { SourcesState } from "./source";
import type { BreakpointsState } from "./breakpoints";
import type { SearchState } from "./search";

export type State = {
  pause: PauseState,
  sources: SourcesState,
  breakpoints: BreakpointsState,
  search: SearchState
};

export type { SourceRecord } from "./source";

export type { BreakpointMap } from "./breakpoints";
