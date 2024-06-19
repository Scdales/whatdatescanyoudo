'use client'

import { useState } from 'react'

import type { TParticipantPayload } from '@/lib/types/calendar'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

const CreateDialog = ({
  open,
  save,
  calendarTitle,
  calendarOwner
}: {
  open: boolean
  save: (payload: TParticipantPayload) => void
  calendarTitle?: string
  calendarOwner?: string
}) => {
  const [participantName, setParticipantName] = useState('')

  const createPayload = () => {
    if (isCreateDisabled) return
    save({
      participantName
    })
  }

  const isCreateDisabled = participantName?.length <= 0

  return (
    <Dialog open={open}>
      <DialogTitle style={{ textAlign: 'center' }}>{calendarOwner}&apos;s Calendar</DialogTitle>
      <DialogTitle style={{ textAlign: 'center' }}>{calendarTitle}</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            sx={{ my: 2 }}
            label="Enter your name"
            variant="outlined"
            value={participantName}
            onChange={({ target: { value } }) => setParticipantName(value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button disabled={isCreateDisabled} onClick={createPayload} sx={{ mx: 'auto' }}>
          CREATE
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateDialog
