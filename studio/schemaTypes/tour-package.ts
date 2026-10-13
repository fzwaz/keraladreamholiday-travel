import {defineArrayMember, defineField, defineType} from 'sanity'
import {PackageIcon} from '@sanity/icons/Package'

export const tourPackage = defineType({
  name: 'tourPackage',
  title: 'Tour Package',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'destinations',
      title: 'Destinations',
      description: 'Pick saved destinations. These drive the package filter and homepage strip.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'destination'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'customDestinations',
      title: 'Custom destinations',
      description: 'Free text — only for places with no saved destination. One per row.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'place',
      title: 'Place label',
      description: 'Display string, e.g. “Munnar · Thekkady · Alleppey”.',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      description: 'E.g. “5D / 4N”.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (INR)',
      description: 'Current price as a number, e.g. 17599.',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original price (INR)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'discountLabel',
      description: 'E.g. “12% OFF”.',
      type: 'string',
    }),
    defineField({
      name: 'group',
      title: 'Package group',
      description: 'Powers the category chips on the packages page and the badge on the card.',
      type: 'string',
      options: {
        list: [
          {title: 'Kerala (all)', value: 'kerala'},
          {title: 'Munnar', value: 'munnar'},
          {title: 'Alleppey', value: 'alleppey'},
          {title: 'Thekkady', value: 'thekkady'},
          {title: 'Wayanad', value: 'wayanad'},
          {title: 'Kovalam', value: 'kovalam'},
          {title: 'Honeymoon', value: 'honeymoon'},
          {title: 'Group Packages', value: 'group'},
          {title: 'School & College Packages', value: 'school-college'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'kerala',
    }),
    defineField({
      name: 'inclusions',
      title: 'Inclusions',
      description: 'E.g. Hotel, Houseboat, Tour Guide.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'place', media: 'mainImage'},
  },
})
