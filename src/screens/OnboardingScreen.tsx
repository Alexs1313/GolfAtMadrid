import React, { useEffect, useRef, useState } from 'react';
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

import {
  OnboardingIcon,
  OnboardingIconName,
} from '../components/icons/OnboardingIcon';

import { Fonts } from '../constants/theme';

import { Colors } from '../theme/colors';

interface Page {
  bg: number;
  icon: OnboardingIconName;
  title: string;
  description: string;
  cta: string;
}

const PAGES: Page[] = [
  {
    bg: require('../assets/guide-at-mdrd-onboard-bg1.png'),
    icon: 'venueEvents',
    title: 'Venue Events',
    description:
      'Explore weekly events held at the venue — from sunrise practice sessions to clubhouse evenings — and send your attendance request in a tap.',
    cta: 'Continue',
  },
  {
    bg: require('../assets/guide-at-mdrd-onboard-bg2.png'),
    icon: 'courseMap',
    title: 'Course Map',
    description:
      'Explore the golf course hole by hole. Select any of the holes to see distance, par, difficulty and tactical notes.',
    cta: 'Continue',
  },
  {
    bg: require('../assets/guide-at-mdrd-onboard-bg3.png'),
    icon: 'scoreTracking',
    title: 'Live Golf Score Tracking',
    description:
      'Track strokes, putts, penalties and progress in real time on the course — solo or with your group.',
    cta: 'Continue',
  },
  {
    bg: require('../assets/guide-at-mdrd-onboard-bg4.png'),
    icon: 'golfLearning',
    title: 'Golf Learning',
    description:
      'Study golf terminology in the dictionary and put your knowledge to the test with a quick quiz.',
    cta: 'Continue',
  },
  {
    bg: require('../assets/guide-at-mdrd-onboard-bg5.png'),
    icon: 'services',
    title: 'Services & Reservations',
    description:
      'Request reserve equipment, book golf carts and select your parking space — all from one place.',
    cta: 'Get Started',
  },
];

const FILL = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%' as const,
};

interface Props {
  onFinish: () => void;
}

export function OnboardingScreen({ onFinish }: Props) {
  const [page, setPage] = useState(0);
  const current = PAGES[page];
  const isLast = page === PAGES.length - 1;

  const bottomBg = useRef(current.bg);
  const [topBg, setTopBg] = useState<number | null>(null);
  const bgFade = useRef(new Animated.Value(0)).current;
  const prevPage = useRef(page);

  const contentAnim = useRef(new Animated.Value(0)).current;
  const dotAnims = useRef(
    PAGES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0)),
  ).current;

  useEffect(() => {
    if (page === prevPage.current) {
      return;
    }
    prevPage.current = page;

    setTopBg(current.bg);
    bgFade.setValue(0);
    Animated.timing(bgFade, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        bottomBg.current = current.bg;
        setTopBg(null);
      }
    });

    contentAnim.setValue(0);
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 340,
      useNativeDriver: true,
    }).start();

    dotAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === page ? 1 : 0,
        duration: 280,
        useNativeDriver: false,
      }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 340,
      useNativeDriver: true,
    }).start();
  }, [contentAnim]);

  const complete = () => {
    onFinish();
  };

  const next = () => {
    if (isLast) {
      complete();
    } else {
      setPage(page + 1);
    }
  };

  const contentAnimatedStyle = {
    opacity: contentAnim,
    transform: [
      {
        translateY: contentAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.OnboardingScreenWrapper}>
      <Image source={bottomBg.current} style={FILL} resizeMode="cover" />
      {topBg !== null && (
        <Animated.Image
          source={topBg}
          style={[FILL, { opacity: bgFade }]}
          resizeMode="cover"
        />
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {!isLast && (
          <TouchableOpacity
            style={styles.OnboardingScreenSkipAction}
            onPress={complete}
          >
            <Text style={styles.OnboardingScreenSkipActionCopy}>Skip</Text>
          </TouchableOpacity>
        )}

        <View style={styles.OnboardingScreenContentPanel}>
          <Animated.View style={contentAnimatedStyle}>
            <View style={styles.OnboardingScreenIconChip}>
              <OnboardingIcon name={current.icon} />
            </View>

            <Text style={styles.OnboardingScreenHeadline}>{current.title}</Text>
            <Text style={styles.OnboardingScreenCaption}>
              {current.description}
            </Text>
          </Animated.View>

          <View style={styles.OnboardingScreenDotsLine}>
            {PAGES.map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.OnboardingScreenMarker,
                  {
                    width: dotAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [6, 20],
                    }),
                    backgroundColor: dotAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [Colors.dotInactive, Colors.goldLight],
                    }),
                  },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={next} activeOpacity={0.85}>
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.OnboardingScreenPrimaryAction}
            >
              <Text style={styles.OnboardingScreenPrimaryActionCopy}>
                {current.cta}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  OnboardingScreenWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  OnboardingScreenScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  OnboardingScreenSkipAction: {
    position: 'absolute',
    top: 56,
    right: 20,
    backgroundColor: Colors.skipBg,
    borderWidth: 1,
    borderColor: Colors.skipBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  OnboardingScreenSkipActionCopy: {
    color: Colors.goldLight,
    fontSize: 13,
    fontWeight: '600',
  },
  OnboardingScreenContentPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 26,
    paddingBottom: 48,
  },
  OnboardingScreenIconChip: {
    width: 52,
    height: 52,
    borderRadius: 19,
    backgroundColor: Colors.goldSoftBg,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  OnboardingScreenHeadline: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 25,
    lineHeight: 30,
    color: Colors.ivory,
    marginBottom: 16,
  },

  OnboardingScreenCaption: {
    fontSize: 14.5,
    lineHeight: 22.5,
    color: Colors.ivoryMuted,
    marginBottom: 24,
  },

  OnboardingScreenDotsLine: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 26,
  },
  OnboardingScreenMarker: {
    height: 6,
    borderRadius: 3,
  },

  OnboardingScreenPrimaryAction: {
    height: 51.5,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.goldGlow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },

  OnboardingScreenPrimaryActionCopy: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: '700',
  },
});
