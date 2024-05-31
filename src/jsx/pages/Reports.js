import React,{useState, useEffect, useContext, useRef} from 'react';
import { Button, Dropdown, Nav, Tab, Table } from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { baseURL_ } from '../../config'
import axios from 'axios';
import moment from 'moment';
import {startOfMonth, isWeekend, isBefore} from 'date-fns'
import { Logout } from '../../store/actions/AuthActions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const ticketData = [
    {number:"01", emplid:"Emp-0852", count:'3'},
    {number:"02", emplid:"Emp-2052", count:'5'},
    {number:"03", emplid:"Emp-3052", count:'9'},
    {number:"04", emplid:"Emp-3055", count:'8'},
    {number:"05", emplid:"Emp-1052", count:'6'},
    {number:"06", emplid:"Emp-3055", count:'1'},
    {number:"07", emplid:"Emp-3052", count:'4'},
];

const Reports = () => {

    const {type} = useParams()
    const navigate = useNavigate()
	const dispatch = useDispatch()
    const [companies, setcompanies] = useState([])
    const [company, setcompany] = useState()
    const [trace, settrace] = useState({
        production: [],
        bags: [],
        blending: [],
        drums: [],
        bags_proc: [],
        processing: [],
        exports: []
    })
    const [exportsPage, setexportsPage] = useState(1)
    const [drumsPage, setdrumsPage] = useState(1)
    const [prodPage, setprodPage] = useState(1)
    const [procPage, setprocPage] = useState(1)
    const [bagsPage, setbagsPage] = useState(1)
    const [bagsProcPage, setbagsProcPage] = useState(1)
    const { changeTitle } = useContext(ThemeContext)
    const [data, setData] = useState(
		document.querySelectorAll("#report_wrapper tbody tr")
	);
    let days = 0
    for (let date = startOfMonth(new Date()); isBefore(date, new Date()); date = moment(date).add(1, "day").toDate()) {
        if(!isWeekend(date)){
            days++
        }
    }
    const [daily, setdaily] = useState({
        cassiterite: {
            dailyTarget: 4.76,
            dailyActual: 0,
            mtdTarget: 100,
            mtdActual: 0,
        },
        coltan: {
            dailyTarget: 0.38,
            dailyActual: 0,
            mtdTarget: 8,
            mtdActual: 0,
        },
        wolframite: {
            dailyTarget: 0.19,
            dailyActual: 0,
            mtdTarget: 4,
            mtdActual: 0,
          }
    })
    const [balance, setbalance] = useState({
        cassiterite: {
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            pending: 0,
            rmr: 0,
        },
        coltan: {
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            pending: 0,
            rmr: 0,
        },
        wolframite: {
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            pending: 0,
            rmr: 0,
        }
    })

    const [deliveries, setdeliveries] = useState({
        cassiterite: {
            daily: 0,
            weekly: 0,
            monthly: 0,
          },
        coltan: {
            daily: 0,
            weekly: 0,
            monthly: 0,
          },
        wolframite: {
            daily: 0,
            weekly: 0,
            monthly: 0,
        }
    })
	const sort = 20;
	const activePag = useRef(0);
	const user = JSON.parse(localStorage.getItem(`_authUsr`))
    const apiHeaders = {
        'authorization': `Bearer ${localStorage.getItem('_authTkn')}`,
        'x-refresh': localStorage.getItem(`_authRfrsh`)
    }

	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};

    const changeCompany = (e)=>{
        const input = e.currentTarget.value
        if(input === 'Select Company'){
            setcompany(null)
            return toast.warn("Please select a company to generate trace report for.")
        }
        const selected = JSON.parse(input);
        setcompany(selected)
        toast.info('Generating trace report, please wait...', {
            delay: 100,
            autoClose: true
        })
    }
    
    const loadCompanies =  ()=>{
        axios.get(`${baseURL_}companies`, {
            headers: apiHeaders
        }).then(response=>{
            setcompanies(response.data.companies)
        })
    }

    const loadReport = ()=>{
        if(type === `trace`){
            settrace({
                production: [],
                bags: [],
                blending: [],
                drums: [],
                bags_proc: [],
                processing: [],
                exports: []
            })
        }
        axios.get(`${baseURL_}report/${type !== 'trace' ? type : type+'/'+company?.id}`, {
            headers: apiHeaders
        }).then(response=>{
            if(type === `daily`){
                setdaily({ cassiterite: response.data.cassiterite, coltan: response.data.coltan, wolframite: response.data.wolframite })
            }
            if(type === `mtd`){
                setbalance({ cassiterite: response.data.cassiterite, coltan: response.data.coltan, wolframite: response.data.wolframite })
            }
            if(type === `deliveries`){
                setdeliveries({ cassiterite: response.data.cassiterite, coltan: response.data.coltan, wolframite: response.data.wolframite })
            }
            if(type === `trace`){
                if(company){
                    toast.success("Trace report generated successfully!")
                }
                settrace(response.data.trace)
            }
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

    function paginate(array, page_number, page_size) {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    useEffect(() => {
        setData(document.querySelectorAll("#report_wrapper tbody tr"));
        changeTitle(`Reports | Minexx`)
        loadReport()
        if(type === 'trace'){
            loadCompanies()
        }
    }, [type, company]);

  
   // Active pagginarion
   activePag.current === 0 && chageData(0, sort);
   // paggination
   let paggination = (arr)=>Array(Math.ceil(arr.length / sort))
      .fill()
      .map((_, i) => i + 1);

   // Active paggination & chage data
	const onClick = (i) => {
		activePag.current = i;
		chageData(activePag.current * sort, (activePag.current + 1) * sort);
		//settest(i);
	};
    return (
        <>
            <div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item active"><Link to={"#"}>Dashboard</Link></li>
					<li className="breadcrumb-item"><Link to={"#"} >Reports</Link></li>
					<li className="breadcrumb-item"><Link to={"#"} >{ type === 'today' ? `Today's Report` : type === 'trace' ? `Trace Report [${company?company.name: ''}]` : type === `daily` ? `Total Stock Delivery` : type === `mtd` ? `In-Stock Country Balance` : `Total Purchase`}</Link></li>
				</ol>
			</div>
            {/**<div className="row mb-5 align-items-center">
				<div className="col-lg-3 mb-4 mb-lg-0">
					<Link to={"#"} className="btn btn-outline-primary light  btn-lg btn-block rounded" onClick={()=>{} }> + Generate Report</Link>
				</div>
            </div>**/}
            <div className="row">
                { type === `admin` ?
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Generated Reports</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive ticket-table">
                                <div id="report_wrapper" className="dataTables_wrapper no-footer">
                                    <div className='d-flex justify-content-between mb-3 custom-tab-list'>
                                        <div className='d-flex align-items-center'>
                                            <label className="me-2">Show</label>
                                            <Dropdown className="search-drop">
                                                <Dropdown.Toggle className="">10</Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>25</Dropdown.Item>
                                                    <Dropdown.Item>50</Dropdown.Item>
                                                    <Dropdown.Item>75</Dropdown.Item>
                                                    <Dropdown.Item>100</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <label className="ms-2">entries</label>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <label className="me-2">Search:</label>
                                            <input type="search" placeholder="" className="form-control" />
                                        </div>
                                    </div>
                                    <table id="example" className="display dataTablesCard table-responsive-xl dataTable no-footer w-100">
                                        <thead>
                                            <tr>                                               	                                            
                                                <th>ID</th>
												<th>Name</th>
												<th>Requested</th>
												<th>Completed On</th>
												<th>Status</th>  
												<th>Action</th>                                           
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ticketData.slice(0, 1).map((item, index)=>(
                                                <tr key={index}>     
                                                    <td className="sorting_1">{item.number}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{user.type === `minexx` ? `Production Data Report` : `Minexx Trace Data Report`} (11/01/2023 - 12/31/2023)</Link>
                                                        </div>
                                                    </td>                                                    
                                                    <td>
                                                        Jan 10, 2024 02:23
                                                    </td>
                                                    <td>Jan 9, 2024 17:02</td>
                                                    <td>
                                                        <span className="badge light badge-success">Successful</span>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm light btn-success">Download PDF</button>
                                                        &emsp;
                                                        <button className="btn btn-sm light btn-primary">Download XLSL</button>
                                                    </td>
                                                </tr>
                                            ))}                                           
                                        </tbody>                                        
                                    </table>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center mt-3 mb-3">
                                        <div className="dataTables_info">
                                            Showing {activePag.current * sort + 1} to{" "}
                                            {data.length > (activePag.current + 1) * sort
                                                ? (activePag.current + 1) * sort
                                                : data.length}{" "}
                                            of {data.length} entries
                                        </div>
                                        <div
                                            className="dataTables_paginate paging_simple_numbers mb-0"
                                            id="example2_paginate"
                                        >
                                            <Link
                                                className="paginate_button previous disabled"
                                                to="/reports"
                                                onClick={() =>
                                                    activePag.current > 0 &&
                                                    onClick(activePag.current - 1)
                                                }
                                            >
                                                Previous
                                            </Link>
                                            <Link
                                                className="paginate_button next"
                                                to="/reports"
                                                onClick={() =>  {
                                                    console.log("next")
                                                        bagsPage < paggination(trace.bags).length &&
                                                        onClick(()=>setbagsPage(bagsPage+1))
                                                    }
                                                }
                                            >
                                                Next
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                type === `daily` ? 
                <div className='row'>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Cassiterite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div id="report_wrapper" className="no-footer">
                                        <table id="cassiteriteTargets" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Date</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="ct">     
                                                    <td className="sorting_1">Daily Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.dailyTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct2">     
                                                    <td className="sorting_1">Daily Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.dailyActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct3">     
                                                    <td className="sorting_1">Monthly Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.mtdTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct4">     
                                                    <td className="sorting_1">MTD Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(4.76*days).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct5">
                                                    <td className="sorting_1">MTD Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.mtdActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct6">     
                                                    <td className="sorting_1">MTD Actuals vs Target (%)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{((daily.cassiterite.mtdActual/1000)/(4.76*days)*100).toFixed(2)}%</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Coltan</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="coltanTargets" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Date</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="col1">     
                                                    <td className="sorting_1">Daily Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.dailyTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col2">     
                                                    <td className="sorting_1">Daily Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.dailyActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col3">     
                                                    <td className="sorting_1">Monthly Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.mtdTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col4">     
                                                    <td className="sorting_1">MTD Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(0.38*days).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col5">     
                                                    <td className="sorting_1">MTD Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.mtdActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col6">     
                                                    <td className="sorting_1">MTD Actuals vs Target (%)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{((daily.coltan.mtdActual/1000)/(0.38*days)*100).toFixed(2)}%</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Wolframite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="wolframiteTargets" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Date</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="wt1">     
                                                    <td className="sorting_1">Daily Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.dailyTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt2">     
                                                    <td className="sorting_1">Daily Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.dailyActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt3">     
                                                    <td className="sorting_1">Monthly Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.mtdTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt4">
                                                    <td className="sorting_1">MTD Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(0.19*days).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt5">     
                                                    <td className="sorting_1">MTD Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.mtdActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt6">     
                                                    <td className="sorting_1">MTD Actuals vs Target (%)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{((daily.wolframite.mtdActual/1000)/(0.19*days)*100).toFixed(2)}%</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                type === `mtd` ?
                <div className='row'>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Cassiterite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div id="report_wrapper" className="no-footer">
                                        <table id="cassiteriteBalance" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Overall Balance as of</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="cb1">     
                                                    <td className="sorting_1">With Minexx (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb2">     
                                                    <td className="sorting_1">With RMR (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb3">     
                                                    <td className="sorting_1">With Buyer (SOLD)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.buyer/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb5">     
                                                    <td className="sorting_1">Pending Shipment (SOLD)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.pending/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb4">     
                                                    <td className="sorting_1">Shipped (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.shipped/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-danger">
                            <div className="card-header">
                                <h4 className="card-title">Coltan</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="coltanBalance" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Overall Balance as of</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="ccb1">     
                                                    <td className="sorting_1">With Minexx (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb2">     
                                                    <td className="sorting_1">With RMR (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb3">     
                                                    <td className="sorting_1">With Buyer (SOLD)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.buyer/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb5">     
                                                    <td className="sorting_1">Pending Shipment (SOLD)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.pending/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb4">     
                                                    <td className="sorting_1">Shipped (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.shipped/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Wolframite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="wolframiteBalance" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Overall Balance as of</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="wb1">     
                                                    <td className="sorting_1">With Minexx (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb2">     
                                                    <td className="sorting_1">With RMR (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb3">     
                                                    <td className="sorting_1">With Buyer (SOLD)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.buyer/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb3">     
                                                    <td className="sorting_1">Pending Shipment (SOLD)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.pending/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb4">     
                                                    <td className="sorting_1">Shipped (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.shipped/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                type === `deliveries` ?
                <div className='row'>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Cassiterite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div id="report_wrapper" className="no-footer">
                                        <table id="cassiteritePurchases" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Total Purchases</th>
                                                    <th></th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="cd1">     
                                                    <td className="sorting_1">{new Date().toUTCString().substring(0, 16)}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.cassiterite.daily).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cd2">     
                                                    <td className="sorting_1">This Week</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.cassiterite.weekly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cd3">     
                                                    <td className="sorting_1">This Month</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.cassiterite.monthly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-danger">
                            <div className="card-header">
                                <h4 className="card-title">Coltan</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="coltanPurchases" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Total Purchases</th>
                                                    <th></th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="ccd1">     
                                                    <td className="sorting_1">{new Date().toUTCString().substring(0, 16)}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.coltan.daily).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccd2">     
                                                    <td className="sorting_1">This Week</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.coltan.weekly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccd3">     
                                                    <td className="sorting_1">This Month</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.coltan.monthly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Wolframite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="example" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Total Purchases</th>
                                                    <th></th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="wd1">     
                                                    <td className="sorting_1">{new Date().toUTCString().substring(0, 16)}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.wolframite.daily).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wd2">     
                                                    <td className="sorting_1">This Week</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.wolframite.weekly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wd3">     
                                                    <td className="sorting_1">This Month</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.wolframite.monthly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : type === 'trace' ?
                <div className='row'>
                    { company ? <div>
                    <div className='row'>
                        <div className='col-md-3'>
                            <select onChange={changeCompany} className='form-control'>
                                <option>Select Company</option>
                                { companies.map(company=><option value={JSON.stringify(company)}>{company.name}</option>) }
                            </select>
                        </div>
                    </div>    
                    <Tab.Container defaultActiveKey="production">
                        <Nav as="ul" className="nav nav-pills review-tab" role="tablist">
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link  px-2 px-lg-3"  to="#production" role="tab" eventKey="production">
                                    Production
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#bags" role="tab" eventKey="bags">
                                    Bags Produced
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#processing" role="tab" eventKey="processing">
                                    Processing
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#bags_proc" role="tab" eventKey="bags_proc">
                                    Bags Processed
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#blending" role="tab" eventKey="blending">
                                    Blending
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#drums" role="tab" eventKey="drums">
                                    Drums
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#exports" role="tab" eventKey="exports">
                                    Exports
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className='mt-10' style={{ marginTop: 25 }}>
                            <Tab.Pane eventKey="production" id='production'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>Production</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th className="text-center text-dark">
                                                            Production Weight (Kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Business Location
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Name of RMB Representative
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Traceability Agent
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Name of Operator Representative
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Number of Bags
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Total Weight (Kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Note
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        trace.production.map((prod, i)=><tr key={`prod${i}`}>
                                                            <td>{prod.picture ? <img alt='' className='rounded mt-4' style={{objectFit: 'cover'}} width={'128px'} height={'128px'} src={`https://lh3.googleusercontent.com/d/${prod.picture}=w2160?authuser=0`}/> : 'No Picture'}</td>
                                                            <td>{prod.weight}</td>
                                                            <td>{prod.location}</td>
                                                            <td>{prod.rmbRep}</td>
                                                            <td>{prod.traceAgent}</td>
                                                            <td>{prod.operator}</td>
                                                            <td>{prod.bags}</td>
                                                            <td>{prod.totalWeight}</td>
                                                            <td>{prod.note}</td>
                                                        </tr>)
                                                    }
                                                    {
                                                        trace.production.length === 0 ? <tr>
                                                            <td colSpan={9}>The selected company does not have any production to show.</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                Showing {(prodPage-1) * sort + 1} to{" "}
                                                {trace.production.length > prodPage * sort
                                                    ? prodPage*sort
                                                    : trace.production.length}{" "}
                                                of {trace.production.length} entries
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    onClick={() =>
                                                        prodPage > 1 && setprodPage(prodPage - 1)
                                                    }
                                                >
                                                    Previous
                                                </Link>
                                                <Link
                                                    className="paginate_button next mx-4"
                                                    onClick={() =>
                                                        prodPage < paggination(trace.production).length &&
                                                        setprodPage(prodPage + 1)
                                                    }
                                                >
                                                    Next
                                                </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="bags" id='bags'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>Bags Produced</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>Tag Number</th>
                                                        <th className="text-center text-dark">
                                                            Weight (Kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Tunnel/Pit Number or Name
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Production/Mining Date
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Miner Name
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Transporter Name
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            RMB Representative at Mine Site
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Security Officer Name
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Estimated concentrate %
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Color of The Bag/Drum Package
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Transport Mode
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Transport Itinerary
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Time
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Production ID
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        paginate(trace.bags, bagsPage, 20).map((bag, i)=><tr key={`bag${i}`}>
                                                            <td>{bag.tag}</td>
                                                            <td>{bag.weight}</td>
                                                            <td>{bag.tunnel}</td>
                                                            <td>{bag.date}</td>
                                                            <td>{bag.miner}</td>
                                                            <td>{bag.transporter}</td>
                                                            <td>{bag.rmbRep}</td>
                                                            <td>{bag.security}</td>
                                                            <td>{bag.concentrate}</td>
                                                            <td>{bag.color}</td>
                                                            <td>{bag.transport}</td>
                                                            <td>{bag.itinerary}</td>
                                                            <td>{bag.time}</td>
                                                            <td>{bag.production}</td>
                                                        </tr>)
                                                    }
                                                    {
                                                        trace.bags.length === 0 ? <tr>
                                                            <td colSpan={14}>The selected company does not have any produced bags to show.</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                Showing {(bagsPage-1) * sort + 1} to{" "}
                                                {trace.bags.length > bagsPage * sort
                                                    ? bagsPage*sort
                                                    : trace.bags.length}{" "}
                                                of {trace.bags.length} entries
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    // to="/reviews"
                                                    onClick={() =>
                                                    bagsPage > 1 && setbagsPage(bagsPage - 1)
                                                    }
                                                >
                                                    Previous
                                                </Link>
                                                <Link
                                                    className="paginate_button next mx-4"
                                                    onClick={() =>
                                                        bagsPage < paggination(trace.bags).length &&
                                                        setbagsPage(bagsPage + 1)
                                                    }
                                                >
                                                    Next
                                                </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="processing" id='processing'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>Processing</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Date
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Business Location
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            RMB Representative
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Traceability Agent
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Operator Representative
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Mineral Type
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Number of Input Bags
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Total Input Weight (kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Number of Output Bags
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Total Output Weight(kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Tag Number
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Tagging Date and Time
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Grade (%)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Processing Weight (kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Note
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Name of mine supplier
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Presence of Alex Stuart International (ASI)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Laboratory
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Certificate
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Pricing (USD)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            LME
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            TC
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Price per Ta (%)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Unit Price
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Total Price
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Payment Method
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Security Officer Name
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Lot Number
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        paginate(trace.processing, procPage, sort).map(proc=><tr key={proc.id}>
                                                            <td>{proc.picture ? <img alt='' className='rounded mt-4' style={{objectFit: 'cover'}} width={'128px'} height={'128px'} src={`https://lh3.googleusercontent.com/d/${proc.picture}=w2160?authuser=0`}/> : 'No Picture'}</td>
                                                            <td>{proc.date}</td>
                                                            <td>{proc.location}</td>
                                                            <td>{proc.rmb}</td>
                                                            <td>{proc.trace}</td>
                                                            <td>{proc.operator}</td>
                                                            <td>{proc.mineral}</td>
                                                            <td>{proc.inputBags}</td>
                                                            <td>{proc.inputWeight}</td>
                                                            <td>{proc.outputBags}</td>
                                                            <td>{proc.outputWeight}</td>
                                                            <td>{proc.tags.split(',')[0]}</td>
                                                            <td>{proc.tagDate}</td>
                                                            <td>{proc.grade}</td>
                                                            <td>{proc.processingWeight}</td>
                                                            <td>{proc.note}</td>
                                                            <td>{proc.supplier}</td>
                                                            <td>{proc.asi}</td>
                                                            <td>{proc.lab}</td>
                                                            <td>{proc.certificate}</td>
                                                            <td>{proc.price}</td>
                                                            <td>{proc.lme}</td>
                                                            <td>{proc.tc}</td>
                                                            <td>{proc.ta}</td>
                                                            <td>{proc.unitPrice}</td>
                                                            <td>{proc.totalPrice}</td>
                                                            <td>{proc.paymentMethod}</td>
                                                            <td>{proc.security}</td>
                                                            <td>{proc.lot}</td>
                                                        </tr>)
                                                    }
                                                    {
                                                        trace.processing.length === 0 ? <tr>
                                                            <td colSpan={29}>The selected company does not have any processing to show.</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                Showing {(procPage-1) * sort + 1} to{" "}
                                                {trace.processing.length > procPage * sort
                                                    ? procPage*sort
                                                    : trace.processing.length}{" "}
                                                of {trace.processing.length} entries
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                    <Link
                                                        className="paginate_button previous disabled"
                                                        onClick={() =>
                                                            procPage > 1 && setprocPage(procPage - 1)
                                                        }
                                                    >
                                                        Previous
                                                    </Link>
                                                    <Link
                                                        className="paginate_button next mx-4"
                                                        onClick={() =>
                                                            procPage < paggination(trace.processing).length &&
                                                            setprocPage(procPage + 1)
                                                        }
                                                    >
                                                        Next
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="bags_proc" id='bags_proc'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>Bags Processed</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>Tag Number</th>
                                                        <th className="text-center text-dark">
                                                            Weight (Kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Processing ID
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Production/Mining Date
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            RMB Representative at Mine Site
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Security Officer Name
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Time
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Storage Container
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Color of the Package/Container
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Mineral Type
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Grade (%)
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        paginate(trace.bags_proc, bagsProcPage, 20).map((bag, i)=><tr key={`bag${i}`}>
                                                            <td>{bag.tag}</td>
                                                            <td>{bag.weight}</td>
                                                            <td>{bag.processing}</td>
                                                            <td>{bag.date}</td>
                                                            <td>{bag.rmbRep}</td>
                                                            <td>{bag.security}</td>
                                                            <td>{bag.time}</td>
                                                            <td>{bag.storage}</td>
                                                            <td>{bag.color}</td>
                                                            <td>{bag.mineral}</td>
                                                            <td>{bag.grade}</td>
                                                        </tr>)
                                                    }{
                                                        trace.bags_proc.length === 0 ? <tr>
                                                            <td colSpan={24}>The selected company does not have any processed bags to show.</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                Showing {(bagsProcPage-1) * sort + 1} to{" "}
                                                {trace.bags_proc.length > bagsProcPage * sort
                                                    ? bagsProcPage*sort
                                                    : trace.bags_proc.length}{" "}
                                                of {trace.bags_proc.length} entries
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    // to="/reviews"
                                                    onClick={() =>
                                                        bagsProcPage > 1 && setbagsProcPage(bagsProcPage - 1)
                                                    }
                                                >
                                                    Previous
                                                </Link>
                                                <Link
                                                    className="paginate_button next mx-4"
                                                    onClick={() =>
                                                        bagsProcPage < paggination(trace.bags_proc).length &&
                                                        setbagsProcPage(bagsProcPage + 1)
                                                    }
                                                >
                                                    Next
                                                </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="blending" id='blending'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>Blending</h4>
                                    </div>
                                    <div className='card-body'>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="drums" id='drums'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>Drums</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>Drum Number</th>
                                                        <th className="text-center text-dark">
                                                            Gross Weight
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Net Weight 
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            ITSCI Tag Number
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Drum/Bag Color
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Grade (%) 
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Blending ID
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            ASI Tag Number
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                        {
                                                            paginate(trace.drums, drumsPage, sort).map(drum=><tr key={`drum${drum.drum}`}>
                                                                <td>{drum.drum}</td>
                                                                <td>{drum.grossWeight}</td>
                                                                <td>{drum.netWeight}</td>
                                                                <td>{drum.itsci}</td>
                                                                <td>{drum.color}</td>
                                                                <td>{drum.grade}</td>
                                                                <td>{drum.blending}</td>
                                                                <td>{drum.asi}</td>
                                                            </tr>)
                                                        }
                                                        {
                                                            trace.drums.length === 0 ? <tr>
                                                                <td colSpan={24}>The selected company does not have any drums to show.</td>
                                                            </tr> : <tr></tr>
                                                        }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                Showing {(drumsPage-1) * sort + 1} to{" "}
                                                {trace.drums.length > drumsPage * sort
                                                    ? drumsPage*sort
                                                    : trace.drums.length}{" "}
                                                of {trace.drums.length} entries
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                    <Link
                                                        className="paginate_button previous disabled"
                                                        onClick={() =>
                                                            drumsPage > 1 && setdrumsPage(drumsPage - 1)
                                                        }
                                                    >
                                                        Previous
                                                    </Link>
                                                    <Link
                                                        className="paginate_button next mx-4"
                                                        onClick={() =>
                                                            drumsPage < paggination(trace.drums).length &&
                                                            setdrumsPage(drumsPage + 1)
                                                        }
                                                    >
                                                        Next
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="exports" id='exports'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>Exports</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th className="text-center text-dark">
                                                            Date
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Mineral Type
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Grade
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Net Weight (kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Gross Weight (kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Exportation ID
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            RMB Representative
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Exporter Representative
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Traceability Agent
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Destination
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Itinerary
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Shipment Number
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Export Certificate Number
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            RRA certificate Number
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Export value (USD)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Transporter
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            ID Number of the driver
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Truck Plate Number - Front
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Truck Plate Number - Back
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Number of tags
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Total Gross Weight(kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Total Net Weight(kg)
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            Attachments
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                        {
                                                            paginate(trace.exports, exportsPage, sort).map(exp=><tr key={exp.exportationID}>
                                                                <td>{exp.date}</td>
                                                                <td>{exp.mineral}</td>
                                                                <td>{exp.grade}</td>
                                                                <td>{exp.netWeight}</td>
                                                                <td>{exp.grossWeight}</td>
                                                                <td>{exp.exportationID}</td>
                                                                <td>{exp.rmbRep}</td>
                                                                <td>{exp.exportRep}</td>
                                                                <td>{exp.traceabilityAgent}</td>
                                                                <td>{exp.destination}</td>
                                                                <td>{exp.itinerary}</td>
                                                                <td>{exp.shipmentNumber}</td>
                                                                <td>{exp.exportCert}</td>
                                                                <td>{exp.rraCert}</td>
                                                                <td>{exp.value}</td>
                                                                <td>{exp.transporter}</td>
                                                                <td>{exp.driverID}</td>
                                                                <td>{exp.truckFrontPlate}</td>
                                                                <td>{exp.truckBackPlate}</td>
                                                                <td>{exp.tags}</td>
                                                                <td>{exp.totalGrossWeight}</td>
                                                                <td>{exp.totalNetWeight}</td>
                                                                <td><Link to={`/export/${exp.id}`}>View Attachments</Link></td>
                                                            </tr>)
                                                        }
                                                        {
                                                            trace.exports.length === 0 ? <tr>
                                                                <td colSpan={24}>The selected company does not have any exports to show.</td>
                                                            </tr> : <tr></tr>
                                                        }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                Showing {(exportsPage-1) * sort + 1} to{" "}
                                                {trace.exports.length > exportsPage * sort
                                                    ? exportsPage*sort
                                                    : trace.exports.length}{" "}
                                                of {trace.exports.length} entries
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                    <Link
                                                        className="paginate_button previous disabled"
                                                        onClick={() =>
                                                            exportsPage > 1 && setexportsPage(exportsPage - 1)
                                                        }
                                                    >
                                                        Previous
                                                    </Link>
                                                    <Link
                                                        className="paginate_button next mx-4"
                                                        onClick={() =>
                                                            exportsPage < paggination(trace.exports).length &&
                                                            setexportsPage(exportsPage + 1)
                                                        }
                                                    >
                                                        Next
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                    </div> : <div className='row'>
                    <div className='col-md-6'>
                        <div className='card'>
                            <div className='card-header'>
                            <h5 className='card-title'>Please select company to generate trace report</h5>
                            </div>
                            <div className='card-body'>
                                    <select onChange={changeCompany} className='form-control'>
                                        <option>Select Company</option>
                                        { companies.map(company=><option value={JSON.stringify(company)}>{company.name}</option>) }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
                :
                <div>
                </div>
                }
            </div>
        </>
    );
};


export default Reports;