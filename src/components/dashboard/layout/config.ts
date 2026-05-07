import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

interface UserType {
  userName: string
}

const user: UserType = JSON.parse(localStorage.getItem("user"));

console.log("USER>>>", user?.userName)

const userName = user?.userName;

const canShowItem = (item: { key: string }, userName: string) => {
  if (userName === 'admin1') {
    const hiddenForAdmin1 = ['call', 'chat', 'client'];
    return !hiddenForAdmin1.includes(item.key);
  } else if (userName === 'cus1') {
    const hiddenForCus1 = ['dashboard', 'overview', 'followUp', 'churnList'];
    return !hiddenForCus1.includes(item.key);
  } 
  return true; // Show all to others
};


export const allNavItems = [
  { key: 'dashboard', title: 'Insight Analysis', href: paths.dashboard.dashboard, icon: 'dashboard' },
  { key: 'overview', title: 'Call Analysis', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'followUp', title: 'Follow Up', href: paths.dashboard.followUp, icon: 'follow-up' },
  { key: 'call', title: 'Call', href: paths.dashboard.call, icon: 'call' },
  { key: 'chat', title: 'Chat', href: paths.dashboard.chat, icon: 'chat' },
  { key: 'client', title: 'Client', href: paths.dashboard.client, icon: 'client' },
  { key: 'churnList', title: 'Churn List', href: paths.dashboard.churnList, icon: 'churn-list' },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];

export const navItems = allNavItems.filter(item => 
  canShowItem(item, userName)
);