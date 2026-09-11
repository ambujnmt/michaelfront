// Property text fields are stored bilingually: a German base column (`title`,
// `location`, `description`, `location_details`, `features`, `information`) plus
// an English companion column with an `_en` suffix.
//
// `localizeProperty` returns a shallow copy where those base fields hold the
// value for the requested language. English falls back to German whenever the
// `_en` value is empty, so the site never shows a blank field. German (or any
// non-'en' lang) returns the row untouched. Numeric/neutral fields (price,
// size, rooms, slug, …) are never translated.

const TRANSLATABLE = ['title', 'location', 'description', 'location_details', 'features', 'information']

const hasText = (v) => !!v && String(v).replace(/<[^>]*>/g, '').trim().length > 0

export function localizeProperty(p, lang) {
  if (!p || lang !== 'en') return p
  const out = { ...p }
  for (const key of TRANSLATABLE) {
    const en = p[`${key}_en`]
    out[key] = hasText(en) ? en : p[key]
  }
  return out
}

export function localizeProperties(list, lang) {
  if (!Array.isArray(list) || lang !== 'en') return list
  return list.map((p) => localizeProperty(p, lang))
}
