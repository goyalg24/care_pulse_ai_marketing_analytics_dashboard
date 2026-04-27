import Header from './Header'

export default function PageShell({ title, subtitle, actions, children }) {
  return (
    <>
      <Header />
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="page-actions">{actions}</div>}
        </div>
        {children}
      </div>
    </>
  )
}
