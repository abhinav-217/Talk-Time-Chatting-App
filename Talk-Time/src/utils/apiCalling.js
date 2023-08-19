export async function make_request(body,method,url)
{
    try {
      const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        credentials:"include",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      let data = await res.json();
      return {status:true,data:JSON.parse(data)};
    } catch (error) {
      return {error:error,message:"Error Occured While Making Request",status:false};
    }
}

export async function make_request_without_body(method,url)
{
  try {
    const res = await fetch (url,{
      method,
      credentials:"include",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    let data = await res.json();
    return {status:true,data:JSON.parse(data)};
  } catch (error) {
    return {error:error,message:"Error Occured While Making Request",status:false};
  }
}