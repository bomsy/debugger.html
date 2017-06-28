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
    editor: Object
  };

  addCallSite: Function;
  marker: ?MarkerType;

  constructor() {
    super();

    this.marker = undefined;
    const self: any = this;
    self.addCallSite = this.addCallSite.bind(this);
  }

  addCallSite() {
    const { editor, callSite, breakpoint } = this.props;
    const className = breakpoint ? "call-site" : "call-site-bp";
    this.marker = markText(editor, className, callSite.location);
  }
  shouldComponentUpdate(nextProps: any) {
    return this.props.editor !== nextProps.editor;
  }

  componentDidMount() {
    if (!this.props.editor) {
      return;
    }

    this.addCallSite();
  }

  componentDidUpdate() {
    if (this.marker) {
      this.marker.clear();
    }
    this.addCallSite();
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
