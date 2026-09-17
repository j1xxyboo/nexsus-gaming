import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { fetchFeaturedTournaments } from '../lib/queries'
import { useAsync } from '../lib/useAsync'
import TournamentCard from '../components/TournamentCard'
import SectionHeading from '../components/SectionHeading'
import { Empty, ErrorState, Loading } from '../components/States'

const steps = [
  {
    n: '01',
    title: 'Join the server',
    body: 'Everything starts in Discord. Read the rules, grab your roles and say hello.',
  },
  {
    n: '02',
    title: 'Verify your MLBB account',
    body: 'Enter your player ID and server, then type the code we send to your in-game inbox.',
  },
  {
    n: '03',
    title: 'Sign up a squad',
    body: 'Create or join a squad, then register it for any open bracket.',
  },
]

export default function Home() {
  const { data, error, loading } = useAsync(() => fetchFeaturedTournaments(3), [])

  return (
    <div className="space-y-16">
      <section className="card relative overflow-hidden p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-crimson-600/20 blur-3xl" />

        <div className="relative">
          <span className="chip-purple">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-emerald-400" />
            Mobile Legends: Bang Bang
          </span>

          <h1 className="h1 mt-5 max-w-3xl">
            Nexsus Gaming — <span className="text-brand-300">compete</span>,{' '}
            <span className="text-white">climb</span>, <span className="text-crimson-500">belong</span>.
          </h1>

          <p className="muted mt-4 max-w-2xl text-base">{site.blurb}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-primary">
              Join the Nexsus Discord
            </a>
            <Link to="/tournaments" className="btn-white">
              Browse tournaments
            </Link>
            <Link to="/auth" className="btn-ghost">
              Verify your account
            </Link>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Open now"
          title="Tournaments taking sign-ups"
          action={
            <Link to="/tournaments" className="btn-ghost">
              All tournaments
            </Link>
          }
        >
          Brackets are seeded and run by Nexsus staff. Sign-ups, pairings and results all live in the server.
        </SectionHeading>

        {loading && <Loading label="Loading tournaments…" />}
        {error && <ErrorState message={error} />}
        {data && data.length === 0 && (
          <Empty title="No open brackets right now">
            New cups are announced in the server every couple of weeks.
          </Empty>
        )}
        {data && data.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.map((t) => (
              <TournamentCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading eyebrow="Getting started" title="Three steps to your first match" />
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card card-hover p-6">
              <p className="font-display text-4xl tracking-wide text-brand-500/70">{s.n}</p>
              <h3 className="mt-2 text-lg font-bold text-white">{s.title}</h3>
              <p className="muted mt-2">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          <div className="p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-crimson-500">The server</p>
            <h2 className="h2 mt-1">Every bracket is organised in Discord</h2>
            <p className="muted mt-3">
              This site handles sign-ups and rosters — the matches themselves run on voice lobbies, ticket
              threads and staff channels inside the Nexsus server.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-red">
                Open invite
              </a>
              <Link to="/community" className="btn-ghost">
                What is inside
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 bg-ink-950/60 p-8 md:border-l md:border-t-0">
            <ul className="space-y-3">
              {site.channels.slice(0, 4).map((c) => (
                <li key={c.name} className="flex gap-3">
                  <span className="mt-0.5 text-slate-500">#</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.purpose}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
