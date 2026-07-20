import React from 'react';
import { AppShell } from './AppShell';
import { LearnProvider } from './LearnContext';

import { NavigationProvider } from './NavigationContext';

import { RequestsProvider } from './RequestsContext';
import { ScoreProvider } from './ScoreContext';

export function AppNavigator() {
  return (
    <NavigationProvider>
      <ScoreProvider>
        <LearnProvider>
          <RequestsProvider>
            <AppShell />
          </RequestsProvider>
        </LearnProvider>
      </ScoreProvider>
    </NavigationProvider>
  );
}
