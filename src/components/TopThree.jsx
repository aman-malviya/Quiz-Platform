import React from 'react'

function TopThree() {
    return (
        <div className="d-flex" style={{'height':'100px', 'width':'150px', 'background':'none', 'alignItems':'flex-end', 'justifyContent':'space-between'}}>
            <div className="rounded-top d-flex align-items-center justify-content-center shadow-sm" style={{'width':'48px', 'height':'50px', 'background':'white'}}><h5 className="text-center">3</h5></div>
            <div className="rounded-top d-flex align-items-center justify-content-center shadow-sm" style={{'width':'48px', 'height':'100px', 'background':'white'}}><h5 className="text-center">1</h5></div>
            <div className="rounded-top d-flex align-items-center justify-content-center shadow-sm" style={{'width':'48px', 'height':'70px', 'background':'white'}}><h5 className="text-center">2</h5></div>
        </div>
    )
}

export default TopThree
