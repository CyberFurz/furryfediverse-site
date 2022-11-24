export default function Layout({ children }: any) {
    return (
        <div>
            <div className="bg-gray-400 dark:bg-slate-700 min-h-screen">
                {children}
            </div>
        </div>
    )
}