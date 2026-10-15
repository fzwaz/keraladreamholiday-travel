import {defineArrayMember, defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'anonymous',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'location',
      description: 'E.g. Kumarakom, Munnar.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateLabel',
      description: 'E.g. “March 2026”.',
      type: 'string',
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      description: 'Only approved reviews appear on the website. Tick to publish.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'photos',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'location', media: 'photos.0'},
  },
})
