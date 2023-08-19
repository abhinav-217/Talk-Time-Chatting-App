import { make_request_without_body } from "./apiCalling";
import { checkAuthUrl } from "../routes/apiRoutes";
const checkUserAuth = async ()=>{
    const response = await make_request_without_body("GET",checkAuthUrl);
    // console.log(response);
    return response;
}

const verifyCookie = async (path,setLoad,navigate,to_navigate = true,redirect_url)=>{
    let response = await checkUserAuth();
        console.log(response)
        if (response.status && response.data.status) {
            console.log("Everything Is Set")
            if(to_navigate)
            {
                navigate(path)
            }
            setLoad(false)
        }
        else {
            if(redirect_url!==undefined)
                navigate(redirect_url)
            console.log("Remain Here")
            setLoad(false)
        }
}

export {checkUserAuth,verifyCookie}