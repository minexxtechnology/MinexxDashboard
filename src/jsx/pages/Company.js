import React,{useState, useEffect, useContext} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Modal, Nav, Tab} from 'react-bootstrap';
import { baseURL_ } from '../../config'
import ComplianceTable from '../components/table/ComplianceTable';
import { toast } from 'react-toastify';
import { ThemeContext } from '../../context/ThemeContext';
import { Logout } from '../../store/actions/AuthActions';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../services/AxiosInstance';
import { translations } from './Companytranslation';


const Company = ({ language }) => {

    const { id } = useParams()
    const navigate = useNavigate()
	const dispatch = useDispatch()
    const { changeTitle } = useContext(ThemeContext)
    const [company, setcompany] = useState()
    const [documents, setdocuments] = useState([])
    const [shareholders, setshareholders] = useState([])
    const [beneficialOwners, setbeneficialOwners] = useState([])
    const [sharehodlerID, setsharehodlerID] = useState()
    const t = (key) => {
        if (!translations[language]) {
          console.warn(`Translation for language "${language}" not found`);
          return key;
        }
        return translations[language][key] || key;
      };
    const getCompany = async()=>{
        axiosInstance.get(`companies/${id}`).then(response=>{
            setcompany(response.data.company)
            changeTitle(response.data.company.name)
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
        axiosInstance.get(`${baseURL_}documents/${id}`).then(response=>{
            setdocuments(response.data.documents)
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
       

        axiosInstance.get(`${baseURL_}shareholders/${id}`).then(response=>{
            setshareholders(response.data.shareholders)
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

        axiosInstance.get(`${baseURL_}owners/${id}`).then(response=>{
            setbeneficialOwners(response.data.beneficial_owners)
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
        getCompany()
    }, [language])

    return (
        <>
            <Modal show={sharehodlerID} onBackDropClick={()=>setsharehodlerID(null)}>
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
                    <li className="breadcrumb-item active"><Link to={"/overview"}>{t('Dashboard')}</Link></li>
                    <li className="breadcrumb-item"><Link to={"/exports"}>{t('Exports')}</Link></li>
                    <li className="breadcrumb-item"><Link to={""}>{company ? company.name : `Company Details`}</Link></li>
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
                                                    {t('BasicInfo')}
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#documents" role="tab" eventKey="documents">
                                                    {t('Documents')} <span className='badge badge-primary'>{documents.length}</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#shareholders" role="tab" eventKey="shareholders">
                                                    {t('Shareholders')}
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#owners" role="tab" eventKey="owners">
                                                    {t('BeneficialOwners')}
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
                                        <h4 className="text-primary mb-2">{t('CompanyName')}</h4>
                                        <Link className="text-black">{company?.name || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">{t('CompanyAddress')}</h4>
                                        <Link className="text-black">{company?.address || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">{t('CompanyCountry')}</h4>
                                        <Link className="text-black">{company?.country || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">{t('CompanyNumber')}</h4>
                                        <Link className="text-black">{company?.number || `--`}</Link>
                                        
                                        <h4 className="text-primary mb-2 mt-4">{t('CompanyType')}</h4>
                                        <Link className="text-black">{company?.type || `--`}</Link>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="documents" id='documents'>
								<ComplianceTable documents={documents} language={language}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="shareholders" id='shareholders'>
                                {
                                    shareholders.length === 0 ? 
                                    <div className='card'>
                                        <div className=' card-body text-center'>
                                            <p>{t('NoShare')}</p>
                                        </div>
                                    </div>
                                    : shareholders?.map((shareholder, i) => (
                                        <div className='col-md-4' key={`sh${i}`}>
                                            <div className='card'>
                                                <div className=' card-body'>
                                                    <h5 className='text-primary'>{shareholder?.name}</h5>
                                                    <span>{t('Nationality')}: {shareholder?.nationality}</span><br/>
                                                    <span>{t('PercentageOwned')}: {shareholder?.percent}%</span><br/>
                                                    <span>{t('Address')}: {shareholder?.address || `--`}</span><br/>
                                                    { shareholder.nationalID ? <Link to="" className='btn btn-sm btn-primary mt-3' onClick={()=>setsharehodlerID(shareholder)}>{t('View')}</Link> : <div></div> }
                                                </div>
                                            </div>
                                    </div>
                                ))}
                            </Tab.Pane>
                            <Tab.Pane eventKey="owners" id='owners'>
                                { beneficialOwners.length === 0 ?
                                    <div className='card'>
                                        <div className=' card-body text-center'>
                                            <p>{t('Nobeneficial')}</p>
                                        </div>
                                    </div>
                                    : beneficialOwners?.map((owner, i) => (
                                    <div className='col-md-4' key={`own${i}`}>
                                        <div className='card'>
                                            <div className=' card-body'>
                                                <h5 className='text-primary'>{owner?.name}</h5>
                                                <span>{t('Nationality')}: {owner?.nationality}</span><br/>
                                                <span>{t('PercentageOwned')}: {owner?.percent}%</span><br/>
                                                <span>{t('Address')}: {owner?.address || '--'} </span><br/>
                                                { owner.nationalID ? <Link to="" className='btn btn-sm btn-primary mt-3' onClick={()=>setsharehodlerID(owner)}>{t('View')}</Link> : <div></div> }
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