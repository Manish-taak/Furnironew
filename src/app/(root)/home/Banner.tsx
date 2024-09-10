import Link from 'next/link'
import React from 'react'
import Account from '../../../../public/icons/account'
import SvgIcon from '@/component/Icons'

const Banner = () => {
    return (
        <div>
            <h2>banner</h2>
            <Link href={"contact"} >sdsdsdsd</Link>
            <SvgIcon name="Account" width={32} height={32} fill="blue" />
        </div>
    )
}

export default Banner