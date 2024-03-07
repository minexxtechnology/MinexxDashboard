import React,{useState, useEffect, useRef, useContext} from 'react'
import {Link} from 'react-router-dom'
import {Accordion} from 'react-bootstrap'
import { ThemeContext } from '../../../context/ThemeContext'
import PerfectScrollbar from "react-perfect-scrollbar"
import { apiHeaders, baseURL_ } from '../../../config'
import axios from 'axios'
import { toast } from 'react-toastify';

const Mines = () => {
    const [data, setData] = useState(
		document.querySelectorAll("#ticket_wrapper tbody tr")
	)
	const { changeTitle } = useContext(ThemeContext);
    const [suppliers, setsuppliers] = useState([])
    const [mines, setmines] = useState([])
	const sort = 10;
	const activePag = useRef(0);
    const [filtered, setfiltered] = useState([])

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

    const fetch = async()=>{
        try{
            let response = await axios.get(`${baseURL_}companies`, { aders: apiHeaders })
            let response_ = await axios.get(`${baseURL_}mines`, { headers: apiHeaders })
            setsuppliers(response.data.companies.filter(single=>single.id===`ce62eb6o`))
            setfiltered(response.data.companies.filter(single=>single.id===`ce62eb6o`))
            setmines(response_.data.mines)
        }catch(err){
            try{
                toast.warn(err.response.data.message)
            }catch(e){
                toast.warn(err.message)
            }
        }
    }

    // use effect
    useEffect(() => {
        fetch()
        setData(document.querySelectorAll("#ticket_wrapper tbody tr"));
		changeTitle(`Mines | Minexx`)
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

    const filter = e => {
        let input = e.currentTarget.value
        setfiltered(suppliers.filter(site=>{
            return site.name.toLowerCase().includes(input.toLowerCase())
        }))
    }
   
	const chackbox = document.querySelectorAll(".sorting_1 input");
	const motherChackBox = document.querySelector(".sorting_asc input");
   // console.log(document.querySelectorAll(".sorting_1 input")[0].checked);
	const chackboxFun = (type) => {
      for (let i = 0; i < chackbox.length; i++) {
         const element = chackbox[i];
         if (type === "all") {
            if (motherChackBox.checked) {
               element.checked = true;
            } else {
               element.checked = false;
            }
         } else {
            if (!element.checked) {
               motherChackBox.checked = false;
               break;
            } else {
               motherChackBox.checked = true;
            }
         }
      }
    };
    return (
        <>
            <div className="row page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active"><Link to={"/overview"}> Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to={""}> Mines</Link></li>
                </ol>
            </div>
            <div className="row">
                <div className="col-xl-12 col-xxl-12">
                    <div className="card event-bx">
                        <PerfectScrollbar className="card-body dz-scroll" style={{ height: 700, overflow: 'hidden' }}>
                            <Accordion className="accordion accordion-rounded-stylish accordion-bordered mt-2" defaultActiveKey="ce62eb6o">
                                { filtered.map((supplier, index) =>{
                                    return (<Accordion.Item className="accordion-item" key={supplier?.id} eventKey={supplier?.id}>
                                        <Accordion.Header className="accordion-header rounded-lg">
                                            <span className='text-primary'>{supplier?.name}</span>
                                            &emsp;<span className='badge badge-primary'>{mines.filter(single=>single.company === supplier.id).length}</span>
                                        </Accordion.Header>
                                        <Accordion.Collapse id={supplier?.id} eventKey={supplier?.id}>
                                            <div className="accordion-body">
                                                { mines.filter(single=>single.company === supplier.id).length === 0 ? <div className='pa-5 text-center'>There are no mine sites associted with {supplier.name}</div>
                                                : mines.filter(single=>single.company === supplier.id).map(mine=><p className='mt-2 mb-2' key={mine.id}><Link className='text-warning' to={`/mine/${mine.id}`}>{mine.name}</Link><br/></p>)}
                                            </div>
                                        </Accordion.Collapse>
                                    </Accordion.Item>) }
                                )}
                            </Accordion>
                            {/* { filtered.length === 0 ?
                            <div className='text-center pa-10'>No suppliers to display at the moment</div>
                            : filtered.map((supplier, index)=>(
                                <div className="media d-md-flex d-block pb-3 border-bottom mb-3" key={index}>
                                    <div className="image">	
                                        <img src={`https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png`} alt="" />
                                    </div>
                                    <div className="media-body">
                                        <h4 className="fs-18 mb-sm-0 mb-4"><Link to={"#"}> {supplier.name}</Link></h4>
                                        
                                        <p className="fs-12">{supplier?.note}</p>
                                    </div>
                                    <div className="media-footer">
                                        <div className="text-center">
                                            <i className="fas fa-gem"></i>
                                            <div className="fs-12 text-white">{supplier.mineral}</div>
                                        </div>
                                        <div className="text-center">
                                            <FontAwesomeIcon icon={icon({name: 'scale-unbalanced'})} />
                                            <div className="fs-12 text-white">1M tons</div>
                                        </div>
                                        <div className="text-center" style={{ maxWidth: 100 }}>
                                            <i className="far fa-map"></i>
                                            <div className="fs-12 text-white">{supplier.location ? supplier.location : '--'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))} */}
                            
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Mines;