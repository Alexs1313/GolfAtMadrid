import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Fonts } from '../constants/theme';
import { Colors } from '../theme/colors';

const LOADER_DURATION_MS = 4000;

interface Props {
  onFinish: () => void;
}

export function LoaderScreen({ onFinish }: Props) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const timer = setTimeout(onFinish, LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <ImageBackground
      source={require('../assets/guide-at-mdrd-loader-bg.png')}
      style={styles.LoaderScreenWrapper}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.LoaderScreenBody}>
          <View style={styles.LoaderScreenCrestFrame}>
            <Image
              source={require('../assets/guide-at-mdrd-loader-icon.png')}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.LoaderScreenHeading}>
            Golf at Casino{'\n'}De Madrid
          </Text>
          <Text style={styles.LoaderScreenCaption}>Est. 1836</Text>
        </View>

        <Animated.View
          style={[styles.LoaderScreenHalo, { transform: [{ rotate }] }]}
        />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  LoaderScreenWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  LoaderScreenScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  LoaderScreenBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  LoaderScreenCrestFrame: {
    marginBottom: 24,
  },

  LoaderScreenHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 29,
    lineHeight: 34,
    color: Colors.ivory,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  LoaderScreenCaption: {
    fontSize: 12.5,
    color: Colors.gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  LoaderScreenHalo: {
    position: 'absolute',
    bottom: 56,
    alignSelf: 'center',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: 'rgba(212,175,55,0.25)',
    borderTopColor: Colors.gold,
  },
});
