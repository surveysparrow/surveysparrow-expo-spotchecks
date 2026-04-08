import React, { Component, ErrorInfo } from "react";
import { Provider } from "react-redux";
import WebViewComponent from "./components/WebViewComponent";
import { Wrapper } from "./components/Wrapper";
import { getAllSpotcheckFunctions, getUserAgent } from "./helpers";
import {
  SpotcheckProps,
  TrackEventProps,
  TrackScreenOptions,
  TrackScreenProps,
} from "./helpers/types";
import { spotcheckStore, updateState } from "./state/spotcheckState";
import { execute, flushPendingExecutes, setListener } from "./helpers/executables";
import { SpotCheckButton } from "./components/SpotCheckButton";
import { useSpotcheckNavigation } from "./helpers/NavigationHandler";
import { initializeSentry, captureP0Error } from "./helpers/sentry";

function resolveTrackOptions(input?: TrackScreenOptions): Required<
  Pick<TrackScreenOptions, "variables" | "customProperties" | "userDetails">
> {
  return {
    variables: input?.variables ?? {},
    customProperties: input?.customProperties ?? {},
    userDetails: input?.userDetails ?? {},
  };
}

export const SDK_VERSION = '1.0.4-beta.1';

initializeSentry();

interface ErrorBoundaryState {
  hasError: boolean;
}

class SpotcheckErrorBoundary extends Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureP0Error(error, 'APP_CRASH', {
      type: 'appCrash',
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

const SpotCheckContent: React.FC = () => {
  useSpotcheckNavigation();

  return (
    <>
      <Wrapper>
        <WebViewComponent />
      </Wrapper>
      <SpotCheckButton />
    </>
  );
};

export const SpotCheck: React.FC = () => {
  return (
    <Provider store={spotcheckStore}>
      <SpotcheckErrorBoundary>
        <SpotCheckContent />
      </SpotcheckErrorBoundary>
    </Provider>
  );
};

export const initializeSpotChecks = async (params: SpotcheckProps) => {
  // Setup: store params early so Sentry fallback has domainName
  try {
    if (params.listener) {
      setListener(params.listener);
    }

    const userAgent = await getUserAgent();
    if (params.domainName) {
      spotcheckStore.dispatch(updateState({ params: { userAgent, domainName: params.domainName } }));
    } else {
      spotcheckStore.dispatch(updateState({ params: { userAgent } }));
    }
  } catch (error: any) {
    captureP0Error(error, 'SDK_INITIALIZATION', {
      action: 'initializeSpotChecks:setup',
      errorMessage: error?.message,
    });
    throw error;
  }

  // Init: fetch functions and initialize (has its own Sentry)
  try {
    await getAllSpotcheckFunctions(params.domainName);
    await execute("initializeSpotcheckComponent", params);
    await flushPendingExecutes();
  } catch (error: any) {
    console.error("Error initializing spotchecks:", error);
    throw error;
  }
};

export async function trackScreen(
  screen: string,
  options?: TrackScreenOptions
): Promise<void>;
export async function trackScreen(props: TrackScreenProps): Promise<void>;
export async function trackScreen(
  screenOrProps: string | TrackScreenProps,
  optionsArg?: TrackScreenOptions
): Promise<void> {
  const screen =
    typeof screenOrProps === "string" ? screenOrProps : screenOrProps.screen;
  const options = resolveTrackOptions(
    typeof screenOrProps === "string"
      ? optionsArg
      : screenOrProps.options
  );
  try {
    execute("trackScreen", { screen, options });
  } catch (error: any) {
    console.error("Error tracking screen:", error);
    throw error;
  }
}

export async function trackEvent(
  screen: string,
  event: Record<string, any>,
  options?: TrackScreenOptions
): Promise<void>;
export async function trackEvent(props: TrackEventProps): Promise<void>;
export async function trackEvent(
  screenOrProps: string | TrackEventProps,
  eventArg?: Record<string, any>,
  optionsArg?: TrackScreenOptions
): Promise<void> {
  let screen: string;
  let event: Record<string, any>;
  let options: ReturnType<typeof resolveTrackOptions>;
  if (typeof screenOrProps === "string") {
    screen = screenOrProps;
    if (eventArg === undefined) {
      throw new Error("trackEvent: `event` is required");
    }
    event = eventArg;
    options = resolveTrackOptions(optionsArg);
  } else {
    screen = screenOrProps.screen;
    if (screenOrProps.event == null) {
      throw new Error("trackEvent: `event` is required");
    }
    event = screenOrProps.event;
    options = resolveTrackOptions(screenOrProps.options);
  }
  try {
    execute("trackEvent", { screen, event, options });
  } catch (error: any) {
    console.error("Error tracking event:", error);
    throw error;
  }
}


export type {
  CustomProperties,
  SpotcheckProps,
  SsSpotcheckListener,
  TrackEventProps,
  TrackScreenProps,
  UserDetails,
  Variables,
} from "./helpers/types";
