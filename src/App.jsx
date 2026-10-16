import { useEffect, useState } from 'react'

import Main from './components/Main'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
  const [showModal, setShowModal] = useState(false);
  function handleToggleShowModal(){
    setShowModal(!showModal);
  }

  useEffect(()=>{
    async function fetchAPIData(){
      // thumbs=true asks the API for a thumbnail_url on video days
      const url = "https://api.nasa.gov/planetary/apod" + `?api_key=${NASA_KEY}&thumbs=true`;
      const today = (new Date()).toDateString();
      const localKey = `NASA-${today}`;
      const cached = localStorage.getItem(localKey);
      if(cached){
        try{
          const apiData = JSON.parse(cached);
          if(apiData?.media_type){
            setData(apiData);
            console.log('fetch from cache today');
            return
          }
        }
        catch{
          // corrupted cache entry, fall through and refetch
        }
      }
      localStorage.clear();

      try{
        setError(null);
        if(!NASA_KEY){
          throw new Error('Missing VITE_NASA_API_KEY environment variable.');
        }
        const res = await fetch(url);
        const apiData = await res.json().catch(() => null);
        if(!res.ok){
          // APOD returns errors as { error: { message } } or { msg }
          const message = apiData?.error?.message || apiData?.msg || `Request failed with status ${res.status}`;
          throw new Error(message);
        }
        if(!apiData?.media_type){
          throw new Error('Unexpected response from the APOD API.');
        }
        // only cache successful responses so a failed call is retried next load
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData);
        console.log('fetch from api today');
      }
      catch(err){
        console.log(err.message);
        setError(err.message);
      }
    }
    fetchAPIData();
  },[NASA_KEY]);

  const backgroundSrc = data?.media_type === 'video' ? data?.thumbnail_url : (data?.hdurl || data?.url);

  return (
    <>
      {backgroundSrc && <img className='body-background' src={backgroundSrc} alt={data?.title || 'bg-img' } />}
      <div className='body-gradient'></div>
      {data ? (<Main data={data} />) : error ? (
          <div className="loadingState errorState">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p>Couldn't load today's picture: {error}</p>
          </div>
        ) :
          <div className="loadingState">
            <i className="fa-solid fa-gear"></i>
          </div>}
      {showModal && (<Sidebar data={data}  showModal = {handleToggleShowModal}/>)}
      { data && (<Footer data={data} showModal = {handleToggleShowModal} />)}
    </>
  )
}

export default App
