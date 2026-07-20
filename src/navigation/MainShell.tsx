import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CourseMapScreen } from '../screens/course/CourseMapScreen';
import { HoleDetailScreen } from '../screens/course/HoleDetailScreen';
import { EventDetailScreen } from '../screens/events/EventDetailScreen';

import { EventsScreen } from '../screens/events/EventsScreen';
import { LearnScreen } from '../screens/learn/LearnScreen';

import { QuizCompleteScreen } from '../screens/learn/QuizCompleteScreen';
import { QuizQuestionScreen } from '../screens/learn/QuizQuestionScreen';

import { RequestCenterScreen } from '../screens/services/RequestCenterScreen';
import { RequestFlowScreen } from '../screens/services/RequestFlowScreen';
import { RequestSentModal } from '../screens/services/RequestSentModal';
import { ServiceDetailScreen } from '../screens/services/ServiceDetailScreen';
import { ServicesScreen } from '../screens/services/ServicesScreen';

import { GamePausedModal } from '../screens/score/GamePausedModal';
import { RoundCompleteScreen } from '../screens/score/RoundCompleteScreen';
import { ScoreScreen } from '../screens/score/ScoreScreen';

import { Colors } from '../theme/colors';
import { useLearnState } from './LearnContext';

import { useAppNavigation } from './NavigationContext';
import { useScoreState } from './ScoreContext';
import type { MainTab } from './types';

const TABS: { key: MainTab; label: string; icon: number }[] = [
  {
    key: 'Events',
    label: 'Events',
    icon: require('../assets/guide-at-mdrd-tab-events.png'),
  },
  {
    key: 'Course',
    label: 'Course',
    icon: require('../assets/guide-at-mdrd-tab-course.png'),
  },
  {
    key: 'Score',
    label: 'Score',
    icon: require('../assets/guide-at-mdrd-tab-score.png'),
  },
  {
    key: 'Learn',
    label: 'Learn',
    icon: require('../assets/guide-at-mdrd-tab-learn.png'),
  },
  {
    key: 'Services',
    label: 'Services',
    icon: require('../assets/guide-at-mdrd-tab-services.png'),
  },
];

function TabContent({
  tab,
  hasEventDetail,
}: {
  tab: MainTab;
  hasEventDetail: boolean;
}) {
  if (tab === 'Events') {
    return hasEventDetail ? <EventDetailScreen /> : <EventsScreen />;
  }
  if (tab === 'Course') {
    return <CourseMapScreen />;
  }
  if (tab === 'Score') {
    return <ScoreScreen />;
  }
  if (tab === 'Services') {
    return <ServicesScreen />;
  }
  return <LearnScreen />;
}

export function MainShell() {
  const {
    activeTab,
    selectTab,
    eventDetail,
    holeDetail,
    serviceDetail,
    requestCenterOpen,
    selectedMapHole,
    activeFlow,
    requestSentTitle,
  } = useAppNavigation();
  const { roundComplete } = useScoreState();
  const { activeQuiz, quizResult } = useLearnState();
  const showTabBar =
    !activeFlow &&
    !holeDetail &&
    !serviceDetail &&
    !requestCenterOpen &&
    !selectedMapHole &&
    !roundComplete &&
    !activeQuiz &&
    !quizResult;

  const contentFade = useRef(new Animated.Value(1)).current;
  const prevTab = useRef(activeTab);

  useEffect(() => {
    if (prevTab.current !== activeTab) {
      prevTab.current = activeTab;
      contentFade.setValue(0);
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }).start();
    }
  }, [activeTab, contentFade]);

  return (
    <View style={styles.MainShellWrapper}>
      <Animated.View style={[styles.MainShellBody, { opacity: contentFade }]}>
        <TabContent tab={activeTab} hasEventDetail={!!eventDetail} />
      </Animated.View>

      {showTabBar && (
        <View style={styles.MainShellTabStrip}>
          {TABS.map(tab => {
            const isActive = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.MainShellTabControl}
                onPress={() => selectTab(tab.key)}
                activeOpacity={0.7}
              >
                <Image
                  source={tab.icon}
                  style={[
                    styles.MainShellTabGlyph,
                    {
                      tintColor: isActive
                        ? Colors.goldLight
                        : Colors.tabInactive,
                    },
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.MainShellTabCaption,
                    isActive && styles.MainShellTabCaptionActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <HoleDetailScreen />
      <ServiceDetailScreen />
      <RequestCenterScreen />
      <RequestFlowScreen />
      <RoundCompleteScreen />
      <QuizQuestionScreen />
      <QuizCompleteScreen />
      {requestSentTitle && <RequestSentModal />}
      <GamePausedModal />
    </View>
  );
}

const styles = StyleSheet.create({
  MainShellWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  MainShellBody: {
    flex: 1,
  },
  MainShellTabStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarBg,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorderSoft,
    paddingTop: 8,
    paddingBottom: 24,
  },
  MainShellTabControl: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  MainShellTabGlyph: {
    width: 21,
    height: 21,
  },
  MainShellTabCaption: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.tabInactive,
  },
  MainShellTabCaptionActive: {
    color: Colors.goldLight,
  },
});
