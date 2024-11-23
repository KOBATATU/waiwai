import { notFound } from "next/navigation"
import { getPrisma } from "@/features/server/core/prisma"
import {
  EvaluationFuncEnum,
  ProblemEnum,
} from "@/features/server/domain/competition/competition"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import { EnumTeamSubmissionStatus } from "@/features/server/domain/team/team"
import {
  mockAdminUser1,
  mockUser1,
  mockUser2,
} from "@/features/server/domain/user/__mock__/user.mock"
import { getServerSession } from "next-auth"
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { updateCompetitionCompleteAction } from "./updateCompetitionCompleteAction"

const competitionDefault = {
  ...createCompetitionDefaultValue,
  title: "title",
  subtitle: "subtitle",
  open: true,
}
describe("updateCompetitionCompleteAction test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
    await prisma.user.create({ data: mockUser2.user })
    vi.resetAllMocks()
    vi.setSystemTime(new Date(competitionDefault.startDate.getTime() + 1))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  test.each([[mockUser1], [null]])(
    "access user doesn't have permission: %s",
    async (user) => {
      vi.mocked(getServerSession).mockResolvedValue(user)
      const mockNotFound = vi.mocked(notFound)

      const form = new FormData()
      form.append("id", "test")

      await updateCompetitionCompleteAction(undefined, form)
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )
  test.each([
    [
      { selected: false, expect: true },
      { selected: false, expect: true },
      { selected: false, expect: false },
    ],
    [
      { selected: false, expect: true },
      { selected: false, expect: false },
      { selected: true, expect: true },
    ],
    [
      { selected: false, expect: false },
      { selected: true, expect: true },
      { selected: true, expect: true },
    ],
  ])(
    "updateCompetitionCompleteAction min evaluation(rmse) test: %s, %s, %s",
    async (selected1, selected2, selected3) => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

      const prisma = getPrisma()
      const competition = await prisma.competition.create({
        data: competitionDefault,
      })
      const adminTeam1 = await prisma.competitionTeam.create({
        data: {
          name: "test",
          competitionId: competition.id,
        },
      })
      await prisma.teamMember.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
        },
      })
      const teamSubmission1 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.7,
          privateScore: 0.7,
          selected: selected1.selected,
        },
      })
      const teamSubmission2 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.8,
          privateScore: 0.8,
          selected: selected2.selected,
        },
      })
      const teamSubmission3 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.9,
          privateScore: 0.9,
          selected: selected3.selected,
        },
      })

      const form = new FormData()
      form.append("id", competition.id)

      await updateCompetitionCompleteAction(undefined, form)
      const resultTeamSubmission1 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission1.id,
        },
      })
      const resultTeamSubmission2 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission2.id,
        },
      })
      const resultTeamSubmission3 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission3.id,
        },
      })
      expect(resultTeamSubmission1?.selected).toBe(selected1.expect)
      expect(resultTeamSubmission2?.selected).toBe(selected2.expect)
      expect(resultTeamSubmission3?.selected).toBe(selected3.expect)
    }
  )

  test.each([
    [
      "min",
      { selected: true, expect: true },
      { selected: false, expect: false },
    ],
    [
      "min",
      { selected: false, expect: true },
      { selected: false, expect: false },
    ],
    [
      "max",
      { selected: true, expect: true },
      { selected: false, expect: false },
    ],
    [
      "max",
      { selected: false, expect: true },
      { selected: false, expect: false },
    ],
  ])(
    "updateCompetitionCompleteAction %s evaluation one error one success test: %s, %s",
    async (order, selected1, selected2) => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

      const prisma = getPrisma()
      const evaluation =
        order === "min"
          ? {
              evaluationFunc: EvaluationFuncEnum.regression.rmse.value,
              problem: ProblemEnum.regression,
            }
          : {
              evaluationFunc: EvaluationFuncEnum.classification.f1.value,
              problem: ProblemEnum.classification,
            }

      const competition = await prisma.competition.create({
        data: {
          ...competitionDefault,
          ...evaluation,
        },
      })
      const adminTeam1 = await prisma.competitionTeam.create({
        data: {
          name: "test",
          competitionId: competition.id,
        },
      })
      await prisma.teamMember.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
        },
      })
      const teamSubmission1 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.7,
          privateScore: 0.7,
          selected: selected1.selected,
        },
      })
      const teamSubmission2 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.error,
          publicScore: 0.8,
          privateScore: 0.8,
          selected: selected2.selected,
        },
      })
      const form = new FormData()
      form.append("id", competition.id)

      await updateCompetitionCompleteAction(undefined, form)
      const resultTeamSubmission1 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission1.id,
        },
      })
      const resultTeamSubmission2 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission2.id,
        },
      })
      expect(resultTeamSubmission1?.selected).toBe(selected1.expect)
      expect(resultTeamSubmission2?.selected).toBe(selected2.expect)
    }
  )

  test.each([
    [
      { selected: false, expect: false },
      { selected: false, expect: true },
      { selected: false, expect: true },
    ],
    [
      { selected: true, expect: true },
      { selected: false, expect: false },
      { selected: false, expect: true },
    ],
    [
      { selected: true, expect: true },
      { selected: true, expect: true },
      { selected: false, expect: false },
    ],
  ])(
    "updateCompetitionCompleteAction max evaluation(f1) test: %s, %s, %s",
    async (selected1, selected2, selected3) => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

      const prisma = getPrisma()
      const competition = await prisma.competition.create({
        data: {
          ...competitionDefault,
          evaluationFunc: EvaluationFuncEnum.classification.f1.value,
          problem: ProblemEnum.classification,
        },
      })
      const adminTeam1 = await prisma.competitionTeam.create({
        data: {
          name: "test",
          competitionId: competition.id,
        },
      })
      await prisma.teamMember.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
        },
      })
      const teamSubmission1 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.7,
          privateScore: 0.7,
          selected: selected1.selected,
        },
      })
      const teamSubmission2 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.8,
          privateScore: 0.8,
          selected: selected2.selected,
        },
      })
      const teamSubmission3 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.9,
          privateScore: 0.9,
          selected: selected3.selected,
        },
      })

      const form = new FormData()
      form.append("id", competition.id)

      await updateCompetitionCompleteAction(undefined, form)
      const resultTeamSubmission1 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission1.id,
        },
      })
      const resultTeamSubmission2 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission2.id,
        },
      })
      const resultTeamSubmission3 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission3.id,
        },
      })
      expect(resultTeamSubmission1?.selected).toBe(selected1.expect)
      expect(resultTeamSubmission2?.selected).toBe(selected2.expect)
      expect(resultTeamSubmission3?.selected).toBe(selected3.expect)
    }
  )

  test.each([
    [
      "min",
      { selected: true, expect: true },
      { selected: false, expect: true },
      { selected: false, expect: false },
    ],
    [
      "max",
      { selected: true, expect: true },
      { selected: false, expect: true },
      { selected: false, expect: false },
    ],
  ])(
    "updateCompetitionCompleteAction %s evaluation same value test: %s, %s, %s",
    async (order, selected1, selected2, selected3) => {
      vi.mocked(getServerSession).mockResolvedValue(mockAdminUser1)

      const prisma = getPrisma()
      const evaluation =
        order === "min"
          ? {
              evaluationFunc: EvaluationFuncEnum.regression.rmse.value,
              problem: ProblemEnum.regression,
            }
          : {
              evaluationFunc: EvaluationFuncEnum.classification.f1.value,
              problem: ProblemEnum.classification,
            }

      const competition = await prisma.competition.create({
        data: {
          ...competitionDefault,
          ...evaluation,
        },
      })
      const adminTeam1 = await prisma.competitionTeam.create({
        data: {
          name: "test",
          competitionId: competition.id,
        },
      })
      await prisma.teamMember.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
        },
      })
      const teamSubmission1 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.7,
          privateScore: 0.7,
          selected: selected1.selected,
        },
      })
      const teamSubmission2 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.8,
          privateScore: 0.8,
          selected: selected2.selected,
        },
      })
      const teamSubmission3 = await prisma.teamSubmission.create({
        data: {
          teamId: adminTeam1.id,
          userId: mockAdminUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: 0.8,
          privateScore: 0.8,
          selected: selected3.selected,
        },
      })
      const form = new FormData()
      form.append("id", competition.id)

      await updateCompetitionCompleteAction(undefined, form)
      const resultTeamSubmission1 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission1.id,
        },
      })
      const resultTeamSubmission2 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission2.id,
        },
      })
      const resultTeamSubmission3 = await prisma.teamSubmission.findUnique({
        where: {
          id: teamSubmission3.id,
        },
      })
      expect(resultTeamSubmission1?.selected).toBe(selected1.expect)
      expect(resultTeamSubmission2?.selected).toBe(selected2.expect)
      expect(resultTeamSubmission3?.selected).toBe(selected3.expect)
    }
  )
})
