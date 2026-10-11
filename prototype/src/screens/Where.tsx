import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { LinkButton } from '../components/Button'
import { useI18n } from '../i18n/I18nContext'
import { PLACES } from '../state/mock'
import type { Place } from '../state/mock'
import { useRide, useVariant } from '../state/RideContext'
import { STEP_PATHS } from '../state/rideMachine'
import styles from './Where.module.css'

export default function Where() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const variant = useVariant()
  const [query, setQuery] = useState('')

  const needle = query.trim().toLowerCase()
  const matches = needle
    ? PLACES.filter((place) => place.name.toLowerCase().includes(needle))
    : PLACES

  function choose(place: Place) {
    dispatch({ type: 'SET_DESTINATION', place })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return
    event.preventDefault()
    const first = matches[0]
    if (first) choose(first)
  }

  const showLocationLink = variant === 'treatment' && state.permissions.location === 'unset'

  return (
    <section className={styles.screen}>
      <h1>{t('where.title')}</h1>

      <div className={styles.pickup}>
        <span className={styles.pickupLabel}>{t('where.pickupLabel')}</span>
        <span>{t('where.pickup')}</span>
      </div>

      <div>
        <label htmlFor="where-note" className="field-label">
          {t('where.noteLabel')}
        </label>
        <input
          id="where-note"
          type="text"
          className="form-input"
          autoComplete="off"
          maxLength={120}
          value={state.pickupNote ?? ''}
          onChange={(event) => dispatch({ type: 'SET_PICKUP_NOTE', note: event.target.value })}
        />
      </div>

      {showLocationLink ? (
        <LinkButton to={STEP_PATHS.location} variant="secondary" block>
          {t('where.locationLink')}
        </LinkButton>
      ) : null}

      <div>
        <label htmlFor="where-search" className="field-label">
          {t('where.searchLabel')}
        </label>
        <input
          id="where-search"
          type="search"
          className="form-input"
          autoComplete="off"
          placeholder={t('where.searchPlaceholder')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {matches.length === 0 ? (
        <p className={styles.empty} role="status">
          {t('where.empty')}
        </p>
      ) : (
        <ul className={styles.places} aria-label={t('where.placesLabel')}>
          {matches.map((place) => (
            <li key={place.id}>
              <button type="button" className={styles.place} onClick={() => choose(place)}>
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="muted">{t('where.helper')}</p>
    </section>
  )
}
