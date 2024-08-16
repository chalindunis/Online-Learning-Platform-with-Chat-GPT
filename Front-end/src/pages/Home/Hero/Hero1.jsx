import React from 'react'

import bgImg from '../../../assets/home/banner-1.jpg'

const Hero1 = () => {
  return (
    <div className='min-h-screen bg-cover' style={{backgroundImage: `url(${bgImg})`}}>
        <div className='min-h-screen flex justify-start pl-11 items-center text-white bg-black bg-opacity-60'>
            <div>
                <div className='space-y-4'>
                    <p className='md:text-4xl text-2xl'> We Provide</p>
                    <h1 className='md:text-7xl text-4xl font-bold'>Best Platform for Online Courses</h1>
                    <div className='md:w-1/2'>
                        <p>Everything you need to know find out with us. You can gain knowledge about new technologies and hands-on experiences. Welcome to explore the world!?</p>
                    </div>
                    <div className='flex flex-wrap items-center gap-5'>
                        <button className='px-7 py-3 rounded-lg bg-secondary font-bold uppercase'>Join</button>
                        <button className='px-7 py-3 rounded-lg border font-bold uppercase'>View Courses</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero1