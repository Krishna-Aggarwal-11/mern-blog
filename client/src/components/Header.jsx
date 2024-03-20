import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon , FaSun} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import { logout } from "../redux/user/userSlice.js";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const Navigate = useNavigate();
  const { currentUser: user } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [searchTerm , setSearchTerm] = useState('');

  useEffect(()=>{
    const  urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search])

  const handleLogout = async()=>{
    try {
      const res = await fetch('/api/user/logout',{
        method:'POST',
      });
      const data = await res.json();;
      if (!res.ok) {
        console.log(data.errorMessage)
      }else{
        dispatch(logout(data));
      }
    } catch (error) {
      
    }
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm' , searchTerm);
    Navigate(`/search?${urlParams.toString()}`);
  }


  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg ">
          Blog
        </span>
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline "
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
        />
      <Button className="w-12 h-10 lg:hidden" color="gray">
        <AiOutlineSearch />
      </Button>
      </form>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </Button>
        {user ? (
          <Dropdown arrowIcon={false} inline label={
            <Avatar alt="user" img={user.profilePic} rounded />
          } >
            <Dropdown.Header>
              <span className="block text-sm">@{user.username}</span>
              <span className="block text-sm font-medium truncate">{user.email}</span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider/>
            <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/login"}>
            <Button className="w-12 h-10" color="gray" pill>
              Login
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"}>Project</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
