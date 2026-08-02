import { defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Extracto',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    },
    {
      name: 'tag',
      title: 'Categoría',
      type: 'string',
      initialValue: 'Técnico',
      validation: (rule) => rule.required(),
    },
    {
      name: 'date',
      title: 'Fecha de publicación',
      type: 'date',
      validation: (rule) => rule.required(),
    },
    {
      name: 'readTime',
      title: 'Tiempo de lectura',
      type: 'string',
      description: 'Ej: 5 min',
      initialValue: '5 min',
    },
    {
      name: 'content',
      title: 'Contenido',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required(),
    },
  ],
})
