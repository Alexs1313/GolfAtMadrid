import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { EventItem, HoleItem, ServiceItem } from '../types';
import type { AppPhase, MainTab } from './types';

type ActiveFlow = { category: 'service'; item: ServiceItem };

type NavigationContextValue = {
  phase: AppPhase;
  finishLoader: () => void;
  finishOnboarding: () => void;

  activeTab: MainTab;
  selectTab: (tab: MainTab) => void;

  eventDetail: EventItem | null;
  openEventDetail: (event: EventItem) => void;
  closeEventDetail: () => void;

  holeDetail: HoleItem | null;
  openHoleDetail: (hole: HoleItem) => void;
  closeHoleDetail: () => void;

  serviceDetail: ServiceItem | null;
  openServiceDetail: (item: ServiceItem) => void;
  closeServiceDetail: () => void;

  requestCenterOpen: boolean;
  openRequestCenter: () => void;
  closeRequestCenter: () => void;

  selectedMapHole: HoleItem | null;
  selectMapHole: (hole: HoleItem) => void;
  closeMapHole: () => void;

  activeFlow: ActiveFlow | null;
  openServiceRequest: (item: ServiceItem) => void;
  closeFlow: () => void;

  requestSentTitle: string | null;
  showRequestSent: (title: string) => void;
  closeRequestSent: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<AppPhase>('Loader');
  const [activeTab, setActiveTab] = useState<MainTab>('Events');
  const [eventDetail, setEventDetail] = useState<EventItem | null>(null);
  const [holeDetail, setHoleDetail] = useState<HoleItem | null>(null);
  const [serviceDetail, setServiceDetail] = useState<ServiceItem | null>(null);
  const [requestCenterOpen, setRequestCenterOpen] = useState(false);
  const [selectedMapHole, setSelectedMapHole] = useState<HoleItem | null>(null);
  const [activeFlow, setActiveFlow] = useState<ActiveFlow | null>(null);
  const [requestSentTitle, setRequestSentTitle] = useState<string | null>(null);

  const finishLoader = useCallback(() => {
    setPhase('Onboarding');
  }, []);

  const finishOnboarding = useCallback(() => {
    setPhase('Main');
  }, []);

  const selectTab = useCallback((tab: MainTab) => {
    setActiveTab(tab);
    setEventDetail(null);
    setSelectedMapHole(null);
    setServiceDetail(null);
  }, []);

  const openEventDetail = useCallback((event: EventItem) => {
    setEventDetail(event);
  }, []);

  const closeEventDetail = useCallback(() => {
    setEventDetail(null);
  }, []);

  const openHoleDetail = useCallback((hole: HoleItem) => {
    setHoleDetail(hole);
  }, []);

  const closeHoleDetail = useCallback(() => {
    setHoleDetail(null);
  }, []);

  const openServiceDetail = useCallback((item: ServiceItem) => {
    setServiceDetail(item);
  }, []);

  const closeServiceDetail = useCallback(() => {
    setServiceDetail(null);
  }, []);

  const openRequestCenter = useCallback(() => {
    setRequestCenterOpen(true);
  }, []);

  const closeRequestCenter = useCallback(() => {
    setRequestCenterOpen(false);
  }, []);

  const selectMapHole = useCallback((hole: HoleItem) => {
    setSelectedMapHole(hole);
  }, []);

  const closeMapHole = useCallback(() => {
    setSelectedMapHole(null);
  }, []);

  const openServiceRequest = useCallback((item: ServiceItem) => {
    setActiveFlow({ category: 'service', item });
  }, []);

  const closeFlow = useCallback(() => {
    setActiveFlow(null);
  }, []);

  const showRequestSent = useCallback((title: string) => {
    setRequestSentTitle(title);
  }, []);

  const closeRequestSent = useCallback(() => {
    setRequestSentTitle(null);
  }, []);

  const value = useMemo(
    () => ({
      phase,
      finishLoader,
      finishOnboarding,
      activeTab,
      selectTab,
      eventDetail,
      openEventDetail,
      closeEventDetail,
      holeDetail,
      openHoleDetail,
      closeHoleDetail,
      serviceDetail,
      openServiceDetail,
      closeServiceDetail,
      requestCenterOpen,
      openRequestCenter,
      closeRequestCenter,
      selectedMapHole,
      selectMapHole,
      closeMapHole,
      activeFlow,
      openServiceRequest,
      closeFlow,
      requestSentTitle,
      showRequestSent,
      closeRequestSent,
    }),
    [
      phase,
      finishLoader,
      finishOnboarding,
      activeTab,
      selectTab,
      eventDetail,
      openEventDetail,
      closeEventDetail,
      holeDetail,
      openHoleDetail,
      closeHoleDetail,
      serviceDetail,
      openServiceDetail,
      closeServiceDetail,
      requestCenterOpen,
      openRequestCenter,
      closeRequestCenter,
      selectedMapHole,
      selectMapHole,
      closeMapHole,
      activeFlow,
      openServiceRequest,
      closeFlow,
      requestSentTitle,
      showRequestSent,
      closeRequestSent,
    ],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useAppNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useAppNavigation must be used within NavigationProvider');
  }
  return context;
}
