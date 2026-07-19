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
    <View style={styles.ScoreSegmentTabsControl}>
      <TouchableOpacity
        style={styles.ScoreSegmentTabsButton}
        onPress={() => onSelect('current')}
      >
        {segment === 'current' ? (
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            style={styles.ScoreSegmentTabsFill}
          >
            <Text style={styles.ScoreSegmentTabsTextActive}>Current Game</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.ScoreSegmentTabsText}>Current Game</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.ScoreSegmentTabsButton}
        onPress={() => onSelect('stats')}
      >
        {segment === 'stats' ? (
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            style={styles.ScoreSegmentTabsFill}
          >
            <Text style={styles.ScoreSegmentTabsTextActive}>
              Game Statistics
            </Text>
          </LinearGradient>
        ) : (
          <Text style={styles.ScoreSegmentTabsText}>Game Statistics</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ScoreSegmentTabsControl: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  ScoreSegmentTabsButton: {
    flex: 1,
  },
  ScoreSegmentTabsFill: {
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ScoreSegmentTabsText: {
    height: 35,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.ivoryMuted,
    textAlign: 'center',
    lineHeight: 35,
  },
  ScoreSegmentTabsTextActive: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.buttonText,
  },
});
