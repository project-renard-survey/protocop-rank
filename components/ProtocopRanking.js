'use babel';

import React from 'react';
import { ButtonGroup, Button, Glyphicon, ListGroup, ListGroupItem, PanelGroup, Panel } from 'react-bootstrap';
import ProtocopSubGraphViewer from './ProtocopSubGraphViewer';
import ProtocopSubGraphExplorer from './ProtocopSubGraphExplorer';

const shortid = require('shortid');

class ProtocopRanking extends React.Component {
  constructor(props) {
    super(props);

    this.styles = {
      buttonRow: {
        padding: 5,
      },
      mainContent: {
        height: '75vh',
        border: '1px solid #d1d1d1',
        overflow: 'hidden',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
      },
      listGroup: {
        paddingLeft: '2px',
        paddingRight: '2px',
        height: '100%',
        overflow: 'auto',
      },
      graph: {
        paddingLeft: '0',
        paddingRight: '0',
        height: '100%',
        overflow: 'auto',
      },
      explorer: {
        height: '100%',
        overflow: 'auto',
      },
    };
    this.state = {
      selectedSubGraphIndex: null,
      selectedSubGraphEdge: null,
    };

    this.updateSelectedSubGraphIndex = this.updateSelectedSubGraphIndex.bind(this);
    this.onGraphClick = this.onGraphClick.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({ selectedSubGraphIndex: 0, selectedSubGraphEdge: null });
  }

  onGraphClick(event) {
    if (event.edges.length !== 0) { // Clicked on an Edge
      this.setState({ selectedSubGraphEdge: event.edges[0] });
    } else { // Reset things since something else was clicked
      this.setState({ selectedSubGraphEdge: null });
    }
  }
  getListGroup() {
    const listEntries = this.props.ranking.map((s, ind) => {
      const isActive = ind === this.state.selectedSubGraphIndex;
      let bsStyle = 'default';
      if (isActive) {
        bsStyle = 'primary';
      }
      const scoreProp = s.score;
      let cScore = 0;
      if (!(scoreProp == null)) {
        cScore = scoreProp.rank_score.toFixed(4);
      }
      return (
        // <ListGroupItem key={shortid.generate()} onClick={() => this.updateSelectedSubGraphIndex(ind)} active={isActive}>
        <Panel
          key={shortid.generate()}
          bsStyle={bsStyle}
          header={`${ind + 1} - ${s.info.name}`}
          onClick={() => this.updateSelectedSubGraphIndex(ind)}
          style={{ cursor: 'pointer' }}
        >
          {`Score: ${cScore}`}
        </Panel>
        // </ListGroupItem>
      );
    });

    return (
      <PanelGroup key={shortid.generate()}>
        {listEntries}
      </PanelGroup>
    );
  }
  updateSelectedSubGraphIndex(ind) {
    this.setState({ selectedSubGraphIndex: ind, selectedSubGraphEdge: null });
  }
  render() {
    const noRank = this.props.ranking == null;
    const noAnswers = !noRank && this.props.ranking.length === 0;
    const graph = this.props.graph;

    // const isSummary = !(graph == null) && Object.prototype.hasOwnProperty.call(graph, 'node_count');
    const isGraph = !(graph == null) && (Object.prototype.hasOwnProperty.call(graph, 'nodes'));
    let isEmpty = false;

    let nNodes = 0;
    let nEdges = 0;
    if (isGraph) {
      isEmpty = graph.nodes.length === 0;
      nNodes = graph.nodes.length;
      nEdges = graph.edges.length;
    } else { // isSummary
      isEmpty = graph.node_count === 0;
      nNodes = graph.node_count;
      nEdges = graph.edge_count;
    }

    const isTooBig = nNodes > 200 || nEdges > 6000;

    const showNoAnswers = noAnswers;
    const showEmptyGraph = !noAnswers && isEmpty;
    const showTooBigEvalButton = !noAnswers && !isEmpty && isTooBig;
    const showEvalButton = !noAnswers && !isEmpty && noRank && !isTooBig;
    const showAnswers = !noAnswers && !isEmpty && !noRank;

    return (
      <div id="ProtocopRanking" className="col-md-12">
        { showNoAnswers &&
          <div id="ProtocopRanking_NoRank" className="col-md-12">
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <h2>{'No answers.'}</h2>
                <p>{'We couldn\'t find a path through this blackboard to answer the question.'}</p>
              </div>
            </div>
          </div>
        }
        { showEmptyGraph &&
          <div id="ProtocopRanking_NoRank" className="col-md-12">
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <h2>{'This is an empty graph.'}</h2>
                <p>{'We can\'t provide answers without any input. Try another blackboard.'}</p>
              </div>
            </div>
          </div>
        }
        {showTooBigEvalButton &&
          <div id="ProtocopRanking_NoRank" className="col-md-12">
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <h2>We still need to evaluate your blackboard.</h2>
                <p>After your blackboard is created we need to analyze it to determine and rank answers to your query.</p>
                <h3>Warning: This is a really big graph. It might be a bit too large for PROTOCOP to return answers in a timely manner.</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 col-md-offset-5" style={{ paddingTop: '10px' }}>
                <Button bsStyle="default" bsSize="sm" onClick={this.props.callbacks.blackboardRank}>
                  Get Answers
                  <br />
                  <Glyphicon glyph="random" />
                </Button>
              </div>
            </div>
          </div>
        }
        { showEvalButton &&
          <div id="ProtocopRanking_NoRank" className="col-md-12">
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <h2>We still need to evaluate your blackboard.</h2>
                <p>After your blackboard is created we need to analyze it to determine and rank answers to your query.</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 col-md-offset-5" style={{ paddingTop: '10px' }}>
                <Button bsStyle="default" bsSize="lg" onClick={this.props.callbacks.blackboardRank}>
                  Get Answers
                  <br />
                  <Glyphicon glyph="random" />
                </Button>
              </div>
            </div>
          </div>
        }
        { showAnswers &&
          <div>
            <div id="ProtocopRanking_Buttons" className="col-md-12" style={this.styles.buttonRow}>
              <h5>Potential answers have been ranked and are shown below.
                <span style={{ paddingLeft: '20px' }}>
                  <ButtonGroup>
                    <Button bsStyle="default" bsSize="sm" onClick={this.props.callbacks.blackboardRank}>
                      <Glyphicon glyph="refresh" /> Refresh Ranking
                    </Button>
                    {/* <Button bsStyle="default" bsSize="sm" onClick={() => shell.openExternal('http://127.0.0.1:7474/browser/')}>
                      <Glyphicon glyph="open-file" /> Explore in Neo4j
                    </Button> */}
                  </ButtonGroup>
                </span>
              </h5>
            </div>
            <div id="ProtocopRanking_Explorer" className="col-md-12">
              <div className="row" style={this.styles.mainContent}>
                <div className={'col-md-2'} style={this.styles.listGroup}>
                  {this.getListGroup()}
                </div>
                <div className={'col-md-3'} style={this.styles.graph}>
                  <ProtocopSubGraphViewer
                    subgraph={this.props.ranking[this.state.selectedSubGraphIndex]}
                    callbackOnGraphClick={this.onGraphClick}
                  />
                </div>
                <div className="col-md-7" style={this.styles.explorer}>
                  <ProtocopSubGraphExplorer
                    subgraphs={this.props.ranking}
                    selectedSubgraphIndex={this.state.selectedSubGraphIndex}
                    selectedEdge={this.state.selectedSubGraphEdge}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default ProtocopRanking;
