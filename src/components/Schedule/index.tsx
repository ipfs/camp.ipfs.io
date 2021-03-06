import React from 'react'
import { Router, Link, navigate } from '@components/Router'
import { RouteComponentProps } from '@reach/router'
import { convert } from '@components/System/hrmr'

import { Heading } from '@components/System'
import { Modal } from '@components/Modal'
import { Head } from '@components/Meta'

import {
  ScheduleData,
  SessionItemData,
  Day as TDay,
} from '../../types/schedule'

type DayProps = {
  day: TDay
}

const Day: React.FC<DayProps> = ({ day }) => (
  <div className="mb4">
    <div className="dt">
      <div className="dt-row" style={{ position: 'sticky' }}>
        <h2>{day.title}</h2>
        {day.desc && <h4>{day.desc}</h4>}
      </div>
    </div>
    <div className="dt" style={{ borderSpacing: '0 10px' }}>
      <div className="dt-row">
        <div className="dtc pr4 b">Time</div>
        <div className="dtc b ph3">Session</div>
      </div>

      {day.events.map((event, i) => (
        <div key={i} className="dt-row pt2 pb2">
          <div className="dtc nowrap bb primary9 pv3 b--neutral5">
            {event.startTime} {event.endTime && ` - ${event.endTime}`}
          </div>
          <div
            className={`dtc ph3 pv3 bb b--neutral4 f4-ns w-100 ${
              event.type && event.type === 'break' ? 'neutral3' : 'dark3'
            }`}
          >
            {event.sessionId ? (
              <Link to={`/schedule/session/${event.sessionId}`}>
                {event.title}
              </Link>
            ) : (
              event.title
            )}
            {event.locationId && (
              <div className="f5">
                <span className="mr2">📍location:</span>
                <Link to={`/schedule/location/${event.locationId}`}>
                  {event.locationId}
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)

type ScheduleProps = SessionItemData & {
  schedule: ScheduleData
  title: string
  contents: string
  meta: {
    title: string
  }
}

type FormatProps = {
  formats: ScheduleData['formats']
  title?: string
}

export const Formats: React.FC<FormatProps> = ({
  formats,
  title = 'Session Formats',
}) => (
  <>
    {title && <Heading>{title}</Heading>}
    <div className="nested-list-reset">
      <ul>
        {formats.map(format => (
          <li key={format.id}>
            <Link
              to={`schedule/format/${format.id}`}
              title={format.title}
              className="dib pv1"
            >
              {format.legend} {format.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </>
)

type ScheduleModalProps = RouteComponentProps & ScheduleProps

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  location,
  meta,
  contents,
  locations,
  venues,
  events,
}) => {
  const shouldOpenModal = (locationPath: string) => {
    return /format|session|location/.test(locationPath)
  }

  return (
    <>
      {meta && <Head>{meta.title && <title>{meta.title}</title>}</Head>}
      <Modal
        overlayClassName={{
          base:
            'overlay-base pa4 bl-ns b--light-silver flex items-center justify-center',
          afterOpen: 'overlay-base_after-open',
          beforeClose: 'overlay-base_before-close',
        }}
        className={{
          base: 'modal-base pa3 pa4-ns bg-white br3 ba b--neutral1 outline-0',
          afterOpen: 'modal-base_after-open',
          beforeClose: 'modal-base_before-close',
        }}
        isOpen={shouldOpenModal(location.pathname)}
        onRequestClose={() => navigate('/schedule')}
      >
        <div className="lh-copy mw7 nested-links">
          {contents && convert(contents)}
        </div>

        {locations && locations.length > 0 && (
          <div>
            {locations.map(
              location =>
                location && (
                  <div key={location.id} className="f6">
                    📍location:{' '}
                    <Link to={`schedule/location/${location.id}`}>
                      {location.title}
                    </Link>
                  </div>
                ),
            )}
            {/* {JSON.stringify(locations)} */}
          </div>
        )}
        {events && (
          <div>{/* <h1>Events</h1>
            {JSON.stringify(events)} */}</div>
        )}
        {venues && (
          <div>
            <h3>Venue</h3>
            {venues.map(
              venue => venue && <div key={venue.id}>{venue.title}</div>,
            )}
            {/* {JSON.stringify(venues)} */}
          </div>
        )}
      </Modal>
    </>
  )
}

export const Schedule: React.FC<ScheduleProps> = ({ schedule, ...rest }) => (
  <div>
    {schedule.schedule.map(day => (
      <Day key={day.date} day={day} />
    ))}
    <Formats formats={schedule.formats} />
    <Router primary={false}>
      <ScheduleModal path="schedule/*" schedule={schedule} {...rest} />
    </Router>
  </div>
)
