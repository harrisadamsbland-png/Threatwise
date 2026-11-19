import type { InboxEmail } from './types'

/**
 * Practice inbox at the fictional Northwind Office Co. (northwind-office.example).
 * Every sender, brand and domain here is made up. Links are rendered as inert text.
 */
export const INBOX_EMAILS: InboxEmail[] = [
  {
    id: 'inbox-password-expiry',
    fromName: 'Northwind IT Helpdesk',
    fromAddress: 'it-helpdesk@northwind-0ffice.example',
    subject: 'ACTION REQUIRED: Your password expires in 2 hours',
    body: [
      'Dear user,',
      'Our records show your network password will expire in 2 hours. To avoid losing access to email and files, confirm your current password now:',
      'https://northwind-0ffice.example/secure-login',
      'Failure to act will result in your account being locked.',
      'IT Helpdesk',
    ],
    isPhishing: true,
    redFlags: [
      { label: 'Lookalike domain', explanation: 'The sender is “northwind-0ffice” with a zero, not “northwind-office”.' },
      { label: 'Pressure and threats', explanation: 'A 2-hour deadline and a lockout threat are there to rush you.' },
      { label: 'Asks for your current password', explanation: 'Real IT never needs your existing password. Password changes happen in the normal settings page.' },
      { label: 'Generic greeting', explanation: '“Dear user” means they don’t actually know who you are.' },
    ],
  },
  {
    id: 'inbox-vendor-bank-change',
    fromName: 'Brightline Supplies Accounts',
    fromAddress: 'accounts@brightline-supp1ies.example',
    subject: 'Updated bank details for invoice #4471',
    body: [
      'Hi,',
      'Please note we have changed banks. Kindly pay invoice #4471 (£18,450) and all future invoices to our new account below:',
      'Account: 0049 2817 · Sort code: 40-11-62',
      'We need payment today to avoid a late fee. Please don’t call our office as the phones are being upgraded.',
      'Thanks, Mark — Brightline Accounts',
    ],
    isPhishing: true,
    redFlags: [
      { label: 'Lookalike domain', explanation: '“supp1ies” uses the number 1 instead of the letter L.' },
      { label: 'Change of bank details', explanation: 'Payment-detail changes are the classic invoice fraud. Always confirm by phone using a number you already have.' },
      { label: 'Blocks you from checking', explanation: '“Don’t call our office” is there to stop you verifying. That’s exactly when you should call.' },
      { label: 'Urgency', explanation: '“Payment today” is pressure, not a real reason.' },
    ],
  },
  {
    id: 'inbox-shared-salary-file',
    fromName: 'ShareBox',
    fromAddress: 'no-reply@sharebox-docs.example',
    subject: 'Finance shared “Q4 Salary Review – CONFIDENTIAL.xlsx” with you',
    body: [
      'A file has been shared with you.',
      'Q4 Salary Review – CONFIDENTIAL.xlsx',
      'Sign in with your Northwind email and password to view:',
      'https://sharebox-docs.example/view?file=88213',
    ],
    isPhishing: true,
    redFlags: [
      { label: 'Tempting bait', explanation: 'Salary files, layoffs and bonuses are used because curiosity overrides caution.' },
      { label: 'Unknown file service', explanation: 'Northwind doesn’t use “ShareBox”. Internal files live on the intranet.' },
      { label: 'Asks you to sign in from an email link', explanation: 'A login page reached from an email is the most common way passwords get stolen.' },
    ],
  },
  {
    id: 'inbox-ceo-gift-cards',
    fromName: 'Dana Whitfield',
    fromAddress: 'dana.whitfield.ceo@fastmail-box.example',
    subject: 'Quick favour – are you at your desk?',
    body: [
      'Hi, I’m in back-to-back meetings and need a quick favour.',
      'Can you buy 6 × £200 gift cards for a client thank-you? Scratch the codes and email me photos. I’ll make sure you’re reimbursed today.',
      'Please keep this between us for now, it’s a surprise.',
      'Sent from my phone',
    ],
    isPhishing: true,
    redFlags: [
      { label: 'Personal email address', explanation: 'The CEO’s name, but not a Northwind address.' },
      { label: 'Gift cards', explanation: 'Gift cards are untraceable, so scammers love them. No real business pays clients this way.' },
      { label: 'Secrecy', explanation: '“Keep this between us” stops you from checking with anyone.' },
      { label: 'Authority and urgency', explanation: 'A senior name plus a rush is designed to make you skip the rules.' },
    ],
  },
  {
    id: 'inbox-wallet-verify',
    fromName: 'Vaultly Security',
    fromAddress: 'security@vau1tly-support.example',
    subject: 'Unusual withdrawal attempt on the company treasury wallet',
    body: [
      'We blocked a withdrawal of 4.2 BTC from your organisation’s Vaultly wallet.',
      'To keep the wallet unlocked, verify ownership within 30 minutes by entering your 12-word recovery phrase here:',
      'https://vau1tly-support.example/verify',
      'Vaultly Security Team',
    ],
    isPhishing: true,
    redFlags: [
      { label: 'Asks for a recovery phrase', explanation: 'Anyone with a recovery (seed) phrase owns the wallet. No real provider ever asks for it.' },
      { label: 'Lookalike domain', explanation: '“vau1tly” uses a number 1 in place of the letter L.' },
      { label: 'Fear and a countdown', explanation: 'A scary alert plus 30 minutes is meant to stop you thinking.' },
    ],
  },
  {
    id: 'inbox-freight-invoice',
    fromName: 'QuickFreight Billing',
    fromAddress: 'billing@quickfreight-invoices.example',
    subject: 'Overdue invoice INV-88231 – final notice',
    body: [
      'Your account is overdue. See the attached invoice and pay immediately to avoid collection fees.',
      'Open the attachment and click “Enable content” to view it correctly.',
    ],
    attachment: 'INV-88231.html',
    isPhishing: true,
    redFlags: [
      { label: 'Supplier you don’t use', explanation: 'An invoice from a company you’ve never dealt with is a warning sign by itself.' },
      { label: 'Strange attachment type', explanation: 'Invoices are PDFs. An .html file can open a fake login page or run code.' },
      { label: '“Enable content”', explanation: 'Being told to enable content or macros is how a lot of malware gets in.' },
    ],
  },
  {
    id: 'inbox-hr-lunch',
    fromName: 'Priya Shah (HR)',
    fromAddress: 'priya.shah@northwind-office.example',
    subject: 'Team lunch on Friday 🍕',
    body: [
      'Hi all, as mentioned in Monday’s stand-up, we’re doing a team lunch on Friday at 12:30 in the 3rd floor kitchen.',
      'The menu is on the intranet: https://intranet.northwind-office.example/events/lunch',
      'Let me know about any dietary needs. See you there!',
    ],
    isPhishing: false,
    redFlags: [],
    whySafe: 'Real Northwind address, it matches something already announced, and it asks for nothing sensitive: no login, no payment, no rush.',
  },
  {
    id: 'inbox-it-maintenance',
    fromName: 'Northwind IT',
    fromAddress: 'it@northwind-office.example',
    subject: 'Planned maintenance Saturday 08:00–10:00',
    body: [
      'The VPN will be unavailable on Saturday between 08:00 and 10:00 while we apply updates.',
      'You don’t need to do anything. If you have questions, reply here or call the helpdesk on the number on the intranet.',
    ],
    isPhishing: false,
    redFlags: [],
    whySafe: 'Correct IT domain, it’s informational only, there are no links or attachments, and it points you to contact details you already know.',
  },
  {
    id: 'inbox-colleague-notes',
    fromName: 'Tom Baker',
    fromAddress: 'tom.baker@northwind-office.example',
    subject: 'Notes from today’s client call',
    body: [
      'Hey, as promised in the call, I’ve put the notes on the team wiki page:',
      'https://intranet.northwind-office.example/wiki/clients/harbor-call',
      'Shout if I missed anything.',
    ],
    isPhishing: false,
    redFlags: [],
    whySafe: 'You were expecting it, it’s from a colleague’s real address, and the link goes to the company intranet, not a sign-in page somewhere else.',
  },
  {
    id: 'inbox-vendor-order',
    fromName: 'Brightline Supplies Orders',
    fromAddress: 'orders@brightline-supplies.example',
    subject: 'Order confirmation for PO-2291',
    body: [
      'Thanks for your order PO-2291 (printer paper × 40 boxes).',
      'Expected delivery: Wednesday. No action is needed. Your usual payment terms apply.',
    ],
    isPhishing: false,
    redFlags: [],
    whySafe: 'The correct Brightline domain (spelled with a real L), it matches an order you placed, and it doesn’t change any payment details or ask you to act.',
  },
]
