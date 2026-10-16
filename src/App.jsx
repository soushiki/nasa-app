import { useEffect, useState } from 'react'

import Main from './components/Main'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

// The api.nasa.gov APOD endpoint is legacy; APOD now lives on NASA Science's WordPress API.
// It returns the latest entries (newest first) and needs no API key.
const APOD_URL = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";

// The WordPress API only links to the article on video days, so pull the
// actual video source out of the basic_html page it ships with each entry.
function findVideo(html){
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  const iframe = doc.querySelector('iframe[src]');
  const source = doc.querySelector('video source[src], video[src]');
  const src = source?.getAttribute('src') || iframe?.getAttribute('src');
  if(!src) return null;
  return {
    url: src.startsWith('//') ? `https:${src}` : src,
    kind: source ? 'file' : 'embed',
  };
}

function htmlToText(html){
  const text = new DOMParser().parseFromString(html || '', 'text/html').body.textContent || '';
  return text.replace(/^\s*Explanation:\s*/, '').trim();
}

function normalizeEntry(entry){
  const video = entry.media_type === 'video' ? findVideo(entry.basic_html) : null;
  return {
    date: entry.date,
    title: entry.title,
    explanation: htmlToText(entry.explanation),
    alt: entry.alt,
    permalink: entry.permalink,
    // on video days hdurl is a still frame, used as the background
    hdurl: entry.hdurl,
    // fall back to the still image if no playable video was found
    media_type: video ? 'video' : 'image',
    videoUrl: video?.url,
    videoKind: video?.kind,
  };
}

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  function handleToggleShowModal(){
    setShowModal(!showModal);
  }

  useEffect(()=>{
    async function fetchAPIData(){
      const today = (new Date()).toDateString();
      const localKey = `NASA-${today}`;
      const cached = localStorage.getItem(localKey);
      if(cached){
        try{
          const apiData = JSON.parse(cached);
          if(apiData?.media_type && apiData?.hdurl){
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
        const res = await fetch(APOD_URL);
        const body = await res.json().catch(() => null);
        if(!res.ok){
          // WordPress errors come back as { code, message }
          throw new Error(body?.message || `Request failed with status ${res.status}`);
        }
        const latest = Array.isArray(body) ? body[0] : null;
        if(!latest?.media_type || !latest?.hdurl){
          throw new Error('Unexpected response from the APOD API.');
        }
        const apiData = normalizeEntry(latest);
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
  },[]);

  return (
    <>
      {data?.hdurl && <img className='body-background' src={data.hdurl} alt={data?.alt || data?.title || 'bg-img' } />}
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
