import React,{useEffect, useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import {Accordion, ListGroup, Nav} from 'react-bootstrap';
// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import { ThemeContext } from '../../../context/ThemeContext';
import { assessmentHeaders } from '../../../config';

const Assessment = () => {

    const headers = ['General Information', 'Legitimacy', 'Human & Workers Rights', 'Societal Welfare/Security', 'Company Governance', 'Chain of Custody/Traceability/Tracking', 'Environment', 'Community Impact']
    const indexes = ['general', 'legitimacy', 'rights', 'welfare', 'governance', 'traceability', 'environment', 'community']
    const slices = [
        {start: 1, end: assessmentHeaders.indexOf(`LEGITIMACY`)},
        {start: assessmentHeaders.indexOf(`LEGITIMACY`)+1, end: assessmentHeaders.indexOf(`HUMAN AND WORKERS RIGTHS`)},
        {start: assessmentHeaders.indexOf(`HUMAN AND WORKERS RIGTHS`)+1, end: assessmentHeaders.indexOf(`SOCIETAL WELFARE / SECURITY`)},
        {start: assessmentHeaders.indexOf(`SOCIETAL WELFARE / SECURITY`)+1, end: assessmentHeaders.indexOf(`COMPANY GOVERNANCE`)},
        {start: assessmentHeaders.indexOf(`COMPANY GOVERNANCE`)+1, end: assessmentHeaders.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`)},
        {start: assessmentHeaders.indexOf(`CHAIN OF CUSTODY/Traceability/Tracking`)+1, end: assessmentHeaders.indexOf(`ENVIRONMENT`)},
        {start: assessmentHeaders.indexOf(`ENVIRONMENT`)+1, end: assessmentHeaders.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`)},
        {start: assessmentHeaders.indexOf(`COMMUNITY IMPACT (Beyond CSR: Minexx Category)`)+1},

    ]
    const [slice, setslice] = useState(slices[0])
    const [index, setindex] = useState(0)
    const { changeTitle } = useContext(ThemeContext)
    const assessment = JSON.parse(localStorage.getItem(`assessment`))

    useEffect(() => {
        changeTitle('Assessment Details | Minexx')
    }, [])

    return (
        <div>
            <div className="row page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active"><Link to={"/overview"}> Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to={""}>Assessment Details</Link></li>
                </ol>
            </div>
            <div className="row">
                <div className="col-xl-3">
                    <ListGroup className="mb-4" id="list-tab">
                        { headers.map((item, i) =><ListGroup.Item key={i} onClick={()=>{setindex(i); setslice(slices[i]);}} action href={`#${i}`}>
                            {item}
                        </ListGroup.Item>) }
                    </ListGroup>
                </div>

                <div className='col-9'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-12'>
                                    <Accordion className="accordion accordion-primary" defaultActiveKey="0">
                                        { assessmentHeaders.slice(slice.start, slice.end).filter((x,i)=> assessment[indexes[index]][i]).length > 0 ? assessmentHeaders.slice(slice.start, slice.end).map((h, i)=> assessment[indexes[index]][i] ? !h.includes('ID Number') && !h.includes('Mine/Concession Name') ? <Accordion.Item className="accordion-item" key={i} eventKey={i}>
                                        <Accordion.Header className="accordion-header rounded-lg">
                                            {h}
                                        </Accordion.Header>
                                        <Accordion.Collapse eventKey={i}>
                                            <div className="accordion-body">
                                                {h.includes('Proof Details') ||
                                                h.includes('Image')  ||
                                                h.includes('Photo') ||
                                                h.includes('Pictures') ?
                                                <img alt='' src={`https://lh3.googleusercontent.com/d/${assessment[indexes[index]][i]}=w2160?authuser=0`}/>  : <p>{assessment[indexes[index]][i]}</p> }                                                
                                            </div>
                                        </Accordion.Collapse>
                                        </Accordion.Item> : <div></div> : <div></div>) : <p className='font-w200 text-center'>No information recorded</p>
                                        }
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Assessment;