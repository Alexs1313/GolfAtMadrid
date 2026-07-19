import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ScreenHeader } from '../../components/ScreenHeader';
import { PARKING_SPACES } from '../../data/parking';
import { useAppNavigation } from '../../navigation/NavigationContext';

import { useRequestsState } from '../../navigation/RequestsContext';
import { Colors } from '../../theme/colors';

import { Fonts } from '../../constants/theme';
import type { ParkingSpaceStatus, ServiceCategory } from '../../types';
import {
  ParkingSubTabs,
  ServiceCategoryTabs,
  type ParkingSegment,
} from './ServicesTabs';

const GRID_COLUMNS = 6;
const GRID_GAP = 7;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_SIZE =
  (SCREEN_WIDTH - 32 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

const LEGEND: { status: ParkingSpaceStatus; label: string; color: string }[] = [
  { status: 'available', label: 'Available', color: '#2c3140' },
  { status: 'reserved', label: 'Reserved', color: '#4a3020' },
  { status: 'accessible', label: 'Accessible', color: '#2c4a3a' },
  { status: 'evCharging', label: 'EV Charging', color: '#2c3a4a' },
];

const STATUS_COLORS: Record<ParkingSpaceStatus, string> = {
  available: '#2c3140',
  reserved: '#4a3020',
  accessible: '#2c4a3a',
  evCharging: '#2c3a4a',
};

export function ParkingMapScreen({
  notificationCount,
  onPressBell,
  category,
  onSelectCategory,
  parkingSegment,
  onSelectParkingSegment,
}: {
  notificationCount: number;
  onPressBell: () => void;
  category: ServiceCategory;
  onSelectCategory: (category: ServiceCategory) => void;
  parkingSegment: ParkingSegment;
  onSelectParkingSegment: (segment: ParkingSegment) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { showRequestSent } = useAppNavigation();
  const { reserveParkingSpace } = useRequestsState();

  const selectedSpace = PARKING_SPACES.find(s => s.id === selectedId) ?? null;

  const confirm = () => {
    if (!selectedSpace) {
      return;
    }
    reserveParkingSpace(selectedSpace);
    showRequestSent(`Parking Space ${selectedSpace.id} Reservation`);
    setSelectedId(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.ParkingMapScreenScroll}
    >
      <ScreenHeader
        title="Services"
        subtitle="Reservations & requests"
        notificationCount={notificationCount}
        onPressBell={onPressBell}
      />

      <View style={styles.ParkingMapScreenBody}>
        <ServiceCategoryTabs category={category} onSelect={onSelectCategory} />
        <ParkingSubTabs
          parkingSegment={parkingSegment}
          onSelect={onSelectParkingSegment}
        />

        <View style={styles.ParkingMapScreenLegendRow}>
          {LEGEND.map(item => (
            <View key={item.status} style={styles.ParkingMapScreenLegendItem}>
              <View
                style={[
                  styles.ParkingMapScreenLegendDot,
                  { backgroundColor: item.color },
                ]}
              />
              <Text style={styles.ParkingMapScreenLegendText}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.ParkingMapScreenGrid}>
          {PARKING_SPACES.map(space => {
            const isSelectable = space.status === 'available';
            const isSelected = space.id === selectedId;
            const cellStyle = [
              styles.ParkingMapScreenCell,
              {
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: STATUS_COLORS[space.status],
              },
              space.status === 'reserved' &&
                styles.ParkingMapScreenCellDisabled,
            ];

            return (
              <TouchableOpacity
                key={space.id}
                disabled={!isSelectable}
                onPress={() => setSelectedId(space.id)}
                style={cellStyle}
              >
                {isSelected && (
                  <LinearGradient
                    colors={[Colors.goldLight, Colors.gold]}
                    style={styles.ParkingMapScreenCellFill}
                  />
                )}
                <Text
                  style={[
                    styles.ParkingMapScreenCellText,
                    space.status === 'reserved' &&
                      styles.ParkingMapScreenCellTextDisabled,
                    isSelected && styles.ParkingMapScreenCellTextSelected,
                  ]}
                >
                  {space.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedSpace && (
          <View style={styles.ParkingMapScreenDetailCard}>
            <Text style={styles.ParkingMapScreenDetailTitle}>
              Space {selectedSpace.id}
            </Text>
            <Text style={styles.ParkingMapScreenDetailLine}>
              {selectedSpace.zone} · {selectedSpace.distanceLabel}
            </Text>
            <Text style={styles.ParkingMapScreenDetailLine}>
              Type: {selectedSpace.type}
            </Text>

            <TouchableOpacity
              style={styles.ParkingMapScreenConfirmBtnWrap}
              onPress={confirm}
            >
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ParkingMapScreenConfirmBtn}
              >
                <Text style={styles.ParkingMapScreenConfirmBtnText}>
                  Confirm Parking Request
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ParkingMapScreenScroll: {
    paddingBottom: 24,
  },
  ParkingMapScreenBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  ParkingMapScreenLegendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 12,
  },

  ParkingMapScreenLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ParkingMapScreenLegendDot: {
    width: 9,
    height: 9,
    borderRadius: 3,
  },
  ParkingMapScreenLegendText: {
    fontSize: 10.5,
    color: Colors.textFainter,
  },
  ParkingMapScreenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginBottom: 16,
  },
  ParkingMapScreenCell: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ParkingMapScreenCellDisabled: {
    opacity: 0.6,
  },
  ParkingMapScreenCellFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  ParkingMapScreenCellText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ivory,
  },

  ParkingMapScreenCellTextDisabled: {
    color: 'rgba(244,241,234,0.35)',
  },
  ParkingMapScreenCellTextSelected: {
    color: Colors.buttonText,
  },
  ParkingMapScreenDetailCard: {
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    borderRadius: 19,
    padding: 16,
  },
  ParkingMapScreenDetailTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 16,
    color: Colors.ivory,
    marginBottom: 10,
  },
  ParkingMapScreenDetailLine: {
    fontSize: 12.5,
    color: Colors.ivoryMuted,
    marginBottom: 6,
  },

  ParkingMapScreenConfirmBtnWrap: {
    marginTop: 10,
  },

  ParkingMapScreenConfirmBtn: {
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ParkingMapScreenConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
