import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Fonts } from '../../constants/theme';

import { useLearnState } from '../../navigation/LearnContext';
import { Colors } from '../../theme/colors';

export function QuizPausedModal() {
  const { activeQuiz, resumeQuiz, exitQuiz } = useLearnState();

  if (!activeQuiz) {
    return null;
  }

  return (
    <View style={styles.QuizPausedModalOverlay}>
      <View style={styles.QuizPausedModalPanel}>
        <Text style={styles.QuizPausedModalHeading}>Quiz Paused</Text>
        <Text style={styles.QuizPausedModalCaption}>
          Question {activeQuiz.currentIndex + 1} of{' '}
          {activeQuiz.questions.length}
        </Text>

        <TouchableOpacity
          style={styles.QuizPausedModalPrimaryActionWrap}
          onPress={resumeQuiz}
        >
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.QuizPausedModalPrimaryAction}
          >
            <Text style={styles.QuizPausedModalPrimaryActionLabel}>
              Resume Quiz
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.QuizPausedModalDangerAction}
          onPress={exitQuiz}
        >
          <Text style={styles.QuizPausedModalDangerActionLabel}>Exit Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  QuizPausedModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  QuizPausedModalPanel: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    borderRadius: 22,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  QuizPausedModalHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 19,
    color: Colors.ivory,
    marginBottom: 8,
  },

  QuizPausedModalCaption: {
    fontSize: 12.5,
    color: Colors.textFainter,
    marginBottom: 22,
    textAlign: 'center',
  },

  QuizPausedModalPrimaryActionWrap: {
    width: '100%',
    marginBottom: 12,
  },
  QuizPausedModalPrimaryAction: {
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  QuizPausedModalPrimaryActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.buttonText,
  },

  QuizPausedModalDangerAction: {
    width: '100%',
    height: 41.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(196,90,70,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  QuizPausedModalDangerActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e08876',
  },
});
