import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import title from 'metabase/hoc/Title'

import { fetchSegmentComparison } from 'metabase/xray/xray'
import {
    getComparison,
    getComparisonFields,
    getComparisonContributors,
    getSegmentItem,
    getTitle,
    getLoadingStatus
} from 'metabase/xray/selectors'

import LoadingAndErrorWrapper from 'metabase/components/LoadingAndErrorWrapper'
import XRayComparison from 'metabase/xray/components/XRayComparison'
import LoadingAnimation from 'metabase/xray/components/LoadingAnimation'

import { hasComparison, loadingMessages } from 'metabase/xray/utils'

const mapStateToProps = (state) => ({
    comparison: getComparison(state),
    fields: getComparisonFields(state),
    contributors: getComparisonContributors(state),
    itemA: getSegmentItem(state, 0),
    itemB: getSegmentItem(state, 1),
    isLoading: getLoadingStatus(state)
})

const mapDispatchToProps = {
    fetchSegmentComparison
}

@connect(mapStateToProps, mapDispatchToProps)
@title(props => getTitle(props))
class SegmentComparison extends Component {

    state = {
        error: null
    }

    async componentWillMount () {
        const { cost, segmentId1, segmentId2 } = this.props.params
        try {
            await this.props.fetchSegmentComparison(segmentId1, segmentId2, cost)
        } catch (error) {
            console.log('error', error)
            this.setState({ error })
        }
    }

    render () {
        const {
            contributors,
            params,
            comparison,
            fields,
            itemA,
            itemB,
            isLoading
        } = this.props

        const { error } = this.state

        return (
            <LoadingAndErrorWrapper
                loading={isLoading || !hasComparison(comparison)}
                error={error}
                noBackground
                loadingMessages={loadingMessages}
                loadingScenes={[<LoadingAnimation />]}
            >
                { () =>

                    <XRayComparison
                        cost={params.cost}
                        fields={_.sortBy(fields, 'distance').reverse()}
                        comparisonFields={[
                            'Difference',
                            'Entropy',
                            'Histogram',
                            'Nil%',
                        ]}
                        contributors={contributors}
                        comparison={comparison.comparison}
                        itemA={itemA}
                        itemB={itemB}
                    />
                }
            </LoadingAndErrorWrapper>
        )
    }
}

export default SegmentComparison
