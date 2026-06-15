interface MaterialTextureProps {
  kind: 'grain' | 'edge' | 'fabric' | 'polish'
}

const GRADIENTS: Record<MaterialTextureProps['kind'], string> = {
  grain: 'linear-gradient(135deg, #6B3A24 0%, #8A4D2E 38%, #5C2D18 70%, #46210F 100%)',
  edge: 'linear-gradient(115deg, #241310 0%, #462314 45%, #741A14 80%, #5C140F 100%)',
  fabric: 'linear-gradient(160deg, #E8D8BC 0%, #D8C3A5 45%, #C4AC8B 100%)',
  polish: 'radial-gradient(120% 90% at 30% 20%, #C79A45 0%, #8A5A22 45%, #46210F 100%)',
}

const NOISE: Record<MaterialTextureProps['kind'], { freq: string; octaves: number; opacity: number }> = {
  grain: { freq: '0.012 0.16', octaves: 4, opacity: 0.5 },
  edge: { freq: '0.004 0.09', octaves: 3, opacity: 0.35 },
  fabric: { freq: '0.6 0.6', octaves: 2, opacity: 0.4 },
  polish: { freq: '0.02 0.012', octaves: 3, opacity: 0.22 },
}

/** Procedural material swatch: brand gradient + SVG turbulence overlay */
export default function MaterialTexture({ kind }: MaterialTextureProps) {
  const noise = NOISE[kind]
  const id = `tex-${kind}`
  return (
    <div className="absolute inset-0" style={{ background: GRADIENTS[kind] }}>
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <filter id={id}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={noise.freq}
            numOctaves={noise.octaves}
            seed={7}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#${id})`}
          opacity={noise.opacity}
          style={{ mixBlendMode: 'overlay' }}
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-deepBrown/45 via-transparent to-transparent" />
    </div>
  )
}
