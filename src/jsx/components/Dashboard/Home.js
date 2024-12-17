import React, { Fragment, useContext, useEffect, useState } from 'react';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from "react-bootstrap";
import { baseURL_ } from '../../../config'
import { subMonths } from 'date-fns'
import { ThemeContext } from '../../../context/ThemeContext';
import { Logout } from '../../../store/actions/AuthActions';
import axiosInstance from '../../../services/AxiosInstance';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { translations } from './Hometranslations';
import { LanguageContext, LanguageProvider } from './LanguageContext';


const Doughnutchart = loadable(() =>
  pMinDelay(import("./../Karciz/Dashboard/Doughnutchart"), 1000)
);
const SellingApexChart = loadable(() =>
  pMinDelay(import("./../Karciz/EventPage/SellingApexChart"), 1000)
);
const HomeSalesRevenueChart = loadable(() =>
  pMinDelay(import("./../Karciz/Dashboard/HomeSalesRevenueChart"), 1000)
);

function Home({ language ,country}) {
  const { changeBackground, changeTitle } = useContext(ThemeContext);
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [access, setAccess] = useState(localStorage.getItem(`_dash`) || '3ts')
  // const [country, setCountry] = useState(localStorage.getItem(`_country`) || 'Rwanda')
  const [showexports, setshowexports] = useState(true)
  const [showassessments, setshowassessments] = useState(true)
  const [showincidents, setshowincidents] = useState(true)
  const [incidents, setincidents] = useState([])
  const [rates, setrates] = useState({
    "USDLME-TIN": "",
    "USDTIN": "",
    "USDTIN3M": ""
  })
  const [loading, setloading] = useState(true)
  const [exportweight, setexportweight] = useState(0)
  const months = [
    subMonths(new Date(), 6).toString().substring(4, 7),
    subMonths(new Date(), 5).toString().substring(4, 7),
    subMonths(new Date(), 4).toString().substring(4, 7),
    subMonths(new Date(), 3).toString().substring(4, 7),
    subMonths(new Date(), 2).toString().substring(4, 7),
    subMonths(new Date(), 1).toString().substring(4, 7)
  ]
  const [series1, setseries1] = useState([])
  const [series2, setseries2] = useState([])
  const [series3, setseries3] = useState([])
  const [total1, settotal1] = useState(0)
  const [total2, settotal2] = useState(0)
  const [total3, settotal3] = useState(0)
  const [apex, setapex] = useState({
    keys: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    values: [0, 0, 0, 0, 0, 0, 0]
  })
  const [filter, setfilter] = useState(0)
  const user = JSON.parse(localStorage.getItem(`_authUsr`))
  const [dropdown, setDropdown] = useState([])
  const [dropdown_, setDropdown_] = useState([])

  const t = (key) => {
    if (!translations[language]) {
      console.warn(`Translation for language "${language}" not found`);
      return key;
    }
    return translations[language][key] || key;
  };

  const loadCard = async(selection) => {
    if(user?.type !== 'minexx'){
      return
    }
    axiosInstance.get(`${baseURL_}/admin/${selection}`).then(response=>{
      setapex({
        keys: Object.keys(response.data).slice(1).reverse(),
        values: Object.values(response.data).slice(1).reverse()
      })
    }).catch(err=>{
      try{
        if(err.response.code === 403){
          dispatch(Logout(navigate))
        }else{
          toast.warn(err.response.message)
        }
      }catch(e){
        console.log(err.message);
      }
    })
  }

  const loadOverview = async() => {
    if(user?.type !== 'minexx'){
      axiosInstance.get(`${baseURL_}metals-api`).then(response=>{
        setrates(response.data.rates)
      })
    }
    let normalizedCountrys = country.trim();
            
    // Special handling for Rwanda
    if (normalizedCountrys.toLowerCase() === 'rwanda') {
        // Randomly choose one of the three formats
         normalizedCountrys ='.Rwanda';
        // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
    } else {
        // For other countries, remove leading/trailing dots and spaces
        normalizedCountrys = normalizedCountrys.replace(/^\.+|\.+$/g, '');
    }
    axiosInstance.get(`${baseURL_}overview/risks`,
      {
        params: {
            country:normalizedCountrys,
          }
    }).then(response=>{
      setincidents(response.data.risks)
    }).catch(err=>{
      try{
        if(err.response.code === 403){
          dispatch(Logout(navigate))
        }else{
          toast.warn(err.response.message)
        }
      }catch(e){
        toast.error(err.message)
      }
    })

    axiosInstance.get(`${baseURL_}overview/incidents`,
      {
        params:
        {
          country:normalizedCountrys,

        }
      }).then(response=>{
      setseries1(response.data.incidents)
      settotal1(response.data.count)
    }).catch(err=>{
      try{
        if(err.response.code === 403){
          dispatch(Logout(navigate))
        }else{
          toast.warn(err.response.message)
        }
      }catch(e){
        toast.error(err.message)
      }
    })
    let normalizedCountry = country.trim();
            
    // Special handling for Rwanda
    if (normalizedCountry.toLowerCase() === 'rwanda') {
        // Randomly choose one of the three formats
         normalizedCountry ='.Rwanda';
        // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
    } else {
        // For other countries, remove leading/trailing dots and spaces
        normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
    }
    axiosInstance.get(`${baseURL_}overview/exports`,
      {
        params: {
            country:normalizedCountry,
          }
    }).then(response=>{
      setseries2(response.data.exports)
      settotal2(response.data.count)
      setexportweight((response.data.volume/1000).toFixed(5))
      setloading(false)
    }).catch(err=>{
      setloading(false)
      try{
        if(err.response.code === 403){
          dispatch(Logout(navigate))
        }else{
          toast.warn(err.response.message)
        }
      }catch(e){
        toast.error(err.message)
      }
    })
    let normalizedCountryq = country.trim();
            
    // Special handling for Rwanda
    if (normalizedCountryq.toLowerCase() === 'rwanda') {
        // Randomly choose one of the three formats
         normalizedCountryq ='Rwanda';
        // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
    } else {
        // For other countries, remove leading/trailing dots and spaces
        normalizedCountryq = normalizedCountryq.replace(/^\.+|\.+$/g, '');
    }
    axiosInstance.get(`${baseURL_}overview/assessments`,
      {
        params:
        {
          country:normalizedCountryq,

        }
      }).then(response=>{
      setseries3(response.data.assessments)
      settotal3(response.data.count)
    }).catch(err=>{ 
      try{
        if(err.response.code === 403){
          dispatch(Logout(navigate))
        }else{
          toast.warn(err.response.message)
        }
      }catch(e){
        toast.error(err.message)
      }
    })
  }

  useEffect(() => {
    setAccess(localStorage.getItem(`_dash`) || '3ts')
    // setCountry(localStorage.getItem(`_country`) || 'Rwanda')
    loadOverview()
    changeBackground({ value: "dark", label: "Dark" });
    changeTitle(`${t('Overview')} | Minexx`);

    // Update dropdown options based on language
    setDropdown(access === "3ts" 
      ? [t('Production'), t('Blending'), t('Processing')] 
      : [t('Production'), t('Purchase')]
    );
    setDropdown_([t('PurchaseTracker'), t('Blending'), t('Exports')]);

    loadCard(access === "3ts" 
      ? [t('Production'), t('Blending'), t('Processing')][filter].toLowerCase()
      : [t('Production'), t('Purchase')][filter].toLowerCase()
    );
  }, [language, access, filter,country]);

  return(
    <Fragment>
      <div className="row">
        <div className="col-md-4">
          <div className="card ticket-bx">
            <div className="card-body">
              <div className="d-sm-flex d-block pb-sm-3 align-items-end">
                <div className="me-auto pr-3 mb-2 mb-sm-0">
                  <span className="text-white fs-20 font-w200 d-block mb-sm-3 mb-2">{t('overallSummary')}</span>
                  <h2 className="fs-40 text-white mb-0">{exportweight}<span className="fs-18 ms-2">{t('tons')}</span></h2>
                </div>
                <div className="d-flex flex-wrap">
                  <svg width="87" height="58" viewBox="0 0 87 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.4571 37.6458C11.9375 44.6715 4.81049 52.3964 2 55.7162H68.8125C77.6491 55.7162 84.8125 48.5528 84.8125 39.7162V2L61.531 31.9333C56.8486 37.9536 48.5677 39.832 41.746 36.4211L37.3481 34.2222C30.9901 31.0432 23.2924 32.4352 18.4571 37.6458Z" fill="url(#paint0_linear)"/>
                    <path d="M2 55.7162C4.81049 52.3964 11.9375 44.6715 18.4571 37.6458C23.2924 32.4352 30.9901 31.0432 37.3481 34.2222L41.746 36.4211C48.5677 39.832 56.8486 37.9536 61.531 31.9333L84.8125 2" stroke="white"  strokeLinecap="round"/>
                    <defs>
                    <linearGradient id="paint0_linear" x1="43.4062" y1="8.71453" x2="46.7635" y2="55.7162" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" offset="0"/>
                    <stop offset="1" stopColor="white" stopOpacity="0"/>
                    </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              { loading ? <div className="progress mt-3 mb-4" style={{height:"15px"}}>
                <div className="progress-bar-striped progress-bar-animated" style={{width: "100%", height:"15px"}} role="progressbar">
                  <span className="sr-only">100% Complete</span>
                </div>
              </div> : null }
              <p className="fs-12">{t('cumulativeExport')}</p>
              <Link to={"/exports"} className="text-white">{t('viewDetail')}<i className="las la-long-arrow-alt-right scale5 ms-3"></i></Link>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-sm-12">
              <div className="card overflow-hidden">
                <div className="card-header align-items-start pb-0 border-0">	
                  <div>
                    <h4 className="mb-0 fs-20">{t('incidentRisks')}</h4>
                  </div>
                </div>
                <div className="card-body pt-2">
                  <div className="index-chart-point">
                    <div className="check-point-area overflow-hidden rounded me-2">	
                      <Doughnutchart input={incidents} /> 
                    </div>
                    <ul className="index-chart-point-list">
                      <li><i className="fa fa-stop text-danger"></i> {t('legitimacy')}</li>
                      <li><i className="fa fa-stop text-success"></i> {t('humanWorkersRights')}</li>
                      <li><i className="fa fa-stop text-warning"></i>{t('societalWelfareSecurity')}</li>
                      <li><i className="fa fa-stop text-info"></i>{t('companyGovernance')}</li>
                      <li><i className="fa fa-stop text-primary"></i> {t('chainOfCustodyTraceability')}</li>
                      <li><i className="fa fa-stop text-default"></i> {t('environment')}</li>
                      <li><i className="fa fa-stop text-secondary"></i> {t('communityImpact')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-9'>	
          <div className="card" id="sales_revenue">
            <div className="card-header border-0 pb-0 d-sm-flex d-block">
              <div>
                <h4 className="mb-0 fs-20">{t('EventsOverview')}</h4>
                <small className='font-w200 fs-12'><i className='fa fa-info-circle'></i> {t('load')}</small>
              </div>
              <div className="d-flex align-items-center mb-3 mb-sm-0">
                <div className="round weekly" id="dzOldSeries">
                  <div>
                    <input type="checkbox" id="checkbox1" name="radio" checked={showincidents} onChange={e=>setshowincidents(e.target.checked)} />
                    <label htmlFor="checkbox1" className="checkmark"></label>
                  </div>
                  <div>
                    <span className="fs-14">{t('Incidents')}</span>
                    <h4 className="fs-5 font-w600 mb-0">{total1}</h4>
                  </div>
                </div>
                <div className="round " id="dzNewSeries">
                  <div>
                    <input type="checkbox" id="checkbox" name="radio" checked={showexports} onChange={e=>setshowexports(e.target.checked)} />
                    <label htmlFor="checkbox" className="checkmark"></label>
                  </div>
                  <div>
                    <span className="fs-14">{t('Exports')}</span>
                    <h4 className="fs-5 font-w600 mb-0">{total2}</h4>
                  </div>	
                </div>
                <div className="round last" id="dzOtherSeries">
                  <div>
                    <input type="checkbox" id="checkbox2" name="radio" checked={showassessments} onChange={e=>setshowassessments(e.target.checked)} />
                    <label htmlFor="checkbox2" className="checkmark"></label>
                  </div>
                  <div>
                    <span className="fs-14">{t('Assessments')}</span>
                    <h4 className="fs-5 font-w600 mb-0">{total3}</h4>
                  </div>	
                </div>
              </div>
            </div>
            <div style={{ height: 'auto' }} className="card-body custome-tooltip">
              <HomeSalesRevenueChart series1={showincidents ? series1 : []} series2={showexports?series2:[]} series3={showassessments?series3:[]} days={months}/>
            </div>
          </div>
        </div>
        {user.type === 'minexx' ?
        <div className={`col-md-3`}>
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="fs-20">{dropdown[filter]}</h4>
              <Dropdown>
                <Dropdown.Toggle variant="" as="div" className="cursor-pointer fs-12">{dropdown[filter]}</Dropdown.Toggle>	
                <Dropdown.Menu alignRight={true} className="dropdown-menu-right">
                  {dropdown.map((option, index) => (
                    <Dropdown.Item key={index} onClick={() => {
                      setfilter(index);
                      loadCard(option.toLowerCase())
                    }}>
                      {option}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>	
              </Dropdown>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center selling p-3 rounded">	
                <span className="fs-14">{new Date().toString().substring(0, 16)}</span>
                <span className="fs-14">{apex.values[apex.values.length-1]} {t('tons')}</span>
              </div>
              <SellingApexChart chart={apex} /> 
            </div>
          </div>
        </div>	: 
        <div className="col-md-3">
          <div className="row">
            <div className="col-sm-12">
              <div className="card overflow-hidden">
                <div className="card-header align-items-start border-primary">	
                  <div>
                    <h4 className="mb-0 fs-20">{t('MetalsRatesTodayPerTon')}</h4>
                  </div>
                </div>
                <div className="card-body">
                  {Object.keys(rates).slice(0,3).map((rate, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center selling p-3 mt-3 rounded">	
                      <span className="fs-14">{rate}</span>
                      <span className="fs-14">$ {(Number(Object.values(rates)[i])).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="card-footer"><small>{t('SourceMetalsAPI')}</small></div>
              </div>
            </div>
          </div>
        </div>
      }						
      </div>	
    </Fragment>
  )
}

export default Home;