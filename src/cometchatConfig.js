/** @typedef {{ appId: string; region: string; authKey: string; groupGuid: string; uid: string }} CometChatCredentials */

const FIELD_LABELS = {
  appId: 'App ID',
  region: 'Region',
  authKey: 'Auth key',
  groupGuid: 'Group GUID',
  uid: 'User ID',
}

/**
 * @param {CometChatCredentials} creds
 */
export function assertCometChatCredentials(creds) {
  const missing = []
  for (const key of Object.keys(FIELD_LABELS)) {
    if (!(creds[key] ?? '').toString().trim()) {
      missing.push(FIELD_LABELS[key])
    }
  }
  if (missing.length) {
    throw new Error(`Please fill in: ${missing.join(', ')}.`)
  }
}

/**
 * @param {CometChatCredentials} raw
 * @returns {CometChatCredentials}
 */
export function normalizeCometChatCredentials(raw) {
  return {
    appId: raw.appId.trim(),
    region: raw.region.trim().toLowerCase(),
    authKey: raw.authKey.trim(),
    groupGuid: raw.groupGuid.trim(),
    uid: raw.uid.trim(),
  }
}
