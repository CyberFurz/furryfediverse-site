import Head from 'next/head'
import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import { prisma } from "../lib/prisma"
import { sortInstances } from "../lib/instance-array-tools"

interface FormData {
    contact: string
    uri: string
    report: string
}

interface Message {
    message: string
    type: string
}

const ReportInstance: NextPage = ({ instances }: any) => {
    const [form, setForm] = useState<FormData>({
        contact: '',
        uri: '',
        report: ''
    })
    
    const [response, setResponse] = useState<Message>({ message: '', type: '' })
    
    async function report(data: FormData) {
        try {
            fetch('/api/instances/report', {
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
            report(data)
        } catch (err) {
            console.error(err)
        }
    }
    
    return (
        <main>
            <Head>
                <title>The Furry Fediverse - Add Server</title>
                <link
                    rel='icon'
                    href='/favicon.ico'
                />
            </Head>
            <div className='flex flex-col'>
                <div className='card bg-base-100 mt-4 overflow-clip'>
                    <div className='text-sm breadcrumbs absolute ml-4'>
                        <ul>
                            <li>
                                <Link href='/'>Home</Link>
                            </li>
                            <li>
                                <Link href='#'>Report Instance</Link>
                            </li>
                        </ul>
                    </div>
                    <div className='card-body'>
                        <div
                            className={ `alert shadow-lg ${
                                response.type == ''
                                    ? 'hidden'
                                    : response.type === 'success'
                                        ? 'alert-success'
                                        : 'alert-error'
                            }` }
                        >
                            <div>
                                { response.type === 'success' ? (
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='stroke-current flex-shrink-0 h-6 w-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                            stroke-width='2'
                                            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='stroke-current flex-shrink-0 h-6 w-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                                        />
                                    </svg>
                                ) }
                                <span>{ response.message }</span>
                            </div>
                        </div>
                        <form
                            onSubmit={ (e) => {
                                e.preventDefault()
                                handleFormSubmit(form)
                            } }
                        >
                            <div className='flex flex-col columns-1 justify-start mb-8 mx-auto'>
                                <div>
                                    <label className='label'>
                                        <span className='label-text text-2xl font-bold'>
                                            Contact
                                        </span>
                                    </label>
                                    <input
                                        type='text'
                                        name='Instance URI'
                                        placeholder='@joedoe@example.social'
                                        className='input input-bordered'
                                        value={ form.contact }
                                        onChange={ (e) =>
                                            setForm({
                                                ...form,
                                                contact: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='label'>
                                        <span className='label-text text-2xl font-bold'>
                                            Instance
                                        </span>
                                    </label>
                                    <select
                                        id='type'
                                        name='type'
                                        className='select select-bordered w-full max-w-xs'
                                        onChange={ (e) =>
                                            setForm({
                                                ...form,
                                                uri: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value=''>Choose one...</option>
                                        { instances.map(
                                            (data: {
                                                uri: any
                                            }) => (
                                                <option value={ data.uri }>{ data.uri }</option>
                                            )
                                        ) }
                                    </select>
                                </div>
                                
                                <div>
                                    <label className='label'>
                                        <span className='label-text text-2xl font-bold'>
                                            Report
                                        </span>
                                    </label>
                                    <textarea className='textarea textarea-bordered w-full min-h-'
                                              placeholder='Report...'
                                              onChange={ (e) =>
                                                  setForm({
                                                      ...form,
                                                      report: e.target.value,
                                                  })
                                              }
                                              required></textarea>
                                </div>
                            </div>
                            <div className='divider'></div>
                            <div className='px-8 mb-8'>
                                <label className='label'>
                                    <span className='label-text text-2xl font-bold'>
                                        Agreements
                                    </span>
                                </label>
                                <br />
                                <div className='flex items-center gap-x-4'>
                                    <label className='label cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            name='notify'
                                            className='checkbox checkbox-primary'
                                            required
                                        />
                                        <span className='ml-4 text-base'>
                                            You have double checked all information
                                            provided and verify that it is both
                                            correct and truthful.
                                        </span>
                                    </label>
                                </div>
                                <br />
                                <div className='flex items-center gap-x-4'>
                                    <label className='label cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            name='notify'
                                            className='checkbox checkbox-primary'
                                            required
                                        />
                                        <span className='ml-4 text-base'>
                                            You agree to be contacted by site
                                            operators/maintainers for confirmation,
                                            details, etc. about your report.
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <button
                                className='btn btn-primary w-full'
                                id='my-form-button'
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

export async function getStaticProps() {
    // Interface pre-requisites
    
    // Fetch data from external API
    const instances = await prisma.instances.findMany({
        where: { verified: true },
    })
    
    sortInstances(instances)
    
    return {
        props: {
            instances: instances,
        },
        revalidate: 60,
    }
}

export default ReportInstance
