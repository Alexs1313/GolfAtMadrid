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
      contentContainerStyle={styles.CurrentGamePanelScroller}
    >
      <ScreenHeader
        title="Score"
        subtitle="Track your round"
        notificationCount={notificationCount}
        onPressBell={onPressBell}
      />

      <View style={styles.CurrentGamePanelContent}>
        <ScoreSegmentTabs segment={segment} onSelect={setSegment} />

        <View style={styles.CurrentGamePanelHoleTile}>
          <View style={styles.CurrentGamePanelHoleLine}>
            <View>
              <Text style={styles.CurrentGamePanelCaption}>HOLE</Text>
              <Text style={styles.CurrentGamePanelHoleFigure}>
                {hole.number}
              </Text>
            </View>
            <View style={styles.CurrentGamePanelScoreVersusParGroup}>
              <Text style={styles.CurrentGamePanelCaption}>SCORE TO PAR</Text>
              <Text style={styles.CurrentGamePanelScoreVersusPar}>
                {formatToPar(cumulativeScoreToPar)}
              </Text>
            </View>
          </View>
          <Text style={styles.CurrentGamePanelSummary}>
            Par {hole.par} Total strokes {score.strokes} Putts {score.putts}
          </Text>
        </View>

        <View style={styles.CurrentGamePanelCountersLine}>
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

        <View style={styles.CurrentGamePanelNavLine}>
          <TouchableOpacity
            style={styles.CurrentGamePanelNavAction}
            onPress={() => goToHole(-1)}
            disabled={holeIndex === 0}
          >
            <Text style={styles.CurrentGamePanelNavActionLabel}>
              Previous Hole
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.CurrentGamePanelNavActionShell}
            onPress={() => goToHole(1)}
            disabled={holeIndex === HOLES.length - 1}
          >
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.CurrentGamePanelNextAction}
            >
              <Text style={styles.CurrentGamePanelNextActionLabel}>
                Next Hole
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.CurrentGamePanelActionsLine}>
          <TouchableOpacity
            style={[
              styles.CurrentGamePanelActionControl,
              progressSaved && styles.CurrentGamePanelActionControlSaved,
            ]}
            onPress={saveProgress}
          >
            <Text style={styles.CurrentGamePanelActionControlLabel}>
              {progressSaved ? 'Progress Saved ✓' : 'Save Progress'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.CurrentGamePanelActionControl}
            onPress={pauseGame}
          >
            <Text style={styles.CurrentGamePanelActionControlLabel}>
              Pause Game
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.CurrentGamePanelFinishAction}
            onPress={finishGame}
          >
            <Text style={styles.CurrentGamePanelFinishActionLabel}>
              Finish Game
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.CurrentGamePanelScoreboardHeading}>
          <Text style={styles.CurrentGamePanelScoreboardCaption}>
            Scoreboard
          </Text>
          <Text style={styles.CurrentGamePanelScoreboardTotal}>
            {participants.length + 1} players
          </Text>
        </View>

        <View style={styles.CurrentGamePanelPlayerLine}>
          <View style={styles.CurrentGamePanelPlayerDetails}>
            <View style={styles.CurrentGamePanelPlayerChip}>
              <Text style={styles.CurrentGamePanelPlayerChipLabelActive}>
                1
              </Text>
            </View>
            <Text style={styles.CurrentGamePanelPlayerLabel}>You</Text>
          </View>
          <Text style={styles.CurrentGamePanelPlayerTally}>
            {formatToPar(cumulativeScoreToPar)}
          </Text>
        </View>

        {participants.map((participant, i) => (
          <View
            key={participant.id}
            style={styles.CurrentGamePanelParticipantLine}
          >
            <View style={styles.CurrentGamePanelPlayerDetails}>
              <View style={styles.CurrentGamePanelPlayerChip}>
                <Text style={styles.CurrentGamePanelPlayerChipLabel}>
                  {i + 2}
                </Text>
              </View>
              <Text style={styles.CurrentGamePanelPlayerLabel}>
                {participant.name}
              </Text>
            </View>
            <View style={styles.CurrentGamePanelParticipantActions}>
              <TouchableOpacity
                style={styles.CurrentGamePanelParticipantAction}
                onPress={() => adjustParticipant(participant.id, -1)}
              >
                <Text style={styles.CurrentGamePanelParticipantActionLabel}>
                  –
                </Text>
              </TouchableOpacity>
              <Text style={styles.CurrentGamePanelParticipantTally}>
                {formatToPar(participant.scoreToPar)}
              </Text>
              <TouchableOpacity
                style={styles.CurrentGamePanelParticipantAction}
                onPress={() => adjustParticipant(participant.id, 1)}
              >
                <Text style={styles.CurrentGamePanelParticipantActionLabel}>
                  +
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.CurrentGamePanelRemoveAction}
                onPress={() => removeParticipant(participant.id)}
              >
                <Text style={styles.CurrentGamePanelRemoveActionLabel}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.CurrentGamePanelAddLine}>
          <TextInput
            value={participantName}
            onChangeText={setParticipantName}
            placeholder="Add participant name…"
            placeholderTextColor="#757575"
            style={styles.CurrentGamePanelAddField}
            onSubmitEditing={submitParticipant}
          />
          <TouchableOpacity onPress={submitParticipant}>
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.CurrentGamePanelAddAction}
            >
              <Text style={styles.CurrentGamePanelAddActionLabel}>Add</Text>
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
    <View style={styles.CounterWrapper}>
      <Text style={styles.CounterCaption}>{label}</Text>
      <View style={styles.CounterLine}>
        <TouchableOpacity style={styles.CounterAction} onPress={onDecrement}>
          <Text style={styles.CounterActionLabel}>–</Text>
        </TouchableOpacity>
        <Text style={styles.CounterFigure}>{value}</Text>
        <TouchableOpacity style={styles.CounterAction} onPress={onIncrement}>
          <Text style={styles.CounterActionLabel}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  CurrentGamePanelScroller: {
    paddingBottom: 24,
  },
  CurrentGamePanelContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  CurrentGamePanelHoleTile: {
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    padding: 18,
    marginBottom: 16,
  },
  CurrentGamePanelHoleLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  CurrentGamePanelScoreVersusParGroup: {
    alignItems: 'flex-end',
  },
  CurrentGamePanelCaption: {
    fontSize: 11,
    color: Colors.textFaint,
    marginBottom: 8,
  },
  CurrentGamePanelHoleFigure: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 32,
    color: Colors.ivory,
  },
  CurrentGamePanelScoreVersusPar: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 32,
    color: Colors.goldLight,
  },

  CurrentGamePanelSummary: {
    fontSize: 12,
    color: Colors.ivoryMuted,
  },
  CurrentGamePanelCountersLine: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  CurrentGamePanelNavLine: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  CurrentGamePanelNavAction: {
    flex: 1,
    height: 41.5,
    borderRadius: 14,
    backgroundColor: '#1b1f27',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CurrentGamePanelNavActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.ivory,
  },

  CurrentGamePanelNavActionShell: {
    flex: 1,
  },
  CurrentGamePanelNextAction: {
    height: 41.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CurrentGamePanelNextActionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.buttonText,
  },
  CurrentGamePanelActionsLine: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  CurrentGamePanelActionControl: {
    flex: 1,
    height: 37,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  CurrentGamePanelActionControlSaved: {
    backgroundColor: Colors.goldSoftBg,
  },
  CurrentGamePanelActionControlLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  CurrentGamePanelFinishAction: {
    flex: 1,
    height: 37,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(196,90,70,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  CurrentGamePanelFinishActionLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#e08876',
  },
  CurrentGamePanelScoreboardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  CurrentGamePanelScoreboardCaption: {
    fontSize: 12,
    color: Colors.textFaint,
  },
  CurrentGamePanelScoreboardTotal: {
    fontSize: 11.5,
    color: Colors.goldLight,
  },
  CurrentGamePanelPlayerLine: {
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

  CurrentGamePanelParticipantLine: {
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
  CurrentGamePanelPlayerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  CurrentGamePanelPlayerChip: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#252a34',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CurrentGamePanelPlayerChipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.ivoryMuted,
  },
  CurrentGamePanelPlayerChipLabelActive: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.goldLight,
  },
  CurrentGamePanelPlayerLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.ivory,
  },

  CurrentGamePanelPlayerTally: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 16,
    color: Colors.goldLight,
  },
  CurrentGamePanelParticipantActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  CurrentGamePanelParticipantAction: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#252a34',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  CurrentGamePanelParticipantActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.goldLight,
  },
  CurrentGamePanelParticipantTally: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 16,
    color: Colors.goldLight,
    minWidth: 30,
    textAlign: 'center',
  },
  CurrentGamePanelRemoveAction: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(196,90,70,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  CurrentGamePanelRemoveActionLabel: {
    fontSize: 13,
    color: '#e08876',
  },
  CurrentGamePanelAddLine: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  CurrentGamePanelAddField: {
    flex: 1,
    height: 37.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    paddingHorizontal: 12,
    color: Colors.ivory,
    fontSize: 13,
  },

  CurrentGamePanelAddAction: {
    width: 58,
    height: 37.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CurrentGamePanelAddActionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.buttonText,
  },

  CounterWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    alignItems: 'center',
  },
  CounterCaption: {
    fontSize: 11,
    color: Colors.textFaint,
    marginBottom: 12,
  },
  CounterLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  CounterAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#252a34',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  CounterActionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.goldLight,
  },

  CounterFigure: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 26,
    color: Colors.ivory,
    minWidth: 30,
    textAlign: 'center',
  },
});
