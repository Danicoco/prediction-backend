/** @format */

import { Agenda } from "@hokify/agenda"
import { configs } from "../utils/config"

const agenda = new Agenda({
    name: "Caresify",
    defaultConcurrency: 5,
    db: { address: configs.DB_URL, collection: "jobs" },
})

agenda
    .on("ready", () => console.log("Agenda started!"))
    .on("error", err => console.log("Agenda connection error!", err?.message));

// const definitions: any = []

// definitions.forEach(definition => definition(agenda));

(async () => {
    await agenda.start()
})()

export default agenda

