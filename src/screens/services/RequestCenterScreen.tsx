import React, { useEffect, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { BackHeader } from '../../components/BackHeader';
import { FadeInItem } from '../../components/FadeInItem';

import { useOverlayAnimation } from '../../hooks/useOverlayAnimation';
import { Colors } from '../../theme/colors';
import { useAppNavigation } from '../../navigation/NavigationContext';

import { useRequestsState } from '../../navigation/RequestsContext';
import type { SubmittedRequest } from '../../types';

const TABS: { key: SubmittedRequest['status']; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_BADGE_COLORS: Record<string, string> = {
  'Under Review': '#204a4a',
  Accepted: '#204a2c',
  'In Progress': '#2c3a4a',
};

const EMPTY_MESSAGES: Record<SubmittedRequest['status'], string> = {
  active: 'No active requests. Submitted requests will appear here.',
  completed: 'No completed requests yet.',
  cancelled: 'No cancelled requests.',
};

export function RequestCenterScreen() {
  const { closeRequestCenter, requestCenterOpen } = useAppNavigation();
  const { submittedRequests } = useRequestsState();
  const [tab, setTab] = useState<SubmittedRequest['status']>('active');
  const { renderedValue, animatedStyle } = useOverlayAnimation(
    requestCenterOpen ? true : null,
  );

  useEffect(() => {
    if (requestCenterOpen) {
      setTab('active');
    }
  }, [requestCenterOpen]);

  const filtered = submittedRequests.filter(r => r.status === tab);

  if (!renderedValue) {
    return null;
  }

  return (
    <Animated.View style={[styles.RequestCenterScreenWrapper, animatedStyle]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.RequestCenterScreenFeed}
      >
        <BackHeader title="Request Center" onBack={closeRequestCenter} />

        <View style={styles.RequestCenterScreenTabGroup}>
          {TABS.map(t => {
            const isActive = t.key === tab;
            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.RequestCenterScreenTabAction,
                  isActive && styles.RequestCenterScreenTabActionActive,
                ]}
                onPress={() => setTab(t.key)}
              >
                <Text
                  style={[
                    styles.RequestCenterScreenTabLabel,
                    isActive && styles.RequestCenterScreenTabLabelActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.RequestCenterScreenFeedList}>
          {filtered.length === 0 ? (
            <Text style={styles.RequestCenterScreenBlankMessage}>
              {EMPTY_MESSAGES[tab]}
            </Text>
          ) : (
            filtered.map((request, i) => (
              <FadeInItem
                key={request.id}
                index={i}
                style={styles.RequestCenterScreenTile}
              >
                <View style={styles.RequestCenterScreenTileHead}>
                  <Text style={styles.RequestCenterScreenTileHeading}>
                    {request.title}
                  </Text>
                  <View
                    style={[
                      styles.RequestCenterScreenChip,
                      {
                        backgroundColor:
                          STATUS_BADGE_COLORS[request.statusLabel] ??
                          '#2c3140',
                      },
                    ]}
                  >
                    <Text style={styles.RequestCenterScreenChipLabel}>
                      {request.statusLabel}
                    </Text>
                  </View>
                </View>
                <Text style={styles.RequestCenterScreenCaption}>
                  {request.category} · {request.refCode}
                </Text>
                <Text style={styles.RequestCenterScreenCaption}>
                  {request.submittedLabel}
                </Text>
              </FadeInItem>
            ))
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  RequestCenterScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
  },
  RequestCenterScreenTabGroup: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 7,
  },
  RequestCenterScreenTabAction: {
    flex: 1,
    height: 35,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RequestCenterScreenTabActionActive: {
    backgroundColor: '#1b1f27',
    borderColor: Colors.goldSoftBorder,
  },
  RequestCenterScreenTabLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textFaint,
  },
  RequestCenterScreenTabLabelActive: {
    color: Colors.goldLight,
  },
  RequestCenterScreenFeed: {
    paddingBottom: 24,
  },
  RequestCenterScreenFeedList: {
    paddingHorizontal: 16,
  },
  RequestCenterScreenBlankMessage: {
    fontSize: 12.5,
    color: Colors.textFainter,
    textAlign: 'center',
    paddingVertical: 40,
  },

  RequestCenterScreenTile: {
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 19,
    padding: 15,
    marginBottom: 12,
  },

  RequestCenterScreenTileHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },

  RequestCenterScreenTileHeading: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ivory,
  },

  RequestCenterScreenChip: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  RequestCenterScreenChipLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.goldLight,
    letterSpacing: 0.3,
  },
  RequestCenterScreenCaption: {
    fontSize: 11.5,
    color: Colors.textFaint,
    marginBottom: 6,
  },
});
