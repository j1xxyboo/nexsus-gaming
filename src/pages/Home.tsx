import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { fetchFeaturedTournaments } from '../lib/queries'
import { useAsync } from '../lib/useAsync'
import TournamentCard from '../components/TournamentCard'
import { Empty, ErrorState, Loading } from '../components/States'

const steps = [
  {
    n: '1',
    title: 'Join the server',
    body: 'Everything starts in Discord. Read the rules, grab your roles and say hello.',
  },
  {
    n: '2',
    title: 'Verify your MLBB account',
    body: 'Enter your player ID and server, then type the code we send to your in-game inbox.',
  },
  {
    n: '3',
    title: 'Register a squad',
    body: 'Create or join a squad, then sign it up for any open bracket.',
  },
]

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-900 p-5">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold tracking-tight text-white">{value}</dd>
    </div>
  )
}

export default function Home() {
  const { data, error, loading } = useAsync(() => fetchFeaturedTournaments(3), [])

  return (
    <div className="space-y-20">
      <section className="grid gap-10 pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-brand-300">
            Mobile Legends: Bang Bang · Community tournaments
          </p>
          <h1 className="h1 mt-4 max-w-xl">Competitive MLBB, run properly.</h1>
          <p className="muted mt-5 max-w-lg text-base">{site.blurb}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-primary">
              Join the Discord
            </a>
            <Link to="/tournaments" className="btn-ghost">
              See tournaments
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08]">
          <Stat label="Members" value={site.discord.members.toLocaleString()} />
          <Stat label="Online now" value={site.discord.online.toLocaleString()} />
          <Stat label="Game" value="MLBB" />
        </dl>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="h2">Open for sign-ups</h2>
            <p className="muted mt-1">Brackets are seeded and run by Nexsus staff inside the server.</p>
          </div>
          <Link to="/tournaments" className="shrink-0 text-sm font-medium text-brand-300 hover:text-brand-200">
            All tournaments →
          </Link>
        </div>

        {loading && <Loading label="Loading tournaments…" />}
        {error && <ErrorState message={error} />}
        {data && data.length === 0 && (
          <Empty title="No open brackets right now">
            New cups are announced in the server every couple of weeks.
          </Empty>
        )}
        {data && data.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((t) => (
              <TournamentCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="h2">How to play your first match</h2>
        <ol className="mt-6 grid gap-8 border-t border-white/[0.08] pt-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n}>
              <p className="font-display text-sm font-semibold text-brand-300">Step {s.n}</p>
              <h3 className="mt-2 text-base font-semibold text-white">{s.title}</h3>
              <p className="muted mt-1.5">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="card grid overflow-hidden md:grid-cols-2">
        <div className="p-7 sm:p-8">
          <h2 className="h2">Matches happen in Discord</h2>
          <p className="muted mt-3">
            This site handles sign-ups and rosters. Lobbies, pairings, disputes and results all run through
            the Nexsus server.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-primary">
              Open invite
            </a>
            <Link to="/community" className="btn-ghost">
              What is inside
            </Link>
          </div>
        </div>

        <ul className="divide-y divide-white/[0.08] border-t border-white/[0.08] md:border-l md:border-t-0">
          {site.channels.slice(0, 4).map((c) => (
            <li key={c.name} className="flex gap-3 px-7 py-4 sm:px-8">
              <span className="text-slate-600">#</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{c.name}</p>
                <p className="text-xs text-slate-400">{c.purpose}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
