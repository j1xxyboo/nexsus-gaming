import { site } from '../data/site'
import SectionHeading from '../components/SectionHeading'

export default function Community() {
  return (
    <div className="space-y-12">
      <SectionHeading eyebrow="The server" title="Inside the Nexsus community">
        {site.tagline} — Nexsus is a Discord community first and a tournament organiser second. Here is how
        the server is laid out.
      </SectionHeading>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { k: 'Members', v: site.discord.members.toLocaleString() },
          { k: 'Online now', v: site.discord.online.toLocaleString() },
          { k: 'Server boosts', v: String(site.discord.boosts) },
        ].map((s) => (
          <div key={s.k} className="card p-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.k}</p>
            <p className="mt-1 font-display text-4xl tracking-wide text-white">{s.v}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="h2 mb-5">Channels you will use</h2>
        <div className="card divide-y divide-white/5">
          {site.channels.map((c) => (
            <div key={c.name} className="flex gap-4 p-5">
              <span className="text-lg font-bold text-slate-600">#</span>
              <div>
                <p className="font-semibold text-white">{c.name}</p>
                <p className="muted mt-0.5">{c.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="h2 mb-5">Roles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {site.roles.map((r) => (
            <div key={r.name} className="card p-5">
              <span
                className={
                  r.color === 'crimson' ? 'chip-red' : r.color === 'white' ? 'chip-white' : 'chip-purple'
                }
              >
                {r.name}
              </span>
              <p className="muted mt-3">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-8">
        <h2 className="h2">House rules</h2>
        <ol className="mt-4 space-y-3">
          {[
            'Treat everyone with respect — no harassment, slurs or targeted abuse, in text or voice.',
            'Keep channels on topic and use threads for long side conversations.',
            'No cheating, boosting, account sharing or smurfing in any Nexsus bracket.',
            'Disputes go to a ticket, never to a public channel.',
            'Staff decisions are final during a live match; appeals happen afterwards.',
          ].map((r, i) => (
            <li key={r} className="flex gap-3 text-sm text-slate-300">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600/30 text-xs font-bold text-brand-100">
                {i + 1}
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ol>
        <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-primary mt-7">
          Join the Nexsus Discord
        </a>
      </section>
    </div>
  )
}
