import type { Agent } from '@/api/types'

/**
 * DEMO DATA — fictional sample agents (specification §5.15). Contact details use reserved
 * example domains and a phone placeholder. List only agents with a current, approved agreement.
 */
export const agents: Agent[] = [
  {
    id: 'agent-colombia',
    name: 'Demo Education Services — Colombia',
    country: 'Colombia',
    city: 'Bogotá',
    email: 'demo-colombia@example.com',
    phone: '[PHONE]',
    website: 'https://example.org/demo-agent-colombia',
    languages: ['Spanish', 'English'],
  },
  {
    id: 'agent-india',
    name: 'Demo Education Services — India',
    country: 'India',
    city: 'Mumbai',
    email: 'demo-india@example.com',
    phone: '[PHONE]',
    website: 'https://example.org/demo-agent-india',
    languages: ['English', 'Hindi', 'Marathi'],
  },
  {
    id: 'agent-kenya',
    name: 'Demo Education Services — Kenya',
    country: 'Kenya',
    city: 'Nairobi',
    email: 'demo-kenya@example.com',
    phone: '[PHONE]',
    website: null,
    languages: ['English', 'Swahili'],
  },
  {
    id: 'agent-nepal',
    name: 'Demo Education Services — Nepal',
    country: 'Nepal',
    city: 'Kathmandu',
    email: 'demo-nepal@example.com',
    phone: '[PHONE]',
    website: 'https://example.org/demo-agent-nepal',
    languages: ['Nepali', 'English'],
  },
  {
    id: 'agent-philippines',
    name: 'Demo Education Services — Philippines',
    country: 'Philippines',
    city: 'Manila',
    email: 'demo-philippines@example.com',
    phone: '[PHONE]',
    website: null,
    languages: ['English', 'Filipino'],
  },
  {
    id: 'agent-vietnam',
    name: 'Demo Education Services — Vietnam',
    country: 'Vietnam',
    city: 'Ho Chi Minh City',
    email: 'demo-vietnam@example.com',
    phone: '[PHONE]',
    website: 'https://example.org/demo-agent-vietnam',
    languages: ['Vietnamese', 'English'],
  },
]
