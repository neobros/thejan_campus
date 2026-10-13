import type {
  Accreditation,
  Agent,
  ApplicationData,
  ApplicationDraft,
  ApplicationReceipt,
  Article,
  ArticleQuery,
  ArticleSummary,
  Campus,
  CampusSummary,
  Course,
  CourseCategory,
  CourseFilterOptions,
  CourseOption,
  CourseQuery,
  CourseSummary,
  Department,
  DocumentRequirement,
  DocumentType,
  DraftHandle,
  EnquiryInput,
  EnquiryReceipt,
  EventItem,
  EventQuery,
  EventSummary,
  Faq,
  FeeListing,
  FeeQuery,
  GalleryAlbum,
  InstitutionSettings,
  IntakeListing,
  IntakeQuery,
  Navigation,
  OrientationSession,
  Page,
  Paginated,
  Policy,
  PolicySummary,
  Resource,
  ResourceQuery,
  Scholarship,
  SearchResult,
  StaffProfile,
  SupportService,
  Testimonial,
  UploadedDocument,
} from './types'

/**
 * Everything the website needs from the backend. `http.ts` maps each method onto the REST
 * endpoints from the specification (§10); `mock/` implements the same contract over the demo data.
 * Not-found lookups reject with ApiError(status 404).
 */
export interface CampusApi {
  getSettings(): Promise<InstitutionSettings>
  getNavigation(): Promise<Navigation>
  /** CMS page by path without leading slash, e.g. "admissions/fees"; "home" for the home page. */
  getPage(path: string): Promise<Page>

  listCategories(): Promise<CourseCategory[]>
  getCategory(slug: string): Promise<CourseCategory>
  listCourses(query: CourseQuery): Promise<Paginated<CourseSummary>>
  getCourseFilterOptions(): Promise<CourseFilterOptions>
  getCourse(slug: string): Promise<Course>
  /** Course → offering → intake tree for application/enquiry selectors (published, active only). */
  listCourseOptions(): Promise<CourseOption[]>
  listIntakes(query: IntakeQuery): Promise<IntakeListing[]>
  listFees(query: FeeQuery): Promise<FeeListing[]>

  listCampuses(): Promise<CampusSummary[]>
  getCampus(slug: string): Promise<Campus>

  listArticles(query: ArticleQuery): Promise<Paginated<ArticleSummary>>
  getArticle(slug: string): Promise<Article>
  listEvents(query: EventQuery): Promise<Paginated<EventSummary>>
  getEvent(slug: string): Promise<EventItem>
  listGalleryAlbums(): Promise<GalleryAlbum[]>
  listTestimonials(): Promise<Testimonial[]>

  listStaff(): Promise<StaffProfile[]>
  listAccreditations(): Promise<Accreditation[]>
  listAgents(): Promise<Agent[]>
  listScholarships(): Promise<Scholarship[]>

  listSupportServices(): Promise<SupportService[]>
  listOrientationSessions(): Promise<OrientationSession[]>
  listResources(query: ResourceQuery): Promise<Resource[]>
  listPolicies(): Promise<PolicySummary[]>
  getPolicy(slug: string): Promise<Policy>
  listFaqs(): Promise<Faq[]>
  listDepartments(): Promise<Department[]>

  search(q: string): Promise<SearchResult[]>

  createEnquiry(input: EnquiryInput, options: { idempotencyKey: string }): Promise<EnquiryReceipt>

  createApplicationDraft(): Promise<DraftHandle>
  getApplicationDraft(handle: DraftHandle): Promise<ApplicationDraft>
  saveApplicationDraft(handle: DraftHandle, patch: { step: number; data: ApplicationData }): Promise<ApplicationDraft>
  getDocumentRequirements(handle: DraftHandle): Promise<DocumentRequirement[]>
  uploadApplicationDocument(
    handle: DraftHandle,
    type: DocumentType,
    file: File,
    onProgress?: (fraction: number) => void,
  ): Promise<UploadedDocument>
  removeApplicationDocument(handle: DraftHandle, documentId: string): Promise<void>
  /** Finalise the draft. Repeating the call with the same key returns the same receipt. */
  submitApplication(handle: DraftHandle, options: { idempotencyKey: string }): Promise<ApplicationReceipt>
}
