import { Message } from "../../deps.ts";

export let basic =  async (timestamp: number) => {
    let from: number | string = (new Date(timestamp)).getTime() % 3600
    if (from == 1) from = `${from.toFixed(0)} day`; else from = `${from.toFixed(0)} days`
    let day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(timestamp).getDay()]
    return `${day} ${(new Date(timestamp)).getDate()}/${(new Date(timestamp)).getMonth()}/${(new Date(timestamp)).getFullYear()} (${from})`
}

export let StringToTime =  async (message: Message, timeString: string) => {
    let time: string = timeString.toLowerCase().replace(/m+/g, "*60+").replace(/h+/g, "*60*60+").replace(/s+/g, "+").replace(/d+/g, "*60*60*24+").replace(/minutes/g, " * 60 + ").replace(/hours/g, "*60*60+").replace(/seconds/g, "+").replace(/days+/g, "*60*60*24+").replace(/minute+/g, "*60+").replace(/hour+/g, "*60*60+").replace(/second+/g, "+").replace(/day+/g, "*60*60*24+").slice(0, -1)
    let timeout: number | string;
    try {
        timeout = await eval(`${eval(time) * 1 * 1000}`)
    } catch (e) {
        await message.send("the time has to be a number or time literal, example: 2d3h1m50s")
        return
    }
    if (isNaN(timeout as any)) {
        await message.send("the time has to be a number or time literal, example: 2d3h1m50s")
        return
    }
    return timeout as number
}

export let TimeToString = async (time: number) => {
    let totalSeconds = (time / 1000);
    let days: number | string = Math.floor(totalSeconds / 86400);
    let hours: number | string = Math.floor((totalSeconds / 3600) % 24);
    totalSeconds %= 3600;
    let minutes: number | string = Math.floor(totalSeconds / 60);
    let seconds: number | string = Math.floor(totalSeconds % 60);
    if (seconds == 0) seconds = ""; else {
        if (seconds != 1) seconds = `${seconds} seconds and `
        else seconds = `${seconds} second and`
    }
    if (minutes == 0) minutes = ""; else {
        if (minutes != 1) minutes = `${minutes} minutes and `
        else minutes = `${minutes} minute and`
    }
    if (hours == 0) hours = ""; else {
        if (hours != 1) hours = `${hours} hours and `
        else hours = `${hours} hour and`
    }
    if (days == 0) days = ""; else {
        if (days != 1) days = `${days} days and `
        else days = `${days} day and`
    }
    let moment = `${days}${hours}${minutes}${seconds}`.slice(0, -4)
    return moment
}