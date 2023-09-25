import React from "react";
import { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom"
import Heading from "../components/Heading";
import { make_request } from "../utils/apiCalling";
import Error from "../components/Error";
import { loginUrl } from "../routes/apiRoutes";
import { verifyCookie } from "../utils/authFunctions";
import Loader from "../components/Loader";
const Login = () => {

  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("Let's Go");
  const [authError, setError] = useState("")
  const [load, setLoad] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.trim().length>0 && phone.length<=10 && typeof(Number(phone))==="number" && password.trim().length > 0) {
      setButtonText("Logging into your account....");
      setTimeout(async () => {
        let url = loginUrl;
        let body = {
          searchValue: phone,
          password
        }
        let method = "POST";
        const response = await make_request(body, method, url);
        if (response.status && response.data.status) {
          setButtonText(response.data.message);
          navigate("/chat");
        }
        else
        {
          if(response.status)
          {
            setButtonText(response.data.message);
          }
        }
      }, 300);
    } else {
      alert("Either username or password is empty");
    }
  };
  useEffect(() => {
    setTimeout(() => {
      verifyCookie("/chat",setLoad,navigate,true);
    }, 500);
    setLoad(true);
  }, [])

  return (
    <>
      {load ? (<Loader />) : (
        <div className='h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-900 via-blue-900 to-pink-100"'>
          <Heading heading="Login Fast!! You have some pending messages" />
          {authError.length > 0 ? <Error authError={authError} /> : ""}
          <form className="w-64 mx-auto" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Phone"
              className="block w-full rounded-sm px-2 py-2 mb-3 rounded-lg"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setButtonText("Let's Go")
              }}
            />
            <input
              type="password"
              placeholder="Password...."
              className="block w-full rounded-sm px-2 py-2 mb-3 rounded-lg"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setButtonText("Let's Go")
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
      )}
    </>
  );
};

export default Login;
