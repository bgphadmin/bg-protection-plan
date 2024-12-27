'use client'
import React from 'react';

const HeaderTitle = ({ Icon, title }: { Icon: React.ElementType, title: string }) => {
    return (
        <div className="container flex flex-col items-center justify-center min-w-screen">
            <section className="heading">
                <h1 className='text-2xl font-bold my-8 dark:text-blue-200 flex items-center'>
                    {Icon && <Icon className='mr-2' />}
                    {title}
                </h1>
            </section>
        </div>
    );
};

export default HeaderTitle;