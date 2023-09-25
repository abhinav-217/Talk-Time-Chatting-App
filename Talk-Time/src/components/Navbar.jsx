import React, { useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
const Navbar = ({ currentUserPhone, currentUseremail, addPeopleOnClick, currentUsername, navbar, setNavbar, addPeopleText }) => {

    const logoutUser = () => {
        // console.log("Logging out the user")
        // console.log(document.cookie)
        document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        window.location.reload();
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <nav className="w-1/3 bg-zinc-700 shadow relative sticky-top-0">
                <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
                    <div className='flex gap-4'>
                        <div className="flex items-center justify-between py-3 md:py-5 md:block">
                            <div>
                                <div>
                                    <div class="loader">
                                        <div class="loader_cube loader_cube--color"></div>
                                        <div class="loader_cube loader_cube--glowing"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-3 md:py-5 md:block">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Talk-Time</h2>
                            </div>
                        </div>
                    </div>
                    <div>
                        {
                            <div
                                className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"
                                    }`}
                            >
                                <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                                    <li className="text-gray-600 hover:text-blue-600 cursor-pointer text-white"
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                        </svg>
                                    </li>
                                </ul>
                            </div>
                        }
                    </div>
                </div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem>{currentUsername}</MenuItem>
                    <MenuItem>{currentUserPhone}</MenuItem>
                    <MenuItem onClick={logoutUser}>Logout</MenuItem>
                    <MenuItem onClick={addPeopleOnClick}>Add People!</MenuItem>
                </Menu>
            </nav>
        </>
    )
}

export default Navbar
