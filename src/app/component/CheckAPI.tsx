'use client'

const CheckAPI = ({ access_token }: {access_token: string | undefined}) => {

  const fetch_public_api = async () => {
    const res = await fetch('http://localhost:8888/');
    console.log(res.status);
    const json = await res.json();
    console.log(json);
  };
  const fetch_private_api = async () => {
    const res = await fetch('http://localhost:8888/check-rds', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    console.log(res.status);
    const json = await res.json();
    console.log(json);
  };

  return (
    <>
      <button onClick={fetch_public_api}>public api</button><br/>
      <button onClick={fetch_private_api}>private api</button>
    </>
  )
}

export default CheckAPI;