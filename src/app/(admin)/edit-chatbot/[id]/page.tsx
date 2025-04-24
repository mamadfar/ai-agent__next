"use client"

import { FC, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { BASE_URL } from '@/lib/graphql/apolloClient'
import { IPageParams } from '@/types/Common.type'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

const EditChatbot:FC<IPageParams<{id: string}>> = ({params: {id}}) => {

const [url, setUrl] = useState<string>("")

const handleCopyUrl = () => {
    navigator.clipboard.writeText(url)
    toast.success("Copied to clipboard")
}

useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`

    setUrl(url)
}, [id])

  return (
    <div className="px-0 md:p-10">
        <div className="md:sticky md:top-0 z-50 sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2991EE]">
            <h2 className="text-white text-sm font-bold">Link to Chat</h2>
            <p className="text-sm italic text-white">Share this link with your customers to start conversations with your chatbot.</p>
            <div className='flex items-center space-x-2'>
                <Link href={url} className='w-full cursor-pointer hover:opacity-50'>
                    <Input value={url} readOnly className='cursor-pointer bg-white'/>
                </Link>
                <Button type='submit' size='sm' className='px-3' onClick={handleCopyUrl}>
                    <span className="sr-only">Copy</span>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
  )
}

export default EditChatbot