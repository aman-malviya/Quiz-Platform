import React,{useEffect} from 'react';


export default function Toast(props) {

  return (
    <div id="toast" style={props.success?{'borderLeft':'6px solid #4bb543'}:{'borderLeft':'6px solid #F25757'}} class="rounded-3 alert alert-light shadow d-flex align-items-center" role="alert">
        {props.success?<i style={{'color':'#4bb543', 'fontSize':'1.5rem'}} class="far fa-check-circle mx-3"></i>:<i style={{'fontSize':'1.5rem'}} class="far fa-times-circle mx-3 accent"></i>}
        {props.msg}
    </div>
  );
}