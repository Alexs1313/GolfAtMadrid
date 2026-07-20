import React from 'react';
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
import { useLearnState } from '../../navigation/LearnContext';

import { Colors } from '../../theme/colors';

function performanceLabel(accuracyPct: number): string {
  if (accuracyPct >= 90) {
    return 'Outstanding command of the rules';
  }
  if (accuracyPct >= 75) {
    return 'Solid grasp of the fundamentals';
  }
  if (accuracyPct >= 50) {
    return 'Good progress — keep practicing';
  }
  return 'Time to brush up on the basics';
}

export function QuizCompleteScreen() {
  const { quizResult, retryQuiz, closeQuizResult } = useLearnState();
  const { renderedValue, animatedStyle } = useOverlayAnimation(quizResult);

  if (!renderedValue) {
    return null;
  }

  return (
    <Animated.View style={[styles.QuizCompleteScreenWrapper, animatedStyle]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.QuizCompleteScreenOverline}>Quiz Complete</Text>
        <Text style={styles.QuizCompleteScreenTally}>
          {renderedValue.correct}/{renderedValue.total}
        </Text>
        <Text style={styles.QuizCompleteScreenCaption}>
          {performanceLabel(renderedValue.accuracyPct)} · Best{' '}
          {renderedValue.bestScore}/{renderedValue.total}
        </Text>

        <View style={styles.QuizCompleteScreenStatsLine}>
          <StatCard
            label="CORRECT"
            value={String(renderedValue.correct)}
            valueColor="#7bc17b"
          />
          <StatCard
            label="INCORRECT"
            value={String(renderedValue.incorrect)}
            valueColor="#e08876"
          />
          <StatCard
            label="ACCURACY"
            value={`${renderedValue.accuracyPct}%`}
            valueColor={Colors.ivory}
          />
        </View>

        <TouchableOpacity onPress={retryQuiz}>
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.QuizCompleteScreenPrimaryAction}
          >
            <Text style={styles.QuizCompleteScreenPrimaryActionLabel}>
              Try Again
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.QuizCompleteScreenSecondaryAction}
          onPress={closeQuizResult}
        >
          <Text style={styles.QuizCompleteScreenSecondaryActionLabel}>
            Return to Learn
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

function StatCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <View style={styles.StatCardShell}>
      <Text style={styles.StatCardCaption}>{label}</Text>
      <Text style={[styles.StatCardFigure, { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  QuizCompleteScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    paddingTop: 56,
    paddingHorizontal: 20,
  },

  QuizCompleteScreenOverline: {
    fontSize: 11,
    color: Colors.goldLight,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 12,
  },

  QuizCompleteScreenTally: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 34,
    color: Colors.ivory,
    textAlign: 'center',
    marginBottom: 12,
  },

  QuizCompleteScreenCaption: {
    fontSize: 13,
    color: Colors.ivoryMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  QuizCompleteScreenStatsLine: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  StatCardShell: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  StatCardCaption: {
    fontSize: 10,
    color: Colors.textFaint,
    marginBottom: 10,
  },

  StatCardFigure: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 19,
  },

  QuizCompleteScreenPrimaryAction: {
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  QuizCompleteScreenPrimaryActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.buttonText,
  },
  QuizCompleteScreenSecondaryAction: {
    height: 41.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  QuizCompleteScreenSecondaryActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.goldLight,
  },
});
