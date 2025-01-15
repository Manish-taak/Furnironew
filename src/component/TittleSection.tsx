import React from 'react'
import SvgIcon from './Icons'
// import Banner from "@/../public/images/Rectangle.png"
const TittleSection = () => {
  return (
   <>
   <section className={`bg-[url('../../public/images/Rectangle.png')] bg-no-repeat bg-center bg-cover
     h-[316px] grid place-content-center `} >
        <div className='flex justify-center flex-col items-center'>
<SvgIcon className='w-[77px] h-[77px]' name='Logo' />
<h2 className='heading_48'>Shop</h2>
        </div>
   </section>
   </>
  )
}

export default TittleSection