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
      contentContainerStyle={styles.ParkingMapScreenScrollWrap}
    >
      <ScreenHeader
        title="Services"
        subtitle="Reservations & requests"
        notificationCount={notificationCount}
        onPressBell={onPressBell}
      />

      <View style={styles.ParkingMapScreenContent}>
        <ServiceCategoryTabs category={category} onSelect={onSelectCategory} />
        <ParkingSubTabs
          parkingSegment={parkingSegment}
          onSelect={onSelectParkingSegment}
        />

        <View style={styles.ParkingMapScreenLegendGroup}>
          {LEGEND.map(item => (
            <View key={item.status} style={styles.ParkingMapScreenLegendEntry}>
              <View
                style={[
                  styles.ParkingMapScreenLegendMarker,
                  { backgroundColor: item.color },
                ]}
              />
              <Text style={styles.ParkingMapScreenLegendLabel}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.ParkingMapScreenMatrix}>
          {PARKING_SPACES.map(space => {
            const isSelectable = space.status === 'available';
            const isSelected = space.id === selectedId;
            const cellStyle = [
              styles.ParkingMapScreenSlot,
              {
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: STATUS_COLORS[space.status],
              },
              space.status === 'reserved' &&
                styles.ParkingMapScreenSlotDisabled,
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
                    style={styles.ParkingMapScreenSlotFill}
                  />
                )}
                <Text
                  style={[
                    styles.ParkingMapScreenSlotLabel,
                    space.status === 'reserved' &&
                      styles.ParkingMapScreenSlotLabelDisabled,
                    isSelected && styles.ParkingMapScreenSlotLabelSelected,
                  ]}
                >
                  {space.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedSpace && (
          <View style={styles.ParkingMapScreenDetailPanel}>
            <Text style={styles.ParkingMapScreenDetailHeading}>
              Space {selectedSpace.id}
            </Text>
            <Text style={styles.ParkingMapScreenDetailEntry}>
              {selectedSpace.zone} · {selectedSpace.distanceLabel}
            </Text>
            <Text style={styles.ParkingMapScreenDetailEntry}>
              Type: {selectedSpace.type}
            </Text>

            <TouchableOpacity
              style={styles.ParkingMapScreenConfirmActionWrap}
              onPress={confirm}
            >
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ParkingMapScreenConfirmAction}
              >
                <Text style={styles.ParkingMapScreenConfirmActionLabel}>
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
  ParkingMapScreenScrollWrap: {
    paddingBottom: 24,
  },

  ParkingMapScreenContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  ParkingMapScreenLegendGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 12,
  },

  ParkingMapScreenLegendEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ParkingMapScreenLegendMarker: {
    width: 9,
    height: 9,
    borderRadius: 3,
  },

  ParkingMapScreenLegendLabel: {
    fontSize: 10.5,
    color: Colors.textFainter,
  },
  ParkingMapScreenMatrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginBottom: 16,
  },

  ParkingMapScreenSlot: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ParkingMapScreenSlotDisabled: {
    opacity: 0.6,
  },
  ParkingMapScreenSlotFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  ParkingMapScreenSlotLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ivory,
  },

  ParkingMapScreenSlotLabelDisabled: {
    color: 'rgba(244,241,234,0.35)',
  },
  ParkingMapScreenSlotLabelSelected: {
    color: Colors.buttonText,
  },

  ParkingMapScreenDetailPanel: {
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    borderRadius: 19,
    padding: 16,
  },
  ParkingMapScreenDetailHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 16,
    color: Colors.ivory,
    marginBottom: 10,
  },

  ParkingMapScreenDetailEntry: {
    fontSize: 12.5,
    color: Colors.ivoryMuted,
    marginBottom: 6,
  },

  ParkingMapScreenConfirmActionWrap: {
    marginTop: 10,
  },

  ParkingMapScreenConfirmAction: {
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ParkingMapScreenConfirmActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
