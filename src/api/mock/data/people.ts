import type { StaffProfile } from '@/api/types'
import { portrait } from './media'

/**
 * DEMO DATA — sample profiles with neutral placeholder names (specification §5.3). Replace with
 * approved profiles, confirmed qualifications and approved photographs. `email` stays null unless
 * the person has agreed to public contact details.
 */
type ProfileSeed = Omit<StaffProfile, 'photo' | 'email'>

function profile(seed: ProfileSeed): StaffProfile {
  return { ...seed, photo: portrait(seed.name), email: null }
}

export const staff: StaffProfile[] = [
  /* Leadership ------------------------------------------------------------------------------- */
  profile({
    id: 'staff-alex-rivera',
    name: 'Alex Rivera',
    role: 'Principal and Chief Executive Officer',
    group: 'leadership',
    department: 'Executive office',
    bio: 'Alex leads the strategy and day-to-day running of AIT, working closely with academic and student services teams so that every campus offers the same clear information and consistent support.',
    qualifications: ['[Highest qualification — to be confirmed]', '[Professional membership — to be confirmed]'],
    expertise: ['Education leadership', 'Governance and compliance', 'Strategic planning'],
  }),
  profile({
    id: 'staff-jordan-mensah',
    name: 'Jordan Mensah',
    role: 'Academic Director',
    group: 'leadership',
    department: 'Academic office',
    bio: 'Jordan oversees course design, teaching quality and assessment practice across all study areas, and supports trainers to keep learning practical, fair and up to date.',
    qualifications: ['[Highest qualification — to be confirmed]', '[Teaching qualification — to be confirmed]'],
    expertise: ['Curriculum design', 'Assessment and moderation', 'Teaching quality'],
  }),
  profile({
    id: 'staff-sam-okafor',
    name: 'Sam Okafor',
    role: 'Head of Student Experience',
    group: 'leadership',
    department: 'Student services',
    bio: 'Sam leads the teams that support students outside the classroom — from orientation and wellbeing to accessibility, student feedback and complaints.',
    qualifications: ['[Qualification — to be confirmed]'],
    expertise: ['Student wellbeing', 'Accessibility and inclusion', 'Orientation and transition'],
  }),

  /* Faculty ---------------------------------------------------------------------------------- */
  profile({
    id: 'staff-taylor-nguyen',
    name: 'Taylor Nguyen',
    role: 'Program Lead, Business and Management',
    group: 'faculty',
    department: 'Business & Management',
    bio: 'Taylor coordinates the business programs and teaches operations planning and project coordination, using realistic workplace scenarios to connect theory with practice. [Industry experience — to be confirmed.]',
    qualifications: ['[Qualification — to be confirmed]', '[Teaching qualification — to be confirmed]'],
    expertise: ['Business operations', 'Project coordination', 'Workplace communication'],
  }),
  profile({
    id: 'staff-casey-fernando',
    name: 'Casey Fernando',
    role: 'Program Lead, Information Technology',
    group: 'faculty',
    department: 'Information Technology',
    bio: 'Casey leads the information technology programs and teaches programming and networking in the City Campus computer lab, with a focus on hands-on team projects. [Industry experience — to be confirmed.]',
    qualifications: ['[Qualification — to be confirmed]', '[Industry certification — to be confirmed]'],
    expertise: ['Programming', 'Networking', 'Cyber security fundamentals'],
  }),
  profile({
    id: 'staff-riley-haddad',
    name: 'Riley Haddad',
    role: 'Head Trainer, Commercial Cookery',
    group: 'faculty',
    department: 'Hospitality & Cookery',
    bio: 'Riley runs practical classes in the Riverside Campus training kitchens and coordinates service periods in the training restaurant, helping students build speed, organisation and good food safety habits.',
    qualifications: ['[Qualification — to be confirmed]', '[Teaching qualification — to be confirmed]'],
    expertise: ['Commercial cookery', 'Food safety', 'Kitchen operations'],
  }),
  profile({
    id: 'staff-jamie-silva',
    name: 'Jamie Silva',
    role: 'Program Lead, Health and Community Services',
    group: 'faculty',
    department: 'Health & Community',
    bio: 'Jamie teaches person-centred care and coordinates simulated practice at Parkview Campus, preparing students for supervised placement with confidence and care.',
    qualifications: ['[Qualification — to be confirmed]', '[Professional registration, if applicable — to be confirmed]'],
    expertise: ['Person-centred care', 'Infection prevention and control', 'Placement preparation'],
  }),
  profile({
    id: 'staff-avery-chen',
    name: 'Avery Chen',
    role: 'English Language Coordinator',
    group: 'faculty',
    department: 'English Language',
    bio: 'Avery coordinates the English language programs, including placement testing on arrival, and teaches academic writing and presentation skills.',
    qualifications: ['[Qualification — to be confirmed]', '[Language teaching qualification — to be confirmed]'],
    expertise: ['Academic English', 'Placement testing', 'Language assessment'],
  }),

  /* Professional staff ----------------------------------------------------------------------- */
  profile({
    id: 'staff-morgan-reid',
    name: 'Morgan Reid',
    role: 'Admissions Manager',
    group: 'professional',
    department: 'Admissions',
    bio: 'Morgan leads the admissions team that answers course enquiries, reviews applications and guides applicants through each step, from first question to enrolment.',
    qualifications: ['[Qualification — to be confirmed]'],
    expertise: ['Admissions advice', 'Application assessment', 'Credit transfer enquiries'],
  }),
  profile({
    id: 'staff-robin-kowalski',
    name: 'Robin Kowalski',
    role: 'International Student Adviser',
    group: 'professional',
    department: 'International office',
    bio: 'Robin helps international applicants and students with course enquiries, pre-arrival planning and settling in. Robin can explain how AIT processes work and point students to official sources, but does not give migration advice.',
    qualifications: ['[Qualification — to be confirmed]'],
    expertise: ['International admissions', 'Pre-arrival planning', 'Settling-in support'],
  }),
]
