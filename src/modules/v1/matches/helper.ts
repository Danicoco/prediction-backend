import { endOfWeek, startOfWeek } from "date-fns";

export const composeFilter = (query: Record<string, string>) => {
    const { competition, status, stage, matchday } = query;
    let filter = {
        date: {
            $gte: startOfWeek(new Date()),
            $lte: endOfWeek(new Date())
        }
    } as any;

    if (competition) filter = { ...filter, competition }
    if (status) filter = { ...filter, status }
    if (matchday) filter = { ...filter, matchday };
    if (stage) filter = { ...filter, stage };

    return filter;
}