interface ExceptionArgs {
  fieldsError: Record<string, string[]>
  message: string
  code: string
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
  competitionNotFound: {
    code: "4000",
    message: "not found competition",
  },
} as const
