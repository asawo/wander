import Link from 'next/link';
import React from 'react';
import styled from "styled-components";

const HeaderWrapper = styled.div({
    height: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 24px'
})
const Header = () => {

    return <HeaderWrapper>
        <Link href={'/'}>
            <a>
                Wander 🐶
            </a>
        </Link>
        <p>Search Bar Here</p>
        <p>User</p>
    </HeaderWrapper>
}

export default Header
