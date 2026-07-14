'use server'

import { verifyRole } from '@/lib/dal'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateCoursePricing(formData: FormData) {
  await verifyRole(['ADMIN'])

  const courseId = formData.get('courseId') as string
  const isFree = formData.get('isFree') === 'true'
  const priceRaw = formData.get('price') as string

  const price = !isFree && priceRaw ? parseFloat(priceRaw) : null
  if (!isFree && (!price || price <= 0)) return { error: 'Enter a valid price.' }

  await prisma.course.update({
    where: { id: courseId },
    data: { isFree, price: price ?? null },
  })

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  revalidatePath('/')
}
