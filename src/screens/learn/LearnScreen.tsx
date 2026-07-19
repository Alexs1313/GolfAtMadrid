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
    <View style={styles.LearnScreenContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.LearnScreenScroll}
      >
        <ScreenHeader
          title="Learn"
          subtitle="Terminology & quiz"
          notificationCount={activeRequestCount}
          onPressBell={openRequestCenter}
        />

        <View style={styles.LearnScreenBody}>
          <View style={styles.LearnScreenSegmentControl}>
            <TouchableOpacity
              style={styles.LearnScreenSegmentButton}
              onPress={() => setSegment('dictionary')}
            >
              {segment === 'dictionary' ? (
                <LinearGradient
                  colors={[Colors.goldLight, Colors.gold]}
                  style={styles.LearnScreenSegmentFill}
                >
                  <Text style={styles.LearnScreenSegmentTextActive}>
                    Golf Dictionary
                  </Text>
                </LinearGradient>
              ) : (
                <Text style={styles.LearnScreenSegmentText}>
                  Golf Dictionary
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.LearnScreenSegmentButton}
              onPress={() => setSegment('saved')}
            >
              {segment === 'saved' ? (
                <LinearGradient
                  colors={[Colors.goldLight, Colors.gold]}
                  style={styles.LearnScreenSegmentFill}
                >
                  <Text style={styles.LearnScreenSegmentTextActive}>
                    Saved Terms
                  </Text>
                </LinearGradient>
              ) : (
                <Text style={styles.LearnScreenSegmentText}>Saved Terms</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.LearnScreenQuizCard}>
            <Text style={styles.LearnScreenQuizTitle}>
              Test Your Golf Knowledge
            </Text>
            <Text style={styles.LearnScreenQuizSubtitle}>
              {QUIZ_LENGTH} questions
              {bestScore !== null
                ? ` · Best score ${bestScore}/${QUIZ_LENGTH}`
                : ''}
            </Text>

            <View style={styles.LearnScreenDifficultyRow}>
              {DIFFICULTIES.map(difficulty => {
                const isActive = difficulty === quizDifficulty;
                return (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.LearnScreenDifficultyChip,
                      isActive && styles.LearnScreenDifficultyChipActive,
                    ]}
                    onPress={() => setQuizDifficulty(difficulty)}
                  >
                    <Text
                      style={[
                        styles.LearnScreenDifficultyText,
                        isActive && styles.LearnScreenDifficultyTextActive,
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
                style={styles.LearnScreenStartQuizBtn}
              >
                <Text style={styles.LearnScreenStartQuizBtnText}>
                  Start Quiz
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {segment === 'dictionary' && (
            <>
              <View style={styles.LearnScreenSearchWrap}>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search terms…"
                  placeholderTextColor="#757575"
                  style={styles.LearnScreenSearchInput}
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.LearnScreenCategoryRow}
              >
                {CATEGORIES.map(category => {
                  const isActive = category === selectedCategory;
                  return (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      style={[
                        styles.LearnScreenCategoryChipWrap,
                        isActive
                          ? styles.LearnScreenCategoryChipActive
                          : styles.LearnScreenCategoryChipInactive,
                      ]}
                    >
                      {isActive && (
                        <LinearGradient
                          colors={[Colors.goldLight, Colors.gold]}
                          style={styles.LearnScreenCategoryChipFill}
                        />
                      )}
                      <Text
                        style={
                          isActive
                            ? styles.LearnScreenCategoryTextActive
                            : styles.LearnScreenCategoryText
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
            <Text style={styles.LearnScreenEmptyText}>
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
    <View style={styles.TermCardContainer}>
      <View style={styles.TermCardBody}>
        <View style={styles.TermCardTitleRow}>
          <Text style={styles.TermCardTitle}>{term.term}</Text>
          <View style={styles.TermCardBadge}>
            <Text style={styles.TermCardBadgeText}>{term.category}</Text>
          </View>
        </View>
        <Text style={styles.TermCardDefinition}>{term.definition}</Text>
      </View>
      <TouchableOpacity style={styles.TermCardStarBtn} onPress={onToggleSaved}>
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
  LearnScreenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  LearnScreenScroll: {
    paddingBottom: 24,
  },
  LearnScreenBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  LearnScreenSegmentControl: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },

  LearnScreenSegmentButton: {
    flex: 1,
  },
  LearnScreenSegmentFill: {
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LearnScreenSegmentText: {
    height: 35,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.ivoryMuted,
    textAlign: 'center',
    lineHeight: 35,
  },
  LearnScreenSegmentTextActive: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  LearnScreenQuizCard: {
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    padding: 16,
    marginBottom: 16,
  },

  LearnScreenQuizTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 16.5,
    color: Colors.ivory,
    marginBottom: 4,
  },
  LearnScreenQuizSubtitle: {
    fontSize: 12,
    color: Colors.ivoryMuted,
    marginBottom: 16,
  },
  LearnScreenDifficultyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  LearnScreenDifficultyChip: {
    flex: 1,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#1b1f27',
    alignItems: 'center',
    justifyContent: 'center',
  },

  LearnScreenDifficultyChipActive: {
    backgroundColor: Colors.goldSoftBg,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
  },
  LearnScreenDifficultyText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textFainter,
  },
  LearnScreenDifficultyTextActive: {
    color: Colors.goldLight,
  },
  LearnScreenStartQuizBtn: {
    height: 41,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LearnScreenStartQuizBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.buttonText,
  },

  LearnScreenSearchWrap: {
    height: 42.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 12,
    justifyContent: 'center',
  },

  LearnScreenSearchInput: {
    height: 42.5,
    paddingHorizontal: 14,
    color: Colors.ivory,
    fontSize: 13.5,
  },
  LearnScreenCategoryRow: {
    marginBottom: 16,
  },

  LearnScreenCategoryChipWrap: {
    height: 30,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  LearnScreenCategoryChipFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  LearnScreenCategoryChipActive: {},
  LearnScreenCategoryChipInactive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderSoft,
  },

  LearnScreenCategoryText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.ivoryMuted,
  },
  LearnScreenCategoryTextActive: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.buttonText,
  },

  LearnScreenEmptyText: {
    fontSize: 12.5,
    color: Colors.textFainter,
    textAlign: 'center',
    paddingVertical: 40,
  },
  TermCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorderSoft,
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  TermCardBody: {
    flex: 1,
  },

  TermCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },

  TermCardTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 15.5,
    color: Colors.ivory,
  },
  TermCardBadge: {
    backgroundColor: Colors.goldSoftBg,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  TermCardBadgeText: {
    fontSize: 9,
    color: Colors.goldLight,
  },

  TermCardDefinition: {
    fontSize: 12,
    color: Colors.ivoryMuted,
    lineHeight: 17,
  },

  TermCardStarBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
