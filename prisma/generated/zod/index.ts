import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','password','image','role','createdAt','updatedAt']);

export const VerificationRequestScalarFieldEnumSchema = z.enum(['id','identifier','token','expires','createdAt','updatedAt']);

export const CompetitionScalarFieldEnumSchema = z.enum(['id','title','subtitle','description','dataDescription','thumbnail','startDate','endDate','open','evaluationFunc','problem','limitSubmissionNum','createdAt','updatedAt']);

export const CompetitionDataScalarFieldEnumSchema = z.enum(['id','competitionId','dataPath','createdAt','updatedAt']);

export const CompetitionParticipateScalarFieldEnumSchema = z.enum(['id','competitionId','userId','createdAt','updatedAt']);

export const CompetitionTeamScalarFieldEnumSchema = z.enum(['id','competitionId','name','resultPublicOrder','resultPrivateOrder','createdAt','updatedAt']);

export const TeamMemberScalarFieldEnumSchema = z.enum(['id','teamId','userId','createdAt','updatedAt']);

export const TeamSubmissionScalarFieldEnumSchema = z.enum(['id','teamId','userId','publicScore','privateScore','sourceFile','status','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullish(),
  access_token: z.string().nullish(),
  expires_at: z.number().nullish(),
  token_type: z.string().nullish(),
  scope: z.string().nullish(),
  id_token: z.string().nullish(),
  session_state: z.string().nullish(),
})

export type Account = z.infer<typeof AccountSchema>

// ACCOUNT OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const AccountOptionalDefaultsSchema = AccountSchema.merge(z.object({
  id: z.string().optional(),
}))

export type AccountOptionalDefaults = z.infer<typeof AccountOptionalDefaultsSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
})

export type Session = z.infer<typeof SessionSchema>

// SESSION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const SessionOptionalDefaultsSchema = SessionSchema.merge(z.object({
  id: z.string().optional(),
}))

export type SessionOptionalDefaults = z.infer<typeof SessionOptionalDefaultsSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  password: z.string().nullish(),
  image: z.string().nullish(),
  role: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

// USER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// VERIFICATION REQUEST SCHEMA
/////////////////////////////////////////

export const VerificationRequestSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type VerificationRequest = z.infer<typeof VerificationRequestSchema>

// VERIFICATION REQUEST OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const VerificationRequestOptionalDefaultsSchema = VerificationRequestSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type VerificationRequestOptionalDefaults = z.infer<typeof VerificationRequestOptionalDefaultsSchema>

/////////////////////////////////////////
// COMPETITION SCHEMA
/////////////////////////////////////////

export const CompetitionSchema = z.object({
  id: z.string(),
  title: z.string({ required_error: "required" }).max(100, { message: "Please enter less than 100 characters" }),
  subtitle: z.string({ required_error: "required" }).max(500, { message: "Please enter less than 500 characters" }),
  description: z.string({ required_error: "required" }),
  dataDescription: z.string({ required_error: "required" }),
  thumbnail: z.string().nullish(),
  startDate: z.date({ required_error: "required" }),
  endDate: z.date({ required_error: "required" }),
  open: z.boolean(),
  evaluationFunc: z.string({ required_error: "required" }).max(20, { message: "Please enter less than 20 characters" }),
  problem: z.string({ required_error: "required" }).max(20, { message: "Please enter less than 20 characters" }),
  limitSubmissionNum: z.number({ required_error: "required" }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Competition = z.infer<typeof CompetitionSchema>

// COMPETITION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CompetitionOptionalDefaultsSchema = CompetitionSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type CompetitionOptionalDefaults = z.infer<typeof CompetitionOptionalDefaultsSchema>

/////////////////////////////////////////
// COMPETITION DATA SCHEMA
/////////////////////////////////////////

export const CompetitionDataSchema = z.object({
  id: z.string(),
  competitionId: z.string({ required_error: "required" }),
  dataPath: z.string({ required_error: "required" }).max(255, { message: "Please enter less than 255 characters" }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CompetitionData = z.infer<typeof CompetitionDataSchema>

// COMPETITION DATA OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CompetitionDataOptionalDefaultsSchema = CompetitionDataSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type CompetitionDataOptionalDefaults = z.infer<typeof CompetitionDataOptionalDefaultsSchema>

/////////////////////////////////////////
// COMPETITION PARTICIPATE SCHEMA
/////////////////////////////////////////

export const CompetitionParticipateSchema = z.object({
  id: z.string(),
  competitionId: z.string({ required_error: "required" }),
  userId: z.string({ required_error: "required" }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CompetitionParticipate = z.infer<typeof CompetitionParticipateSchema>

// COMPETITION PARTICIPATE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CompetitionParticipateOptionalDefaultsSchema = CompetitionParticipateSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type CompetitionParticipateOptionalDefaults = z.infer<typeof CompetitionParticipateOptionalDefaultsSchema>

/////////////////////////////////////////
// COMPETITION TEAM SCHEMA
/////////////////////////////////////////

export const CompetitionTeamSchema = z.object({
  id: z.string(),
  competitionId: z.string({ required_error: "required" }),
  name: z.string({ required_error: "required" }).max(255, { message: "Please enter less than 255 characters" }),
  resultPublicOrder: z.number().nullish(),
  resultPrivateOrder: z.number().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CompetitionTeam = z.infer<typeof CompetitionTeamSchema>

// COMPETITION TEAM OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CompetitionTeamOptionalDefaultsSchema = CompetitionTeamSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type CompetitionTeamOptionalDefaults = z.infer<typeof CompetitionTeamOptionalDefaultsSchema>

/////////////////////////////////////////
// TEAM MEMBER SCHEMA
/////////////////////////////////////////

export const TeamMemberSchema = z.object({
  id: z.string(),
  teamId: z.string({ required_error: "required" }),
  userId: z.string({ required_error: "required" }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type TeamMember = z.infer<typeof TeamMemberSchema>

// TEAM MEMBER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const TeamMemberOptionalDefaultsSchema = TeamMemberSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type TeamMemberOptionalDefaults = z.infer<typeof TeamMemberOptionalDefaultsSchema>

/////////////////////////////////////////
// TEAM SUBMISSION SCHEMA
/////////////////////////////////////////

export const TeamSubmissionSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  userId: z.string({ required_error: "required" }),
  publicScore: z.number().nullish(),
  privateScore: z.number().nullish(),
  sourceFile: z.string().nullish(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type TeamSubmission = z.infer<typeof TeamSubmissionSchema>

// TEAM SUBMISSION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const TeamSubmissionOptionalDefaultsSchema = TeamSubmissionSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}))

export type TeamSubmissionOptionalDefaults = z.infer<typeof TeamSubmissionOptionalDefaultsSchema>
