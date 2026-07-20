import React from 'react';

import { LoaderScreen } from '../screens/LoaderScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { MainShell } from './MainShell';

import { useAppNavigation } from './NavigationContext';

export function AppShell() {
  const { phase, finishLoader, finishOnboarding } = useAppNavigation();

  if (phase === 'Loader') {
    return <LoaderScreen onFinish={finishLoader} />;
  }

  if (phase === 'Onboarding') {
    return <OnboardingScreen onFinish={finishOnboarding} />;
  }

  return <MainShell />;
}
