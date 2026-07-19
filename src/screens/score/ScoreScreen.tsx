import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppNavigation } from '../../navigation/NavigationContext';
import { useRequestsState } from '../../navigation/RequestsContext';

import { useScoreState } from '../../navigation/ScoreContext';
import { Colors } from '../../theme/colors';
import { CurrentGamePanel } from './CurrentGamePanel';

import { GameStatisticsPanel } from './GameStatisticsPanel';

export function ScoreScreen() {
  const { segment } = useScoreState();
  const { openRequestCenter } = useAppNavigation();
  const { submittedRequests } = useRequestsState();
  const activeRequestCount = submittedRequests.filter(
    r => r.status === 'active',
  ).length;

  return (
    <View style={styles.ScoreScreenContainer}>
      {segment === 'current' ? (
        <CurrentGamePanel
          notificationCount={activeRequestCount}
          onPressBell={openRequestCenter}
        />
      ) : (
        <GameStatisticsPanel
          notificationCount={activeRequestCount}
          onPressBell={openRequestCenter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ScoreScreenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
