import { Component, ComponentChildren, JSX } from 'preact';

const STYLE_INNER =
  'position:relative; overflow:hidden; width:100%; min-height:100%;';

const STYLE_CONTENT =
  'position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;';

interface VirtualListProps<T> extends JSX.HTMLAttributes<HTMLDivElement> {
  data: T[];
  renderRow: (item: T, index: number) => ComponentChildren;
  rowHeight: number;
  overscanCount?: number;
  sync?: boolean;
}

interface VirtualListState {
  height: number;
  offset: number;
}

export default class VirtualList<T> extends Component<
  VirtualListProps<T>,
  VirtualListState
> {
  state: VirtualListState = {
    height: 0,
    offset: 0,
  };

  resize = () => {
    const height = (this.base as any)?.offsetHeight || 0;
    if (this.state.height !== height) {
      this.setState({ height });
    }
  };

  handleScroll = () => {
    const offset = (this.base as any)?.scrollTop || 0;
    this.setState({ offset });
    if (this.props.sync) this.forceUpdate();
  };

  componentDidMount() {
    this.resize();
    addEventListener('resize', this.resize);
  }

  componentDidUpdate() {
    this.resize();
  }

  componentWillUnmount() {
    removeEventListener('resize', this.resize);
  }

  render(
    {
      data,
      rowHeight,
      renderRow,
      overscanCount = 10,
      sync,
      ...props
    }: VirtualListProps<T>,
    { offset, height }: VirtualListState,
  ) {
    const start = Math.max(
      0,
      ((offset / rowHeight) | 0) - (((offset / rowHeight) | 0) % overscanCount),
    );
    const visibleRowCount = ((height / rowHeight) | 0) + overscanCount;
    const end = start + 1 + visibleRowCount;
    const selection = data.slice(start, end);

    return (
      <div onScroll={this.handleScroll} {...props}>
        <div style={`${STYLE_INNER} height:${data.length * rowHeight}px;`}>
          <div style={`${STYLE_CONTENT} top:${start * rowHeight}px;`}>
            {selection.map(renderRow)}
          </div>
        </div>
      </div>
    );
  }
}
