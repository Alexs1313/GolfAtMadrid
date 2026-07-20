import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors } from '../../theme/colors';

import type { ServiceCategory } from '../../types';

export const CATEGORIES: { key: ServiceCategory; label: string }[] = [
  { key: 'golfClub', label: 'Golf Club' },
  { key: 'parking', label: 'Parking' },
];

export function ServiceCategoryTabs({
  category,
  onSelect,
}: {
  category: ServiceCategory;
  onSelect: (category: ServiceCategory) => void;
}) {
  return (
    <View style={styles.ServiceCategoryTabsGroup}>
      {CATEGORIES.map(cat => {
        const isActive = cat.key === category;
        return (
          <TouchableOpacity
            key={cat.key}
            style={styles.ServiceCategoryTabsAction}
            onPress={() => onSelect(cat.key)}
          >
            {isActive ? (
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold]}
                style={styles.ServiceCategoryTabsBackdrop}
              >
                <Text style={styles.ServiceCategoryTabsLabelActive}>
                  {cat.label}
                </Text>
              </LinearGradient>
            ) : (
              <Text style={styles.ServiceCategoryTabsLabel}>{cat.label}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export type ParkingSegment = 'map' | 'my';

export function ParkingSubTabs({
  parkingSegment,
  onSelect,
}: {
  parkingSegment: ParkingSegment;
  onSelect: (segment: ParkingSegment) => void;
}) {
  return (
    <View style={styles.ParkingSubTabsGroup}>
      <TouchableOpacity
        style={[
          styles.ParkingSubTabsAction,
          parkingSegment === 'map' && styles.ParkingSubTabsActionActive,
        ]}
        onPress={() => onSelect('map')}
      >
        <Text
          style={[
            styles.ParkingSubTabsLabel,
            parkingSegment === 'map' && styles.ParkingSubTabsLabelActive,
          ]}
        >
          Parking Map
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.ParkingSubTabsAction,
          parkingSegment === 'my' && styles.ParkingSubTabsActionActive,
        ]}
        onPress={() => onSelect('my')}
      >
        <Text
          style={[
            styles.ParkingSubTabsLabel,
            parkingSegment === 'my' && styles.ParkingSubTabsLabelActive,
          ]}
        >
          My Parking
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ServiceCategoryTabsGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  ServiceCategoryTabsAction: {
    flex: 1,
  },
  ServiceCategoryTabsBackdrop: {
    height: 34.5,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ServiceCategoryTabsLabel: {
    height: 34.5,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ivoryMuted,
    textAlign: 'center',
    lineHeight: 34.5,
  },
  ServiceCategoryTabsLabelActive: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.buttonText,
  },

  ParkingSubTabsGroup: {
    flexDirection: 'row',
    backgroundColor: '#1b1f27',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  ParkingSubTabsAction: {
    flex: 1,
    height: 30.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ParkingSubTabsActionActive: {
    backgroundColor: Colors.surface,
  },
  ParkingSubTabsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textFaint,
  },
  ParkingSubTabsLabelActive: {
    color: Colors.goldLight,
  },
});
