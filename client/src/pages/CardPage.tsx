
import React, { useState, useRef } from 'react'
import Navbar from '@/components/ui/navbar'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { FaCodeBranch, FaLeaf, FaRocket, FaSeedling, FaFire, FaCrown } from "react-icons/fa";
import { Spinner } from '@/components/ui/spinner'
import { useCard } from '@/hooks/useCard'
import CardActions from '@/components/cards/CardActions'

const badgeConfig = {
  Elite:        { color: '#facc15', icon: <FaCrown /> },
  Pro:          { color: '#c084fc', icon: <FaFire /> },
  "Rising Dev": { color: '#60a5fa', icon: <FaRocket /> },
  Intermediate: { color: '#4ade80', icon: <FaLeaf /> },
  Beginner:     { color: '#9ca3af', icon: <FaSeedling /> },
}

const CardPage = () => {
  const [input, setInput] = useState("")
  const cardRef = useRef(null)
  const [cardGenerated, setCardGenerated] = useState(false)
  const { data, loading, error, fetchProfile } = useCard()

  const handleSearch = async () => {
    if (!input.trim()) return
    await fetchProfile(input.trim())
    setCardGenerated(true)
  }

  const languages  = data?.stats?.topLanguages?.slice(0, 3) || []
  const score      = data?.stats?.devScore?.overall || 0
  const label      = data?.stats?.devScore?.label || 'Beginner'
  const percentile = data?.stats?.devScore?.percentile || 50
  const badge      = badgeConfig[label]

  const name      = data?.profile?.name || data?.profile?.username || ''
  const username  = data?.profile?.username || ''
  const bio       = data?.profile?.bio || ''
  const avatar    = data?.profile?.avatar_url || ''
  const stars     = (data?.stats?.totalStars || 0).toLocaleString()
  const forks     = (data?.stats?.totalForks || 0).toLocaleString()
  const TotalCommits = (data?.stats?.totalCommits || 0)
  const LongestStreak = (data?.stats?.longestStreakDays || 0)

  const repos     = data?.profile?.public_repos || 0
  const followers = (data?.profile?.followers || 0).toLocaleString()

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />

      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px' }}>
          Generate Card
        </h1>
        <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>
          Enter any GitHub username to generate a shareable DevCard
        </p>
      </div>

      <div style={{ maxWidth: '420px', margin: '24px auto 0', padding:'12px' }}>
        <InputGroup>
          <InputGroupInput
            placeholder="Enter GitHub username..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <InputGroupAddon align="inline-end">
            {loading ? (
              <Spinner />
            ) : (
              <InputGroupButton onClick={handleSearch} >
                Search
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>

        {error && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>
            {error}
          </p>
        )}
      </div>

      {cardGenerated && data && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>

          <div
            ref={cardRef}
            style={{
              background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
              color: 'white',
              borderRadius: '16px',
              padding: '20px 22px',
              width: '360px',
              minWidth: '360px',
              maxWidth: '360px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'sans-serif',
              boxSizing: 'border-box'
            }}
          >

            {/* TOP */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <img
                src={avatar}
                crossOrigin="anonymous"
                style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #3f3f46', marginRight: '12px' }}
              />

              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {name}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#71717a' }}>
                  @{username}
                </p>
              </div>

              <div style={{ background: '#3f3f46', borderRadius: '10px', padding: '6px 12px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{score}</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#71717a' }}>/ 1000</p>
              </div>
            </div>

            {/* BIO */}
            {bio && (
              <p style={{
                margin: '0 0 12px',
                fontSize: '11px',
                color: '#a1a1aa',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {bio}
              </p>
            )}

            <div style={{ height: '0.5px', background: '#3f3f46', marginBottom: '12px' }} />

            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
              {[
                { label: 'Stars', value: stars },
                { label: 'Repos', value: repos },
                { label: 'Followers', value: followers },
                { label: 'Forks', value: forks },
                { label: 'Commits', value: TotalCommits },
                { label: 'LongestStreak', value: LongestStreak },
              ].map(s => (
                <div key={s.label} style={{ background: '#27272a', borderRadius: '8px', padding: '7px 4px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: '10px', color: '#71717a' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* PROGRESS */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#71717a', marginBottom: '5px' }}>
                <span>DevScore</span>
                <span>{label} · Top {percentile}%</span>
              </div>
              <div style={{ background: '#3f3f46', borderRadius: '9999px', height: '6px' }}>
                <div style={{ background: '#3b82f6', height: '6px', width: `${(score / 1000) * 100}%` }} />
              </div>
            </div>

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                {languages.map((lang, i) => (
                  <span
                    key={lang.lang}
                    style={{
                      display: 'inline-block',
                      marginRight: '6px',
                      marginBottom: '6px',
                      border: '0.5px solid #52525b',
                      borderRadius: '9999px',
                      padding: '3px 10px',
                      fontSize: '11px',
                      color: '#a1a1aa'
                    }}
                  >
                    {lang.lang}
                  </span>
                ))}
              </div>
            )}

            {/* FOOTER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid #3f3f46', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: badge?.color }}>
                {badge?.icon}
                <span style={{ marginLeft: '5px' }}>{label}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', color: '#60a5fa' }}>
                <FaCodeBranch />
                <span style={{ marginLeft: '5px' }}>codevex.online</span>
              </div>
            </div>

          </div>

          <CardActions username={username} cardRef={cardRef} />

        </div>
      )}

      {cardGenerated && !data && !loading && (
        <p style={{ textAlign: 'center', color: '#ef4444', marginTop: '40px' }}>
          User not found.
        </p>
      )}
    </div>
  )
}

export default CardPage