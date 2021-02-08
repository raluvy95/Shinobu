export interface config {
    id: string,
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
    id: string,
    members: mutedMember[],
}

export interface welcome {
    id: string,
    message: string,
    role: string,
    channel: string
}

export interface goodbye {
    id: string,
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
    id: string,
    members: remindMember[]
}