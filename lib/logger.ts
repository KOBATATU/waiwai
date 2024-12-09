import pino from "pino"

import { formatUTCToLocalString } from "./utils"

const logger = pino({
  level: "info",
  timestamp: () => {
    return `,"time":"${formatUTCToLocalString(new Date())}"`
  },
  formatters: {
    level: (label: string) => {
      return {
        level: label,
      }
    },
  },
  browser: {
    asObject: false,
  },
})

export default logger
