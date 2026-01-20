import Image from 'next/image'
import React from 'react'

const Integrations = [
    {  name : "Slack", image  : "slack.png" },
    {  name : "Asana", image  : "asana.png" },
    {  name : "Jira", image  : "jira.png" },
    {  name : "Trello", image  : "trello.png" },
    {  name : "Google Calendar", image  : "gcal.png" }
]
const IntegrationSection = () => {
  return (
    <section className='py-20 bg-black'>
        <div className='max-w-6xl mx-auto px-4'>
            <div className='text-center mb-16'>
                <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
                    Seamless{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                        Integrations
                    </span>
                </h2>

                 <p className="text-lg  bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent">
                    Connect with the tools you already use & love 
                </p>
            </div>

            <div className='flex gap-10 items-center justify-center'>
                {Integrations.map((Integration, index)=>(
                    <div key={index}
                    className='text-center group cursor-pointer'
                    >
                        <div className='w-16 h-16 mx-auto mb-4 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-gray-800/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-gray-700'>
                        <Image src={`/${Integration.image}`} alt={`/${Integration.name}`} 
                        width={64}
                        height={64}
                        className='w-full h-full object-contain'
                        />

                        </div>
                        <p className='text-sm font-medium text-white'>{Integration.name}</p>
                    </div>
                ))}
            </div>
        </div>

    </section>
  )
}

export default IntegrationSection