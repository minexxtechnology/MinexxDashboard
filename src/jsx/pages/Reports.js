import React,{useState, useEffect, useContext, useRef} from 'react';
import { Dropdown } from 'react-bootstrap';
import {Link, useParams} from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { apiHeaders, baseURL_ } from '../../config'
import axios from 'axios';
import moment from 'moment';

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

    const { changeTitle } = useContext(ThemeContext)
    const [data, setData] = useState(
		document.querySelectorAll("#report_wrapper tbody tr")
	);
    const [daily, setdaily] = useState({
        cassiterite: {
            dailyTarget: 0,
            dailyActual: 0,
            mtdTarget: 0,
            mtdActual: 0,
        },
        coltan: {
            dailyTarget: 0,
            dailyActual: 0,
            mtdTarget: 0,
            mtdActual: 0,
        },
        wolframite: {
            dailyTarget: 0,
            dailyActual: 0,
            mtdTarget: 0,
            mtdActual: 0,
          }
    })
	const sort = 10;
	const activePag = useRef(0);
	const user = JSON.parse(localStorage.getItem(`_authUsr`))

	// Active data
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
        }).catch(err=>{})
    }

   // use effect
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
					<li className="breadcrumb-item"><Link to={"#"} >{ type === 'today' ? `Today's Report` : type === `daily` ? `Daily Report` : type === `mtd` ? `Month to Date Performance` : `Daily Deliveries`}</Link></li>
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
                                        <table id="example" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Date</th>
                                                    <th>{new Date(moment().subtract(1, "day")).toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="c1">     
                                                    <td className="sorting_1">Daily Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.cassiterite.dailyTarget/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c2">     
                                                    <td className="sorting_1">Daily Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.cassiterite.dailyActual/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c3">     
                                                    <td className="sorting_1">MTD Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.cassiterite.mtdTarget/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c4">     
                                                    <td className="sorting_1">MTD Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.cassiterite.mtdActual/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c5">     
                                                    <td className="sorting_1">MTD Actuals vs Target (%)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{Number(daily.cassiterite.mtdActual/daily.cassiterite.mtdTarget)*100}%</Link>
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
                                        <table id="example" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>Date</th>
                                                    <th>{new Date(moment().subtract(1, "day")).toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="c1">     
                                                    <td className="sorting_1">Daily Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.coltan.dailyTarget/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c2">     
                                                    <td className="sorting_1">Daily Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.coltan.dailyActual/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c3">     
                                                    <td className="sorting_1">MTD Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.coltan.mtdTarget/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c4">     
                                                    <td className="sorting_1">MTD Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.coltan.mtdActual/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c5">     
                                                    <td className="sorting_1">MTD Actuals vs Target (%)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.mtdActual/daily.coltan.mtdTarget)*100}%</Link>
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
                                                    <th>Date</th>
                                                    <th>{new Date(moment().subtract(1, "day")).toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="c1">     
                                                    <td className="sorting_1">Daily Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.wolframite.dailyTarget/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c2">     
                                                    <td className="sorting_1">Daily Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.wolframite.dailyActual/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c3">     
                                                    <td className="sorting_1">MTD Target (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.wolframite.mtdTarget/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c4">     
                                                    <td className="sorting_1">MTD Actuals (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{daily.wolframite.mtdActual/1000}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="c5">     
                                                    <td className="sorting_1">MTD Actuals vs Target (%)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{Number((daily.wolframite.mtdActual/daily.wolframite.mtdTarget)*100)}%</Link>
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