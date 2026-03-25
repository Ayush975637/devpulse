import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGithub } from '../hooks/useGithub';

export default function Dashboard() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { data, loading, error, fetchProfile } = useGithub();

  useEffect(() => {
    if (username) fetchProfile(username);
  }, [username]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
      <p>Loading {username}...</p>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
      <p style={{ color: 'red' }}>{error}</p>
    </div>
  );

  if (!data) return null;

  const { profile, stats } = data;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img src={profile?.avatar_url} width={80} style={{ borderRadius: '50%' }} />
        <div>
          <h2 style={{ margin: 0 }}>{profile?.name || profile?.username}</h2>
          <p style={{ margin: '4px 0', color: '#666' }}>@{profile?.username}</p>
          <p style={{ margin: '4px 0' }}>{profile?.bio}</p>
        </div>
      </div>

      {/* stat cards */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
        {[
          { label: 'Repos',      value: stats?.totalRepos },
          { label: 'Stars',      value: stats?.totalStars?.toLocaleString() },
          { label: 'Followers',  value: profile?.followers?.toLocaleString() },
          { label: 'Most active',value: stats?.mostActiveDay },
        ].map(card => (
          <div key={card.label} style={{
            flex: 1, padding: '16px', border: '1px solid #eee',
            borderRadius: '8px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{card.value}</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* top languages */}
      <div style={{ marginTop: '32px' }}>
        <h3>Top languages</h3>
        {stats?.topLanguages.map((l:any) => (
          <div key={l.lang} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: '1px solid #f0f0f0'
          }}>
            <span>{l.lang}</span>
            <span style={{ color: '#666' }}>{l.count} repos</span>
          </div>
        ))}
      </div>

      {/* top repos */}
      <div style={{ marginTop: '32px' }}>
        <h3>Repositories</h3>
        {data?.repos?.slice(0, 6).map((repo:any) => (
          <div key={repo.github_id} style={{
            padding: '12px', marginBottom: '8px',
            border: '1px solid #eee', borderRadius: '8px'
          }}>
            <div style={{ fontWeight: 'bold' }}>{repo.name}</div>
            <div style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>
              {repo.description}
            </div>
            <div style={{ fontSize: '13px', display: 'flex', gap: '16px' }}>
              <span>{repo.language}</span>
              <span>⭐ {repo.stars.toLocaleString()}</span>
              <span>🍴 {repo.forks.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '32px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Search another
      </button>

    </div>
  );
}






