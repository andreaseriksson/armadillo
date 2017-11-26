import Dexie from 'dexie'

const VERSION = 1

var db = new Dexie('ArmadilloDatabase')
db.version(VERSION).stores({
  secrets: '++id, uuid, name, url, username, password, description',
  events: '++id, type, uuid, timestamp'
})

export const dbSecrets = db.table('secrets')
export const allSecrets = dbSecrets.toArray()

export const getSecret = uuid => dbSecrets.filter(secret => secret.uuid == uuid)

export const allEvents = db.table('events').reverse().toArray()

export const addEvent = event => {
  const timestamp = Date.now()
  return db.table('events').add(Object.assign({timestamp}, event))
}
