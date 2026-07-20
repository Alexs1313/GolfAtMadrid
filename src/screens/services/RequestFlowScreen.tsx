import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { BackHeader } from '../../components/BackHeader';
import { Fonts } from '../../constants/theme';

import { useOverlayAnimation } from '../../hooks/useOverlayAnimation';
import { useAppNavigation } from '../../navigation/NavigationContext';
import { useRequestsState } from '../../navigation/RequestsContext';

import { Colors } from '../../theme/colors';
import type { RequestCategory, ServiceCategory } from '../../types';
import { getEventDayLabel } from '../../utils/date';

const STEPS = ['Details', 'Preferences', 'Review'];
const DATE_OPTIONS = [0, 1, 2, 3, 4, 5].map(getEventDayLabel);
const ARRIVAL_OPTIONS = [
  'Morning',
  'Midday',
  'Afternoon',
  'Early evening',
  'Evening',
  'Flexible',
];

const CATEGORY_LABELS: Record<ServiceCategory, RequestCategory> = {
  resort: 'Resort Services',
  golfClub: 'Golf Club Services',
  parking: 'Parking',
};

export function RequestFlowScreen() {
  const { activeFlow, closeFlow, showRequestSent } = useAppNavigation();
  const { submitRequest } = useRequestsState();
  const { renderedValue, animatedStyle } = useOverlayAnimation(activeFlow);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState(DATE_OPTIONS[0]);
  const [arrivalTime, setArrivalTime] = useState('Midday');
  const [notes, setNotes] = useState('');

  const stepAnim = useRef(new Animated.Value(0)).current;
  const barAnims = useRef(
    STEPS.map((_, i) => new Animated.Value(i === 0 ? 1 : 0)),
  ).current;
  const direction = useRef(1);
  const prevStep = useRef(0);

  useEffect(() => {
    if (activeFlow) {
      setStep(0);
      setName('');
      setGuests(1);
      setDate(DATE_OPTIONS[0]);
      setArrivalTime('Midday');
      setNotes('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFlow]);

  useEffect(() => {
    direction.current = step >= prevStep.current ? 1 : -1;
    prevStep.current = step;

    stepAnim.setValue(0);
    Animated.timing(stepAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();

    barAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i <= step ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  }, [step, stepAnim, barAnims]);

  if (!renderedValue) {
    return null;
  }

  const title = renderedValue.item.title;
  const isLastStep = step === STEPS.length - 1;

  const back = () => {
    if (step === 0) {
      closeFlow();
    } else {
      setStep(step - 1);
    }
  };

  const next = () => {
    if (isLastStep) {
      submitRequest(CATEGORY_LABELS[renderedValue.item.category], title);
      closeFlow();
      showRequestSent(title);
    } else {
      setStep(step + 1);
    }
  };

  const stepAnimatedStyle = {
    opacity: stepAnim,
    transform: [
      {
        translateX: stepAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [16 * direction.current, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.RequestFlowScreenWrapper, animatedStyle]}>
      <BackHeader title={title} eyebrow="Resort Services" onBack={back} />

      <View style={styles.RequestFlowScreenProgressGroup}>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.RequestFlowScreenProgressEntry}>
            <View style={styles.RequestFlowScreenProgressTrack}>
              <Animated.View
                style={[
                  styles.RequestFlowScreenProgressTrackFill,
                  {
                    backgroundColor: barAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#252a34', Colors.goldLight],
                    }),
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.RequestFlowScreenProgressCaption,
                i === step && styles.RequestFlowScreenProgressCaptionActive,
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.RequestFlowScreenContent}
      >
        <Animated.View style={stepAnimatedStyle}>
          {step === 0 && (
            <>
              <Text style={styles.RequestFlowScreenHeading}>Your details</Text>
              <Text style={styles.RequestFlowScreenSubhead}>
                Tell us who this request is for.
              </Text>

              <Text style={styles.RequestFlowScreenFieldCaption}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Isabella Moreno"
                placeholderTextColor="#757575"
                style={styles.RequestFlowScreenEntry}
              />

              <Text style={styles.RequestFlowScreenFieldCaption}>
                Number of guests
              </Text>
              <View style={styles.RequestFlowScreenCounter}>
                <TouchableOpacity
                  style={styles.RequestFlowScreenCounterAction}
                  onPress={() => setGuests(Math.max(1, guests - 1))}
                >
                  <Text style={styles.RequestFlowScreenCounterActionLabel}>
                    –
                  </Text>
                </TouchableOpacity>
                <Text style={styles.RequestFlowScreenCounterFigure}>
                  {guests}
                </Text>
                <TouchableOpacity
                  style={styles.RequestFlowScreenCounterAction}
                  onPress={() => setGuests(guests + 1)}
                >
                  <Text style={styles.RequestFlowScreenCounterActionLabel}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.RequestFlowScreenFieldCaption}>
                Preferred date
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.RequestFlowScreenChipsGroup}
              >
                {DATE_OPTIONS.map(option => {
                  const [weekday, number] = option.split(' ');
                  const isActive = option === date;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setDate(option)}
                    >
                      {isActive ? (
                        <LinearGradient
                          colors={[Colors.goldLight, Colors.gold]}
                          style={styles.RequestFlowScreenDateTag}
                        >
                          <Text style={styles.RequestFlowScreenDateDayActive}>
                            {weekday}
                          </Text>
                          <Text style={styles.RequestFlowScreenDateDigitActive}>
                            {number}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.RequestFlowScreenDateTagInactive}>
                          <Text style={styles.RequestFlowScreenDateDay}>
                            {weekday}
                          </Text>
                          <Text style={styles.RequestFlowScreenDateDigit}>
                            {number}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          )}

          {step === 1 && (
            <>
              <Text style={styles.RequestFlowScreenHeading}>Preferences</Text>
              <Text style={styles.RequestFlowScreenSubhead}>
                Choose an arrival time and how we should reach you.
              </Text>

              <Text style={styles.RequestFlowScreenFieldCaption}>
                Preferred arrival time
              </Text>
              <View style={styles.RequestFlowScreenArrivalGroup}>
                {ARRIVAL_OPTIONS.map(option => {
                  const isActive = option === arrivalTime;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setArrivalTime(option)}
                    >
                      {isActive ? (
                        <View style={styles.RequestFlowScreenArrivalTag}>
                          <LinearGradient
                            colors={[Colors.goldLight, Colors.gold]}
                            style={styles.RequestFlowScreenArrivalTagFill}
                          />
                          <Text
                            style={styles.RequestFlowScreenArrivalLabelActive}
                          >
                            {option}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={styles.RequestFlowScreenArrivalTagInactive}
                        >
                          <Text style={styles.RequestFlowScreenArrivalLabel}>
                            {option}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.RequestFlowScreenFieldCaption}>
                Optional notes
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Anything the venue team should know…"
                placeholderTextColor="#757575"
                multiline
                style={styles.RequestFlowScreenMultilineField}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.RequestFlowScreenHeading}>
                Review & confirm
              </Text>
              <Text style={styles.RequestFlowScreenSubhead}>
                Please confirm the details before submitting.
              </Text>

              <View style={styles.RequestFlowScreenSummaryPanel}>
                <Text style={styles.RequestFlowScreenSummaryKicker}>
                  Resort Services
                </Text>
                <Text style={styles.RequestFlowScreenSummaryHeading}>
                  {title}
                </Text>

                <SummaryRow label="Full name" value={name || '—'} />
                <SummaryRow label="Guests" value={String(guests)} />
                <SummaryRow label="Preferred date" value={date} />
                <SummaryRow label="Arrival time" value={arrivalTime} />
                {notes.length > 0 && (
                  <SummaryRow label="Notes" value={notes} last />
                )}
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.RequestFlowScreenBottomBar}>
        <TouchableOpacity onPress={next}>
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.RequestFlowScreenAction}
          >
            <Text style={styles.RequestFlowScreenActionLabel}>
              {isLastStep ? 'Submit Request' : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function SummaryRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.RequestFlowScreenSummaryLine,
        last && styles.RequestFlowScreenSummaryLineLast,
      ]}
    >
      <Text style={styles.RequestFlowScreenSummaryCaption}>{label}</Text>
      <Text style={styles.RequestFlowScreenSummaryFigure}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  RequestFlowScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
  },

  RequestFlowScreenProgressGroup: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  RequestFlowScreenProgressEntry: {
    flex: 1,
  },
  RequestFlowScreenProgressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },

  RequestFlowScreenProgressTrackFill: {
    width: '100%',
    height: '100%',
  },

  RequestFlowScreenProgressCaption: {
    fontSize: 10,
    color: Colors.textFainter,
    letterSpacing: 0.3,
  },
  RequestFlowScreenProgressCaptionActive: {
    color: Colors.goldLight,
  },
  RequestFlowScreenContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  RequestFlowScreenHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 21,
    color: Colors.ivory,
    marginBottom: 6,
  },
  RequestFlowScreenSubhead: {
    fontSize: 12.5,
    color: Colors.textFainter,
    marginBottom: 24,
  },
  RequestFlowScreenFieldCaption: {
    fontSize: 11,
    color: Colors.textFaint,
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  RequestFlowScreenEntry: {
    height: 47.5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(233,205,110,0.26)',
    paddingHorizontal: 15,
    color: Colors.ivory,
    fontSize: 14.5,
    marginBottom: 20,
  },

  RequestFlowScreenCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(233,205,110,0.26)',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  RequestFlowScreenCounterAction: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#252a34',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  RequestFlowScreenCounterActionLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.goldLight,
  },
  RequestFlowScreenCounterFigure: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 24,
    color: Colors.ivory,
  },
  RequestFlowScreenChipsGroup: {
    marginBottom: 8,
  },
  RequestFlowScreenDateTag: {
    width: 52,
    height: 58,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginRight: 8,
  },

  RequestFlowScreenDateTagInactive: {
    width: 52,
    height: 58,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginRight: 8,
  },
  RequestFlowScreenDateDay: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.ivory,
  },
  RequestFlowScreenDateDigit: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 18,
    color: Colors.ivory,
  },

  RequestFlowScreenDateDayActive: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  RequestFlowScreenDateDigitActive: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 18,
    color: Colors.buttonText,
  },
  RequestFlowScreenArrivalGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },

  RequestFlowScreenArrivalTag: {
    height: 37.5,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  RequestFlowScreenArrivalTagFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  RequestFlowScreenArrivalTagInactive: {
    height: 37.5,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(233,205,110,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RequestFlowScreenArrivalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.ivoryMuted,
  },
  RequestFlowScreenArrivalLabelActive: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.buttonText,
  },

  RequestFlowScreenMultilineField: {
    height: 90,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(233,205,110,0.26)',
    padding: 15,
    color: Colors.ivory,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  RequestFlowScreenSummaryPanel: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.22)',
    backgroundColor: Colors.surface,
    padding: 18,
  },
  RequestFlowScreenSummaryKicker: {
    fontSize: 10.5,
    color: Colors.goldLight,
    letterSpacing: 1,
    marginBottom: 6,
  },
  RequestFlowScreenSummaryHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 17,
    color: Colors.ivory,
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.headerBorder,
  },

  RequestFlowScreenSummaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.06)',
  },
  RequestFlowScreenSummaryLineLast: {
    borderBottomWidth: 0,
  },
  RequestFlowScreenSummaryCaption: {
    fontSize: 12.5,
    color: Colors.textFaint,
  },
  RequestFlowScreenSummaryFigure: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.ivory,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },

  RequestFlowScreenBottomBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.headerBorder,
    padding: 18,
    marginBottom: 25,
  },
  RequestFlowScreenAction: {
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  RequestFlowScreenActionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
