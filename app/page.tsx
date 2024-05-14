'use client'
import Calendar from '@/lib/components/Calendar/Calendar'
import CreateDialog from '@/lib/components/CreateDialog/CreateDialog'
import CopyDialog from '@/lib/components/CopyDialog/CopyDialog'
import { useCallback, useEffect, useState } from 'react'
import Loading from '@/lib/components/Loading/Loading'
import '../styles/globals.css'
import home from '../styles/Home.module.css'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { useRouter, useSearchParams } from 'next/navigation'
import { TCalendarGetResponse } from '@/app/c/[calendarKey]/route'
import { TGetParticipant } from '@/lib/utils/db/participants'
import { TGetParticipantDate } from '@/lib/utils/db/participantDates'
import { parseCalendarInfo } from '@/lib/utils/calendar'
import UserDialog from '@/lib/components/UserDialog/UserDialog'

export type TCalendar = Omit<TCalendarGetResponse, 'startDate' | 'endDate' | 'participants'> & {
  startDate: Date
  endDate: Date
  participants: (TGetParticipant & { dates: (Omit<TGetParticipantDate, 'participantDate'> & { participantDate: Date })[] })[]
}

export type TOwnerPayload = {
  title: string
  owner: string
  startDate: string
  endDate: string
}

export type TParticipantPayload = {
  participantName: string
}

export default function Home() {
  const searchParams = useSearchParams()
  const calendarKeyParam = searchParams.get('s') || ''
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copyText, setCopyText] = useState('')
  const [shareableCopyText, setShareableCopyText] = useState('')
  const [openCopyDialog, setCopyOpenDialog] = useState(false)
  const [calendarInfo, setCalendarInfo] = useState<TCalendar>()

  const fetchCalendar = useCallback(
    (updatedCalendarKey?: string) => {
      try {
        fetch(`/c/${calendarKeyParam || updatedCalendarKey}`)
          .then((res) => {
            if (res.status === 200) {
              return res.json() as Promise<TCalendarGetResponse>
            }
            return null
          })
          .then((data) => {
            if (!data) {
              setOpenDialog(true)
            } else {
              const calendarData = parseCalendarInfo(data)
              setCalendarInfo(calendarData)
              if (!data || !data.participantId) {
                setOpenDialog(true)
              }
            }
          })
          .finally(() => {
            setLoading(false)
          })
      } catch (e) {
        console.error(e)
        enqueueSnackbar('Error fetching', { variant: 'error' })
      }
    },
    [calendarKeyParam]
  )

  useEffect(() => {
    if (loading && calendarKeyParam) {
      fetchCalendar()
    } else if (loading) {
      setLoading(false)
      setOpenDialog(true)
    }
  }, [loading, calendarKeyParam, fetchCalendar])

  const save = async (payload: TOwnerPayload | TParticipantPayload) => {
    try {
      const res = await fetch(calendarKeyParam ? `/p/${calendarKeyParam}` : '/c', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (res.status === 200) {
        const { calendarKey, shareableKey } = await res.json()
        setCopyText(calendarKey)
        setShareableCopyText(shareableKey)
        setCopyOpenDialog(true)
        setOpenDialog(false)
        fetchCalendar(calendarKey)
        router.push(`?s=${calendarKey}`)
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
        ) : calendarInfo?.calendarId && !calendarInfo?.participantId ? (
          <>
            <UserDialog open={openDialog} save={save} calendarOwner={calendarInfo?.owner} calendarTitle={calendarInfo?.title} />
            <CopyDialog open={openCopyDialog} text={copyText} shareableText={shareableCopyText} onClose={onCloseCopyDialog} />
          </>
        ) : (
          <>
            <CreateDialog open={openDialog} save={save} />
            <CopyDialog open={openCopyDialog} text={copyText} shareableText={shareableCopyText} onClose={onCloseCopyDialog} />
          </>
        )}
        {!loading && calendarInfo?.startDate && calendarInfo?.endDate && calendarInfo?.participantId ? (
          <Calendar calendar={calendarInfo} />
        ) : null}
      </SnackbarProvider>
    </main>
  )
}
