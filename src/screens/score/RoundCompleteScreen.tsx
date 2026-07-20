import React, { useEffect, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Fonts } from '../../constants/theme';
import { useOverlayAnimation } from '../../hooks/useOverlayAnimation';
import { useScoreState } from '../../navigation/ScoreContext';
import { Colors } from '../../theme/colors';

function formatToPar(value: number): string {
  if (value === 0) {
    return 'E';
  }
  return value > 0 ? `+${value}` : `${value}`;
}

export function RoundCompleteScreen() {
  const { roundComplete, saveGame, startNewGame, viewStatistics } =
    useScoreState();
  const [gameSaved, setGameSaved] = useState(false);
  const { renderedValue, animatedStyle } = useOverlayAnimation(roundComplete);

  useEffect(() => {
    if (roundComplete) {
      setGameSaved(false);
    }
  }, [roundComplete]);

  if (!renderedValue) {
    return null;
  }

  const summary = renderedValue;

  const handleSaveGame = () => {
    if (gameSaved) {
      return;
    }
    saveGame();
    setGameSaved(true);
  };

  return (
    <Animated.View style={[styles.RoundCompleteScreenWrapper, animatedStyle]}>
      <View style={styles.RoundCompleteScreenTopSection}>
        <Text style={styles.RoundCompleteScreenOverline}>ROUND COMPLETE</Text>
        <Text style={styles.RoundCompleteScreenHeading}>
          {formatToPar(summary.scoreToPar)}{' '}
          <Text style={styles.RoundCompleteScreenHeadingDetail}>
            ({summary.finalStrokes} strokes)
          </Text>
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.RoundCompleteScreenContent}
      >
        <View style={styles.RoundCompleteScreenLayout}>
          <StatCard label="FINAL SCORE" value={String(summary.finalStrokes)} />
          <StatCard
            label="SCORE TO PAR"
            value={formatToPar(summary.scoreToPar)}
          />
          <StatCard label="TOTAL PUTTS" value={String(summary.totalPutts)} />
          <StatCard label="BEST HOLE" value={`Hole ${summary.bestHole}`} />
          <StatCard
            label="TOUGHEST HOLE"
            value={`Hole ${summary.toughestHole}`}
          />
          <StatCard label="FAIRWAYS HIT" value={`${summary.fairwaysHitPct}%`} />
          <StatCard
            label="GREENS IN REG."
            value={`${summary.greensInRegPct}%`}
          />
          <StatCard label="DURATION" value={`${summary.durationMin} min`} />
        </View>
      </ScrollView>

      <View style={styles.RoundCompleteScreenBottomSection}>
        <View style={styles.RoundCompleteScreenLine}>
          <TouchableOpacity
            style={[
              styles.RoundCompleteScreenSecondaryAction,
              gameSaved && styles.RoundCompleteScreenSecondaryActionSaved,
            ]}
            onPress={handleSaveGame}
          >
            <Text style={styles.RoundCompleteScreenSecondaryActionLabel}>
              {gameSaved ? 'Game Saved ✓' : 'Save Game'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.RoundCompleteScreenSecondaryAction}
            onPress={viewStatistics}
          >
            <Text style={styles.RoundCompleteScreenSecondaryActionLabel}>
              View Statistics
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={startNewGame}>
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.RoundCompleteScreenPrimaryAction}
          >
            <Text style={styles.RoundCompleteScreenPrimaryActionLabel}>
              Start New Game
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.StatCardShell}>
      <Text style={styles.StatCardCaption}>{label}</Text>
      <Text style={styles.StatCardFigure}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  RoundCompleteScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
  },

  RoundCompleteScreenTopSection: {
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.headerBorder,
  },

  RoundCompleteScreenOverline: {
    fontSize: 11,
    color: Colors.goldLight,
    letterSpacing: 2,
    marginBottom: 10,
  },
  RoundCompleteScreenHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 26,
    color: Colors.ivory,
  },

  RoundCompleteScreenHeadingDetail: {
    fontSize: 16,
    color: Colors.textFaint,
  },
  RoundCompleteScreenContent: {
    padding: 18,
  },
  RoundCompleteScreenLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  StatCardShell: {
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 16,
    padding: 13,
  },
  StatCardCaption: {
    fontSize: 10.5,
    color: Colors.textFaint,
    marginBottom: 8,
  },
  StatCardFigure: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 18,
    color: Colors.ivory,
  },
  RoundCompleteScreenBottomSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.headerBorder,
    padding: 18,
    gap: 12,
    marginBottom: 25,
  },
  RoundCompleteScreenLine: {
    flexDirection: 'row',
    gap: 10,
  },
  RoundCompleteScreenSecondaryAction: {
    flex: 1,
    height: 41,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RoundCompleteScreenSecondaryActionSaved: {
    backgroundColor: Colors.goldSoftBg,
  },
  RoundCompleteScreenSecondaryActionLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  RoundCompleteScreenPrimaryAction: {
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  RoundCompleteScreenPrimaryActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
