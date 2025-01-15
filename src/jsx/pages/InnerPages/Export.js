import React,{useState, useEffect, useContext} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Accordion, ListGroup, Nav, Tab} from 'react-bootstrap';
import {baseURL_ } from '../../../config'
import { toast } from 'react-toastify';
import { ThemeContext } from '../../../context/ThemeContext';
import { Logout } from '../../../store/actions/AuthActions';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../services/AxiosInstance';
import { translations } from '../Events/Exporttranslation';

const Export = ({country,language}) => { 

    const { id } = useParams()
    const navigate = useNavigate()
	const dispatch = useDispatch()
    const { changeTitle } = useContext(ThemeContext)
    const access = localStorage.getItem(`_dash`) || '3ts'
    const [ export_ , setexport_] = useState()
    const [document, setdocument] = useState(0)
    const [uploads, setuploads] = useState(access === "3ts" ?[
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ] : [
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ])
	const user = JSON.parse(localStorage.getItem(`_authUsr`))
    const t = (key) => {
        if (!translations[language]) {
          console.warn(`Translation for language "${language}" not found`);
          return key;
        }
        return translations[language][key] || key;
      };

    const documents = access === "3ts" ? [
        t("ProvisionalInvoice"),
        t("FreightForwarderCargoReceipt"),
        t("ExporterSheet"),
        t("AlexStewartCertificateOfAssay"),
        t("AlexStewartPackingReport"),
        t("CertificateOfOrigin"),
        t("ICGLRCertificate"),
        t("InlandTransportation"),
        t("OriginalWarehouseCertificate"),
        t("CertificateOfInsurance"),
        t("BillOfLading"),
        t("C2Form"),
        t("MineSheets"),
        t("ProcessingSheets"),
        t("RRACustomsDeclaration"),
        t("TagList"),
        t("OtherScannedExporterDocuments"),
        t("OtherExporterDocuments"),
        t("OtherTransporterDocument"),
    ] : [
        t("ExporterInvoice"),
        t("PackingList"),
        t("NonNarcoticsNote"),
        t("EssayReport"),
        t("ProofOfPayment"),
        t("CopyOfCustomsDeclaration"),
        t("ExportApproval")
    ];
   
    let eid = null
    const getExport = async()=>{
        if(eid == null){
            toast.info("Getting Export details...")
        }
        eid = id
        axiosInstance.get(`exports/${id}`).then(response=>{
            setexport_(response.data.export)
            setuploads(access === "3ts" ? [
                response.data.export.provisionalInvoice,
                response.data.export.cargoReceipt,
                response.data.export.itsciForms,
                response.data.export.asiDocument,
                response.data.export.packingReport,
                response.data.export.rraExportDocument,
                response.data.export.rmbExportDocument,
                response.data.export.otherDocument,
                response.data.export.warehouseCert,
                response.data.export.insuranceCert,
                response.data.export.billOfLanding,
                response.data.export.c2,
                response.data.export.mineSheets,
                response.data.export.processingSheets,
                response.data.export.customsDeclaration,
                response.data.export.tagList,
                response.data.export.scannedExportDocuments,
                response.data.export.exporterApplicationDocument,
                response.data.export.transporterDocument
            ] : [
                response.data.export.provisionalInvoice,
                response.data.export.packingReport,
                response.data.export.note,
                response.data.export.scannedExportDocuments,
                response.data.export.otherDocument,
                response.data.export.customsDeclaration,
                response.data.export.exporterApplicationDocument,
            ])
            changeTitle(`Shipment: ${response.data.export?.exportationID || "--"}`)
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
        getExport()
    }, [id,country,language])

    return (
        <div>
            <div className="row page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active"><Link to={"#"}> {t('Dashboard')}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/exports`}> {t('Exports')}</Link></li>
                    <li className="breadcrumb-item"><Link to={""}> Shipment: {export_?.shipmentNumber || 'Export ID MISSING'}</Link></li>
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
                                                {t('ShipmentDetails')}
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link px-2 px-lg-3" to="#documents" role="tab" eventKey="documents">
                                                    {t("Documents")}
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
                                        <Accordion className="accordion accordion-primary" defaultActiveKey="exportation">
                                            <Accordion.Item className="accordion-item" key="exportation" eventKey="exportation">
                                                <Accordion.Header className="accordion-header rounded-lg">
                                                {t("ExportationDetails")}
                                                </Accordion.Header>
                                                <Accordion.Collapse eventKey={`exportation`}>
                                                    <div className="accordion-body">
                                                        <div className='row'>
                                                            <div className='col-lg-6'>
                                                                <img src={export_?.picture ? `https://lh3.googleusercontent.com/d/${export_?.picture}=w2160?authuser=0` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx4xrkRCeiKCPwkflbkXd11W_2fzx34RemdWXmv8TXYWLT2SGtLfkqFCyBb_CBoNcNVBc&usqp=CAU'} alt='' width={'100%'} height={600} style={{ objectFit: 'cover' }} className='rounded'/>
                                                            </div>
                                                            <div className='col-lg-6'>
                                                                { export_?.exportationID ?
                                                                    <>
                                                                        <h4 className="text-primary mb-2 mt-4">{t("ExportationID")}</h4>
                                                                        <Link className="text-black">{export_?.exportationID || `--`}</Link>
                                                                    </>
                                                                : <></> }

                                                                { export_?.date ?
                                                                    <>
                                                                        <h4 className="text-primary mb-2 mt-4">{t("ExportationDate")}</h4>
                                                                        <Link className="text-black">{export_?.date || `--`}</Link>
                                                                    </>
                                                                : <></> }
                                                            
                                                                { export_?.mineral ?
                                                                    <>
                                                                        <h4 className="text-primary mb-2 mt-4">{t("MineralType")}</h4>
                                                                        <Link className="text-black">{export_?.mineral || `--`}</Link>
                                                                    </>
                                                                : <></> }
                                                                
                                                                { export_?.grade ?
                                                                    <>
                                                                        <h4 className="text-primary mb-2 mt-4">{t("Grade")}</h4>
                                                                        <Link className="text-black">{export_?.grade || `--`}</Link>
                                                                    </>
                                                                : <></> }
                                                                
                                                                { export_?.netWeight ?
                                                                    <>
                                                                        <h4 className="text-primary mb-2 mt-4">{t("NetWeight")}</h4>
                                                                        <Link className="text-black">{access === '3ts' ? export_?.netWeight : (export_?.netWeight/1000).toFixed(2) || `--`} kg</Link>
                                                                    </>
                                                                : <></> }
                                                                
                                                                { export_?.grossWeight ?
                                                                    <>
                                                                        <h4 className="text-primary mb-2 mt-4">{t("GrossWeight")}</h4>
                                                                        <Link className="text-black">{export_?.grossWeight || `--`} kg</Link>
                                                                    </>
                                                                : <></> }
                                                                
                                                                { export_?.tags ?
                                                                    <>
                                                                        <h4 className="text-primary mb-2 mt-4">{t("NumberOfTags")}</h4>
                                                                        <Link className="text-black">{export_?.tags || 0}</Link>
                                                                    </>
                                                                : <></> }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion.Item>
                                            { export_?.link ? <Accordion.Item className="accordion-item" key="transport" eventKey="shipment">
                                                <Accordion.Header className="accordion-header rounded-lg">
                                                {t("ShipmentTracking")}
                                                </Accordion.Header>
                                                <Accordion.Collapse eventKey={`shipment`}>
                                                    <div className="accordion-body"><a target="_blank" href={`${export_?.link}`} className='text-primary' rel="noreferrer">Click here to Track the Shipment</a></div>
                                                </Accordion.Collapse>
                                            </Accordion.Item> : null }
                                            
                                            <Accordion.Item className="accordion-item" key="transport" eventKey="transport">
                                                <Accordion.Header className="accordion-header rounded-lg">
                                                {t("TransportDetails")}
                                                </Accordion.Header>
                                                <Accordion.Collapse eventKey={`transport`}>
                                                    <div className="accordion-body">
                                                        { export_?.destination ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">{t("Destination")}</h4>
                                                                <Link className="text-black">{export_?.destination || `--`}</Link>
                                                            </>
                                                        : <></> }
                                                    
                                                        { export_?.itinerary ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">{t("Itinerary")}</h4>
                                                                <Link className="text-black">{export_?.itinerary || `--`}</Link>
                                                            </>
                                                        : <></> }
                                                        
                                                        { export_?.shipmentNumber ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">{t("ShipmentNumber")}</h4>
                                                                <Link className="text-black">{export_?.shipmentNumber || `--`}</Link>
                                                            </>
                                                        : <></> }
                                                        
                                                        { export_?.exportCert ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">Export Certificate Number</h4>
                                                                <Link className="text-black">{export_?.exportCert || `--`}</Link>
                                                            </>
                                                        : <></> }
                                                                
                                                        { export_?.rraCert ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">RRA certificate Number</h4>
                                                                <Link className="text-black">{export_?.rraCert || `N/A`}</Link>
                                                            </>
                                                        : <></> }
                                                        
                                                        { export_?.transporter ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">{t("Transporter")}</h4>
                                                                <Link className="text-black">{export_?.transporter || `--`}</Link>
                                                            </>
                                                        : <></> }
                                                        
                                                        { export_?.driverID ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">Driver ID Number</h4>
                                                                <Link className="text-black">{export_?.driverID || `Missing`}</Link>
                                                            </>
                                                        : <></> }
                                                        
                                                        { export_?.truckFrontPlate ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">{t("TruckFrontPlate")}</h4>
                                                                <Link className="text-black">{export_?.truckFrontPlate || `--`}</Link>
                                                            </>
                                                        : <></> }
                                                        
                                                        { export_?.truckBackPlate ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">{t("TruckBackPlate")}</h4>
                                                                <Link className="text-black">{export_?.truckBackPlate || `--`}</Link>
                                                            </>
                                                        : <></> }
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion.Item>
                                            <Accordion.Item className="accordion-item" key="representatives" eventKey="representatives">
                                                <Accordion.Header className="accordion-header rounded-lg">
                                                {t("RepresentativesDetails")}
                                                </Accordion.Header>
                                                <Accordion.Collapse eventKey={`representatives`}>
                                                    <div className="accordion-body">
                                                        { export_?.rmbRep ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">{t("RMBRepresentative")}</h4>
                                                                <Link className="text-black">{export_?.rmbRep || `--`}</Link>
                                                            </>
                                                        : <></> }

                                                        { export_?.exportRep ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">{t("ExporterRepresentative")}</h4>
                                                                <Link className="text-black">{export_?.exportRep || `--`}</Link>
                                                            </>
                                                        : <></> }

                                                        { export_?.traceabilityAgent ?
                                                            <>
                                                                <h4 className="text-primary mb-2 mt-4">{t("TraceabilityAgent")}</h4>
                                                                <Link className="text-black">{export_?.traceabilityAgent || `--`}</Link>
                                                            </>
                                                        : <></> }
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion.Item>
                                        </Accordion>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="documents" id='documents'>
                                <div className="row">
                                    <div className="col-xl-3">
                                    <ListGroup className="mb-4" id="list-tab">
                                    {documents.map((item, i) => (
                                        <ListGroup.Item key={i} onClick={() => { setdocument(i); }} action href={`#${i}`}>
                                            {item}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                    </div>
                                    <div className="col-xl-9">
                                        <div className="card">
                                            <div className="card-header">
                                                <h4 className="card-title">{documents[document]}</h4>
                                                { uploads[document] ?<a target='_blank' className='btn btn-primary' href={`https://drive.usercontent.google.com/download?id=${uploads[document]}&export=download&authuser=0`} rel="noreferrer">Download</a>
                                                : <></> }
                                            </div>
                                            <div className="card-body">
                                            {
                                                uploads[document] ?
                                                    <iframe title={`${documents[document]}`} src={`https://drive.google.com/file/d/${uploads[document]}/preview`} width="100%" height="700" allow="autoplay"></iframe>
                                                : <p>{t("NoDocumentToDisplay")}</p>
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="track" id='track'>
                                <div className="card">
                                    <iframe title={export_?.trackingID} src={export_?.link} width="100%" height="700" allow="autoplay"></iframe>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </Tab.Container>
            </div>
        </div>
    );
};


export default Export;
