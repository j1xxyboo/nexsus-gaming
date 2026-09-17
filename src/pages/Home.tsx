import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { tournaments } from '../data/tournaments'
import TournamentCard from '../components/TournamentCard'
import SectionHeading from '../components/SectionHeading'

const steps = [
  {
    n: '01',
    title: 'Join the server',
    body: 'Everything starts in Discord. Read the rules, grab your game roles and say hello.',
  },
  {
    n: '02',
    title: 'Form or find a squad',
    body: 'Post in find-a-team or browse the squad directory here. Captains pick up free agents daily.',
  },
  {
    n: '03',
    title: 'Sign up for a cup',
    body: 'Pick an open bracket, register your roster, then show up to the voice lobby on time.',
  },
]

export default function Home() {
  const featured = tournaments.filter((t) => t.status === 'live' || t.status === 'open').slice(0, 3)

  return (
    <div className="space-y-16">
      {/* hero */}
      <section className="card relative overflow-hidden p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-crimson-600/20 blur-3xl" />

        <div className="relative">
          <span className="chip-purple">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-emerald-400" />
            {site.discord.online.toLocaleString()} members online right now
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
            <Link to="/join" className="btn-ghost">
              Find a squad
            </Link>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: 'Members', v: site.discord.members.toLocaleString() },
              { k: 'Cups run', v: '28' },
              { k: 'Squads', v: '96' },
              { k: 'Prizes paid', v: '1.2M DZD' },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.k}</dt>
                <dd className="mt-1 font-display text-2xl tracking-wide text-white">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* featured tournaments */}
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

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((t) => (
            <TournamentCard key={t.slug} t={t} />
          ))}
        </div>
      </section>

      {/* how it works */}
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

      {/* discord strip */}
      <section className="card overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          <div className="p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-crimson-500">The server</p>
            <h2 className="h2 mt-1">Every bracket is organised in Discord</h2>
            <p className="muted mt-3">
              This site is the shop window — the tournaments themselves run on voice lobbies, ticket threads
              and staff channels inside the Nexsus server.
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
