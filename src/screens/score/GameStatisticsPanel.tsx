import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import LinearGradient from 'react-native-linear-gradient';

import { FadeInItem } from '../../components/FadeInItem';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Fonts } from '../../constants/theme';

import { useScoreState } from '../../navigation/ScoreContext';
import { Colors } from '../../theme/colors';
import { ScoreSegmentTabs } from './ScoreSegmentTabs';

import type { SavedGame } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32 - 32 - 8;

const PERIODS = [
  { key: '7d', label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { key: '30d', label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { key: '3m', label: '3 Months', ms: 90 * 24 * 60 * 60 * 1000 },
  { key: 'all', label: 'All Time', ms: Infinity },
];

// Illustrative placeholder shown only until the player has saved a real round.
const DEMO_STATS = {
  gamesPlayed: '24',
  bestScore: '-3',
  avgScore: '+6.4',
  avgPutts: '32.1',
  holesPlayed: '396',
  improvement: '+8%',
};
const DEMO_SCORE_HISTORY = [9, 14, 8, 12, 6, 11].map((value, i) => ({
  value,
  label: `R${i + 1}`,
}));
const DEMO_STROKES = [44, 36, 32, 40, 24, 36].map((value, i) => ({
  value,
  label: `R${i + 1}`,
}));

function formatToPar(value: number): string {
  if (value === 0) {
    return 'E';
  }
  return value > 0 ? `+${value}` : `${value}`;
}

export function GameStatisticsPanel({
  notificationCount,
  onPressBell,
}: {
  notificationCount: number;
  onPressBell: () => void;
}) {
  const { segment, setSegment, previousGames } = useScoreState();
  const [period, setPeriod] = useState('all');
  const isDemo = previousGames.length === 0;

  const periodMs = PERIODS.find(p => p.key === period)?.ms ?? Infinity;

  const listGames = useMemo(() => {
    const now = Date.now();
    return previousGames.filter(game => now - game.timestamp <= periodMs);
  }, [previousGames, periodMs]);

  const games = useMemo(
    () => [...listGames].sort((a, b) => a.timestamp - b.timestamp),
    [listGames],
  );

  const stats = isDemo ? DEMO_STATS : computeStats(games);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.GameStatisticsPanelScroll}
    >
      <ScreenHeader
        title="Score"
        subtitle="Track your round"
        notificationCount={notificationCount}
        onPressBell={onPressBell}
      />

      <View style={styles.GameStatisticsPanelBody}>
        <ScoreSegmentTabs segment={segment} onSelect={setSegment} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.GameStatisticsPanelPeriodRow}
        >
          {PERIODS.map(p => {
            const isActive = p.key === period;
            return (
              <TouchableOpacity key={p.key} onPress={() => setPeriod(p.key)}>
                {isActive ? (
                  <View style={styles.GameStatisticsPanelPeriodChip}>
                    <LinearGradient
                      colors={[Colors.goldLight, Colors.gold]}
                      style={styles.GameStatisticsPanelPeriodChipFill}
                    />
                    <Text style={styles.GameStatisticsPanelPeriodTextActive}>
                      {p.label}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.GameStatisticsPanelPeriodChipInactive}>
                    <Text style={styles.GameStatisticsPanelPeriodText}>
                      {p.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.GameStatisticsPanelStatsGrid}>
          <StatCard
            label="GAMES PLAYED"
            value={stats.gamesPlayed}
            unit="rounds"
          />
          <StatCard label="BEST SCORE" value={stats.bestScore} unit="vs par" />
          <StatCard label="AVG SCORE" value={stats.avgScore} unit="vs par" />
          <StatCard label="AVG PUTTS" value={stats.avgPutts} unit="per round" />
          <StatCard
            label="HOLES PLAYED"
            value={stats.holesPlayed}
            unit="holes"
          />
          <StatCard
            label="IMPROVEMENT"
            value={stats.improvement}
            unit="recent vs early rounds"
          />
        </View>

        <View style={styles.GameStatisticsPanelChartCard}>
          <Text style={styles.GameStatisticsPanelChartTitle}>
            Score History (strokes vs par)
          </Text>
          {isDemo ? (
            <ScoreLineChart data={DEMO_SCORE_HISTORY} />
          ) : games.length >= 2 ? (
            <ScoreLineChart
              key={period}
              data={games.map(g => ({
                value: g.summary.scoreToPar,
                label: g.dateLabel,
              }))}
            />
          ) : (
            <Text style={styles.GameStatisticsPanelChartEmpty}>
              {previousGames.length === 0
                ? 'Play and save at least 2 games to see your trend.'
                : 'Not enough rounds in this period to show a trend.'}
            </Text>
          )}
        </View>

        <View style={styles.GameStatisticsPanelChartCard}>
          <Text style={styles.GameStatisticsPanelChartTitle}>
            Strokes per Round (last 6)
          </Text>
          {isDemo ? (
            <StrokesBarChart data={DEMO_STROKES} />
          ) : games.length >= 1 ? (
            <StrokesBarChart
              key={period}
              data={games.slice(-6).map(g => ({
                value: g.summary.finalStrokes,
                label: g.dateLabel,
              }))}
            />
          ) : (
            <Text style={styles.GameStatisticsPanelChartEmpty}>
              {previousGames.length === 0
                ? 'No rounds saved yet.'
                : 'No rounds saved in this period yet.'}
            </Text>
          )}
        </View>

        <Text style={styles.GameStatisticsPanelPreviousLabel}>
          Previous Games
        </Text>
        {previousGames.length === 0 ? (
          <Text style={styles.GameStatisticsPanelEmptyText}>
            No saved games yet. Finish a round and tap Save Game to see it here.
          </Text>
        ) : listGames.length === 0 ? (
          <Text style={styles.GameStatisticsPanelEmptyText}>
            No saved games in this period.
          </Text>
        ) : (
          listGames.map((game, i) => (
            <FadeInItem
              key={game.id}
              index={i}
              style={styles.GameStatisticsPanelGameRow}
            >
              <Text style={styles.GameStatisticsPanelGameDate}>
                {game.dateLabel}
              </Text>
              <Text style={styles.GameStatisticsPanelGameStrokes}>
                {game.summary.finalStrokes} strokes
              </Text>
              <Text style={styles.GameStatisticsPanelGameScore}>
                {formatToPar(game.summary.scoreToPar)}
              </Text>
            </FadeInItem>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function computeStats(games: SavedGame[]) {
  if (games.length === 0) {
    return {
      gamesPlayed: '0',
      bestScore: '—',
      avgScore: '—',
      avgPutts: '—',
      holesPlayed: '0',
      improvement: '—',
    };
  }

  const scores = games.map(g => g.summary.scoreToPar);
  const putts = games.map(g => g.summary.totalPutts);
  const bestScore = Math.min(...scores);
  const avgScore = scores.reduce((sum, v) => sum + v, 0) / scores.length;
  const avgPutts = putts.reduce((sum, v) => sum + v, 0) / putts.length;

  let improvement = '—';
  if (games.length >= 2) {
    const mid = Math.floor(games.length / 2);
    const older = scores.slice(0, mid);
    const newer = scores.slice(mid);
    const olderAvg = older.reduce((s, v) => s + v, 0) / older.length;
    const newerAvg = newer.reduce((s, v) => s + v, 0) / newer.length;
    const delta = olderAvg - newerAvg;
    const pct =
      olderAvg !== 0 ? Math.round((delta / Math.abs(olderAvg)) * 100) : 0;
    improvement = `${pct >= 0 ? '+' : ''}${pct}%`;
  }

  return {
    gamesPlayed: String(games.length),
    bestScore: formatToPar(bestScore),
    avgScore: formatToPar(Math.round(avgScore * 10) / 10),
    avgPutts: avgPutts.toFixed(1),
    holesPlayed: String(games.length * 18),
    improvement,
  };
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <View style={styles.StatCardContainer}>
      <Text style={styles.StatCardLabel}>{label}</Text>
      <Text style={styles.StatCardValue}>{value}</Text>
      <Text style={styles.StatCardUnit}>{unit}</Text>
    </View>
  );
}

type ChartPoint = { value: number; label: string };

function ScoreLineChart({ data }: { data: ChartPoint[] }) {
  const points = data.map(point => ({
    value: point.value,
    label: point.label,
    dataPointText: formatToPar(point.value),
  }));

  return (
    <LineChart
      data={points}
      height={140}
      adjustToWidth
      parentWidth={CHART_WIDTH}
      color={Colors.goldLight}
      thickness={2.5}
      curved
      isAnimated
      animationDuration={700}
      dataPointsColor={Colors.goldLight}
      dataPointsRadius={3.5}
      areaChart
      startFillColor={Colors.goldLight}
      endFillColor={Colors.goldLight}
      startOpacity={0.28}
      endOpacity={0.02}
      textColor={Colors.ivoryMuted}
      textFontSize={10}
      textShiftY={-10}
      yAxisTextStyle={styles.GameStatisticsPanelYAxisLabel}
      xAxisLabelTextStyle={styles.GameStatisticsPanelXAxisLabel}
      yAxisColor={Colors.surfaceBorder}
      xAxisColor={Colors.surfaceBorder}
      rulesColor={Colors.surfaceBorderSoft}
      noOfSections={4}
      xAxisThickness={1}
      yAxisThickness={1}
      initialSpacing={12}
      endSpacing={12}
      disableScroll
    />
  );
}

function StrokesBarChart({ data }: { data: ChartPoint[] }) {
  const bars = data.map(point => ({
    value: point.value,
    label: point.label,
    frontColor: Colors.goldLight,
  }));

  return (
    <BarChart
      data={bars}
      width={CHART_WIDTH}
      height={80}
      adjustToWidth
      parentWidth={CHART_WIDTH}
      barBorderRadius={6}
      isAnimated
      animationDuration={700}
      showValuesAsTopLabel
      topLabelTextStyle={styles.GameStatisticsPanelBarTopLabel}
      yAxisTextStyle={styles.GameStatisticsPanelYAxisLabel}
      xAxisLabelTextStyle={styles.GameStatisticsPanelXAxisLabel}
      yAxisColor={Colors.surfaceBorder}
      xAxisColor={Colors.surfaceBorder}
      rulesColor={Colors.surfaceBorderSoft}
      noOfSections={4}
      xAxisThickness={0}
      yAxisThickness={0}
      initialSpacing={8}
      endSpacing={8}
      disableScroll
    />
  );
}

const styles = StyleSheet.create({
  GameStatisticsPanelScroll: {
    paddingBottom: 24,
  },
  GameStatisticsPanelBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  GameStatisticsPanelPeriodRow: {
    marginBottom: 16,
  },
  GameStatisticsPanelPeriodChip: {
    height: 32.5,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  GameStatisticsPanelPeriodChipFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  GameStatisticsPanelPeriodChipInactive: {
    height: 32.5,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  GameStatisticsPanelPeriodText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ivoryMuted,
  },
  GameStatisticsPanelPeriodTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  GameStatisticsPanelStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  StatCardContainer: {
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 16,
    padding: 13,
  },
  StatCardLabel: {
    fontSize: 10.5,
    color: Colors.textFaint,
    marginBottom: 8,
  },

  StatCardValue: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 21,
    color: Colors.ivory,
  },
  StatCardUnit: {
    fontSize: 10,
    color: Colors.textFainter,
    marginTop: 2,
  },
  GameStatisticsPanelYAxisLabel: {
    color: Colors.textFainter,
    fontSize: 10,
  },
  GameStatisticsPanelXAxisLabel: {
    color: Colors.textFainter,
    fontSize: 9,
  },
  GameStatisticsPanelBarTopLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.ivoryMuted,
    marginBottom: 4,
  },
  GameStatisticsPanelChartCard: {
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 19,
    padding: 16,
    marginBottom: 16,
  },

  GameStatisticsPanelChartTitle: {
    fontSize: 12.5,
    color: Colors.ivoryMuted,
    marginBottom: 12,
  },
  GameStatisticsPanelChartEmpty: {
    fontSize: 12,
    color: Colors.textFainter,
    paddingVertical: 20,
    textAlign: 'center',
  },
  GameStatisticsPanelPreviousLabel: {
    fontSize: 12,
    color: Colors.textFaint,
    marginBottom: 10,
  },

  GameStatisticsPanelEmptyText: {
    fontSize: 12.5,
    color: 'rgba(244,241,234,0.45)',
    textAlign: 'center',
    paddingVertical: 30,
  },

  GameStatisticsPanelGameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.headerBorder,
  },
  GameStatisticsPanelGameDate: {
    fontSize: 12.5,
    color: Colors.ivoryMuted,
    flex: 1,
  },

  GameStatisticsPanelGameStrokes: {
    fontSize: 12,
    color: Colors.textFainter,
    marginRight: 12,
  },

  GameStatisticsPanelGameScore: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 15,
    color: Colors.goldLight,
  },
});
