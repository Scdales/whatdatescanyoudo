'use client'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DatePicker } from '@mui/x-date-pickers'
import { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { DATE_DISPLAY_FORMAT, DATE_PAYLOAD_FORMAT } from '../../constants'
import { format } from 'date-fns'
import { TOwnerPayload } from '@/app/page'

const CreateDialog = ({ open, save }: { open: boolean; save: (payload: TOwnerPayload) => void }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [owner, setOwner] = useState('')
  const [title, setTitle] = useState('')

  const createPayload = () => {
    if (isCreateDisabled) return
    save({
      title,
      owner,
      startDate: format(startDate, DATE_PAYLOAD_FORMAT),
      endDate: format(endDate, DATE_PAYLOAD_FORMAT)
    })
  }

  const isCreateDisabled = !startDate || !endDate || owner?.length <= 0 || title?.length <= 0

  return (
    <Dialog open={open}>
      <DialogTitle style={{ textAlign: 'center' }}>Create A Calendar</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              sx={{ my: 2 }}
              label="Calendar Owner Name"
              variant="outlined"
              value={owner}
              onChange={({ target: { value } }) => setOwner(value)}
            />
            <TextField
              sx={{ my: 2 }}
              label="Calendar Name"
              variant="outlined"
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
            />
            <DatePicker
              sx={{ my: 2 }}
              label="Earliest Date"
              maxDate={endDate || undefined}
              value={startDate}
              onChange={setStartDate}
              format={DATE_DISPLAY_FORMAT}
            />
            <DatePicker
              sx={{ my: 2 }}
              label="Latest Date"
              minDate={startDate || undefined}
              value={endDate}
              onChange={setEndDate}
              format={DATE_DISPLAY_FORMAT}
            />
          </div>
        </LocalizationProvider>
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
