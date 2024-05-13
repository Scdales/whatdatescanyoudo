'use client'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useState } from 'react'

const CopyIcon = ({ onClick }: { onClick: () => void }) => {
  const [hover, setHover] = useState({})
  return (
    <div
      onMouseEnter={() => setHover({ backgroundColor: '#d4d4d4' })}
      onMouseLeave={() => setHover({})}
      onClick={onClick}
      style={{
        marginLeft: '20px',
        padding: '3px',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '5px',
        cursor: 'pointer',
        ...hover
      }}
    >
      <ContentCopyIcon />
    </div>
  )
}

export default CopyIcon
