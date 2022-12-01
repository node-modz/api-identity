import { IconType } from 'react-icons';

//SideBar Item
export interface LinkItemProps {
    href: string;
    name?: string;
    icon?: IconType;
}

type NavItemType = "label" | "divider" | "link";

// TOP NAV Item
export interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
    type?: NavItemType;
}

export type SideBarItems = Array<LinkItemProps>

export type TopNavItems = Array<NavItem>

export type UserProfileItems = Array<NavItem>