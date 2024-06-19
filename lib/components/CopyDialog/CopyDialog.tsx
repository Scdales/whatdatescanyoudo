'use client'

import { useSnackbar } from 'notistack'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import ClearIcon from './ClearIcon/ClearIcon'
import CopyIcon from './CopyIcon/CopyIcon'

const CopyDialog = ({
  open,
  text = '',
  shareableText = '',
  onClose
}: {
  open: boolean
  text: string
  shareableText: string
  onClose: () => void
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const onClick = async (shareable = false) => {
    console.log('shareable', shareable)
    console.log('shareabletext', shareableText)
    await navigator.clipboard.writeText(`${window.location.origin}?s=${shareable ? shareableText : text}`)
    enqueueSnackbar('Copied Link')
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
          <div>Your Calendar Link</div>
          <CopyIcon onClick={() => onClick()} />
          <ClearIcon onClick={onClose} />
        </div>
      </DialogTitle>
      <DialogContent
        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >{`${window.location.origin}?s=${text}`}</DialogContent>
      {shareableText ? (
        <>
          <DialogTitle style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
              <div>Link to share</div>
              <CopyIcon onClick={() => onClick(true)} />
            </div>
          </DialogTitle>
          <DialogContent
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >{`${window.location.origin}?s=${shareableText}`}</DialogContent>
        </>
      ) : null}
    </Dialog>
  )
}

export default CopyDialog
