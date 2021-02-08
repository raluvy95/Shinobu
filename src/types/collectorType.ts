import { helpPaginatorMap } from "./helpPaginator.ts";

export interface reactionCollector {
    message: string,
    author: string,
    commands: helpPaginatorMap[]
}