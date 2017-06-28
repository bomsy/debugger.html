import { Component, createFactory, DOM as dom } from "react";
import _CallSite from "./CallSite";
const CallSite = createFactory(_CallSite);

function findBreakpoints() {}

import { makeLocationId } from "../../utils/breakpoint";

export default class CallSites extends Component {
  props: {
    callSites: Array<Symbol>,
    editor: Object
  };

  render() {
    const { callSites, editor, breakpoints } = this.props;
    // console.log(callSites, breakpoints);
    if (!callSites) {
      return null;
    }
    callSites = callSites.filter(
      callSite => callSite.location.start.line === callSite.location.end.line
    );

    return dom.div(
      {},
      callSites.map((callSite, index) =>
        CallSite({
          key: index,
          callSite,
          editor,
          breakpoint: {}
        })
      )
    );
  }
}
