import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name'},
  },
})
