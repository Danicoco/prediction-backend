/** @format */

import { Agenda } from "@hokify/agenda"
import { agendaIdentifier } from "../queue/identifiers"
import { IPrediction } from "../../../types"
import MatchService from "../../v1/matches/service"
import { catchError } from "../utils"
import FootballData from "../../thirdpartyApi/football"
import PredictionService from "../../v1/predictions/service"
import { calculatePredictionPoint } from "../../v1/predictions/helper"
import { addMinutes } from "date-fns"

export const processPrediction = (agenda: Agenda) => {
    agenda.define(agendaIdentifier.CALCULATE_PREDICTION, async (job, done) => {
        const prediction = job.attrs.data.prediction as IPrediction

        const match = await new MatchService({
            _id: prediction.match,
        }).findOne()
        if (!match) throw catchError("Match does not exists", 400)

        if (!match.homeTeam.score && !match.awayTeam.score) {
            const result = await new FootballData().getMatch(match.matchId)
            if (!result) throw catchError("Match not found", 400)
            if (result.status === "FINISHED") {
                const homeScore = result.score.fullTime.home
                const awayScore = result.score.fullTime.away
                const point = calculatePredictionPoint(
                    homeScore,
                    awayScore,
                    prediction.homeTeamScore,
                    prediction.awayTeamScore
                )
                await new MatchService({ _id: match._id }).update({
                    homeTeam: { ...match.homeTeam, score: homeScore },
                    awayTeam: { ...match.awayTeam, score: awayScore },
                })
                await new PredictionService({ _id: prediction._id }).update({
                    point,
                })
            } else {
                job.schedule(addMinutes(new Date(), 5))
            }
        } else {
            const homeScore = match.homeTeam.score || 0
            const awayScore = match.awayTeam.score || 0
            const point = calculatePredictionPoint(
                homeScore,
                awayScore,
                prediction.homeTeamScore,
                prediction.awayTeamScore
            )
            await new PredictionService({ _id: prediction._id }).update({
                point,
            })
        }

        job.remove()
        done()
    })
}
