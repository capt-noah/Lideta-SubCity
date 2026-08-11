// Vite glob import — eager so we can return URLs synchronously
// `query: '?url', import: 'default'` replaces the deprecated `as: 'url'`
const logos = import.meta.glob(
  '../../data/logos/*.{png,jpg,jpeg,svg,webp}',
  { eager: true, query: '?url', import: 'default' }
)

const heads = import.meta.glob(
  '../../data/department heads/*.{png,jpg,jpeg,svg,webp}',
  { eager: true, query: '?url', import: 'default' }
)

/**
 * Find an image by department ID regardless of file extension.
 * e.g. "../../data/logos/d-001.png" → matches id "d-001"
 */
const findImageById = (id, collection) => {
  if (!id) return null
  for (const path in collection) {
    const filename = path.split('/').pop().split('.')[0]
    if (filename === id) return collection[path]
  }
  return null
}

export const getDepartmentLogo = (id) => findImageById(id, logos)
export const getDepartmentHead = (id) => findImageById(id, heads)
