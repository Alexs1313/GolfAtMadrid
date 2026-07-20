import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { FadeInItem } from '../../components/FadeInItem';

import { ScreenHeader } from '../../components/ScreenHeader';

import { AppIcon } from '../../components/icons/AppIcon';

import { Fonts } from '../../constants/theme';
import { DICTIONARY_TERMS } from '../../data/dictionary';
import { useLearnState } from '../../navigation/LearnContext';
import { useAppNavigation } from '../../navigation/NavigationContext';
import { useRequestsState } from '../../navigation/RequestsContext';
import { Colors } from '../../theme/colors';
import type {
  DictionaryCategory,
  DictionaryTerm,
  QuizDifficulty,
} from '../../types';

const DIFFICULTIES: QuizDifficulty[] = ['Easy', 'Medium', 'Hard'];
const CATEGORIES: ('All' | DictionaryCategory)[] = [
  'All',
  'Scoring',
  'Course',
  'Swing',
  'Strategy',
  'Rules',
];
const QUIZ_LENGTH = 8;

export function LearnScreen() {
  const {
    segment,
    setSegment,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    savedTermIds,
    toggleSavedTerm,
    quizDifficulty,
    setQuizDifficulty,
    bestScores,
    startQuiz,
  } = useLearnState();
  const { openRequestCenter } = useAppNavigation();
  const { submittedRequests } = useRequestsState();
  const activeRequestCount = submittedRequests.filter(
    r => r.status === 'active',
  ).length;

  const visibleTerms = useMemo(() => {
    const base =
      segment === 'saved'
        ? DICTIONARY_TERMS.filter(term => savedTermIds.has(term.id))
        : DICTIONARY_TERMS;

    return base.filter(term => {
      const matchesCategory =
        segment === 'saved' ||
        selectedCategory === 'All' ||
        term.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        segment === 'saved' ||
        query.length === 0 ||
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [segment, selectedCategory, searchQuery, savedTermIds]);

  const bestScore = bestScores[quizDifficulty];

  return (
    <View style={styles.LearnScreenWrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.LearnScreenScrollArea}
      >
        <ScreenHeader
          title="Learn"
          subtitle="Terminology & quiz"
          notificationCount={activeRequestCount}
          onPressBell={openRequestCenter}
        />

        <View style={styles.LearnScreenContent}>
          <View style={styles.LearnScreenSegmentGroup}>
            <TouchableOpacity
              style={styles.LearnScreenSegmentAction}
              onPress={() => setSegment('dictionary')}
            >
              {segment === 'dictionary' ? (
                <LinearGradient
                  colors={[Colors.goldLight, Colors.gold]}
                  style={styles.LearnScreenSegmentHighlight}
                >
                  <Text style={styles.LearnScreenSegmentLabelActive}>
                    Golf Dictionary
                  </Text>
                </LinearGradient>
              ) : (
                <Text style={styles.LearnScreenSegmentLabel}>
                  Golf Dictionary
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.LearnScreenSegmentAction}
              onPress={() => setSegment('saved')}
            >
              {segment === 'saved' ? (
                <LinearGradient
                  colors={[Colors.goldLight, Colors.gold]}
                  style={styles.LearnScreenSegmentHighlight}
                >
                  <Text style={styles.LearnScreenSegmentLabelActive}>
                    Saved Terms
                  </Text>
                </LinearGradient>
              ) : (
                <Text style={styles.LearnScreenSegmentLabel}>Saved Terms</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.LearnScreenQuizPanel}>
            <Text style={styles.LearnScreenQuizHeading}>
              Test Your Golf Knowledge
            </Text>
            <Text style={styles.LearnScreenQuizCaption}>
              {QUIZ_LENGTH} questions
              {bestScore !== null
                ? ` · Best score ${bestScore}/${QUIZ_LENGTH}`
                : ''}
            </Text>

            <View style={styles.LearnScreenDifficultyLine}>
              {DIFFICULTIES.map(difficulty => {
                const isActive = difficulty === quizDifficulty;
                return (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.LearnScreenDifficultyTag,
                      isActive && styles.LearnScreenDifficultyTagActive,
                    ]}
                    onPress={() => setQuizDifficulty(difficulty)}
                  >
                    <Text
                      style={[
                        styles.LearnScreenDifficultyLabel,
                        isActive && styles.LearnScreenDifficultyLabelActive,
                      ]}
                    >
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity onPress={startQuiz}>
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.LearnScreenStartQuizAction}
              >
                <Text style={styles.LearnScreenStartQuizActionLabel}>
                  Start Quiz
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {segment === 'dictionary' && (
            <>
              <View style={styles.LearnScreenSearchShell}>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search terms…"
                  placeholderTextColor="#757575"
                  style={styles.LearnScreenSearchField}
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.LearnScreenCategoryLine}
              >
                {CATEGORIES.map(category => {
                  const isActive = category === selectedCategory;
                  return (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      style={[
                        styles.LearnScreenCategoryTagWrap,
                        isActive
                          ? styles.LearnScreenCategoryTagActive
                          : styles.LearnScreenCategoryTagInactive,
                      ]}
                    >
                      {isActive && (
                        <LinearGradient
                          colors={[Colors.goldLight, Colors.gold]}
                          style={styles.LearnScreenCategoryTagHighlight}
                        />
                      )}
                      <Text
                        style={
                          isActive
                            ? styles.LearnScreenCategoryLabelActive
                            : styles.LearnScreenCategoryLabel
                        }
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          )}

          {visibleTerms.length === 0 ? (
            <Text style={styles.LearnScreenPlaceholderLabel}>
              {segment === 'saved'
                ? 'No saved terms yet. Tap the star on any term to save it here.'
                : 'No terms match your search.'}
            </Text>
          ) : (
            visibleTerms.map((term, i) => (
              <FadeInItem key={term.id} index={i}>
                <TermCard
                  term={term}
                  isSaved={savedTermIds.has(term.id)}
                  onToggleSaved={() => toggleSavedTerm(term.id)}
                />
              </FadeInItem>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function TermCard({
  term,
  isSaved,
  onToggleSaved,
}: {
  term: DictionaryTerm;
  isSaved: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <View style={styles.TermCardWrapper}>
      <View style={styles.TermCardContent}>
        <View style={styles.TermCardTitleLine}>
          <Text style={styles.TermCardHeading}>{term.term}</Text>
          <View style={styles.TermCardTag}>
            <Text style={styles.TermCardTagLabel}>{term.category}</Text>
          </View>
        </View>
        <Text style={styles.TermCardDescription}>{term.definition}</Text>
      </View>
      <TouchableOpacity
        style={styles.TermCardStarAction}
        onPress={onToggleSaved}
      >
        <AppIcon
          name={isSaved ? 'starFilled' : 'star'}
          size={18}
          color={Colors.goldLight}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  LearnScreenWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  LearnScreenScrollArea: {
    paddingBottom: 24,
  },
  LearnScreenContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  LearnScreenSegmentGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },

  LearnScreenSegmentAction: {
    flex: 1,
  },
  LearnScreenSegmentHighlight: {
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LearnScreenSegmentLabel: {
    height: 35,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.ivoryMuted,
    textAlign: 'center',
    lineHeight: 35,
  },
  LearnScreenSegmentLabelActive: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  LearnScreenQuizPanel: {
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    padding: 16,
    marginBottom: 16,
  },

  LearnScreenQuizHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 16.5,
    color: Colors.ivory,
    marginBottom: 4,
  },
  LearnScreenQuizCaption: {
    fontSize: 12,
    color: Colors.ivoryMuted,
    marginBottom: 16,
  },
  LearnScreenDifficultyLine: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  LearnScreenDifficultyTag: {
    flex: 1,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#1b1f27',
    alignItems: 'center',
    justifyContent: 'center',
  },

  LearnScreenDifficultyTagActive: {
    backgroundColor: Colors.goldSoftBg,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
  },
  LearnScreenDifficultyLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textFainter,
  },
  LearnScreenDifficultyLabelActive: {
    color: Colors.goldLight,
  },
  LearnScreenStartQuizAction: {
    height: 41,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LearnScreenStartQuizActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.buttonText,
  },

  LearnScreenSearchShell: {
    height: 42.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 12,
    justifyContent: 'center',
  },

  LearnScreenSearchField: {
    height: 42.5,
    paddingHorizontal: 14,
    color: Colors.ivory,
    fontSize: 13.5,
  },
  LearnScreenCategoryLine: {
    marginBottom: 16,
  },

  LearnScreenCategoryTagWrap: {
    height: 30,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  LearnScreenCategoryTagHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  LearnScreenCategoryTagActive: {},
  LearnScreenCategoryTagInactive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderSoft,
  },

  LearnScreenCategoryLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.ivoryMuted,
  },
  LearnScreenCategoryLabelActive: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.buttonText,
  },

  LearnScreenPlaceholderLabel: {
    fontSize: 12.5,
    color: Colors.textFainter,
    textAlign: 'center',
    paddingVertical: 40,
  },
  TermCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorderSoft,
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  TermCardContent: {
    flex: 1,
  },

  TermCardTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },

  TermCardHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 15.5,
    color: Colors.ivory,
  },
  TermCardTag: {
    backgroundColor: Colors.goldSoftBg,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  TermCardTagLabel: {
    fontSize: 9,
    color: Colors.goldLight,
  },

  TermCardDescription: {
    fontSize: 12,
    color: Colors.ivoryMuted,
    lineHeight: 17,
  },

  TermCardStarAction: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
