import React from 'react'

function ButtonLoader(props) {
    return (
        <div class={"spinner-border spinner-border-sm text-light"} role="status">
            <span class="sr-only">Loading...</span>
        </div>
    )
}

export default ButtonLoader
