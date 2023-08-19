import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Heading from "../components/Heading";
import { make_request } from "./authFunctions";
import Error from "../components/Error";
const Login = () => {

  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("Let's Go");
  const [buttonColor, setButtonColor] = useState("bg-indigo-500");
  const [authError, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim().length > 0 && password.trim().length > 0) {
      setButtonText("Logging into your account....");
      setTimeout(async () => {
        let url = "http://localhost:3000/auth/login";
        let body = {
          username,
          password
        }
        let method = "POST";
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
    <div className='h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-900 via-blue-900 to-pink-100"'>
    <Heading heading="Login Fast!! You have some pending messages" />
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
      <span className="text-pink-50 pt-2">
        Don't have an account{" "}
        <a href="/auth/register" className="text-pink-200">
          Register here
        </a>
      </span>
    </form>
  </div>
    </>
  );
};

export default Login;
