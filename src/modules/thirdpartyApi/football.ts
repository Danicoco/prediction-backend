/** @format */

import axios from "axios"
import { configs } from "../common/utils/config"
import { ICompetitionResponse, Match } from "../../types"

class FootballData {
    private http() {
        return axios.create({
            baseURL: "https://api.football-data.org",
            headers: {
                "X-Auth-Token": configs.FOOTBALL_API,
            },
        })
    }

    constructor() {}

    public async getCompetitions(): Promise<ICompetitionResponse[]> {
        const { data } = await this.http().get("/v4/competitions")
        return data?.competitions
    }

    public async getCompetitionMatches(
        competition: string,
        filter: { dateFrom: string; dateTo: string }
    ): Promise<Match[]> {
        const season = new Date().getFullYear() - 1
        const { data } = await this.http().get(
            `/v4/competitions/${competition}/matches`,
            {
                params: {
                    season,
                    ...filter,
                },
            }
        )
        return data?.matches
    }
}

export default FootballData
