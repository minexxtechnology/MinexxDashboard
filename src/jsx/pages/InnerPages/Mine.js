import React,{useState, useEffect, useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Modal, Nav, Tab} from 'react-bootstrap';
import LightGallery from 'lightgallery/react';
// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { apiHeaders, baseURL_ } from '../../../config'
import axios from 'axios';
import { ThemeContext } from '../../../context/ThemeContext';
import AssessmentsTable from '../../components/table/AssessmentsTable';

const Mine = () => {

    const { id } = useParams()
    const { changeTitle } = useContext(ThemeContext)
    const [mine, setmine] = useState()
    const [videos, setvideos] = useState([])
    const [incidentview, setincidentview] = useState()
    const [headers, setheaders] = useState([])
    const [incidents, setincidents] = useState([])
    const [picture, setpicture] = useState()
    const [location, setlocation] = useState('1.9403,29.8739')
    const [assessments, setassessments] = useState([])
	const user = JSON.parse(localStorage.getItem(`_authUsr`))
    const [gallery, setgallery] = useState([])

    const getMine = async()=>{
        
        // mine images
        axios.get(`${baseURL_}mines/images/${id}`).then(response=>{
            setgallery(response.data.images)
        }).catch(()=>{})
        
        // mine details
        axios.get(`${baseURL_}mines/${id}`, { headers: apiHeaders }).then(response=>{
            changeTitle(response.data.mine.name + ` | Minexx`)
            setpicture(`https://lh3.googleusercontent.com/d/${response.data.mine.image}=w2160?authuser=0`)
            setmine(response.data.mine)
        }).catch(()=>{})

        // mine videos
        axios.get(`${baseURL_}mines/videos/${id}`, { headers: apiHeaders }).then(response=>{
            setvideos(response.data.videos)
        }).catch(err=>{})

        // mine assessments
        axios.get(`${baseURL_}assessments/mine/${id}`, { headers: apiHeaders }).then(response=>{
            setassessments(response.data.assessments)
            setheaders(response.data.header)
            if(response.data.assessments.length>0){
                setlocation(response.data.assessments[0].general[4])
            }
        }).catch(err=>{})

        // incidents assessments
        axios.get(`${baseURL_}incidents/mine/${id}`, { headers: apiHeaders }).then(response=>{
            setincidents(response.data.incidents)
        }).catch(err=>{})
    }
    
    useEffect(() => {
        getMine()
    }, [])

    return (
        <>
            { incidentview ?
            <Modal size='lg' show={incidentview} onBackdropClick={()=>setincidentview(null)}>
                <Modal.Header>
                    <h3 className='modal-title'>Incident: {incidentview.id}</h3>
                    <Link className='modal-dismiss' data-toggle="data-dismiss" onClick={()=>setincidentview(null)}>x</Link>
                </Modal.Header>
                <Modal.Body>
                    <Tab.Container defaultActiveKey="incidentInfo">
                        <Nav as="ul" className="nav nav-pills review-tab" role="tablist">
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link  px-2 px-lg-3"  to="#incidentInfo" role="tab" eventKey="incidentInfo">
                                    Incident Info
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#image" role="tab" eventKey="image">
                                    Image
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#proof" role="tab" eventKey="proof">
                                    Proof
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="incidentInfo" id='incidentInfo'>
                                <div className='card'>
                                    <div className='card-body border mt-4 rounded'>
                                        { Object.keys(incidentview).filter(k=>k!=="image" && k!=="company" && k!=="proof" && k!=="location" && incidentview[k]).map(key=><div className='row'>
                                        <div className='col-4'><h5>{key.toUpperCase()}: </h5></div>
                                        <div className='col-8'>
                                            <p className={`font-w200 ${key === 'level' ? incidentview.level === 'low' ? 'text-primary' : incidentview.level === 'medium' ? 'text-warning' : incidentview.level === 'high' ? 'text-danger' : 'text-warning' : '' }`}>{incidentview[key]}</p>
                                        </div>
                                        </div>) }
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="image" id='image'>
                                <img alt='' className='rounded mt-4' width={'100%'} src={`https://lh3.googleusercontent.com/d/${incidentview.image}=w2160?authuser=0`}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="proof" id='proof'>
                                <iframe className='rounded' title={incidentview.proof} src={`https://drive.google.com/file/d/${incidentview.proof}/preview`} width="100%" height={500} allow="autoplay"></iframe>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={()=>setincidentview(null)} className='btn btn-sm btn-outline-warning'>Dismiss</button>
                </Modal.Footer>
            </Modal> : <div></div>}
            <div className="row page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active"><Link to={"/overview"}> Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to={""}> {mine?.name}</Link></li>
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
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#assessments" role="tab" eventKey="assessments">
                                                    Assessments
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#incidents" role="tab" eventKey="incidents">
                                                    Incidents
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#gallery" role="tab" eventKey="gallery">
                                                    Gallery
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#map" role="tab" eventKey="map">
                                                    Map
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
                                        <img className='rounded mb-4' style={{ width: '100%' }} alt='' src={picture}/>
                                        {/* src={`${mine?.image?.webContentLink?.replaceAll('uc', 'thumbnail')?.replaceAll('&export=download', '')}`}/> */}
                                        <h4 className="text-primary mb-2">Mine Name</h4>
                                        <Link className="text-black">{mine?.name || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">Mine Address</h4>
                                        <Link className="text-black">{mine?.location || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">Mineral</h4>
                                        <Link className="text-black">{mine?.mineral || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">Note</h4>
                                        <Link className="text-black">{mine?.note || `--`}</Link>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="assessments" id='assessments'>
								<AssessmentsTable headers={headers} assessments={assessments}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="incidents" id='incidents'>
                                <div className="card-body pt-0 p-0" style={{ maxHeight: 700, overflow: 'auto' }}>
                                    { incidents.length === 0 ?
                                        <div className='card'>
                                            <div className='card-body'>
                                                <h5 className="mt-0 mb-0">No incidents</h5>
                                                <p className=" fs-12 font-w200">There are no incidents to display yet.</p>
                                            </div>
                                        </div>
                                    : incidents.map(incident=>(<div onClick={()=>setincidentview(incident)} className="media align-items-center border-bottom p-md-4 p-3" key={incident.id}>
                                    {/* <span className="number  col-1 px-0 align-self-center d-none d-sm-inline-block">{incident.id}</span> */}
                                    <div className="media-body col-sm-6 col-6 col-xxl-5 px-0 me-4">
                                        <h5 className="mt-0 mb-0"><Link to={""} className=" fs-18 font-w400 text-ov">{incident.description ? incident.description : `No incident description specified.`}</Link></h5>
                                        <p to={""} className=" fs-12 font-w200">{incident.detailedDescription}</p>
                                    </div>
                                    <div className="media-footer ms-auto col-2 px-0 d-flex align-self-center align-items-center">
                                        <div className="text-center">
                                            <span className="text-primary d-block fs-20">{incident.score}</span>
                                            <span className="fs-14">Incident Score</span>
                                        </div>
                                    </div>
                                    <div className="me-3">
                                        <p className={`mb-0 ${incident.level === 'low' ? 'text-primary' : incident.level === 'medium' ? 'text-warning' : incident.level === 'high' ? 'text-danger' : 'text-warning' }`}>Level: {incident.level}</p>
                                        <span className="mt-0 font-w200">{incident.date.substring(0, 10)}</span>
                                    </div>
                                    <div className="chart-point mt-4 text-center">
                                        <div className="fs-13 col px-0 text-black">
                                            {incident.level === 'low' ? <span className="b mx-auto"></span> : incident.level === 'medium' ? <span className="c mx-auto"></span> : incident.level === <span className="d mx-auto"></span> ? 'warning' : <span className="b mx-auto"></span> }
                                        </div>
                                    </div>
                                </div>))}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="gallery" id='gallery'>
                                <div className="col-lg-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Pictures</h4>
                                        </div>
                                        
                                        <div className="card-body pb-1">
                                        { gallery.length === 0 ?
                                                <div>
                                                    <h5 className="mt-0 mb-0">No Pictures</h5>
                                                    <p className=" fs-12 font-w200">There are no pictures to display yet.</p>
                                                </div>
                                            :
                                            <LightGallery
                                                speed={500}
                                                plugins={[lgThumbnail, lgZoom]}
                                                elementClassNames="row"
                                            >
                                                {gallery.map((item,index)=>(
                                                    <div data-src={`https://lh3.googleusercontent.com/d/${item}=w2160?authuser=0`} className="col-lg-3 col-md-6 mb-4" key={index}>
                                                        <img src={`https://lh3.googleusercontent.com/d/${item}=w2160?authuser=0`} style={{width:"100%", objectFit: 'cover'}} height={300} alt={mine?.name} className='cursor-pointer rounded'/>
                                                    </div>
                                                ))}
                                            </LightGallery>					
                                        }
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="card-title">Videos</h4>
                                        </div>
                                        
                                        <div className="card-body pb-1">
                                            { videos.length === 0 ?
                                                <div>
                                                    <h5 className="mt-0 mb-0">No Videos</h5>
                                                    <p className=" fs-12 font-w200">There are no videos to display yet.</p>
                                                </div>
                                            :
                                                videos.map((item,index)=>(<div data-src={`https://lh3.googleusercontent.com/d/${item}=w2160?authuser=0`} className="col-lg-3 col-md-6 mb-4" key={index}>
                                                        <iframe className='rounded' title={mine?.name} src={`https://drive.google.com/file/d/${item}/preview`} width="100%" height={300} allow="autoplay"></iframe>
                                                </div>
                                                ))
                                            }
                                                
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane id='map' eventKey={'map'}>
                                <div className="card event-bx" style={{ height: '80vh', width: '100%' }}>
                                    <iframe title={mine?.name} src={`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15949.795161811555!2d${location.split(',')[1]}!3d${location.split(',')[0]}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca50051ea7d29%3A0x6ac04434247b3e81!2s${mine?.name}!5e0!3m2!1sen!2sbw!4v1709046475985!5m2!1sen!2sbw`} width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </Tab.Container>
            </div>
        </>
    );
};


export default Mine;