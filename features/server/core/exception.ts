export class BadException {
  timestamp: Date
  fieldsError: Record<string, string[]>
  message: string
  code: string

  constructor(exceptionEnum: keyof typeof ExceptionEnum, fields: string[]) {
    const _exceptionEnum = ExceptionEnum[exceptionEnum]
    this.timestamp = new Date()
    this.fieldsError = {}
    fields.forEach((field) => {
      this.fieldsError[field] = [_exceptionEnum.message]
    })
    this.code = _exceptionEnum.code
    this.message = `${_exceptionEnum.code}: ${_exceptionEnum.message}`
  }
}

export class NotFoundException {
  timestamp: Date
  fieldsError: Record<string, string[]>
  message: string
  code: string

  constructor(exceptionEnum: keyof typeof ExceptionEnum, fields: string[]) {
    const _exceptionEnum = ExceptionEnum[exceptionEnum]
    this.timestamp = new Date()
    this.fieldsError = {}
    fields.forEach((field) => {
      this.fieldsError[field] = [_exceptionEnum.message]
    })
    this.code = _exceptionEnum.code
    this.message = `${_exceptionEnum.code}: ${_exceptionEnum.message}`
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
  competitionEnd: {
    code: "B4006",
    message: "competition not open or end",
  },
  evaluateApiFailed: {
    code: "B4007",
    message: "waiwai evaluate api failed",
  },
  competitionNotStart: {
    code: "B4008",
    message: "competition not started",
  },
  teamSubmitLimit: {
    code: "B4009",
    message:
      "team cann't submit file because of competition limit submission num",
  },
  teamSubmitMustSuccessStatus: {
    code: "B4010",
    message: "submit record status must success",
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
