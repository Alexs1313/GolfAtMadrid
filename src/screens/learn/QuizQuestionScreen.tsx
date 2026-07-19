import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Fonts } from '../../constants/theme';

import { useOverlayAnimation } from '../../hooks/useOverlayAnimation';
import { useLearnState } from '../../navigation/LearnContext';
import { Colors } from '../../theme/colors';

import { QuizPausedModal } from './QuizPausedModal';

const ADVANCE_DELAY_MS = 900;

export function QuizQuestionScreen() {
  const { activeQuiz, answerCurrentQuestion, advanceQuestion, pauseQuiz } =
    useLearnState();
  const { renderedValue, animatedStyle } = useOverlayAnimation(activeQuiz);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const questionFade = useRef(new Animated.Value(0)).current;

  const liveSelectedIndex = activeQuiz
    ? activeQuiz.answers[activeQuiz.currentIndex]
    : null;

  useEffect(() => {
    if (!activeQuiz || activeQuiz.isPaused || liveSelectedIndex === null) {
      return;
    }
    const timer = setTimeout(advanceQuestion, ADVANCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [activeQuiz, liveSelectedIndex, advanceQuestion]);

  useEffect(() => {
    if (!activeQuiz) {
      return;
    }
    Animated.timing(progressAnim, {
      toValue: activeQuiz.currentIndex / activeQuiz.questions.length,
      duration: 320,
      useNativeDriver: false,
    }).start();
  }, [activeQuiz?.currentIndex, activeQuiz?.questions.length, progressAnim]);

  useEffect(() => {
    if (!activeQuiz) {
      return;
    }
    questionFade.setValue(0);
    Animated.timing(questionFade, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [activeQuiz?.currentIndex, questionFade]);

  if (!renderedValue) {
    return null;
  }
  const question = renderedValue.questions[renderedValue.currentIndex];
  const selectedIndex = renderedValue.answers[renderedValue.currentIndex];
  const total = renderedValue.questions.length;

  const questionAnimatedStyle = {
    opacity: questionFade,
    transform: [
      {
        translateY: questionFade.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.QuizQuestionScreenContainer, animatedStyle]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.QuizQuestionScreenHeader}>
          <View style={styles.QuizQuestionScreenHeaderRow}>
            <Text style={styles.QuizQuestionScreenProgressLabel}>
              Question {renderedValue.currentIndex + 1} of {total}
            </Text>
            <TouchableOpacity
              style={styles.QuizQuestionScreenPauseBtn}
              onPress={pauseQuiz}
            >
              <Text style={styles.QuizQuestionScreenPauseBtnText}>Pause</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.QuizQuestionScreenProgressTrack}>
            <Animated.View
              style={[
                styles.QuizQuestionScreenProgressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <Animated.View
          style={[styles.QuizQuestionScreenBody, questionAnimatedStyle]}
        >
          <Text style={styles.QuizQuestionScreenQuestion}>
            {question.question}
          </Text>

          {question.options.map((option, index) => {
            const isSelected = selectedIndex !== null;
            const isCorrectOption = index === question.correctIndex;
            const isWrongSelected =
              isSelected && index === selectedIndex && !isCorrectOption;

            let optionStyle = styles.QuizQuestionScreenOption;
            let textStyle = styles.QuizQuestionScreenOptionText;
            if (isSelected && isCorrectOption) {
              optionStyle = styles.QuizQuestionScreenOptionCorrect;
              textStyle = styles.QuizQuestionScreenOptionTextCorrect;
            } else if (isWrongSelected) {
              optionStyle = styles.QuizQuestionScreenOptionWrong;
              textStyle = styles.QuizQuestionScreenOptionTextWrong;
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                disabled={isSelected}
                onPress={() => answerCurrentQuestion(index)}
              >
                <Text style={textStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {renderedValue.isPaused && <QuizPausedModal />}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  QuizQuestionScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
  },

  QuizQuestionScreenHeader: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  QuizQuestionScreenHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  QuizQuestionScreenProgressLabel: {
    fontSize: 12.5,
    color: Colors.ivoryMuted,
  },

  QuizQuestionScreenPauseBtn: {
    height: 28,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#181c22',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  QuizQuestionScreenPauseBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  QuizQuestionScreenProgressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1b1f27',
    overflow: 'hidden',
  },
  QuizQuestionScreenProgressFill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.goldLight,
  },
  QuizQuestionScreenBody: {
    paddingHorizontal: 20,
  },

  QuizQuestionScreenQuestion: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 20,
    lineHeight: 27,
    color: Colors.ivory,
    marginBottom: 24,
  },
  QuizQuestionScreenOption: {
    minHeight: 49,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 12,
  },

  QuizQuestionScreenOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ivory,
  },

  QuizQuestionScreenOptionCorrect: {
    minHeight: 49,
    borderRadius: 14,
    backgroundColor: 'rgba(123,193,123,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(123,193,123,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 12,
  },
  QuizQuestionScreenOptionTextCorrect: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9edb9e',
  },

  QuizQuestionScreenOptionWrong: {
    minHeight: 49,
    borderRadius: 14,
    backgroundColor: 'rgba(196,90,70,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(224,136,118,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 12,
  },
  QuizQuestionScreenOptionTextWrong: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e08876',
  },
});
