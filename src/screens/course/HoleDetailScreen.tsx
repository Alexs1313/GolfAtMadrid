import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { BackHeader } from '../../components/BackHeader';
import { Fonts } from '../../constants/theme';
import { HOLES } from '../../data/holes';

import { useOverlayAnimation } from '../../hooks/useOverlayAnimation';
import { useAppNavigation } from '../../navigation/NavigationContext';

import { useScoreState } from '../../navigation/ScoreContext';
import { Colors } from '../../theme/colors';

export function HoleDetailScreen() {
  const { holeDetail, closeHoleDetail, openHoleDetail, selectTab } =
    useAppNavigation();
  const { jumpToHole } = useScoreState();
  const { renderedValue, animatedStyle } = useOverlayAnimation(holeDetail);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (holeDetail) {
      setAdded(false);
    }
  }, [holeDetail]);

  if (!renderedValue) {
    return null;
  }

  const hole = renderedValue;
  const index = HOLES.findIndex(h => h.number === hole.number);
  const previousHole = HOLES[(index - 1 + HOLES.length) % HOLES.length];
  const nextHole = HOLES[(index + 1) % HOLES.length];

  const addToCurrentGame = () => {
    jumpToHole(index);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeHoleDetail();
      selectTab('Score');
    }, 700);
  };

  return (
    <Animated.View style={[styles.HoleDetailScreenWrapper, animatedStyle]}>
      <BackHeader title={`Hole ${hole.number}`} onBack={closeHoleDetail} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.HoleDetailScreenContent}
      >
        <Image
          source={require('../../assets/guide-at-mdrd-hole-hero.png')}
          style={styles.HoleDetailScreenHero}
          resizeMode="cover"
        />

        <View style={styles.HoleDetailScreenStatsBoard}>
          <View style={styles.HoleDetailScreenStatTile}>
            <Text style={styles.HoleDetailScreenStatCaption}>PAR</Text>
            <Text style={styles.HoleDetailScreenStatFigure}>{hole.par}</Text>
          </View>
          <View style={styles.HoleDetailScreenStatTile}>
            <Text style={styles.HoleDetailScreenStatCaption}>DISTANCE</Text>
            <Text style={styles.HoleDetailScreenStatFigure}>
              {hole.yards} yds
            </Text>
          </View>
          <View style={styles.HoleDetailScreenStatTile}>
            <Text style={styles.HoleDetailScreenStatCaption}>
              HANDICAP INDEX
            </Text>
            <Text style={styles.HoleDetailScreenStatFigure}>
              {hole.handicapIndex}
            </Text>
          </View>
          <View style={styles.HoleDetailScreenStatTile}>
            <Text style={styles.HoleDetailScreenStatCaption}>TERRAIN</Text>
            <Text style={styles.HoleDetailScreenStatFigureCompact}>
              {hole.terrain}
            </Text>
          </View>
        </View>

        <Text style={styles.HoleDetailScreenSummary}>{hole.description}</Text>

        <Text style={styles.HoleDetailScreenSectionCaption}>Strategy</Text>
        <Text style={styles.HoleDetailScreenNote}>
          <Text style={styles.HoleDetailScreenNoteCaption}>Beginner tip: </Text>
          {hole.beginnerTip}
        </Text>
        <Text style={styles.HoleDetailScreenNote}>
          <Text style={styles.HoleDetailScreenNoteCaption}>Advanced tip: </Text>
          {hole.advancedTip}
        </Text>

        <View style={styles.HoleDetailScreenNavLine}>
          <TouchableOpacity
            style={styles.HoleDetailScreenNavControl}
            onPress={() => openHoleDetail(previousHole)}
          >
            <Text style={styles.HoleDetailScreenNavControlCopy}>
              Previous Hole
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.HoleDetailScreenNavControl}
            onPress={() => openHoleDetail(nextHole)}
          >
            <Text style={styles.HoleDetailScreenNavControlCopy}>Next Hole</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={addToCurrentGame}
          disabled={added}
        >
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.HoleDetailScreenPrimaryAction}
          >
            <Text style={styles.HoleDetailScreenPrimaryActionCopy}>
              {added ? 'Added ✓' : 'Add to Current Game'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  HoleDetailScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
  },
  HoleDetailScreenContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },

  HoleDetailScreenHero: {
    width: '100%',
    height: 140,
    borderRadius: 19,
    marginBottom: 18,
  },

  HoleDetailScreenStatsBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  HoleDetailScreenStatTile: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
  },
  HoleDetailScreenStatCaption: {
    fontSize: 10,
    color: Colors.textFaint,
    marginBottom: 8,
  },

  HoleDetailScreenStatFigure: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 16,
    color: Colors.ivory,
  },
  HoleDetailScreenStatFigureCompact: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ivory,
  },
  HoleDetailScreenSummary: {
    fontSize: 12.5,
    lineHeight: 20,
    color: Colors.ivoryMuted,
    marginBottom: 20,
  },

  HoleDetailScreenSectionCaption: {
    fontSize: 12,
    color: Colors.textFaint,
    marginBottom: 12,
  },
  HoleDetailScreenNote: {
    fontSize: 12.5,
    lineHeight: 19.375,
    color: Colors.ivoryMuted,
    marginBottom: 12,
  },
  HoleDetailScreenNoteCaption: {
    color: Colors.ivoryMuted,
    fontWeight: '700',
  },
  HoleDetailScreenNavLine: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    marginBottom: 12,
  },

  HoleDetailScreenNavControl: {
    flex: 1,
    height: 41,
    borderRadius: 14,
    backgroundColor: '#1b1f27',
    borderWidth: 1,
    borderColor: 'rgba(233,205,110,0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  HoleDetailScreenNavControlCopy: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.ivory,
  },

  HoleDetailScreenPrimaryAction: {
    height: 42.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  HoleDetailScreenPrimaryActionCopy: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
