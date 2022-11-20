import { getRuntime } from "@astrojs/cloudflare/runtime";

getRuntime(Astro.request);

async function getInstanceData(instance) {
  const resp = await fetch('https://' + instance + '/api/v1/instance').then((response) =>
    response.json()
  )
  return resp
}


const InstanceData = async (props) =>  {
  const data = await getInstanceData(props.uri)
  return (<div class="bg-slate-600 text-zinc-200 p-1 flex flex-col rounded-md border-4 border-solid border-slate-600 space-y-2">
    <div><img src={data.thumbnail} class="rounded-md" height="630" style="height: 200px; width: 100%; object-fit: cover;"/></div>
    <div class="flex flex-col justify-between space-y-4 h-full">
      <div class="flex flex-col space-y-2">
        <p class="font-bold text-2xl mx-4">{data.title}</p>
        <p class="mx-4">{data.description}</p>
      </div>
      <div class="flex flex-col">
        <p class="mx-4 py-1 text-lg italic"><i class="fa-solid fa-key"></i> {(data.registrations) ? 'Registrations Open' : 'Registrations Closed' } {(data.approval_required) ? 'With Approval Required' : ''}</p>
        <p class="mx-4 py-1 text-lg"><i class="fa-solid fa-users"></i></p>
        <a href={'https://'+data.uri} class="p-3 mt-3 bg-sky-500 text-gray-100 rounded-md font-bold" target="_blank">Visit Instance</a>
      </div>
      
    </div>
  </div>)

};

export default InstanceData