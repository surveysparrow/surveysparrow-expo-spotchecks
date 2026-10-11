import { useLayoutEffect, useRef } from 'react';
import { execute } from '../helpers/executables';
import { captureP1Error } from '../helpers/sentry';

function useSafeNavigation() {
  try {
    const { usePathname } = require('expo-router');
    // Real path (/product/1 vs /product/2), not the route pattern from useSegments.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return usePathname() as string;
  } catch (error) {
    return null;
  }
}

export function useSpotcheckNavigation() {
  const pathname = useSafeNavigation();
  const previousRoute = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  useLayoutEffect(() => {
    if (!pathname) {
      return;
    }
    
    try {
      const currentRoute = pathname;

      if (!hasInitialized.current) {
        previousRoute.current = currentRoute;
        hasInitialized.current = true;
        return;
      }

      if (
        currentRoute !== previousRoute.current &&
        previousRoute.current !== null
      ) {
        execute('handleNavigationChange');
      }

      previousRoute.current = currentRoute;
    } catch (error: any) {
      captureP1Error(error, 'GENERAL', {
        action: 'navigationListener',
        errorMessage: error?.message,
      });
      console.error('Spotcheck: Navigation listener failed', error);
    }
  }, [pathname]);
}
