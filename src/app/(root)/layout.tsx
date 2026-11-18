import Header from '@/components/shared/header';
import Navbar from '@/components/shared/navbar';
import React from 'react';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>

        <Header></Header>
        <Navbar></Navbar>
        {children}
        </>
    );
};

export default RootLayout;