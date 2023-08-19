export async function make_request(body,method,url)
{
    const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        credentials:"include",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      let data = await res.json();
      return JSON.parse(data);
}