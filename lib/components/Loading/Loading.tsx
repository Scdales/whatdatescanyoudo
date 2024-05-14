import LinearProgress from '@mui/material/LinearProgress'

const Loading = () => {
  return (
    <div style={{ width: '100%', height: '2px', overflow: 'hidden' }}>
      <LinearProgress color="inherit" />
    </div>
  )
}

export default Loading
