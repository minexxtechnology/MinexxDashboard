import React,{useState, useEffect, useRef} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Dropdown, Tab, Nav, Modal, Button} from 'react-bootstrap';
import axiosInstance from '../../../services/AxiosInstance';
import { toast } from 'react-toastify';

const Users = () => {
    const [data, setData] = useState(
		document.querySelectorAll("#ticket_wrapper tbody tr")
	);
	const sort = 10;
    const { platform } = useParams()
	const activePag = useRef(0);
    const [tab, settab] = useState(0)
    const [user, setuser] = useState(JSON.parse(localStorage.getItem(`_authUsr`)))
    const [users, setusers] = useState([])
    const [filtered, setfiltered] = useState([])
    const [add, setadd] = useState()
    const [name, setname] = useState('')
    const [surname, setsurname] = useState('')
    const [email, setemail] = useState('')

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

    const getUsers = ()=>{
        axiosInstance.get(`/users`).then(response=>{
            setusers(response.data.users)
            setfiltered(response.data.users)
            // toast.info(`Users fetched successfully!`, {
            //     style: {
            //         fontFamily: 'Poppins',
            //         fontSize: 12
            //     }
            // })
        }).catch(err=>{
            toast.error(err.message, {
                style: {
                    fontFamily: 'Poppins',
                    fontSize: 12
                }
            })
        })
    }

   // use effect
   useEffect(() => {
        // if(platform === 'dashboard'){
            getUsers()
        // }else if(platform === 'app'){
        //     setusers([])
        //     setfiltered([])
        // }else{
        //     setusers([])
        //     setfiltered([])
        // }
        setData(document.querySelectorAll("#ticket_wrapper tbody tr"));
        //chackboxFun();
	}, [ platform ]);

  
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

        setfiltered(users.filter(user=>{
            return user.name.toLowerCase().includes(input.toLowerCase()) || user.email.toLowerCase().includes(input.toLowerCase())
        }))
    }

    const createUser = ()=>{

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
                    <li className="breadcrumb-item active"><Link to={"#"}> Users</Link></li>
                    <li className="breadcrumb-item"><Link to={"#"}> Users List</Link></li>
                </ol>
            </div>
            <Modal show={add} className="modal fade" id="details" onHide={() => setadd(false)}>
				<div className="modal-content">
					<div className="modal-header">
						<h3 className="modal-title">Create New User Account</h3>
						<Button variant="" type="button" className="close" data-dismiss="modal" onClick={() => setadd(false)} >
							<span>×</span>
						</Button>
						
					</div>
					<div className="modal-body">
                        <form onSubmit={createUser}>
                            <div className="form-group">
                                <label className="mb-2 ">
                                    <strong>First Name</strong>
                                </label>
                                <input type="text" className="form-control"
                                    value={name}
                                    placeholder='Name'
                                    onChange={(e) => setname(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="mb-2 ">
                                    <strong>Last Name</strong>
                                </label>
                                <input type="text" className="form-control"
                                    value={surname}
                                    placeholder='Surname'
                                    onChange={(e) => setsurname(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="mb-2 ">
                                    <strong>Email</strong>
                                </label>
                                <input type="email" className="form-control"
                                    value={email}
                                    placeholder='Email Address'
                                    onChange={(e) => setemail(e.target.value)}
                                />
                            </div>
                            <div className='text-center'>
                                <small>An auto-generated password will be sent to the user's email shortly. Please ensure a smooth onboarding experience by monitoring the process. Contact support if you have any questions or concerns.</small>
                            </div>
                        </form>
					</div>
                    <div className='modal-footer'>
                        <button type='cancel' className='btn btn-outline-danger' data-dismiss="modal" onClick={() => setadd(false)}>Dismiss</button>
                        <button type='submit' className='btn btn-primary'>Create</button>
                    </div>
				</div>
			</Modal>
            <div className="row">
                <div className="col-lg-12">
                <Tab.Container defaultActiveKey='Dashboard Users'>					
                    <Nav as='ul' className="nav nav-tabs">
                        <Nav.Item as='li' className="nav-item">
                            <Nav.Link to="#dashboard" eventKey='Dashboard Users'>Dashboard Users</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as='li'i className="nav-item">
                            <Nav.Link to="#app"  eventKey='App Users'>App Users</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane id="dashboard"  eventKey='Dashboard Users'>
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Users List</h4>
                                    <Link onClick={()=>setadd(true)} className="btn btn-primary">Add User</Link>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive ticket-table">
                                        <div id="ticket_wrapper" className="dataTables_wrapper no-footer">
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
                                                    <input type="search" placeholder="" onInput={filter} className="form-control" />
                                                </div>
                                            </div>
                                            <table id="example" className="display dataTablesCard table-responsive-xl dataTable no-footer w-100">
                                                <thead>
                                                    <tr>
                                                        <th className="sorting_asc">
                                                            <div className="form-check custom-checkbox ms-2">
                                                                <input type="checkbox" className="form-check-input" id="checkAll" required="" onClick={() => chackboxFun("all")}/>
                                                                <label className="form-check-label" htmlFor="checkAll"></label>
                                                            </div>
                                                        </th>	                                            
                                                        <th>Name</th>
                                                        <th>Phone</th>
                                                        <th>User Type</th>
                                                        <th>Creation Date</th>
                                                        <th>Last Login</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>                                          
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filtered.map((item, index)=>(
                                                        <tr key={index}>
                                                            <td className='sorting_1'>
                                                                <div className="form-check custom-checkbox ms-2">
                                                                    <input type="checkbox" className="form-check-input" id={`customCheck${index + 1}`} required="" />
                                                                    <label className="form-check-label" htmlFor={`customCheck${index + 1}`}></label>
                                                                </div>
                                                            </td>
                                                            
                                                            <td>						
                                                                <div>
                                                                    <Link to={"#"} className="h5">{item.name}</Link>
                                                                </div>
                                                                <small className="fs-12 text-muted"> <span className="font-weight-normal1">{item.email}</span></small>
                                                                
                                                            </td>
                                                            <td>{item.phone ? item.phone : `Not Provided`}</td>
                                                            <td>{item.type}</td>
                                                            <td>
                                                                <span className="badge light badge-success">{new Date(item.created).toLocaleString()}</span>
                                                            </td>
                                                            <td>
                                                                <span className="badge light  badge-warning">{new Date(item.lastLogin).toLocaleString()}</span>
                                                            </td>
                                                            <td>
                                                                { item.status === 'active' ? 
                                                                <span className="badge badge-success">Active</span>
                                                                : 
                                                                    <span className="badge badge-danger">Suspended</span>
                                                                }


                                                            </td>
                                                            <td>
                                                                <div className="d-flex">
                                                                    <Link to={"#"} className="btn btn-primary shadow btn-xs sharp me-1"><i className="fas fa-pencil-alt"></i></Link>
                                                                    { item.uid  !== user.uid ? <Link to={"#"} className="btn btn-danger shadow btn-xs sharp"><i className="fa fa-trash"></i></Link> : null }
                                                                </div>
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
                                                        to="/users"
                                                        onClick={() =>
                                                            activePag.current > 0 &&
                                                            onClick(activePag.current - 1)
                                                        }
                                                    >
                                                        {/* <i className="fa-solid fa-angle-left"></i> */}
                                                        Previous
                                                    </Link>
                                                    <span>
                                                        {paggination.map((number, i) => (
                                                            <Link
                                                                key={i}
                                                                to="/users"
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
                                                        to="/users"
                                                        onClick={() =>
                                                            activePag.current + 1 < paggination.length &&
                                                            onClick(activePag.current + 1)
                                                        }
                                                    >
                                                        {/* <i className="fa-solid fa-angle-right"></i> */}
                                                        Next
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane id='app' eventKey={"App Users"}>
                        </Tab.Pane>
                    </Tab.Content>
                    </Tab.Container>
                </div>
            </div>
        </>
    );
};


export default Users;