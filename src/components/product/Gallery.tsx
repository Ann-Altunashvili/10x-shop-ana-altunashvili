import { useState } from 'react'

interface GalleryProps {
  images: string[]
  title: string
}

/** Main photo + thumbnails. Clicking a thumbnail swaps the main photo (local state only). */
export default function Gallery({ images, title }: GalleryProps) {
  const [selected, setSelected] = useState(0)
  const current = images[selected] ?? images[0]

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-sunken">
        {current && (
          <img
            src={current}
            alt={`${title}, photo ${selected + 1} of ${images.length}`}
            width={640}
            height={640}
            className="size-full object-contain p-4"
          />
        )}
      </div>

      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={index === selected}
                className={`size-16 overflow-hidden rounded-lg border-2 bg-sunken transition-colors hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  index === selected ? 'border-brand' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  className="size-full object-contain p-1"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
