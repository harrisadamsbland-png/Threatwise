import type { TrainingModule } from '../types'

export const m7Reporting: TrainingModule = {
  id: 'data-and-reporting',
  order: 7,
  title: 'Handling data and reporting fast',
  minutes: 6,
  story: {
    headline: 'The employee who got phished, and helped stop it',
    date: 'February 2023',
    body: [
      'In February 2023, Reddit was targeted by a sophisticated phishing campaign. A convincing fake version of its internal login page tricked one employee into entering their credentials and a two-factor code.',
      'The attackers got access to some internal documents, code and business systems. But the employee realised what had happened and reported it to Reddit’s security team themselves.',
      'That fast report let the security team respond quickly and cut off the attacker’s access. Reddit said its primary production systems were not compromised. The exposed data was limited to some contact information for employees and business contacts, and some advertiser information.',
    ],
    stopMoment: 'The damage was limited because someone reported their own mistake quickly. That is the whole point of this module.',
    sources: [
      { title: 'Malwarebytes: Reddit breached, here’s what you need to know', url: 'https://www.malwarebytes.com/blog/news/2023/02/reddit-systems-compromised-by-phish-attack-heres-what-you-need-to-do-next' },
      { title: 'Security Affairs: Reddit discloses security breach', url: 'https://securityaffairs.com/posts/reddit-security-breach' },
    ],
  },
  lesson: [
    'Anyone can be fooled. Good attacks are designed by professionals to fool smart, careful people. What separates a small incident from a disaster is usually how fast someone speaks up.',
    'Report when you clicked a link or opened a file you’re unsure about, typed a password or code somewhere suspicious, got a strange call or message, lost a device, or sent data to the wrong person. Report suspected, not just confirmed, problems.',
    'Handle data carefully day to day: share only what someone needs, use approved tools (not personal email or USB sticks), lock your screen, and double-check recipients before sending anything sensitive.',
    'Report fast, no blame. Your security team would much rather get ten false alarms than miss one real attack.',
  ],
  financeExample: 'In finance and crypto, the window to freeze a transfer or block a stolen account can be minutes. A quick “I think I just made a mistake” to security or the bank can be the difference between recovering funds and losing them for good.',
  practice: {
    kind: 'scenario',
    scenario: {
      id: 'sc-report',
      title: 'Uh-oh moment',
      channel: 'chat',
      startId: 'start',
      steps: [
        {
          id: 'start',
          text: 'You just emailed a spreadsheet of 2,000 customer names and phone numbers to “alex@partner-co.example”, but you meant to send it to Alex in your own team.',
          choices: [
            { label: 'Report it to security/your data protection contact right away', safe: true, feedback: 'Exactly. They may be able to recall it, contact the recipient, and meet legal reporting deadlines.' },
            { label: 'Email the wrong Alex asking them to delete it, and leave it there', safe: false, feedback: 'Asking for deletion is fine, but on its own it isn’t enough. The company may have legal duties to report, so security needs to know.', next: 'later' },
            { label: 'Say nothing. It’s probably fine.', safe: false, feedback: 'Data mistakes can have legal deadlines. Silence turns a fixable mistake into a much bigger problem.', next: 'later' },
          ],
        },
        {
          id: 'later',
          text: 'A day later, you’re still worried about it. Your manager asks how your week is going.',
          choices: [
            { label: 'Tell your manager and security what happened', safe: true, feedback: 'It’s never too late. Reporting now is far better than never. Well done for speaking up.' },
            { label: 'Keep it to yourself', safe: false, feedback: 'The worry won’t go away and the risk grows. Reporting is always the right call. Nobody expects perfection.' },
          ],
        },
      ],
    },
  },
  quiz: [
    {
      id: 'm7-q1',
      prompt: 'When should you report a possible security problem?',
      options: ['Only when you’re sure it’s real', 'As soon as you suspect something, even if you’re unsure', 'At the end of the week', 'Only if your manager agrees'],
      correctIndex: 1,
      explanation: 'Suspected is enough. False alarms are cheap; delays are expensive.',
    },
    {
      id: 'm7-q2',
      prompt: 'In the Reddit case, what limited the damage?',
      options: ['Luck', 'The phished employee reported it to security quickly', 'The attackers gave up', 'A firewall blocked everything'],
      correctIndex: 1,
      explanation: 'Self-reporting let the security team respond fast and cut off access.',
    },
    {
      id: 'm7-q3',
      prompt: 'Which is the safest way to share a sensitive file with a colleague?',
      options: ['Personal email', 'A USB stick', 'The company’s approved sharing tool, after checking the recipient', 'A public file-sharing site'],
      correctIndex: 2,
      explanation: 'Approved tools have the right protections and controls. Always double-check who you’re sending to.',
    },
  ],
  whatToDo: [
    'Report suspected problems straight away: clicks, codes, strange calls, lost devices, misdirected data.',
    'Report fast, no blame. Early reports make problems small.',
    'Share only what’s needed, through approved tools.',
    'Double-check recipients before sending anything sensitive.',
    'Lock your screen and devices whenever you step away.',
  ],
}
