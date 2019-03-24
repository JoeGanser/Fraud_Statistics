import React from 'react'
import PropTypes from 'prop-types'

import downloadDetails from '../../../content/downloadDetails.yml'
import markdown from '../../util/md'
import DownloadFilesTable from './DownloadFilesTable'

class DownloadDetailsAccordionBody extends React.Component {
  render() {
    const { title } = this.props
    const details = downloadDetails.find(e => e.title === title)
    if (!details) return <div>TBD</div>
    return (
      <div className="clearfix">
        <h3 className="mt-tiny mb2 fs-16 sm-fs-18">Download Details</h3>
        <div>
          <div className="md-col md-col-9 md-pr2 fs-14 sm-fs-16 serif">
            <div
              dangerouslySetInnerHTML={{
                __html: markdown.render(details.description)
              }}
            />
          </div>
          <div className="md-col md-col-3">
            <h3 className="mt-tiny mb2 fs-16 sm-fs-18">Resources</h3>
            <ul className="m0 p0 fs-14 sm-fs-16 left-bars">
              <li className="mb2">
                <a href="https://github.com/fbi-cde/crime-data-frontend/blob/master/README.md">
                  Read me{' '}
                </a>
                <img
                  className="mr1 align-middle"
                  width="20"
                  src="/img/github.svg"
                  alt="github"
                />
              </li>
            </ul>
          </div>
        </div>

        <div
          id="table"
          className="md-col md-col-12 md-pr2 fs-16 sm-fs-18 serif"
        >
          <div className="md-col md-col-12 border-bottom border-blue-light" />
          <div className="md-col md-col-2">
            <h3 className="mt-tiny mb0 fs-14 sm-fs-18">Data Type</h3>
            <div>{details.data_type}</div>
            <h3 className="mt-tiny mb0 fs-14 sm-fs-18">Years</h3>
            <div>{details.year_range}</div>
            <h3 className="mt-tiny mb0 fs-14 sm-fs-18">Last Modified</h3>
            <div>{details.last_modified}</div>
            <h3 className="mt-tiny mb0 fs-14 sm-fs-18">File Type</h3>
            <div>{details.download_type}</div>
            <h3 className="mt-tiny mb0 fs-14 sm-fs-18">File Size</h3>
            <div>{details.file_size}</div>
            <br />
          </div>
          <DownloadFilesTable
            files={details.files}
            link={details.href}
            title={details.title}
            fileType={details.download_type}
            sampleFile={details.sampleFile}
          />
        </div>
      </div>
    )
  }
}

DownloadDetailsAccordionBody.propTypes = {
  title: PropTypes.string.isRequired
}

export default DownloadDetailsAccordionBody
