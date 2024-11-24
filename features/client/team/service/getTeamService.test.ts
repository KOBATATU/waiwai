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
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { cleanupDatabase } from "@/lib/testutils"

import { getTeamClientService } from "./getTeamService"

const competitionDefault = {
  ...createCompetitionDefaultValue,
  id: "test-id",
  title: "title",
  subtitle: "subtitle",
  open: true,
}
describe("getTeamClientService getTeamByUserIdAndCompetitionId test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
    await prisma.competition.create({
      data: competitionDefault,
    })
    vi.setSystemTime(new Date(competitionDefault.startDate.getTime() + 1))
  })
  afterEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()
  })
  test.each([[null]])(
    "access user doesn't have permission: %s",
    async (user) => {
      const mockNotFound = vi.mocked(notFound)

      await getTeamClientService.getTeamByUserIdAndCompetitionId(
        competitionDefault.id
      )
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("get getTeamByUserIdAndCompetitionId success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const prisma = getPrisma()
    const team = await prisma.competitionTeam.create({
      data: {
        name: "test",
        competitionId: competitionDefault.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: mockUser1.user.id,
      },
    })
    const result = await getTeamClientService.getTeamByUserIdAndCompetitionId(
      competitionDefault.id
    )

    expect(result.id).toBe(team.id)
  })

  test("get getTeamByUserIdAndCompetitionId team not found", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)

    const mockNotFound = vi.mocked(notFound)

    await getTeamClientService.getTeamByUserIdAndCompetitionId(
      competitionDefault.id
    )
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })
})

describe("getTeamClientService getTeamSubmissionsByTeamId test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
    await prisma.competition.create({
      data: competitionDefault,
    })
    vi.setSystemTime(new Date(competitionDefault.startDate.getTime() + 1))
  })
  afterEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()
  })
  test.each([[null]])(
    "access user doesn't have permission: %s",
    async (user) => {
      const mockNotFound = vi.mocked(notFound)

      await getTeamClientService.getTeamSubmissionsByTeamId(
        competitionDefault.id,
        1
      )
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    }
  )

  test("get getTeamSubmissionsByTeamId success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.endDate.getTime() + 1))
    const prisma = getPrisma()
    const team = await prisma.competitionTeam.create({
      data: {
        name: "test",
        competitionId: competitionDefault.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: mockUser1.user.id,
      },
    })
    const teamSubmission = await prisma.teamSubmission.create({
      data: {
        status: EnumTeamSubmissionStatus.success,
        teamId: team.id,
        userId: mockUser1.user.id,
        publicScore: 10,
        privateScore: 10,
      },
    })
    const result = await getTeamClientService.getTeamSubmissionsByTeamId(
      competitionDefault.id,
      1
    )

    expect(result[0][0].id).toBe(teamSubmission.id)
    expect(result[0][0].privateScore).toBe(teamSubmission.privateScore)
    expect(result[1].totalCount).toBe(1)
  })

  test("get getTeamSubmissionsByTeamId  competition not end", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.endDate.getTime() - 1))
    const prisma = getPrisma()
    const team = await prisma.competitionTeam.create({
      data: {
        name: "test",
        competitionId: competitionDefault.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: mockUser1.user.id,
      },
    })
    const teamSubmission = await prisma.teamSubmission.create({
      data: {
        status: EnumTeamSubmissionStatus.success,
        teamId: team.id,
        userId: mockUser1.user.id,
        publicScore: 10,
        privateScore: 10,
      },
    })
    const result = await getTeamClientService.getTeamSubmissionsByTeamId(
      competitionDefault.id,
      1
    )

    expect(result[0][0].id).toBe(teamSubmission.id)
    expect(result[0][0].privateScore).toBe(undefined)
    expect(result[1].totalCount).toBe(1)
  })

  test("get getTeamByUserIdAndCompetitionId team not found", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const mockNotFound = vi.mocked(notFound)

    await getTeamClientService.getTeamSubmissionsByTeamId(
      competitionDefault.id,
      1
    )
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })
})

describe("getTeamClientService getTeamPublicScoresByCompetitionId test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
    await prisma.user.create({ data: mockUser2.user })

    vi.setSystemTime(new Date(competitionDefault.startDate.getTime() + 1))
  })
  afterEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()
  })

  test("get getTeamPublicScoresByCompetitionId min order evaluation success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const prisma = getPrisma()
    await prisma.competition.create({
      data: competitionDefault,
    })
    await prisma.competitionTeam.create({
      data: {
        id: "teamid1",
        name: "test",
        competitionId: competitionDefault.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
      },
    })
    await prisma.competitionTeam.create({
      data: {
        id: "teamid2",
        name: "test",
        competitionId: competitionDefault.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid2",
        userId: mockUser2.user.id,
      },
    })

    for (let i = 0; i < 2; i++) {
      await prisma.teamSubmission.create({
        data: {
          teamId: "teamid1",
          userId: mockUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: i + 1,
          privateScore: i + 1,
        },
      })
    }
    for (let i = 0; i < 2; i++) {
      await prisma.teamSubmission.create({
        data: {
          teamId: "teamid2",
          userId: mockUser2.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: i + 2,
          privateScore: i + 2,
        },
      })
    }

    const result =
      await getTeamClientService.getTeamPublicScoresByCompetitionId(
        competitionDefault.id
      )
    expect(result.data.length).toBe(2)
    expect(result.data[0].public_best_score).toBe(1)
    expect(result.data[0].private_best_score).toBe(undefined)
    expect(result.data[0].private_rank).toBe(undefined)
    expect(result.data[0].team_id).toBe("teamid1")
    expect(result.data[0].public_rank).toBe(1)
    expect(result.data[0].cnt_team_submissions).toBe(2)
    expect(result.data[1].public_best_score).toBe(2)
    expect(result.data[1].private_best_score).toBe(undefined)
    expect(result.data[1].private_rank).toBe(undefined)
    expect(result.data[1].public_rank).toBe(2)
    expect(result.data[1].cnt_team_submissions).toBe(2)
  })

  test("get getTeamPublicScoresByCompetitionId max order evaluation success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    const prisma = getPrisma()
    await prisma.competition.create({
      data: {
        ...competitionDefault,
        evaluationFunc: EvaluationFuncEnum.classification.f1.value,
        problem: ProblemEnum.classification,
      },
    })
    await prisma.competitionTeam.create({
      data: {
        id: "teamid1",
        name: "test",
        competitionId: competitionDefault.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
      },
    })
    await prisma.competitionTeam.create({
      data: {
        id: "teamid2",
        name: "test",
        competitionId: competitionDefault.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid2",
        userId: mockUser2.user.id,
      },
    })

    for (let i = 0; i < 2; i++) {
      await prisma.teamSubmission.create({
        data: {
          teamId: "teamid1",
          userId: mockUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: i + 1,
          privateScore: i + 1,
        },
      })
    }
    for (let i = 0; i < 2; i++) {
      await prisma.teamSubmission.create({
        data: {
          teamId: "teamid2",
          userId: mockUser2.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: i + 2,
          privateScore: i + 2,
        },
      })
    }

    const result =
      await getTeamClientService.getTeamPublicScoresByCompetitionId(
        competitionDefault.id
      )
    expect(result.data.length).toBe(2)
    expect(result.data[0].public_best_score).toBe(3)
    expect(result.data[0].private_best_score).toBe(undefined)
    expect(result.data[0].private_rank).toBe(undefined)
    expect(result.data[0].team_id).toBe("teamid2")
    expect(result.data[0].public_rank).toBe(1)
    expect(result.data[0].cnt_team_submissions).toBe(2)
    expect(result.data[1].public_best_score).toBe(2)
    expect(result.data[1].private_best_score).toBe(undefined)
    expect(result.data[1].private_rank).toBe(undefined)
    expect(result.data[1].public_rank).toBe(2)
    expect(result.data[1].cnt_team_submissions).toBe(2)
  })
})

describe("getTeamClientService getTeamPrivateScoresByCompetitionId test", () => {
  beforeEach(async () => {
    await cleanupDatabase()
    const prisma = getPrisma()
    await prisma.user.create({ data: mockAdminUser1.user })
    await prisma.user.create({ data: mockUser1.user })
    await prisma.user.create({ data: mockUser2.user })

    vi.setSystemTime(new Date(competitionDefault.startDate.getTime() + 1))
  })
  afterEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()
  })

  test("get getTeamPrivateScoresByCompetitionId max order evaluation success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.endDate.getTime() + 1))

    const prisma = getPrisma()
    const competition = await prisma.competition.create({
      data: {
        ...competitionDefault,
        evaluationFunc: EvaluationFuncEnum.classification.f1.value,
        problem: ProblemEnum.classification,
        completed: true,
      },
    })
    await prisma.competitionTeam.create({
      data: {
        id: "teamid1",
        name: "test",
        competitionId: competition.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
      },
    })
    await prisma.competitionTeam.create({
      data: {
        id: "teamid2",
        name: "test",
        competitionId: competition.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid2",
        userId: mockUser2.user.id,
      },
    })

    for (let i = 0; i < 2; i++) {
      await prisma.teamSubmission.create({
        data: {
          teamId: "teamid1",
          userId: mockUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: i + 1,
          privateScore: i + 1,
          selected: true,
        },
      })
    }
    await prisma.teamSubmission.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
        status: EnumTeamSubmissionStatus.success,
        publicScore: 10,
        privateScore: 10,
        selected: false,
      },
    })
    for (let i = 0; i < 2; i++) {
      await prisma.teamSubmission.create({
        data: {
          teamId: "teamid2",
          userId: mockUser2.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: i + 2,
          privateScore: i + 2,
          selected: true,
        },
      })
    }
    await prisma.teamSubmission.create({
      data: {
        teamId: "teamid2",
        userId: mockUser2.user.id,
        status: EnumTeamSubmissionStatus.success,
        publicScore: 11,
        privateScore: 11,
        selected: false,
      },
    })

    const result =
      await getTeamClientService.getTeamPrivateScoresByCompetitionId(
        competition.id
      )
    expect(result.data.length).toBe(2)

    expect(result.data[0].public_best_score).toBe(11)
    expect(result.data[0].private_best_score).toBe(3)
    expect(result.data[0].private_rank).toBe(1)
    expect(result.data[0].public_rank).toBe(1)
    expect(result.data[0].team_id).toBe("teamid2")
    expect(result.data[0].cnt_team_submissions).toBe(3)

    expect(result.data[1].public_best_score).toBe(10)
    expect(result.data[1].private_best_score).toBe(2)
    expect(result.data[1].private_rank).toBe(2)
    expect(result.data[1].public_rank).toBe(2)
    expect(result.data[1].team_id).toBe("teamid1")
    expect(result.data[1].cnt_team_submissions).toBe(3)
  })

  test("get getTeamPrivateScoresByCompetitionId min order evaluation success", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.endDate.getTime() + 1))

    const prisma = getPrisma()
    const competition = await prisma.competition.create({
      data: {
        ...competitionDefault,
        completed: true,
      },
    })
    await prisma.competitionTeam.create({
      data: {
        id: "teamid1",
        name: "test",
        competitionId: competition.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
      },
    })
    await prisma.competitionTeam.create({
      data: {
        id: "teamid2",
        name: "test",
        competitionId: competition.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid2",
        userId: mockUser2.user.id,
      },
    })

    for (let i = 0; i < 2; i++) {
      await prisma.teamSubmission.create({
        data: {
          teamId: "teamid1",
          userId: mockUser1.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: i + 1,
          privateScore: i + 1,
          selected: true,
        },
      })
    }
    await prisma.teamSubmission.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
        status: EnumTeamSubmissionStatus.success,
        publicScore: -1,
        privateScore: -1,
        selected: false,
      },
    })
    for (let i = 0; i < 2; i++) {
      await prisma.teamSubmission.create({
        data: {
          teamId: "teamid2",
          userId: mockUser2.user.id,
          status: EnumTeamSubmissionStatus.success,
          publicScore: i + 2,
          privateScore: i + 2,
          selected: true,
        },
      })
    }
    await prisma.teamSubmission.create({
      data: {
        teamId: "teamid2",
        userId: mockUser2.user.id,
        status: EnumTeamSubmissionStatus.success,
        publicScore: -2,
        privateScore: -2,
        selected: false,
      },
    })

    const result =
      await getTeamClientService.getTeamPrivateScoresByCompetitionId(
        competition.id
      )
    expect(result.data.length).toBe(2)

    expect(result.data[0].public_best_score).toBe(-1)
    expect(result.data[0].private_best_score).toBe(1)
    expect(result.data[0].private_rank).toBe(1)
    expect(result.data[0].public_rank).toBe(2)
    expect(result.data[0].team_id).toBe("teamid1")
    expect(result.data[0].cnt_team_submissions).toBe(3)

    expect(result.data[1].public_best_score).toBe(-2)
    expect(result.data[1].private_best_score).toBe(2)
    expect(result.data[1].private_rank).toBe(2)
    expect(result.data[1].public_rank).toBe(1)
    expect(result.data[1].team_id).toBe("teamid2")
    expect(result.data[1].cnt_team_submissions).toBe(3)
  })

  test("get getTeamPrivateScoresByCompetitionId competition not end ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.endDate.getTime() - 1))

    const prisma = getPrisma()
    const competition = await prisma.competition.create({
      data: {
        ...competitionDefault,
        completed: true,
      },
    })

    await prisma.competitionTeam.create({
      data: {
        id: "teamid1",
        name: "test",
        competitionId: competition.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
      },
    })
    await prisma.teamSubmission.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
        status: EnumTeamSubmissionStatus.success,
        publicScore: 1,
        privateScore: 1,
        selected: false,
      },
    })

    const result =
      await getTeamClientService.getTeamPrivateScoresByCompetitionId(
        competition.id
      )
    expect(result.data.length).toBe(0)
  })

  test("get getTeamPrivateScoresByCompetitionId competition not completed ", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUser1)
    vi.setSystemTime(new Date(competitionDefault.endDate.getTime() + 1))

    const prisma = getPrisma()
    const competition = await prisma.competition.create({
      data: {
        ...competitionDefault,
        completed: false,
      },
    })

    await prisma.competitionTeam.create({
      data: {
        id: "teamid1",
        name: "test",
        competitionId: competition.id,
      },
    })
    await prisma.teamMember.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
      },
    })
    await prisma.teamSubmission.create({
      data: {
        teamId: "teamid1",
        userId: mockUser1.user.id,
        status: EnumTeamSubmissionStatus.success,
        publicScore: 1,
        privateScore: 1,
        selected: false,
      },
    })

    const result =
      await getTeamClientService.getTeamPrivateScoresByCompetitionId(
        competition.id
      )
    expect(result.data.length).toBe(0)
  })
})
