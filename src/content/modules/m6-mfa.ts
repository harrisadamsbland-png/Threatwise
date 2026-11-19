import type { TrainingModule } from '../types'

export const m6Mfa: TrainingModule = {
  id: 'passwords-mfa',
  order: 6,
  title: 'Passwords, MFA and push-spam',
  minutes: 6,
  story: {
    headline: 'Approving one notification too many',
    date: 'September 2022',
    body: [
      'In September 2022, an attacker got into Uber’s internal systems. Uber said the attacker likely bought a contractor’s corporate password on the dark web, after the contractor’s personal device was infected with malware.',
      'The account was protected by multi-factor authentication (MFA), so each login attempt sent an approval request to the contractor’s phone. The attacker kept trying, again and again. Reports say they also messaged the contractor on WhatsApp pretending to be Uber IT, saying the alerts would stop if they approved one. Eventually, the contractor approved one.',
      'Once inside, the attacker reached internal tools. Uber said it saw no evidence that the apps’ production systems or sensitive user data were accessed, and it strengthened its MFA policies afterwards.',
    ],
    stopMoment: 'When the approval requests started arriving without the contractor trying to log in. Denying them all and reporting them would have kept the door shut.',
    sources: [
      { title: 'Uber Newsroom: Security update', url: 'https://www.uber.com/en-US/newsroom/security-update/' },
      { title: 'Malwarebytes: Uber hacked', url: 'https://www.malwarebytes.com/blog/news/2022/09/uber-hacked-again-in-what-seems-an-uber-hack-this-time' },
    ],
  },
  lesson: [
    'MFA (a code or approval on your phone) is one of the best protections there is. But it only works if you approve only the logins you are doing right now.',
    'If you get an approval request you didn’t trigger, someone else has your password. Deny it, and report it so the password can be changed. Lots of requests in a row (“push spam”) is an attack, not a glitch.',
    'Use a different password for work than anywhere else, ideally from a password manager. Reused passwords leak from other sites and get tried against your work account.',
    'And the golden rule: nobody, not IT, not your manager, not “security”, will ever ask you to approve a prompt or read out a code for them.',
  ],
  financeExample: 'Crypto exchange and banking customers get push-spam and fake “support” calls at the same time: “approve the prompt so we can secure your account”. Staff with admin access to wallets or payment systems are top targets for exactly this.',
  practice: {
    kind: 'scenario',
    scenario: {
      id: 'sc-push-spam',
      title: 'Your phone won’t stop buzzing',
      channel: 'phone',
      startId: 'start',
      steps: [
        {
          id: 'start',
          text: 'It’s 11pm. Your phone shows “Approve sign-in to Northwind?” You’re not logging in. You deny it. Two more arrive. Then five more.',
          choices: [
            { label: 'Approve one just to make them stop', safe: false, feedback: 'That’s exactly what the attacker is hoping for. Approving lets them straight in.', next: 'approved' },
            { label: 'Deny them all and report it to IT/security now', safe: true, feedback: 'Correct. Someone has your password. Reporting means it can be reset before they try another trick.' },
            { label: 'Deny them and deal with it in the morning', safe: false, feedback: 'Denying is right, but the attacker still has your password and may try other tricks overnight. Report it now.', next: 'whatsapp' },
          ],
        },
        {
          id: 'whatsapp',
          text: 'A WhatsApp message arrives: “Hi, Northwind IT here. We’re fixing a glitch causing those alerts. Please approve the next one and they’ll stop.”',
          choices: [
            { label: 'Approve the next one, since IT asked', safe: false, feedback: 'Real IT will never ask you to approve a prompt. This is the attacker.', next: 'approved' },
            { label: 'Don’t approve, and report both the prompts and the message', safe: true, feedback: 'Spot on. Prompts plus a “helpful IT” message is a classic combination.' },
          ],
        },
        {
          id: 'approved',
          text: 'The prompts stop. A minute later you get an email: “New device signed in to your account.”',
          choices: [
            { label: 'Report it immediately via the IT hotline', safe: true, feedback: 'Good recovery. Fast reporting means security can kick the attacker out and reset access.' },
            { label: 'It stopped, so it’s fine now', safe: false, feedback: 'It stopped because they got in. Report it immediately. You won’t be blamed for being targeted.' },
          ],
        },
      ],
    },
  },
  quiz: [
    {
      id: 'm6-q1',
      prompt: 'You get an MFA approval request but you aren’t logging in. What does it mean?',
      options: ['A harmless glitch', 'Someone else likely has your password', 'Your phone needs updating', 'IT is testing the system'],
      correctIndex: 1,
      explanation: 'A prompt you didn’t trigger means someone entered your password. Deny it, and report it so the password gets changed.',
    },
    {
      id: 'm6-q2',
      prompt: '“IT” asks you on WhatsApp to approve the next prompt. You should…',
      options: ['Approve it', 'Refuse and report it. Real IT never asks this.', 'Ask them to call instead, then approve', 'Approve only if they know your name'],
      correctIndex: 1,
      explanation: 'No legitimate person ever needs you to approve a prompt or share a code for them.',
    },
    {
      id: 'm6-q3',
      prompt: 'Why use a unique work password?',
      options: ['It’s a rule with no real reason', 'Passwords leaked from other sites get tried against work accounts', 'It makes MFA unnecessary', 'It speeds up login'],
      correctIndex: 1,
      explanation: 'Reused passwords are one of the most common ways in. A password manager makes unique passwords easy.',
    },
    {
      id: "m6-q4",
      prompt: "You accidentally approved an MFA prompt you didn’t start. What now?",
      options: ["Nothing, it was only one", "Report it to IT/security immediately so they can lock the session and reset your password", "Turn off MFA so it doesn’t happen again", "Change your phone’s wallpaper"],
      correctIndex: 1,
      explanation: "One approval can be enough to let an attacker in. Reporting fast lets security cut off access. Nobody will blame you.",
    },
  ],
  whatToDo: [
    'Only approve MFA prompts for logins you’re doing right now.',
    'Unexpected prompt? Deny it and report it: your password is probably known.',
    'Never approve a prompt or share a code because someone asked.',
    'Use a unique work password, ideally from a password manager.',
    'Approved one by mistake? Report it immediately.',
  ],
}
