import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker } from 'react-native-maps';

import { ScreenHeader } from '../../components/ScreenHeader';
import { Fonts } from '../../constants/theme';
import { HOLES } from '../../data/holes';

import { useAppNavigation } from '../../navigation/NavigationContext';
import { useRequestsState } from '../../navigation/RequestsContext';
import { Colors } from '../../theme/colors';

import type { HoleItem } from '../../types';

const LEGEND = [
  { label: 'Start', color: Colors.legendStart },
  { label: 'Clubhouse', color: Colors.legendClubhouse },
  { label: 'Practice area', color: Colors.legendPractice },
  { label: 'Cart station', color: Colors.legendCart },
  { label: 'Rest area', color: Colors.legendRest },
];

const CLUBHOUSE_COORDINATE = { latitude: 40.4869667, longitude: -3.7383436 };
const INITIAL_MAP_REGION = {
  latitude: 40.4870069,
  longitude: -3.7374985,
  latitudeDelta: 0.016,
  longitudeDelta: 0.021,
};

const FACILITY_MARKERS = [
  {
    label: 'Practice area',
    color: Colors.legendPractice,
    coordinate: { latitude: 40.487065, longitude: -3.738451 },
  },
  {
    label: 'Cart station',
    color: Colors.legendCart,
    coordinate: { latitude: 40.485689, longitude: -3.738436 },
  },
  {
    label: 'Rest area',
    color: Colors.legendRest,
    coordinate: { latitude: 40.485699, longitude: -3.737086 },
  },
];

export function CourseMapScreen() {
  const {
    selectedMapHole,
    selectMapHole,
    closeMapHole,
    openHoleDetail,
    openRequestCenter,
  } = useAppNavigation();
  const { submittedRequests } = useRequestsState();
  const activeRequestCount = submittedRequests.filter(
    r => r.status === 'active',
  ).length;

  return (
    <View style={styles.CourseMapScreenWrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.CourseMapScreenScrollArea}
      >
        <ScreenHeader
          title="Course Map"
          subtitle="18 holes · Par 72"
          notificationCount={activeRequestCount}
          onPressBell={openRequestCenter}
        />
        <View style={styles.CourseMapScreenContent}>
          <View style={styles.CourseMapScreenMapPanel}>
            <MapView
              style={styles.CourseMapScreenMapSurface}
              initialRegion={INITIAL_MAP_REGION}
            >
              <Marker
                coordinate={CLUBHOUSE_COORDINATE}
                title="Clubhouse"
                pinColor={Colors.legendClubhouse}
              />
              {HOLES.map(hole => (
                <Marker
                  key={hole.number}
                  coordinate={{
                    latitude: hole.latitude,
                    longitude: hole.longitude,
                  }}
                  title={`Hole ${hole.number}`}
                  description={`Par ${hole.par} · ${hole.yards} yds`}
                  pinColor={Colors.legendStart}
                  onPress={() => selectMapHole(hole)}
                />
              ))}
              {FACILITY_MARKERS.map(facility => (
                <Marker
                  key={facility.label}
                  coordinate={facility.coordinate}
                  title={facility.label}
                  pinColor={facility.color}
                />
              ))}
            </MapView>
          </View>

          <View style={styles.CourseMapScreenLegendLine}>
            {LEGEND.map(item => (
              <View key={item.label} style={styles.CourseMapScreenLegendEntry}>
                <View
                  style={[
                    styles.CourseMapScreenLegendSwatch,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={styles.CourseMapScreenLegendCaption}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {selectedMapHole && (
        <HoleSheet
          hole={selectedMapHole}
          onClose={closeMapHole}
          onViewDetails={() => {
            closeMapHole();
            openHoleDetail(selectedMapHole);
          }}
        />
      )}
    </View>
  );
}

function HoleSheet({
  hole,
  onClose,
  onViewDetails,
}: {
  hole: HoleItem;
  onClose: () => void;
  onViewDetails: () => void;
}) {
  return (
    <View style={styles.HoleSheetOverlay}>
      <View style={styles.HoleSheetPanel}>
        <View style={styles.HoleSheetHeadingLine}>
          <Text style={styles.HoleSheetHeading}>Hole {hole.number}</Text>
          <Text style={styles.HoleSheetParDistance}>
            Par {hole.par} · {hole.yards} yds
          </Text>
        </View>

        <View style={styles.HoleSheetStatsLine}>
          <View style={styles.HoleSheetStatTile}>
            <Text style={styles.HoleSheetStatCaption}>DIFFICULTY</Text>
            <Text style={styles.HoleSheetStatFigure}>{hole.difficulty}</Text>
          </View>
          <View style={styles.HoleSheetStatTile}>
            <Text style={styles.HoleSheetStatCaption}>TERRAIN</Text>
            <Text style={styles.HoleSheetStatFigure}>{hole.terrain}</Text>
          </View>
        </View>

        <Text style={styles.HoleSheetSummary}>{hole.description}</Text>

        <Text style={styles.HoleSheetEntry}>
          <Text style={styles.HoleSheetEntryLabel}>Main obstacle: </Text>
          <Text style={styles.HoleSheetEntryValue}>{hole.mainObstacle}</Text>
        </Text>
        <Text style={styles.HoleSheetEntry}>
          <Text style={styles.HoleSheetEntryLabel}>Recommended club: </Text>
          <Text style={styles.HoleSheetEntryValue}>{hole.recommendedClub}</Text>
        </Text>

        <View style={styles.HoleSheetActionGroup}>
          <TouchableOpacity
            style={styles.HoleSheetCloseAction}
            onPress={onClose}
          >
            <Text style={styles.HoleSheetCloseActionLabel}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.HoleSheetDetailsActionWrap}
            onPress={onViewDetails}
          >
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.HoleSheetDetailsAction}
            >
              <Text style={styles.HoleSheetDetailsActionLabel}>
                View Hole Details
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  CourseMapScreenWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  CourseMapScreenScrollArea: {
    paddingBottom: 24,
  },
  CourseMapScreenContent: {
    padding: 16,
  },

  CourseMapScreenMapPanel: {
    width: '100%',
    aspectRatio: 941 / 1550,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  CourseMapScreenMapSurface: {
    width: '100%',
    height: '100%',
  },
  CourseMapScreenLegendLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  CourseMapScreenLegendEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  CourseMapScreenLegendSwatch: {
    width: 9,
    height: 9,
    borderRadius: 3,
  },
  CourseMapScreenLegendCaption: {
    fontSize: 10.5,
    color: Colors.textFainter,
  },
  HoleSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },

  HoleSheetPanel: {
    backgroundColor: Colors.headerBg,
    borderTopWidth: 1,
    borderTopColor: Colors.goldSoftBorder,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  HoleSheetHeadingLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },

  HoleSheetHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 20,
    color: Colors.ivory,
  },
  HoleSheetParDistance: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  HoleSheetStatsLine: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  HoleSheetStatTile: {
    flex: 1,
    backgroundColor: '#1b1f27',
    borderRadius: 10,
    padding: 10,
  },
  HoleSheetStatCaption: {
    fontSize: 10,
    color: Colors.textFaint,
    marginBottom: 6,
  },

  HoleSheetStatFigure: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.ivory,
  },
  HoleSheetSummary: {
    fontSize: 13,
    lineHeight: 20.15,
    color: Colors.ivoryMuted,
    marginBottom: 12,
  },
  HoleSheetEntry: {
    fontSize: 12.5,
    marginBottom: 4,
  },

  HoleSheetEntryLabel: {
    color: Colors.textFainter,
  },
  HoleSheetEntryValue: {
    color: Colors.ivory,
  },
  HoleSheetActionGroup: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 20,
  },
  HoleSheetCloseAction: {
    flex: 1,
    height: 41.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  HoleSheetCloseActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  HoleSheetDetailsActionWrap: {
    flex: 1,
  },

  HoleSheetDetailsAction: {
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  HoleSheetDetailsActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
