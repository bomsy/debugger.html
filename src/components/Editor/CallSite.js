// @flow
import { Component } from "react";

import { markText } from "../../utils/editor";
require("./CallSite.css");

type MarkerType = {
  clear: Function
};

export default class CallSite extends Component {
  props: {
    callSite: Object,
    editor: Object,
    breakpoint: Object,
    showCallSite: Boolean
  };

  addCallSite: Function;
  marker: ?MarkerType;

  constructor() {
    super();

    this.marker = undefined;
    const self: any = this;
    self.addCallSite = this.addCallSite.bind(this);
    self.clearCallSite = this.clearCallSite.bind(this);
  }

  addCallSite(props) {
    const { editor, callSite, breakpoint } = props;
    const className = !breakpoint ? "call-site" : "call-site-bp";
    this.marker = markText(editor, className, callSite.location);
  }

  clearCallSite() {
    if (this.marker) {
      this.marker.clear();
      this.marker = null;
    }
  }

  shouldComponentUpdate(nextProps: any) {
    return this.props.editor !== nextProps.editor;
  }

  componentDidMount() {
    const { breakpoint, editor, showCallSite } = this.props;
    if (!editor) {
      return;
    }

    if (!breakpoint && !showCallSite) {
      return;
    }

    this.addCallSite(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { breakpoint, showCallSite } = this.props;

    if (nextProps.breakpoint !== breakpoint) {
      if (this.marker) {
        this.marker.clear();
      }
      this.addCallSite(nextProps);
    }
    if (nextProps.showCallSite !== showCallSite) {
      if (nextProps.showCallSite) {
        if (!this.marker) {
          this.addCallSite(nextProps);
        }
      } else {
        if (!nextProps.breakpoint) {
          this.clearCallSite();
        }
      }
      console.log(nextProps.showCallSite);
    }
  }

  componentWillUnmount() {
    if (!this.props.editor || !this.marker) {
      return;
    }
    this.marker.clear();
  }

  render() {
    return null;
  }
}

CallSite.displayName = "CallSite";
