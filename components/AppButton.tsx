export default function AppButton ({href, name, paid, platform}:any) {

    const appBtnStyle = 'btn btn-primary normal-case text-lg flex flex-nowrap justify-between w-full mx-auto'
    
    return (
        <a
            href={href}
            className={appBtnStyle}
            target='_blank'
            rel='noreferrer'>
            <i className={'fa-brands fa-' + os2brand(platform) + ' mr-2'} aria-hidden="true"></i>{ ' ' }
            { name + (paid ? ' (Paid)' : '') }
            <span></span>
        </a>
    )
}

export function os2brand(os: string) {
    switch(os.toLocaleLowerCase()) {
        case 'android':
        case 'google':
            return 'android'
            break
        case 'apple':
        case 'ios':
        case 'iphone':
        case 'ipad':
            return 'apple'
            break
    }
}