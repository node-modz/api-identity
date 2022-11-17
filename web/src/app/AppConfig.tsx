import { IconType } from 'react-icons';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
} from 'react-icons/fi';

//SideBar Item
export interface LinkItemProps {
    href: string;
    name: string;
    icon: IconType;
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

export const APP_CONFIG = {
    apiHost : "http://localhost:4000",
    graphQLUrl: "http://localhost:4000/graphql",
    identity: {        
        postLogin: {
            href:"/accounting/dashboard"
        },
        postSignup: {
            href:"/accounting/dashboard"
        },
        register: {
            href:'/identity/register'
        },
        login: {
            href:'/identity/login'
        },        
        postLogout: {
            href:'/'
        },
        forgotPassword: {
            href:'/identity/password/forgot-password'
        },
    },
    SideBar: {
        Items: [
            { href: '/accounting/dashboard', name: 'Dasboard', icon: FiHome },
            { href: '/trending', name: 'Trending', icon: FiTrendingUp },
            { href: '/posts', name: 'Posts', icon: FiCompass },
            { href: '/favorites', name: 'Favourites', icon: FiStar },
            { href: '/settings', name: 'Settings', icon: FiSettings },
        ] as Array<LinkItemProps>
    },
    TopNav: {
        Items: [
            {
                label: 'Inspiration',
                children: [
                    { href: '#', label: 'Explore Design Work',subLabel: 'Trending Design to inspire you',},
                    { href: '#', label: 'New & Noteworthy', subLabel: 'Up-and-coming Designers',},
                ],
            },
            {
                label: 'Find Work',
                children: [
                    { href: '#', label: 'Job Board', subLabel: 'Find your dream design job', },
                    { href: '#', label: 'Freelance Projects', subLabel: 'An exclusive list for contract work',}, 
                ],
            },
            {
                label: 'Learn Design',
                href: '#',
            },
            {
                label: 'Hire Designers',
                href: '#',
            },
        ] as Array<NavItem>
    },
    // TODO: how to attach client side actions to these..
    UserProfile: {
        Items:[
            { type:"link", label:"Settings", href:"/settings" },
            { type:"link", label:"Profile", href:"/profile" },
            { type:"divider", label:"divider"}
        ] as Array<NavItem>
    }
}