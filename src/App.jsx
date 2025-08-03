import { useEffect, useState } from 'react'

import Main from './components/Main'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
  const [showModal, setShowModal] = useState(false);
  function handleToggleShowModal(){
    setShowModal(!showModal);
  }

  useEffect(()=>{
    async function fetchAPIData(){
      const url = "https://api.nasa.gov/planetary/apod" + `?api_key=${NASA_KEY}`;
      const today = (new Date()).toDateString();
      const localKey = `NASA-${today}`;
      if(localStorage.getItem(localKey)){
        const apiData  = JSON.parse(localStorage.getItem(localKey));
        setData(apiData);
        console.log('fetch from cache today');
        return 
      }
      localStorage.clear();   

      try{
        setLoading(true);
          const res = await fetch(url);
          const apiData = await res.json();
          localStorage.setItem(localKey, JSON.stringify(apiData));
          setData(apiData);
          console.log('fetch from api today');
      }
      catch(err){
          console.log(err.message);
      }

      finally{
        setLoading(false);
      }
    }
    fetchAPIData();
  },[]);

  return (
    <>
      <img className='body-background' src={data?.hdurl} alt={data?.title || 'bg-img' } />
      <div className='body-gradient'></div>
      {data ? (<Main data={data} />) : 
          <div className="loadingState">
            <i className="fa-solid fa-gear"></i>
          </div>}
      {showModal && (<Sidebar data={data}  showModal = {handleToggleShowModal}/>)}
      { data && (<Footer data={data} showModal = {handleToggleShowModal} />)}
    </>
  )
}

export default App
