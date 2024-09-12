import React from 'react'
import SvgIcon from '../Icons'

const Header = () => {
    return (
        <div>
            <h1 className='text-red-600' >
                header
            </h1>
            <SvgIcon className='[&>*]:fill-orange-500' name='Account' fill='red' />
            <SvgIcon className='[&>*]:fill-slate-200' name='Cart' fill='red' />
        </div>
    )
}

export default Header