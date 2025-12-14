'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

interface Email {
  id: string
  from: string
  subject: string
  body: string
  date: string
  draft?: string
  status: 'pending' | 'drafted' | 'replied'
}

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(false)
  const [monitoring, setMonitoring] = useState(false)
  const [configured, setConfigured] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      const res = await fetch('/api/check-config')
      const data = await res.json()
      setConfigured(data.configured)
    } catch (error) {
      console.error('Failed to check configuration:', error)
    }
  }

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/emails')
      const data = await res.json()
      if (data.success) {
        setEmails(data.emails)
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDraft = async (emailId: string) => {
    try {
      const res = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId })
      })
      const data = await res.json()
      if (data.success) {
        setEmails(prev => prev.map(e =>
          e.id === emailId ? { ...e, draft: data.draft, status: 'drafted' } : e
        ))
      }
    } catch (error) {
      console.error('Failed to generate draft:', error)
    }
  }

  const sendReply = async (emailId: string, customDraft?: string) => {
    try {
      const email = emails.find(e => e.id === emailId)
      const res = await fetch('/api/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailId,
          draft: customDraft || email?.draft
        })
      })
      const data = await res.json()
      if (data.success) {
        setEmails(prev => prev.map(e =>
          e.id === emailId ? { ...e, status: 'replied' } : e
        ))
        setSelectedEmail(null)
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
    }
  }

  const toggleMonitoring = async () => {
    setMonitoring(!monitoring)
    if (!monitoring) {
      // Start monitoring - fetch emails every 30 seconds
      const interval = setInterval(fetchEmails, 30000)
      fetchEmails()
      return () => clearInterval(interval)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Email Agent</h1>
        <p className={styles.description}>
          AI-Powered Email Monitoring & Auto-Reply Assistant
        </p>

        {!configured && (
          <div className={styles.warning}>
            ⚠️ Email not configured. Please set environment variables (see .env.example)
          </div>
        )}

        <div className={styles.controls}>
          <button
            onClick={fetchEmails}
            disabled={loading || !configured}
            className={styles.button}
          >
            {loading ? 'Loading...' : 'Fetch Emails'}
          </button>
          <button
            onClick={toggleMonitoring}
            disabled={!configured}
            className={`${styles.button} ${monitoring ? styles.buttonActive : ''}`}
          >
            {monitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>

        <div className={styles.emailList}>
          <h2>Inbox ({emails.length})</h2>
          {emails.length === 0 ? (
            <p className={styles.empty}>No emails yet. Click "Fetch Emails" to load.</p>
          ) : (
            emails.map(email => (
              <div key={email.id} className={styles.emailCard}>
                <div className={styles.emailHeader}>
                  <div>
                    <strong>{email.from}</strong>
                    <span className={styles.status}>{email.status}</span>
                  </div>
                  <span className={styles.date}>{new Date(email.date).toLocaleString()}</span>
                </div>
                <div className={styles.emailSubject}>{email.subject}</div>
                <div className={styles.emailBody}>
                  {email.body.substring(0, 150)}...
                </div>

                {email.draft && (
                  <div className={styles.draft}>
                    <strong>Draft Reply:</strong>
                    <p>{email.draft}</p>
                  </div>
                )}

                <div className={styles.actions}>
                  {email.status === 'pending' && (
                    <button
                      onClick={() => generateDraft(email.id)}
                      className={styles.buttonSmall}
                    >
                      Generate Draft
                    </button>
                  )}
                  {email.status === 'drafted' && (
                    <>
                      <button
                        onClick={() => sendReply(email.id)}
                        className={styles.buttonSmall}
                      >
                        Send Reply
                      </button>
                      <button
                        onClick={() => setSelectedEmail(email)}
                        className={styles.buttonSmall}
                      >
                        Edit Draft
                      </button>
                    </>
                  )}
                  {email.status === 'replied' && (
                    <span className={styles.repliedLabel}>✓ Replied</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedEmail && (
          <div className={styles.modal} onClick={() => setSelectedEmail(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h3>Edit Draft Reply</h3>
              <textarea
                defaultValue={selectedEmail.draft}
                className={styles.textarea}
                rows={10}
                id="draftEditor"
              />
              <div className={styles.modalActions}>
                <button
                  onClick={() => {
                    const textarea = document.getElementById('draftEditor') as HTMLTextAreaElement
                    sendReply(selectedEmail.id, textarea.value)
                  }}
                  className={styles.button}
                >
                  Send
                </button>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className={styles.buttonSecondary}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
