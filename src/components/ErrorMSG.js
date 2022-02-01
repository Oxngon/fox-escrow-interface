import React from 'react'

export default function ErrorMSG(props) {
    return (
        <div style={{color: 'red',fontSize:'small'}}>
            {props.msg}
        </div>
    )
}
