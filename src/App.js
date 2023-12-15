// import CircularProgress from '@mui/material/CircularProgress';
import './App.css';
import {useEffect, useState} from 'react'
import axios from 'axios'


function App() {

  const [error,setError] = useState("false")
  const [responseData,setResponseData] = useState()
  const [fetchedTill,setFetchedTill] = useState(0)

  const calculateTotalMarketCap = () => {
    const xyz = responseData.map((elem)=>elem.marketCapUsd)
    // console.log(xyz);
    const total = xyz.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue),
      0,
    );

    return (total >=10e12 ? (total/1e12.toFixed(2)+"T") : total >=10e9 ? (Number(total/1e9).toFixed(2)+"B") : total >=10e6 ? (Number(total/1e6).toFixed(2)+"M") : total)
      
  };
  


  const fetchData = async (value)=>{
    try{
      const API = `https://api.coincap.io/v2/assets?limit=${value}`
      const response = await axios.get(API)
      setFetchedTill(fetchedTill+20)

      if(response.status === 200 ){
        
        setError(false);
        setResponseData(response.data.data);
      }
     
    }
    catch(error){
      error.response.status === 404 && setError(true)
    }
    
   
  }
  
  const viewMore = ()=>{
    fetchData(fetchedTill+20)
    setFetchedTill(fetchedTill+20)

  }


  useEffect(()=>{
    fetchData(20)
  }, [])

  return (
    <>
    <p className="desc"><img src="https://coincap.io/static/logos/ss-mark-white.svg"/> Buy, sell, & swap your favorite assets. No KYC. No added fees. Decentralized.</p>
    <div className="above" >
      <div>
        <div className="row">MARKET CAP</div>
        <div className="row d-flex justify-content-center">${!error && calculateTotalMarketCap()}</div>
      </div> 

       <div>
        <div className="row">EXCHANGE VOL</div>
        <div className="row d-flex justify-content-center">$42.71B</div>
      </div> 

       <div>
        <div className="row">ASSESTS</div>
        <div className="row d-flex justify-content-center">{!error && responseData.length}</div>
      </div> 

       <div>
        <div className="row">EXCHANGES</div>
        <div className="row d-flex justify-content-center">73</div>
      </div> 

       <div>
        <div className="row">MARKETS</div>
        <div className="row d-flex justify-content-center">9,238</div>
      </div> 

       <div>
        <div className="row">BTC DOT INDEX</div>
        <div className="row d-flex justify-content-center">52.2%</div>
      </div>     
  </div>

    <div className="app" >

      {/* {error && <CircularProgress />}    */}

      {!error && 
      <table className="table table-hover" >
       <thead className="table-light">
         <tr className="head align-middle">
           <td>Rank</td>
           <td>Name</td>
           <td>Price</td>
           <td>Market Cap</td>
           <td>VWAP(24 hrs)</td>
           <td>Supply</td>
           <td>Volume (24hrs)</td>
           <td>Change (24hrs)</td>
         </tr>
       </thead>
       <tbody>

      {  responseData.map((item,idx)=>{ 
          return(
          <tr key={idx} className="bodyTable align-middle">
          <td>{item.rank}</td>
          <td>
          <div className="row"> 
            <div className="col">
              <img src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} alt="logo" width="40px" height="40px" className="image" />
            </div>
            <div className="col">
              <div className="row name">{item.name}</div>
              <div className="row symbol">{item.symbol}</div>
            </div>
          </div>
          </td>

          <td>${Number(item.priceUsd).toFixed(2)}</td>
          <td>${item.marketCapUsd >= 1e9 ? (item.marketCapUsd / 1e9).toFixed(2) + 'B' : item.marketCapUsd >= 1e6 ? (item.marketCapUsd / 1e6).toFixed(2) + 'M' : Math.round(item.marketCapUsd*100)/100}</td>
          <td>${Number(item.vwap24Hr).toFixed(2)}</td>
          <td>{item.supply >= 1e9 ? (item.supply / 1e9).toFixed(2) + 'B' : item.supply >= 1e6 ? (item.supply / 1e6).toFixed(2) + 'M' : Math.round(item.supply*100)/100}</td>
          <td>${item.volumeUsd24Hr >= 1e9 ? (item.volumeUsd24Hr / 1e9).toFixed(2) + 'B' : item.volumeUsd24Hr >= 1e6 ? (item.volumeUsd24Hr / 1e6).toFixed(2) + 'M' : Math.round(item.volumeUsd24Hr*100)/100}</td>
          <td className = {Number(item.changePercent24Hr).toFixed(2) > 0 ? "positive" : "negative"}>{Number(item.changePercent24Hr).toFixed(2)}%</td>
        </tr>)
        })}
         
       </tbody>
       </table>  
          
      }

      <div style={{display: "flex", justifyContent:'center'}}>
      <button className="viewMoreButton btn btn-success" onClick={viewMore}>View more</button>
      </div>


    </div>
    
    
    </>
  );
}

export default App;
