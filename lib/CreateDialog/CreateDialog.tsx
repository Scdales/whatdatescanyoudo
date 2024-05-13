'use client'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DatePicker } from '@mui/x-date-pickers'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { DATE_DISPLAY_FORMAT, DATE_PAYLOAD_FORMAT } from '../constants'
import { format } from 'date-fns'
import { TPayload } from '@/app/page'

const CreateDialog = ({ open, save }: { open: boolean; save: (payload: TPayload) => void }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [name, setName] = useState('')

  const createPayload = () => {
    if (isCreateDisabled) return
    save({
      n: name,
      e: format(startDate, DATE_PAYLOAD_FORMAT),
      l: format(endDate, DATE_PAYLOAD_FORMAT)
    })
  }

  const isCreateDisabled = !startDate || !endDate || name?.length <= 0

  return (
    <Dialog open={open}>
      <DialogTitle>Create A Group</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              sx={{ my: 2 }}
              label="Owners Name"
              variant="outlined"
              value={name}
              onChange={({ target: { value } }) => setName(value)}
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
