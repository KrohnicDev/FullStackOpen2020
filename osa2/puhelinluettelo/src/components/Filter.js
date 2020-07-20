import React from 'react'

const Filter = (props) => {
    const { filterText, handleFilterTextChange } = props
    return <div>filter:
        <input value={filterText} onChange={handleFilterTextChange} />
    </div>
}

export default Filter