interface ExceptionArgs {
  fieldsError: Record<string, string[]>
  message: string
  code: string
}

export class BadException {
  timestamp: Date
  fieldsError: Record<string, string[]>
  message: string
  code: string

  constructor({ fieldsError, message, code }: ExceptionArgs) {
    this.timestamp = new Date()
    this.fieldsError = fieldsError
    this.code = code
    this.message = `${code}: ${message}`
  }
}

export class NotFoundException {
  timestamp: Date
  fieldsError: Record<string, string[]>
  message: string
  code: string

  constructor({ fieldsError, message, code }: ExceptionArgs) {
    this.timestamp = new Date()
    this.fieldsError = fieldsError
    this.code = code
    this.message = `${code}: ${message}`
  }
}

export const ExceptionEnum = {
  userRoleBad: {
    code: "B4000",
    message: "have not permission",
  },
  userAuthBad: {
    code: "B4001",
    message: "have not permission or bad auth",
  },
  competitionDataUploadBad: {
    code: "B4002",
    message: "upload type bad",
  },
  competitionParticipateBad: {
    code: "B4003",
    message: "you already participated competition bad",
  },
  userAlreadyRegisterd: {
    code: "B4004",
    message: "your email already registered",
  },
  teamSubmissionCountOver: {
    code: "B4005",
    message: "your submission count over",
  },
  competitionNotFound: {
    code: "N4000",
    message: "not found competition",
  },
  competitionDataNotFound: {
    code: "N4001",
    message: "not found competition data",
  },
  competitionParticipateNotFound: {
    code: "N4002",
    message: "not found competition participate",
  },
  competitionTeamNotFound: {
    code: "N4003",
    message: "not found competition team",
  },
  competitionTeamSubmissionNotFound: {
    code: "N4004",
    message: "not found team submission",
  },
} as const
