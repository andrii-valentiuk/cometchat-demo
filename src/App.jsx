import { useState } from 'react'
import {
  CometChatMessageComposer,
  CometChatMessageHeader,
  CometChatMessageList,
} from '@cometchat/chat-uikit-react'
import { connectToCometChat } from './cometchatBootstrap'
import './App.css'

const initialForm = {
  appId: '',
  region: 'eu',
  authKey: '',
  groupGuid: '',
  uid: '',
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('sign-in')
  const [errorMessage, setErrorMessage] = useState('')
  const [group, setGroup] = useState(null)

  const formFilled =
    form.appId.trim() &&
    form.region.trim() &&
    form.authKey.trim() &&
    form.groupGuid.trim() &&
    form.uid.trim()

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('connecting')
    setErrorMessage('')
    try {
      const { group: grp } = await connectToCometChat(form)
      setGroup(grp)
      setStatus('ready')
    } catch (err) {
      setErrorMessage(err?.message ?? String(err))
      setStatus('sign-in')
    }
  }

  if (status === 'sign-in' || status === 'connecting') {
    const busy = status === 'connecting'

    return (
      <div className="sign-in">
        <form className="sign-in__form" onSubmit={handleSubmit}>
          <h1 className="sign-in__title">CometChat demo</h1>
          <p className="sign-in__hint">
            Enter your CometChat app credentials and the group you want to open.
            For production, use auth tokens from your server instead of an auth
            key in the browser.
          </p>

          <label className="sign-in__label" htmlFor="cc-app-id">
            App ID
          </label>
          <input
            id="cc-app-id"
            className="sign-in__input"
            name="appId"
            autoComplete="off"
            value={form.appId}
            onChange={(e) => setField('appId', e.target.value)}
            disabled={busy}
            required
          />

          <label className="sign-in__label" htmlFor="cc-region">
            Region
          </label>
          <input
            id="cc-region"
            className="sign-in__input"
            name="region"
            placeholder="us, eu, or in"
            autoComplete="off"
            value={form.region}
            onChange={(e) => setField('region', e.target.value)}
            disabled={busy}
            required
          />

          <label className="sign-in__label" htmlFor="cc-auth-key">
            Auth key
          </label>
          <input
            id="cc-auth-key"
            className="sign-in__input"
            name="authKey"
            type="password"
            autoComplete="new-password"
            value={form.authKey}
            onChange={(e) => setField('authKey', e.target.value)}
            disabled={busy}
            required
          />

          <label className="sign-in__label" htmlFor="cc-group-guid">
            Group GUID
          </label>
          <input
            id="cc-group-guid"
            className="sign-in__input"
            name="groupGuid"
            autoComplete="off"
            value={form.groupGuid}
            onChange={(e) => setField('groupGuid', e.target.value)}
            disabled={busy}
            required
          />

          <label className="sign-in__label" htmlFor="cc-uid">
            User ID
          </label>
          <input
            id="cc-uid"
            className="sign-in__input"
            name="uid"
            autoComplete="username"
            placeholder="e.g. cometchat-uid-1"
            value={form.uid}
            onChange={(e) => setField('uid', e.target.value)}
            disabled={busy}
            required
          />

          {errorMessage ? (
            <p className="sign-in__error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="sign-in__submit"
            type="submit"
            disabled={busy || !formFilled}
          >
            {busy ? 'Connecting…' : 'Continue'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="group-chat">
      <CometChatMessageHeader group={group} />
      <div className="group-chat__messages">
        <CometChatMessageList group={group} />
      </div>
      <CometChatMessageComposer group={group} />
    </div>
  )
}
