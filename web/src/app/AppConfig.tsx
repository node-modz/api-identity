import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
} from 'react-icons/fi';
import { LinkItemProps, NavItem, SideBarItems, TopNavItems, UserProfileItems } from '../components/core/NavItems';
import { IdentityConfigOptions } from '../lib/identity/IdentityConfigOptions';

export const APP_CONFIG = {
    config : [
        {prop:'identity',container_ref:'IdentityConfigOptions'},
        {prop:'SideBar.Items',container_ref:'SideBarItems'},
        {prop:'TopNav.Items',container_ref:'TopNavItems'},
        {prop:'UserProfile.Items',container_ref:'UserProfileItems'},
    ],
    appHost : "http://localhost:3000",
    graphQLUrl: "http://localhost:4000/graphql",
    identity: {
        client: {
            authority: 'http://localhost:4000/oauth2',
            client_id: 'react-oidc-client',
            scopes: 'openid profile identity:profile accounting:* dachain:*'
        },              
        links: {
            postLogin: {href:"/accounting/dashboard"},
            postSignup: {href:"/accounting/dashboard"},
            register: {href:'/identity/register'},
            login: {href:'/identity/login'},
            postLogout: {href:'/'},
            forgotPassword: {href:'/identity/password/forgot-password'}
        } as Record<string,LinkItemProps>
    } as IdentityConfigOptions,
    SideBar: {
        Items: [
            { href: '/accounting/dashboard', name: 'Dasboard', icon: FiHome },
            { href: '/trending', name: 'Trending', icon: FiTrendingUp },
            { href: '/posts', name: 'Posts', icon: FiCompass },
            { href: '/favorites', name: 'Favourites', icon: FiStar },
            { href: '/settings', name: 'Settings', icon: FiSettings },
        ] as SideBarItems
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
        ] as TopNavItems
    },
    // TODO: how to attach client side actions to these..
    UserProfile: {
        Items:[
            { type:"link", label:"Settings", href:"/settings" },
            { type:"link", label:"Profile", href:"/profile" },
            { type:"divider", label:"divider"}
        ] as UserProfileItems
    }
}