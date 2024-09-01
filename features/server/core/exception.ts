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
  competitionNotFound: {
    code: "N4000",
    message: "not found competition",
  },
} as const
