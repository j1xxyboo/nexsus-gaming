import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-lg p-10 text-center">
      <p className="font-display text-6xl tracking-wider text-brand-500">404</p>
      <p className="mt-2 font-display text-2xl tracking-wide text-white">No channel here</p>
      <p className="muted mt-2">That page does not exist — or it moved into the server.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/" className="btn-primary">
          Back to welcome
        </Link>
        <Link to="/tournaments" className="btn-ghost">
          Tournaments
        </Link>
      </div>
    </div>
  )
}
