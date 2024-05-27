import React, { useContext, useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { baseURL_ } from "../../../config";
import axiosInstance from '../../../services/AxiosInstance';
import { toast } from "react-toastify";
import { ThemeContext } from "../../../context/ThemeContext";
import { Logout } from '../../../store/actions/AuthActions';
import { useDispatch } from "react-redux";

const Exports = () => {	
    const navigate = useNavigate()
	const dispatch = useDispatch()
	const { changeTitle } = useContext(ThemeContext);
	const [exports, setexports] = useState([])
	const [filtered, setfiltered] = useState([])
	const apiHeaders = {
        'authorization': `Bearer ${localStorage.getItem('_authTkn')}`,
        'x-refresh': localStorage.getItem(`_authRfrsh`)
    }

	const fetchExports = async()=>{
		try{
			let response = await axiosInstance.get(`${baseURL_}exports`, {
				headers: apiHeaders
			})
			setexports(response.data.exports.reverse())
			setfiltered(response.data.exports.reverse())
		}catch(err){
			try{
				if(err.response.code === 403){
					dispatch(Logout(navigate))
				}else{
					toast.warn(err.response.message)
				}
			}catch(e){
				toast.error(err.message)
			}
		}

	}

	const filter = (e)=>{
		const input = e.currentTarget.value
		setfiltered(exports.filter(exp=>exp.exportationID.toLowerCase().includes(input.toLowerCase()) || exp.company.name.toLowerCase().includes(input.toLowerCase())))
	}

	useEffect(() => {
	  fetchExports()
	  changeTitle(`Exports | Minexx`)
	}, [ ])
	

	return(
		<>
			<div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item active"><Link to={"/overview"}>Dashboard</Link></li>
					<li className="breadcrumb-item"><Link to={""} >Exports</Link></li>
				</ol>
			</div>
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Exports</h4>
							<div>
								<input className="form-control" placeholder="Search for export" onChange={filter}/>
							</div>
						</div>
						<div className="card-body">
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
									<th
									className="sorting_asc"
									tabIndex={0}
									aria-controls="example5"
									rowSpan={1}
									colSpan={1}
									aria-sort="ascending"
									>
									<div className="custom-control custom-checkbox">
										<input
										type="checkbox"
										// onClick={() => chackboxFun("all")}
										className="custom-control-input"
										id="checkAll"
										required
										/>
										<label
										className="custom-control-label"
										htmlFor="checkAll"
										/>
									</div>
									</th>
									<th
									className="sorting"
									tabIndex={0}
									aria-controls="example5"
									rowSpan={1}
									colSpan={1}
									style={{ width: 73 }}
									>
									Company Name
									</th>
									{/*<th
									className="sorting"
									tabIndex={0}
									aria-controls="example5"
									rowSpan={1}
									colSpan={1}
									>
									Shipment Number
									</th>*/}
									<th
									className="sorting"
									tabIndex={0}
									aria-controls="example5"
									rowSpan={1}
									colSpan={1}
									>
									Exportation ID
									</th>
									<th
									className="sorting"
									tabIndex={0}
									aria-controls="example5"
									rowSpan={1}
									colSpan={1}
									>
									Date
									</th>
									<th
									className="sorting"
									tabIndex={0}
									aria-controls="example5"
									rowSpan={1}
									colSpan={1}
									>
									Mineral Type
									</th>
									<th
									className="sorting"
									tabIndex={0}
									aria-controls="example5"
									rowSpan={1}
									colSpan={1}
									>
									Grade
									</th>
									<th
									className="sorting"
									tabIndex={0}
									aria-controls="example5"
									rowSpan={1}
									colSpan={1}
									>
									Net Weight (kg)
									</th>
									<th
									className="sorting"
									tabIndex={0}
									aria-controls="example5"
									rowSpan={1}
									colSpan={1}
									>
									Track
									</th>
								</tr>
								</thead>
								<tbody>
								{ 
									filtered.length === 0 ?
										<tr role="row" className="odd">
											<td colSpan={8} rowSpan={2} className="sorting_1 text-center">No export records to display yet.</td>
										</tr>
									: filtered.map(_export=>{
									return (<tr role="row" key={_export.id} className="odd">
										<td className="sorting_1">
											<div className="custom-control custom-checkbox ">
												<input
												type="checkbox"
												className="custom-control-input"
												id="customCheckBox2"
												required
												/>
												<label
												className="custom-control-label"
												htmlFor="customCheckBox2"
												/>
											</div>
										</td>
										<td><Link to={`/company/${_export?.company?.id}`}>{_export?.company?.name}</Link></td>
										{/*<td><Link className="text-primary" to={`/export/${_export?.id}`}>{_export.shipmentNumber}</Link></td>*/}
										<td><Link className="text-primary" to={`/export/${_export?.id}`}>{_export.exportationID}</Link></td>
										<td>{new Date(_export.date).toString().substring(0, 16)}</td>
										<td>
											<span className="badge light badge-warning">
												<i className="fa fa-circle text-danger me-1" />
												{_export.mineral}
											</span>
										</td>
										<td>{_export.grade}</td>
										<td>{_export.netWeight}</td>
										<td>{ _export.link ? <a target="_blank" href={`${_export.link}`} className="text-primary" rel="noreferrer">Track Shipment</a> : <span className="text-warning">Tracking not available</span>}</td>
									</tr>)
								}) }
								</tbody>
							</table>

							{/* <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
								<div className="dataTables_info">
								Showing {activePag.current * sort + 1} to{" "}
								{data.length > (activePag.current + 1) * sort
									? (activePag.current + 1) * sort
									: data.length}{" "}
								of {data.length} entries
								</div>
								<div
								className="dataTables_paginate paging_simple_numbers"
								id="example5_paginate"
								>
								<Link
									className="paginate_button previous disabled"
									to="/table-datatable-basic"
									onClick={() =>
									activePag.current > 0 && onClick(activePag.current - 1)
									}
								>
									Previous
								</Link>
								<span>
									{paggination.map((number, i) => (
									<Link
										key={i}
										to="/table-datatable-basic"
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
									to="/table-datatable-basic"
									onClick={() =>
									activePag.current + 1 < paggination.length &&
									onClick(activePag.current + 1)
									}
								>
									Next
								</Link>
								</div>
							</div> */}
							</div>
						</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}	
export default Exports; 	