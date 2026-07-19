import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ScreenHeader } from '../../components/ScreenHeader';
import { Fonts } from '../../constants/theme';
import { HOLES } from '../../data/holes';

import { useScoreState } from '../../navigation/ScoreContext';
import { Colors } from '../../theme/colors';
import { ScoreSegmentTabs } from './ScoreSegmentTabs';

function formatToPar(value: number): string {
  if (value === 0) {
    return 'E';
  }
  return value > 0 ? `+${value}` : `${value}`;
}

export function CurrentGamePanel({
  notificationCount,
  onPressBell,
}: {
  notificationCount: number;
  onPressBell: () => void;
}) {
  const {
    segment,
    setSegment,
    holeIndex,
    holeScores,
    updateCurrentHole,
    goToHole,
    participants,
    addParticipant,
    adjustParticipant,
    removeParticipant,
    cumulativeScoreToPar,
    finishGame,
    pauseGame,
  } = useScoreState();
  const [participantName, setParticipantName] = useState('');
  const [progressSaved, setProgressSaved] = useState(false);

  const hole = HOLES[holeIndex];
  const score = holeScores[holeIndex];

  const submitParticipant = () => {
    addParticipant(participantName);
    setParticipantName('');
  };

  const saveProgress = () => {
    setProgressSaved(true);
    setTimeout(() => setProgressSaved(false), 1800);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.CurrentGamePanelScroll}
    >
      <ScreenHeader
        title="Score"
        subtitle="Track your round"
        notificationCount={notificationCount}
        onPressBell={onPressBell}
      />

      <View style={styles.CurrentGamePanelBody}>
        <ScoreSegmentTabs segment={segment} onSelect={setSegment} />

        <View style={styles.CurrentGamePanelHoleCard}>
          <View style={styles.CurrentGamePanelHoleRow}>
            <View>
              <Text style={styles.CurrentGamePanelLabel}>HOLE</Text>
              <Text style={styles.CurrentGamePanelHoleNumber}>
                {hole.number}
              </Text>
            </View>
            <View style={styles.CurrentGamePanelScoreToParWrap}>
              <Text style={styles.CurrentGamePanelLabel}>SCORE TO PAR</Text>
              <Text style={styles.CurrentGamePanelScoreToPar}>
                {formatToPar(cumulativeScoreToPar)}
              </Text>
            </View>
          </View>
          <Text style={styles.CurrentGamePanelMeta}>
            Par {hole.par} Total strokes {score.strokes} Putts {score.putts}
          </Text>
        </View>

        <View style={styles.CurrentGamePanelCountersRow}>
          <Counter
            label="STROKES"
            value={score.strokes}
            onDecrement={() => updateCurrentHole('strokes', -1)}
            onIncrement={() => updateCurrentHole('strokes', 1)}
          />
          <Counter
            label="PUTTS"
            value={score.putts}
            onDecrement={() => updateCurrentHole('putts', -1)}
            onIncrement={() => updateCurrentHole('putts', 1)}
          />
        </View>

        <View style={styles.CurrentGamePanelNavRow}>
          <TouchableOpacity
            style={styles.CurrentGamePanelNavBtn}
            onPress={() => goToHole(-1)}
            disabled={holeIndex === 0}
          >
            <Text style={styles.CurrentGamePanelNavBtnText}>Previous Hole</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.CurrentGamePanelNavBtnWrapper}
            onPress={() => goToHole(1)}
            disabled={holeIndex === HOLES.length - 1}
          >
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.CurrentGamePanelNextBtn}
            >
              <Text style={styles.CurrentGamePanelNextBtnText}>Next Hole</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.CurrentGamePanelActionsRow}>
          <TouchableOpacity
            style={[
              styles.CurrentGamePanelActionBtn,
              progressSaved && styles.CurrentGamePanelActionBtnSaved,
            ]}
            onPress={saveProgress}
          >
            <Text style={styles.CurrentGamePanelActionBtnText}>
              {progressSaved ? 'Progress Saved ✓' : 'Save Progress'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.CurrentGamePanelActionBtn}
            onPress={pauseGame}
          >
            <Text style={styles.CurrentGamePanelActionBtnText}>Pause Game</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.CurrentGamePanelFinishBtn}
            onPress={finishGame}
          >
            <Text style={styles.CurrentGamePanelFinishBtnText}>
              Finish Game
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.CurrentGamePanelScoreboardHeader}>
          <Text style={styles.CurrentGamePanelScoreboardLabel}>Scoreboard</Text>
          <Text style={styles.CurrentGamePanelScoreboardCount}>
            {participants.length + 1} players
          </Text>
        </View>

        <View style={styles.CurrentGamePanelPlayerRow}>
          <View style={styles.CurrentGamePanelPlayerInfo}>
            <View style={styles.CurrentGamePanelPlayerBadge}>
              <Text style={styles.CurrentGamePanelPlayerBadgeTextActive}>
                1
              </Text>
            </View>
            <Text style={styles.CurrentGamePanelPlayerName}>You</Text>
          </View>
          <Text style={styles.CurrentGamePanelPlayerScore}>
            {formatToPar(cumulativeScoreToPar)}
          </Text>
        </View>

        {participants.map((participant, i) => (
          <View
            key={participant.id}
            style={styles.CurrentGamePanelParticipantRow}
          >
            <View style={styles.CurrentGamePanelPlayerInfo}>
              <View style={styles.CurrentGamePanelPlayerBadge}>
                <Text style={styles.CurrentGamePanelPlayerBadgeText}>
                  {i + 2}
                </Text>
              </View>
              <Text style={styles.CurrentGamePanelPlayerName}>
                {participant.name}
              </Text>
            </View>
            <View style={styles.CurrentGamePanelParticipantControls}>
              <TouchableOpacity
                style={styles.CurrentGamePanelParticipantBtn}
                onPress={() => adjustParticipant(participant.id, -1)}
              >
                <Text style={styles.CurrentGamePanelParticipantBtnText}>–</Text>
              </TouchableOpacity>
              <Text style={styles.CurrentGamePanelParticipantScore}>
                {formatToPar(participant.scoreToPar)}
              </Text>
              <TouchableOpacity
                style={styles.CurrentGamePanelParticipantBtn}
                onPress={() => adjustParticipant(participant.id, 1)}
              >
                <Text style={styles.CurrentGamePanelParticipantBtnText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.CurrentGamePanelRemoveBtn}
                onPress={() => removeParticipant(participant.id)}
              >
                <Text style={styles.CurrentGamePanelRemoveBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.CurrentGamePanelAddRow}>
          <TextInput
            value={participantName}
            onChangeText={setParticipantName}
            placeholder="Add participant name…"
            placeholderTextColor="#757575"
            style={styles.CurrentGamePanelAddInput}
            onSubmitEditing={submitParticipant}
          />
          <TouchableOpacity onPress={submitParticipant}>
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.CurrentGamePanelAddBtn}
            >
              <Text style={styles.CurrentGamePanelAddBtnText}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function Counter({
  label,
  value,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <View style={styles.CounterContainer}>
      <Text style={styles.CounterLabel}>{label}</Text>
      <View style={styles.CounterRow}>
        <TouchableOpacity style={styles.CounterBtn} onPress={onDecrement}>
          <Text style={styles.CounterBtnText}>–</Text>
        </TouchableOpacity>
        <Text style={styles.CounterValue}>{value}</Text>
        <TouchableOpacity style={styles.CounterBtn} onPress={onIncrement}>
          <Text style={styles.CounterBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  CurrentGamePanelScroll: {
    paddingBottom: 24,
  },
  CurrentGamePanelBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  CurrentGamePanelHoleCard: {
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    padding: 18,
    marginBottom: 16,
  },
  CurrentGamePanelHoleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  CurrentGamePanelScoreToParWrap: {
    alignItems: 'flex-end',
  },
  CurrentGamePanelLabel: {
    fontSize: 11,
    color: Colors.textFaint,
    marginBottom: 8,
  },
  CurrentGamePanelHoleNumber: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 32,
    color: Colors.ivory,
  },
  CurrentGamePanelScoreToPar: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 32,
    color: Colors.goldLight,
  },

  CurrentGamePanelMeta: {
    fontSize: 12,
    color: Colors.ivoryMuted,
  },
  CurrentGamePanelCountersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  CurrentGamePanelNavRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  CurrentGamePanelNavBtn: {
    flex: 1,
    height: 41.5,
    borderRadius: 14,
    backgroundColor: '#1b1f27',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CurrentGamePanelNavBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.ivory,
  },

  CurrentGamePanelNavBtnWrapper: {
    flex: 1,
  },
  CurrentGamePanelNextBtn: {
    height: 41.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CurrentGamePanelNextBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.buttonText,
  },
  CurrentGamePanelActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  CurrentGamePanelActionBtn: {
    flex: 1,
    height: 37,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  CurrentGamePanelActionBtnSaved: {
    backgroundColor: Colors.goldSoftBg,
  },
  CurrentGamePanelActionBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  CurrentGamePanelFinishBtn: {
    flex: 1,
    height: 37,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(196,90,70,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  CurrentGamePanelFinishBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#e08876',
  },
  CurrentGamePanelScoreboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  CurrentGamePanelScoreboardLabel: {
    fontSize: 12,
    color: Colors.textFaint,
  },
  CurrentGamePanelScoreboardCount: {
    fontSize: 11.5,
    color: Colors.goldLight,
  },
  CurrentGamePanelPlayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderSoft,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(233,205,110,0.06)',
  },

  CurrentGamePanelParticipantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderSoft,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  CurrentGamePanelPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  CurrentGamePanelPlayerBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#252a34',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CurrentGamePanelPlayerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.ivoryMuted,
  },
  CurrentGamePanelPlayerBadgeTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.goldLight,
  },
  CurrentGamePanelPlayerName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.ivory,
  },

  CurrentGamePanelPlayerScore: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 16,
    color: Colors.goldLight,
  },
  CurrentGamePanelParticipantControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  CurrentGamePanelParticipantBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#252a34',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  CurrentGamePanelParticipantBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.goldLight,
  },
  CurrentGamePanelParticipantScore: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 16,
    color: Colors.goldLight,
    minWidth: 30,
    textAlign: 'center',
  },
  CurrentGamePanelRemoveBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(196,90,70,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  CurrentGamePanelRemoveBtnText: {
    fontSize: 13,
    color: '#e08876',
  },
  CurrentGamePanelAddRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  CurrentGamePanelAddInput: {
    flex: 1,
    height: 37.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    paddingHorizontal: 12,
    color: Colors.ivory,
    fontSize: 13,
  },

  CurrentGamePanelAddBtn: {
    width: 58,
    height: 37.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CurrentGamePanelAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.buttonText,
  },

  CounterContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    alignItems: 'center',
  },
  CounterLabel: {
    fontSize: 11,
    color: Colors.textFaint,
    marginBottom: 12,
  },
  CounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  CounterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#252a34',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  CounterBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.goldLight,
  },

  CounterValue: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 26,
    color: Colors.ivory,
    minWidth: 30,
    textAlign: 'center',
  },
});
