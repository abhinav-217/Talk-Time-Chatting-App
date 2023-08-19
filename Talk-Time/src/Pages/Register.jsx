import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Heading from "../components/Heading";
import { make_request } from "./authFunctions";
import Error from "../components/Error";
const Register = () => {

  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [buttonText, setButtonText] = useState("Go on Register");
  const [authError, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim().length > 0 && password.trim().length > 0) {
      setButtonText("Creating your account....");
      setTimeout(async () => {
        let url = "http://localhost:3000/auth/register";
        let body = {
          username,
          password,
          email,
        }
        let method = "POST"
        const data = await make_request(body,method,url);
        console.log(data)
        if (data.status) {
          navigate("/");
        }
      }, 2000);
    } else {
      alert("Either username or password is empty");
    }
  };
  return (
    <>
    <div className='h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"'>
    <Heading heading="Register Yourself to start Chatting" />
    {authError.length>0 ? <Error authError = {authError}/>:""}
    <form className="w-64 mx-auto" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username...."
        className="block w-full rounded-sm px-2 py-2 mb-3 rounded-lg"
        value={username}
        onChange={(e) => {
          setusername(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Email...."
        className="block w-full rounded-sm px-2 py-2 mb-3 rounded-lg"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Password...."
        className="block w-full rounded-sm px-2 py-2 mb-3 rounded-lg"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button
        id="submit-btn"
        className="text-white block w-full rounded-full transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 p-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"
      >
        {buttonText}
      </button>
      <span className="text-pink-900 p-2">
        Already Registered{" "}
        <a href="/auth/login" className="text-pink-950">
          Login here
        </a>
      </span>
    </form>
  </div>
    </>
  );
};

export default Register;
