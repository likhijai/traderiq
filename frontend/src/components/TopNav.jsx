import { useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useThemeStore } from '../store/useThemeStore.js';
import { AutoRefreshControl } from './AutoRefreshControl.jsx';

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'FnO Desk', to: '/fno' },
];

export const TopNav = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const initialize = useThemeStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/80"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-electric/20 text-electric font-semibold">
                  TIQ
                </span>
                <span className="font-semibold tracking-wide text-slate-700 dark:text-slate-100">TraderIQ Terminal</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      clsx(
                        'text-sm font-medium tracking-wide transition-colors',
                        isActive
                          ? 'text-electric'
                          : 'text-slate-600 hover:text-electric dark:text-slate-300'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <AutoRefreshControl />
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-inner transition hover:border-electric hover:text-electric dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                  aria-label={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
              </div>
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-200 hover:text-electric focus:outline-none focus:ring-2 focus:ring-electric dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden border-t border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-electric/10 text-electric'
                        : 'text-slate-700 hover:bg-slate-200 hover:text-electric dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
                    )
                  }
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <div className="flex items-center justify-between px-3 py-2">
                <AutoRefreshControl compact />
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-inner transition dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                  aria-label={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
