import React from 'react'
import SvgIcon from './Icons'

const Benefits = () => {
    const data = [
        {
            tittle:"High Quality",
            description:"crafted from top materials",
            icon:"Trophy"
        },
        {
            tittle:"Warranty Protection",
            description:"Over 2 years",
            icon:"Warranty"
        },
        {
            tittle:"Free Shipping",
            description:"Order over 150 $",
            icon:"Shipping"
        },
        {
            tittle:"24 / 7 Support",
            description:"Dedicated support",
            icon:"Contact"
        },
    ]
  return (
<>
<section className='bg-creambg_4 py-[70px] md:py-[100px] '>
<div className='max-w-[1404px] px-5 w-full my-[0] mx-[auto] grid grid-cols-1 gap-y-5 tablet:grid-cols-2 lg:grid-cols-3  xl:flex justify-between items-center'>
    {
        data.map((item,index)=>{
            return(
                <>
                <div className='flex gap-x-[10px] w-full'>
   {/* <SvgIcon className='max-w-[60px] w-full max-h-[60px] h-full my-[5px]' name={item.icon}/> */}
    <div>
        <h2 className='heading_20  tablet:heading_25 text-black'>{item.tittle}</h2>
        <p className='heading_16 tablet:heading_20 text-bg_gray'>{item.description}</p>
    </div>
</div>
                </>
            )
        })
    }
{/* <div className='flex gap-x-[10px] w-full'>
   <SvgIcon className='max-w-[60px] w-full max-h-[60px] h-full my-[5px]' name='Trophy'/>
    <div>
        <h2 className='heading_25 text-black'>High Quality</h2>
        <p className='heading_20 text-bg_gray'>crafted from top materials</p>
    </div>
</div> */}
{/* <div className='flex gap-x-[10px] w-full'>
   <SvgIcon className='max-w-[60px] w-full max-h-[60px] h-full my-[5px]' name='Warranty'/>
    <div>
        <h2 className='heading_25 text-black'>Warranty Protection</h2>
        <p className='heading_20 text-bg_gray'>Over 2 years</p>
    </div>
</div>
<div className='flex gap-x-[10px] w-full'>
   <SvgIcon className='max-w-[60px] w-full max-h-[60px] h-full my-[5px]' name='Shipping'/>
    <div>
        <h2 className='heading_25 text-black'>Free Shipping</h2>
        <p className='heading_20 text-bg_gray'>Order over 150 $</p>
    </div>
</div>
<div className='flex gap-x-[10px] w-full'>
   <SvgIcon className='max-w-[60px] w-full max-h-[60px] h-full my-[5px]' name='Contact'/>
    <div>
        <h2 className='heading_25 text-black'>24 / 7 Support</h2>
        <p className='heading_20 text-bg_gray'>Dedicated support</p>
    </div>
</div> */}
</div>
</section>
</>
  )
}

export default Benefits