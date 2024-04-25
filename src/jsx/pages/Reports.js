import React,{useState, useEffect, useContext, useRef} from 'react';
import { Dropdown } from 'react-bootstrap';
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
    const { changeTitle } = useContext(ThemeContext)
    const [data, setData] = useState(
		document.querySelectorAll("#report_wrapper tbody tr")
	);
    let days = 0
    for (let date = startOfMonth(new Date()); isBefore(date, new Date()); date = moment(date).add(1, "day").toDate()) {
        console.log("Date: ", date.toString())
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
            rmr: 0,
        },
        coltan: {
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            rmr: 0,
        },
        wolframite: {
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
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
	const sort = 10;
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

    const loadReport = ()=>{
        axios.get(`${baseURL_}report/${type}`, {
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
      setData(document.querySelectorAll("#report_wrapper tbody tr"));
      changeTitle(`Reports | Minexx`)
        loadReport()
    }, [type]);

  
   // Active pagginarion
   activePag.current === 0 && chageData(0, sort);
   // paggination
   let paggination = Array(Math.ceil(data.length / sort))
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
					<li className="breadcrumb-item"><Link to={"#"} >{ type === 'today' ? `Today's Report` : type === `daily` ? `Total Stock Delivery` : type === `mtd` ? `In-Stock Country Balance` : `Total Purchase`}</Link></li>
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
                                            <span>
                                                {paggination.map((number, i) => (
                                                    <Link
                                                        key={i}
                                                        to="/reports"
                                                        className={`paginate_button  ${
                                                            activePag.current === i ? "current" : ""
                                                        } `}
                                                        onClick={() => onClick(i)}
                                                    >
                                                        {number}
                                                    </Link>
                                                ))}
                                            </span>

                                            <Link
                                                className="paginate_button next"
                                                to="/reports"
                                                onClick={() =>
                                                    activePag.current + 1 < paggination.length &&
                                                    onClick(activePag.current + 1)
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
                :
                <div>
                </div>
                }
            </div>
        </>
    );
};


export default Reports;