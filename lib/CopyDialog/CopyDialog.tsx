'use client'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import CopyIcon from './CopyIcon/CopyIcon'
import { useSnackbar } from 'notistack'
import ClearIcon from './ClearIcon/ClearIcon'

const CopyDialog = ({ open, text = '', onClose }: { open: boolean; text: string; onClose: () => void }) => {
  const { enqueueSnackbar } = useSnackbar()
  const onClick = async () => {
    await navigator.clipboard.writeText(text)
    enqueueSnackbar('Copied Link')
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
          <div>Calendar Link</div>
          <CopyIcon onClick={onClick} />
          <ClearIcon onClick={onClose} />
        </div>
      </DialogTitle>
      <DialogContent
        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >{`${window.location.hostname}${text}`}</DialogContent>
    </Dialog>
  )
}

export default CopyDialog
