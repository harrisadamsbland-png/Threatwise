import type { TrainingModule } from '../types'

export const m5FakeJobs: TrainingModule = {
  id: 'fake-jobs-files',
  order: 5,
  title: 'Fake job offers, files and downloads',
  minutes: 7,
  story: {
    headline: 'The dream job offer that cost $600 million',
    date: 'March 2022',
    body: [
      'In March 2022, attackers stole about 173,600 ether and 25.5 million USDC, reported at roughly $600 million at the time, from the Ronin bridge used by the game Axie Infinity, run by Sky Mavis. The US government linked it to the North Korean group Lazarus.',
      'Sky Mavis said an employee had been compromised by “advanced spear-phishing”. According to reporting by The Block, a senior engineer was approached on LinkedIn about a well-paid job, went through several interview rounds, and was then sent an offer letter as a PDF that carried malware.',
      'That malware gave the attackers a way into Sky Mavis’s systems. From there, they got enough signing keys to approve withdrawals. The theft wasn’t noticed for days.',
    ],
    stopMoment: 'When a file arrived from an outside recruiter and was opened on a work device. Opening unexpected files on a work machine, even exciting ones, is how malware gets in.',
    sources: [
      { title: 'Security Affairs: A fake job offer via LinkedIn allowed hackers to steal from Axie Infinity', url: 'https://securityaffairs.com/133113/cyber-crime/axie-infinity-hack-fake-job-offer.html' },
      { title: 'TechRadar: An elaborate LinkedIn scam led to one of the largest heists in crypto history', url: 'https://www.techradar.com/news/an-elaborate-linkedin-scam-led-to-one-of-the-largest-heists-in-crypto-history' },
    ],
  },
  lesson: [
    'Not every attack looks like spam. Some are patient and flattering: a recruiter with a great offer, a “journalist” wanting an interview, a “client” sending a brief. The goal is to get you to open a file or install something.',
    'Files can be dangerous: documents that ask you to “enable content”, files ending in .html, .exe, .js, .iso or .zip that you didn’t expect, or “test tasks” that ask you to run code.',
    'Keep work devices for work. Don’t open job offers, personal downloads or “coding challenges” from strangers on a laptop that has access to company systems.',
    'If a file is unexpected, ask before you open it. If you opened something and your device acts strangely, or you’re just unsure, tell IT. They can check it quickly.',
  ],
  financeExample: 'Engineers and finance staff at crypto companies are heavily targeted with fake recruiter approaches and “take-home tests” that install malware. Some groups run whole fake companies with websites and LinkedIn profiles to make it believable.',
  practice: {
    kind: 'scenario',
    scenario: {
      id: 'sc-fake-recruiter',
      title: 'An exciting job offer',
      channel: 'email',
      startId: 'start',
      steps: [
        {
          id: 'start',
          text: 'After two friendly video interviews, a recruiter emails: “Congratulations! Please review your offer letter (attached: Offer_Letter_Final.pdf.html) and the quick coding task before Friday.” You’re on your work laptop.',
          choices: [
            { label: 'Open it now on the work laptop. It’s just a PDF.', safe: false, feedback: 'Look again: it ends in .html, not .pdf. And even real PDFs can carry malware. Work devices aren’t for outside files like this.', next: 'opened' },
            { label: 'Don’t open it on the work laptop, and report it to IT/security', safe: true, feedback: 'Exactly. Unexpected files from outsiders don’t belong on devices that can reach company systems.' },
            { label: 'Forward it to a colleague to check', safe: false, feedback: 'That just moves the risk to someone else. Send it to IT/security through the official reporting route instead.', next: 'start' },
          ],
        },
        {
          id: 'opened',
          text: 'You open it. Nothing much seems to happen, but a minute later your laptop’s fan is running hard and a window flashes briefly.',
          choices: [
            { label: 'Disconnect from Wi-Fi and call IT straight away', safe: true, feedback: 'Great response. Quick action can stop malware spreading or sending data out.' },
            { label: 'Restart and carry on', safe: false, feedback: 'Malware usually survives a restart. Tell IT now. Speed is everything.' },
          ],
        },
      ],
    },
  },
  quiz: [
    {
      id: 'm5-q1',
      prompt: 'A recruiter sends “Offer_Letter.pdf.html”. What’s wrong?',
      options: ['Nothing, it’s a PDF', 'It’s actually an HTML file pretending to be a PDF', 'The name is too long', 'Only that it’s unsigned'],
      correctIndex: 1,
      explanation: 'The last extension is the real one. A double extension is a classic trick to make a dangerous file look harmless.',
    },
    {
      id: 'm5-q2',
      prompt: 'Where should you open personal job offers or test tasks from strangers?',
      options: ['On your work laptop, since it’s more secure', 'Not on a work device with access to company systems', 'Anywhere, as long as you have antivirus', 'On a shared office computer'],
      correctIndex: 1,
      explanation: 'Keep outside files off work devices. In the Ronin case, one file on a work machine opened the door to a huge theft.',
    },
    {
      id: 'm5-q3',
      prompt: 'You opened a file and your computer is acting strangely. What first?',
      options: ['Keep working and see if it stops', 'Disconnect from the network and contact IT immediately', 'Delete the file and say nothing', 'Run a random free cleaner from the internet'],
      correctIndex: 1,
      explanation: 'Disconnecting limits spread and data loss, and IT can investigate properly. Never feel bad about calling.',
    },
    {
      id: "m5-q4",
      prompt: "A document you weren’t expecting opens with a banner saying “Enable content to view this document”. What should you do?",
      options: ["Click Enable content", "Close it without enabling anything, and report it if you didn’t expect it", "Forward it to a colleague to try", "Print it instead"],
      correctIndex: 1,
      explanation: "“Enable content” turns on macros, a very common way for malware to run. Legitimate documents rarely need it.",
    },
  ],
  whatToDo: [
    'Be extra careful with flattering, unexpected approaches.',
    'Check the real file extension. Watch out for .html, .exe, .js, .iso and double extensions.',
    'Don’t open outside job offers or “test tasks” on work devices.',
    'Never “enable content” or macros on documents you didn’t expect.',
    'Opened something odd? Disconnect and tell IT immediately.',
  ],
}
