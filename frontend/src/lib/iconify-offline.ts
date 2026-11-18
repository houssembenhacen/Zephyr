// Configure Iconify to work offline with bundled icon data
import { addCollection } from '@iconify/svelte'
import iconCollections from './icons-bundle.json'

// Register all curated offline icon collections
for (const collection of iconCollections) {
  addCollection(collection as any)
}
