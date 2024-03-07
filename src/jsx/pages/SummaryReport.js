import React,{useState, useEffect, useRef} from 'react';
import { Dropdown } from 'react-bootstrap';
import {Link} from 'react-router-dom';

import ReportPieChart from './Reports/ReportPieChart';
import ReportPieChart2 from './Reports/ReportPieChart2';
import ReportPieChart3 from './Reports/ReportPieChart3';

const chartBlog = [
    {title:'Employees'},
    {title:'Customers'},
];

const ticketBlog = [
    {title:'Minexx', color:'warning'},
    {title:'Investors', color:'success'},
    {title:'Buyers', color:'info'},
    {title:'Government/Regulators', color:'primary'},
    {title:'Mine Supervisor', color:'danger'},
];

const ticketData = [
    {number:"01", emplid:"Emp-0852", count:'3'},
    {number:"02", emplid:"Emp-2052", count:'5'},
    {number:"03", emplid:"Emp-3052", count:'9'},
    {number:"04", emplid:"Emp-3055", count:'8'},
    {number:"05", emplid:"Emp-1052", count:'6'},
    {number:"06", emplid:"Emp-3055", count:'1'},
    {number:"07", emplid:"Emp-3052", count:'4'},
];

const SummaryReport = () => {
    const [data, setData] = useState(
		document.querySelectorAll("#report_wrapper tbody tr")
	);
	const sort = 10;
	const activePag = useRef(0);
	//const [test, settest] = useState(0);

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
   // use effect
   useEffect(() => {
      setData(document.querySelectorAll("#report_wrapper tbody tr"));
      //chackboxFun();
	}, []);

  
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
					<li className="breadcrumb-item"><Link to={"#"} >Summary Report</Link></li>
				</ol>
			</div>
            <div className="row">
                {chartBlog.map((item, index)=>(
                    <div className="col-xl-3 col-md-6" key={index}>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">{index === 0 ? `Users Statuses` : `Sessions Summary`}</h4>
                            </div>
                            <div className="card-body">
                                {index === 0 ? 
                                    <ReportPieChart />
                                    :
                                    index === 1 ? 
                                        <ReportPieChart2 />
                                    :
                                    ''
                                }
                                <div className="chart-deta d-flex justify-content-center">
                                    <div className="mb-0 d-flex justify-content-center me-2">
                                        <span className="dots bg-warning"></span>	
                                        <div className="dots-text my-auto">
                                            <p className="fs-14 mb-0">{index === 0 ? `Suspended` : `Invalid/Ended`}</p>
                                        </div>
                                    </div>
                                    <div className="mb-0 d-flex justify-content-center me-2">
                                        <span className="dots bg-success"></span>	
                                        <div className="dots-text my-auto">
                                            <p className="fs-14 mb-0">{index === 0 ? `Active` : `Valid/Active`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>	
                ))}
                <div className="col-xl-6 col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">User Sessions</h4>
                        </div>
                        <div className="card-body d-flex">
                         
                            <ReportPieChart3 />
                            <div className="chart-deta d-flex align-items-center flex-wrap">
                                {ticketBlog.map((data, ind)=>(
                                    <div className="mb-2 d-flex me-3" key={ind}>
                                        <span class={`dots bg-${data.color}`}></span>	
                                        <div className="dots-text">
                                            <p className="fs-14 mb-0">{data.title}</p>
                                        </div>
                                    </div>
                                ))}                               
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};


export default SummaryReport;