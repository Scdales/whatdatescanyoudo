'use client'
import Calendar from '@/lib/components/Calendar/Calendar'
import CreateDialog from '@/lib/components/CreateDialog/CreateDialog'
import CopyDialog from '@/lib/components/CopyDialog/CopyDialog'
import { useCallback, useEffect, useState } from 'react'
import Loading from '@/lib/components/Loading/Loading'
import '@/styles/globals.css'
import home from '@/styles/Home.module.css'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { useRouter, useSearchParams } from 'next/navigation'
import { parseCalendarInfo } from '@/lib/utils/fe/calendar'
import UserDialog from '@/lib/components/UserDialog/UserDialog'
import { TCalendar, TCalendarGetResponse, TOwnerPayload, TParticipantPayload } from '@/lib/types/calendar'

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
        fetch(`/c/${updatedCalendarKey || calendarKeyParam}`)
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
        router.replace(`?s=${calendarKey}`)
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
      <SnackbarProvider preventDuplicate anchorOrigin={{ horizontal: 'center', vertical: 'top' }} >
        {loading ? (
          <Loading />
        ) : calendarInfo?.id && !calendarInfo?.participantId ? (
          <>
            <UserDialog open={openDialog} save={save} calendarOwner={calendarInfo?.ownerName} calendarTitle={calendarInfo?.title} />
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
