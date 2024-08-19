import React,{Fragment, useContext, useEffect, useState} from 'react';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import {Link, useNavigate} from 'react-router-dom';
import {Dropdown} from "react-bootstrap";
import  { baseURL_ } from '../../../config'
import { subMonths } from 'date-fns'
import { ThemeContext } from '../../../context/ThemeContext';
import { Logout } from '../../../store/actions/AuthActions';
import axiosInstance from '../../../services/AxiosInstance';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const Doughnutchart = loadable(() =>
	pMinDelay(import("./../Karciz/Dashboard/Doughnutchart"), 1000)
);
const SellingApexChart = loadable(() =>
	pMinDelay(import("./../Karciz/EventPage/SellingApexChart"), 1000)
);

const HomeSalesRevenueChart = loadable(() =>
	pMinDelay(import("./../Karciz/Dashboard/HomeSalesRevenueChart"), 1000)
);

function Home() {
	const { changeBackground, changeTitle } = useContext(ThemeContext);
	const navigate = useNavigate()
	const dispatch = useDispatch()
    const access = localStorage.getItem(`_dash`) || '3ts'
	const dropdown = access === "3ts" ? ['Production', 'Blending', 'Processing'] : ["Production", "Purchase"]
	const [showexports, setshowexports] = useState(true)
	const [showassessments, setshowassessments] = useState(true)
	const [showincidents, setshowincidents] = useState(true)
	const [incidents, setincidents] = useState([])
	const [rates, setrates] = useState({
		"LME-TIN": "",
		"TIN": "",
		"TIN3M": ""
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
	const dropdown_ = ['Purchase Tracker', 'Blending', 'Exports']
	const [filter, setfilter] = useState(0)
	const user = JSON.parse(localStorage.getItem(`_authUsr`))


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
				toast.error(err.message)
			}
		})
	}

	const loadOverview = async()=>{

		if(user?.type !== 'minexx'){
			axiosInstance.get(`${baseURL_}metals-api`).then(response=>{
				setrates(response.data.rates)
			})
		}

		axiosInstance.get(`${baseURL_}overview/risks`).then(response=>{
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

		axiosInstance.get(`${baseURL_}overview/incidents`).then(response=>{
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

		axiosInstance.get(`${baseURL_}overview/exports`).then(response=>{
			setseries2(response.data.exports)
			settotal2(response.data.count)
			setexportweight((response.data.volume/1000).toFixed(1))
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

		axiosInstance.get(`${baseURL_}overview/assessments`).then(response=>{
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
		loadOverview()
		loadCard(dropdown[filter].toLowerCase())
		changeBackground({ value: "dark", label: "Dark" });
		changeTitle(`Overview | Minexx`)
	}, [ ]);

	return(
		<Fragment>
			<div className="row">
				<div className="col-md-4">
					<div className="card ticket-bx">
						<div className="card-body">
							<div className="d-sm-flex d-block pb-sm-3 align-items-end">
								<div className="me-auto pr-3 mb-2 mb-sm-0">
									<span className="text-white fs-20 font-w200 d-block mb-sm-3 mb-2">Overall Summary</span>
									<h2 className="fs-40 text-white mb-0">{exportweight}<span className="fs-18 ms-2">TONS</span></h2>
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
							<p className="fs-12">Cummulative export volume from all mines.</p>
							<Link to={"/exports"} className="text-white">View detail<i className="las la-long-arrow-alt-right scale5 ms-3"></i></Link>
						</div>
					</div>
				</div>
				<div className="col-md-8">
					<div className="row">
						<div className="col-sm-12">
							<div className="card overflow-hidden">
								<div className="card-header align-items-start pb-0 border-0">	
									<div>
										<h4 className="mb-0 fs-20">Incident Risks</h4>
									</div>
								</div>
								<div className="card-body pt-2">
									<div className="index-chart-point">
										<div className="check-point-area overflow-hidden rounded me-2">	
											<Doughnutchart input={incidents} /> 
										</div>
										<ul className="index-chart-point-list">
											<li><i className="fa fa-stop text-danger"></i> Legitimacy</li>
											<li><i className="fa fa-stop text-success"></i> Human &amp; Workers Rights</li>
											<li><i className="fa fa-stop text-warning"></i> Societal Welfare/Security</li>
											<li><i className="fa fa-stop text-info"></i>Company Governance</li>
											<li><i className="fa fa-stop text-primary"></i> Chain of Custody/Traceability</li>
											<li><i className="fa fa-stop text-default"></i> Environment</li>
											<li><i className="fa fa-stop text-secondary"></i> Community Impact</li>
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
								<h4 className="mb-0 fs-20">Events Overview</h4>
								<small className='font-w200 fs-12'><i className='fa fa-info-circle'></i> The events overview might take some time to load...</small>
							</div>
							<div className="d-flex align-items-center mb-3 mb-sm-0">

								<div className="round weekly" id="dzOldSeries">
									<div>
										<input type="checkbox" id="checkbox1" name="radio" value={showincidents} onChange={e=>setshowincidents(e.currentTarget.checked)} />
										<label htmlFor="checkbox1" className="checkmark"></label>
									</div>
									<div>
										<span className="fs-14">Incidents</span>
										<h4 className="fs-5 font-w600 mb-0">{total1}</h4>
									</div>
								</div>
								<div className="round " id="dzNewSeries">
									<div>
										<input type="checkbox" id="checkbox" name="radio" value={showincidents} onChange={e=>setshowexports(e.currentTarget.checked)} />
										<label htmlFor="checkbox" className="checkmark"></label>
									</div>
									<div>
										<span className="fs-14">Exports</span>
										<h4 className="fs-5 font-w600 mb-0">{total2}</h4>
									</div>	
								</div>
								
								<div className="round last" id="dzOtherSeries">
									<div>
										<input type="checkbox" id="checkbox2" name="radio" value={showincidents} onChange={e=>setshowassessments(e.currentTarget.checked)} />
										<label htmlFor="checkbox2" className="checkmark"></label>
									</div>
									<div>
										<span className="fs-14">Assessments</span>
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
							<h4 className="fs-20">{user.type === 'minexx' ? dropdown[filter] : dropdown_[filter]}</h4>
							<Dropdown>
								<Dropdown.Toggle variant="" as="div" className="cursor-pointer fs-12">{user.type === 'minexx' ? dropdown[filter] : dropdown_[filter]}</Dropdown.Toggle>	
								<Dropdown.Menu alignRight={true} className="dropdown-menu-right">
									{ (user.type === 'minexx' ? dropdown : dropdown_).map((option, index)=><Dropdown.Item key={index} onClick={()=>{
										setfilter(index);
										loadCard(option.toLowerCase())
									}} >{option}</Dropdown.Item>)}
								</Dropdown.Menu>	
							</Dropdown>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-center selling p-3 rounded">	
								<span className="fs-14">{new Date().toString().substring(0, 16)}</span>
								<span className="fs-14">{apex.values[apex.values.length-1]} TONS</span>
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
										<h4 className="mb-0 fs-20">Metals Rates Today Per Ton</h4>
									</div>
								</div>
								<div className="card-body">
									{ Object.keys(rates).slice(0,3).map((rate, i)=>{
										return <div className="d-flex justify-content-between align-items-center selling p-3 mt-3 rounded">	
										<span className="fs-14">{rate}</span>
										<span className="fs-14">$ {(Number(Object.values(rates)[i])).toFixed(2)}</span>
									</div>}) }
								</div>
								<div className="card-footer"><small>Source: Metals-API</small></div>
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
