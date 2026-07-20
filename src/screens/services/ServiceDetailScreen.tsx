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

import { BackHeader } from '../../components/BackHeader';

import { useOverlayAnimation } from '../../hooks/useOverlayAnimation';
import { Colors } from '../../theme/colors';

import { useAppNavigation } from '../../navigation/NavigationContext';
import { useRequestsState } from '../../navigation/RequestsContext';
import type { RequestCategory, ServiceCategory } from '../../types';

const CATEGORY_LABELS: Record<ServiceCategory, RequestCategory> = {
  resort: 'Resort Services',
  golfClub: 'Golf Club Services',
  parking: 'Parking',
};

export function ServiceDetailScreen() {
  const { serviceDetail, closeServiceDetail, showRequestSent } =
    useAppNavigation();
  const { submitRequest } = useRequestsState();
  const { renderedValue, animatedStyle } = useOverlayAnimation(serviceDetail);

  if (!renderedValue) {
    return null;
  }

  const service = renderedValue;

  const submit = () => {
    submitRequest(CATEGORY_LABELS[service.category], service.title);
    closeServiceDetail();
    showRequestSent(service.title);
  };

  return (
    <Animated.View style={[styles.ServiceDetailScreenWrapper, animatedStyle]}>
      <BackHeader title={service.title} onBack={closeServiceDetail} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ServiceDetailScreenContent}
      >
        <Text style={styles.ServiceDetailScreenSummary}>
          {service.description}
        </Text>

        <View style={styles.ServiceDetailScreenInfoLine}>
          <View style={styles.ServiceDetailScreenInfoTile}>
            <Text style={styles.ServiceDetailScreenInfoCaption}>
              AVAILABILITY
            </Text>
            <Text style={styles.ServiceDetailScreenInfoFigure}>
              {service.availabilityLabel}
            </Text>
          </View>
          <View style={styles.ServiceDetailScreenInfoTile}>
            <Text style={styles.ServiceDetailScreenInfoCaption}>
              RESPONSE TIME
            </Text>
            <Text style={styles.ServiceDetailScreenInfoFigure}>
              {service.responseTime}
            </Text>
          </View>
        </View>

        <Text style={styles.ServiceDetailScreenConditionsCaption}>
          Request Conditions
        </Text>
        <Text style={styles.ServiceDetailScreenConditionsCopy}>
          {service.conditions}
        </Text>
      </ScrollView>

      <View style={styles.ServiceDetailScreenBottomBar}>
        <TouchableOpacity onPress={submit}>
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ServiceDetailScreenAction}
          >
            <Text style={styles.ServiceDetailScreenActionLabel}>
              Submit Request
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ServiceDetailScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
  },

  ServiceDetailScreenContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 24,
  },
  ServiceDetailScreenSummary: {
    fontSize: 13,
    lineHeight: 20.8,
    color: Colors.ivoryMuted,
    marginBottom: 20,
  },

  ServiceDetailScreenInfoLine: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  ServiceDetailScreenInfoTile: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
  },
  ServiceDetailScreenInfoCaption: {
    fontSize: 10,
    color: Colors.textFaint,
    marginBottom: 8,
  },

  ServiceDetailScreenInfoFigure: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.ivory,
  },
  ServiceDetailScreenConditionsCaption: {
    fontSize: 12,
    color: Colors.textFaint,
    marginBottom: 10,
  },

  ServiceDetailScreenConditionsCopy: {
    fontSize: 12.5,
    lineHeight: 19.4,
    color: Colors.ivoryMuted,
  },
  ServiceDetailScreenBottomBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.headerBorder,
    padding: 18,
    marginBottom: 25,
  },
  ServiceDetailScreenAction: {
    height: 47.5,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ServiceDetailScreenActionLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
