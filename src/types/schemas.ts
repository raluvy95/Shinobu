export interface config {
    muted: string,
    logs: string,
    prefix: string
}

export interface mutedMember {
    id: string,
    role: string,
    unmute?: number
}

export interface muted {
    members: mutedMember[],
}

export interface welcome {
    message: string,
    role: string,
    channel: string
}

export interface goodbye {
    message: string,
    channel: string
}

export interface remindMember {
    id: string,
    remind: number,
    message: string,
    reason: string,
    channel: string
}
export interface remind {
    members: remindMember[]
}