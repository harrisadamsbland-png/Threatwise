import type { TrainingModule } from '../types'

export const m2Phone: TrainingModule = {
  id: 'phone-impersonation',
  order: 2,
  title: 'Phone and help-desk impersonation',
  minutes: 7,
  story: {
    headline: 'The phone call that shut down Las Vegas casinos',
    date: 'September 2023',
    body: [
      'In September 2023, MGM Resorts was hit by a cyberattack that disrupted slot machines, hotel room keys and booking systems across its properties.',
      'According to the attackers’ own account, relayed by security researchers, the way in was a phone call. They found an MGM employee on LinkedIn, then called the IT help desk pretending to be that person and talked their way into account access. The group behind it is known as Scattered Spider.',
      'MGM later told investors the attack would cost it around $100 million in that quarter’s results, and that some customers’ personal information was taken.',
    ],
    stopMoment: 'When the help desk got a call from “an employee” asking for access. Checking identity properly, for example by calling the person back on the number in the company directory, would have ended it.',
    sources: [
      { title: 'Netwrix: How the MGM cyberattack happened', url: 'https://netwrix.com/en/resources/blog/mgm-cyber-attack/' },
      { title: 'TeamPassword: The MGM Resorts cyberattack', url: 'https://teampassword.com/blog/mgm-resort-cyberattack' },
    ],
  },
  lesson: [
    'Phone attacks (“vishing”) work because voices feel trustworthy and calls feel urgent. Attackers research you first, using LinkedIn, the company website and social media, so they may know your name, your manager and the systems you use.',
    'The most common scripts: someone from “IT” who needs you to read out a code or install a tool; someone claiming to be a colleague locked out of their account; someone from “the bank” or a supplier confirming payment details.',
    'Your power move is the callback. Say “I’ll call you back”, hang up, and call the person or department on a number you find yourself, from the directory, the intranet or the back of your card. A real caller won’t mind. An attacker will push back.',
    'If you work on a help desk or in IT: identity checks exist for exactly these calls. Pressure, rank or a sad story are never a reason to skip them.',
  ],
  financeExample: 'At exchanges and banks, attackers phone support pretending to be a customer, or phone a customer pretending to be support, to get accounts reset or funds moved. Every reset or withdrawal request needs proper verification, however convincing the caller sounds.',
  practice: {
    kind: 'scenario',
    scenario: {
      id: 'sc-helpdesk',
      title: 'A call from “IT”',
      channel: 'phone',
      startId: 'start',
      steps: [
        {
          id: 'start',
          text: '“Hi, this is Jordan from the IT service desk. We’re seeing suspicious logins on your account and need to secure it right now. I’m going to send a code to your phone. Can you read it back to me?”',
          choices: [
            { label: 'Read the code back, since they’re trying to help', safe: false, feedback: 'That code is the key to your account. Reading it out hands the caller access. Real IT never asks for codes.', next: 'after-code' },
            { label: '“I’ll call the service desk back on the number from the intranet.”', safe: true, feedback: 'Perfect. A real IT person will be happy with that. An attacker loses their hold the moment you hang up.' },
            { label: 'Ask them some questions to see if they sound legit', safe: false, feedback: 'Attackers prepare for questions and may already know your manager’s name. Don’t test them. Hang up and call back.', next: 'pushback' },
          ],
        },
        {
          id: 'pushback',
          text: '“Look, I know your manager is Sam Okafor and you’re on the finance team. I’m on a deadline here, and if we don’t do this in the next two minutes your account will be locked for the whole week.”',
          choices: [
            { label: 'They know my manager, so it must be real. Read the code.', safe: false, feedback: 'Names are easy to find on LinkedIn. Knowing details proves research, not identity.', next: 'after-code' },
            { label: 'Hang up and call the service desk on the intranet number', safe: true, feedback: 'Exactly. Pressure and threats are the tell. Hanging up is always allowed.' },
          ],
        },
        {
          id: 'after-code',
          text: 'You read out the code. A minute later you get an alert: “New sign-in to your account from an unknown device.”',
          choices: [
            { label: 'Report it to IT/security immediately, using the official number', safe: true, feedback: 'Good recovery. Reporting in minutes means they can lock the attacker out before real damage is done.' },
            { label: 'Wait and see if anything else happens', safe: false, feedback: 'Every minute counts. Waiting gives the attacker time to dig in. Report it now. Nobody will blame you.' },
          ],
        },
      ],
    },
  },
  quiz: [
    {
      id: 'm2-q1',
      prompt: 'A caller says they’re from IT and asks you to read out a code just sent to your phone. You should…',
      options: ['Read it out', 'Refuse, hang up and call IT on a number you look up yourself', 'Text it to them instead', 'Ask for their employee ID and then read it out'],
      correctIndex: 1,
      explanation: 'Codes are never shared, with anyone. An employee ID is easy to fake. Hang up and call back yourself.',
    },
    {
      id: 'm2-q2',
      prompt: 'The caller knows your manager’s name and your team. Does that prove they’re genuine?',
      options: ['Yes, an outsider wouldn’t know that', 'No, this is easy to find online, for example on LinkedIn', 'Only if they also know your email', 'Yes, if they sound friendly'],
      correctIndex: 1,
      explanation: 'Attackers research targets before they call. Details show preparation, not identity.',
    },
    {
      id: 'm2-q3',
      prompt: 'What’s the best way to confirm a caller is who they say they are?',
      options: ['Call them back on a number from the company directory or intranet', 'Call back the number they gave you', 'Ask them to email you', 'Trust caller ID'],
      correctIndex: 0,
      explanation: 'Only a number you found yourself is trustworthy. Caller ID and numbers they give you can be faked.',
    },
  ],
  whatToDo: [
    'Never read out codes, passwords or reset links over the phone.',
    'Say “I’ll call you back” and use a number you find yourself.',
    'Pressure, threats or rank are signs to slow down, not speed up.',
    'Help-desk staff: always follow the identity check, every time.',
    'Shared something by mistake? Report it right away.',
  ],
}
