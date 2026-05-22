export default {
  company: "Zenith Fitness",
  tagline: "Train Hard. Live Strong.",
  location: "Mumbai",
  phone: "+91 98765 43210",
  primaryColor: "#ff4500",
  secondaryColor: "#1a1a2e",
  accentColor: "#ffd700",
  fontHeading: "Bebas Neue",
  fontBody: "Inter",
  vibe: "bold-energetic",
  heroStyle: "split",
  about: "Zenith Fitness has been Mumbai's premier fitness destination since 2012. Founded by Olympic-level coach Arjun Mehta, we've transformed over 500 lives through science-backed training programs and a community that genuinely pushes each other forward. We don't just build bodies — we build discipline, confidence, and lasting habits.",
  services: [
    { name: "Personal Training", description: "1-on-1 sessions with certified coaches who design programs around your specific body type, goals, and fitness level. See real results in 30 days.", icon: "dumbbell" },
    { name: "HIIT Classes", description: "45-minute high-intensity group classes that burn up to 800 calories. Scientifically structured to maximize fat loss while preserving muscle.", icon: "fire" },
    { name: "Strength & Conditioning", description: "Progressive overload programs used by pro athletes. Build functional strength that carries into every part of your life.", icon: "barbell" },
    { name: "Nutrition Coaching", description: "Custom meal plans from certified nutritionists. No crash diets — sustainable eating that fuels performance and satisfaction.", icon: "apple" }
  ],
  stats: [
    { value: "500+", label: "Members Transformed" },
    { value: "12", label: "Expert Trainers" },
    { value: "98%", label: "Client Retention Rate" },
    { value: "14", label: "Years in Mumbai" }
  ],
  testimonials: [
    { name: "Rahul Mehta", text: "I lost 18 kg in 4 months with Zenith's personal training program. What makes the difference is that my coach actually listens and adjusts. Not a factory — they genuinely care.", role: "Member since 2022", rating: 5 },
    { name: "Priya Sharma", text: "The HIIT classes are brutal in the best way possible. I've tried 5 other gyms in Mumbai and none come close to the quality of programming here. Worth every rupee.", role: "Member since 2023", rating: 5 }
  ],
  ctaText: "Start Your Free Trial",
  ctaSubtext: "No commitment. First week completely free.",
  niche: "gym",
  sections: ["hero", "stats", "services", "about", "nicheSection", "testimonials", "contact"],
  extraSection: "classSchedule",
  classSchedule: [
    { day: "Monday", classes: [{ time: "6:00 AM", name: "Morning HIIT", trainer: "Arjun" }, { time: "7:00 PM", name: "Strength & Power", trainer: "Vikram" }] },
    { day: "Wednesday", classes: [{ time: "6:00 AM", name: "Cardio Blast", trainer: "Neha" }, { time: "7:00 PM", name: "Core & Mobility", trainer: "Arjun" }] },
    { day: "Friday", classes: [{ time: "6:00 AM", name: "Full Body HIIT", trainer: "Vikram" }, { time: "7:00 PM", name: "Olympic Lifting", trainer: "Arjun" }] },
    { day: "Saturday", classes: [{ time: "8:00 AM", name: "Weekend Warriors", trainer: "Neha" }, { time: "10:00 AM", name: "Yoga & Recovery", trainer: "Priya" }] }
  ]
};
