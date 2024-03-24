'use client'

import type { FC } from 'react'

import { api } from '@/trpc/react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { CreateShortLink } from '@/types/createShortLink'

import { createShortLinkValidation } from '@/validations/createShortLink.validation'

import Modal from '@/components/Modal'
import Input from '@/components/Input'
import Button from '@/components/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const CreateShortLinkModal: FC<Props> = ({ isOpen, onClose }) => {
  const { mutate: mutateCreateShortLink } = api.shortLink.create.useMutation()
  const utils = api.useUtils()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateShortLink>({
    resolver: zodResolver(createShortLinkValidation),
  })

  const handleCreateShortLinkSubmit = handleSubmit(data => {
    mutateCreateShortLink(data, {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSuccess: async () => {
        await utils.shortLink.searchShortLinks.invalidate()
        reset({
          alias: '',
          description: '',
          originalUrl: '',
        })
        onClose()
      },
    })
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        className='flex w-80 flex-col gap-2 rounded-md border bg-gray-50 p-4 sm:w-1/2'
        onClick={event => event.stopPropagation()}
        onSubmit={handleCreateShortLinkSubmit}
      >
        <h2 className='text-center text-2xl font-semibold'>Create short URL</h2>

        <div className='flex gap-1'>
          <Input
            fullWidth
            placeholder='Original URL*'
            {...register('originalUrl')}
            error={Boolean(errors.originalUrl)}
            errorMessage={errors.originalUrl?.message}
          />
          <Input
            fullWidth
            placeholder='Alias'
            {...register('alias')}
            error={Boolean(errors.alias)}
            errorMessage={errors.alias?.message}
          />
        </div>

        <Input
          fullWidth
          placeholder='Description'
          multiline
          {...register('description')}
          error={Boolean(errors.description)}
          errorMessage={errors.description?.message}
        />

        <Button className='bg-emerald-400 hover:bg-emerald-500' type='submit'>
          Save
        </Button>
      </form>
    </Modal>
  )
}

export default CreateShortLinkModal