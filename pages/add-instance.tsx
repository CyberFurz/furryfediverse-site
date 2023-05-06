import Head from 'next/head'
import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'

interface FormData {
    type: string
    uri: string
    nsfwflag: string
    api_mode: string
}

interface Message {
    message: string
    type: string
}

const AddInstance: NextPage = () => {
    const [form, setForm] = useState<FormData>({
        type: '',
        uri: '',
        nsfwflag: '',
        api_mode: '',
    })
    const [response, setResponse] = useState<Message>({ message: '', type: '' })

    async function create(data: FormData) {
        try {
            fetch('/api/instances/add', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
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
            data.type = data.type != '' ? data.type : 'general'
            data.uri = data.uri.replace(/^https?:\/\//, '')
            data.nsfwflag = data.nsfwflag != '' ? data.nsfwflag : 'sfw'
            create(data)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <main>
            <Head>
                <title>The Furry Fediverse - Add Server</title>
                <link
                    rel="icon"
                    href="/favicon.ico"
                />
            </Head>
            <div className="flex flex-col">
                <div className="card bg-base-100 mt-4 overflow-clip">
                    <div className="text-sm breadcrumbs absolute ml-4">
                        <ul>
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="#">Add Instance</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body">
                        <div
                            className={`alert shadow-lg ${
                                response.type == ''
                                    ? 'hidden'
                                    : response.type === 'success'
                                    ? 'alert-success'
                                    : 'alert-error'
                            }`}
                        >
                            <div>
                                {response.type === 'success' ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current flex-shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current flex-shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )}
                                <span>{response.message}</span>
                            </div>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleFormSubmit(form)
                            }}
                        >
                            <div className="flex flex-row justify-evenly flex-wrap mb-8 mx-auto">
                                <div>
                                    <label className="label">
                                        <span className="label-text text-2xl font-bold">
                                            Instance URI
                                        </span>
                                    </label>
                                    <label className="input-group">
                                        <span>https://</span>
                                        <input
                                            type="text"
                                            name="Instance URI"
                                            placeholder="example.social"
                                            className="input input-bordered"
                                            value={form.uri}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    uri: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text text-2xl font-bold">
                                            Type
                                        </span>
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        className="select select-bordered w-full max-w-xs"
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                type: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="general">General</option>
                                        <option value="niche">Focused</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text text-2xl font-bold">
                                            SFW/NSFW Level
                                        </span>
                                    </label>
                                    <select
                                        id="type"
                                        name="nsfwflag"
                                        className="select select-bordered w-full max-w-xs"
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                nsfwflag: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="sfw">SFW Only</option>
                                        <option value="nsfw-allowed">
                                            NSFW Allowed
                                        </option>
                                        <option value="nsfw-focus">
                                            NSFW Focus
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text text-2xl font-bold">
                                            Software API
                                        </span>
                                    </label>
                                    <select
                                        id="type"
                                        name="nsfwflag"
                                        className="select select-bordered w-full max-w-xs"
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                api_mode: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="mastodon">
                                            Mastodon API
                                        </option>
                                        <option value="misskey">
                                            Misskey API
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="divider"></div>
                            <div className="px-8 mb-8">
                                <label className="label">
                                    <span className="label-text text-2xl font-bold">
                                        Agreements
                                    </span>
                                </label>
                                <div className="flex items-center gap-x-4">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="scraping"
                                            className="checkbox checkbox-primary"
                                            required
                                        />
                                        <span className="ml-4 text-base">
                                            You agree to allow FurryFediverse to
                                            scrape your instance's endpoint
                                            "/api/v1/instance" for up-to-date
                                            information on your instance. We
                                            will not collect any other data from
                                            your instance.
                                        </span>
                                    </label>
                                </div>
                                <br />
                                <div className="flex items-center gap-x-4">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="notify"
                                            className="checkbox checkbox-primary"
                                            required
                                        />
                                        <span className="ml-4 text-base">
                                            You promise to notify your users if
                                            you plan to shut down or can no
                                            longer operate your instance, with a
                                            30-day notice, so they can migrate
                                            elsewhere.
                                        </span>
                                    </label>
                                </div>
                                <br />

                                <div className="flex items-center gap-x-4">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="safety"
                                            className="checkbox checkbox-primary"
                                            required
                                        />
                                        <span className="ml-4 text-base">
                                            Your instance actively moderates
                                            against hate speech, racism,
                                            homophobia, and cultures a safe
                                            community.
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <button
                                className="btn btn-primary w-full"
                                id="my-form-button"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AddInstance
