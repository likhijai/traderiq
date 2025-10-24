import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const NewsModal = ({ open, onClose, article }) => (
  <Transition show={open} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="neon-card w-full max-w-xl rounded-2xl p-6 text-left align-middle">
              <div className="flex items-start justify-between gap-4">
                <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
                  {article?.headline ?? 'Market Update'}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-slate-300 p-2 text-slate-600 transition hover:border-electric hover:text-electric dark:border-slate-700 dark:text-slate-300"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-200">
                <p>{article?.summary}</p>
                <time className="block text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {article?.timestamp && new Date(article.timestamp).toLocaleString()}
                </time>
                <a href={article?.link ?? '#'} className="inline-flex items-center gap-2 text-electric">
                  Read full story
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);
