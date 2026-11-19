import { createContext, useContext } from 'react'
import type { InboxEmail, TrainingModule } from './types'

export interface Content { modules: TrainingModule[]; emails: InboxEmail[] }

export const ContentContext = createContext<Content>({ modules: [], emails: [] })

export const useContent = () => useContext(ContentContext)
