import {Socket} from 'phoenix'

let newSocket = new Socket("/socket", {params: {}})
newSocket.connect()

export const socket = newSocket
