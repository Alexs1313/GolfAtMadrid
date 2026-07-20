import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors } from '../../theme/colors';

type ScoreSegment = 'current' | 'stats';

export function ScoreSegmentTabs({
  segment,
  onSelect,
}: {
  segment: ScoreSegment;
  onSelect: (segment: ScoreSegment) => void;
}) {
  return (
    <View style={styles.ScoreSegmentTabsShell}>
      <TouchableOpacity
        style={styles.ScoreSegmentTabsAction}
        onPress={() => onSelect('current')}
      >
        {segment === 'current' ? (
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            style={styles.ScoreSegmentTabsBackdrop}
          >
            <Text style={styles.ScoreSegmentTabsLabelActive}>Current Game</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.ScoreSegmentTabsLabel}>Current Game</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.ScoreSegmentTabsAction}
        onPress={() => onSelect('stats')}
      >
        {segment === 'stats' ? (
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            style={styles.ScoreSegmentTabsBackdrop}
          >
            <Text style={styles.ScoreSegmentTabsLabelActive}>
              Game Statistics
            </Text>
          </LinearGradient>
        ) : (
          <Text style={styles.ScoreSegmentTabsLabel}>Game Statistics</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ScoreSegmentTabsShell: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  ScoreSegmentTabsAction: {
    flex: 1,
  },
  ScoreSegmentTabsBackdrop: {
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ScoreSegmentTabsLabel: {
    height: 35,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.ivoryMuted,
    textAlign: 'center',
    lineHeight: 35,
  },
  ScoreSegmentTabsLabelActive: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.buttonText,
  },
});
