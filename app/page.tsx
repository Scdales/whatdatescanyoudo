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

type TCalendar = {
  startDate: Date | null
  endDate: Date | null
  owner: string | null
  selectedDates: { [key: string]: number }
  userSelectedDates: Date[]
}

export type TPayload = {
  n: string
  e: string
  l: string
}

export default function Home() {
  const searchParams = useSearchParams()
  const s = searchParams.get('s')
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

  const getCalendarInfo = (calendar: any): TCalendar => {
    return {
      startDate: parse(calendar.startDate, DATE_PAYLOAD_FORMAT, new Date()),
      endDate: parse(calendar.endDate, DATE_PAYLOAD_FORMAT, new Date()),
      owner: calendar.owner,
      selectedDates: calendar.selectedDates,
      userSelectedDates: calendar.userSelectedDates.map((date: string) => parse(date, DATE_PAYLOAD_FORMAT, new Date()))
    }
  }

  useEffect(() => {
    if (loading) {
      try {
        fetch(`/p${s ? `?s=${s}` : ''}`)
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
              const calendarData = getCalendarInfo(data)
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
    }
  }, [loading, s])

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
        const data = await res.json()
        console.log(data)
        setCopyText(`?s=${data.url}`)
        setCopyOpenDialog(true)
        setCalendarInfo(
          getCalendarInfo({
            startDate: data.startDate,
            endDate: data.endDate,
            owner: data.owner,
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
