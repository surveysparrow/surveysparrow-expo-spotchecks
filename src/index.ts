import {
  SpotCheck,
  initializeSpotChecks,
  trackScreen,
  trackEvent,
} from "./spotchecks";

export { initializeSpotChecks, trackScreen, trackEvent };
export default SpotCheck;

export type {
  CustomProperties,
  SpotcheckProps,
  SsSpotcheckListener,
  TrackEventProps,
  TrackScreenProps,
  UserDetails,
  Variables,
} from "./spotchecks";
