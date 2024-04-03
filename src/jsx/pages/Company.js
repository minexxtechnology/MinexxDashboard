import React,{useState, useEffect, useRef, Fragment, useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Dropdown, ListGroup, Modal, Nav, Tab} from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import { apiKey, baseURL, baseURL_ } from '../../config'
import ComplianceTable from '../components/table/ComplianceTable';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ThemeContext } from '../../context/ThemeContext';

const ticketData = [
    {title:'Glee Smiley', gender:'Male', type:'Customer', Rgdate:'10 Jan, 2023', Expdate:'12 Jan, 2023' },
    {title:'Louis Jovanny', gender:'Male',type:'Guest', Rgdate:'13 Jan, 2023', Expdate:'15 Jan, 2023'   },
    {title:'Cindy Hawkins', gender:'Female',type:'Customer', Rgdate:'14 Jan, 2023', Expdate:'16 Jan, 2023'},
    {title:'Glee Smiley', gender:'Male',type:'Guest', Rgdate:'17 Jan, 2023', Expdate:'19 Jan, 2023'},
    {title:'Timothy L. Brodbeck', gender:'Male',type:'Customer', Rgdate:'18 Jan, 2023', Expdate:'20 Jan, 2023'},
    {title:'Louis Jovanny', gender:'Male', type:'Guest', Rgdate:'21 Jan, 2023', Expdate:'23 Jan, 2023'},
    {title:'Timothy L. Brodbeck', gender:'Female',type:'Customer', Rgdate:'22 Jan, 2023', Expdate:'24 Jan, 2023'},
    {title:'Cindy Hawkins', gender:'Male',type:'Customer', Rgdate:'25 Jan, 2023', Expdate:'27 Jan, 2023'},
    {title:'Louis Jovanny', gender:'Male',type:'Guest', Rgdate:'26 Jan, 2023', Expdate:'28 Jan, 2023'},
    {title:'Cindy Hawkins', gender:'Female',type:'Customer', Rgdate:'29 Jan, 2023', Expdate:'30 Jan, 2023'},
];

const Company = () => {

    const { id } = useParams()
    const { changeTitle } = useContext(ThemeContext)
    const [company, setcompany] = useState()
    const [documents, setdocuments] = useState([])
    const [shareholders, setshareholders] = useState([])
    const [beneficialOwners, setbeneficialOwners] = useState([])
    const [sharehodlerID, setsharehodlerID] = useState()
	const user = JSON.parse(localStorage.getItem(`_authUsr`))

    const getCompany = async()=>{
        axios.get(`${baseURL_}companies/${id}`).then(response=>{
            setcompany(response.data.company)
            changeTitle(response.data.company.name)
        }).catch(err=>{
            try{
				toast.warn(err.response.data.message)
			}catch(e){
				toast.warn(err.message)
			}
        })
        axios.get(`${baseURL_}documents/${id}`).then(response=>{
            setdocuments(response.data.documents)
        }).catch(err=>{})

        axios.get(`${baseURL_}shareholders/${id}`).then(response=>{
            setshareholders(response.data.shareholders)
        }).catch(err=>{console.log("shareholders error:", err.message)})

        axios.get(`${baseURL_}owners/${id}`).then(response=>{
            console.log(response.data.beneficial_owners)
            setbeneficialOwners(response.data.beneficial_owners)
        }).catch(err=>{console.log("owners error:", err.message)})
    }
    
    useEffect(() => {
        getCompany()
    }, [])

    return (
        <>
            <Modal show={sharehodlerID} onBackdropClick={()=>setsharehodlerID(null)}>
                <Modal.Header>
                    <h3>{sharehodlerID ? sharehodlerID.name : `--`}</h3>
                    <Link onClick={()=>setsharehodlerID(null)}>x</Link>
                </Modal.Header>
                <Modal.Body>
                    <iframe title={sharehodlerID ? sharehodlerID.name : `--`} src={`https://drive.google.com/file/d/${sharehodlerID ? sharehodlerID.nationalID : ``}/preview`} width="100%" height="600" allow="autoplay"></iframe>
                </Modal.Body>
            </Modal>
            <div className="row page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active"><Link to={"/overview"}> Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to={""}> {company ? company.name : `Company Details`}</Link></li>
                </ol>
            </div>
            <div className="row">
                <Tab.Container defaultActiveKey="basic">
                    <div className='colxl-12'>
                        <div className="card">
                            <div className="card-body px-4 py-3 py-md-2">
                                <div className="row align-items-center">
                                    <div className="col-sm-12 col-md-7">
                                        <Nav as="ul" className="nav nav-pills review-tab" role="tablist">
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link  px-2 px-lg-3"  to="#basic" role="tab" eventKey="basic">
                                                    Basic Info
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#documents" role="tab" eventKey="documents">
                                                    Documents <span className='badge badge-primary'>{documents.length}</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#shareholders" role="tab" eventKey="shareholders">
                                                    Shareholders
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#owners" role="tab" eventKey="owners">
                                                    Beneficial Owners
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12 col-xxl-12">
                        <Tab.Content>
                            <Tab.Pane eventKey="basic" id='basic'>
                                <div className='card'>
                                    <div className='card-body'>
                                        <h4 className="text-primary mb-2">Company Name</h4>
                                        <Link className="text-black">{company?.name || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">Company Address</h4>
                                        <Link className="text-black">{company?.address || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">Company Country</h4>
                                        <Link className="text-black">{company?.country || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">Company Number</h4>
                                        <Link className="text-black">{company?.number || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">Company Type</h4>
                                        <Link className="text-black">{company?.type || `--`}</Link>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="documents" id='documents'>
								<ComplianceTable documents={documents}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="shareholders" id='shareholders'>
                                {
                                    shareholders.length === 0 ? 
                                    <div className='card'>
                                        <div className=' card-body text-center'>
                                            <p>No shareholder information/details.</p>
                                        </div>
                                    </div>
                                    : shareholders?.map((shareholder, i) => (
                                        <div className='col-md-4' key={`sh${i}`}>
                                            <div className='card'>
                                                <div className=' card-body'>
                                                    <h5 className='text-primary'>{shareholder?.name}</h5>
                                                    <span>Nationality: {shareholder?.nationality}</span><br/>
                                                    <span>Percentage Owned: {shareholder?.percent}%</span><br/>
                                                    <span>Address: {shareholder?.address || `--`}</span><br/>
                                                    { shareholder.nationalID ? <Link to="" className='btn btn-sm btn-primary mt-3' onClick={()=>setsharehodlerID(shareholder)}>View National ID</Link> : <div></div> }
                                                </div>
                                            </div>
                                    </div>
                                ))}
                            </Tab.Pane>
                            <Tab.Pane eventKey="owners" id='owners'>
                                { beneficialOwners.length === 0 ?
                                    <div className='card'>
                                        <div className=' card-body text-center'>
                                            <p>No beneficial owner(s) information/details.</p>
                                        </div>
                                    </div>
                                    : beneficialOwners?.map((owner, i) => (
                                    <div className='col-md-4' key={`own${i}`}>
                                        <div className='card'>
                                            <div className=' card-body'>
                                                <h5 className='text-primary'>{owner?.name}</h5>
                                                <span>Nationality: {owner?.nationality}</span><br/>
                                                <span>Percentage Owned: {owner?.percent}%</span><br/>
                                                <span>Address: {owner?.address || '--'} </span><br/>
                                                <Link to="" className='btn btn-sm btn-primary mt-3' onClick={()=>setsharehodlerID(owner)}>View National ID</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </Tab.Container>
            </div>
        </>
    );
};


export default Company;