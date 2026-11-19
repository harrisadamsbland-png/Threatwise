import type { TrainingModule } from '../types'
import { m1Phishing } from './m1-phishing'
import { m2Phone } from './m2-phone'
import { m3Deepfake } from './m3-deepfake'
import { m4Bribes } from './m4-bribes'
import { m5FakeJobs } from './m5-fake-jobs'
import { m6Mfa } from './m6-mfa'
import { m7Reporting } from './m7-reporting'

export const MODULES: TrainingModule[] = [m1Phishing, m2Phone, m3Deepfake, m4Bribes, m5FakeJobs, m6Mfa, m7Reporting]
