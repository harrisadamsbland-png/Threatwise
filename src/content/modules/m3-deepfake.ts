import type { TrainingModule } from '../types'

export const m3Deepfake: TrainingModule = {
  id: 'deepfakes-boss-requests',
  order: 3,
  title: 'Deepfakes and “urgent request from the boss”',
  minutes: 7,
  story: {
    headline: 'A video call where everyone except the victim was fake',
    date: 'Early 2024',
    body: [
      'A finance employee in the Hong Kong office of Arup, the British engineering firm, got an email that appeared to come from the company’s UK-based chief financial officer about a confidential transaction.',
      'The employee was then invited to a video call. The “CFO” and several “colleagues” were on it. All of them were deepfakes, built by the criminals from existing video and audio of the real people taken from online conferences and meetings.',
      'Convinced, the employee made 15 transfers totalling HK$200 million (about US$25 million) to five bank accounts. The fraud was only discovered when the employee later checked with head office. Arup said its internal systems were not compromised. This was pure deception.',
    ],
    stopMoment: 'Before sending the first transfer. A quick check through a separate channel, like calling the CFO’s known number or asking a manager in person, would have exposed it.',
    sources: [
      { title: 'CFO Dive: Scammers siphon $25M from engineering firm Arup via AI deepfake CFO', url: 'https://www.cfodive.com/news/deepfake-scam-engineering-firm-arup-25-million-fraud-hong-kong-cfo/716501/' },
      { title: 'Construction Briefing: Arup employee falls victim to US$25 million deepfake video call scam', url: 'https://www.constructionbriefing.com/news/arup-employee-falls-victim-to-us-25-million-deepfake-video-call-scam/8037338.article' },
    ],
  },
  lesson: [
    'AI can now copy someone’s face and voice from a few minutes of public video. That means “I saw them” and “I heard them” are no longer proof on their own.',
    'These scams usually share a pattern: a senior person, an urgent or confidential request, money or sensitive data, and a reason not to check (“keep this quiet”, “I’m about to board a flight”).',
    'The defence isn’t spotting glitches in a video. Fakes are getting too good for that. It’s process. Big payments and unusual requests get confirmed through a second channel you start yourself: call the person’s known number, message them on the company chat, or ask someone else who’d know.',
    'Leaders want you to check. A real CFO would far rather wait five minutes than lose $25 million.',
  ],
  financeExample: 'Crypto and finance teams get deepfake calls asking them to move treasury funds or approve a withdrawal from a “new wallet”. Transfers are fast and hard to reverse, so a two-person approval and an out-of-band check are essential.',
  practice: {
    kind: 'scenario',
    scenario: {
      id: 'sc-deepfake-cfo',
      title: 'The CFO on a video call',
      channel: 'video',
      startId: 'start',
      steps: [
        {
          id: 'start',
          text: 'You join a video call. The CFO and two directors are there. The CFO says: “We’re closing a confidential acquisition today. I need you to wire $480,000 to the account in the chat within the hour. Don’t discuss this with anyone yet, it’s market-sensitive.”',
          choices: [
            { label: 'Send it. I can see them, it’s clearly the CFO.', safe: false, feedback: 'Video and voice can be faked. Seeing someone isn’t proof any more, especially when they ask for secrecy and speed.', next: 'sent' },
            { label: '“I’ll confirm by calling you on your usual number, then process it.”', safe: true, feedback: 'Exactly right. A real CFO will understand. Verifying through a channel you start yourself defeats a deepfake.' },
            { label: 'Ask a question only the real CFO would know', safe: false, feedback: 'Better than nothing, but attackers research a lot and may dodge the question. Process beats quizzes: verify on a separate channel.', next: 'pressure' },
          ],
        },
        {
          id: 'pressure',
          text: 'The “CFO” laughs off your question and says: “We don’t have time for this. If this deal falls through, it’s on you.”',
          choices: [
            { label: 'Give in and send the money', safe: false, feedback: 'Blame and pressure are manipulation tactics. Following the payment process protects you and the company.', next: 'sent' },
            { label: 'Politely end the call and verify through the CFO’s known number and your manager', safe: true, feedback: 'Spot on. You’re never in trouble for following the verification process.' },
          ],
        },
        {
          id: 'sent',
          text: 'You sent the transfer. Later, the real CFO messages the team about something unrelated, and you realise they never mentioned an acquisition.',
          choices: [
            { label: 'Call finance/security and the bank immediately', safe: true, feedback: 'Right. Banks can sometimes freeze or recall transfers if they’re told fast. Speed matters more than anything.' },
            { label: 'Say nothing and hope it was real', safe: false, feedback: 'Silence guarantees the money is gone. Reporting fast gives the best chance of recovery, and nobody will blame you for being targeted.' },
          ],
        },
      ],
    },
  },
  quiz: [
    {
      id: 'm3-q1',
      prompt: 'You’re on a video call with someone who looks and sounds exactly like your CFO, asking for an urgent transfer. Is that enough to act?',
      options: ['Yes, video is proof', 'No. Confirm through a separate channel you start yourself.', 'Yes, if other colleagues are on the call', 'Only if the amount is small'],
      correctIndex: 1,
      explanation: 'In the Arup case, every other person on the call was fake too. Always verify big or unusual requests separately.',
    },
    {
      id: 'm3-q2',
      prompt: 'Which combination should make you most suspicious?',
      options: ['A routine request with plenty of notice', 'Seniority + urgency + secrecy + money', 'A request through the normal approval system', 'A colleague asking for a meeting'],
      correctIndex: 1,
      explanation: 'That combination is the fingerprint of impersonation fraud, with or without AI.',
    },
    {
      id: 'm3-q3',
      prompt: 'How would a real leader most likely react if you paused to verify their request?',
      options: ['They’d be angry and you’d be in trouble', 'They’d understand. Verification protects the company.', 'They’d ask someone else instead', 'It depends on their mood'],
      correctIndex: 1,
      explanation: 'Following the process is doing your job well. Companies set these rules precisely so you can push back safely.',
    },
    {
      id: "m3-q4",
      prompt: "A voice message from your manager asks you to urgently change a supplier’s bank details. It really sounds like them. What should you do?",
      options: ["Make the change, since it’s their voice", "Call your manager back on their known number, or ask in person, before changing anything", "Reply to the voice message to confirm", "Make the change and tell finance later"],
      correctIndex: 1,
      explanation: "Voices can be cloned from a short clip. Confirm through a channel you start yourself before changing any payment details.",
    },
  ],
  whatToDo: [
    'Treat “seen it / heard it” as not enough for payments or sensitive data.',
    'Verify big or unusual requests through a channel you start yourself.',
    'Follow the payment approval process every time, even for very senior people.',
    'Secrecy plus urgency is a reason to slow down.',
    'Sent something you shouldn’t have? Call finance, security and the bank straight away.',
  ],
}
