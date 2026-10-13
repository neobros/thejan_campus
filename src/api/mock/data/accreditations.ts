import type { Accreditation } from '@/api/types'

/**
 * DEMO DATA — placeholder structure only (specification §5.4). No registration, accreditation or
 * partnership has been verified for this client. Publish an item only with verified evidence,
 * its official identifier and an approved logo. A teaching partnership is never an accreditation.
 */
export const accreditations: Accreditation[] = [
  {
    id: 'acc-provider-registration',
    name: '[Registration body name]',
    kind: 'registration',
    description:
      'AIT is registered with [Registration body name] as [registration category — to be confirmed]. Registration details will be shown here once verified, with a link to the official public register.',
    identifier: '[Provider registration number — to be confirmed]',
    validFrom: null,
    validTo: null,
    evidenceUrl: null,
    logo: null,
  },
  {
    id: 'acc-course-accreditation',
    name: '[Accrediting body name]',
    kind: 'accreditation',
    description:
      '[Names of accredited courses] are accredited by [Accrediting body name]. Accreditation applies only to the courses named here. [Scope and accreditation period — to be confirmed.]',
    identifier: '[Accreditation reference — to be confirmed]',
    validFrom: null,
    validTo: null,
    evidenceUrl: null,
    logo: null,
  },
  {
    id: 'acc-awarding-body',
    name: '[Awarding body name]',
    kind: 'awarding-body',
    description:
      'Qualifications for [names of courses] are issued by [Awarding body name] on successful completion. [Details of the awarding arrangement — to be confirmed.]',
    identifier: '[Awarding body reference, if applicable]',
    validFrom: null,
    validTo: null,
    evidenceUrl: null,
    logo: null,
  },
  {
    id: 'acc-teaching-partner',
    name: '[Teaching partner name]',
    kind: 'partnership',
    description:
      'A teaching partnership with [Teaching partner name] to deliver or support [course, module or activity]. This is a delivery arrangement — it is not an accreditation and does not change who awards the qualification. [Scope and dates — to be confirmed.]',
    identifier: null,
    validFrom: null,
    validTo: null,
    evidenceUrl: null,
    logo: null,
  },
  {
    id: 'acc-placement-partner',
    name: '[Placement partner name]',
    kind: 'partnership',
    description:
      '[Placement partner name] hosts supervised work placements for students in [course names]. Placement hosts support practical training; they do not accredit or award courses. [Scope and dates — to be confirmed.]',
    identifier: null,
    validFrom: null,
    validTo: null,
    evidenceUrl: null,
    logo: null,
  },
  {
    id: 'acc-membership',
    name: '[Industry association name]',
    kind: 'membership',
    description:
      'AIT is a member of [Industry association name]. Membership is not an endorsement or accreditation of our courses. [Membership details — to be confirmed.]',
    identifier: '[Membership number, if applicable]',
    validFrom: null,
    validTo: null,
    evidenceUrl: null,
    logo: null,
  },
]
