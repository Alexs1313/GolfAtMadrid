export interface ScheduleItem {
  time: string;
  label: string;
}

export interface EventItem {
  id: string;
  image: number;
  category: string;
  title: string;
  daysFromToday: number;
  timeLabel: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  schedule: ScheduleItem[];
  included: string[];
  requirementsNote: string;
  placesLabel: string;
}

export type ServiceCategory = 'resort' | 'golfClub' | 'parking';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  icon: string;
  title: string;
  description: string;
  availabilityLabel: string;
  responseTime: string;
  conditions: string;
}

export type ParkingSpaceStatus = 'available' | 'reserved' | 'accessible' | 'evCharging';

export interface ParkingSpace {
  id: number;
  status: ParkingSpaceStatus;
  zone: string;
  distanceLabel: string;
  type: string;
}

export interface ParkingReservation {
  id: string;
  spaceId: number;
  zone: string;
  dateLabel: string;
  timeLabel: string;
  status: string;
}

export type RequestCategory = 'Events' | 'Resort Services' | 'Golf Club Services' | 'Parking';

export interface SubmittedRequest {
  id: string;
  refCode: string;
  title: string;
  category: RequestCategory;
  status: 'active' | 'completed' | 'cancelled';
  statusLabel: string;
  submittedLabel: string;
  timestamp: number;
}

export interface HoleItem {
  number: number;
  par: number;
  yards: number;
  difficulty: string;
  terrain: string;
  description: string;
  mainObstacle: string;
  recommendedClub: string;
  handicapIndex: number;
  beginnerTip: string;
  advancedTip: string;
  latitude: number;
  longitude: number;
}

export interface HoleScore {
  strokes: number;
  putts: number;
}

export interface GameParticipant {
  id: string;
  name: string;
  scoreToPar: number;
}

export interface RoundSummary {
  finalStrokes: number;
  scoreToPar: number;
  totalPutts: number;
  bestHole: number;
  toughestHole: number;
  fairwaysHitPct: number;
  greensInRegPct: number;
  durationMin: number;
}

export interface SavedGame {
  id: string;
  dateLabel: string;
  timestamp: number;
  summary: RoundSummary;
}

export type DictionaryCategory = 'Scoring' | 'Course' | 'Swing' | 'Strategy' | 'Rules';

export interface DictionaryTerm {
  id: string;
  term: string;
  category: DictionaryCategory;
  definition: string;
}

export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizQuestion {
  id: string;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];
  correctIndex: number;
}
