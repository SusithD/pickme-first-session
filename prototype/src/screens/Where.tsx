import { useId, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { LinkButton } from '../components/Button'
import {
  IconChevronRight,
  IconPin,
  IconPlus,
  IconSearch,
  IconTrain,
  IconWave,
} from '../components/icons'
import { MapScreen } from '../components/MapScreen'
import { useI18n } from '../i18n/I18nContext'
import { PLACES } from '../state/mock'
import type { Place } from '../state/mock'
import { useRide, useVariant } from '../state/RideContext'
import { STEP_PATHS } from '../state/rideMachine'
import styles from './Where.module.css'

const PLACE_ICONS: Record<string, ReactNode> = {
  fort: <IconTrain size={20} />,
  'mount-lavinia': <IconWave size={20} />,
}

export default function Where() {
  const { t } = useI18n()
  const { state, dispatch } = useRide()
  const variant = useVariant()
  const [query, setQuery] = useState('')
  const [noteOpen, setNoteOpen] = useState(Boolean(state.pickupNote))
  const noteRegion = useId()

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
    <MapScreen mode="pickup">
      <h1>{t('where.title')}</h1>

      <div className={styles.group}>
        <div className={styles.pickup}>
          <span className={styles.pickupDot} aria-hidden="true" />
          <span className="footnote">{t('where.pickupLabel')}</span>
          <span className={`ellipsis ${styles.pickupName}`} title={t('where.pickup')}>
            {t('where.pickup')}
          </span>
        </div>
        <div className={styles.search}>
          <label htmlFor="where-search" className="visually-hidden">
            {t('where.searchLabel')}
          </label>
          <IconSearch size={20} className={styles.searchIcon} />
          <input
            id="where-search"
            type="search"
            className={styles.searchInput}
            autoComplete="off"
            placeholder={t('where.searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {showLocationLink ? (
        <LinkButton to={STEP_PATHS.location} variant="secondary" block>
          {t('where.locationLink')}
        </LinkButton>
      ) : null}

      {matches.length === 0 ? (
        <p className={styles.empty} role="status">
          {t('where.empty')}
        </p>
      ) : (
        <ul className={styles.places} aria-label={t('where.placesLabel')}>
          {matches.map((place) => (
            <li key={place.id}>
              <button type="button" className={styles.place} onClick={() => choose(place)}>
                <span className="icon-badge">{PLACE_ICONS[place.id] ?? <IconPin size={20} />}</span>
                <span className={styles.placeName}>{place.name}</span>
              </button>
              <span className={styles.distance}>
                {t('where.distance', { km: place.distanceKm })}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.note}>
        <button
          type="button"
          className={styles.noteToggle}
          aria-expanded={noteOpen}
          aria-controls={noteRegion}
          onClick={() => setNoteOpen((open) => !open)}
        >
          <span className="icon-badge">
            <IconPlus size={18} />
          </span>
          <span className={styles.noteLabel}>{t('where.addNote')}</span>
          <IconChevronRight
            size={18}
            className={noteOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
          />
        </button>
        {noteOpen ? (
          <div id={noteRegion} className={styles.noteField}>
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
        ) : null}
      </div>

      <p className="footnote">{t('where.helper')}</p>
    </MapScreen>
  )
}
