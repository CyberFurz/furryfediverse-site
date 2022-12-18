import Head from 'next/head'
import type { NextPage } from 'next'

const AddInstance: NextPage = () => {
return(
    <main className="p-2 md:p-5 lg:px-60 2xl:px-80">
    <Head>
        <title>The Furry Fediverse - Add Server</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <p className="text-4xl text-gray-300 dark:text-gray-200">The Furry Fediverse</p>
    <div className="flex flex-col">
        <div className="py-4">
            <div className="bg-gray-400 text-slate-800 rounded-md p-3">
            <form id="my-form" action="https://formsubmit.co/submissions@hack13.one" method="POST">
                <label className="text-2xl font-bold">Instance Name</label><br />
                <input type="text" name="Instance Name" className="rounded-md" required/><br />
                <label className="text-2xl font-bold">Instance URI</label><br />
                <input type="text" name="Instance URI" className="rounded-md" required/><br />
                <label className="text-2xl font-bold">Agreements</label><br />
                <p className="text-base">You agree to allow FurryFediverse to scape your instance's endpoint "/api/v1/instance" for up to date information on your instance. We will not collect any other data from your instance.</p>
                <input type="checkbox" name="scraping" className="rounded-md" required/><br />
                <p className="text-base">You promise to notify your users if you plan to shutdown or can no longer operate your instance with a 30 day notice so they can migrate elsewhere.</p>
                <input type="checkbox" name="notify" required/><br />
                <p className="text-base">Your instance actively moderates against hate speech, racism, homophobia, and cultures a safe community.</p>
                <input type="checkbox" name="safety" required/><br />
                <input type="hidden" name="_next" value="https://furryfediverse.org"></input>
                <button className="rounded-md bg-blue-300 p-3 font-bold text-gray-100" id="my-form-button">Submit</button>
                <p id="my-form-status"></p>
            </form>
            </div>
        </div>
    </div>
    </main>
)
}

export default AddInstance