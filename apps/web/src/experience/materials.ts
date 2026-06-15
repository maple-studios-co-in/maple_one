import * as THREE from 'three'

/** Shared materials, brand palette */
export const wood = new THREE.MeshStandardMaterial({
  color: '#6B3A24',
  roughness: 0.42,
  metalness: 0.05,
})

export const woodDark = new THREE.MeshStandardMaterial({
  color: '#462314',
  roughness: 0.5,
  metalness: 0.04,
})

export const woodMaple = new THREE.MeshStandardMaterial({
  color: '#741A14',
  roughness: 0.46,
  metalness: 0.06,
})

export const fabricSand = new THREE.MeshStandardMaterial({
  color: '#D8C3A5',
  roughness: 0.96,
  metalness: 0,
})

export const fabricIvory = new THREE.MeshStandardMaterial({
  color: '#F3E8D5',
  roughness: 0.95,
  metalness: 0,
})

export const brass = new THREE.MeshStandardMaterial({
  color: '#C79A45',
  roughness: 0.35,
  metalness: 0.85,
})

/** Pale sage leather — the upholstery on the original A-frame chair */
export const sageLeather = new THREE.MeshStandardMaterial({
  color: '#C5D1C4',
  roughness: 0.48,
  metalness: 0,
})

/** Rough, unfinished timber — the "before" state in the build sequence */
export const rawTimber = new THREE.MeshStandardMaterial({
  color: '#9A6B3F',
  roughness: 0.93,
  metalness: 0,
})
