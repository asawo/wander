import * as React from 'react';
import styled from 'styled-components';
import '../public/global.css'
import IndexPage from "./index";

const App = ({Component, pageProps}: { Component: any; pageProps: any }) => {

    return <>
        <IndexPage/>
        </>
};

export default App
