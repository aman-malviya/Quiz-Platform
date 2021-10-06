import React from 'react'

function TopThree(props) {
    return (
        <div className="d-flex" style={{'height':'100px', 'width':'150px', 'background':'none', 'alignItems':'flex-end', 'justifyContent':'space-between'}}>
            <div style={{'display':'flex', 'flexDirection':'column', 'justifyContent':'flex-end','alignItems':'center'}}>
                <img alt="Winner" data-bs-toggle="tooltip" data-bs-placement="top" title={props.third} style={{'objectFit':'cover','border':'2px solid #fff', 'filter':'saturate(0.5)'}} src={props.thirdURL?props.thirdURL:"man.png"} height="40px" width="40px" className="rounded-circle mb-1" />
                <div className="rounded-top d-flex align-items-center justify-content-center shadow-sm" style={{'width':'48px', 'height':'50px', 'background':'white'}}><h5 className="text-center">3</h5></div>
            </div>
            <div style={{'display':'flex', 'flexDirection':'column', 'justifyContent':'flex-end','alignItems':'center'}}>
                <img alt="Winner" data-bs-toggle="tooltip" data-bs-placement="top" title={props.first} style={{'objectFit':'cover','border':'2px solid #fff', 'filter':'saturate(0.5)'}} src={props.firstURL?props.firstURL:"man.png"} height="40px" width="40px" className="rounded-circle mb-1" />
                <div className="rounded-top d-flex align-items-center justify-content-center shadow-sm" style={{'width':'48px', 'height':'100px', 'background':'white'}}><h5 className="text-center">1</h5></div>
            </div>
            <div style={{'display':'flex', 'flexDirection':'column', 'justifyContent':'flex-end','alignItems':'center'}}>
                <img alt="Winner" data-bs-toggle="tooltip" data-bs-placement="top" title={props.second} style={{'objectFit':'cover','border':'2px solid #fff', 'filter':'saturate(0.5)'}} src={props.secondURL?props.secondURL:"man.png"} height="40px" width="40px" className="rounded-circle mb-1" />
                <div className="rounded-top d-flex align-items-center justify-content-center shadow-sm" style={{'width':'48px', 'height':'70px', 'background':'white'}}><h5 className="text-center">2</h5></div>
            </div>
        </div>
    )
}

export default TopThree
