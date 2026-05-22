import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', d: 'M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9' },
  { to: '/discover', d: 'M12 3v2m0 14v2m9-9h-2M5 12H3M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z' },
  { to: '/galaxy', d: 'M12 3a9 9 0 1 0 9 9m-9-9c4 4 4 14 0 18M3 12h18' },
  { to: '/search', d: 'm21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z' },
  { to: '/profile', d: 'M5 20a7 7 0 0 1 14 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z' },
];

export default function MobileTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-glass bg-void-2/80 py-3 backdrop-blur-glass md:hidden">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          data-hoverable
          className={({ isActive }) =>
            isActive ? 'text-accent-crimson' : 'text-text-muted'
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d={t.d} />
          </svg>
        </NavLink>
      ))}
    </nav>
  );
}
