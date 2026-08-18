---
type: community
cohesion: 0.09
members: 71
---

# Booking & Availability API Routes

**Cohesion:** 0.09 - loosely connected
**Members:** 71 nodes

## Members
- [[CONFIG]] - code - lib/rate-limit.ts
- [[Fields]] - code - lib/observability/logger.ts
- [[GET()]] - code - app/api/booking/availability/route.ts
- [[Level]] - code - lib/observability/logger.ts
- [[LimiterName]] - code - lib/rate-limit.ts
- [[MeetingRequest]] - code - lib/google/calendar.ts
- [[MeetingResult]] - code - lib/google/calendar.ts
- [[ORDER]] - code - lib/observability/logger.ts
- [[POST()]] - code - app/api/booking/route.ts
- [[POST()_1]] - code - app/api/contact/route.ts
- [[POST()_2]] - code - app/api/log-client-error/route.ts
- [[POST()_3]] - code - app/api/revalidate/route.ts
- [[REDACTED]] - code - lib/observability/logger.ts
- [[RateVerdict]] - code - lib/rate-limit.ts
- [[Row]] - code - lib/mail/index.ts
- [[SCOPES]] - code - lib/google/calendar.ts
- [[SendResult]] - code - lib/mail/index.ts
- [[ServerEnv]] - code - lib/env.ts
- [[TRUSTED_IP_HEADERS]] - code - lib/rate-limit.ts
- [[__resetEnvCache()]] - code - lib/env.ts
- [[__resetRateLimitState()]] - code - lib/rate-limit.ts
- [[authorized()]] - code - app/api/revalidate/route.ts
- [[availabilityroute.ts]] - code - app/api/booking/availability/route.ts
- [[bookingroute.ts]] - code - app/api/booking/route.ts
- [[bookingConfirmation()]] - code - lib/mail/index.ts
- [[bookingNotification()]] - code - lib/mail/index.ts
- [[calendar.ts]] - code - lib/google/calendar.ts
- [[captureException()]] - code - lib/observability/logger.ts
- [[clientErrorSchema]] - code - app/api/log-client-error/route.ts
- [[clientIp()]] - code - lib/rate-limit.ts
- [[contactroute.ts]] - code - app/api/contact/route.ts
- [[contactNotification()]] - code - lib/mail/index.ts
- [[createMeeting()]] - code - lib/google/calendar.ts
- [[derive()]] - code - lib/env.ts
- [[dynamic]] - code - app/api/booking/availability/route.ts
- [[emailish]] - code - lib/env.ts
- [[emit()]] - code - lib/observability/logger.ts
- [[env.ts]] - code - lib/env.ts
- [[escapeHtml()]] - code - lib/mail/index.ts
- [[fail()]] - code - lib/http.ts
- [[firstIssue()]] - code - lib/contracts.ts
- [[getBusyForDate()]] - code - lib/google/calendar.ts
- [[getClient()]] - code - lib/google/calendar.ts
- [[getLimiter()]] - code - lib/rate-limit.ts
- [[getServerEnv()]] - code - lib/env.ts
- [[http.ts]] - code - lib/http.ts
- [[isCalendarEnabled()]] - code - lib/google/calendar.ts
- [[layout()]] - code - lib/mail/index.ts
- [[limiters]] - code - lib/rate-limit.ts
- [[localBuckets]] - code - lib/rate-limit.ts
- [[localLimit()]] - code - lib/rate-limit.ts
- [[log]] - code - lib/observability/logger.ts
- [[log-client-errorroute.ts]] - code - app/api/log-client-error/route.ts
- [[logger.ts]] - code - lib/observability/logger.ts
- [[mailindex.ts]] - code - lib/mail/index.ts
- [[minLevel()]] - code - lib/observability/logger.ts
- [[ok()]] - code - lib/http.ts
- [[rate-limit.ts]] - code - lib/rate-limit.ts
- [[rateLimit()]] - code - lib/rate-limit.ts
- [[rateLimitHeaders()]] - code - lib/rate-limit.ts
- [[readJson()]] - code - lib/http.ts
- [[revalidateroute.ts]] - code - app/api/revalidate/route.ts
- [[rowsHtml()]] - code - lib/mail/index.ts
- [[runtime]] - code - app/api/booking/availability/route.ts
- [[runtime_1]] - code - app/api/booking/route.ts
- [[runtime_2]] - code - app/api/contact/route.ts
- [[runtime_3]] - code - app/api/log-client-error/route.ts
- [[runtime_4]] - code - app/api/revalidate/route.ts
- [[schema]] - code - lib/env.ts
- [[scrub()]] - code - lib/observability/logger.ts
- [[sendMail()]] - code - lib/mail/index.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Booking__Availability_API_Routes
SORT file.name ASC
```

## Connections to other communities
- 30 edges to [[_COMMUNITY_Booking Widget Calendar]]
- 10 edges to [[_COMMUNITY_Booking Schema Validation]]
- 5 edges to [[_COMMUNITY_Blog Page & Metadata]]

## Top bridge nodes
- [[bookingroute.ts]] - degree 30, connects to 2 communities
- [[availabilityroute.ts]] - degree 27, connects to 2 communities
- [[calendar.ts]] - degree 22, connects to 1 community
- [[contactroute.ts]] - degree 20, connects to 1 community
- [[POST()]] - degree 18, connects to 1 community