import startCase from 'lodash.startcase'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import ErrorCard from '../components/ErrorCard'
import Loading from '../components/Loading'
import DisplayCard from '../components/graph/DisplayCard'
import NibrsIntro from '../components/nibrs/NibrsIntro'
import { NibrsTerm } from '../components/Terms'
import { getAgency, oriToState } from '../util/agencies'
import { getPlaceInfo } from '../util/place'
import lookupUsa from '../util/usa'
import { rangeYears } from '../util/years'

import ucrParticipation, {
  shouldFetchNibrs as shouldShowNibrs
} from '../util/participation'

class NibrsContainer extends React.Component {
  constructor(props) {
    super(props)
    const { until } = props
    this.state = { yearSelected: until, expanded: false }
  }

  getCards(data, place, categories, until) {
    let cards = []
    const content = []
    let cnt = 0

    Object.keys(categories).forEach(c => {
      const category = categories[c]
      const cls = cnt % 2 === 0 ? 'clear-left' : ''
      cnt += 1
      cards = []
      const sortedData = Object.keys(data).sort((a, b) => {
        if (data[a].title < data[b].title) {
          return -1
        }
        return 1
      })

      Object.keys(sortedData).forEach(d => {
        const obj = data[sortedData[d]]
        if (d !== 'offenseCount' && obj.category === category) {
          cards.push(
            <DisplayCard
              data={obj}
              place={place}
              year={this.state.yearSelected}
              until={until}
              showMore
            />
          )
        }
      })
      content.push(
        <div className={`col col-12 sm-col-6 mb2 px1 ${cls} `}>
          <div className="p2 sm-p3 bg-blue-white black">
            {' '}
            <h2 className="mt0 mb2 pb1 fs-18 sm-fs-22 sans-serif blue border-bottom border-blue-light">
              {' '}
              {category}
            </h2>{' '}
            {cards}
          </div>
        </div>
      )
    })

    return content
  }

  updateYear = year => {
    this.setState({ yearSelected: year })
  }

  initialNibrsYear(place, placeType, since) {
    const placeNorm = placeType === 'agency' ? oriToState(place) : place
    const participation = ucrParticipation(placeNorm)
    const initYear = participation && participation.nibrs['initial-year']

    if (initYear && initYear > since) return initYear
    return since
  }

  render() {
    const {
      agency,
      pageType,
      isAgency,
      nibrsCounts,
      participation,
      place,
      placeType,
      since,
      until,
      states
    } = this.props

    if (
      (isAgency && (!agency || agency.nibrs === false)) ||
      !shouldShowNibrs({ pageType, place, placeType }, states)
    ) {
      return null
    }

    const placeDisplay = isAgency ? agency.display : lookupUsa(place).display
    const nibrsFirstYear = this.initialNibrsYear(place, placeType, since)
    const { data, error } = nibrsCounts

    const isReady = nibrsCounts.loaded
    const isLoading = nibrsCounts.loading

    const style = { margin: '5px' }
    if (error) return <ErrorCard error={error} />
    if (isLoading) return <Loading />

    let totalCount = 0
    const yrRange = rangeYears(nibrsFirstYear, until)

    // Get Categories
    const categories = []
    Object.keys(data).forEach(d => {
      if (data[d].category) {
        if (categories.indexOf(data[d].category) === -1) {
          categories.push(data[d].category)
        }
      }
    })

    const handleSelectChange = e => this.updateYear(Number(e.target.value))
    let countDataByYear
    let titlenoun
    if (
      this.state.yearSelected !== 2 &&
      this.state.yearSelected !== 5 &&
      this.state.yearSelected !== 10
    ) {
      countDataByYear = data.offenseCount.data.filter(
        d => d.data_year === this.state.yearSelected
      )
      titlenoun = this.state.yearSelected
      if (titlenoun > until) {
        this.state.yearSelected = until
      }
    } else {
      const years = rangeYears(until - this.state.yearSelected + 1, until)
      titlenoun = `the Past ${this.state.yearSelected} Years`
      countDataByYear = data.offenseCount.data.filter(d =>
        years.includes(d.data_year)
      )
      const keys = new Set()
      for (const i in countDataByYear) {
        keys.add(countDataByYear[i].key)
      }
      const newdata = []
      for (const i in Array.from(keys)) {
        const object = new Object()
        object.key = Array.from(keys)[i]
        object.value = 0
        for (const j in countDataByYear) {
          if (countDataByYear[j].key === Array.from(keys)[i]) {
            object.value += countDataByYear[j].value
          }
        }
        newdata.push(object)
      }
      countDataByYear = newdata
    }
    if (countDataByYear.length === 0) {
      totalCount = 0
    } else {
      totalCount = countDataByYear.filter(d => d.key === 'Incident Count')[0]
        .value
    }

    return (
      <div>
        <div className="mb1 bg-white border-top border-blue border-w8">
          <div className="mb0 p2 sm-p4">
            <h2 className="mt0 mb2 fs-24 sm-fs-28 sans-serif">
              {startCase(pageType)} <NibrsTerm size="xl" /> details reported by{' '}
              {placeDisplay}
            </h2>
            {isLoading && <Loading />}
            {isReady && (
              <div className="mb3">
                <label htmlFor="year-selected" className="hide">
                  Year selected
                </label>
                <select
                  className="field field-sm select select-dark col-12"
                  id="year-selected"
                  onChange={handleSelectChange}
                  value={this.state.yearSelected}
                >
                  {yrRange.map((y, i) => <option key={i}>{y}</option>)}
                  <option value="" disabled>
                    Aggregates
                  </option>
                  <option value="2" key="2">
                    Past Two Years
                  </option>
                  <option value="5" key="5">
                    Past Five Years
                  </option>
                  <option value="10" key="10">
                    Past Ten Years
                  </option>
                </select>
              </div>
            )}
            {isReady && (
              <NibrsIntro
                crime={pageType}
                isAgency={isAgency}
                participation={participation}
                place={place}
                placeDisplay={placeDisplay}
                totalCount={totalCount}
                selectedYear={this.state.yearSelected}
                selectedYearNoun={titlenoun.toString()}
              />
            )}
          </div>
          <div className="clearfix mxn1" style={style}>
            {this.getCards(data, place, categories, until)}
          </div>
        </div>
        {isReady && (
          <div className="mb1">
            <div className="serif italic fs-12">
              Source: Reported <NibrsTerm size="sm" /> data from {placeDisplay}.
            </div>
            <div className="serif italic fs-12">Footnotes:</div>
            <div className="serif italic fs-12">
              The complexity of NIBRS data presents unique impediments to
              interconnecting all facets of the information collected. In
              instances of multiple offenders, for example, the Crime Data
              Explorer currently links an offender to only one offense—the first
              listed. The same is true for incidents involving multiple victims.
              The Uniform Crime Reporting Program is working hard to improve
              these specific functions within the Crime Data Explorer so that
              presentations in the coming months will fully encompass all
              aspects of the NIBRS data.
            </div>
          </div>
        )}
      </div>
    )
  }
}

NibrsContainer.propTypes = {
  pageType: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  nibrsCounts: PropTypes.shape({
    data: PropTypes.object,
    loading: PropTypes.bool
  }).isRequired,
  placeType: PropTypes.string.isRequired,
  since: PropTypes.number.isRequired,
  participation: PropTypes.array.isRequired,
  until: PropTypes.number.isRequired,
  states: PropTypes.object
}

const mapStateToProps = ({ agencies, filters, nibrsCounts, participation }) => {
  const { since, until } = filters
  const { place, placeType } = getPlaceInfo(filters)
  const isAgency = placeType === 'agency'
  const agency = isAgency && !agencies.loading && getAgency(agencies, place)

  let filteredParticipation = []
  if (participation.data[place]) {
    filteredParticipation = participation.data[place].filter(
      p => p.data_year >= since && p.data_year <= until
    )
  }
  return {
    ...filters,
    agency,
    isAgency,
    place,
    placeType,
    nibrsCounts,
    participation: filteredParticipation
  }
}

export default connect(mapStateToProps)(NibrsContainer)
