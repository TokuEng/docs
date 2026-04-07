# Operation Inventory — Partner-Facing External API

Source of truth: `src/server/injectors/external-api-injectors.ts`

## Auth
| Operation Key | Method | File | Input Fields | Output Fields | Headers |
|---|---|---|---|---|---|
| `createUserApiToken` | POST | `src/server/operations/admin/createApiToken.ts` | `email: string`, `orgID: string`, `roleInOrgID: string`, `fromHRIS: boolean` (typed only; no zod validation in file) | `personalToken.token: string`, `personalToken.personalTokenID: string`, `personalToken.expiresAt: Date` | `Authorization: Bearer <token>`; `x-role-type: CLIENT_ORG_ADMIN`; optional `x-internal-hris-key` enables 100-year expiry branch |
| `refreshUserApiToken` | POST | `src/server/operations/admin/refreshApiToken.ts` | `email: string`, `orgID: string`, `roleInOrgID: string` (typed only; no zod validation in file) | `personalToken.token: string`, `personalToken.personalTokenID: string`, `personalToken.expiresAt: Date` | `Authorization: Bearer <token>`; `x-role-type: CLIENT_ORG_ADMIN`; optional `x-internal-hris-key` enables 100-year expiry branch |

## Payroll
| Operation Key | Method | File | Input Fields | Output Fields | Headers |
|---|---|---|---|---|---|
| `getAllPayroll` | GET | `src/server/operations/payroll/getAllPayroll.ts` | none (`{}`) | `payrolls: Payroll[]` where `Payroll` model fields include `id`, `name`, `entity`, `payPeriodStart`, `payPeriodEnd`, `payDate`, `currentStep`, `state`, `type`, `externalPayrollID`, `fiatCurrency`, `stableCoinCurrency`, `tokenTypeID`, `exchangeRate`, `isStablecoinPayrollComplete`, `isFiatPayrollComplete`, `isSyncedFromHRIS`, `selectedEmployeeIds`, `importedData`, `processedData`, `settlementData`, `isCsvUploaded`, `createdAt`, `updatedAt`, `createdByID`, `lastModifiedByID`, `orgID` | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |
| `createPayroll` | POST | `src/server/operations/payroll/createPayroll.ts` | `payrollName?: string`, `payrollStartDate: Date`, `payrollEndDate: Date`, `payrollPayDate?: Date`, `payrollFiatCurrency: string`, `tokenTypeID: string`, `payrollEntity: string` (typed only) | `payroll: Payroll \| null` (created object uses `name`, `entity`, `payPeriodStart`, `payPeriodEnd`, `payDate`, `fiatCurrency`, `tokenTypeID`, `currentStep`, `state`, `orgID`, creator/modifier links) | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |
| `getPayroll` | POST | `src/server/operations/payroll/getPayroll.ts` | `payrollId: string` (typed only) | `payroll: Payroll \| null` with Payroll model fields above | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |
| `updatePayrollState` | POST | `src/server/operations/payroll/updatePayrollState.ts` | `payrollId: string`, `state: TgaPayrollState` (typed only) | `payroll: Payroll` with Payroll model fields above | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |
| `validateAndCalculatePayroll` | POST | `src/server/operations/payroll/validateAndCalculateEmployeePayrollData.ts` | `payrollId: string`; `employeeData[]` items: `employeeId`, `employeeName`, `totalCompensation`, `totalDeduction`, `currency`, `stableCoinPercentage?`, `minimumWage?`, `id`; `isCSVUploaded?: boolean` | `validatedEmployeeData[]?` items: `id`, `employeeId`, `employeeName`, `totalCompensation`, `totalDeduction`, `currency`, `stableCoinPercentage?`, `netPayFiat?`, `netPayStableCoin?`, `hasTGAProfile?`, `hasValidWallet?`, `hasPayrollError?`, `hasMinimumWageError?`; `error?: string` | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |

## EOR/HRIS
| Operation Key | Method | File | Input Fields | Output Fields | Headers |
|---|---|---|---|---|---|
| `getHrisPeople` | GET | `src/server/operations/hris/getHrisPeople.ts` | none (`{}` via strict zod object) | array rows with `id`, `fullName`, `email`, `type`, `status`, `title`, `department`, `location`, `startDate`, `roleInOrg`, `employeeInfo`, `contractorInfo`, `employeeRecord`, `contractorRecord` | `Authorization: Bearer <token>`; admin role required (`TokuClientAdminOperation` => `CLIENT_ORG_ADMIN`) |
| `getOnboardingOverview` | GET | `src/server/operations/hris/onboarding/getOnboardingOverview.ts` | none (`{}` via strict zod object) | array rows: `roleInOrgId`, `countryCode`, `status`, `currentStepId`, `currentStepLabel`, `completedStepCount`, `totalStepCount`, `onboardingStartedAt`, `lastActivityAt` | `Authorization: Bearer <token>`; admin role required |
| `createHrisPerson` | POST | `src/server/operations/hris/createHrisPerson.ts` | discriminated union on `employmentType`. **EMPLOYEE**: base fields `givenName`, `familyName`, `email`, `country`, `citizenship?`, `startDate?`, `title`, `department?` + `employmentServiceType`, `jobDescription`, `baseSalary`, `baseSalaryCurrency`, `agreementType`, `endDate?`, `visaSupportNeeded`, `tokenGrantRequested`, `signOnBonusAmount?`, `signOnBonusCurrency?`. **CONTRACTOR**: base fields + `contractorType`, `rateType`, `rateAmount`, `rateCurrency`, `agreementType`, `endDate?`. | `roleInOrgID: string`, `email: string`, `fullName: string` | `Authorization: Bearer <token>`; admin role required |
| `getHrisPerson` | POST | `src/server/operations/hris/getHrisPerson.ts` | `roleInOrgID: uuid` | single object with `id`, `fullName`, `email`, `type`, `status`, `title`, `department`, `location`, `startDate`, `roleInOrg`, `employeeInfo`, `contractorInfo`, `employeeRecord`, `contractorRecord` | `Authorization: Bearer <token>`; admin role required |
| `updateHrisPerson` | POST | `src/server/operations/hris/updateHrisPerson.ts` | `roleInOrgID: uuid`; optional `givenName`, `familyName`, `title`, `department`, `phoneNumber`, `managerEmail`; refined to require at least one update field | same shape as `getHrisPerson` (`id`, `fullName`, `email`, `type`, `status`, `title`, `department`, `location`, `startDate`, `roleInOrg`, `employeeInfo`, `contractorInfo`, `employeeRecord`, `contractorRecord`) | `Authorization: Bearer <token>`; admin role required |
| `getOnboardingProgress` | POST | `src/server/operations/hris/onboarding/getOnboardingProgress.ts` | `roleInOrgId?: uuid` | `roleInOrgId`, `countryCode`, `status`, `currentStepId`, `steps[]` (`stepId`, `status`, `stepData`, `completedAt`, `lastAccessedAt`), `completedStepCount`, `totalStepCount`, `onboardingStartedAt` | `Authorization: Bearer <token>`; self or admin access via `AuthorisedOperation` |
| `updateHrisEmployeeProfile` | PUT | `src/server/operations/hris/updateHrisEmployeeProfile.ts` | `roleInOrgID: uuid`; optional `title`, `department`, `managerName`, `managerEmail`, `phoneNumber` | `success: boolean`, `updatedFields: string[]`, `changeRequestId?: string` | `Authorization: Bearer <token>`; admin role required in handler (`CLIENT_ORG_ADMIN` or `TOKU_ADMIN`) |

## Payslips
| Operation Key | Method | File | Input Fields | Output Fields | Headers |
|---|---|---|---|---|---|
| `createHrisPayslipFileUpload` | POST | `src/server/operations/hris/payslips.ts` | `roleInOrgID: uuid`, `fileName: string`, `fileMimeType: "application/pdf"`, `fileSizeInBytes: int<=20971520` | `fileID`, `fileName`, `fileMimeType`, `fileSizeInBytes`, `uploadUrl` | `Authorization: Bearer <token>`; admin role required |
| `createHrisPayslip` | POST | `src/server/operations/hris/payslips.ts` | `roleInOrgID: uuid`, `fileID: uuid`, `currencyID: uuid`, `payslipDate: Date`, `grossAmount: string\|number\|Decimal`, `netAmount: string\|number\|Decimal` | `hrisPayslipID: string` | `Authorization: Bearer <token>`; admin role required |
| `getHrisPayslipsForOrg` | POST | `src/server/operations/hris/payslips.ts` | `search?: string`, `periodKey?: YYYY-MM`, `department?: string`, `limit?: 1..200 (default 10)`, `offset?: >=0 (default 0)` | `totalCount`; `payslips[]` items: `hrisPayslipID`, `roleInOrgID`, `payslipDate`, `payPeriodLabel`, `grossAmount`, `deductionsAmount`, `netAmount`, `status`, `createdAt`, `employee`, `currency`, `file`; `dashboardSummary.monthLabel`, `dashboardSummary.totalsByCurrency[]`, `dashboardSummary.employeesPaidCount`, `dashboardSummary.pendingCount` | `Authorization: Bearer <token>`; admin role required |
| `getHrisPayslipsForEmployee` | POST | `src/server/operations/hris/payslips.ts` | `roleInOrgID: uuid` | array items: `hrisPayslipID`, `roleInOrgID`, `payslipDate`, `grossAmount`, `netAmount`, `createdAt`, `currency`, `file`, `createdBy` | `Authorization: Bearer <token>`; admin role required |
| `getHrisPayslipDownloadUrl` | POST | `src/server/operations/hris/payslips.ts` | `hrisPayslipID: uuid` | `hrisPayslipID`, `fileID`, `fileName`, `mimeType`, `downloadUrl` | `Authorization: Bearer <token>`; user or admin role accepted in handler |

## Webhooks
### Endpoint Management Operations
| Operation Key | Method | File | Input Fields | Output Fields | Headers |
|---|---|---|---|---|---|
| `listWebhookEndpoints` | GET | `src/server/operations/webhooks/listWebhookEndpoints.ts` | none (`{}`) | `endpoints[]` items: `id`, `url`, `events`, `isActive`, `createdAt` | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |
| `listWebhookDeliveries` | GET | `src/server/operations/webhooks/listWebhookDeliveries.ts` | `endpointId: uuid` | `deliveries[]` items: `id`, `eventType`, `status`, `httpStatus`, `attempts`, `lastAttemptAt`, `createdAt` | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |
| `createWebhookEndpoint` | POST | `src/server/operations/webhooks/createWebhookEndpoint.ts` | `url: valid URL`, `events: WebhookEventType[]` (min 1) | `endpoint.id`, `endpoint.url`, `endpoint.events`, `endpoint.isActive`, `endpoint.createdAt`, `endpoint.signingSecret` | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |
| `deleteWebhookEndpoint` | DELETE | `src/server/operations/webhooks/deleteWebhookEndpoint.ts` | `id: uuid` | `success: true` | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |

### Webhook Event Types (from `src/server/services/webhooks/event-types.ts`)
- `grant.created`
- `grant.terminated`
- `grant.termination_reverted`
- `distribution.schedule_approved`
- `distribution.settlement_completed`
- `employee.onboarded`
- `employee.offboarded`
- `payroll_run.created`
- `payroll_run.approved`
- `payroll_run.completed`
- `payslip.generated`
- `payment.initiated`
- `payment.completed`
- `contractor.invoice_submitted`
- `time_off.requested`
- `time_off.status_changed`

## Stablecoin Funding
| Operation Key | Method | File | Input Fields | Output Fields | Headers |
|---|---|---|---|---|---|
| `getAllTokenPayrolls` | GET | `src/server/operations/token-payroll/getAllTokenPayrolls.ts` | `payrollEntityId?: string` (typed only) | `payrolls: TransformedTokenPayroll[]`; each item includes `id`, `name`, `subName?`, `entity`, `payPeriodStart`, `payPeriodEnd`, `payDate`, `currentStep`, `state`, `type`, `isStablecoinOnlySettlement`, `externalPayrollID`, `fiatCurrency`, `tokenTypeID`, `exchangeRate`, `isStablecoinPayrollComplete`, `isFiatPayrollComplete`, `isSyncedFromHRIS`, `selectedEmployeeIds`, `importedData`, `processedData`, `settlementData`, `isCsvUploaded`, `createdAt`, `updatedAt`, `isPlaceholder`, `createdByID`, `lastModifiedByID`, `orgID`, `payrollSyncedSource`, `payrollGroup`, `integrationEntityName?`, `payrollIntegrationEntityId?`, `fireblocksConfig?`, `contributorsInTokenPayroll[]`, `payrollEntity?` | `Authorization: Bearer <token>`; finance-admin compatible role (`FINANCE_ADMIN`/`CLIENT_ORG_ADMIN`/`TOKU_ADMIN`) |
| `createTokenPayroll` | POST | `src/server/operations/token-payroll/createTokenPayroll.ts` | `payPeriodStart: Date`, `payPeriodEnd: Date`, `payDate: Date`, `fiatCurrency: TaxCurrencyCode`, `payrollEntityId: string`, `externalPayrollID?: string`, `type?: PayrollType`, `state?: TgaPayrollState` | `tokenPayroll.tokenPayrollID`, `tokenPayroll.orgID`, `tokenPayroll.payPeriodStart`, `tokenPayroll.payPeriodEnd`, `tokenPayroll.payDate`, `tokenPayroll.externalPayrollID`, `tokenPayroll.fiatCurrency`, `tokenPayroll.payrollEntityId`, `tokenPayroll.state`, `tokenPayroll.type`, `tokenPayroll.createdAt`, `tokenPayroll.updatedAt`, `tokenPayroll.payrollEntity?` (`payrollEntityID`, `name`, `reportingCurrency`, `country`) | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |
| `getTokenPayrollByID` | POST | `src/server/operations/stableCoinPayroll/getTokenPayrollByID.ts` | `tokenPayrollID: string`, `payrollTypes?: PayrollType[]` | `TokenPayroll` object: `tokenPayrollID`, `name`, `payPeriodStart`, `payPeriodEnd`, `payDate`, `fiatCurrency`, `state`, `type`, `isStablecoinOnlySettlement`, `payrollSyncedSource?`, `token`, `contributorsInPayroll[]`, `settlementMethod`, `fundingEmailSent`, `adpDeductionsVerified`, `payrollIntegrationEntityId?`, plus `resolvedFireblocksConfig?` (`configSource`, `vaultAccountId`, `entityName`) | `Authorization: Bearer <token>`; finance-admin compatible role |
| `updateTokenPayrollState` | POST | `src/server/operations/token-payroll/updateTokenPayrollState.ts` | `tokenPayrollId: string`, `state: TgaPayrollState` | `tokenPayroll.tokenPayrollID`, `orgID`, `payPeriodStart`, `payPeriodEnd`, `payDate`, `externalPayrollID`, `fiatCurrency`, `payrollEntityId`, `state`, `type`, `createdAt`, `updatedAt` | `Authorization: Bearer <token>`; finance-admin compatible role |
| `computePendingSettlements` | POST | `src/server/operations/token-payroll/computePendingSettlements.ts` | `payrollID: uuid` | `success`, `message`, `pendingSettlements[]` items: `roleInOrgID`, `contributorInTokenPayrollID`, `settlementOrderForContributorTokenPayrollID?`, `walletAddress`, `tokenID`, `tokenAmount`, `fiatAmount`, `fiatCurrency`, `exchangeRate`, `exchangeRateDate?`, `inprogress`, `approvedAt?`; `totalSettlements`, `totalFiatAmount` | `Authorization: Bearer <token>`; admin role required |
| `approveTokenPayrollSettlements` | POST | `src/server/operations/token-payroll/approveTokenPayrollSettlements.ts` | `tokenPayrollID: string`, `walletReferenceIDs: string[]`, `pendingSettlements?: PendingSettlementRecord[]` where record fields match settlement fields returned by `computePendingSettlements` | `success: boolean`, `message: string`, `approvedCount: number` | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |
| `getTokenPayrollBreakdown` | POST | `src/server/operations/token-payroll/getTokenPayrollBreakdown.ts` | `roleInOrgID: string`, `netPay: number` | `tokenDistributions: any[]`, `tokenAmounts: any[]`, `totalTokenPercentage: number`, `netFiatPay: number` | `Authorization: Bearer <token>`; role-backed request context (`AuthorisedOperation`) |

## Out of Scope (documented for reference only)
- Reporting: `generateHrisReport`, `getPayrollReporting`
- Contractors: `inviteContractor`, `listContractorsUnified`, `listContractorInvoices`, `reviewInvoice`
- Employee Self-Service / Leave-Time Off: `createTimeOff`, `getEmployeeTimeOffs`, `getEmployeeLeaveBalance`, `updateTimeOffStatus`, `getEmployeeTimeOffPolicy`, `getOrgTimeOffs`
- Employee Management / directory-style partner endpoints outside requested 6 domains: `listOrgEmployees`, `getOrgPayrollOverview`

## Notes
- `external-api-injectors.ts` was treated as the only authority for operation inclusion.
- Several operations inherit `parseRequest` from `AuthorisedOperation`/`AdminOperation`/`FinanceAdminOperation`, so those inputs are typed in-file but not zod-validated there.
- `x-role-type` is explicitly documented in `src/server/openapi.ts` for existing external endpoints; all entries above also require authenticated request context, i.e. bearer-backed authorization/session credentials.
