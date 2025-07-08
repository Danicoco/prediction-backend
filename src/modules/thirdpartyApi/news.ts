/** @format */

import axios from "axios"
import { configs } from "../common/utils/config"
import { ICompetitionResponse } from "../../types"

class News {
    private http() {
        return axios.create({
            baseURL: "https://newsapi.org",
            headers: {
                "X-Api-Key": configs.NEWS_API,
            },
        })
    }

    constructor() {}

    public async getFootballNews(): Promise<ICompetitionResponse[]> {
        const { data } = await this.http().get("/v2/everything?q=football")
        return data?.articles
    }
}

export default News
