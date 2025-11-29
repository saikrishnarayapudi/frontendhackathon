export function generateRecommendations(form, ideas) {
  const budget = Number(form?.budget || 500000)
  const type = form?.type || 'Apartment'
  const amenities = new Set(form?.amenities || [])

  let list = ideas.filter((i) => (i.costRange?.min || 0) <= budget)

  list = list.map((i) => {
    let score = 0
    
    if (['Interiors','Civil','Maintenance'].includes(i.category)) score += 3
    if (['Smart Home','Energy'].includes(i.category)) score += 2

    if (type === 'Apartment' && ['Interiors','Energy','Smart Home','Maintenance'].includes(i.category)) score += 2
    if (type === 'Independent House' && ['Civil','Energy','Maintenance','Smart Home'].includes(i.category)) score += 2
    if (type === 'Villa' && ['Interiors','Civil','Energy','Smart Home'].includes(i.category)) score += 2

    const aff = Math.max(0, 1 - ((i.costRange?.min || 0) / Math.max(1, budget)))
    score += aff * 3

    return { ...i, score: Math.round(score * 100) / 100 }
  })

  list.sort((a, b) => (b.score || 0) - (a.score || 0))
  return list
}