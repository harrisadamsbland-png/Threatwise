import type { TrainingModule } from '../types'

export const m1Phishing: TrainingModule = {
  id: 'phishing-emails',
  order: 1,
  title: 'Spotting phishing emails',
  minutes: 9,
  story: {
    headline: 'How 7,000 bitcoin left Binance in one transaction',
    date: 'May 2019',
    body: [
      'In May 2019, attackers withdrew 7,000 bitcoin, worth about $40 million at the time, from the “hot wallet” of Binance, one of the world’s largest crypto exchanges.',
      'They didn’t break Binance’s vault. Over a long period, they collected user API keys, two-factor codes and other details. Binance said they used phishing, viruses and other attacks to get them. Then they used those stolen credentials to move the money in a single withdrawal, structured to pass Binance’s automated security checks.',
      'Binance covered the losses from its emergency fund and paused withdrawals while it reviewed security. The lesson for every company: attackers usually start by tricking people into handing over logins, not by hacking machines.',
    ],
    stopMoment: 'Each time someone typed their login or 2FA code into a fake page, or ran a file they shouldn’t have. Not clicking, and reporting the email, breaks the chain right at the start.',
    sources: [
      { title: 'Security Affairs: Hackers steal $41 million worth of Bitcoin from Binance', url: 'https://securityaffairs.com/85157/cyber-crime/binance-exchange-hacked.html' },
      { title: 'SiliconANGLE: 7,000 bitcoin stolen in hack of Binance', url: 'https://siliconangle.com/2019/05/07/7000-bitcoin-stolen-hack-leading-cryptocurrency-exchange-binance/' },
      { title: 'IBM Security Intelligence: Binance hack steals $41 million from hot wallet', url: 'https://securityintelligence.com/news/binance-hack-steals-41-million-from-hot-wallet' },
    ],
  },
  lesson: [
    'Phishing is an email (or text) pretending to be someone you trust, built to get you to do one thing: sign in on a fake page, open a dangerous file, or send money or information.',
    'You don’t need to be technical to spot it. Look at three things. Who is it really from? Check the actual address, not just the name, and look for swapped letters like 0 for O or 1 for L. What is it asking for? A password, a code, a payment, a file you didn’t expect. How does it feel? Urgent, scary, secret or too good to be true are all deliberate.',
    'The safest habit is simple: don’t sign in from a link in an email. If something says your account needs attention, go to the site or app the way you normally would. If it’s real, you’ll see it there.',
    'If you clicked or typed something in, that’s okay. Report it straight away. Minutes matter far more than embarrassment.',
  ],
  financeExample: 'Crypto firms get emails that copy wallet providers or exchanges: “unusual withdrawal, verify now”. They ask for a recovery phrase or a login. A recovery phrase is the wallet. Nobody legitimate will ever ask for it.',
  practice: {
    kind: 'inbox',
    emailIds: [
      'inbox-password-expiry',
      'inbox-hr-lunch',
      'inbox-vendor-bank-change',
      'inbox-it-maintenance',
      'inbox-shared-salary-file',
      'inbox-colleague-notes',
      'inbox-ceo-gift-cards',
      'inbox-vendor-order',
      'inbox-wallet-verify',
      'inbox-freight-invoice',
    ],
  },
  quiz: [
    {
      id: 'm1-q1',
      prompt: 'An email from “IT Support” says your password expires today and links to a sign-in page. What’s the safest move?',
      options: [
        'Click the link quickly so you don’t get locked out',
        'Ignore the link, and change your password the usual way if needed; report the email',
        'Reply asking if it’s real',
        'Forward it to your team so they’re aware',
      ],
      correctIndex: 1,
      explanation: 'Never sign in from an email link. Go the normal route, and report it. Replying talks to the attacker, and forwarding spreads the risk.',
    },
    {
      id: 'm1-q2',
      prompt: 'Which sender address is most suspicious for a company called northwind-office?',
      options: ['it@northwind-office.example', 'it@northwind-0ffice.example', 'priya.shah@northwind-office.example', 'They all look fine'],
      correctIndex: 1,
      explanation: 'The zero in “0ffice” is a lookalike trick. Always read the address letter by letter when something asks you to act.',
    },
    {
      id: 'm1-q3',
      prompt: 'A supplier emails new bank details and asks you not to call because their phones are down. You should…',
      options: [
        'Update the details, since they explained why',
        'Call the supplier on a number you already have before changing anything',
        'Reply to the email to confirm',
        'Pay half now and half later',
      ],
      correctIndex: 1,
      explanation: 'Changing payment details is the moment to verify through a separate channel you already trust. “Don’t call” is a red flag.',
    },
    {
      id: 'm1-q4',
      prompt: 'You realise you entered your password on a fake page five minutes ago. What now?',
      options: [
        'Keep quiet and hope nothing happens',
        'Wait until the end of the day to see if anything strange happens',
        'Report it to IT/security right away and change your password',
        'Delete the email so there’s no evidence',
      ],
      correctIndex: 2,
      explanation: 'Fast reporting is the single biggest thing that limits damage. Security teams would much rather hear early. Nobody gets in trouble for reporting.',
    },
  ],
  whatToDo: [
    'Check the real sender address, letter by letter.',
    'Don’t sign in from email links. Go to the site or app the usual way.',
    'Verify any payment or bank-detail change by phone, using a number you already have.',
    'Never share passwords, 2FA codes or wallet recovery phrases. Not with anyone.',
    'Clicked something? Report it immediately. No blame, just speed.',
  ],
}
