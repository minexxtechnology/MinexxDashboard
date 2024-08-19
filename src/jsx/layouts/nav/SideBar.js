import React, { useContext, useEffect, useReducer, useState } from "react";

import PerfectScrollbar from "react-perfect-scrollbar";
import {Collapse} from 'react-bootstrap';

/// Link
import { Link } from "react-router-dom";

import {RootMenu, RegulatorMenu, BIMenu, IMenu, BMenu} from './Menu';
import {useScrollPosition} from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";


const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active : "",
  activeSubmenu : "",
}


const SideBar = () => {
  var d  = new Date();
	const {
		iconHover,
		sidebarposition,
		headerposition,
		sidebarLayout,
    ChangeIconSidebar,
  
	} = useContext(ThemeContext);
  let menu = []
  const user = JSON.parse(localStorage.getItem(`_authUsr`))
	const access = localStorage.getItem(`_dash`) || '3ts'

  if(user){
    if(user.type === 'minexx'){
      menu = RootMenu
    }else  if(user.type === 'regulator' || user.type === 'government' || user.type === 'supervisor'){
      menu = RegulatorMenu
    }else if(user.type === 'buyer'){
      menu = BMenu
    }else if(user.type === 'investor'){
      menu = IMenu
    }

    // if(dash){
    //   if(dash === 'gold'){
    //     menu = menu.filter(item=>{
    //       return item.title !== "Exports"
    //     })
    //   }
    // }
  }

  const [state, setState] = useReducer(reducer, initialState);	

 //For scroll
 
 
	  let handleheartBlast = document.querySelector('.heart');
	  function heartBlast(){
		return handleheartBlast.classList.toggle("heart-blast");
	  }
  
 	const [hideOnScroll, setHideOnScroll] = useState(true)
	useScrollPosition(
		({ prevPos, currPos }) => {
		  const isShow = currPos.y > prevPos.y
		  if (isShow !== hideOnScroll) setHideOnScroll(isShow)
		},
		[hideOnScroll]
	)

 
	const handleMenuActive = status => {		
		setState({active : status});			
		if(state.active === status){				
			setState({active : ""});
		}   
	}
	const handleSubmenuActive = (status) => {		
		setState({activeSubmenu : status})
		if(state.activeSubmenu === status){
			setState({activeSubmenu : ""})			
		}    
	}
	// Menu dropdown list End

  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  	
  return (
    <div 
      onMouseEnter={()=>ChangeIconSidebar(true)}
      onMouseLeave={()=>ChangeIconSidebar(false)}
      className={`deznav  border-right ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? hideOnScroll > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="deznav-scroll">         
          <ul className="metismenu" id="menu">
              { menu.filter(item=>user.type === "minexx" || user.type === "regulator" ? item : item.to !== "reports").map((data, index)=>{
                let menuClass = data.classChange;
                  if(menuClass === "menu-title"){
                    return(
                        <li className={menuClass}  key={index} >{data.title}</li>
                    )
                  }else{
                    return(				
                      <li className={` ${ path === data.to || window.location.pathname.includes(data.to) || state.active === data.title ? 'mm-active' : ''}`}
                        key={index} 
                      >
                        
                        {data.content ?
                            <Link to={"#"} 
                              className={`has-arrow`}
                              onClick={() => {handleMenuActive(data.title)}}
                            >								
								                {data.iconStyle}
                                {" "}<span className="nav-text">{data.title}
                                  {data.update && data.update.length > 0 ?
                                    <span className="badge badge-xs badge-danger ms-2">{data.update}</span>
                                    :
                                    ''
                                  }
                                </span>
                            </Link>
                        :
                          <Link className={data.to === path || window.location.pathname.includes(data.to) ? 'mm-active' : ''} to={data.to} >
                              {data.iconStyle}
                              {" "}<span className="nav-text">{data.title}
                                  {data.update && data.update.length > 0 ?
                                    <span className="badge badge-xs badge-danger ms-2">{data.update}</span>
                                    :
                                    ''
                                  }
                              </span>
                          </Link>
                        }
                        {data.content ? <Collapse in={state.active === data.title ? true :false}>
                          <ul className={`${menuClass === "mm-collapse" && data.content ? "mm-show" : ""}`}>
                            {data.content && data.content.filter(c=>access === `gold` ? !["reports/daily", "reports/mtd", "reports/deliveries"].includes(c.to) : c!== null).map((data,index) => {									
                              return(	
                                  <li key={index}
                                    className={`${ path === data.to || window.location.pathname.includes(data.to) ? "mm-active" : ""}`}                                    
                                  >
                                    {data.content ?
                                        <>
                                          <Link to={data.to} className={data.content ? 'has-arrow' : ''}
                                            onClick={() => { handleSubmenuActive(data.title)}}
                                          >
                                            {data.title}
                                          </Link>
                                          <Collapse in={state.activeSubmenu === data.title ? true :false}>
                                              <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                                {data.content && data.content.filter(c=>c.to!== "/reports/daily").map((data,index) => {
                                                  return(	
                                                    <>
                                                      <li className={`${path === data.to || window.location.pathname.includes(data.to) ? "mm-active" : ""}`} key={index}>
                                                        <Link className={`${path === data.to || window.location.pathname.includes(data.to) ? "mm-active" : ""}`} to={data.to}>{data.title}123</Link>
                                                      </li>
                                                    </>
                                                  )
                                                })}
                                              </ul>
                                          </Collapse>
                                        </>
                                      :
                                      <Link className={`${path === data.to || window.location.pathname.includes(data.to) ? "mm-active" : ""}`} to={data.to}>
                                        {data.title}
                                      </Link>
                                    }
                                    
                                  </li>
                                
                              )
                            })}
                          </ul>
                        </Collapse> : null }
                      </li>	
                    )
                }
              })}          
          </ul>	
          { user.type === 'minexx' ? 
          <div className="plus-box">
            <p className="fs-15 font-w500 mb-1">Get System Report Now</p>
            <Link to={"summary-report"} className="text-white fs-26"><i className="las la-long-arrow-alt-right"></i></Link>
          </div> : <></> }
          <div className="copyright mt-4">
            <p className="fs-13 font-w200"><strong className="font-w400">Minexx</strong> &copy; {d.getFullYear()} All Rights Reserved</p>
            <p>Developed with <i className="fa fa-heart text-danger"></i> by Minexx</p>
          </div> 
        </PerfectScrollbar>
      </div>
    );
};

export default SideBar;