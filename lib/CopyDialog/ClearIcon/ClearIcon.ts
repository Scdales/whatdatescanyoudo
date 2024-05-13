'use client'
import { default as ClearIconMui } from '@mui/icons-material/Clear'
import { useState } from 'react'

const ClearIcon = ({ onClick }) => {
  const [hover, setHover] = useState({})
  return (
    <div
      onMouseEnter={() => setHover({ backgroundColor: '#d4d4d4' })}
      onMouseLeave={() => setHover({})}
      onClick={onClick}
      style={{
        marginLeft: 'auto',
        padding: '3px',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '5px',
        cursor: 'pointer',
        ...hover
      }}
    >
      <ClearIconMui />
    </div>
  )
}

export default ClearIcon
