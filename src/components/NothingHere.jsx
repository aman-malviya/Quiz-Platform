import React from 'react'

function NothingHere() {
    return (
        <div style={{'flexDirection':'column'}} className="w-100 d-flex align-items-center py-5">
            <img style={{'filter':'saturate(0)', 'opacity':'0.5'}} src="vector.png" height="100px" alt="Nothing to see here" />
            <br />
            <h5 className="text-muted">Nothing to see here</h5>
        </div>
    )
}

export default NothingHere
