import React,{useState, useEffect, useContext, useRef} from 'react';
import { Button, Modal, Dropdown, Nav, Tab, Table } from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { baseURL_ } from '../../config'
import moment from 'moment';
import {startOfMonth, isWeekend, isBefore} from 'date-fns'
import { Logout } from '../../store/actions/AuthActions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/AxiosInstance';
import ReactApexChart from 'react-apexcharts';


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
    // const [dailyData, setDailyData] = useState({ cassiterite: [], coltan: [], wolframite: [] });
    const access = localStorage.getItem(`_dash`) || '3ts'
    const [attachment, setattachment] = useState()
    const [companies, setcompanies] = useState([])
    const [company, setcompany] = useState()
    const [trace, settrace] = useState({
        production: [],
        bags: [],
        blending: {
            header: [],
            rows: []
        },
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
    const[monthly,setMonthly]=useState({
        cassiterite:
        {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,
        },
        coltan: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        },
        wolframite: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        }


    });
    const[monthlypurchase,setMonthlyPurchase]=useState({
        cassiterite:
        {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,
        },
        coltan: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        },
        wolframite: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

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

	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};

    const showAttachment  = (file, field)=>{
        axiosInstance.post(`${baseURL_}image`, {
            file
        }).then(response=>{
            setattachment({image: response.data.image, field})
            //this is incase the view permission was not granted before
            setTimeout(()=>{
                setattachment({image: response.data.image, field})
            }, 5000)
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
        axiosInstance.get(`/companies`).then(response=>{
            setcompanies(response.data.companies)
        })
    }

    const loadReport = ()=>{
        if(type === `trace`){
            settrace({
                production: [],
                bags: [],
                blending: {
                    header: [],
                    rows: []
                },
                purchases: {
                    header: [],
                    rows: []
                },
                drums: [],
                bags_proc: [],
                processing: [],
                exports: []
            })
        }
        if(type === `trace` && !company){
            return
        }
        axiosInstance.get(`/report/${type !== 'trace' ? type : type+'/'+company?.id}`).then(response=>{
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
        return array ? array.slice((page_number - 1) * page_size, page_number * page_size) : []
    }

    useEffect(() => {
        setData(document.querySelectorAll("#report_wrapper tbody tr"));
        changeTitle(`Reports | Minexx`)
        loadReport()
        loadMonthlyData();
        loadMonthlyPurchase();
        if(type === 'trace'){
            loadCompanies()
        }
    }, [type, company]);
    const loadMonthlyData = () => {
        axiosInstance.get(`/report/Monthly`)
            .then(response => {
                const { cassiterite, coltan, wolframite } = response.data;

                setMonthly({  
                    cassiterite: cassiterite ,
                    coltan: coltan ,
                    wolframite: wolframite 
                });
    
                console.log('Monthly data:', {  
                    cassiterite: cassiterite ,
                    coltan: coltan ,
                    wolframite: wolframite
                });
    
            })
            .catch(err => {
                try {
                    if (err.response.code === 403) {
                        dispatch(Logout(navigate));
                    } else {
                        toast.warn(err.response.message);
                    }
                } catch (e) {
                    toast.error(err.message);
                }
            });
    };
    const loadMonthlyPurchase = () => {
        axiosInstance.get(`/report/purchaseMonthly`)
            .then(response => {
                const { cassiterite, coltan, wolframite } = response.data.purchases;

                setMonthlyPurchase({  
                    cassiterite: cassiterite ,
                    coltan: coltan ,
                    wolframite: wolframite 
                });
    
                console.log('MonthlyPurchase data:', {  
                    cassiterite: cassiterite ,
                    coltan: coltan ,
                    wolframite: wolframite
                });
    
            })
            .catch(err => {
                try {
                    if (err.response.code === 403) {
                        dispatch(Logout(navigate));
                    } else {
                        toast.warn(err.response.message);
                    }
                } catch (e) {
                    toast.error(err.message);
                }
            });
    };

  
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
   //Chart For the Daily 
   const chartSeries = [
    {
        name: 'Cassiterite',
        data: [
            monthly.cassiterite[0]/1000,
            monthly.cassiterite[1]/1000,
            monthly.cassiterite[2]/1000,
            monthly.cassiterite[3]/1000,
            monthly.cassiterite[4]/1000,
            monthly.cassiterite[5]/1000,
            monthly.cassiterite[6]/1000,
            monthly.cassiterite[7]/1000,
            monthly.cassiterite[8]/1000,
            monthly.cassiterite[9]/1000,
            monthly.cassiterite[10]/1000,
            monthly.cassiterite[11]/1000,
        ],
    },
    {
        name: 'Coltan',
        data: [
            monthly.coltan[0]/1000,
            monthly.coltan[1]/1000,
            monthly.coltan[2]/1000,
            monthly.coltan[3]/1000,
            monthly.coltan[4]/1000,
            monthly.coltan[5]/1000,
            monthly.coltan[6]/1000,
            monthly.coltan[7]/1000,
            monthly.coltan[8]/1000,
            monthly.coltan[9]/1000,
            monthly.coltan[10]/1000,
            monthly.coltan[11]/1000,
        ],
    },
    {
        name: 'Wolframite',
        data: [
            monthly.wolframite[0]/1000,
            monthly.wolframite[1]/1000,
            monthly.wolframite[2]/1000,
            monthly.wolframite[3]/1000,
            monthly.wolframite[4]/1000,
            monthly.wolframite[5]/1000,
            monthly.wolframite[6]/1000,
            monthly.wolframite[7]/1000,
            monthly.wolframite[8]/1000,
            monthly.wolframite[9]/1000,
            monthly.wolframite[10]/1000,
            monthly.wolframite[11]/1000,
        ],
    },
];

const chartOptions = {
    chart: {
        type: 'bar',
        height: 500,
        stacked: false,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
    },
    xaxis: {
        categories: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
    },
    yaxis: {
        title: {
            text: 'MTD Actuals (TONS)',
        },
        labels: {
            formatter: function (value) {
                return value.toFixed(2); // Adjust the number of decimal places as needed
            },
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + ' TONS';
            },
        },
    },
    fill: {
        opacity: 1,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        labels: {
            colors: ['#fff','#fff','#fff']
        }
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '70%',
                    },
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetX: 0,
                },
            },
        },
    ],
};
 //end the Daily Graph

    //chart For Balance in Country
    const chartSeries_Balance = [
        {
            name: 'With RMR (TONS)',
            data: [
                (balance.cassiterite.rmr/1000).toFixed(2),
                (balance.coltan.rmr/1000).toFixed(2),
                (balance.wolframite.rmr/1000).toFixed(2),
            ],
            
            
        },
        {
            name: 'With Minexx (TONS)',
            data: [
                (balance.cassiterite.minexx/1000).toFixed(2),
                (balance.coltan.minexx/1000).toFixed(2),
                (balance.wolframite.minexx/1000).toFixed(2),
            ],
        },
        {
            name: 'Pending Shipment (TONS)',
            data: [
                (balance.cassiterite.pending/1000).toFixed(2),
                (balance.coltan.pending/1000).toFixed(2),
                (balance.wolframite.pending/1000).toFixed(2),
            ],
        },
        {
            name: 'Shipped (TONS)',
            data: [
                (balance.cassiterite.shipped/1000).toFixed(2),
                (balance.coltan.shipped/1000).toFixed(2),
                (balance.wolframite.shipped/1000).toFixed(2),
            ],
        },
        {
            name: 'With Buyer (SOLD)',
            data: [
                (balance.cassiterite.buyer/1000).toFixed(2),
                (balance.coltan.buyer/1000).toFixed(2),
                (balance.wolframite.buyer/1000).toFixed(2),
            ],
        },
        
    ];

    const chartOptions_Balance = {
        chart: {
            type: 'bar',
            height: 500,
            stacked: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
        },
        xaxis: {
            categories: ['Cassiterite', 'Coltan', 'Wolframite'],
        },
        yaxis: {
            title: {
                text: 'TONS / Percentage',
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(2); // Adjust the number of decimal places as needed
                },
            },
        },
        tooltip: {
            y: {
                formatter: function (val, { series, seriesIndex }) {
                    const seriesName = series?.[seriesIndex]?.name;
                    if (seriesName && seriesName.includes('%')) {
                        return val + ' %';
                    }
                    return val + ' TONS';
                },
            },
        },
        fill: {
            opacity: 1,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
            labels: {
                colors: ['#ffff', '#ffff', '#ffff','#ffff', '#ffff'] // Change these colors as needed
            }
        },
        responsive: [
            {
                breakpoint: 1000,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: '70%',
                        },
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center',
                        offsetX: 0,
                    },
                },
            },
        ],
    };
//End for Balance in Country

//Graph for Purchased
const chartSeries_Purchase = [
    {
        name: 'Cassiterite',
        data: [
            monthlypurchase.cassiterite[0],
            monthlypurchase.cassiterite[1],
            monthlypurchase.cassiterite[2],
            monthlypurchase.cassiterite[3],
            monthlypurchase.cassiterite[4],
            monthlypurchase.cassiterite[5],
            monthlypurchase.cassiterite[6],
            monthlypurchase.cassiterite[7],
            monthlypurchase.cassiterite[8],
            monthlypurchase.cassiterite[9],
            monthlypurchase.cassiterite[10],
            monthlypurchase.cassiterite[11],
        ],
    },
    {
        name: 'Coltan',
        data: [
            monthlypurchase.coltan[0],
            monthlypurchase.coltan[1],
            monthlypurchase.coltan[2],
            monthlypurchase.coltan[3],
            monthlypurchase.coltan[4],
            monthlypurchase.coltan[5],
            monthlypurchase.coltan[6],
            monthlypurchase.coltan[7],
            monthlypurchase.coltan[8],
            monthlypurchase.coltan[9],
            monthlypurchase.coltan[10],
            monthlypurchase.coltan[11],
        ],
    },
    {
        name: 'Wolframite',
        data: [
            monthlypurchase.wolframite[0],
            monthlypurchase.wolframite[1],
            monthlypurchase.wolframite[2],
            monthlypurchase.wolframite[3],
            monthlypurchase.wolframite[4],
            monthlypurchase.wolframite[5],
            monthlypurchase.wolframite[6],
            monthlypurchase.wolframite[7],
            monthlypurchase.wolframite[8],
            monthlypurchase.wolframite[9],
            monthlypurchase.wolframite[10],
            monthlypurchase.wolframite[11],
        ],
    },
];

const chartOptions_Purchase = {
    chart: {
        type: 'bar',
        height: 500,
        stacked: false,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
    },
    xaxis: {
        categories: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
    },
    yaxis: {
        title: {
            text: 'Total Amount Piad($)',
        },
        labels: {
            formatter: function (value) {
                return value.toFixed(2); // Adjust the number of decimal places as needed
            },
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + ' Money($)';
            },
        },
    },
    fill: {
        opacity: 1,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        labels: {
            colors: ['#fff','#fff','#fff']
        }
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '70%',
                    },
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetX: 0,
                },
            },
        },
    ],
};
//end Purchase 
    return (
        <>
            { attachment ? <Modal size='lg' show={attachment} onBackDropClick={()=>setattachment(null)}>
                <Modal.Header>
                    <h3 className='modal-title'>{attachment.field}</h3>
                    <Link className='modal-dismiss' data-toggle="data-dismiss" onClick={()=>setattachment(null)}>x</Link>
                </Modal.Header>
                <Modal.Body>
                    <img alt='' className='rounded mt-4' width={'100%'} src={`https://lh3.googleusercontent.com/d/${attachment.image}=w2160?authuser=0`}/>
                </Modal.Body>
            </Modal> : null }
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
                                                        bagsPage < paggination(trace?.bags || []).length &&
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
                                {/* Stock Delivery */}
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
                    <div className='col-12 mt-4'>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Minerals Performance Overview</h4>
                            </div>
                            <div className="card-body">
                            <ReactApexChart
                                options={chartOptions}
                                series={chartSeries}
                                type="bar"
                                height={500}
                            />
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
                                {/* In Stock Country */}
                                <h4 className="card-title">Cassiterites</h4>
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
                                                <tr key="cb2">     
                                                    <td className="sorting_1">With RMR (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb1">     
                                                    <td className="sorting_1">With Minexx (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb5">     
                                                    <td className="sorting_1">Pending Shipment (TONS)</td>
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
                                                <tr key="cb3">     
                                                    <td className="sorting_1">With Buyer (SOLD)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.buyer/1000).toFixed(2)}</Link>
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
                                                <tr key="ccb2">     
                                                    <td className="sorting_1">With RMR (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb1">     
                                                    <td className="sorting_1">With Minexx (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb5">     
                                                    <td className="sorting_1">Pending Shipment (TONS)</td>
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
                                                <tr key="ccb3">     
                                                    <td className="sorting_1">With Buyer (SOLD)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.buyer/1000).toFixed(2)}</Link>
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
                                                <tr key="wb2">     
                                                    <td className="sorting_1">With RMR (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb1">     
                                                    <td className="sorting_1">With Minexx (TONS)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb5">     
                                                    <td className="sorting_1">Pending Shipment (TONS)</td>
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
                                                <tr key="wb3">     
                                                    <td className="sorting_1">With Buyer (SOLD)</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.buyer/1000).toFixed(2)}</Link>
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
                    <div className='col-12 mt-4'>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Minerals Performance Overview</h4>
                            </div>
                            <div className="card-body">
                                <ReactApexChart
                                    options={chartOptions_Balance}
                                    series={chartSeries_Balance}
                                    type="bar"
                                    height={500}
                                />
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
                                {/* Total Purchase */}
                                <h4 className="card-title">Cassiterites</h4>
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
                    <div className='col-12 mt-4'>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Minerals Performance Overview</h4>
                            </div>
                            <div className="card-body">
                                <ReactApexChart
                                    options={chartOptions_Purchase}
                                    series={chartSeries_Purchase}
                                    type="bar"
                                    height={500}
                                />
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
                                { companies.map(company=><option key={company.id} value={JSON.stringify(company)}>{company.name}</option>) }
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
                            { access === `3ts` ?
                            <>
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
                            </> :
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#purchase" role="tab" eventKey="purchase">
                                    Purchase
                                </Nav.Link>
                            </Nav.Item> }
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
                                            { access === `3ts` ? <Table bordered striped hover responsive size='sm'>
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
                                            </Table> : <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        { trace.production?.header?.map(h=><th className="text-center text-dark">
                                                            {h}
                                                        </th>) }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        trace.production?.production?.map((prod, i)=><tr key={`prod${i}`}>
                                                            {   prod.map(p=><td>{p.includes('Images') ? <button onClick={()=>showAttachment(p, `Transaction: ${prod[0]}`)} className='btn btn-sm btn-primary'>View</button> : p}</td>) }
                                                        </tr>)
                                                    }
                                                    {
                                                        trace.production?.production?.length === 0 ? <tr>
                                                            <td colSpan={9}>The selected company does not have any production to show.</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>}
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            { access === `3ts` ?
                            <>
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
                                                        paginate(trace?.bags || [], bagsPage, 20).map((bag, i)=><tr key={`bag${i}`}>
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
                                                        trace?.bags.length === 0 ? <tr>
                                                            <td colSpan={14}>The selected company does not have any produced bags to show.</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                Showing {(bagsPage-1) * sort + 1} to{" "}
                                                {trace?.bags.length > bagsPage * sort
                                                    ? bagsPage*sort
                                                    : trace?.bags.length}{" "}
                                                of {trace?.bags.length} entries
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
                                                        bagsPage < paggination(trace?.bags || []).length &&
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
                                                        paginate(trace?.bags_proc, bagsProcPage, 20).map((bag, i)=><tr key={`bag${i}`}>
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
                                                        trace?.bags_proc.length === 0 ? <tr>
                                                            <td colSpan={24}>The selected company does not have any processed bags to show.</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                Showing {(bagsProcPage-1) * sort + 1} to{" "}
                                                {trace?.bags_proc.length > bagsProcPage * sort
                                                    ? bagsProcPage*sort
                                                    : trace?.bags_proc.length}{" "}
                                                of {trace?.bags_proc.length} entries
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
                                                        bagsProcPage < paggination(trace?.bags_proc).length &&
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
                                    {
                                        <div className="w-100 table-responsive">
                                            <div id="patientTable_basic_table" className="dataTables_wrapper">
                                                <table
                                                    id="example5"
                                                    className="display dataTable w-100 no-footer"
                                                    role="grid"
                                                    aria-describedby="example5_info"
                                                >
                                                    <thead>
                                                    <tr role="row">
                                                        { trace.blending['header'].map(header=><th
                                                            className="sorting"
                                                            tabIndex={0}
                                                            aria-controls="example5"
                                                            rowSpan={1}
                                                            colSpan={1}
                                                            style={{ width: 73 }}
                                                            >
                                                            {header}
                                                        </th>) }
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        { trace.blending['rows'].length === 0 ? <tr>
                                                            <td colSpan={trace.blending['header'].length}>Company does not have any blending records to report on.</td> 
                                                        </tr> :
                                                        trace.blending['rows'].map(row=><tr key={`blending-${row[0]}`}>{
                                                            row.map((field, i)=><td>
                                                            {field.includes(`Miners_Images`) ? 
                                                                <button className="btn btn-sm btn-primary" onClick={()=>showAttachment(field, trace.blending['header'][i])}>View</button> : 
                                                            field }
                                                            </td>)
                                                        }</tr>)
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    }
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
                            </> : 
                            <Tab.Pane eventKey="purchase" id='purchase'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>Purchase</h4>
                                    </div>
                                    <div className='card-body'>
                                    {
                                        <div className="w-100 table-responsive">
                                            <div id="patientTable_basic_table" className="dataTables_wrapper">
                                                <Table bordered striped hover responsive size='sm'>
                                                    <thead>
                                                    <tr role="row">
                                                        { trace.purchases['header'].map(header=><th
                                                            className="sorting"
                                                            tabIndex={0}
                                                            aria-controls="example5"
                                                            rowSpan={1}
                                                            colSpan={1}
                                                            style={{ width: 73 }}
                                                            >
                                                            {header}
                                                        </th>) }
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        { trace.purchases['rows'].length === 0 ? <tr>
                                                            <td colSpan={trace.purchases['header'].length}>Company does not have any purchase records to report on.</td> 
                                                        </tr> :
                                                        trace.purchases['rows'].map(row=><tr key={`purchase-${row[0]}`}>{
                                                            row.map((field, i)=><td>
                                                            {field.includes(`Sell_Images`) ? 
                                                                <button className="btn btn-sm btn-primary" onClick={()=>showAttachment(field, trace.purchases['header'][i])}>View</button> : 
                                                            field }
                                                            </td>)
                                                        }</tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </Tab.Pane> }
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
                                                                <td>{access === '3ts' ? exp.netWeight : (exp.netWeight/1000).toFixed(2)}</td>
                                                                <td>{access === '3ts' ? exp.grossWeight : (exp.grossWeight/1000).toFixed(2)}</td>
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
                                                                <td><Link to={`/exports/${exp.id}`}>View Attachments</Link></td>
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
                                                {(trace.exports.length > exportsPage * sort
                                                    ? exportsPage*sort
                                                    : trace.exports.length)}{" "}
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