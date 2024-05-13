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
import { useRouter } from 'next/navigation'

export default function Home({ searchParams }) {
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copyText, setCopyText] = useState('')
  const [openCopyDialog, setCopyOpenDialog] = useState(false)
  const [calendarInfo, setCalendarInfo] = useState({
    startDate: null,
    endDate: null,
    owner: null,
    selectedDates: {},
    userSelectedDates: []
  })

  const getCalendarInfo = (calendar) => {
    return {
      startDate: parse(calendar.startDate, DATE_PAYLOAD_FORMAT, new Date()),
      endDate: parse(calendar.endDate, DATE_PAYLOAD_FORMAT, new Date()),
      owner: calendar.owner,
      selectedDates: calendar.selectedDates,
      userSelectedDates: calendar.userSelectedDates.map((date) => parse(date, DATE_PAYLOAD_FORMAT, new Date()))
    }
  }

  useEffect(() => {
    if (loading) {
      try {
        fetch(`/p${searchParams?.s ? `?s=${searchParams.s}` : ''}`)
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
              setCalendarInfo(getCalendarInfo(data))
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
  }, [loading, searchParams?.s])

  const save = async (payload) => {
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
