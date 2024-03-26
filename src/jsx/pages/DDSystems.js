import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { ThemeContext } from "../../context/ThemeContext"
import { ListGroup } from "react-bootstrap"

const DDSystems = () => {

	const { changeTitle } = useContext(ThemeContext)
	const knowledgeBase = [
		{
			title: 'KYC Form',
			to: 'kyc',
		},
		{
			title: 'Platform Grievance Mechanisms',
			to: 'grievance',
		},
		{
			title: 'Traceability Guide for 3TG Operators',
			to: 'traceability-guide',
		},
		// {
		// 	title: 'Risk Management Plan',
		// 	to: 'risk-management',
		// },
		// {
		// 	title: 'Shipment Conformance Notice',
		// 	to: 'shipment-conformance',
		// },
		{
			title: 'Supplier Code of Conduct',
			to: 'code-of-conduct',
		},
		// {
		// 	title: 'Operator Onboarding',
		// 	to: 'operator-onboarding',
		// },
		// {
		// 	title: 'Know Your Counterpart Form',
		// 	to: 'asm',
		// },
		// {
		// 	title: 'Trace Due Diligence Programme Introduction',
		// 	to: 'trace-due-diligence',
		// },
		{
			title: 'Rwanda - Internal Supplement',
			to: 'internal-supplement-rw',
		}
	]
	const [content, setcontent] = useState(`kyc`)
	const systems = {
		kyc: {
			title: 'KYC Form',
			url: '/assets/dd-systems/2023.02.21. Minexx KYC Form.pdf',
		},
		grievance: {
			title: 'Platform Grievance Mechanisms',
			url: '/assets/dd-systems/2023.02.21. Minexx Platform Grievance Mechanism.pdf',
		},
		'traceability-guide': {
			title: 'Traceability Guide for 3TG Operators',
			url: '/assets/dd-systems/2023.02.21. Minexx Traceability Guide For 3TG.pdf',
		},
		'risk-management': {
			title: 'Risk Management Plan',
			url: '/assets/dd-systems/2023.02.21. Risk Management Plan.pdf',
		},
		'shipment-conformance': {
			title: 'Shipment Conformance Notice',
			url: '/assets/dd-systems/2023.02.21. Shipment Conformance Notice.pdf',
		},
		'code-of-conduct': {
			title: 'Supplier Code of Conduct',
			url: '/assets/dd-systems/2023.02.21. Supplier Code of Conduct.pdf',
		},
		'operator-onboarding': {
			title: 'Operator Onboarding',
			url: '/assets/dd-systems/Flyer_Operator Onboarding to Minexx Platform.pdf',
		},
		asm: {
			title: 'Know Your Counterpart Form',
			url: '/assets/dd-systems/Minexx Model_Know Your Counterpart_KYC Form_ASM.pdf',
		},
		'trace-due-diligence': {
			title: 'Trace Due Diligence Programme Introduction',
			url: '/assets/dd-systems/Minexx Trace Due Diligence Programme Introduction.pdf',
		},
		'internal-supplement-rw': {
			title: 'Rwanda - Internal Supplement',
			url: '/assets/dd-systems/Rwanda-Internal-Supplement2.pdf',
		},
	}

	useEffect(() => {
	  changeTitle(`${systems[content]?.title} | Minexx`)
	}, [ content ])
	

	return(
		<>
			<div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item active"><Link to={"/"}>Dashboard</Link></li>
					<li className="breadcrumb-item active"><Link to={"#"}>Knowledge Base</Link></li>
					<li className="breadcrumb-item"><Link to={"#"} >{systems[content]?.title}</Link></li>
				</ol>
			</div>
			{/* <div className="row">
				<Tab.Container defaultActiveKey="kyc">
                    <div className='colxl-12'>
                        <div className="card">
                            <div className="card-body px-4 py-3 py-md-2">
                                <div className="row align-items-center">
                                    <div className="col-sm-12 col-md-12">
                                        <Nav as="ul" className="nav nav-pills review-tab" role="tablist">
                                            { knowledgeBase.map( item => <Nav.Item as="li" className="nav-item">
                                                <Nav.Link className="nav-link  px-2 px-lg-3" to={`#${item.to}`} onClick={()=>setcontent(item.to)} role="tab" eventKey={item.to}>
                                                    {item.title}
                                                </Nav.Link>
                                            </Nav.Item> )}
                                        </Nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
				</Tab.Container>
			</div> */}
			<div className="row">
				<div className="col-xl-3">
				<ListGroup className="mb-4" id="list-tab">
					{ knowledgeBase.map( (item, i) =><ListGroup.Item key={i} onClick={()=>setcontent(item.to)} action href={`#${item.to}`}>
						{item.title}
					</ListGroup.Item>)}
				</ListGroup>
				</div>
				<div className="col-xl-9">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">{systems[content]?.title}</h4>
							<a target="_blank" rel="noreferrer" className="btn btn-sm btn-primary justify-right" href={systems[content]?.url}>Download</a>
						</div>
						<div className="card-body">
							<Viewer style={{ minHeight: '500px' }} theme={{ theme: 'dark'}} fileUrl={systems[content]?.url} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}	
export default DDSystems; 	