/**
 * Campus Gallery – Mock Data
 * Structured for easy API swap-out.
 */

// ─── Cover gradients palette ─────────────────────────────────────────────────

const G = [
  'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
  'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
  'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
  'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)',
  'linear-gradient(135deg,#fccb90 0%,#d57eeb 100%)',
  'linear-gradient(135deg,#a1c4fd 0%,#c2e9fb 100%)',
  'linear-gradient(135deg,#fd7043 0%,#ff8a65 100%)',
  'linear-gradient(135deg,#26a69a 0%,#00796b 100%)',
  'linear-gradient(135deg,#ef5350 0%,#b71c1c 100%)',
  'linear-gradient(135deg,#7986cb 0%,#3949ab 100%)',
];

// ─── Overview Metrics ─────────────────────────────────────────────────────────

export const GALLERY_METRICS = [
  { key: 'albums',   label: 'Total Albums',   value: '156',    sub: '48 this year',       icon: '📁', tone: 'blue'   },
  { key: 'photos',   label: 'Total Photos',   value: '12,840', sub: '+240 this week',     icon: '📸', tone: 'violet' },
  { key: 'videos',   label: 'Total Videos',   value: '384',    sub: '28 events',          icon: '🎬', tone: 'indigo' },
  { key: 'recent',   label: 'Recent Uploads', value: '142',    sub: 'last 30 days',       icon: '⬆️', tone: 'teal'  },
  { key: 'events',   label: 'Events Covered', value: '68',     sub: '2025–26 year',       icon: '📅', tone: 'amber'  },
  { key: 'viewed',   label: 'Most Viewed',    value: '9,120',  sub: 'Farewell Montage',   icon: '👁️', tone: 'rose'  },
  { key: 'storage',  label: 'Storage Used',   value: '284 GB', sub: 'of 500 GB · 57%',   icon: '💾', tone: 'orange' },
];

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'all',         label: 'All',                  icon: '🗂️', count: 156 },
  { id: 'academic',    label: 'Academic Events',       icon: '🎓', count: 28  },
  { id: 'sports',      label: 'Sports Events',         icon: '⚽', count: 22  },
  { id: 'cultural',    label: 'Cultural Activities',   icon: '🎭', count: 19  },
  { id: 'celebration', label: 'Celebrations',          icon: '🎉', count: 15  },
  { id: 'competition', label: 'Competitions',          icon: '🏆', count: 14  },
  { id: 'campus',      label: 'Campus Infrastructure', icon: '🏫', count: 8   },
  { id: 'field',       label: 'Field Trips',           icon: '🚌', count: 12  },
  { id: 'workshop',    label: 'Workshops & Seminars',  icon: '💡', count: 11  },
  { id: 'annual',      label: 'Annual Functions',      icon: '🌟', count: 9   },
  { id: 'clubs',       label: 'Clubs & Activities',    icon: '🤝', count: 16  },
  { id: 'hostel',      label: 'Hostel Life',           icon: '🏠', count: 7   },
  { id: 'achievement', label: 'Achievements',          icon: '🥇', count: 13  },
  { id: 'classroom',   label: 'Classroom Activities',  icon: '📝', count: 18  },
  { id: 'teacher',     label: 'Teacher Activities',    icon: '👩‍🏫', count: 10 },
  { id: 'alumni',      label: 'Alumni Events',         icon: '🎓', count: 6   },
];

// ─── Albums ───────────────────────────────────────────────────────────────────

export const ALBUMS = [
  { id: 1,  title: 'Annual Day 2026',       category: 'annual',      date: '2026-02-15', photos: 320, videos: 8,  uploadedBy: 'Admin',              visibility: 'Public',      views: 4820, likes: 386, gradient: G[0],  emoji: '🌟', featured: true,  coverImg: 'https://picsum.photos/600/400?random=101', desc: 'Grand annual celebration with performances, awards and cultural programs.'       },
  { id: 2,  title: 'Sports Meet 2026',      category: 'sports',      date: '2026-01-20', photos: 280, videos: 12, uploadedBy: 'Sports Dept',        visibility: 'Public',      views: 3640, likes: 294, gradient: G[1],  emoji: '🏆', featured: true,  coverImg: 'https://picsum.photos/600/400?random=102', desc: 'Inter-house sports competition featuring 18 events across all age groups.'     },
  { id: 3,  title: 'Science Expo 2025',     category: 'academic',    date: '2025-11-08', photos: 195, videos: 6,  uploadedBy: 'Science Dept',       visibility: 'Public',      views: 2180, likes: 187, gradient: G[2],  emoji: '🔬', featured: true,  coverImg: 'https://picsum.photos/600/400?random=103', desc: 'Students showcase innovative science projects and experiments.'                 },
  { id: 4,  title: 'Farewell Ceremony',     category: 'celebration', date: '2026-03-28', photos: 240, videos: 5,  uploadedBy: 'Class Teacher',      visibility: 'School Only', views: 1920, likes: 215, gradient: G[3],  emoji: '🎓', featured: true,  coverImg: 'https://picsum.photos/600/400?random=104', desc: 'Emotional farewell to the graduating batch of 2026.'                           },
  { id: 5,  title: 'Cultural Fest – Tarang',category: 'cultural',    date: '2025-12-14', photos: 360, videos: 15, uploadedBy: 'Cultural Committee', visibility: 'Public',      views: 5280, likes: 412, gradient: G[4],  emoji: '🎭', featured: true,  coverImg: 'https://picsum.photos/600/400?random=105', desc: 'Annual cultural festival with dance, music, drama and art exhibitions.'        },
  { id: 6,  title: 'Republic Day 2026',     category: 'celebration', date: '2026-01-26', photos: 120, videos: 3,  uploadedBy: 'Admin',              visibility: 'Public',      views: 1640, likes: 138, gradient: G[5],  emoji: '🇮🇳', featured: false, coverImg: 'https://picsum.photos/600/400?random=106', desc: 'National flag hoisting ceremony and cultural presentations.'                   },
  { id: 7,  title: 'Robotics Competition',  category: 'competition', date: '2025-10-18', photos: 165, videos: 9,  uploadedBy: 'Tech Club',          visibility: 'Public',      views: 2340, likes: 204, gradient: G[6],  emoji: '🤖', featured: false, coverImg: 'https://picsum.photos/600/400?random=107', desc: 'Inter-school robotics challenge with 42 participating teams.'                  },
  { id: 8,  title: 'Field Trip – Mysore',   category: 'field',       date: '2025-09-22', photos: 218, videos: 4,  uploadedBy: 'Class Teacher',      visibility: 'School Only', views: 1480, likes: 167, gradient: G[7],  emoji: '🏰', featured: false, coverImg: 'https://picsum.photos/600/400?random=108', desc: 'Educational trip to Mysore Palace, Zoo and science museum.'                    },
  { id: 9,  title: "Teacher's Day",          category: 'teacher',     date: '2025-09-05', photos: 98,  videos: 3,  uploadedBy: 'Students Council',   visibility: 'School Only', views: 1840, likes: 243, gradient: G[8],  emoji: '👩‍🏫', featured: false, coverImg: 'https://picsum.photos/600/400?random=109', desc: 'Students celebrate and honor their beloved teachers.'                          },
  { id: 10, title: 'NSS Camp 2025',          category: 'clubs',       date: '2025-08-12', photos: 140, videos: 5,  uploadedBy: 'NSS Officer',        visibility: 'Public',      views: 920,  likes: 94,  gradient: G[9],  emoji: '🌱', featured: false, coverImg: 'https://picsum.photos/600/400?random=110', desc: 'Community service and social activities by NSS volunteers.'                    },
  { id: 11, title: 'Alumni Meet 2025',       category: 'alumni',      date: '2025-12-28', photos: 180, videos: 7,  uploadedBy: 'Alumni Cell',        visibility: 'Public',      views: 3120, likes: 287, gradient: G[10], emoji: '🤝', featured: false, coverImg: 'https://picsum.photos/600/400?random=111', desc: 'Annual reunion of alumni from graduating batches 2010–2020.'                   },
  { id: 12, title: 'Graduation Ceremony',    category: 'academic',    date: '2026-04-10', photos: 268, videos: 10, uploadedBy: 'Admin',              visibility: 'Public',      views: 4180, likes: 356, gradient: G[11], emoji: '🎓', featured: false, coverImg: 'https://picsum.photos/600/400?random=112', desc: 'Graduation ceremony for the batch of 2026.'                                    },
];

// ─── Media (per album) ────────────────────────────────────────────────────────

const EMOJIS = ['📸','🖼️','🌄','🎑','🏞️','🌅','✨','🎨','🎭','🏆'];

export const MEDIA_BY_ALBUM = {};
ALBUMS.forEach(album => {
  MEDIA_BY_ALBUM[album.id] = Array.from({ length: 16 }, (_, i) => ({
    id: `${album.id}-M${i + 1}`,
    albumId: album.id,
    type: i % 5 === 4 ? 'video' : 'photo',
    title: i % 5 === 4 ? `${album.title} – Highlights` : `${album.title} #${i + 1}`,
    emoji: EMOJIS[i % EMOJIS.length],
    gradient: G[i % G.length],
    duration: i % 5 === 4 ? `${2 + (i % 8)}:${String(12 + (i % 48)).padStart(2, '0')}` : null,
    caption: `Captured at ${album.title} on ${album.date}`,
    tags: ['students', album.category],
    likes: 10 + (i * 7) % 80,
    isFavorite: i % 7 === 0,
    uploadedBy: album.uploadedBy,
    date: album.date,
    size: `${(0.8 + i * 0.3).toFixed(1)} MB`,
    img: `https://picsum.photos/seed/album${album.id}item${i}/${i % 3 === 0 ? '450' : i % 3 === 1 ? '300' : '300'}/300`,
  }));
});

// ─── Videos ───────────────────────────────────────────────────────────────────

export const VIDEOS = [
  { id: 'V001', title: 'Annual Day 2026 – Full Highlights',  category: 'annual',      duration: '18:42', date: '2026-02-16', views: 8240, emoji: '🌟', gradient: G[0],  thumb: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=480&h=270&q=75', uploadedBy: 'Admin',              desc: 'Complete highlights of Annual Day celebrations.'                    },
  { id: 'V002', title: 'Sports Meet Opening Ceremony',        category: 'sports',      duration: '12:15', date: '2026-01-20', views: 4180, emoji: '🏟️', gradient: G[1],  thumb: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=480&h=270&q=75', uploadedBy: 'Sports Dept',        desc: 'March past and torch lighting ceremony.'                            },
  { id: 'V003', title: 'Science Expo Project Presentations',  category: 'academic',    duration: '24:08', date: '2025-11-09', views: 2640, emoji: '🔬', gradient: G[2],  thumb: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=480&h=270&q=75', uploadedBy: 'Science Dept',       desc: 'Best project presentations from Science Expo.'                      },
  { id: 'V004', title: 'Cultural Fest – Dance Finals',         category: 'cultural',    duration: '32:50', date: '2025-12-15', views: 6820, emoji: '💃', gradient: G[4],  thumb: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=480&h=270&q=75', uploadedBy: 'Cultural Committee', desc: 'Top dance performances from the Tarang cultural fest.'              },
  { id: 'V005', title: 'School Campus Walkthrough',            category: 'campus',      duration: '8:30',  date: '2026-01-05', views: 3480, emoji: '🏫', gradient: G[5],  thumb: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=480&h=270&q=75', uploadedBy: 'Admin',              desc: 'Virtual campus tour for prospective students.'                      },
  { id: 'V006', title: 'Robotics Competition Finals',          category: 'competition', duration: '15:22', date: '2025-10-19', views: 2180, emoji: '🤖', gradient: G[6],  thumb: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=480&h=270&q=75', uploadedBy: 'Tech Club',          desc: 'Final round of the inter-school robotics challenge.'                },
  { id: 'V007', title: "Principal's Message 2026",             category: 'academic',    duration: '5:44',  date: '2026-01-02', views: 5640, emoji: '🎤', gradient: G[7],  thumb: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=480&h=270&q=75', uploadedBy: 'Admin',              desc: "New year message from the principal to students and parents."       },
  { id: 'V008', title: 'Farewell – Memories Montage',          category: 'celebration', duration: '10:18', date: '2026-03-29', views: 9120, emoji: '🎓', gradient: G[3],  thumb: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=480&h=270&q=75', uploadedBy: 'Class Teacher',      desc: 'A beautiful memories video compiled for the graduating batch.'     },
];

// ─── Campus Life Showcase ─────────────────────────────────────────────────────

export const CAMPUS_LIFE = [
  { id: 'CL1', label: 'Classrooms',       emoji: '🏫', gradient: G[0],  img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&h=400&q=80', desc: 'Modern smart classrooms with interactive boards and WiFi connectivity.',         tag: 'Academic'   },
  { id: 'CL2', label: 'Laboratories',     emoji: '🔬', gradient: G[2],  img: 'https://images.unsplash.com/photo-1532094349884-543290b54710?auto=format&fit=crop&w=600&h=400&q=80', desc: 'State-of-the-art science and computer labs for hands-on learning.',              tag: 'Academic'   },
  { id: 'CL3', label: 'Library',          emoji: '📚', gradient: G[7],  img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&h=400&q=80', desc: 'A vast 50,000+ books collection with digital resources and reading zones.',       tag: 'Academic'   },
  { id: 'CL4', label: 'Sports Grounds',   emoji: '⚽', gradient: G[1],  img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&h=400&q=80', desc: 'Football, cricket, basketball courts and a full Olympic-size swimming pool.',     tag: 'Sports'     },
  { id: 'CL5', label: 'Cafeteria',        emoji: '🍽️', gradient: G[4],  img: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=600&h=400&q=80', desc: 'Hygienic and nutritious meals served in a vibrant cafeteria setting.',           tag: 'Facilities' },
  { id: 'CL6', label: 'Hostel',           emoji: '🏠', gradient: G[9],  img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&h=400&q=80', desc: 'Comfortable accommodation with 24/7 security and modern amenities.',             tag: 'Facilities' },
  { id: 'CL7', label: 'Transport',        emoji: '🚌', gradient: G[5],  img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&h=400&q=80', desc: 'GPS-enabled fleet of 48 vehicles serving all major city zones.',                 tag: 'Facilities' },
  { id: 'CL8', label: 'Smart Classrooms', emoji: '💡', gradient: G[6],  img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&h=400&q=80', desc: 'AI-assisted learning environments with 4K displays and augmented reality tools.', tag: 'Technology' },
];

// ─── Student Achievements ─────────────────────────────────────────────────────

export const ACHIEVEMENTS = [
  { id: 'A1', name: 'Arjun Sharma',   title: 'Gold Medal – Science Olympiad',  event: 'National Science Olympiad',  date: '2026-02-10', desc: 'Secured All-India Rank 1 in Physics category.',          emoji: '🥇', gradient: G[0],  img: 'https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&w=200&h=200&q=85' },
  { id: 'A2', name: 'Priya Nair',     title: 'State Chess Champion',            event: 'State Chess Championship',   date: '2026-01-28', desc: 'Won the U-17 girls state chess championship.',            emoji: '♟️', gradient: G[1],  img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=85' },
  { id: 'A3', name: 'Rohan Verma',    title: 'Coding Hackathon Winner',         event: 'TechFest 2026',              date: '2025-12-20', desc: 'Best IoT solution award at national hackathon.',          emoji: '💻', gradient: G[2],  img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=85' },
  { id: 'A4', name: 'Ananya Pillai',  title: 'Classical Dance – 1st Prize',     event: 'State Youth Festival',       date: '2025-11-15', desc: 'First prize in Bharatanatyam at state-level youth fest.', emoji: '💃', gradient: G[4],  img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=85' },
  { id: 'A5', name: 'Karthik Reddy',  title: '400m Sprint Champion',            event: 'District Athletics Meet',    date: '2025-10-08', desc: 'Set a new district record in the U-18 400m sprint.',     emoji: '🏃', gradient: G[11], img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=85' },
  { id: 'A6', name: 'Meera Krishnan', title: 'Essay Writing – 1st Prize',       event: 'National Essay Competition', date: '2026-03-05', desc: 'Won first prize in environment-themed national essay.',   emoji: '✍️', gradient: G[3],  img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=85' },
];

// ─── Faculty Events ───────────────────────────────────────────────────────────

export const FACULTY_EVENTS = [
  { id: 'FE1', title: 'Digital Pedagogy Workshop', emoji: '💻', gradient: G[2], img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=200&h=200&q=80', date: '2026-02-20', participants: 42, type: 'Workshop',    desc: 'Workshop on integrating AI tools into classroom teaching.'         },
  { id: 'FE2', title: 'Faculty Appreciation Day',  emoji: '🏅', gradient: G[0], img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=200&h=200&q=80', date: '2026-01-15', participants: 86, type: 'Celebration', desc: 'Annual recognition of outstanding faculty contributions.'          },
  { id: 'FE3', title: 'Curriculum Design Seminar', emoji: '📋', gradient: G[7], img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=200&h=200&q=80', date: '2025-11-22', participants: 38, type: 'Seminar',     desc: 'NEP 2020 curriculum implementation strategies and best practices.' },
  { id: 'FE4', title: 'Sports Coaching Training',  emoji: '🏋️', gradient: G[1], img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=200&h=200&q=80', date: '2025-10-14', participants: 18, type: 'Training',    desc: 'Physical education teachers sports coaching certification.'         },
];

// ─── Clubs ────────────────────────────────────────────────────────────────────

export const CLUBS = [
  { id: 'CLB1', name: 'Robotics Club', emoji: '🤖', gradient: G[6],  img: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=480&h=200&q=75', members: 48,  events: 6,  lastEvent: '2026-01-18', desc: 'Building and programming robots for competitions and innovation.',      tags: ['Tech', 'STEM']        },
  { id: 'CLB2', name: 'Coding Club',   emoji: '💻', gradient: G[2],  img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=480&h=200&q=75', members: 62,  events: 9,  lastEvent: '2026-02-05', desc: 'Web dev, app development, and competitive programming activities.',      tags: ['Tech', 'Programming']  },
  { id: 'CLB3', name: 'Music Club',    emoji: '🎵', gradient: G[4],  img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=480&h=200&q=75', members: 38,  events: 7,  lastEvent: '2026-01-25', desc: 'Vocal and instrumental music training and live performances.',           tags: ['Arts', 'Performance']  },
  { id: 'CLB4', name: 'Dance Club',    emoji: '💃', gradient: G[5],  img: 'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?auto=format&fit=crop&w=480&h=200&q=75', members: 44,  events: 8,  lastEvent: '2026-02-12', desc: 'Classical, folk, and contemporary dance forms and competitions.',       tags: ['Arts', 'Cultural']     },
  { id: 'CLB5', name: 'Arts Club',     emoji: '🎨', gradient: G[3],  img: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=480&h=200&q=75', members: 36,  events: 5,  lastEvent: '2025-12-20', desc: 'Fine arts, crafts, digital design, and photography workshops.',         tags: ['Arts', 'Creative']     },
  { id: 'CLB6', name: 'NSS / NCC',     emoji: '🌱', gradient: G[9],  img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=480&h=200&q=75', members: 120, events: 12, lastEvent: '2026-02-28', desc: 'Community service, social awareness, and leadership development.',      tags: ['Social', 'Leadership'] },
];

// ─── Timeline / Archive ───────────────────────────────────────────────────────

export const TIMELINE_DATA = [
  {
    year: '2025-26',
    items: [
      { label: 'Graduation Ceremony',  month: 'Apr 2026', icon: '🎓', count: 268 },
      { label: 'Farewell Ceremony',    month: 'Mar 2026', icon: '👋', count: 240 },
      { label: 'Annual Day',           month: 'Feb 2026', icon: '🌟', count: 320 },
      { label: 'Sports Meet',          month: 'Jan 2026', icon: '🏆', count: 280 },
      { label: 'Republic Day',         month: 'Jan 2026', icon: '🇮🇳', count: 120 },
      { label: 'Cultural Fest',        month: 'Dec 2025', icon: '🎭', count: 360 },
      { label: 'Alumni Meet',          month: 'Dec 2025', icon: '🤝', count: 180 },
      { label: 'Science Expo',         month: 'Nov 2025', icon: '🔬', count: 195 },
      { label: 'Robotics Competition', month: 'Oct 2025', icon: '🤖', count: 165 },
      { label: "Teacher's Day",        month: 'Sep 2025', icon: '👩‍🏫', count: 98  },
      { label: 'Field Trip – Mysore',  month: 'Sep 2025', icon: '🚌', count: 218 },
      { label: 'NSS Camp',             month: 'Aug 2025', icon: '🌱', count: 140 },
    ],
  },
  {
    year: '2024-25',
    items: [
      { label: 'Annual Day',           month: 'Feb 2025', icon: '🌟', count: 290 },
      { label: 'Sports Meet',          month: 'Jan 2025', icon: '🏆', count: 260 },
      { label: 'Cultural Fest',        month: 'Dec 2024', icon: '🎭', count: 340 },
      { label: 'Science Expo',         month: 'Nov 2024', icon: '🔬', count: 180 },
    ],
  },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

export const GALLERY_ANALYTICS = {
  totalViews:      62480,
  totalLikes:      3840,
  totalDownloads:  1240,
  storageUsedPct:  57,
  topAlbums: [
    { title: 'Cultural Fest – Tarang', views: 5280, pct: 100 },
    { title: 'Annual Day 2026',        views: 4820, pct: 91  },
    { title: 'Graduation Ceremony',    views: 4180, pct: 79  },
    { title: 'Sports Meet 2026',       views: 3640, pct: 69  },
    { title: 'Alumni Meet 2025',       views: 3120, pct: 59  },
  ],
  uploadTrend: [
    { month: 'Oct', uploads: 38  },
    { month: 'Nov', uploads: 62  },
    { month: 'Dec', uploads: 84  },
    { month: 'Jan', uploads: 56  },
    { month: 'Feb', uploads: 120 },
    { month: 'Mar', uploads: 48  },
  ],
};

// ─── Upload Logs ──────────────────────────────────────────────────────────────

export const UPLOAD_LOGS = [
  { id: 'UL1', filename: 'annual_day_batch_1.zip',     size: '84 MB',  type: 'Photos', status: 'Approved', uploadedBy: 'Admin',              date: '2026-02-15', count: 120 },
  { id: 'UL2', filename: 'sports_meet_highlights.mp4', size: '248 MB', type: 'Video',  status: 'Approved', uploadedBy: 'Sports Dept',        date: '2026-01-21', count: 1   },
  { id: 'UL3', filename: 'cultural_fest_photos.zip',   size: '156 MB', type: 'Photos', status: 'Approved', uploadedBy: 'Cultural Committee', date: '2025-12-16', count: 360 },
  { id: 'UL4', filename: 'class_activities_april.zip', size: '32 MB',  type: 'Photos', status: 'Pending',  uploadedBy: 'Class Teacher',      date: '2026-04-02', count: 48  },
  { id: 'UL5', filename: 'robotics_video.mp4',         size: '185 MB', type: 'Video',  status: 'Review',   uploadedBy: 'Tech Club',          date: '2025-10-20', count: 1   },
];
