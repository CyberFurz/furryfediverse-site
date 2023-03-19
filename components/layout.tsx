import { useState } from 'react'
import { maintainers } from '../lib/config'
import Link from "next/link"

export default function Layout({ children }: any) {
    const [theme, setTheme] = useState('dark')
    
    return (
        <div
            className='flex flex-col bg-base-300 min-h-screen gap-8'
            data-theme={ theme }
        >
            <div className='grow overflow-y-clip'>
                <div className='p-2 md:p-5 lg:px-6 2xl:px-80'>
                    <div className='flex justify-between items-center'>
                        <Link href='/'>
                            <p className='text-4xl place-self-center'>
                                The Furry Fediverse
                            </p>
                        </Link>
                        <div className='flex flex-nowrap justify-evenly items-center gap-2'>
                            <i className='fa-solid fa-moon'></i>
                            <input
                                type='checkbox'
                                className='toggle'
                                onChange={ () => toggleTheme() }
                            />
                            <i className='fa-solid fa-sun'></i>
                        </div>
                    </div>
                    { children }
                </div>
            </div>
            <footer className='footer py-6 px-4 sm:px-12 bg-neutral text-neutral-content flex justify-between items-center'>
                <div>
                    <div className='flex flex-col gap-2'>
                        <div>Maintained by:</div>
                        <div></div>
                        { maintainers.map(
                            (data: { user: string; domain: string }) => (
                                <div key={ data.user + data.domain }>
                                    <a
                                        rel='me noreferrer'
                                        href={ `https://${ data.domain }/@${ data.user }` }
                                        className='link flex items-center'
                                        target='_blank'
                                    >
                                        <div>
                                            <i className='fa-brands fa-mastodon text-2xl' aria-hidden="true">&nbsp;</i>
                                        </div>
                                        <div>
                                            { data.user }@{ data.domain }
                                        </div>
                                    </a>
                                </div>
                            )
                        ) }
                    </div>
                </div>
                <div>
                    Find us here:
                    <div className='flex items-start flex-col gap-4'>
                        <a
                            href='https://github.com/CyberFurz/furryfediverse-site'
                            className='link text-xl no-underline'
                            target='_blank'
                            rel='noreferrer'
                        >
                            <i className='fa-brands fa-github' aria-hidden="true">&nbsp;</i>
                            GitHub
                        </a>
                        <a
                            rel='me noreferrer'
                            href='https://cyberfurz.social/@FurryFediverse'
                            className='link text-xl no-underline'
                            target='_blank'
                        >
                            <i className='fa-brands fa-mastodon' aria-hidden="true">&nbsp;</i>
                            Mastodon
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
    
    function toggleTheme() {
        if (theme == 'light') {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }
}
