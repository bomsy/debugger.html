import { Component, createFactory, DOM as dom } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isEnabled } from "devtools-config";

import _CallSite from "./CallSite";
const CallSite = createFactory(_CallSite);

import {
  getSelectedSource,
  getSymbols,
  getBreakpoint,
  getSelectedLocation,
  getBreakpointsForSource
} from "../../selectors";

import { makeLocationId } from "../../utils/breakpoint";
import { getTokenLocation, breakpointAtLocation } from "../../utils/editor";

import actions from "../../actions";

let getCallSiteBreakpoint;

class CallSites extends Component {
  props: {
    symbols: Array<Symbol>,
    editor: Object,
    breakpoints: Map,
    showCallSites: boolean,
    addBreakpoint: Function,
    removeBreakpoint: Function,
    selectedSource: Object,
    selectedLocation: Object
  };

  componentDidMount() {
    const { editor } = this.props.editor;
    const codeMirrorWrapper = editor.getWrapperElement();

    codeMirrorWrapper.addEventListener("click", e => this.onTokenClick(e));
  }

  onTokenClick(e) {
    const { target } = e;
    const { editor } = this.props;

    if (
      !isEnabled("columnBreakpoints") ||
      !e.altKey ||
      (!target.classList.contains("call-site") &&
        !target.classList.contains("call-site-bp"))
    ) {
      return;
    }

    const { line, column } = getTokenLocation(editor.codeMirror, target);

    this.toggleBreakpoint(line, column);
  }

  toggleBreakpoint(line, column = undefined) {
    const {
      selectedSource,
      selectedLocation,
      breakpoints,
      addBreakpoint,
      removeBreakpoint
    } = this.props;

    const bp = breakpointAtLocation(breakpoints, { line, column });

    if ((bp && bp.loading) || !selectedLocation || !selectedSource) {
      return;
    }

    const { sourceId } = selectedLocation;

    if (bp) {
      // NOTE: it's possible the breakpoint has slid to a column
      column = column || bp.location.column;
      removeBreakpoint({
        sourceId: sourceId,
        line: line + 1,
        column
      });
    } else {
      addBreakpoint(
        {
          sourceId: sourceId,
          sourceUrl: selectedSource.get("url"),
          line: line + 1,
          column: column
        },
        // Pass in a function to get line text because the breakpoint
        // may slide and it needs to compute the value at the new
        // line.
        { getTextForLine: l => getTextForLine(this.editor.codeMirror, l) }
      );
    }
  }

  render() {
    const { editor, symbols, showCallSites } = this.props;
    const callSites = symbols.callExpressions;
    let sites;
    if (!callSites) {
      return null;
    }

    callSites = callSites.filter(
      callSite => callSite.location.start.line === callSite.location.end.line
    );

    editor.codeMirror.operation(() => {
      sites = dom.div(
        {},
        callSites.map((callSite, index) => {
          const { location } = callSite;

          return CallSite({
            key: index,
            callSite,
            editor,
            breakpoint: getCallSiteBreakpoint(location),
            showCallSite: showCallSites
          });
        })
      );
    });
    return sites;
  }
}

export default connect(
  state => {
    const selectedLocation = getSelectedLocation(state);
    const selectedSource = getSelectedSource(state);
    const sourceId = selectedLocation && selectedLocation.sourceId;
    const source = selectedSource && selectedSource.toJS();

    getCallSiteBreakpoint = location => {
      const { line, column } = location.start;

      while (column < location.end.column) {
        const breakpoint = getBreakpoint(state, {
          line,
          column,
          sourceId: source.id,
          sourceUrl: source.url
        });
        if (breakpoint) {
          return breakpoint;
        }
        column++;
      }
      return null;
    };

    return {
      selectedLocation,
      selectedSource,
      symbols: getSymbols(state, source),
      breakpoints: getBreakpointsForSource(state, sourceId || "")
    };
  },
  dispatch => bindActionCreators(actions, dispatch)
)(CallSites);
