'use client'
import Calendar from '../lib/Calendar/Calendar'
import CreateDialog from '../lib/CreateDialog/CreateDialog'
import CopyDialog from '../lib/CopyDialog/CopyDialog'
import { useEffect, useState } from 'react'
import Loading from '../lib/Loading/Loading'
import '../styles/globals.css'
import home from '../styles/Home.module.css'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { parse } from 'date-fns'
import { DATE_PAYLOAD_FORMAT } from '@/lib/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import * as uuid from 'uuid'

type TCalendar = {
  startDate: Date | null
  endDate: Date | null
  owner: string | null
  selectedDates: { [key: string]: number }
  userSelectedDates: Date[]
}

export type TPayload = {
  title: string
  owner: string
  startDate: string
  endDate: string
}

export default function Home() {
  const searchParams = useSearchParams()
  const calendarId = searchParams.get('s')
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copyText, setCopyText] = useState('')
  const [openCopyDialog, setCopyOpenDialog] = useState(false)
  const [calendarInfo, setCalendarInfo] = useState<TCalendar>({
    startDate: null,
    endDate: null,
    owner: null,
    selectedDates: {},
    userSelectedDates: []
  })

  const parseCalendarInfo = (calendar: any): TCalendar => {
    return {
      startDate: parse(calendar.startDate, DATE_PAYLOAD_FORMAT, new Date()),
      endDate: parse(calendar.endDate, DATE_PAYLOAD_FORMAT, new Date()),
      owner: calendar.owner,
      selectedDates: calendar?.selectedDates,
      userSelectedDates: calendar?.userSelectedDates?.map((date: string) => parse(date, DATE_PAYLOAD_FORMAT, new Date()))
    }
  }

  useEffect(() => {
    if (loading && calendarId && uuid.validate(calendarId)) {
      try {
        fetch(`/p/${calendarId}`)
          .then((res) => {
            if (res.status === 200) {
              return res.json()
            }
            return null
          })
          .then((data) => {
            if (!data) {
              setOpenDialog(true)
            } else {
              const calendarData = parseCalendarInfo(data)
              setCalendarInfo(calendarData)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      } catch (e) {
        console.error(e)
        enqueueSnackbar('Error fetching', { variant: 'error' })
      }
    } else if (loading) {
      setLoading(false)
      setOpenDialog(true)
    }
  }, [loading, calendarId])

  const save = async (payload: TPayload) => {
    try {
      const res = await fetch('/p', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (res.status === 200) {
        const calendarId = await res.json()
        console.log(calendarId)
        setCopyText(`?s=${calendarId}`)
        setCopyOpenDialog(true)
        setCalendarInfo(
          parseCalendarInfo({
            startDate: payload.startDate,
            endDate: payload.endDate,
            owner: payload.owner,
            selectedDates: {},
            userSelectedDates: []
          })
        )

        router.push(`/${copyText}`)
      }
      setOpenDialog(false)
    } catch (e) {
      console.error(e)
      enqueueSnackbar('Error while saving', { variant: 'error' })
    }
  }

  const onCloseCopyDialog = () => {
    setCopyOpenDialog(false)
  }

  return (
    <main className={home.main}>
      <SnackbarProvider preventDuplicate>
        {loading ? (
          <Loading />
        ) : (
          <>
            <CreateDialog open={openDialog} save={save} />
            <CopyDialog open={openCopyDialog} text={copyText} onClose={onCloseCopyDialog} />
          </>
        )}
        {!loading && calendarInfo.startDate && calendarInfo.endDate ? (
          <Calendar
            startDate={calendarInfo.startDate}
            endDate={calendarInfo.endDate}
            owner={calendarInfo.owner}
            selectedDates={calendarInfo.selectedDates}
            userSelectedDates={calendarInfo.userSelectedDates}
          />
        ) : null}
      </SnackbarProvider>
    </main>
  )
}
