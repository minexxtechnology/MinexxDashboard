import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutPage from './Logout';
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { ThemeContext } from '../../../context/ThemeContext';

const Header = ({ onNote, toggle, onProfile, onNotification, onClick }) => {

	const { title } = useContext(ThemeContext);
	const [user, setuser] = useState(JSON.parse(localStorage.getItem(`_authUsr`)))
	const [access, setaccess] = useState(JSON.parse(localStorage.getItem(`_authUsr`)).access || '3ts')
	const [view, setview] = useState(localStorage.getItem(`_dash`))
	const [lang, setlang] = useState(localStorage.getItem(`_lang`) || `en`)

	const navigate = useNavigate()

	const countries = []
	countries[`fr`] = `https://flagdownload.com/wp-content/uploads/Flag_of_France_Flat_Round_Corner-128x128.png`
	countries[`en`] = `https://flagdownload.com/wp-content/uploads/Flag_of_United_States_Flat_Round_Corner-128x128.png`

	const changeLanguge = ()=>{
		lang === `en` ? setlang(`fr`) : setlang(`en`)
		lang === `en` ? localStorage.setItem(`_lang`, `fr`) : localStorage.setItem(`_lang`,`en`)
		navigate(0)
	}

	const changeDashboard = ()=>{
		if(view){
			if(view === 'gold'){
				setview('3ts')
				localStorage.setItem(`_dash`, '3ts')
			}else{
				setview('gold')
				localStorage.setItem(`_dash`, 'gold')
			}
		}else{
			setview('gold')
			localStorage.setItem('_dash', 'gold')
		}
		navigate(0)
	}

	return (
		<div className="header">
			<div className="header-content">
				<nav className="navbar navbar-expand">
					<div className="collapse navbar-collapse justify-content-between">
						<div className="header-left">
							<div
								className="dashboard_bar"
								style={{ textTransform: "capitalize" }}
								>
								{title.replaceAll(` | Minexx`, ``)}
								{/* {finalName.join(" ")} */}
							</div>
							<div id="google_translate_element"></div>
						</div> 	
						<ul className="navbar-nav header-right">
							{/*<li className="nav-item">
								<div className="input-group search-area ms-auto d-inline-flex">
									<input type="text" className="form-control" placeholder="Search here"  />
									<div className="input-group-append">
										<button type="button" className="input-group-text"><i className="flaticon-381-search-2"></i></button>
									</div>
								</div>
							</li>*/}
							<Dropdown as="li" className="nav-item header-profile ">
								{/*<Dropdown.Toggle as="a" to="#" variant="" className="nav-link i-false c-pointer">								
									<img src={countries[lang]} width="20" alt=""/>
									<div className="header-info">
										<span>{ lang === `en` ? `English` : `French` }<i className="fa fa-caret-down ms-3" aria-hidden="true"></i></span>
									</div>
								</Dropdown.Toggle>*/}
								<Dropdown.Menu align="right" className="mt-2">
									<Link to="" onClick={changeLanguge} key={'en'} className="dropdown-item ai-icon">
										{/* <FontAwesomeIcon icon={icon({name: 'arrow-right-arrow-left'})} /> */}
										<span className="ms-2">{ lang === `fr` ? `English` : `French` }</span>
									</Link>
									{/* <Link to="" onClick={changeLanguge} key={'fr'} className="dropdown-item ai-icon">
										<span className="ms-2">French</span>
									</Link> */}
								</Dropdown.Menu>
							</Dropdown>
							<Dropdown as="li" className="nav-item header-profile ">
								<Dropdown.Toggle as="a" to="#" variant="" className="nav-link i-false c-pointer">								
									<img src={user?.photoURL} width="20" alt=""/>
									<div className="header-info">
										<span>{user?.name} {user?.surname}<i className="fa fa-caret-down ms-3" aria-hidden="true"></i></span>
									</div>
									
								</Dropdown.Toggle>
								<Dropdown.Menu align="right" className="mt-2">
									{ access === 'both' ? <Link to="/" onClick={changeDashboard} className="dropdown-item ai-icon">
										<FontAwesomeIcon icon={icon({name: 'arrow-right-arrow-left'})} />
										<span className="ms-2">Switch to {view === 'gold' ? '3Ts' : 'Gold'}</span>
									</Link> : <></> }
									{/*<Link to="/profile" className="dropdown-item ai-icon">
										<svg
										id="icon-user1"
										xmlns="http://www.w3.org/2000/svg"
										className="text-primary"
										width={18}
										height={18}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx={12} cy={7} r={4} />
										</svg>
										<span className="ms-2">My Account </span>
								</Link>*/}
									<LogoutPage />
								</Dropdown.Menu>
							</Dropdown>
						</ul>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Header;
