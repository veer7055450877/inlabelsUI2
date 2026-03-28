// ─── Feedback reasons per variant ─────────────────────────────────────────
export const REASONS = {
  emotional: [
    { value: 'not_useful',   label: "😞 It wasn't useful for me" },
    { value: 'too_complex',  label: '😵 Too complicated to use' },
    { value: 'bugs',         label: '🐛 It had too many bugs' },
    { value: 'privacy',      label: '🔒 Privacy concerns' },
    { value: 'better_alt',   label: '💔 Found a better alternative' },
    { value: 'other',        label: '🥺 Something else...' },
  ],
  funny: [
    { value: 'spam',         label: '📩 Too many messages (like an ex)' },
    { value: 'broken',       label: "💔 Didn't work at all 😐" },
    { value: 'confusing',    label: '😵‍💫 Way too confusing bro' },
    { value: 'testing',      label: '😎 Just testing, chill' },
    { value: 'boring',       label: '🥱 Honestly just boring' },
    { value: 'other',        label: "👀 It's complicated..." },
  ],
  professional: [
    { value: 'not_useful',   label: 'Not relevant to my workflow' },
    { value: 'performance',  label: 'Performance or stability issues' },
    { value: 'missing_feat', label: 'Missing features I need' },
    { value: 'cost',         label: 'Pricing concerns' },
    { value: 'switching',    label: 'Switching to another solution' },
    { value: 'other',        label: 'Other reason' },
  ],
  retention: [
    { value: 'not_useful',   label: '🤔 Not what I expected' },
    { value: 'performance',  label: '🐌 Slow or buggy experience' },
    { value: 'missing_feat', label: '🔧 Missing key features' },
    { value: 'cost',         label: '💸 Pricing' },
    { value: 'better_alt',   label: '🔄 Found another tool' },
    { value: 'other',        label: '✏️ Other' },
  ],
  minimal: [
    { value: 'not_useful',   label: 'Not useful' },
    { value: 'bugs',         label: 'Too many bugs' },
    { value: 'confusing',    label: 'Hard to understand' },
    { value: 'performance',  label: 'Too slow' },
    { value: 'better_alt',   label: 'Using something else now' },
    { value: 'other',        label: 'Other' },
  ],
  meme: [
    { value: 'not_useful',   label: '💀 Absolutely not useful' },
    { value: 'bugs',         label: '🪲 More bugs than features' },
    { value: 'confusing',    label: '🤯 Zero idea what this does' },
    { value: 'spam',         label: "📢 Won't stop bothering me" },
    { value: 'vibes',        label: '✨ Bad vibes only' },
    { value: 'other',        label: '🫠 Skill issue (mine)' },
  ],
};

// ─── Funny reactions (variant 2) ──────────────────────────────────────────
export const FUNNY_REACTIONS = {
  spam:        "🫡 Okay okay, we'll chill. Message received (ironically).",
  broken:      '😔 Oof. We cried a little. We\'ll fix it, promise.',
  confusing:   '🧠 Our UI designer just resigned in shame.',
  testing:     "😂 Ah yes, the classic 'just testing' smokescreen.",
  boring:      "😐 We'll hire a comedian. Or something.",
  not_useful:  '💀 We felt that in our soul.',
  performance: '🐌 Our servers heard you and got personally offended.',
  missing_feat:"🔧 Adding it to the roadmap... right now... totally.",
  cost:        "💸 Fair. Our CEO also thinks it's pricey.",
  better_alt:  '😤 Who is she. We need to know.',
  vibes:       '🕯️ Conducting a vibes audit immediately.',
  bugs:        "🪲 The bugs have a union now. Negotiations are ongoing.",
  other:       '🫠 The mystery option. We respect it.',
  switching:   "🏃 Running after you won't fix anything, will it.",
};

// ─── Meme dynamic text (variant 6) ────────────────────────────────────────
export const MEME_TEXTS = {
  not_useful:  { top: 'Pain level: ∞',          bottom: 'We are not okay 😭' },
  bugs:        { top: 'It do be like that',      bottom: 'Filed reports. To the bin. 🗑️' },
  confusing:   { top: 'Instructions unclear',    bottom: 'Got my head stuck in the UI 😵‍💫' },
  spam:        { top: 'Sir this is a browser ext',bottom: 'Manifesting better UX 🕯️' },
  vibes:       { top: 'Vibe check: FAILED',      bottom: 'Back to the drawing board 📝' },
  other:       { top: 'Okay but actually though',bottom: 'We respect the mystery 🎭' },
  '':          { top: 'You uninstalling us?',    bottom: 'Pain level: 📈📈📈' },
};

// ─── Retention feature bullets ─────────────────────────────────────────────
export const RETENTION_FEATURES = [
  { icon: '🤖', text: 'AI-powered automation engine — shipped next month' },
  { icon: '⚡', text: '3× faster performance, no compromises' },
  { icon: '🎯', text: 'Smarter targeting & deep personalization' },
  { icon: '🔗', text: 'Native integrations: Slack, Notion, HubSpot' },
];
