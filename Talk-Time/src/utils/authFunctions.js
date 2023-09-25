import { make_request_without_body } from "./apiCalling";
import { checkAuthUrl } from "../routes/apiRoutes";

let currentUsername = undefined;
let currentUseremail = undefined;
let currentUserid = undefined;
let currentUserPhone = undefined;
const checkUserAuth = async ()=>{
    const response = await make_request_without_body("GET",checkAuthUrl);
    // console.log("From CheckUserAuth",response);
    if(response.status && response.data.status)
    {
        currentUseremail = response.data.email;
        currentUsername = response.data.username;
        currentUserid = response.data.id;
        currentUserPhone = response.data.phone;
    }
    // console.log("Response Here:- ",response)
    return response;
}

const verifyCookie = async (path,setLoad,navigate,to_navigate = true,redirect_url)=>{
    let response = await checkUserAuth();
    // console.log("From VerifyCookie",response)
    if (response.status && response.data.status) {
        // console.log("Everything Is Set")
            if(to_navigate)
            {
                navigate(path)
            }
            setLoad(false)
        }
        else {
            if(redirect_url!==undefined)
                navigate(redirect_url)
            // console.log("Remain Here")
            setLoad(false)
        }
}

export {checkUserAuth,verifyCookie,currentUseremail,currentUsername,currentUserid,currentUserPhone}