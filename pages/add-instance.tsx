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
    type: string
}

const AddInstance: NextPage = () => {
    const [form, setForm] = useState<FormData>({
        type: '',
        uri: '',
        nsfwflag: '',
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
        <main className="p-2 md:p-5 lg:px-60 2xl:px-80">
            <Head>
                <title>The Furry Fediverse - Add Server</title>
                <link
                    rel="icon"
                    href="/favicon.ico"
                />
            </Head>
            <p className="text-4xl text-gray-300 dark:text-gray-200">
                The Furry Fediverse
            </p>
            <div className="flex flex-col">
                <div className="py-4">
                    <div className="bg-gray-400 text-slate-800 rounded-md p-3">
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
                            </div>

                            <div className="divider"></div>
                            <div className="px-8 mb-8">
                                <label className="label">
                                    <span className="label-text text-2xl font-bold">
                                        Agreements
                                    </span>
                                </label>
                                <div className="flex items-center gap-x-4">
                                    <input
                                        type="checkbox"
                                        name="scraping"
                                        className="checkbox checkbox-primary"
                                        required
                                    />
                                    <span className="text-base">
                                        You agree to allow FurryFediverse to
                                        scape your instance's endpoint
                                        "/api/v1/instance" for up to date
                                        information on your instance. We will
                                        not collect any other data from your
                                        instance.
                                    </span>
                                </div>
                                <br />
                                <div className="flex items-center gap-x-4">
                                    <input
                                        type="checkbox"
                                        name="notify"
                                        className="checkbox checkbox-primary"
                                        required
                                    />
                                    <span className="text-base">
                                        You promise to notify your users if you
                                        plan to shutdown or can no longer
                                        operate your instance with a 30 day
                                        notice so they can migrate elsewhere.
                                    </span>
                                </div>
                                <br />

                                <div className="flex items-center gap-x-4">
                                    <input
                                        type="checkbox"
                                        name="safety"
                                        className="checkbox checkbox-primary"
                                        required
                                    />
                                    <span className="text-base">
                                        Your instance actively moderates against
                                        hate speech, racism, homophobia, and
                                        cultures a safe community.
                                    </span>
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
