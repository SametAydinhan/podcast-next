import React from 'react'

const PodcastDetils = ({params}: {params: {podcastId: string}}) => {
  return (
    <p className='text-white-1'>
      PodcastDeatils for {params.podcastId}
    </p>
  )
}

export default PodcastDetils
