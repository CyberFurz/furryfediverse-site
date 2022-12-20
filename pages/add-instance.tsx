import Head from 'next/head'
import type { NextPage } from 'next'
import { useState } from 'react'

interface FormData {
    type: string
    uri: string
    nsfwflag: string
}

interface Message {
    message: string
}

const AddInstance: NextPage = () => {
    const [form, setForm] = useState<FormData>({type: '', uri: '', nsfwflag: ''})
    const [response, setResponse] = useState<Message>({message: ''})

    async function create(data: FormData) {
        try {
            fetch('http://localhost:3000/api/instances/add', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            })
            .then((res) => res.json())
            .then((data) => {
                setResponse(data)
            })
        } catch (err) {
            console.error(err)
        }
    }

    const handleFormSubmit = async (data: FormData) => {
        try {
            create(data)
        } catch (err) {
            console.error(err)
        }
    }

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
                <p className="text-lg bg-blue-900 px-2 text-gray-300 rounded-md">{response.message}</p>
            <form onSubmit={e => {
                e.preventDefault()
                handleFormSubmit(form)}}>
                <label className="text-2xl font-bold">Instance URI</label><br />
                <input type="text"
                 name="Instance URI"
                className="rounded-md"
                value={form.uri}
                onChange={e => setForm({...form, uri: e.target.value})} 
                required/><br />
                <label className="text-2xl font-bold">Type</label><br />
                <select id="type" name="type" onChange={e => 
                    setForm({...form, type: e.target.value})} >
                    <option value="general">General</option>
                    <option value="niche">Niche</option>
                </select><br />
                <label className="text-2xl font-bold">SFW/NSFW Level</label><br />
                <select id="type" name="nsfwflag" onChange={e => 
                    setForm({...form, nsfwflag: e.target.value})} >
                    <option value="sfw">SFW Only</option>
                    <option value="nsfw-allowed">NSFW Allowed</option>
                    <option value="nsfw-focus">NSFW Focus</option>
                </select><br />
                <label className="text-2xl font-bold">Agreements</label><br />
                <p className="text-base">You agree to allow FurryFediverse to scape your instance's endpoint "/api/v1/instance" for up to date information on your instance. We will not collect any other data from your instance.</p>
                <input type="checkbox" name="scraping" className="rounded-md" required/><br />
                <p className="text-base">You promise to notify your users if you plan to shutdown or can no longer operate your instance with a 30 day notice so they can migrate elsewhere.</p>
                <input type="checkbox" name="notify" required/><br />
                <p className="text-base">Your instance actively moderates against hate speech, racism, homophobia, and cultures a safe community.</p>
                <input type="checkbox" name="safety" required/><br />
                <button className="rounded-md bg-blue-300 p-3 font-bold text-gray-100" id="my-form-button">Submit</button>
            </form>
            </div>
        </div>
    </div>
    </main>
)
}

export default AddInstance