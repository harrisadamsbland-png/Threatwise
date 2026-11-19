import type { TrainingModule } from '../types'

export const m4Bribes: TrainingModule = {
  id: 'bribes-insider-approaches',
  order: 4,
  title: 'Bribes and insider recruitment',
  minutes: 7,
  story: {
    headline: 'Support staff paid to copy customer data',
    date: 'Disclosed May 2025',
    body: [
      'In May 2025, the crypto exchange Coinbase disclosed that criminals had used cash offers to convince a small group of insiders, overseas support staff and contractors, to copy customer data from its support tools.',
      'The stolen information covered less than 1% of monthly transacting users. It was used to call customers while posing as Coinbase, to trick them into sending their funds. The attackers then emailed Coinbase demanding a $20 million ransom.',
      'Coinbase refused to pay, set up a $20 million reward for information leading to the criminals’ arrest, and said it would reimburse affected customers. It estimated the total cost at $180–400 million. Login credentials and private keys were not taken.',
    ],
    stopMoment: 'The moment the first employee was approached. Saying no and reporting the offer would have alerted security to the whole campaign.',
    sources: [
      { title: 'Help Net Security: Coinbase suffers data breach, gets extorted (but won’t pay)', url: 'https://www.helpnetsecurity.com/2025/05/15/coinbase-suffers-data-breach-gets-extorted/' },
      { title: 'Fortune: Coinbase puts $20 million bounty on crooks who tried to extort firm', url: 'https://fortune.com/crypto/2025/05/15/coinbase-puts-20-million-bounty-on-crooks-who-tried-to-extort-firm-over-stolen-customer-data/' },
      { title: 'CSO Online: Would rather pay bounty than ransom', url: 'https://www.csoonline.com/article/3987958/would-rather-pay-bounty-than-ransom-coinbase-on-20m-extortion-attempt.html' },
    ],
  },
  lesson: [
    'Sometimes it’s cheaper for criminals to pay an insider than to hack a company. They reach out on Telegram, WhatsApp, LinkedIn or Discord with offers like “easy side income”, “a quick data job” or “we just need a few screenshots”.',
    'Approaches often start small and friendly: a single lookup, a test account, “nobody will notice”. Once you’ve done one thing, they may threaten to expose you unless you do more.',
    'Everyone with access to customer data, support tools or payment systems is a potential target. That’s not because you’re untrustworthy. It’s because your access is valuable.',
    'If you’re approached, don’t engage and don’t delete the messages. Take screenshots and report it to security or your manager. Reporting an approach is a good thing to do, and it often helps protect colleagues who are being targeted too.',
  ],
  financeExample: 'Exchanges, banks and payment firms are prime targets because customer data enables convincing follow-up scams: “Hi, this is your exchange, we see you hold 2 BTC…”. Insider offers in crypto can be thousands of dollars per lookup.',
  practice: {
    kind: 'scenario',
    scenario: {
      id: 'sc-insider-offer',
      title: 'A message from a stranger',
      channel: 'chat',
      startId: 'start',
      steps: [
        {
          id: 'start',
          text: 'A stranger messages you on Telegram: “Hey! I see you work in support at Northwind. I run a small data business. I’ll pay $500 per customer lookup, cash or crypto. Totally discreet. Interested?”',
          choices: [
            { label: 'Ignore it and delete the chat', safe: false, feedback: 'Not engaging is good, but deleting loses evidence. Security needs to know: others are likely being approached too.', next: 'again' },
            { label: 'Screenshot it, don’t reply, and report it to security', safe: true, feedback: 'Perfect. Reporting protects you, your colleagues and your customers.' },
            { label: 'Reply asking what kind of data, out of curiosity', safe: false, feedback: 'Any reply tells them you might be open to it, and they’ll keep pushing. Don’t engage. Report instead.', next: 'small-ask' },
          ],
        },
        {
          id: 'small-ask',
          text: '“Just one test: send me the email and phone number for this account ID. Takes 30 seconds, here’s $200 upfront as a gesture of trust.”',
          choices: [
            { label: 'It’s just one lookup. Do it.', safe: false, feedback: 'One lookup is a data breach, and it gives them leverage over you. This is exactly how insider schemes grow.', next: 'leverage' },
            { label: 'Stop replying, screenshot everything, and report it now', safe: true, feedback: 'Right call. It’s never too late to report, and doing it now protects you.' },
          ],
        },
        {
          id: 'again',
          text: 'A week later the same person messages again, now offering $1,000 and mentioning a colleague of yours “already on board”.',
          choices: [
            { label: 'Report both messages to security now', safe: true, feedback: 'Exactly. This also helps security protect the colleague they mentioned.' },
            { label: 'Ignore it again', safe: false, feedback: 'The approach is escalating and someone else may be at risk. Report it.' },
          ],
        },
        {
          id: 'leverage',
          text: '“Thanks! Now we need 50 more. If you stop, we’ll send the screenshots of our chat to your employer.”',
          choices: [
            { label: 'Go to security or your manager and tell them everything', safe: true, feedback: 'This is the right move, even now. Companies treat people who come forward very differently from those who are discovered.' },
            { label: 'Keep going so they don’t expose you', safe: false, feedback: 'The threats only grow. The only way out is to report it. Speaking up early protects you most.' },
          ],
        },
      ],
    },
  },
  quiz: [
    {
      id: 'm4-q1',
      prompt: 'Someone offers you money on a messaging app to look up customer details. What should you do?',
      options: ['Ask how much they’d pay', 'Don’t reply, keep the evidence, and report it to security', 'Delete the message and forget it', 'Do it once to see if it’s real'],
      correctIndex: 1,
      explanation: 'Security can only stop a bribery campaign if they know about it. Your screenshots may protect others.',
    },
    {
      id: 'm4-q2',
      prompt: 'Why do criminals target support and operations staff?',
      options: ['Because they’re careless', 'Because their access to customer data is valuable', 'Because they’re paid less', 'They don’t, only executives get targeted'],
      correctIndex: 1,
      explanation: 'It’s about access, not character. Anyone with access to data or systems can be approached.',
    },
    {
      id: 'm4-q3',
      prompt: 'You already did one lookup and now they’re threatening you. What’s the best option?',
      options: ['Keep going so they stay quiet', 'Tell security or your manager everything now', 'Quit your job', 'Block them and hope it goes away'],
      correctIndex: 1,
      explanation: 'Coming forward is always the best option. It stops the harm, and companies respond very differently to people who self-report.',
    },
    {
      id: "m4-q4",
      prompt: "A colleague tells you they’ve been getting “side income” offers for customer lookups and might accept. What’s the best response?",
      options: ["Ignore it, it’s their business", "Encourage them to report it, and report the approach to security yourself if needed", "Ask them to split the money with you", "Post about it on social media"],
      correctIndex: 1,
      explanation: "Approaches usually target many people at once. Reporting protects your colleague, customers and the company.",
    },
  ],
  whatToDo: [
    'Never share customer or company data outside approved tools, for any reason.',
    'Got an offer? Don’t reply, don’t delete it. Screenshot it and report it.',
    'Be wary of strangers on Telegram, WhatsApp, LinkedIn or Discord who know where you work.',
    'Look up only the data you need for the task in front of you.',
    'Made a mistake or being pressured? Come forward. It’s always the best option.',
  ],
}
