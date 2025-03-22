import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebars';
import '../assets/sidebar.css';

// show components in page
const MicrographPage = () => {
    return (
        <div className='MicrographView'>
            <Sidebar />
        </div>
    )
}

export default MicrographPage;