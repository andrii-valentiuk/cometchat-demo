import { CometChat } from '@cometchat/chat-sdk-javascript'
import { CometChatUIKit, UIKitSettingsBuilder } from '@cometchat/chat-uikit-react'
import {
  assertCometChatCredentials,
  normalizeCometChatCredentials,
} from './cometchatConfig'

let initPromise = null
let initCredsKey = null
let connectInFlight = null

function credsInitKey(creds) {
  return [creds.appId, creds.region, creds.authKey].join('\u0000')
}

/**
 * @param {CometChatCredentials} creds
 */
function ensureInitialized(creds) {
  const key = credsInitKey(creds)
  if (initCredsKey !== key) {
    initPromise = null
    initCredsKey = key
  }

  if (!initPromise) {
    const settings = new UIKitSettingsBuilder()
      .setAppId(creds.appId)
      .setRegion(creds.region)
      .setAuthKey(creds.authKey)
      .subscribePresenceForAllUsers()
      .build()

    initPromise = CometChatUIKit.init(settings).catch((err) => {
      initPromise = null
      throw err
    })
  }

  return initPromise
}

/**
 * @param {CometChatCredentials} rawCreds
 */
export function connectToCometChat(rawCreds) {
  const creds = normalizeCometChatCredentials(rawCreds)
  assertCometChatCredentials(creds)

  if (connectInFlight) {
    return connectInFlight
  }

  connectInFlight = (async () => {
    await ensureInitialized(creds)

    const existing = await CometChatUIKit.getLoggedinUser()
    if (existing?.getUid() === creds.uid) {
      const group = await CometChat.getGroup(creds.groupGuid)
      return { group }
    }

    if (existing) {
      await CometChatUIKit.logout()
    }

    await CometChatUIKit.login(creds.uid)
    const group = await CometChat.getGroup(creds.groupGuid)
    return { group }
  })().finally(() => {
    connectInFlight = null
  })

  return connectInFlight
}
