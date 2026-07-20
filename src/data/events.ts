import { EventItem } from '../types';

export const EVENTS: EventItem[] = [
  {
    id: 'clubhouse-dinner-evening',
    image: require('../assets/guide-at-mdrd-event-clubhouse-dinner-evening.png'),
    category: 'Dining',
    title: 'Clubhouse Dinner Evening',
    daysFromToday: 0,
    timeLabel: '7:30 – 10:00 PM',
    location: 'Grand Clubhouse',
    shortDescription:
      "An elegant seated dinner celebrating the club's culinary traditions.",
    fullDescription:
      "An elegant seated dinner celebrating the club's culinary traditions. Hosted in the Grand Clubhouse, the evening combines a seasonal menu, refined service, and a relaxed social atmosphere for members and registered guests.",
    schedule: [
      { time: '7:30 PM', label: 'Arrival and welcome drink' },
      { time: '8:00 PM', label: 'Three-course dinner' },
      { time: '9:30 PM', label: 'Closing remarks and coffee' },
    ],
    included: ['Welcome drink', 'Dinner menu', 'Table service'],
    requirementsNote:
      'Smart resort attire requested; guests should arrive 15 minutes before the starting time.',
    placesLabel: '40 places remaining',
  },
  {
    id: 'sunrise-golf-practice',
    image: require('../assets/guide-at-mdrd-event-sunrise-golf-practice.png'),
    category: 'Golf Training',
    title: 'Sunrise Golf Practice',
    daysFromToday: 1,
    timeLabel: '7:00 – 8:30 AM',
    location: 'Practice Area',
    shortDescription:
      'Begin the day with a guided practice session while the course is quiet.',
    fullDescription:
      'Begin the day with a guided practice session while the course is quiet and the morning conditions are at their best. A golf instructor will lead warm-up exercises, swing drills, and short-game practice.',
    schedule: [
      { time: '7:00 AM', label: 'Registration and warm-up' },
      { time: '7:20 AM', label: 'Swing practice' },
      { time: '8:00 AM', label: 'Putting and short-game drills' },
    ],
    included: [
      'Practice balls',
      'Instructor guidance',
      'Access to the training area',
    ],
    requirementsNote:
      'Comfortable golf clothing and suitable footwear are required.',
    placesLabel: '18 places remaining',
  },
  {
    id: 'nine-hole-social-match',
    image: require('../assets/guide-at-mdrd-event-nine-hole-social-match.png'),
    category: 'Golf Event',
    title: 'Nine-Hole Social Match',
    daysFromToday: 1,
    timeLabel: '4:00 – 7:00 PM',
    location: 'First Tee and Front Nine',
    shortDescription:
      'A friendly nine-hole round designed for players who enjoy light competition.',
    fullDescription:
      'A friendly nine-hole round designed for players who enjoy light competition and meeting other club guests. Participants will be placed into balanced groups based on their indicated experience level.',
    schedule: [
      { time: '4:00 PM', label: 'Player check-in' },
      { time: '4:20 PM', label: 'Group assignments' },
      { time: '4:30 PM', label: 'First tee time' },
      { time: '6:45 PM', label: 'Results gathering' },
    ],
    included: ['Digital scorecard', 'Course access', 'Bottled water'],
    requirementsNote:
      'Players must bring their own equipment or request a rental set in advance.',
    placesLabel: '24 places remaining',
  },
  {
    id: 'sunset-putting-challenge',
    image: require('../assets/guide-at-mdrd-event-sunset-putting-challenge.png'),
    category: 'Golf Competition',
    title: 'Sunset Putting Challenge',
    daysFromToday: 6,
    timeLabel: '7:00 – 8:45 PM',
    location: 'Putting Green',
    shortDescription:
      'Test your accuracy in a relaxed putting competition held during sunset.',
    fullDescription:
      'Test your accuracy in a relaxed putting competition held during sunset. Each participant completes a specially prepared course with several distances, slopes, and precision challenges.',
    schedule: [
      { time: '7:00 PM', label: 'Welcome and rules' },
      { time: '7:15 PM', label: 'Practice round' },
      { time: '7:30 PM', label: 'Main challenge' },
      { time: '8:30 PM', label: 'Results and recognition' },
    ],
    included: ['Putter access', 'Score tracking', 'Refreshments'],
    requirementsNote: 'Open to beginners and experienced golfers.',
    placesLabel: '30 places remaining',
  },
  {
    id: 'golf-rules-workshop',
    image: require('../assets/guide-at-mdrd-event-golf-rules-workshop.png'),
    category: 'Learning',
    title: 'Golf Rules Workshop',
    daysFromToday: 7,
    timeLabel: '11:00 AM – 12:30 PM',
    location: 'Golf Academy Room',
    shortDescription:
      'A practical introduction to essential golf rules and scoring principles.',
    fullDescription:
      'A practical introduction to essential golf rules, scoring principles, course etiquette, and common situations that can occur during a round. Real examples will be demonstrated near the practice green.',
    schedule: [
      { time: '11:00 AM', label: 'Core rules overview' },
      { time: '11:30 AM', label: 'Scoring and penalties' },
      { time: '12:00 PM', label: 'Practical scenarios' },
      { time: '12:20 PM', label: 'Questions and answers' },
    ],
    included: ['Learning materials', 'Rule examples', 'Instructor guidance'],
    requirementsNote: 'No previous golf experience is required.',
    placesLabel: '32 places remaining',
  },
  {
    id: 'equipment-discovery-session',
    image: require('../assets/guide-at-mdrd-event-equipment-discovery-session.png'),
    category: 'Golf Services',
    title: 'Equipment Discovery Session',
    daysFromToday: 7,
    timeLabel: '3:00 – 4:30 PM',
    location: 'Golf Club Service Area',
    shortDescription:
      'Explore different golf club types, ball constructions, grips and bags.',
    fullDescription:
      'Explore different golf club types, ball constructions, grips, bags, and modern training accessories. Club specialists will explain how equipment selection can affect control, distance, and comfort.',
    schedule: [
      { time: '3:00 PM', label: 'Equipment introduction' },
      { time: '3:25 PM', label: 'Club comparison' },
      { time: '3:50 PM', label: 'Test session' },
      { time: '4:20 PM', label: 'Personal recommendations' },
    ],
    included: [
      'Equipment testing',
      'Specialist consultation',
      'Practice balls',
    ],
    requirementsNote:
      'Participants should provide their dominant hand and experience level when submitting a request.',
    placesLabel: '20 places remaining',
  },
  {
    id: 'garden-reception-live-music',
    image: require('../assets/guide-at-mdrd-event-garden-reception-live-music.png'),
    category: 'Social',
    title: 'Garden Reception & Live Music',
    daysFromToday: 13,
    timeLabel: '7:30 – 10:00 PM',
    location: 'Resort Garden Terrace',
    shortDescription:
      'An outdoor evening reception featuring live acoustic music and light refreshments.',
    fullDescription:
      'An outdoor evening reception featuring live acoustic music, light refreshments, and views across the landscaped grounds. The event offers a comfortable setting for conversation after a day at the club.',
    schedule: [
      { time: '7:30 PM', label: 'Garden reception opens' },
      { time: '8:00 PM', label: 'Live music performance' },
      { time: '9:00 PM', label: 'Refreshment service' },
      { time: '9:45 PM', label: 'Final performance' },
    ],
    included: ['Welcome refreshment', 'Light bites', 'Seating access'],
    requirementsNote:
      'Smart casual attire is recommended; the event may move indoors in unsuitable weather.',
    placesLabel: '54 places remaining',
  },
  {
    id: 'chefs-seasonal-tasting',
    image: require('../assets/guide-at-mdrd-event-chefs-seasonal-tasting.png'),
    category: 'Dining',
    title: "Chef's Seasonal Tasting",
    daysFromToday: 14,
    timeLabel: '8:00 – 10:30 PM',
    location: 'Signature Dining Room',
    shortDescription:
      'A guided tasting menu inspired by seasonal Spanish ingredients.',
    fullDescription:
      'A guided tasting menu inspired by seasonal Spanish ingredients. Each course is introduced by the culinary team and paired with a carefully selected non-alcoholic or traditional beverage option.',
    schedule: [
      { time: '8:00 PM', label: 'Guest seating' },
      { time: '8:15 PM', label: 'First course' },
      { time: '9:00 PM', label: 'Main tasting sequence' },
      { time: '10:10 PM', label: 'Dessert and closing' },
    ],
    included: ['Multi-course tasting menu', 'Beverage pairing'],
    requirementsNote:
      'Dietary requirements must be submitted with the attendance request.',
    placesLabel: '26 places remaining',
  },
  {
    id: 'family-golf-introduction',
    image: require('../assets/guide-at-mdrd-event-family-golf-introduction.png'),
    category: 'Family Activity',
    title: 'Family Golf Introduction',
    daysFromToday: 15,
    timeLabel: '10:00 AM – 12:00 PM',
    location: 'Family Practice Lawn',
    shortDescription:
      'A welcoming outdoor session introducing families to the basics of golf.',
    fullDescription:
      'A welcoming outdoor session introducing families to the basics of golf through simple exercises, team activities, and short putting games. The format is suitable for adults and younger beginners.',
    schedule: [
      { time: '10:00 AM', label: 'Group welcome' },
      { time: '10:20 AM', label: 'Golf basics' },
      { time: '10:50 AM', label: 'Family practice activities' },
      { time: '11:30 AM', label: 'Putting team challenge' },
    ],
    included: [
      'Junior and adult equipment',
      'Instructor support',
      'Refreshments',
    ],
    requirementsNote: 'Children must remain accompanied by an adult.',
    placesLabel: '16 family places remaining',
  },
  {
    id: 'course-strategy-walk',
    image: require('../assets/guide-at-mdrd-event-course-strategy-walk.png'),
    category: 'Golf Learning',
    title: 'Course Strategy Walk',
    daysFromToday: 21,
    timeLabel: '9:00 – 11:00 AM',
    location: 'Course Meeting Point',
    shortDescription:
      'Walk selected parts of the course with a golf professional.',
    fullDescription:
      'Walk selected parts of the course with a golf professional and learn how to evaluate fairway position, hazards, wind direction, landing areas, and approach options before taking a shot.',
    schedule: [
      { time: '9:00 AM', label: 'Welcome briefing' },
      { time: '9:15 AM', label: 'Fairway positioning' },
      { time: '9:45 AM', label: 'Hazard management' },
      { time: '10:20 AM', label: 'Green approach strategy' },
      { time: '10:50 AM', label: 'Final questions' },
    ],
    included: ['Professional guidance', 'Course map', 'Bottled water'],
    requirementsNote:
      'Comfortable walking shoes are required; golf equipment is not needed.',
    placesLabel: '22 places remaining',
  },
  {
    id: 'terrace-jazz-evening',
    image: require('../assets/guide-at-mdrd-event-terrace-jazz-evening.png'),
    category: 'Entertainment',
    title: 'Terrace Jazz Evening',
    daysFromToday: 27,
    timeLabel: '8:00 – 10:30 PM',
    location: 'Clubhouse Terrace',
    shortDescription:
      'A relaxed evening of live jazz overlooking the golf grounds.',
    fullDescription:
      'A relaxed evening of live jazz overlooking the golf grounds. Guests can enjoy reserved terrace seating, a refined lounge menu, and a calm atmosphere as the course transitions into evening.',
    schedule: [
      { time: '8:00 PM', label: 'Terrace opens' },
      { time: '8:30 PM', label: 'First jazz set' },
      { time: '9:15 PM', label: 'Intermission' },
      { time: '9:35 PM', label: 'Final jazz set' },
    ],
    included: ['Reserved seating', 'Table service'],
    requirementsNote:
      'Food and beverages may be ordered separately during the event.',
    placesLabel: '46 places remaining',
  },
  {
    id: 'wellness-on-the-green',
    image: require('../assets/guide-at-mdrd-event-wellness-on-the-green.png'),
    category: 'Wellness',
    title: 'Wellness on the Green',
    daysFromToday: 29,
    timeLabel: '8:00 – 9:15 AM',
    location: 'Lakeside Practice Lawn',
    shortDescription:
      'A gentle outdoor wellness session combining mobility exercises and controlled breathing.',
    fullDescription:
      'A gentle outdoor wellness session combining mobility exercises, controlled breathing, and light stretching beside the course. The activity is designed to support balance and movement before a round of golf.',
    schedule: [
      { time: '8:00 AM', label: 'Arrival and preparation' },
      { time: '8:10 AM', label: 'Mobility exercises' },
      { time: '8:35 AM', label: 'Balance and posture' },
      { time: '9:00 AM', label: 'Breathing and relaxation' },
    ],
    included: ['Instructor guidance', 'Exercise mat', 'Water station'],
    requirementsNote: 'Comfortable sportswear is recommended.',
    placesLabel: '28 places remaining',
  },
];
