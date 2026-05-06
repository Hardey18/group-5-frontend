import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'dashboard', title: 'Insight Analysis', href: paths.dashboard.dashboard, icon: 'dashboard' },
  { key: 'overview', title: 'Call Analysis', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'followUp', title: 'Follow Up', href: paths.dashboard.followUp, icon: 'follow-up' },
  { key: 'call', title: 'Call', href: paths.dashboard.call, icon: 'call' },
  { key: 'chat', title: 'Chat', href: paths.dashboard.chat, icon: 'chat' },
  { key: 'client', title: 'Client', href: paths.dashboard.client, icon: 'client' },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
